import { callWebhook } from "../../core/webhook/webhook.service";
import { env } from "../../config/env";

export const getAllAddresses = (query: Record<string, any>) =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_ADDRESS_GET_ALL, method: "GET", params: query });

export const getAddressById = (id: string) =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_ADDRESS_GET, method: "GET", pathParams: { id } });

export const createAddress = (body: Record<string, any>) =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_ADDRESS_CREATE, method: "POST", data: body });

export const updateAddress = (id: string, body: Record<string, any>) =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_ADDRESS_UPDATE, method: "PATCH", data: body, pathParams: { id } });

export const deleteAddress = (id: string) =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_ADDRESS_DELETE, method: "DELETE", pathParams: { id } });
