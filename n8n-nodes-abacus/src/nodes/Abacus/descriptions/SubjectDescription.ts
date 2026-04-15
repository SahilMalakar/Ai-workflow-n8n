import type { INodeProperties } from 'n8n-workflow';

export const subjectOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['subject'] } },
    options: [
      { name: 'Create', value: 'create', action: 'Create a subject' },
      { name: 'Delete', value: 'delete', action: 'Delete a subject' },
      { name: 'Get', value: 'get', action: 'Get a subject' },
      { name: 'Get All', value: 'getAll', action: 'Get all subjects' },
      { name: 'Update', value: 'update', action: 'Update a subject' },
    ],
    default: 'getAll',
  },
];

export const subjectFields: INodeProperties[] = [
  {
    displayName: 'Subject ID',
    name: 'subjectId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['subject'], operation: ['get', 'update', 'delete'] } },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1, maxValue: 500 },
    default: 100,
    displayOptions: { show: { resource: ['subject'], operation: ['getAll'] } },
  },
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['subject'], operation: ['create', 'update'] } },
  },
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    placeholder: 'name@company.com',
    default: '',
    displayOptions: { show: { resource: ['subject'], operation: ['create', 'update'] } },
  },
  {
    displayName: 'Phone',
    name: 'phone',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['subject'], operation: ['create', 'update'] } },
  },
  {
    displayName: 'Reference',
    name: 'reference',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['subject'], operation: ['create', 'update'] } },
  },
  {
    displayName: 'Status',
    name: 'status',
    type: 'string',
    default: 'active',
    displayOptions: { show: { resource: ['subject'], operation: ['create', 'update'] } },
  },
];
