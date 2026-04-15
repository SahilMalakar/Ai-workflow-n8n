import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../GenericFunctions';

const BASE_ENDPOINT = '/rest/v1/payments';

function buildPaymentPayload(context: IExecuteFunctions): IDataObject {
  const payload: IDataObject = {};
  const customerId = context.getNodeParameter('customerId', 0, '') as string;
  const amount = context.getNodeParameter('amount', 0, 0) as number;
  const currency = context.getNodeParameter('currency', 0, 'CHF') as string;
  const status = context.getNodeParameter('status', 0, '') as string;
  const paymentDate = context.getNodeParameter('paymentDate', 0, '') as string;
  if (customerId) payload.customerId = customerId;
  if (amount > 0) payload.amount = amount;
  if (currency) payload.currency = currency;
  if (status) payload.status = status;
  if (paymentDate) payload.paymentDate = paymentDate;
  return payload;
}

export async function getPayment(context: IExecuteFunctions): Promise<IDataObject> {
  const paymentId = context.getNodeParameter('paymentId', 0) as string;
  return apiRequest(context, 'GET', `${BASE_ENDPOINT}/${paymentId}`);
}

export async function getAllPayments(context: IExecuteFunctions): Promise<IDataObject[]> {
  const limit = context.getNodeParameter('limit', 0) as number;
  return apiRequestAllItems(context, 'GET', BASE_ENDPOINT, limit);
}

export async function createPayment(context: IExecuteFunctions): Promise<IDataObject> {
  return apiRequest(context, 'POST', BASE_ENDPOINT, buildPaymentPayload(context));
}

export async function updatePayment(context: IExecuteFunctions): Promise<IDataObject> {
  const paymentId = context.getNodeParameter('paymentId', 0) as string;
  return apiRequest(context, 'PATCH', `${BASE_ENDPOINT}/${paymentId}`, buildPaymentPayload(context));
}

export async function deletePayment(context: IExecuteFunctions): Promise<IDataObject> {
  const paymentId = context.getNodeParameter('paymentId', 0) as string;
  await apiRequest(context, 'DELETE', `${BASE_ENDPOINT}/${paymentId}`);
  return { success: true, paymentId };
}
