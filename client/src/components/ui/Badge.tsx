import type { PropsWithChildren } from 'react';

type BadgeTone = 'neutral' | 'success' | 'warning';

interface BadgeProps extends PropsWithChildren {
  tone?: BadgeTone;
}

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return <span className={`lifeos-badge lifeos-badge--${tone}`}>{children}</span>;
}
