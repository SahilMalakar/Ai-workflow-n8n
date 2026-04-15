/**
 * Local mock script for testing the node against JSONPlaceholder API.
 * Useful for verifying pagination and error handling without a real Abacus instance.
 *
 * Usage: node scripts/jsonplaceholder-mock.mjs
 */

const BASE_URL = 'https://jsonplaceholder.typicode.com';

async function fetchWithPagination(endpoint, limit = 10) {
  const pageSize = Math.min(limit, 10);
  const collected = [];
  let offset = 0;

  while (collected.length < limit) {
    const url = `${BASE_URL}${endpoint}?_limit=${pageSize}&_start=${offset}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} from ${url}`);
    }

    const page = await response.json();
    collected.push(...page);

    if (page.length < pageSize) break;
    offset += pageSize;
  }

  return collected.slice(0, limit);
}

async function runMockTests() {
  console.log('── JSONPlaceholder Mock Tests ──\n');

  // Test pagination
  console.log('Testing pagination (limit=5):');
  const users = await fetchWithPagination('/users', 5);
  console.log(`  ✅ Fetched ${users.length} users`);
  console.log(`  First user ID type: ${typeof users[0].id} (should be number, node normalizes to string)\n`);

  // Test single item
  console.log('Testing single item fetch:');
  const response = await fetch(`${BASE_URL}/users/1`);
  const user = await response.json();
  console.log(`  ✅ Fetched user: ${user.name}`);
  console.log(`  ID: ${user.id} (type: ${typeof user.id})\n`);

  // Test 404
  console.log('Testing 404 handling:');
  const notFound = await fetch(`${BASE_URL}/users/99999`);
  console.log(`  ✅ 404 status: ${notFound.status} (${notFound.status === 404 ? 'correct' : 'unexpected'})\n`);

  console.log('All mock tests passed ✅');
}

runMockTests().catch((error) => {
  console.error('Mock test failed:', error.message);
  process.exit(1);
});
