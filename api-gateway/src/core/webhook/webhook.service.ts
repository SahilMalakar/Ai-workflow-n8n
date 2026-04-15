import axios, { Method } from "axios";
import { env } from "../../config/env";

interface WebhookOptions {
  endpoint: string;
  method?: Method;
  params?: Record<string, any>;
  data?: Record<string, any>;
  pathParams?: Record<string, string | number>;
  headers?: Record<string, string>;
}

const replacePathParams = (
  endpoint: string,
  pathParams?: Record<string, any>
): string => {
  if (!pathParams) return endpoint;
  return Object.keys(pathParams).reduce(
    (acc, key) => acc.replace(`:${key}`, String(pathParams[key])),
    endpoint
  );
};

export const callWebhook = async ({
  endpoint,
  method = "GET",
  params = {},
  data = {},
  pathParams,
  headers = {},
}: WebhookOptions): Promise<any> => {
  const resolvedEndpoint = replacePathParams(endpoint, pathParams);
  const url = `${env.N8N_BASE_URL}${resolvedEndpoint}`;

  console.log(`[Webhook] ${method} ${url}`);

  try {
    const response = await axios({
      url,
      method,
      params,
      data,
      headers,
    });

    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.message ||
      "Webhook call failed";

    console.error(`[Webhook Error] ${method} ${url} →`, message);
    throw new Error(message);
  }
};
