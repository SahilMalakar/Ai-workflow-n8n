import type { INodeProperties } from 'n8n-workflow';

export const customerOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['customer'] } },
    options: [
      { name: 'Create', value: 'create', action: 'Create a customer' },
      { name: 'Get', value: 'get', action: 'Get a customer' },
      { name: 'Get All', value: 'getAll', action: 'Get all customers' },
      { name: 'Update', value: 'update', action: 'Update a customer' },
    ],
    default: 'getAll',
  },
];

export const customerFields: INodeProperties[] = [
  // ── Customer ID ───────────────────────────────────────────────────────────
  {
    displayName: 'Customer ID',
    name: 'customerId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['customer'], operation: ['get', 'update'] } },
    description: 'The unique identifier of the customer',
  },

  // ── Limit + Search (getAll) ───────────────────────────────────────────────
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1, maxValue: 500 },
    default: 100,
    displayOptions: { show: { resource: ['customer'], operation: ['getAll'] } },
  },
  {
    displayName: 'Search',
    name: 'search',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['customer'], operation: ['getAll'] } },
    description: 'Filter customers by name or email',
  },

  // ── Create / Update fields ────────────────────────────────────────────────
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['customer'], operation: ['create', 'update'] } },
  },
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    placeholder: 'name@company.com',
    default: '',
    displayOptions: { show: { resource: ['customer'], operation: ['create', 'update'] } },
  },
  {
    displayName: 'Address ID',
    name: 'addressId',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['customer'], operation: ['create', 'update'] } },
    description: 'Link this customer to an existing address',
  },
];
