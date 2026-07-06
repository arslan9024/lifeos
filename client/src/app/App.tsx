import { AppRoutes } from '@/routes/AppRoutes';
import { ErrorBoundary } from '@/components/system/ErrorBoundary';

export function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
}

export default App;
