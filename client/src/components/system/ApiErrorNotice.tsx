import { Button } from '@/components/ui/Button';
import { ApiRequestError } from '@/lib/api';

interface ApiErrorNoticeProps {
  error: ApiRequestError | null;
  onRetry?: () => void;
}

export function ApiErrorNotice({ error, onRetry }: ApiErrorNoticeProps) {
  if (!error) {
    return null;
  }

  return (
    <section className="lifeos-error-notice" role="alert" aria-live="polite">
      <p className="lifeos-error-notice__title">Unable to load data from the server.</p>
      <p className="lifeos-error-notice__message">{error.message}</p>
      <ul className="lifeos-error-notice__meta">
        <li>Status: {error.status}</li>
        {error.code ? <li>Code: {error.code}</li> : null}
        {error.requestId ? <li>Request ID: {error.requestId}</li> : null}
      </ul>
      {onRetry ? (
        <div className="lifeos-actions">
          <Button variant="secondary" onClick={onRetry}>
            Retry
          </Button>
        </div>
      ) : null}
    </section>
  );
}
