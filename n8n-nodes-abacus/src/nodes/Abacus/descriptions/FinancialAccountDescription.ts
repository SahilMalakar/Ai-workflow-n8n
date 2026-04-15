import type { INodeProperties } from 'n8n-workflow';

export const financialAccountOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['financialAccount'] } },
    options: [
      { name: 'Create', value: 'create', action: 'Create a financial account' },
      { name: 'Delete', value: 'delete', action: 'Delete a financial account' },
      { name: 'Get', value: 'get', action: 'Get a financial account' },
      { name: 'Get All', value: 'getAll', action: 'Get all financial accounts' },
      { name: 'Update', value: 'update', action: 'Update a financial account' },
    ],
    default: 'getAll',
  },
];

export const financialAccountFields: INodeProperties[] = [
  {
    displayName: 'Account ID',
    name: 'financialAccountId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['financialAccount'], operation: ['get', 'update', 'delete'] } },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1, maxValue: 500 },
    default: 100,
    displayOptions: { show: { resource: ['financialAccount'], operation: ['getAll'] } },
  },
  {
    displayName: 'Account Number',
    name: 'accountNumber',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['financialAccount'], operation: ['create', 'update'] } },
  },
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['financialAccount'], operation: ['create', 'update'] } },
  },
  {
    displayName: 'Type',
    name: 'type',
    type: 'options',
    options: [
      { name: 'Asset', value: 'asset' },
      { name: 'Liability', value: 'liability' },
      { name: 'Equity', value: 'equity' },
      { name: 'Revenue', value: 'revenue' },
      { name: 'Expense', value: 'expense' },
    ],
    default: 'asset',
    displayOptions: { show: { resource: ['financialAccount'], operation: ['create', 'update'] } },
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
    displayOptions: { show: { resource: ['financialAccount'], operation: ['create', 'update'] } },
  },
  {
    displayName: 'IBAN',
    name: 'iban',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['financialAccount'], operation: ['create', 'update'] } },
  },
];
