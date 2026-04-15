import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../GenericFunctions';

const BASE_ENDPOINT = '/rest/v1/customers';

function buildCustomerPayload(context: IExecuteFunctions): IDataObject {
  const payload: IDataObject = {};

  const name = context.getNodeParameter('name', 0, '') as string;
  const email = context.getNodeParameter('email', 0, '') as string;
  const addressId = context.getNodeParameter('addressId', 0, '') as string;

  if (name) payload.name = name;
  if (email) payload.email = email;
  if (addressId) payload.addressId = addressId;

  return payload;
}

export async function getCustomer(context: IExecuteFunctions): Promise<IDataObject> {
  const customerId = context.getNodeParameter('customerId', 0) as string;
  return apiRequest(context, 'GET', `${BASE_ENDPOINT}/${customerId}`);
}

export async function getAllCustomers(context: IExecuteFunctions): Promise<IDataObject[]> {
  const limit = context.getNodeParameter('limit', 0) as number;
  const search = context.getNodeParameter('search', 0, '') as string;
  const queryParams: IDataObject = {};
  if (search) queryParams.search = search;
  return apiRequestAllItems(context, 'GET', BASE_ENDPOINT, limit, queryParams);
}

export async function createCustomer(context: IExecuteFunctions): Promise<IDataObject> {
  const payload = buildCustomerPayload(context);
  return apiRequest(context, 'POST', BASE_ENDPOINT, payload);
}

export async function updateCustomer(context: IExecuteFunctions): Promise<IDataObject> {
  const customerId = context.getNodeParameter('customerId', 0) as string;
  const payload = buildCustomerPayload(context);
  return apiRequest(context, 'PATCH', `${BASE_ENDPOINT}/${customerId}`, payload);
}
