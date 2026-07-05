import type { PropsWithChildren } from 'react';

export function ContentFrame({ children }: PropsWithChildren) {
  return <main className="lifeos-content">{children}</main>;
}
