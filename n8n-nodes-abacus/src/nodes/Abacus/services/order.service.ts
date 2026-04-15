import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../GenericFunctions';

const BASE_ENDPOINT = '/rest/v1/orders';

function buildOrderPayload(context: IExecuteFunctions): IDataObject {
  const payload: IDataObject = {};

  const customerId = context.getNodeParameter('customerId', 0, '') as string;
  const totalAmount = context.getNodeParameter('totalAmount', 0, 0) as number;

  if (customerId) payload.customerId = customerId;
  if (totalAmount > 0) payload.totalAmount = totalAmount;

  return payload;
}

export async function getOrder(context: IExecuteFunctions): Promise<IDataObject> {
  const orderId = context.getNodeParameter('orderId', 0) as string;
  return apiRequest(context, 'GET', `${BASE_ENDPOINT}/${orderId}`);
}

export async function getAllOrders(context: IExecuteFunctions): Promise<IDataObject[]> {
  const limit = context.getNodeParameter('limit', 0) as number;
  return apiRequestAllItems(context, 'GET', BASE_ENDPOINT, limit);
}

export async function createOrder(context: IExecuteFunctions): Promise<IDataObject> {
  const payload = buildOrderPayload(context);
  return apiRequest(context, 'POST', BASE_ENDPOINT, payload);
}

export async function updateOrder(context: IExecuteFunctions): Promise<IDataObject> {
  const orderId = context.getNodeParameter('orderId', 0) as string;
  const payload = buildOrderPayload(context);
  return apiRequest(context, 'PATCH', `${BASE_ENDPOINT}/${orderId}`, payload);
}

export async function deleteOrder(context: IExecuteFunctions): Promise<IDataObject> {
  const orderId = context.getNodeParameter('orderId', 0) as string;
  await apiRequest(context, 'DELETE', `${BASE_ENDPOINT}/${orderId}`);
  return { success: true, orderId };
}
