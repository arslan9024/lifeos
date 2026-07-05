import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { MainLayout } from '@/layouts/MainLayout';
import { LegacyLayout } from '@/layouts/LegacyLayout';
import { LandingPage } from '@/pages/LandingPage';
import { AppHomePage } from '@/pages/AppHomePage';
import { LegacyHomePage } from '@/pages/LegacyHomePage';
import { ComingSoonPage } from '@/pages/ComingSoonPage';

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
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
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
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
