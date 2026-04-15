import type { IExecuteFunctions, IDataObject, JsonObject } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_UNAUTHORIZED_RETRIES = 1;
const MAX_RATE_LIMIT_RETRIES = 3;
const BASE_BACKOFF_MS = 1000;
const MAX_BACKOFF_MS = 10_000;
const PAGE_SIZE_MIN = 1;
const PAGE_SIZE_MAX = 500;

// ── Types ─────────────────────────────────────────────────────────────────────

interface ApiResponse {
  statusCode: number;
  body: IDataObject;
  headers: IDataObject;
}

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

// ── Helpers ───────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function calculateBackoffDelay(attemptNumber: number): number {
  const exponentialDelay = BASE_BACKOFF_MS * Math.pow(2, attemptNumber);
  return Math.min(exponentialDelay, MAX_BACKOFF_MS);
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function extractItemsFromResponse(responseBody: IDataObject): IDataObject[] {
  if (Array.isArray(responseBody)) {
    return responseBody as IDataObject[];
  }
  if (Array.isArray(responseBody.items)) {
    return responseBody.items as IDataObject[];
  }
  if (Array.isArray(responseBody.data)) {
    return responseBody.data as IDataObject[];
  }
  return [];
}

function buildErrorMessage(statusCode: number, endpoint: string): string {
  const statusMessages: Record<number, string> = {
    400: 'Bad request — check your input parameters',
    401: 'Authentication failed — check your credentials',
    403: 'Forbidden — insufficient permissions',
    404: `Resource not found at ${endpoint}`,
    409: 'Conflict — resource already exists',
    429: 'Rate limit exceeded — too many requests',
    500: 'Abacus server error — try again later',
  };
  return statusMessages[statusCode] ?? `Unexpected error (HTTP ${statusCode})`;
}

// ── Core API Request ──────────────────────────────────────────────────────────

/**
 * Makes a single authenticated HTTP request to the Abacus API.
 * Handles 401 token refresh and 429 rate-limit backoff automatically.
 */
export async function apiRequest(
  context: IExecuteFunctions,
  method: HttpMethod,
  endpoint: string,
  body: IDataObject = {},
  queryParams: IDataObject = {},
  unauthorizedRetryCount = 0,
  rateLimitRetryCount = 0,
): Promise<IDataObject> {
  const credentials = await context.getCredentials('abacusApi');
  const instanceUrl = (credentials.instanceUrl as string).replace(/\/$/, '');
  const fullUrl = `${instanceUrl}${endpoint}`;

  const requestOptions = {
    method,
    url: fullUrl,
    qs: queryParams,
    body,
    json: true,
    ignoreHttpStatusErrors: true,
    returnFullResponse: true,
    skipSslCertificateValidation: credentials.ignoreSSLIssues as boolean,
  };

  const response = (await context.helpers.httpRequestWithAuthentication.call(
    context,
    'abacusApi',
    requestOptions,
  )) as ApiResponse;

  const { statusCode, body: responseBody } = response;

  // ── 401: Refresh token and retry once ──────────────────────────────────────
  if (statusCode === 401 && unauthorizedRetryCount < MAX_UNAUTHORIZED_RETRIES) {
    await context.helpers.refreshOAuth2Token.call(context, 'abacusApi');
    return apiRequest(context, method, endpoint, body, queryParams, unauthorizedRetryCount + 1, rateLimitRetryCount);
  }

  // ── 429: Rate limit — backoff and retry ────────────────────────────────────
  if (statusCode === 429 && rateLimitRetryCount < MAX_RATE_LIMIT_RETRIES) {
    const retryAfterHeader = response.headers['retry-after'];
    const retryAfterSeconds = retryAfterHeader ? parseInt(retryAfterHeader as string, 10) * 1000 : 0;
    const backoffDelay = retryAfterSeconds || calculateBackoffDelay(rateLimitRetryCount);

    await sleep(backoffDelay);
    return apiRequest(context, method, endpoint, body, queryParams, unauthorizedRetryCount, rateLimitRetryCount + 1);
  }

  // ── 4xx / 5xx: Throw structured error ─────────────────────────────────────
  if (statusCode >= 400) {
    throw new NodeApiError(context.getNode(), responseBody as unknown as JsonObject, {
      message: buildErrorMessage(statusCode, endpoint),
      description: `Endpoint: ${endpoint} | Status: ${statusCode} | Auth retries: ${unauthorizedRetryCount} | Rate limit retries: ${rateLimitRetryCount}`,
      httpCode: String(statusCode),
    });
  }

  return responseBody as IDataObject;
}

