import { Request, Response } from "express";
import * as customerService from "./customers.service";
import { sendSuccess, sendError } from "../../core/response";

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const data = await customerService.getAllCustomers(req.query);
    sendSuccess(res, data);
  } catch (error) {
    sendError(res, error);
  }
};

export const getCustomer = async (req: Request, res: Response) => {
  try {
    const data = await customerService.getCustomerById(req.params.id);
    sendSuccess(res, data);
  } catch (error) {
    sendError(res, error);
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const data = await customerService.createCustomer(req.body);
    sendSuccess(res, data, 201);
  } catch (error) {
    sendError(res, error);
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const data = await customerService.updateCustomer(req.params.id, req.body);
    sendSuccess(res, data);
  } catch (error) {
    sendError(res, error);
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    await customerService.deleteCustomer(req.params.id);
    res.status(204).send();
  } catch (error) {
    sendError(res, error);
  }
};
