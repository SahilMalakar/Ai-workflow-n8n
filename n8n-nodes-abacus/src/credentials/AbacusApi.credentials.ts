import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class AbacusApi implements ICredentialType {
  name = 'abacusApi';
  displayName = 'Abacus ERP API';
  documentationUrl = 'https://apihub.abacus.ch/rest';

  extends = ['oAuth2Api'];

  properties: INodeProperties[] = [
    // ── Instance ──────────────────────────────────────────────────────────────
    {
      displayName: 'Instance URL',
      name: 'instanceUrl',
      type: 'string',
      default: 'https://your-company.abacus.ch',
      placeholder: 'https://your-company.abacus.ch',
      description: 'The base URL of your Abacus ERP instance',
      required: true,
    },

    // ── OAuth2 overrides (hidden from user, auto-populated) ───────────────────
    {
      displayName: 'Grant Type',
      name: 'grantType',
      type: 'hidden',
      default: 'clientCredentials',
    },
    {
      displayName: 'Auth URI',
      name: 'authUrl',
      type: 'hidden',
      default: '={{$self["instanceUrl"]}}/oauth/token',
    },
    {
      displayName: 'Access Token URL',
      name: 'accessTokenUrl',
      type: 'hidden',
      default: '={{$self["instanceUrl"]}}/oauth/token',
    },
    {
      displayName: 'Authentication',
      name: 'authentication',
      type: 'hidden',
      default: 'body',
    },

    // ── User-facing fields ────────────────────────────────────────────────────
    {
      displayName: 'Client ID',
      name: 'clientId',
      type: 'string',
      default: '',
      required: true,
    },
    {
      displayName: 'Client Secret',
      name: 'clientSecret',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
    },
    {
      displayName: 'Ignore SSL Issues',
      name: 'ignoreSSLIssues',
      type: 'boolean',
      default: false,
      description: 'Whether to ignore SSL certificate errors (use only for local development)',
    },
  ];

  // n8n calls this to verify the credential is working
  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.instanceUrl}}',
      url: '/.well-known/openid-configuration',
      method: 'GET',
    },
  };
}
