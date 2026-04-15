import { Request, Response } from "express";
import * as commerceService from "./commerce.service";
import { sendSuccess, sendError } from "../../core/response";

// ─── Orders ───────────────────────────────────────────────────────────────────

export const getOrders = async (req: Request, res: Response) => {
  try {
    const data = await commerceService.getAllOrders(req.query);
    sendSuccess(res, data);
  } catch (error) {
    sendError(res, error);
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const data = await commerceService.getOrderById(req.params.id);
    sendSuccess(res, data);
  } catch (error) {
    sendError(res, error);
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const data = await commerceService.createOrder(req.body);
    sendSuccess(res, data, 201);
  } catch (error) {
    sendError(res, error);
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const data = await commerceService.updateOrder(req.params.id, req.body);
    sendSuccess(res, data);
  } catch (error) {
    sendError(res, error);
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    await commerceService.deleteOrder(req.params.id);
    res.status(204).send();
  } catch (error) {
    sendError(res, error);
  }
};

// ─── Invoices ─────────────────────────────────────────────────────────────────

export const getInvoices = async (req: Request, res: Response) => {
  try {
    const data = await commerceService.getAllInvoices(req.query);
    sendSuccess(res, data);
  } catch (error) {
    sendError(res, error);
  }
};

export const getInvoice = async (req: Request, res: Response) => {
  try {
    const data = await commerceService.getInvoiceById(req.params.id);
    sendSuccess(res, data);
  } catch (error) {
    sendError(res, error);
  }
};

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const data = await commerceService.createInvoice(req.body);
    sendSuccess(res, data, 201);
  } catch (error) {
    sendError(res, error);
  }
};

export const updateInvoice = async (req: Request, res: Response) => {
  try {
    const data = await commerceService.updateInvoice(req.params.id, req.body);
    sendSuccess(res, data);
  } catch (error) {
    sendError(res, error);
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    await commerceService.deleteInvoice(req.params.id);
    res.status(204).send();
  } catch (error) {
    sendError(res, error);
  }
};
