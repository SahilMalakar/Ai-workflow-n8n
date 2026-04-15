/**
 * Integration tests against the local Abacus mock server.
 *
 * Prerequisites:
 *   - Mock server running: uvicorn app.main:app --reload (in abacus-mock-server/)
 *
 * Usage: node tests/mock-server.test.mjs
 */

const BASE_URL = 'http://localhost:8000';
const API_BASE = `${BASE_URL}/rest/v1`;

let passed = 0;
let failed = 0;
let TOKEN = '';

// ── Test runner ───────────────────────────────────────────────────────────────

function assert(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.log(`  ❌ ${label}${detail ? ` — ${detail}` : ''}`);
    failed++;
  }
}

async function request(method, path, body = null, headers = {}) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      ...headers,
    },
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_BASE}${path}`, options);
  let json = null;
  try {
    json = await response.json();
  } catch {
    // 204 No Content has no body
  }
  return { status: response.status, json };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

async function testAuth() {
  console.log('\n── Authentication ──');

  // OpenID discovery
  const discovery = await fetch(`${BASE_URL}/.well-known/openid-configuration`);
  const config = await discovery.json();
  assert('OpenID config returns 200', discovery.status === 200);
  assert('token_endpoint present', typeof config.token_endpoint === 'string');
  assert('api_endpoint present', typeof config.api_endpoint === 'string');

  // Token acquisition (form data — as n8n sends it)
  const tokenResponse = await fetch(`${BASE_URL}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials&client_id=demo_client&client_secret=demo_secret',
  });
  const tokenData = await tokenResponse.json();
  assert('Token endpoint returns 200', tokenResponse.status === 200);
  assert('access_token present', typeof tokenData.access_token === 'string');
  assert('token_type is bearer', tokenData.token_type === 'bearer');
  assert('expires_in is number', typeof tokenData.expires_in === 'number');
  TOKEN = tokenData.access_token;

  // Invalid credentials
  const badToken = await fetch(`${BASE_URL}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials&client_id=wrong&client_secret=wrong',
  });
  assert('Invalid credentials returns 401', badToken.status === 401);

  // Protected endpoint without token
  const noAuth = await fetch(`${API_BASE}/info`);
  assert('No token returns 403', noAuth.status === 403);
}

async function testAddresses() {
  console.log('\n── Addresses ──');

  // Create
  const { status: createStatus, json: created } = await request('POST', '/addresses/', {
    firstName: 'Test',
    lastName: 'User',
    street: 'Teststrasse 1',
    zip: '8001',
    city: 'Zurich',
  });
  assert('Create address returns 201', createStatus === 201);
  assert('Response has success:true', created?.success === true);
  assert('ID is a string', typeof created?.data?.id === 'string');
  assert('createdAt is present', typeof created?.data?.createdAt === 'string');

  const addressId = created?.data?.id;

  // Get by ID
  const { status: getStatus, json: fetched } = await request('GET', `/addresses/${addressId}`);
  assert('Get address returns 200', getStatus === 200);
  assert('Fetched correct address', fetched?.data?.id === addressId);

  // List with pagination
  const { status: listStatus, json: list } = await request('GET', '/addresses/?limit=5&offset=0');
  assert('List addresses returns 200', listStatus === 200);
  assert('Response has items array', Array.isArray(list?.data?.items));
  assert('Response has total count', typeof list?.data?.total === 'number');

  // Update (PATCH)
  const { status: patchStatus, json: updated } = await request('PATCH', `/addresses/${addressId}`, {
    city: 'Basel',
  });
  assert('Update address returns 200', patchStatus === 200);
  assert('City was updated', updated?.data?.city === 'Basel');

  // 404 for nonexistent
  const { status: notFoundStatus } = await request('GET', '/addresses/nonexistent-id');
  assert('Nonexistent address returns 404', notFoundStatus === 404);

  // Delete
  const { status: deleteStatus } = await request('DELETE', `/addresses/${addressId}`);
  assert('Delete address returns 204', deleteStatus === 204);

  // Confirm deleted
  const { status: afterDeleteStatus } = await request('GET', `/addresses/${addressId}`);
  assert('Deleted address returns 404', afterDeleteStatus === 404);
}

async function testCustomers() {
  console.log('\n── Customers ──');

  const uniqueEmail = `test-${Date.now()}@example.com`;

  // Create
  const { status: createStatus, json: created } = await request('POST', '/customers/', {
    name: 'Test Company AG',
    email: uniqueEmail,
  });
  assert('Create customer returns 201', createStatus === 201);
  assert('ID starts with CUST-', created?.data?.id?.startsWith('CUST-'));

  const customerId = created?.data?.id;

  // Get by ID
  const { status: getStatus } = await request('GET', `/customers/${customerId}`);
  assert('Get customer returns 200', getStatus === 200);

  // Search
  const { status: searchStatus, json: searchResult } = await request('GET', '/customers/?search=Test+Company');
  assert('Search returns 200', searchStatus === 200);
  assert('Search returns results', (searchResult?.data?.items?.length ?? 0) >= 1);

  // Duplicate email
  const { status: dupStatus } = await request('POST', '/customers/', {
    name: 'Duplicate',
    email: uniqueEmail,
  });
  assert('Duplicate email returns 409', dupStatus === 409);

  // Update
  const { status: patchStatus, json: updated } = await request('PATCH', `/customers/${customerId}`, {
    name: 'Updated Company GmbH',
  });
  assert('Update customer returns 200', patchStatus === 200);
  assert('Name was updated', updated?.data?.name === 'Updated Company GmbH');

  // No DELETE endpoint for customers
  const { status: deleteStatus } = await request('DELETE', `/customers/${customerId}`);
  assert('Customer DELETE returns 405 (not allowed)', deleteStatus === 405);
}

async function testInvoices() {
  console.log('\n── Invoices ──');

  // Need a customer first
  const { json: custData } = await request('POST', '/customers/', {
    name: 'Invoice Test Corp',
    email: `inv-${Date.now()}@example.com`,
  });
  const customerId = custData?.data?.id;

  const { status: createStatus, json: created } = await request('POST', '/invoices/', {
    customerId,
    amount: 1500.00,
    currency: 'CHF',
  });
  assert('Create invoice returns 201', createStatus === 201);
  assert('ID starts with INV-', created?.data?.id?.startsWith('INV-'));
  assert('Default status is open', created?.data?.status === 'open');
  assert('Currency is CHF', created?.data?.currency === 'CHF');

  const invoiceId = created?.data?.id;

  const { status: patchStatus, json: updated } = await request('PATCH', `/invoices/${invoiceId}`, {
    status: 'paid',
  });
  assert('Update invoice status returns 200', patchStatus === 200);
  assert('Status updated to paid', updated?.data?.status === 'paid');

  // FK validation
  const { status: badFkStatus } = await request('POST', '/invoices/', {
    customerId: 'CUST-INVALID',
    amount: 100,
  });
  assert('Invalid customerId returns 404', badFkStatus === 404);
}

async function testOrders() {
  console.log('\n── Orders ──');

  const { json: custData } = await request('POST', '/customers/', {
    name: 'Order Test Corp',
    email: `ord-${Date.now()}@example.com`,
  });
  const customerId = custData?.data?.id;

  const { status: createStatus, json: created } = await request('POST', '/orders/', {
    customerId,
    totalAmount: 999.50,
  });
  assert('Create order returns 201', createStatus === 201);
  assert('ID starts with ORD-', created?.data?.id?.startsWith('ORD-'));

  const orderId = created?.data?.id;

  const { status: deleteStatus } = await request('DELETE', `/orders/${orderId}`);
  assert('Delete order returns 204', deleteStatus === 204);
}

async function testProjects() {
  console.log('\n── Projects ──');

  const { json: custData } = await request('POST', '/customers/', {
    name: 'Project Test Corp',
    email: `proj-${Date.now()}@example.com`,
  });
  const customerId = custData?.data?.id;

  const { status: createStatus, json: created } = await request('POST', '/projects/', {
    projectName: 'ERP Migration',
    customerId,
    status: 'active',
  });
  assert('Create project returns 201', createStatus === 201);
  assert('ID starts with PROJ-', created?.data?.id?.startsWith('PROJ-'));
  assert('Default status is active', created?.data?.status === 'active');

  const projectId = created?.data?.id;

  const { status: patchStatus, json: updated } = await request('PATCH', `/projects/${projectId}`, {
    status: 'completed',
  });
  assert('Update project returns 200', patchStatus === 200);
  assert('Status updated to completed', updated?.data?.status === 'completed');
}

// ── Run all ───────────────────────────────────────────────────────────────────

async function runAllTests() {
  console.log('Abacus Mock Server — Integration Tests');
  console.log('======================================');
  console.log(`Target: ${BASE_URL}\n`);

  try {
    await testAuth();
    await testAddresses();
    await testCustomers();
    await testInvoices();
    await testOrders();
    await testProjects();
  } catch (error) {
    console.error('\nFatal error during tests:', error.message);
    process.exit(1);
  }

  const total = passed + failed;
  console.log(`\n${'='.repeat(40)}`);
  console.log(`  ${passed}/${total} passed  |  ${failed} failed`);
  console.log('='.repeat(40));

  if (failed > 0) process.exit(1);
}

runAllTests();
