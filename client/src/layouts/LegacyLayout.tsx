import { Outlet, Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function LegacyLayout() {
  return (
    <div className="lifeos-legacy-shell">
      <Card>
        <div className="lifeos-stack lifeos-stack--sm">
          <Badge tone="warning">Legacy / Sandbox</Badge>
          <h1 className="lifeos-title">Legacy Property Area</h1>
          <p className="lifeos-text">
            Old property-related work stays here so it remains isolated from the main LifeOS product.
          </p>
          <Link className="lifeos-button lifeos-button--secondary" to="/app">
            Return to LifeOS
          </Link>
        </div>
      </Card>
      <div className="lifeos-legacy-content">
        <Outlet />
      </div>
    </div>
  );
}
