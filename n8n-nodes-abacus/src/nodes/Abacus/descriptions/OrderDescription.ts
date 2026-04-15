import type { INodeProperties } from 'n8n-workflow';

export const orderOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['order'] } },
    options: [
      { name: 'Create', value: 'create', action: 'Create an order' },
      { name: 'Delete', value: 'delete', action: 'Delete an order' },
      { name: 'Get', value: 'get', action: 'Get an order' },
      { name: 'Get All', value: 'getAll', action: 'Get all orders' },
      { name: 'Update', value: 'update', action: 'Update an order' },
    ],
    default: 'getAll',
  },
];

export const orderFields: INodeProperties[] = [
  {
    displayName: 'Order ID',
    name: 'orderId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['order'], operation: ['get', 'update', 'delete'] } },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1, maxValue: 500 },
    default: 100,
    displayOptions: { show: { resource: ['order'], operation: ['getAll'] } },
  },
  {
    displayName: 'Customer ID',
    name: 'customerId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['order'], operation: ['create'] } },
  },
  {
    displayName: 'Total Amount',
    name: 'totalAmount',
    type: 'number',
    typeOptions: { minValue: 0.01 },
    default: 0,
    displayOptions: { show: { resource: ['order'], operation: ['create', 'update'] } },
  },
];
