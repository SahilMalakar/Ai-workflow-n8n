import { Request, Response } from "express";
import * as authService from "./auth.service";
import { sendSuccess, sendError } from "../../core/response";

export const getToken = async (req: Request, res: Response) => {
  try {
    const data = await authService.getToken(req.body);
    sendSuccess(res, data);
  } catch (error) {
    sendError(res, error);
  }
};

export const getInfo = async (_req: Request, res: Response) => {
  try {
    const data = await authService.getInfo();
    sendSuccess(res, data);
  } catch (error) {
    sendError(res, error);
  }
};
