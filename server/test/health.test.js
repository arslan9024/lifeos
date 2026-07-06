import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { config } from '../src/config/env.js';

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
