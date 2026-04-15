import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../GenericFunctions';

const BASE_ENDPOINT = '/rest/v1/delivery-notes';

function buildDeliveryNotePayload(context: IExecuteFunctions): IDataObject {
  const payload: IDataObject = {};
  const customerId = context.getNodeParameter('customerId', 0, '') as string;
  const status = context.getNodeParameter('status', 0, '') as string;
  const deliveryDate = context.getNodeParameter('deliveryDate', 0, '') as string;
  const note = context.getNodeParameter('note', 0, '') as string;
  if (customerId) payload.customerId = customerId;
  if (status) payload.status = status;
  if (deliveryDate) payload.deliveryDate = deliveryDate;
  if (note) payload.note = note;
  return payload;
}

export async function getDeliveryNote(context: IExecuteFunctions): Promise<IDataObject> {
  const deliveryNoteId = context.getNodeParameter('deliveryNoteId', 0) as string;
  return apiRequest(context, 'GET', `${BASE_ENDPOINT}/${deliveryNoteId}`);
}

export async function getAllDeliveryNotes(context: IExecuteFunctions): Promise<IDataObject[]> {
  const limit = context.getNodeParameter('limit', 0) as number;
  return apiRequestAllItems(context, 'GET', BASE_ENDPOINT, limit);
}

export async function createDeliveryNote(context: IExecuteFunctions): Promise<IDataObject> {
  return apiRequest(context, 'POST', BASE_ENDPOINT, buildDeliveryNotePayload(context));
}

export async function updateDeliveryNote(context: IExecuteFunctions): Promise<IDataObject> {
  const deliveryNoteId = context.getNodeParameter('deliveryNoteId', 0) as string;
  return apiRequest(context, 'PATCH', `${BASE_ENDPOINT}/${deliveryNoteId}`, buildDeliveryNotePayload(context));
}

export async function deleteDeliveryNote(context: IExecuteFunctions): Promise<IDataObject> {
  const deliveryNoteId = context.getNodeParameter('deliveryNoteId', 0) as string;
  await apiRequest(context, 'DELETE', `${BASE_ENDPOINT}/${deliveryNoteId}`);
  return { success: true, deliveryNoteId };
}
