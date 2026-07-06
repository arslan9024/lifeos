import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { config } from '../src/config/env.js';

process.env.REQUEST_LOGGING = 'false';

const app = createApp(config);

test('GET /api/health returns expected health payload', async () => {
  const response = await request(app).get('/api/health').expect(200);

  assert.equal(response.body.ok, true);
  assert.equal(response.body.service, 'lifeos-server');
  assert.equal(typeof response.body.environment, 'string');
  assert.equal(typeof response.body.uptimeSeconds, 'number');
  assert.equal(typeof response.body.shuttingDown, 'boolean');
});

test('GET /api/health/live returns live status', async () => {
  const response = await request(app).get('/api/health/live').expect(200);

  assert.equal(response.body.ok, true);
  assert.equal(response.body.status, 'live');
});

test('GET unknown API route returns structured 404 with requestId', async () => {
  const response = await request(app).get('/api/not-real').expect(404);

  assert.equal(response.body.ok, false);
  assert.equal(response.body.error, 'Not Found');
  assert.ok(response.body.requestId);
});

test('Invalid JSON returns 400 INVALID_JSON with requestId', async () => {
  const response = await request(app)
    .post('/api/legacy')
    .set('Content-Type', 'application/json')
    .send('{invalid-json')
    .expect(400);

  assert.equal(response.body.ok, false);
  assert.equal(response.body.code, 'INVALID_JSON');
  assert.ok(response.body.requestId);
});

test('Shutting down mode returns 503 for non-health routes', async () => {
  const shuttingDownApp = createApp(config);
  shuttingDownApp.locals.isShuttingDown = true;

  const response = await request(shuttingDownApp).get('/api/legacy').expect(503);

  assert.equal(response.body.ok, false);
  assert.equal(response.body.error, 'Service Unavailable');
  assert.equal(response.body.reason, 'Server is shutting down');
  assert.ok(response.body.requestId);
});

test('Readiness endpoint returns 503 not-ready during shutdown', async () => {
  const shuttingDownApp = createApp(config);
  shuttingDownApp.locals.isShuttingDown = true;

  const response = await request(shuttingDownApp).get('/api/health/ready').expect(503);

  assert.equal(response.body.ok, false);
  assert.equal(response.body.status, 'not-ready');
  assert.equal(response.body.reason, 'Server is shutting down');
});

test('Disallowed CORS origin returns 403 with CORS_ORIGIN_DENIED code', async () => {
  const strictCorsApp = createApp({
    ...config,
    clientOrigins: ['http://allowed.local'],
  });

  const response = await request(strictCorsApp)
    .get('/api/health')
    .set('Origin', 'http://blocked.local')
    .expect(403);

  assert.equal(response.body.ok, false);
  assert.equal(response.body.code, 'CORS_ORIGIN_DENIED');
  assert.ok(response.body.requestId);
});

test('Payload over JSON_BODY_LIMIT returns 413 PAYLOAD_TOO_LARGE with requestId', async () => {
  const tinyBodyApp = createApp({
    ...config,
    jsonBodyLimit: '10b',
  });

  const response = await request(tinyBodyApp)
    .post('/api/legacy')
    .set('Content-Type', 'application/json')
    .send({ value: 'this payload is intentionally too large' })
    .expect(413);

  assert.equal(response.body.ok, false);
  assert.equal(response.body.code, 'PAYLOAD_TOO_LARGE');
  assert.ok(response.body.requestId);
});

test('Rate limiter returns 429 RATE_LIMIT_EXCEEDED with requestId', async () => {
  const strictRateLimitApp = createApp({
    ...config,
    rateLimitMax: 1,
    rateLimitWindowMs: 60_000,
  });

  await request(strictRateLimitApp).get('/api/health').expect(200);

  const response = await request(strictRateLimitApp).get('/api/health').expect(429);

  assert.equal(response.body.ok, false);
  assert.equal(response.body.error, 'Too many requests');
  assert.equal(response.body.code, 'RATE_LIMIT_EXCEEDED');
  assert.ok(response.body.requestId);
});

test('Helmet security headers are present on API responses', async () => {
  const response = await request(app).get('/api/health').expect(200);

  assert.equal(response.headers['x-dns-prefetch-control'], 'off');
  assert.equal(response.headers['x-frame-options'], 'SAMEORIGIN');
  assert.equal(response.headers['x-content-type-options'], 'nosniff');
});

test('Express x-powered-by header is disabled', async () => {
  const response = await request(app).get('/api/health').expect(200);

  assert.equal(response.headers['x-powered-by'], undefined);
});

test('Allowed CORS origin gets explicit allow-origin and credentials headers', async () => {
  const corsAllowedApp = createApp({
    ...config,
    clientOrigins: ['http://allowed.local'],
  });

  const response = await request(corsAllowedApp)
    .get('/api/health')
    .set('Origin', 'http://allowed.local')
    .expect(200);

  assert.equal(response.headers['access-control-allow-origin'], 'http://allowed.local');
  assert.equal(response.headers['access-control-allow-credentials'], 'true');
});
