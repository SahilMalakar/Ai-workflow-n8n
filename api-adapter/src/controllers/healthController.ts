import { Request, Response } from "express";
import { getHealthStatus } from "../services/healthService";

export const getHealth = (req: Request, res: Response): void => {
  const healthStatus = getHealthStatus();
  res.status(200).json(healthStatus);
};
