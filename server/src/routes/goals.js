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
    throw new ApiError(400, 'Goal title is required', 'GOAL_TITLE_REQUIRED');
  }

  if (normalized.length > 120) {
    throw new ApiError(400, 'Goal title must be 120 characters or less', 'GOAL_TITLE_TOO_LONG');
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

export function createGoalsRouter() {
  const goals = [];
  const router = Router();

  router.get('/', (_req, res) => {
    res.json({
      ok: true,
      data: goals,
    });
  });

  router.post('/', (req, res) => {
    const title = validateTitle(req.body?.title);
    const notes = validateOptionalText(req.body?.notes, 500, 'GOAL_NOTES_TOO_LONG');
    const targetDate = validateOptionalText(req.body?.targetDate, 32, 'GOAL_TARGET_DATE_TOO_LONG');
    const now = new Date().toISOString();

    const goal = {
      id: randomUUID(),
      title,
      notes,
      targetDate,
      isCompleted: false,
      createdAt: now,
      updatedAt: now,
    };

    goals.unshift(goal);

    res.status(201).json({
      ok: true,
      data: goal,
    });
  });

  router.patch('/:goalId/toggle', (req, res) => {
    const goal = goals.find((item) => item.id === req.params.goalId);

    if (!goal) {
      throw new ApiError(404, 'Goal not found', 'GOAL_NOT_FOUND');
    }

    const requested = req.body?.isCompleted;
    if (requested != null && typeof requested !== 'boolean') {
      throw new ApiError(400, 'isCompleted must be a boolean', 'GOAL_INVALID_COMPLETION_STATE');
    }

    goal.isCompleted = typeof requested === 'boolean' ? requested : !goal.isCompleted;
    goal.updatedAt = new Date().toISOString();

    res.json({
      ok: true,
      data: goal,
    });
  });

  router.delete('/:goalId', (req, res) => {
    const index = goals.findIndex((item) => item.id === req.params.goalId);

    if (index === -1) {
      throw new ApiError(404, 'Goal not found', 'GOAL_NOT_FOUND');
    }

    const [removed] = goals.splice(index, 1);

    res.json({
      ok: true,
      id: removed.id,
    });
  });

  return router;
}
