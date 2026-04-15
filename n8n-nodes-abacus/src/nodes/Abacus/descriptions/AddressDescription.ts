import type { INodeProperties } from 'n8n-workflow';

export const addressOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['address'] } },
    options: [
      { name: 'Create', value: 'create', action: 'Create an address' },
      { name: 'Delete', value: 'delete', action: 'Delete an address' },
      { name: 'Get', value: 'get', action: 'Get an address' },
      { name: 'Get All', value: 'getAll', action: 'Get all addresses' },
      { name: 'Update', value: 'update', action: 'Update an address' },
    ],
    default: 'getAll',
  },
];

export const addressFields: INodeProperties[] = [
  // ── Address ID (get / update / delete) ────────────────────────────────────
  {
    displayName: 'Address ID',
    name: 'addressId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['address'], operation: ['get', 'update', 'delete'] } },
    description: 'The unique identifier of the address',
  },

  // ── Customer ID (optional nested routing) ─────────────────────────────────
  {
    displayName: 'Customer ID',
    name: 'customerId',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['address'], operation: ['create', 'get', 'update', 'delete', 'getAll'] } },
    description: 'If provided, uses the nested route /customers/{customerId}/addresses',
  },

  // ── Limit (getAll) ────────────────────────────────────────────────────────
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1, maxValue: 500 },
    default: 100,
    displayOptions: { show: { resource: ['address'], operation: ['getAll'] } },
    description: 'Maximum number of addresses to return',
  },

  // ── Create / Update fields ────────────────────────────────────────────────
  {
    displayName: 'First Name',
    name: 'firstName',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['address'], operation: ['create', 'update'] } },
  },
  {
    displayName: 'Last Name',
    name: 'lastName',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['address'], operation: ['create', 'update'] } },
  },
  {
    displayName: 'Street',
    name: 'street',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['address'], operation: ['create', 'update'] } },
  },
  {
    displayName: 'ZIP / Postal Code',
    name: 'zip',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['address'], operation: ['create', 'update'] } },
  },
  {
    displayName: 'City',
    name: 'city',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['address'], operation: ['create', 'update'] } },
  },
];
