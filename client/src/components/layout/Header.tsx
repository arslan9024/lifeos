import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';

export function Header() {
  return (
    <header className="lifeos-header">
      <div>
        <p className="lifeos-header__eyebrow">LifeOS Foundation</p>
        <h1 className="lifeos-header__title">App Shell and Layout</h1>
      </div>
      <div className="lifeos-header__actions">
        <Badge tone="success">Client + Server</Badge>
        <Link className="lifeos-button lifeos-button--secondary" to="/legacy">
          Legacy Sandbox
        </Link>
      </div>
    </header>
  );
}
