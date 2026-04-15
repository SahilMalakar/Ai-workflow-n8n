import { Request, Response } from "express";
import * as addressService from "./addresses.service";
import { sendSuccess, sendError } from "../../core/response";

export const getAddresses = async (req: Request, res: Response) => {
  try {
    const data = await addressService.getAllAddresses(req.query);
    sendSuccess(res, data);
  } catch (error) {
    sendError(res, error);
  }
};

export const getAddress = async (req: Request, res: Response) => {
  try {
    const data = await addressService.getAddressById(req.params.id);
    sendSuccess(res, data);
  } catch (error) {
    sendError(res, error);
  }
};

export const createAddress = async (req: Request, res: Response) => {
  try {
    const data = await addressService.createAddress(req.body);
    sendSuccess(res, data, 201);
  } catch (error) {
    sendError(res, error);
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  try {
    const data = await addressService.updateAddress(req.params.id, req.body);
    sendSuccess(res, data);
  } catch (error) {
    sendError(res, error);
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    await addressService.deleteAddress(req.params.id);
    res.status(204).send();
  } catch (error) {
    sendError(res, error);
  }
};
