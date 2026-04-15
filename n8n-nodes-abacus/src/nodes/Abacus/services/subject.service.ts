import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../GenericFunctions';

const BASE_ENDPOINT = '/rest/v1/subjects';

function buildSubjectPayload(context: IExecuteFunctions): IDataObject {
  const payload: IDataObject = {};
  const name = context.getNodeParameter('name', 0, '') as string;
  const email = context.getNodeParameter('email', 0, '') as string;
  const phone = context.getNodeParameter('phone', 0, '') as string;
  const reference = context.getNodeParameter('reference', 0, '') as string;
  const status = context.getNodeParameter('status', 0, '') as string;
  if (name) payload.name = name;
  if (email) payload.email = email;
  if (phone) payload.phone = phone;
  if (reference) payload.reference = reference;
  if (status) payload.status = status;
  return payload;
}

export async function getSubject(context: IExecuteFunctions): Promise<IDataObject> {
  const subjectId = context.getNodeParameter('subjectId', 0) as string;
  return apiRequest(context, 'GET', `${BASE_ENDPOINT}/${subjectId}`);
}

export async function getAllSubjects(context: IExecuteFunctions): Promise<IDataObject[]> {
  const limit = context.getNodeParameter('limit', 0) as number;
  return apiRequestAllItems(context, 'GET', BASE_ENDPOINT, limit);
}

export async function createSubject(context: IExecuteFunctions): Promise<IDataObject> {
  return apiRequest(context, 'POST', BASE_ENDPOINT, buildSubjectPayload(context));
}

export async function updateSubject(context: IExecuteFunctions): Promise<IDataObject> {
  const subjectId = context.getNodeParameter('subjectId', 0) as string;
  return apiRequest(context, 'PATCH', `${BASE_ENDPOINT}/${subjectId}`, buildSubjectPayload(context));
}

export async function deleteSubject(context: IExecuteFunctions): Promise<IDataObject> {
  const subjectId = context.getNodeParameter('subjectId', 0) as string;
  await apiRequest(context, 'DELETE', `${BASE_ENDPOINT}/${subjectId}`);
  return { success: true, subjectId };
}
