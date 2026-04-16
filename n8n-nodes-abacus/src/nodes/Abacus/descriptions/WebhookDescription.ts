import type { INodeProperties } from 'n8n-workflow';

export const webhookOperations: INodeProperties[] = [
  {
    displayName: 'Resource',
    name: 'resource',
    type: 'options',
    noDataExpression: true,
    options: [
      { name: 'Address', value: 'address' },
      { name: 'Customer', value: 'customer' },
      { name: 'Delivery Note', value: 'deliveryNote' },
      { name: 'Financial Account', value: 'financialAccount' },
      { name: 'Invoice', value: 'invoice' },
      { name: 'Item', value: 'item' },
      { name: 'Order', value: 'order' },
      { name: 'Payment', value: 'payment' },
      { name: 'Project', value: 'project' },
      { name: 'Subject', value: 'subject' },
    ],
    default: 'customer',
    description: 'The resource that will trigger the webhook',
  },
  {
    displayName: 'Event',
    name: 'event',
    type: 'options',
    noDataExpression: true,
    options: [
      { name: 'Created', value: 'created' },
      { name: 'Updated', value: 'updated' },
      { name: 'Deleted', value: 'deleted' },
    ],
    default: 'created',
    description: 'The event that will trigger the webhook',
  },
];
