import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || "3000", 10),
  N8N_BASE_URL: process.env.N8N_BASE_URL || "http://localhost:5678",
  ABACUS_BASE_URL: process.env.ABACUS_BASE_URL || "http://127.0.0.1:8000",
  ABACUS_MOCK_TOKEN: process.env.ABACUS_MOCK_TOKEN || "mock_token_123",

  // Auth
  N8N_WEBHOOK_AUTH_TOKEN: process.env.N8N_WEBHOOK_AUTH_TOKEN || "/webhook/token",
  N8N_WEBHOOK_AUTH_INFO: process.env.N8N_WEBHOOK_AUTH_INFO || "/webhook/info",

  // Addresses
  N8N_WEBHOOK_ADDRESS_GET_ALL: process.env.N8N_WEBHOOK_ADDRESS_GET_ALL || "/webhook/addresses",
  N8N_WEBHOOK_ADDRESS_GET: process.env.N8N_WEBHOOK_ADDRESS_GET || "/webhook/addresses/:id",
  N8N_WEBHOOK_ADDRESS_CREATE: process.env.N8N_WEBHOOK_ADDRESS_CREATE || "/webhook/addresses",
  N8N_WEBHOOK_ADDRESS_UPDATE: process.env.N8N_WEBHOOK_ADDRESS_UPDATE || "/webhook/addresses/:id",
  N8N_WEBHOOK_ADDRESS_DELETE: process.env.N8N_WEBHOOK_ADDRESS_DELETE || "/webhook/addresses/:id",

  // Customers
  N8N_WEBHOOK_CUSTOMER_GET_ALL: process.env.N8N_WEBHOOK_CUSTOMER_GET_ALL || "/webhook/customers",
  N8N_WEBHOOK_CUSTOMER_GET: process.env.N8N_WEBHOOK_CUSTOMER_GET || "/webhook/customers/:id",
  N8N_WEBHOOK_CUSTOMER_CREATE: process.env.N8N_WEBHOOK_CUSTOMER_CREATE || "/webhook/customers",
  N8N_WEBHOOK_CUSTOMER_UPDATE: process.env.N8N_WEBHOOK_CUSTOMER_UPDATE || "/webhook/customers/:id",
  N8N_WEBHOOK_CUSTOMER_DELETE: process.env.N8N_WEBHOOK_CUSTOMER_DELETE || "/webhook/customers/:id",

  // Orders
  N8N_WEBHOOK_ORDER_GET_ALL: process.env.N8N_WEBHOOK_ORDER_GET_ALL || "/webhook/orders",
  N8N_WEBHOOK_ORDER_GET: process.env.N8N_WEBHOOK_ORDER_GET || "/webhook/orders/:id",
  N8N_WEBHOOK_ORDER_CREATE: process.env.N8N_WEBHOOK_ORDER_CREATE || "/webhook/orders",
  N8N_WEBHOOK_ORDER_UPDATE: process.env.N8N_WEBHOOK_ORDER_UPDATE || "/webhook/orders/:id",
  N8N_WEBHOOK_ORDER_DELETE: process.env.N8N_WEBHOOK_ORDER_DELETE || "/webhook/orders/:id",

  // Invoices
  N8N_WEBHOOK_INVOICE_GET_ALL: process.env.N8N_WEBHOOK_INVOICE_GET_ALL || "/webhook/invoices",
  N8N_WEBHOOK_INVOICE_GET: process.env.N8N_WEBHOOK_INVOICE_GET || "/webhook/invoices/:id",
  N8N_WEBHOOK_INVOICE_CREATE: process.env.N8N_WEBHOOK_INVOICE_CREATE || "/webhook/invoices",
  N8N_WEBHOOK_INVOICE_UPDATE: process.env.N8N_WEBHOOK_INVOICE_UPDATE || "/webhook/invoices/:id",
  N8N_WEBHOOK_INVOICE_DELETE: process.env.N8N_WEBHOOK_INVOICE_DELETE || "/webhook/invoices/:id",

  // Projects
  N8N_WEBHOOK_PROJECT_GET_ALL: process.env.N8N_WEBHOOK_PROJECT_GET_ALL || "/webhook/projects",
  N8N_WEBHOOK_PROJECT_GET: process.env.N8N_WEBHOOK_PROJECT_GET || "/webhook/projects/:id",
  N8N_WEBHOOK_PROJECT_CREATE: process.env.N8N_WEBHOOK_PROJECT_CREATE || "/webhook/projects",
  N8N_WEBHOOK_PROJECT_UPDATE: process.env.N8N_WEBHOOK_PROJECT_UPDATE || "/webhook/projects/:id",
  N8N_WEBHOOK_PROJECT_DELETE: process.env.N8N_WEBHOOK_PROJECT_DELETE || "/webhook/projects/:id",
};
