import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ApiErrorNotice } from '@/components/system/ApiErrorNotice';
import { ApiRequestError, apiDelete, apiGet, apiPatch, apiPost } from '@/lib/api';

interface GoalItem {
  id: string;
  title: string;
  notes?: string;
  targetDate?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GoalsListResponse {
  ok: boolean;
  data: GoalItem[];
}

interface GoalResponse {
  ok: boolean;
  data: GoalItem;
}

interface GoalDeleteResponse {
  ok: boolean;
  id: string;
}

export function GoalsPage() {
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<ApiRequestError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadGoals = useCallback((signal?: AbortSignal) => {
    setStatus('loading');
    setError(null);

    apiGet<GoalsListResponse>('/api/goals', signal)
      .then((response) => {
        setGoals(response.data);
        setStatus('ready');
      })
      .catch((caught) => {
        if (caught instanceof DOMException && caught.name === 'AbortError') {
          return;
        }

        if (caught instanceof ApiRequestError) {
          setError(caught);
        } else {
          setError(new ApiRequestError('/api/goals', 0, 'Unexpected error while loading goals.'));
        }

        setStatus('error');
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadGoals(controller.signal);

    return () => controller.abort();
  }, [loadGoals]);

  const pendingCount = useMemo(() => goals.filter((goal) => !goal.isCompleted).length, [goals]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(new ApiRequestError('/api/goals', 400, 'Goal title is required.'));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await apiPost<GoalResponse>('/api/goals', {
        title,
        notes,
        targetDate,
      });

      setGoals((current) => [response.data, ...current]);
      setTitle('');
      setNotes('');
      setTargetDate('');
      setStatus('ready');
    } catch (caught) {
      if (caught instanceof ApiRequestError) {
        setError(caught);
      } else {
        setError(new ApiRequestError('/api/goals', 0, 'Failed to create goal.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (goalId: string) => {
    try {
      const response = await apiPatch<GoalResponse>(`/api/goals/${goalId}/toggle`, {});
      setGoals((current) => current.map((goal) => (goal.id === goalId ? response.data : goal)));
      setError(null);
    } catch (caught) {
      if (caught instanceof ApiRequestError) {
        setError(caught);
      }
    }
  };

  const handleDelete = async (goalId: string) => {
    try {
      await apiDelete<GoalDeleteResponse>(`/api/goals/${goalId}`);
      setGoals((current) => current.filter((goal) => goal.id !== goalId));
      setError(null);
    } catch (caught) {
      if (caught instanceof ApiRequestError) {
        setError(caught);
      }
    }
  };

  return (
    <div className="lifeos-stack lifeos-stack--lg">
      <Card>
        <div className="lifeos-stack lifeos-stack--sm">
          <Badge tone="success">Goals</Badge>
          <h1 className="lifeos-section-title">Goals module (first persisted feature)</h1>
          <p className="lifeos-text">Track and complete goals with a simple server-backed workflow.</p>
          <p className="lifeos-meta">Pending goals: {pendingCount}</p>
        </div>
      </Card>

      <Card>
        <form className="lifeos-form" onSubmit={handleSubmit}>
          <label className="lifeos-form__field">
            <span>Title</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} required />
          </label>

          <label className="lifeos-form__field">
            <span>Notes (optional)</span>
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={500} rows={3} />
          </label>

          <label className="lifeos-form__field">
            <span>Target date (optional)</span>
            <input
              type="text"
              value={targetDate}
              onChange={(event) => setTargetDate(event.target.value)}
              maxLength={32}
              placeholder="e.g., 2026-09-30"
            />
          </label>

          <div className="lifeos-actions">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Add goal'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => loadGoals()}>
              Refresh
            </Button>
          </div>
        </form>
      </Card>

      {error ? <ApiErrorNotice error={error} onRetry={() => loadGoals()} /> : null}

      <Card>
        <div className="lifeos-stack lifeos-stack--sm">
          <h2 className="lifeos-section-title">Current goals</h2>
          {status === 'loading' ? <p className="lifeos-text">Loading goals…</p> : null}

          {status === 'ready' && goals.length === 0 ? (
            <p className="lifeos-text">No goals yet. Add your first goal above.</p>
          ) : null}

          {goals.length > 0 ? (
            <ul className="lifeos-list lifeos-list--clean">
              {goals.map((goal) => (
                <li key={goal.id} className="lifeos-goal-item">
                  <div className="lifeos-stack lifeos-stack--sm">
                    <div className="lifeos-actions">
                      <Badge tone={goal.isCompleted ? 'success' : 'neutral'}>
                        {goal.isCompleted ? 'Completed' : 'Active'}
                      </Badge>
                      <p className="lifeos-meta">Updated: {new Date(goal.updatedAt).toLocaleString()}</p>
                    </div>
                    <p className="lifeos-goal-item__title">{goal.title}</p>
                    {goal.notes ? <p className="lifeos-text">{goal.notes}</p> : null}
                    {goal.targetDate ? <p className="lifeos-meta">Target: {goal.targetDate}</p> : null}
                  </div>
                  <div className="lifeos-actions">
                    <Button variant="secondary" onClick={() => handleToggle(goal.id)}>
                      {goal.isCompleted ? 'Mark active' : 'Mark done'}
                    </Button>
                    <Button variant="secondary" onClick={() => handleDelete(goal.id)}>
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
