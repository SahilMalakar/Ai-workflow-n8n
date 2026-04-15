import type {
  IExecuteFunctions,
  IDataObject,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

import { flattenObject, normalizeResponseData } from './GenericFunctions';

// ── Descriptions ──────────────────────────────────────────────────────────────
import { addressOperations, addressFields } from './descriptions/AddressDescription';
import { customerOperations, customerFields } from './descriptions/CustomerDescription';
import { invoiceOperations, invoiceFields } from './descriptions/InvoiceDescription';
import { orderOperations, orderFields } from './descriptions/OrderDescription';
import { projectOperations, projectFields } from './descriptions/ProjectDescription';
import { subjectOperations, subjectFields } from './descriptions/SubjectDescription';
import { paymentOperations, paymentFields } from './descriptions/PaymentDescription';
import { deliveryNoteOperations, deliveryNoteFields } from './descriptions/DeliveryNoteDescription';
import { financialAccountOperations, financialAccountFields } from './descriptions/FinancialAccountDescription';
import { itemOperations, itemFields } from './descriptions/ItemDescription';

// ── Services ──────────────────────────────────────────────────────────────────
import * as addressService from './services/address.service';
import * as customerService from './services/customer.service';
import * as invoiceService from './services/invoice.service';
import * as orderService from './services/order.service';
import * as projectService from './services/project.service';
import * as subjectService from './services/subject.service';
import * as paymentService from './services/payment.service';
import * as deliveryNoteService from './services/delivery-note.service';
import * as financialAccountService from './services/financial-account.service';
import * as itemService from './services/item.service';

export class Abacus implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Abacus ERP',
    name: 'abacus',
    icon: 'file:abacus.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Abacus ERP REST API',
    defaults: {
      name: 'Abacus ERP',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'abacusApi',
        required: true,
      },
    ],
    properties: [
      // ── Resource selector ────────────────────────────────────────────────
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
      },

      // ── Operations & fields per resource ─────────────────────────────────
      ...addressOperations,
      ...addressFields,
      ...customerOperations,
      ...customerFields,
      ...invoiceOperations,
      ...invoiceFields,
      ...orderOperations,
      ...orderFields,
      ...projectOperations,
      ...projectFields,
      ...subjectOperations,
      ...subjectFields,
      ...paymentOperations,
      ...paymentFields,
      ...deliveryNoteOperations,
      ...deliveryNoteFields,
      ...financialAccountOperations,
      ...financialAccountFields,
      ...itemOperations,
      ...itemFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const inputItems = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let itemIndex = 0; itemIndex < inputItems.length; itemIndex++) {
      try {
        const resource = this.getNodeParameter('resource', itemIndex) as string;
        const operation = this.getNodeParameter('operation', itemIndex) as string;

        let result: unknown;

        switch (resource) {
          case 'address':
            result = await executeAddressOperation(this, operation);
            break;
          case 'customer':
            result = await executeCustomerOperation(this, operation);
            break;
          case 'invoice':
            result = await executeInvoiceOperation(this, operation);
            break;
          case 'order':
            result = await executeOrderOperation(this, operation);
            break;
          case 'project':
            result = await executeProjectOperation(this, operation);
            break;
          case 'subject':
            result = await executeSubjectOperation(this, operation);
            break;
          case 'payment':
            result = await executePaymentOperation(this, operation);
            break;
          case 'deliveryNote':
            result = await executeDeliveryNoteOperation(this, operation);
            break;
          case 'financialAccount':
            result = await executeFinancialAccountOperation(this, operation);
            break;
          case 'item':
            result = await executeItemOperation(this, operation);
            break;
          default:
            throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
        }

        // Normalize then flatten each result for n8n expression compatibility
        if (Array.isArray(result)) {
          returnData.push(...result.map((item) => ({
            json: flattenObject(normalizeResponseData(item as IDataObject)),
          })));
        } else {
          returnData.push({ json: flattenObject(normalizeResponseData(result as IDataObject)) });
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message }, pairedItem: itemIndex });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}

// ── Operation routers (keeps execute() clean) ─────────────────────────────────

async function executeAddressOperation(context: IExecuteFunctions, operation: string) {
  switch (operation) {
    case 'get': return addressService.getAddress(context);
    case 'getAll': return addressService.getAllAddresses(context);
    case 'create': return addressService.createAddress(context);
    case 'update': return addressService.updateAddress(context);
    case 'delete': return addressService.deleteAddress(context);
    default: throw new NodeOperationError(context.getNode(), `Unknown address operation: ${operation}`);
  }
}

