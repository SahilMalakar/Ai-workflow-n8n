import { callWebhook } from "../../core/webhook/webhook.service";
import { env } from "../../config/env";

// ─── Orders ───────────────────────────────────────────────────────────────────

export const getAllOrders = (query: Record<string, any>) =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_ORDER_GET_ALL, method: "GET", params: query });

export const getOrderById = (id: string) =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_ORDER_GET, method: "GET", pathParams: { id } });

export const createOrder = (body: Record<string, any>) =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_ORDER_CREATE, method: "POST", data: body });

export const updateOrder = (id: string, body: Record<string, any>) =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_ORDER_UPDATE, method: "PATCH", data: body, pathParams: { id } });

export const deleteOrder = (id: string) =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_ORDER_DELETE, method: "DELETE", pathParams: { id } });

// ─── Invoices ─────────────────────────────────────────────────────────────────

export const getAllInvoices = (query: Record<string, any>) =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_INVOICE_GET_ALL, method: "GET", params: query });

export const getInvoiceById = (id: string) =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_INVOICE_GET, method: "GET", pathParams: { id } });

export const createInvoice = (body: Record<string, any>) =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_INVOICE_CREATE, method: "POST", data: body });

export const updateInvoice = (id: string, body: Record<string, any>) =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_INVOICE_UPDATE, method: "PATCH", data: body, pathParams: { id } });

export const deleteInvoice = (id: string) =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_INVOICE_DELETE, method: "DELETE", pathParams: { id } });
