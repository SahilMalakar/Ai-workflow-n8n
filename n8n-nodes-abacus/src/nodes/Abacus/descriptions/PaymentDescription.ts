import type { INodeProperties } from 'n8n-workflow';

export const paymentOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['payment'] } },
    options: [
      { name: 'Create', value: 'create', action: 'Create a payment' },
      { name: 'Delete', value: 'delete', action: 'Delete a payment' },
      { name: 'Get', value: 'get', action: 'Get a payment' },
      { name: 'Get All', value: 'getAll', action: 'Get all payments' },
      { name: 'Update', value: 'update', action: 'Update a payment' },
    ],
    default: 'getAll',
  },
];

export const paymentFields: INodeProperties[] = [
  {
    displayName: 'Payment ID',
    name: 'paymentId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['payment'], operation: ['get', 'update', 'delete'] } },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1, maxValue: 500 },
    default: 100,
    displayOptions: { show: { resource: ['payment'], operation: ['getAll'] } },
  },
  {
    displayName: 'Customer ID',
    name: 'customerId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['payment'], operation: ['create'] } },
  },
  {
    displayName: 'Amount',
    name: 'amount',
    type: 'number',
    typeOptions: { minValue: 0.01 },
    default: 0,
    displayOptions: { show: { resource: ['payment'], operation: ['create', 'update'] } },
  },
  {
    displayName: 'Currency',
    name: 'currency',
    type: 'options',
    options: [
      { name: 'CHF', value: 'CHF' },
      { name: 'EUR', value: 'EUR' },
      { name: 'USD', value: 'USD' },
    ],
    default: 'CHF',
    displayOptions: { show: { resource: ['payment'], operation: ['create', 'update'] } },
  },
  {
    displayName: 'Status',
    name: 'status',
    type: 'options',
    options: [
      { name: 'Pending', value: 'pending' },
      { name: 'Completed', value: 'completed' },
      { name: 'Failed', value: 'failed' },
    ],
    default: 'pending',
    displayOptions: { show: { resource: ['payment'], operation: ['create', 'update'] } },
  },
  {
    displayName: 'Payment Date',
    name: 'paymentDate',
    type: 'dateTime',
    default: '',
    displayOptions: { show: { resource: ['payment'], operation: ['create', 'update'] } },
  },
];
