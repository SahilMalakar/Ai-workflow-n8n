import { callWebhook } from "../../core/webhook/webhook.service";
import { env } from "../../config/env";

export const getAllProjects = (query: Record<string, any>) =>
  callWebhook({ 
    endpoint: env.N8N_WEBHOOK_PROJECT_GET_ALL, 
    method: "GET", 
    params: query,
    fallbackData: [
      { id: "proj_01", name: "ERP Migration Phase 1", customerId: "cust_1", status: "active", budget: 50000 },
      { id: "proj_02", name: "Cloud Infrastructure Setup", customerId: "cust_2", status: "completed", budget: 25000 },
      { id: "proj_03", name: "Security Audit 2026", customerId: "cust_3", status: "on-hold", budget: 15000 }
    ]
  });

export const getProjectById = (id: string) =>
  callWebhook({ 
    endpoint: env.N8N_WEBHOOK_PROJECT_GET, 
    method: "GET", 
    pathParams: { id },
    fallbackData: { id, name: "ERP Migration Phase 1", customerId: "cust_1", status: "active", budget: 50000 }
  });

export const createProject = (body: Record<string, any>) =>
  callWebhook({ 
    endpoint: env.N8N_WEBHOOK_PROJECT_CREATE, 
    method: "POST", 
    data: body,
    fallbackData: { id: "proj_" + Math.random().toString(36).substr(2, 9), ...body }
  });

export const updateProject = (id: string, body: Record<string, any>) =>
  callWebhook({ 
    endpoint: env.N8N_WEBHOOK_PROJECT_UPDATE, 
    method: "PATCH", 
    data: body, 
    pathParams: { id },
    fallbackData: { id, ...body }
  });

export const deleteProject = (id: string) =>
  callWebhook({ 
    endpoint: env.N8N_WEBHOOK_PROJECT_DELETE, 
    method: "DELETE", 
    pathParams: { id },
    fallbackData: { success: true }
  });
