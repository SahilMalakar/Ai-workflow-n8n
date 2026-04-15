import { Router } from "express";
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "./commerce.controller";

const ordersRouter = Router();
ordersRouter.get("/", getOrders);
ordersRouter.get("/:id", getOrder);
ordersRouter.post("/", createOrder);
ordersRouter.patch("/:id", updateOrder);
ordersRouter.delete("/:id", deleteOrder);

const invoicesRouter = Router();
invoicesRouter.get("/", getInvoices);
invoicesRouter.get("/:id", getInvoice);
invoicesRouter.post("/", createInvoice);
invoicesRouter.patch("/:id", updateInvoice);
invoicesRouter.delete("/:id", deleteInvoice);

export { ordersRouter, invoicesRouter };
