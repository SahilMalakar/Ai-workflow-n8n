import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../GenericFunctions';

const BASE_ENDPOINT = '/rest/v1/financial-accounts';

function buildFinancialAccountPayload(context: IExecuteFunctions): IDataObject {
  const payload: IDataObject = {};
  const accountNumber = context.getNodeParameter('accountNumber', 0, '') as string;
  const name = context.getNodeParameter('name', 0, '') as string;
  const type = context.getNodeParameter('type', 0, '') as string;
  const currency = context.getNodeParameter('currency', 0, 'CHF') as string;
  const iban = context.getNodeParameter('iban', 0, '') as string;
  if (accountNumber) payload.accountNumber = accountNumber;
  if (name) payload.name = name;
  if (type) payload.type = type;
  if (currency) payload.currency = currency;
  if (iban) payload.iban = iban;
  return payload;
}

export async function getFinancialAccount(context: IExecuteFunctions): Promise<IDataObject> {
  const financialAccountId = context.getNodeParameter('financialAccountId', 0) as string;
  return apiRequest(context, 'GET', `${BASE_ENDPOINT}/${financialAccountId}`);
}

export async function getAllFinancialAccounts(context: IExecuteFunctions): Promise<IDataObject[]> {
  const limit = context.getNodeParameter('limit', 0) as number;
  return apiRequestAllItems(context, 'GET', BASE_ENDPOINT, limit);
}

export async function createFinancialAccount(context: IExecuteFunctions): Promise<IDataObject> {
  return apiRequest(context, 'POST', BASE_ENDPOINT, buildFinancialAccountPayload(context));
}

export async function updateFinancialAccount(context: IExecuteFunctions): Promise<IDataObject> {
  const financialAccountId = context.getNodeParameter('financialAccountId', 0) as string;
  return apiRequest(context, 'PATCH', `${BASE_ENDPOINT}/${financialAccountId}`, buildFinancialAccountPayload(context));
}

export async function deleteFinancialAccount(context: IExecuteFunctions): Promise<IDataObject> {
  const financialAccountId = context.getNodeParameter('financialAccountId', 0) as string;
  await apiRequest(context, 'DELETE', `${BASE_ENDPOINT}/${financialAccountId}`);
  return { success: true, financialAccountId };
}
