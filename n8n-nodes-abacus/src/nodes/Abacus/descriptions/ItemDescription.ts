import type { INodeProperties } from 'n8n-workflow';

export const itemOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['item'] } },
    options: [
      { name: 'Create', value: 'create', action: 'Create an item' },
      { name: 'Delete', value: 'delete', action: 'Delete an item' },
      { name: 'Get', value: 'get', action: 'Get an item' },
      { name: 'Get All', value: 'getAll', action: 'Get all items' },
      { name: 'Update', value: 'update', action: 'Update an item' },
    ],
    default: 'getAll',
  },
];

export const itemFields: INodeProperties[] = [
  {
    displayName: 'Item ID',
    name: 'itemId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['item'], operation: ['get', 'update', 'delete'] } },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1, maxValue: 500 },
    default: 100,
    displayOptions: { show: { resource: ['item'], operation: ['getAll'] } },
  },
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['item'], operation: ['create', 'update'] } },
  },
  {
    displayName: 'Category',
    name: 'category',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['item'], operation: ['create', 'update'] } },
  },
  {
    displayName: 'Unit Price',
    name: 'unitPrice',
    type: 'number',
    typeOptions: { minValue: 0 },
    default: 0,
    displayOptions: { show: { resource: ['item'], operation: ['create', 'update'] } },
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
    displayOptions: { show: { resource: ['item'], operation: ['create', 'update'] } },
  },
];
