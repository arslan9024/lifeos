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
