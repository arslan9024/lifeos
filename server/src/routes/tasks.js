import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { ApiError } from '../errors/ApiError.js';

function normalizeText(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

function validateTitle(title) {
  const normalized = normalizeText(title);

  if (!normalized) {
    throw new ApiError(400, 'Task title is required', 'TASK_TITLE_REQUIRED');
  }

  if (normalized.length > 120) {
    throw new ApiError(400, 'Task title must be 120 characters or less', 'TASK_TITLE_TOO_LONG');
  }

  return normalized;
}

function validateOptionalText(value, maxLength, code) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return undefined;
  }

  if (normalized.length > maxLength) {
    throw new ApiError(400, `Field exceeds ${maxLength} characters`, code);
  }

  return normalized;
}

function validatePriority(value) {
  if (value == null || value === '') {
    return 'medium';
  }

  const normalized = normalizeText(value).toLowerCase();
  if (normalized === 'low' || normalized === 'medium' || normalized === 'high') {
    return normalized;
  }

  throw new ApiError(400, 'Priority must be low, medium, or high', 'TASK_INVALID_PRIORITY');
}

export function createTasksRouter() {
  const tasks = [];
  const router = Router();

  router.get('/', (_req, res) => {
    res.json({ ok: true, data: tasks });
  });

  router.post('/', (req, res) => {
    const title = validateTitle(req.body?.title);
    const notes = validateOptionalText(req.body?.notes, 500, 'TASK_NOTES_TOO_LONG');
    const dueDate = validateOptionalText(req.body?.dueDate, 32, 'TASK_DUE_DATE_TOO_LONG');
    const priority = validatePriority(req.body?.priority);
    const now = new Date().toISOString();

    const task = {
      id: randomUUID(),
      title,
      notes,
      dueDate,
      priority,
      isCompleted: false,
      createdAt: now,
      updatedAt: now,
    };

    tasks.unshift(task);

    res.status(201).json({ ok: true, data: task });
  });

  router.patch('/:taskId/toggle', (req, res) => {
    const task = tasks.find((item) => item.id === req.params.taskId);

    if (!task) {
      throw new ApiError(404, 'Task not found', 'TASK_NOT_FOUND');
    }

    const requested = req.body?.isCompleted;
    if (requested != null && typeof requested !== 'boolean') {
      throw new ApiError(400, 'isCompleted must be a boolean', 'TASK_INVALID_COMPLETION_STATE');
    }

    task.isCompleted = typeof requested === 'boolean' ? requested : !task.isCompleted;
    task.updatedAt = new Date().toISOString();

    res.json({ ok: true, data: task });
  });

  router.delete('/:taskId', (req, res) => {
    const index = tasks.findIndex((item) => item.id === req.params.taskId);

    if (index === -1) {
      throw new ApiError(404, 'Task not found', 'TASK_NOT_FOUND');
    }

    const [removed] = tasks.splice(index, 1);

    res.json({ ok: true, id: removed.id });
  });

  return router;
}
