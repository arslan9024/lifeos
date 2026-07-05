import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface ComingSoonPageProps {
  title: string;
  description: string;
}

export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <Card>
      <div className="lifeos-stack lifeos-stack--sm">
        <Badge tone="neutral">Coming soon</Badge>
        <h1 className="lifeos-section-title">{title}</h1>
        <p className="lifeos-text">{description}</p>
        <Link className="lifeos-link" to="/app">
          Return to dashboard →
        </Link>
      </div>
    </Card>
  );
}
