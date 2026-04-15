import { callWebhook } from "../../core/webhook/webhook.service";
import { env } from "../../config/env";

// ─── Orders ───────────────────────────────────────────────────────────────────

export const getAllOrders = (query: Record<string, any>) =>
  callWebhook({ 
    endpoint: env.N8N_WEBHOOK_ORDER_GET_ALL, 
    method: "GET", 
    params: query,
    fallbackData: [
      { id: "ord_101", customerId: "cust_1", total: 1250.00, status: "completed", createdAt: "2026-04-10T10:00:00Z" },
      { id: "ord_102", customerId: "cust_2", total: 450.50, status: "pending", createdAt: "2026-04-12T14:30:00Z" }
    ]
  });

export const getOrderById = (id: string) =>
  callWebhook({ 
    endpoint: env.N8N_WEBHOOK_ORDER_GET, 
    method: "GET", 
    pathParams: { id },
    fallbackData: { id, customerId: "cust_1", total: 1250.00, status: "completed" }
  });

export const createOrder = (body: Record<string, any>) =>
  callWebhook({ 
    endpoint: env.N8N_WEBHOOK_ORDER_CREATE, 
    method: "POST", 
    data: body,
    fallbackData: { id: "ord_" + Math.random().toString(36).substr(2, 9), ...body }
  });

export const updateOrder = (id: string, body: Record<string, any>) =>
  callWebhook({ 
    endpoint: env.N8N_WEBHOOK_ORDER_UPDATE, 
    method: "PATCH", 
    data: body, 
    pathParams: { id },
    fallbackData: { id, ...body }
  });

export const deleteOrder = (id: string) =>
  callWebhook({ 
    endpoint: env.N8N_WEBHOOK_ORDER_DELETE, 
    method: "DELETE", 
    pathParams: { id },
    fallbackData: { success: true }
  });

// ─── Invoices ─────────────────────────────────────────────────────────────────

export const getAllInvoices = (query: Record<string, any>) =>
  callWebhook({ 
    endpoint: env.N8N_WEBHOOK_INVOICE_GET_ALL, 
    method: "GET", 
    params: query,
    fallbackData: [
      { id: "inv_501", orderId: "ord_101", customerId: "cust_1", amount: 1250.00, status: "paid", dueDate: "2026-05-10" },
      { id: "inv_502", orderId: "ord_102", customerId: "cust_2", amount: 450.50, status: "sent", dueDate: "2026-05-12" }
    ]
  });

export const getInvoiceById = (id: string) =>
  callWebhook({ 
    endpoint: env.N8N_WEBHOOK_INVOICE_GET, 
    method: "GET", 
    pathParams: { id },
    fallbackData: { id, orderId: "ord_101", customerId: "cust_1", amount: 1250.00, status: "paid" }
  });

export const createInvoice = (body: Record<string, any>) =>
  callWebhook({ 
    endpoint: env.N8N_WEBHOOK_INVOICE_CREATE, 
    method: "POST", 
    data: body,
    fallbackData: { id: "inv_" + Math.random().toString(36).substr(2, 9), ...body }
  });

export const updateInvoice = (id: string, body: Record<string, any>) =>
  callWebhook({ 
    endpoint: env.N8N_WEBHOOK_INVOICE_UPDATE, 
    method: "PATCH", 
    data: body, 
    pathParams: { id },
    fallbackData: { id, ...body }
  });

export const deleteInvoice = (id: string) =>
  callWebhook({ 
    endpoint: env.N8N_WEBHOOK_INVOICE_DELETE, 
    method: "DELETE", 
    pathParams: { id },
    fallbackData: { success: true }
  });
