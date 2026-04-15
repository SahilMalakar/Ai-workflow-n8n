import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../GenericFunctions';

const BASE_ENDPOINT = '/rest/v1/projects';

function buildProjectPayload(context: IExecuteFunctions): IDataObject {
  const payload: IDataObject = {};

  const projectName = context.getNodeParameter('projectName', 0, '') as string;
  const status = context.getNodeParameter('status', 0, '') as string;
  const customerId = context.getNodeParameter('customerId', 0, '') as string;

  if (projectName) payload.projectName = projectName;
  if (status) payload.status = status;
  if (customerId) payload.customerId = customerId;

  return payload;
}

export async function getProject(context: IExecuteFunctions): Promise<IDataObject> {
  const projectId = context.getNodeParameter('projectId', 0) as string;
  return apiRequest(context, 'GET', `${BASE_ENDPOINT}/${projectId}`);
}

export async function getAllProjects(context: IExecuteFunctions): Promise<IDataObject[]> {
  const limit = context.getNodeParameter('limit', 0) as number;
  return apiRequestAllItems(context, 'GET', BASE_ENDPOINT, limit);
}

export async function createProject(context: IExecuteFunctions): Promise<IDataObject> {
  const payload = buildProjectPayload(context);
  return apiRequest(context, 'POST', BASE_ENDPOINT, payload);
}

export async function updateProject(context: IExecuteFunctions): Promise<IDataObject> {
  const projectId = context.getNodeParameter('projectId', 0) as string;
  const payload = buildProjectPayload(context);
  return apiRequest(context, 'PATCH', `${BASE_ENDPOINT}/${projectId}`, payload);
}

export async function deleteProject(context: IExecuteFunctions): Promise<IDataObject> {
  const projectId = context.getNodeParameter('projectId', 0) as string;
  await apiRequest(context, 'DELETE', `${BASE_ENDPOINT}/${projectId}`);
  return { success: true, projectId };
}
