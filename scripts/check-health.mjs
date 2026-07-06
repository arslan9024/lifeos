const baseUrl = process.env.LIFEOS_API_URL?.trim() || 'http://localhost:5000';

const endpoints = [
  { path: '/api/health', expectedStatus: 200, requiredKeys: ['ok', 'service', 'environment', 'uptimeSeconds'] },
  { path: '/api/health/live', expectedStatus: 200, requiredKeys: ['ok', 'status'] },
  { path: '/api/health/ready', expectedStatus: 200, requiredKeys: ['ok', 'status'] },
];

async function checkEndpoint({ path, expectedStatus, requiredKeys }) {
  const url = `${baseUrl}${path}`;
  const response = await fetch(url);

  if (response.status !== expectedStatus) {
    throw new Error(`${path} returned ${response.status} (expected ${expectedStatus})`);
  }

  const body = await response.json();

  for (const key of requiredKeys) {
    if (!(key in body)) {
      throw new Error(`${path} response is missing key: ${key}`);
    }
  }

  return { path, status: response.status, body };
}

async function run() {
  console.log(`[health-check] Base URL: ${baseUrl}`);

  for (const endpoint of endpoints) {
    const result = await checkEndpoint(endpoint);
    console.log(`[health-check] OK ${result.path} (${result.status})`);
  }

  console.log('[health-check] All health endpoints passed.');
}

run().catch((error) => {
  console.error('[health-check] FAILED', error.message);
  process.exit(1);
});
