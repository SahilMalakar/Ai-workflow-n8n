import {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';

import { apiRequest } from './GenericFunctions';
import { webhookOperations } from './descriptions/WebhookDescription';

export class AbacusTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Abacus Trigger',
		name: 'abacusTrigger',
		icon: 'file:abacus.svg',
		group: ['trigger'],
		version: 1,
		description: 'Handle Abacus events via webhooks',
		defaults: {
			name: 'Abacus Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'abacusApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			...webhookOperations,
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				// In a real scenario, you might want to call the API to verify the webhook exists
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const resource = this.getNodeParameter('resource') as string;
				const event = this.getNodeParameter('event') as string;

				const endpoint = '/webhooks';
				const body: IDataObject = {
					resource,
					event,
					url: webhookUrl,
				};

				const response = await apiRequest(this, 'POST', endpoint, body);

				// Store the webhook ID so we can delete it later
				const webhookData = this.getWorkflowStaticData('node');
				webhookData.webhookId = response.id;

				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId) {
					const endpoint = `/webhooks/${webhookData.webhookId}`;
					try {
						await apiRequest(this, 'DELETE', endpoint);
					} catch (error) {
						// Even if it fails (e.g., already deleted), we return true to let n8n clean up
						return true;
					}
					delete webhookData.webhookId;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData();

		return {
			workflowData: [
				this.helpers.returnJsonArray(body),
			],
		};
	}
}
