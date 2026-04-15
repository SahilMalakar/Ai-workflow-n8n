import type { INodeProperties } from 'n8n-workflow';

export const deliveryNoteOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['deliveryNote'] } },
    options: [
      { name: 'Create', value: 'create', action: 'Create a delivery note' },
      { name: 'Delete', value: 'delete', action: 'Delete a delivery note' },
      { name: 'Get', value: 'get', action: 'Get a delivery note' },
      { name: 'Get All', value: 'getAll', action: 'Get all delivery notes' },
      { name: 'Update', value: 'update', action: 'Update a delivery note' },
    ],
    default: 'getAll',
  },
];

export const deliveryNoteFields: INodeProperties[] = [
  {
    displayName: 'Delivery Note ID',
    name: 'deliveryNoteId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['deliveryNote'], operation: ['get', 'update', 'delete'] } },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1, maxValue: 500 },
    default: 100,
    displayOptions: { show: { resource: ['deliveryNote'], operation: ['getAll'] } },
  },
  {
    displayName: 'Customer ID',
    name: 'customerId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['deliveryNote'], operation: ['create'] } },
  },
  {
    displayName: 'Status',
    name: 'status',
    type: 'string',
    default: 'pending',
    displayOptions: { show: { resource: ['deliveryNote'], operation: ['create', 'update'] } },
  },
  {
    displayName: 'Delivery Date',
    name: 'deliveryDate',
    type: 'dateTime',
    default: '',
    displayOptions: { show: { resource: ['deliveryNote'], operation: ['create', 'update'] } },
  },
  {
    displayName: 'Note',
    name: 'note',
    type: 'string',
    typeOptions: { rows: 3 },
    default: '',
    displayOptions: { show: { resource: ['deliveryNote'], operation: ['create', 'update'] } },
  },
];
