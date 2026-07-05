import { Outlet } from 'react-router-dom';
import { Card } from '@/components/ui/Card';

export function PublicLayout() {
  return (
    <div className="lifeos-public-shell">
      <div className="lifeos-public-shell__inner">
        <Card>
          <Outlet />
        </Card>
      </div>
    </div>
  );
}
