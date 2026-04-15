import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../GenericFunctions';

const BASE_ENDPOINT = '/rest/v1/addresses';

function buildAddressEndpoint(addressId?: string, customerId?: string): string {
  if (customerId) {
    const base = `/rest/v1/customers/${customerId}/addresses`;
    return addressId ? `${base}/${addressId}` : base;
  }
  return addressId ? `${BASE_ENDPOINT}/${addressId}` : BASE_ENDPOINT;
}

function buildAddressPayload(context: IExecuteFunctions): IDataObject {
  const payload: IDataObject = {};

  const firstName = context.getNodeParameter('firstName', 0, '') as string;
  const lastName = context.getNodeParameter('lastName', 0, '') as string;
  const street = context.getNodeParameter('street', 0, '') as string;
  const zip = context.getNodeParameter('zip', 0, '') as string;
  const city = context.getNodeParameter('city', 0, '') as string;

  if (firstName) payload.firstName = firstName;
  if (lastName) payload.lastName = lastName;
  if (street) payload.street = street;
  if (zip) payload.zip = zip;
  if (city) payload.city = city;

  return payload;
}

export async function getAddress(context: IExecuteFunctions): Promise<IDataObject> {
  const addressId = context.getNodeParameter('addressId', 0) as string;
  const customerId = context.getNodeParameter('customerId', 0, '') as string;
  const endpoint = buildAddressEndpoint(addressId, customerId);
  return apiRequest(context, 'GET', endpoint);
}

export async function getAllAddresses(context: IExecuteFunctions): Promise<IDataObject[]> {
  const limit = context.getNodeParameter('limit', 0) as number;
  const customerId = context.getNodeParameter('customerId', 0, '') as string;
  const endpoint = buildAddressEndpoint(undefined, customerId);
  return apiRequestAllItems(context, 'GET', endpoint, limit);
}

export async function createAddress(context: IExecuteFunctions): Promise<IDataObject> {
  const customerId = context.getNodeParameter('customerId', 0, '') as string;
  const endpoint = buildAddressEndpoint(undefined, customerId);
  const payload = buildAddressPayload(context);
  return apiRequest(context, 'POST', endpoint, payload);
}

export async function updateAddress(context: IExecuteFunctions): Promise<IDataObject> {
  const addressId = context.getNodeParameter('addressId', 0) as string;
  const customerId = context.getNodeParameter('customerId', 0, '') as string;
  const endpoint = buildAddressEndpoint(addressId, customerId);
  const payload = buildAddressPayload(context);
  return apiRequest(context, 'PATCH', endpoint, payload);
}

export async function deleteAddress(context: IExecuteFunctions): Promise<IDataObject> {
  const addressId = context.getNodeParameter('addressId', 0) as string;
  const customerId = context.getNodeParameter('customerId', 0, '') as string;
  const endpoint = buildAddressEndpoint(addressId, customerId);
  await apiRequest(context, 'DELETE', endpoint);
  return { success: true, addressId };
}
