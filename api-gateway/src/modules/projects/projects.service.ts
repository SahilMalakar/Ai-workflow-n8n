import { callWebhook } from "../../core/webhook/webhook.service";
import { env } from "../../config/env";

export const getAllProjects = (query: Record<string, any>) =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_PROJECT_GET_ALL, method: "GET", params: query });

export const getProjectById = (id: string) =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_PROJECT_GET, method: "GET", pathParams: { id } });

export const createProject = (body: Record<string, any>) =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_PROJECT_CREATE, method: "POST", data: body });

export const updateProject = (id: string, body: Record<string, any>) =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_PROJECT_UPDATE, method: "PATCH", data: body, pathParams: { id } });

export const deleteProject = (id: string) =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_PROJECT_DELETE, method: "DELETE", pathParams: { id } });
