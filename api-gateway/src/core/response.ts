import { Response } from "express";

export const sendSuccess = (res: Response, data: any, statusCode = 200) => {
  res.status(statusCode).json({ success: true, data });
};

export const sendError = (res: Response, error: any, statusCode = 500) => {
  const message = error?.message || "Internal server error";
  res.status(statusCode).json({ success: false, message });
};
