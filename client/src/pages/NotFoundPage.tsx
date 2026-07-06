import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';

interface NotFoundPageProps {
  title?: string;
  description?: string;
  backTo?: string;
  backLabel?: string;
}

export function NotFoundPage({
  title = 'Page not found',
  description = "The page you're looking for does not exist in this route space.",
  backTo = '/',
  backLabel = 'Return home',
}: NotFoundPageProps) {
  return (
    <div className="lifeos-stack lifeos-stack--sm">
      <Badge tone="warning">404</Badge>
      <h1 className="lifeos-section-title">{title}</h1>
      <p className="lifeos-text">{description}</p>
      <div className="lifeos-actions">
        <Link className="lifeos-button" to={backTo}>
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
