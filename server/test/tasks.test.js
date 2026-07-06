import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { config } from '../src/config/env.js';

function createTestApp() {
  return createApp(config);
}

test('GET /api/tasks returns empty array by default', async () => {
  const app = createTestApp();
  const response = await request(app).get('/api/tasks').expect(200);

  assert.equal(response.body.ok, true);
  assert.deepEqual(response.body.data, []);
});

test('POST /api/tasks creates task with default priority', async () => {
  const app = createTestApp();
  const response = await request(app).post('/api/tasks').send({ title: 'Ship tasks module' }).expect(201);

  assert.equal(response.body.ok, true);
  assert.equal(response.body.data.title, 'Ship tasks module');
  assert.equal(response.body.data.priority, 'medium');
  assert.equal(response.body.data.isCompleted, false);
});

test('POST /api/tasks validates priority', async () => {
  const app = createTestApp();
  const response = await request(app).post('/api/tasks').send({ title: 'bad priority', priority: 'urgent' }).expect(400);

  assert.equal(response.body.ok, false);
  assert.equal(response.body.code, 'TASK_INVALID_PRIORITY');
  assert.ok(response.body.requestId);
});

test('PATCH /api/tasks/:taskId/toggle toggles completion state', async () => {
  const app = createTestApp();
  const created = await request(app).post('/api/tasks').send({ title: 'Toggle task' }).expect(201);

  const response = await request(app).patch(`/api/tasks/${created.body.data.id}/toggle`).send({}).expect(200);

  assert.equal(response.body.ok, true);
  assert.equal(response.body.data.isCompleted, true);
});

test('DELETE /api/tasks/:taskId removes task', async () => {
  const app = createTestApp();
  const created = await request(app).post('/api/tasks').send({ title: 'Remove task' }).expect(201);

  const deleted = await request(app).delete(`/api/tasks/${created.body.data.id}`).expect(200);

  assert.equal(deleted.body.ok, true);
  assert.equal(deleted.body.id, created.body.data.id);

  const list = await request(app).get('/api/tasks').expect(200);
  assert.deepEqual(list.body.data, []);
});
