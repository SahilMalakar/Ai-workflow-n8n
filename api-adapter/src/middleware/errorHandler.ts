import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../utils/validation";
import { ApiError } from "../utils/errors";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error(err.stack);

  const maybeError = err as Error & Partial<ValidationError & ApiError>;

  if (maybeError.isValidationError) {
    res.status(400).json({
      success: false,
      message: maybeError.message,
      fields: maybeError.fields,
    });
    return;
  }

  if (maybeError.isApiError) {
    res.status(maybeError.statusCode ?? 500).json({
      success: false,
      message: maybeError.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
};
