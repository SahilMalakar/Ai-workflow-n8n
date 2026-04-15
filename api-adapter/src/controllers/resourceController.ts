import { Request, Response, NextFunction } from "express";
import { getAccessToken, callAbacusAPI } from "../services/apiService";
import {
  createValidationError,
  validateRequiredFields,
  
} from "../utils/validation";
import { createNotFoundError } from "../utils/errors";
import { normalizeResponse } from "../utils/normalizeResponse";

const buildQueryString = (
  query: Record<string, string | number | boolean | undefined>,
) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      params.append(key, String(value));
    }
  });
  return params.toString() ? `?${params.toString()}` : "";
};

const extractItems = (rawResponse: unknown): unknown[] => {
  if (Array.isArray(rawResponse)) {
    return rawResponse;
  }

  if (rawResponse && typeof rawResponse === "object") {
    const responseObject = rawResponse as Record<string, unknown>;
    for (const key of ["items", "data", "results", "rows"]) {
      const candidate = responseObject[key];
      if (Array.isArray(candidate)) {
        return candidate;
      }
    }
  }

  throw createValidationError(
    "Unexpected response format for resource listing",
    ["resource"],
  );
};

export const createResource = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { resource } = req.params;
    const payload = req.body;

    validateRequiredFields(payload, [
      "instanceUrl",
      "clientId",
      "clientSecret",
      "data",
    ]);

    if (!resource || typeof resource !== "string") {
      throw createValidationError("Resource name is required", ["resource"]);
    }

    const { instanceUrl, clientId, clientSecret, data } = payload as {
      instanceUrl: string;
      clientId: string;
      clientSecret: string;
      data: unknown;
    };

    const token = await getAccessToken(instanceUrl, clientId, clientSecret);

    const url = `${instanceUrl}/rest/${resource}`;
    const rawResponse = await callAbacusAPI("POST", url, token, data);
    const normalized = normalizeResponse(rawResponse);

    res.status(201).json({
      success: true,
      data: normalized,
    });
  } catch (error) {
    next(error);
  }
};

export const updateResource = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { resource, id } = req.params;
    const payload = req.body;

    validateRequiredFields(payload, [
      "instanceUrl",
      "clientId",
      "clientSecret",
      "data",
    ]);

    if (!resource || typeof resource !== "string") {
      throw createValidationError("Resource name is required", ["resource"]);
    }

    if (!id || typeof id !== "string") {
      throw createValidationError("Resource id is required", ["id"]);
    }

    const { instanceUrl, clientId, clientSecret, data } = payload as {
      instanceUrl: string;
      clientId: string;
      clientSecret: string;
      data: unknown;
    };

    const token = await getAccessToken(instanceUrl, clientId, clientSecret);

    const url = `${instanceUrl}/rest/${resource}/${encodeURIComponent(id)}`;
    const rawResponse = await callAbacusAPI("PATCH", url, token, data);
    const normalized = normalizeResponse(rawResponse);

    res.status(200).json({
      success: true,
      data: normalized,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Not found")) {
      next(
        createNotFoundError(
          `Resource ${req.params.resource} with id ${req.params.id} not found`,
        ),
      );
      return;
    }
    next(error);
  }
};

export const deleteResource = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { resource, id } = req.params;
    const payload = req.body;

    validateRequiredFields(payload, [
      "instanceUrl",
      "clientId",
      "clientSecret",
    ]);

    if (!resource || typeof resource !== "string") {
      throw createValidationError("Resource name is required", ["resource"]);
    }

    if (!id || typeof id !== "string") {
      throw createValidationError("Resource id is required", ["id"]);
    }

    const { instanceUrl, clientId, clientSecret } = payload as {
      instanceUrl: string;
      clientId: string;
      clientSecret: string;
    };

    const token = await getAccessToken(instanceUrl, clientId, clientSecret);

    const url = `${instanceUrl}/rest/${resource}/${encodeURIComponent(id)}`;
    await callAbacusAPI("DELETE", url, token);

    res.status(200).json({
      success: true,
      deletedId: id,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Not found")) {
      next(
        createNotFoundError(
          `Resource ${req.params.resource} with id ${req.params.id} not found`,
        ),
      );
      return;
    }
    next(error);
  }
};

export const listResources = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { resource } = req.params;
    const { limit, page, search, instanceUrl, clientId, clientSecret } =
      req.query;

    validateRequiredFields(req.query as Record<string, unknown>, [
      "instanceUrl",
      "clientId",
      "clientSecret",
    ]);

    if (!resource || typeof resource !== "string") {
      throw createValidationError("Resource name is required", ["resource"]);
    }

    const pageSize = limit ? Number(limit) : undefined;
    const explicitPage = page ? Number(page) : undefined;
    const searchTerm = search ? String(search) : undefined;

    if (limit && Number.isNaN(pageSize)) {
      throw createValidationError("Limit must be a number", ["limit"]);
    }

    if (page && Number.isNaN(explicitPage)) {
      throw createValidationError("Page must be a number", ["page"]);
    }

    const baseUrl = `${instanceUrl}/rest/${resource}`;
    const token = await getAccessToken(
      String(instanceUrl),
      String(clientId),
      String(clientSecret),
    );

    const fetchPage = async (pageNumber: number) => {
      const queryString = buildQueryString({
        limit: pageSize,
        page: pageNumber,
        search: searchTerm,
      });
      const url = `${baseUrl}${queryString}`;
      return await callAbacusAPI("GET", url, token);
    };

    const items: unknown[] = [];

    if (explicitPage !== undefined) {
      const rawResponse = await fetchPage(explicitPage);
      const pageItems = extractItems(rawResponse);
      const normalized = pageItems.map((item) => normalizeResponse(item));
      res.status(200).json({ success: true, data: normalized });
      return;
    }

    let currentPage = 1;
    const pageLimit = pageSize || 100;

    while (true) {
      const rawResponse = await fetchPage(currentPage);
      const pageItems = extractItems(rawResponse);

      if (pageItems.length === 0) {
        break;
      }

      items.push(...pageItems);

      if (pageItems.length < pageLimit) {
        break;
      }

      currentPage += 1;
    }

    const normalized = items.map((item) => normalizeResponse(item));
    res.status(200).json({ success: true, data: normalized });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Not found")) {
      next(createNotFoundError(`Resource ${req.params.resource} not found`));
      return;
    }
    next(error);
  }
};
