export interface ApiError extends Error {
  statusCode: number;
  isApiError: true;
}

export interface NotFoundError extends ApiError {
  isNotFoundError: true;
}

export function createApiError(message: string, statusCode: number): ApiError {
  const error = new Error(message) as ApiError;
  error.name = "ApiError";
  error.statusCode = statusCode;
  error.isApiError = true;
  return error;
}

export function createNotFoundError(
  message = "Resource not found",
): NotFoundError {
  const error = createApiError(message, 404) as NotFoundError;
  error.name = "NotFoundError";
  error.isNotFoundError = true;
  return error;
}
