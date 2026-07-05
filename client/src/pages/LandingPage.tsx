import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function LandingPage() {
  return (
    <div className="lifeos-stack lifeos-stack--lg">
      <div className="lifeos-stack lifeos-stack--sm">
        <Badge tone="success">Sprint 0 Foundation</Badge>
        <h1 className="lifeos-hero-title">LifeOS is taking shape.</h1>
        <p className="lifeos-text lifeos-text--lead">
          A modern personal operating system with a clean client/server split, a structured route model, and a foundation built for long-term growth.
        </p>
      </div>

      <div className="lifeos-actions">
        <Button href="/app">Open LifeOS</Button>
        <Button variant="secondary" href="/legacy">
          Open Legacy Sandbox
        </Button>
        <Link className="lifeos-link" to="/app/goals">
          See the goals workspace →
        </Link>
      </div>
    </div>
  );
}
