import type { INodeProperties } from 'n8n-workflow';

export const projectOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['project'] } },
    options: [
      { name: 'Create', value: 'create', action: 'Create a project' },
      { name: 'Delete', value: 'delete', action: 'Delete a project' },
      { name: 'Get', value: 'get', action: 'Get a project' },
      { name: 'Get All', value: 'getAll', action: 'Get all projects' },
      { name: 'Update', value: 'update', action: 'Update a project' },
    ],
    default: 'getAll',
  },
];

export const projectFields: INodeProperties[] = [
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['project'], operation: ['get', 'update', 'delete'] } },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1, maxValue: 500 },
    default: 100,
    displayOptions: { show: { resource: ['project'], operation: ['getAll'] } },
  },
  {
    displayName: 'Project Name',
    name: 'projectName',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['project'], operation: ['create', 'update'] } },
  },
  {
    displayName: 'Status',
    name: 'status',
    type: 'options',
    options: [
      { name: 'Active', value: 'active' },
      { name: 'Completed', value: 'completed' },
      { name: 'On Hold', value: 'on-hold' },
    ],
    default: 'active',
    displayOptions: { show: { resource: ['project'], operation: ['create', 'update'] } },
  },
  {
    displayName: 'Customer ID',
    name: 'customerId',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['project'], operation: ['create', 'update'] } },
    description: 'Link this project to a customer',
  },
];
