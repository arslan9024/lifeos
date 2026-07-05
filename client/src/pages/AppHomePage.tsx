import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface HealthResponse {
  ok: boolean;
  service: string;
  environment: string;
  timestamp: string;
}

export function AppHomePage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/health', { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Unable to load health status');
        }

        return response.json() as Promise<HealthResponse>;
      })
      .then((data) => {
        setHealth(data);
        setStatus('ready');
      })
      .catch(() => {
        setStatus('error');
      });

    return () => controller.abort();
  }, []);

  const healthTone = useMemo(() => {
    if (status === 'ready' && health?.ok) {
      return 'success' as const;
    }

    if (status === 'error') {
      return 'warning' as const;
    }

    return 'neutral' as const;
  }, [health, status]);

  return (
    <div className="lifeos-stack lifeos-stack--lg">
      <section className="lifeos-hero">
        <div className="lifeos-stack lifeos-stack--sm">
          <Badge tone="success">Dashboard</Badge>
          <h1 className="lifeos-hero-title">Welcome back to LifeOS.</h1>
          <p className="lifeos-text lifeos-text--lead">
            This first implementation step verifies the shell, the route structure, and the client/server split.
          </p>
        </div>
        <div className="lifeos-hero__actions">
          <Button href="/app/goals">Open Goals</Button>
          <Button href="/app/tasks" variant="secondary">
            Open Tasks
          </Button>
        </div>
      </section>

      <div className="lifeos-grid lifeos-grid--two">
        <Card>
          <div className="lifeos-stack lifeos-stack--sm">
            <Badge tone={healthTone}>{status === 'ready' ? 'Server Connected' : status === 'error' ? 'Server Offline' : 'Checking Server'}</Badge>
            <h2 className="lifeos-section-title">Backend health</h2>
            <p className="lifeos-text">
              {status === 'ready' && health
                ? `${health.service} is running in ${health.environment} mode.`
                : status === 'error'
                  ? 'The client could not reach the backend yet.'
                  : 'Checking the server status through the Vite proxy...'}
            </p>
            {health?.timestamp ? <p className="lifeos-meta">Last checked: {health.timestamp}</p> : null}
          </div>
        </Card>

        <Card>
          <div className="lifeos-stack lifeos-stack--sm">
            <Badge tone="neutral">Foundation Checklist</Badge>
            <h2 className="lifeos-section-title">What this lesson proves</h2>
            <ul className="lifeos-list">
              <li>Frontend and server live in separate folders.</li>
              <li>The root dev script can start both together.</li>
              <li>The route shell is in place for future modules.</li>
            </ul>
          </div>
        </Card>
      </div>

      <Card>
        <div className="lifeos-stack lifeos-stack--sm">
          <Badge tone="neutral">Next step</Badge>
          <h2 className="lifeos-section-title">Ready for the next lesson</h2>
          <p className="lifeos-text">
            The next build step is to expand from this shell into the dashboard, goals, and tasks surfaces.
          </p>
        </div>
      </Card>
    </div>
  );
}
