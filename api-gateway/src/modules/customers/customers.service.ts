import { callWebhook } from "../../core/webhook/webhook.service";
import { env } from "../../config/env";

export const getAllCustomers = (query: Record<string, any>) =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_CUSTOMER_GET_ALL, method: "GET", params: query });

export const getCustomerById = (id: string) =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_CUSTOMER_GET, method: "GET", pathParams: { id } });

export const createCustomer = (body: Record<string, any>) =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_CUSTOMER_CREATE, method: "POST", data: body });

export const updateCustomer = (id: string, body: Record<string, any>) =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_CUSTOMER_UPDATE, method: "PATCH", data: body, pathParams: { id } });

export const deleteCustomer = (id: string) =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_CUSTOMER_DELETE, method: "DELETE", pathParams: { id } });
