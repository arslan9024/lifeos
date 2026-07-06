import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ApiErrorNotice } from '@/components/system/ApiErrorNotice';
import { ApiRequestError, apiDelete, apiGet, apiPatch, apiPost } from '@/lib/api';

type TaskPriority = 'low' | 'medium' | 'high';

interface TaskItem {
  id: string;
  title: string;
  notes?: string;
  dueDate?: string;
  priority: TaskPriority;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TasksListResponse {
  ok: boolean;
  data: TaskItem[];
}

interface TaskResponse {
  ok: boolean;
  data: TaskItem;
}

interface TaskDeleteResponse {
  ok: boolean;
  id: string;
}

export function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<ApiRequestError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTasks = useCallback((signal?: AbortSignal) => {
    setStatus('loading');
    setError(null);

    apiGet<TasksListResponse>('/api/tasks', signal)
      .then((response) => {
        setTasks(response.data);
        setStatus('ready');
      })
      .catch((caught) => {
        if (caught instanceof DOMException && caught.name === 'AbortError') {
          return;
        }

        if (caught instanceof ApiRequestError) {
          setError(caught);
        } else {
          setError(new ApiRequestError('/api/tasks', 0, 'Unexpected error while loading tasks.'));
        }

        setStatus('error');
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadTasks(controller.signal);

    return () => controller.abort();
  }, [loadTasks]);

  const pendingCount = useMemo(() => tasks.filter((task) => !task.isCompleted).length, [tasks]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(new ApiRequestError('/api/tasks', 400, 'Task title is required.'));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await apiPost<TaskResponse>('/api/tasks', {
        title,
        notes,
        dueDate,
        priority,
      });

      setTasks((current) => [response.data, ...current]);
      setTitle('');
      setNotes('');
      setDueDate('');
      setPriority('medium');
      setStatus('ready');
    } catch (caught) {
      if (caught instanceof ApiRequestError) {
        setError(caught);
      } else {
        setError(new ApiRequestError('/api/tasks', 0, 'Failed to create task.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (taskId: string) => {
    try {
      const response = await apiPatch<TaskResponse>(`/api/tasks/${taskId}/toggle`, {});
      setTasks((current) => current.map((task) => (task.id === taskId ? response.data : task)));
      setError(null);
    } catch (caught) {
      if (caught instanceof ApiRequestError) {
        setError(caught);
      }
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await apiDelete<TaskDeleteResponse>(`/api/tasks/${taskId}`);
      setTasks((current) => current.filter((task) => task.id !== taskId));
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
          <Badge tone="success">Tasks</Badge>
          <h1 className="lifeos-section-title">Tasks module</h1>
          <p className="lifeos-text">Capture actionable work items with priority and completion state.</p>
          <p className="lifeos-meta">Pending tasks: {pendingCount}</p>
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
            <span>Due date (optional)</span>
            <input
              type="text"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              maxLength={32}
              placeholder="e.g., 2026-10-01"
            />
          </label>

          <label className="lifeos-form__field">
            <span>Priority</span>
            <select value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          <div className="lifeos-actions">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Add task'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => loadTasks()}>
              Refresh
            </Button>
          </div>
        </form>
      </Card>

      {error ? <ApiErrorNotice error={error} onRetry={() => loadTasks()} /> : null}

      <Card>
        <div className="lifeos-stack lifeos-stack--sm">
          <h2 className="lifeos-section-title">Current tasks</h2>
          {status === 'loading' ? <p className="lifeos-text">Loading tasks…</p> : null}

          {status === 'ready' && tasks.length === 0 ? (
            <p className="lifeos-text">No tasks yet. Add your first task above.</p>
          ) : null}

          {tasks.length > 0 ? (
            <ul className="lifeos-list lifeos-list--clean">
              {tasks.map((task) => (
                <li key={task.id} className="lifeos-goal-item">
                  <div className="lifeos-stack lifeos-stack--sm">
                    <div className="lifeos-actions">
                      <Badge tone={task.isCompleted ? 'success' : 'neutral'}>
                        {task.isCompleted ? 'Completed' : 'Active'}
                      </Badge>
                      <Badge tone={task.priority === 'high' ? 'warning' : 'neutral'}>
                        {task.priority.toUpperCase()}
                      </Badge>
                      <p className="lifeos-meta">Updated: {new Date(task.updatedAt).toLocaleString()}</p>
                    </div>
                    <p className="lifeos-goal-item__title">{task.title}</p>
                    {task.notes ? <p className="lifeos-text">{task.notes}</p> : null}
                    {task.dueDate ? <p className="lifeos-meta">Due: {task.dueDate}</p> : null}
                  </div>
                  <div className="lifeos-actions">
                    <Button variant="secondary" onClick={() => handleToggle(task.id)}>
                      {task.isCompleted ? 'Mark active' : 'Mark done'}
                    </Button>
                    <Button variant="secondary" onClick={() => handleDelete(task.id)}>
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
