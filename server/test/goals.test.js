import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { config } from '../src/config/env.js';

function createTestApp() {
  return createApp(config);
}

test('GET /api/goals returns empty array by default', async () => {
  const app = createTestApp();

  const response = await request(app).get('/api/goals').expect(200);

  assert.equal(response.body.ok, true);
  assert.deepEqual(response.body.data, []);
});

test('POST /api/goals creates a goal', async () => {
  const app = createTestApp();

  const response = await request(app)
    .post('/api/goals')
    .send({ title: 'Ship first persisted goals module', notes: 'Track progress in session notes' })
    .expect(201);

  assert.equal(response.body.ok, true);
  assert.equal(response.body.data.title, 'Ship first persisted goals module');
  assert.equal(response.body.data.isCompleted, false);
  assert.ok(response.body.data.id);
});

test('POST /api/goals validates required title', async () => {
  const app = createTestApp();

  const response = await request(app).post('/api/goals').send({ title: '   ' }).expect(400);

  assert.equal(response.body.ok, false);
  assert.equal(response.body.code, 'GOAL_TITLE_REQUIRED');
  assert.ok(response.body.requestId);
});

test('PATCH /api/goals/:goalId/toggle toggles completion state', async () => {
  const app = createTestApp();

  const created = await request(app).post('/api/goals').send({ title: 'Toggle me' }).expect(201);

  const response = await request(app).patch(`/api/goals/${created.body.data.id}/toggle`).send({}).expect(200);

  assert.equal(response.body.ok, true);
  assert.equal(response.body.data.isCompleted, true);
});

test('DELETE /api/goals/:goalId removes goal', async () => {
  const app = createTestApp();

  const created = await request(app).post('/api/goals').send({ title: 'Remove me' }).expect(201);

  const deleted = await request(app).delete(`/api/goals/${created.body.data.id}`).expect(200);

  assert.equal(deleted.body.ok, true);
  assert.equal(deleted.body.id, created.body.data.id);

  const list = await request(app).get('/api/goals').expect(200);
  assert.deepEqual(list.body.data, []);
});
