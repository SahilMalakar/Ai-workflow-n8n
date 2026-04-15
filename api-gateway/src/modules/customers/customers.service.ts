import { callWebhook } from "../../core/webhook/webhook.service";
import { env } from "../../config/env";

export const getAllCustomers = (query: Record<string, any>) =>
  callWebhook({ 
    endpoint: env.N8N_WEBHOOK_CUSTOMER_GET_ALL, 
    method: "GET", 
    params: query,
    fallbackData: [
      { id: "cust_1", name: "Global Prime Industries", email: "contact@globalprime.com", phone: "+41 44 123 45 67" },
      { id: "cust_2", name: "Innovatech Solutions", email: "billing@innovatech.ch", phone: "+41 22 987 65 43" },
      { id: "cust_3", name: "Vertex Logistics", email: "info@vertex.com", phone: "+41 31 555 12 34" }
    ]
  });

export const getCustomerById = (id: string) =>
  callWebhook({ 
    endpoint: env.N8N_WEBHOOK_CUSTOMER_GET, 
    method: "GET", 
    pathParams: { id },
    fallbackData: { id, name: "Global Prime Industries", email: "contact@globalprime.com", phone: "+41 44 123 45 67" }
  });

export const createCustomer = (body: Record<string, any>) =>
  callWebhook({ 
    endpoint: env.N8N_WEBHOOK_CUSTOMER_CREATE, 
    method: "POST", 
    data: body,
    fallbackData: { id: "cust_" + Math.random().toString(36).substr(2, 9), ...body }
  });

export const updateCustomer = (id: string, body: Record<string, any>) =>
  callWebhook({ 
    endpoint: env.N8N_WEBHOOK_CUSTOMER_UPDATE, 
    method: "PATCH", 
    data: body, 
    pathParams: { id },
    fallbackData: { id, ...body }
  });

export const deleteCustomer = (id: string) =>
  callWebhook({ 
    endpoint: env.N8N_WEBHOOK_CUSTOMER_DELETE, 
    method: "DELETE", 
    pathParams: { id },
    fallbackData: { success: true }
  });
