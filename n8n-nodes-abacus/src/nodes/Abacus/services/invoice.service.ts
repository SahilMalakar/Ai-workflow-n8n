import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../GenericFunctions';

const BASE_ENDPOINT = '/rest/v1/invoices';

function buildInvoicePayload(context: IExecuteFunctions): IDataObject {
  const payload: IDataObject = {};

  const customerId = context.getNodeParameter('customerId', 0, '') as string;
  const amount = context.getNodeParameter('amount', 0, 0) as number;
  const currency = context.getNodeParameter('currency', 0, 'CHF') as string;
  const status = context.getNodeParameter('status', 0, '') as string;

  if (customerId) payload.customerId = customerId;
  if (amount > 0) payload.amount = amount;
  if (currency) payload.currency = currency;
  if (status) payload.status = status;

  return payload;
}

export async function getInvoice(context: IExecuteFunctions): Promise<IDataObject> {
  const invoiceId = context.getNodeParameter('invoiceId', 0) as string;
  return apiRequest(context, 'GET', `${BASE_ENDPOINT}/${invoiceId}`);
}

export async function getAllInvoices(context: IExecuteFunctions): Promise<IDataObject[]> {
  const limit = context.getNodeParameter('limit', 0) as number;
  return apiRequestAllItems(context, 'GET', BASE_ENDPOINT, limit);
}

export async function createInvoice(context: IExecuteFunctions): Promise<IDataObject> {
  const payload = buildInvoicePayload(context);
  return apiRequest(context, 'POST', BASE_ENDPOINT, payload);
}

export async function updateInvoice(context: IExecuteFunctions): Promise<IDataObject> {
  const invoiceId = context.getNodeParameter('invoiceId', 0) as string;
  const payload = buildInvoicePayload(context);
  return apiRequest(context, 'PATCH', `${BASE_ENDPOINT}/${invoiceId}`, payload);
}

export async function deleteInvoice(context: IExecuteFunctions): Promise<IDataObject> {
  const invoiceId = context.getNodeParameter('invoiceId', 0) as string;
  await apiRequest(context, 'DELETE', `${BASE_ENDPOINT}/${invoiceId}`);
  return { success: true, invoiceId };
}