async function executeCustomerOperation(context: IExecuteFunctions, operation: string) {
  switch (operation) {
    case 'get': return customerService.getCustomer(context);
    case 'getAll': return customerService.getAllCustomers(context);
    case 'create': return customerService.createCustomer(context);
    case 'update': return customerService.updateCustomer(context);
    default: throw new NodeOperationError(context.getNode(), `Unknown customer operation: ${operation}`);
  }
}

async function executeInvoiceOperation(context: IExecuteFunctions, operation: string) {
  switch (operation) {
    case 'get': return invoiceService.getInvoice(context);
    case 'getAll': return invoiceService.getAllInvoices(context);
    case 'create': return invoiceService.createInvoice(context);
    case 'update': return invoiceService.updateInvoice(context);
    case 'delete': return invoiceService.deleteInvoice(context);
    default: throw new NodeOperationError(context.getNode(), `Unknown invoice operation: ${operation}`);
  }
}

async function executeOrderOperation(context: IExecuteFunctions, operation: string) {
  switch (operation) {
    case 'get': return orderService.getOrder(context);
    case 'getAll': return orderService.getAllOrders(context);
    case 'create': return orderService.createOrder(context);
    case 'update': return orderService.updateOrder(context);
    case 'delete': return orderService.deleteOrder(context);
    default: throw new NodeOperationError(context.getNode(), `Unknown order operation: ${operation}`);
  }
}

async function executeProjectOperation(context: IExecuteFunctions, operation: string) {
  switch (operation) {
    case 'get': return projectService.getProject(context);
    case 'getAll': return projectService.getAllProjects(context);
    case 'create': return projectService.createProject(context);
    case 'update': return projectService.updateProject(context);
    case 'delete': return projectService.deleteProject(context);
    default: throw new NodeOperationError(context.getNode(), `Unknown project operation: ${operation}`);
  }
}

async function executeSubjectOperation(context: IExecuteFunctions, operation: string) {
  switch (operation) {
    case 'get': return subjectService.getSubject(context);
    case 'getAll': return subjectService.getAllSubjects(context);
    case 'create': return subjectService.createSubject(context);
    case 'update': return subjectService.updateSubject(context);
    case 'delete': return subjectService.deleteSubject(context);
    default: throw new NodeOperationError(context.getNode(), `Unknown subject operation: ${operation}`);
  }
}

async function executePaymentOperation(context: IExecuteFunctions, operation: string) {
  switch (operation) {
    case 'get': return paymentService.getPayment(context);
    case 'getAll': return paymentService.getAllPayments(context);
    case 'create': return paymentService.createPayment(context);
    case 'update': return paymentService.updatePayment(context);
    case 'delete': return paymentService.deletePayment(context);
    default: throw new NodeOperationError(context.getNode(), `Unknown payment operation: ${operation}`);
  }
}

async function executeDeliveryNoteOperation(context: IExecuteFunctions, operation: string) {
  switch (operation) {
    case 'get': return deliveryNoteService.getDeliveryNote(context);
    case 'getAll': return deliveryNoteService.getAllDeliveryNotes(context);
    case 'create': return deliveryNoteService.createDeliveryNote(context);
    case 'update': return deliveryNoteService.updateDeliveryNote(context);
    case 'delete': return deliveryNoteService.deleteDeliveryNote(context);
    default: throw new NodeOperationError(context.getNode(), `Unknown deliveryNote operation: ${operation}`);
  }
}

async function executeFinancialAccountOperation(context: IExecuteFunctions, operation: string) {
  switch (operation) {
    case 'get': return financialAccountService.getFinancialAccount(context);
    case 'getAll': return financialAccountService.getAllFinancialAccounts(context);
    case 'create': return financialAccountService.createFinancialAccount(context);
    case 'update': return financialAccountService.updateFinancialAccount(context);
    case 'delete': return financialAccountService.deleteFinancialAccount(context);
    default: throw new NodeOperationError(context.getNode(), `Unknown financialAccount operation: ${operation}`);
  }
}

async function executeItemOperation(context: IExecuteFunctions, operation: string) {
  switch (operation) {
    case 'get': return itemService.getItem(context);
    case 'getAll': return itemService.getAllItems(context);
    case 'create': return itemService.createItem(context);
    case 'update': return itemService.updateItem(context);
    case 'delete': return itemService.deleteItem(context);
    default: throw new NodeOperationError(context.getNode(), `Unknown item operation: ${operation}`);
  }
}