// ── Paginated Request ─────────────────────────────────────────────────────────

/**
 * Fetches all items from a paginated Abacus endpoint.
 * Automatically handles limit/offset pagination until all items are collected.
 */
export async function apiRequestAllItems(
  context: IExecuteFunctions,
  method: HttpMethod,
  endpoint: string,
  requestedLimit: number,
  queryParams: IDataObject = {},
): Promise<IDataObject[]> {
  const pageSize = clamp(requestedLimit, PAGE_SIZE_MIN, PAGE_SIZE_MAX);
  const collectedItems: IDataObject[] = [];
  let currentOffset = 0;

  while (true) {
    const paginatedParams: IDataObject = {
      ...queryParams,
      limit: pageSize,
      offset: currentOffset,
    };

    const responseBody = await apiRequest(context, method, endpoint, {}, paginatedParams);
    const pageItems = extractItemsFromResponse(responseBody);

    collectedItems.push(...pageItems);

    const hasReachedRequestedLimit = collectedItems.length >= requestedLimit;
    const isLastPage = pageItems.length < pageSize;

    if (isLastPage || hasReachedRequestedLimit) {
      break;
    }

    currentOffset += pageSize;
  }

  return collectedItems.slice(0, requestedLimit);
}

// ── Utility ───────────────────────────────────────────────────────────────────

/**
 * Flattens a nested object for easier use in n8n expressions.
 * Example: { address: { city: "Zurich" } } → { "address.city": "Zurich" }
 */
export function flattenObject(
  inputObject: IDataObject,
  parentKey = '',
  result: IDataObject = {},
): IDataObject {
  for (const [key, value] of Object.entries(inputObject)) {
    const flatKey = parentKey ? `${parentKey}.${key}` : key;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      flattenObject(value as IDataObject, flatKey, result);
    } else {
      result[flatKey] = value;
    }
  }
  return result;
}

/**
 * Normalizes an API response object:
 * - Converts all ID fields to strings (n8n expects string IDs)
 * - Converts Date objects and ISO-like strings to ISO 8601 format
 */
export function normalizeResponseData(data: IDataObject): IDataObject {
  const normalized: IDataObject = {};

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      normalized[key] = value;
      continue;
    }

    // Ensure ID fields are always strings
    if (key === 'id' || key.endsWith('Id')) {
      normalized[key] = String(value);
      continue;
    }

    // Normalize date strings to ISO 8601
    if (typeof value === 'string' && isDateLikeString(value)) {
      const parsed = new Date(value);
      normalized[key] = isNaN(parsed.getTime()) ? value : parsed.toISOString();
      continue;
    }

    // Recurse into nested objects
    if (typeof value === 'object' && !Array.isArray(value)) {
      normalized[key] = normalizeResponseData(value as IDataObject);
      continue;
    }

    // Recurse into arrays
    if (Array.isArray(value)) {
      normalized[key] = value.map((item) =>
        typeof item === 'object' && item !== null
          ? normalizeResponseData(item as IDataObject)
          : item,
      );
      continue;
    }

    normalized[key] = value;
  }

  return normalized;
}

function isDateLikeString(value: string): boolean {
  // Matches ISO 8601 and common date formats
  return /^\d{4}-\d{2}-\d{2}(T|\s)/.test(value);
}
