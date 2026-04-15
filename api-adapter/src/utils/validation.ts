export interface ValidationError extends Error {
  fields: string[];
  isValidationError: true;
}

export function createValidationError(
  message: string,
  fields: string[],
): ValidationError {
  const error = new Error(message) as ValidationError;
  error.name = "ValidationError";
  error.fields = fields;
  error.isValidationError = true;
  return error;
}

export function validateRequiredFields(
  payload: Record<string, unknown> | undefined,
  requiredFields: string[],
): void {
  if (!payload || typeof payload !== "object") {
    throw createValidationError(
      "Request payload is missing or invalid",
      requiredFields,
    );
  }

  const missingFields = requiredFields.filter(
    (field) => payload[field] === undefined || payload[field] === null,
  );

  if (missingFields.length > 0) {
    throw createValidationError(
      "Missing required fields for API request",
      missingFields,
    );
  }
}
