import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function LegacyHomePage() {
  return (
    <div className="lifeos-stack lifeos-stack--lg">
      <Card>
        <div className="lifeos-stack lifeos-stack--sm">
          <Badge tone="warning">Legacy sandbox</Badge>
          <h1 className="lifeos-section-title">Old property work stays isolated here.</h1>
          <p className="lifeos-text">
            This route exists only for future migration or experimentation. It does not affect the main LifeOS product flow.
          </p>
          <Button href="/legacy/property" variant="secondary">
            View legacy property placeholder
          </Button>
        </div>
      </Card>
    </div>
  );
}
