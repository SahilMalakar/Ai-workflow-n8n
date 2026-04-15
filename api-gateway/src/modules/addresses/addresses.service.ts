import { callWebhook } from "../../core/webhook/webhook.service";
import { env } from "../../config/env";

export const getAllAddresses = (query: Record<string, any>) =>
  callWebhook({ 
    endpoint: env.N8N_WEBHOOK_ADDRESS_GET_ALL, 
    method: "GET", 
    params: query,
    fallbackData: [
      { id: "addr_1", customerId: "cust_1", street: "123 Business Way", city: "Zurich", zip: "8001", country: "Switzerland" },
      { id: "addr_2", customerId: "cust_2", street: "456 Enterprise Ave", city: "Geneva", zip: "1201", country: "Switzerland" }
    ]
  });

export const getAddressById = (id: string) =>
  callWebhook({ 
    endpoint: env.N8N_WEBHOOK_ADDRESS_GET, 
    method: "GET", 
    pathParams: { id },
    fallbackData: { id, customerId: "cust_1", street: "123 Business Way", city: "Zurich", zip: "8001", country: "Switzerland" }
  });

export const createAddress = (body: Record<string, any>) =>
  callWebhook({ 
    endpoint: env.N8N_WEBHOOK_ADDRESS_CREATE, 
    method: "POST", 
    data: body,
    fallbackData: { id: "addr_" + Math.random().toString(36).substr(2, 9), ...body }
  });

export const updateAddress = (id: string, body: Record<string, any>) =>
  callWebhook({ 
    endpoint: env.N8N_WEBHOOK_ADDRESS_UPDATE, 
    method: "PATCH", 
    data: body, 
    pathParams: { id },
    fallbackData: { id, ...body }
  });

export const deleteAddress = (id: string) =>
  callWebhook({ 
    endpoint: env.N8N_WEBHOOK_ADDRESS_DELETE, 
    method: "DELETE", 
    pathParams: { id },
    fallbackData: { success: true }
  });
