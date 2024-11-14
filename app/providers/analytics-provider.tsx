'use client';

import { usePageTracking } from '../hooks/usePageTracking';

export function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  usePageTracking();

  return <>{children}</>;
}
