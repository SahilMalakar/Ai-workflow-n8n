import { callWebhook } from "../../core/webhook/webhook.service";
import { env } from "../../config/env";

export const getToken = (body: Record<string, any>) =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_AUTH_TOKEN, method: "POST", data: body });

export const getInfo = () =>
  callWebhook({ endpoint: env.N8N_WEBHOOK_AUTH_INFO, method: "GET" });
