import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { MainLayout } from '@/layouts/MainLayout';
import { LegacyLayout } from '@/layouts/LegacyLayout';
import { NotFoundPage } from '@/pages/NotFoundPage';

const LandingPage = lazy(async () => ({ default: (await import('@/pages/LandingPage')).LandingPage }));
const AppHomePage = lazy(async () => ({ default: (await import('@/pages/AppHomePage')).AppHomePage }));
const LegacyHomePage = lazy(async () => ({ default: (await import('@/pages/LegacyHomePage')).LegacyHomePage }));
const ComingSoonPage = lazy(async () => ({ default: (await import('@/pages/ComingSoonPage')).ComingSoonPage }));

function RouteFallback() {
  return (
    <div className="lifeos-stack lifeos-stack--sm">
      <p className="lifeos-text">Loading page…</p>
    </div>
  );
}

const modulePlaceholders = [
  { path: 'goals', title: 'Goals', description: 'Track one major life objective with milestones and privacy controls.' },
  { path: 'tasks', title: 'Tasks', description: 'Capture and prioritize work with a calm, focused workflow.' },
  { path: 'calendar', title: 'Calendar', description: 'Plan time, events, and deadlines in one place.' },
  { path: 'notes', title: 'Notes', description: 'Quickly capture ideas, summaries, and personal records.' },
  { path: 'documents', title: 'Documents', description: 'Organize private files, records, and linked attachments.' },
  { path: 'budget', title: 'Budget', description: 'Keep a simple view of income, expenses, and financial trends.' },
  { path: 'notifications', title: 'Notifications', description: 'Stay aware of reminders, blockers, and important updates.' },
  { path: 'analytics', title: 'Analytics', description: 'Review meaningful progress signals and product KPIs.' },
  { path: 'assistant', title: 'AI Assistant', description: 'Get planning help, summaries, and next-action suggestions.' },
  { path: 'settings', title: 'Settings', description: 'Adjust preferences, privacy, and account-related options later.' },
];

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="*"
              element={
                <NotFoundPage
                  title="Public route not found"
                  description="This public page could not be found."
                  backTo="/"
                  backLabel="Back to landing"
                />
              }
            />
          </Route>

          <Route path="/app" element={<MainLayout />}>
            <Route index element={<AppHomePage />} />
            {modulePlaceholders.map(({ path, title, description }) => (
              <Route
                key={path}
                path={path}
                element={<ComingSoonPage title={title} description={description} />}
              />
            ))}
            <Route
              path="*"
              element={
                <NotFoundPage
                  title="App route not found"
                  description="This app module route does not exist yet."
                  backTo="/app"
                  backLabel="Back to dashboard"
                />
              }
            />
          </Route>

          <Route path="/legacy" element={<LegacyLayout />}>
            <Route index element={<LegacyHomePage />} />
            <Route
              path="property"
              element={
                <ComingSoonPage
                  title="Legacy Property Sandbox"
                  description="The old property module is kept separate for future development and migration work."
                />
              }
            />
            <Route
              path="*"
              element={
                <NotFoundPage
                  title="Legacy route not found"
                  description="This legacy sandbox route does not exist."
                  backTo="/legacy"
                  backLabel="Back to legacy home"
                />
              }
            />
          </Route>

          <Route
            path="*"
            element={
              <NotFoundPage
                title="Route not found"
                description="The route you entered is not available in LifeOS."
                backTo="/"
                backLabel="Return home"
              />
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
