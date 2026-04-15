import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../GenericFunctions';

const BASE_ENDPOINT = '/rest/v1/items';

function buildItemPayload(context: IExecuteFunctions): IDataObject {
  const payload: IDataObject = {};
  const name = context.getNodeParameter('name', 0, '') as string;
  const category = context.getNodeParameter('category', 0, '') as string;
  const unitPrice = context.getNodeParameter('unitPrice', 0, 0) as number;
  const currency = context.getNodeParameter('currency', 0, 'CHF') as string;
  if (name) payload.name = name;
  if (category) payload.category = category;
  if (unitPrice >= 0) payload.unitPrice = unitPrice;
  if (currency) payload.currency = currency;
  return payload;
}

export async function getItem(context: IExecuteFunctions): Promise<IDataObject> {
  const itemId = context.getNodeParameter('itemId', 0) as string;
  return apiRequest(context, 'GET', `${BASE_ENDPOINT}/${itemId}`);
}

export async function getAllItems(context: IExecuteFunctions): Promise<IDataObject[]> {
  const limit = context.getNodeParameter('limit', 0) as number;
  return apiRequestAllItems(context, 'GET', BASE_ENDPOINT, limit);
}

export async function createItem(context: IExecuteFunctions): Promise<IDataObject> {
  return apiRequest(context, 'POST', BASE_ENDPOINT, buildItemPayload(context));
}

export async function updateItem(context: IExecuteFunctions): Promise<IDataObject> {
  const itemId = context.getNodeParameter('itemId', 0) as string;
  return apiRequest(context, 'PATCH', `${BASE_ENDPOINT}/${itemId}`, buildItemPayload(context));
}

export async function deleteItem(context: IExecuteFunctions): Promise<IDataObject> {
  const itemId = context.getNodeParameter('itemId', 0) as string;
  await apiRequest(context, 'DELETE', `${BASE_ENDPOINT}/${itemId}`);
  return { success: true, itemId };
}
