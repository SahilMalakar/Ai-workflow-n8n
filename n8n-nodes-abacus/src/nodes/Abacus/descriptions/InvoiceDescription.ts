import type { INodeProperties } from 'n8n-workflow';

export const invoiceOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['invoice'] } },
    options: [
      { name: 'Create', value: 'create', action: 'Create an invoice' },
      { name: 'Delete', value: 'delete', action: 'Delete an invoice' },
      { name: 'Get', value: 'get', action: 'Get an invoice' },
      { name: 'Get All', value: 'getAll', action: 'Get all invoices' },
      { name: 'Update', value: 'update', action: 'Update an invoice' },
    ],
    default: 'getAll',
  },
];

export const invoiceFields: INodeProperties[] = [
  {
    displayName: 'Invoice ID',
    name: 'invoiceId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['invoice'], operation: ['get', 'update', 'delete'] } },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1, maxValue: 500 },
    default: 100,
    displayOptions: { show: { resource: ['invoice'], operation: ['getAll'] } },
  },
  {
    displayName: 'Customer ID',
    name: 'customerId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['invoice'], operation: ['create'] } },
  },
  {
    displayName: 'Amount',
    name: 'amount',
    type: 'number',
    typeOptions: { minValue: 0.01 },
    default: 0,
    displayOptions: { show: { resource: ['invoice'], operation: ['create', 'update'] } },
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
    displayOptions: { show: { resource: ['invoice'], operation: ['create', 'update'] } },
  },
  {
    displayName: 'Status',
    name: 'status',
    type: 'options',
    options: [
      { name: 'Open', value: 'open' },
      { name: 'Paid', value: 'paid' },
      { name: 'Cancelled', value: 'cancelled' },
    ],
    default: 'open',
    displayOptions: { show: { resource: ['invoice'], operation: ['create', 'update'] } },
  },
];
