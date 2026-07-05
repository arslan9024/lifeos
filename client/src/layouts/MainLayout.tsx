import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ContentFrame } from '@/components/layout/ContentFrame';

export function MainLayout() {
  return (
    <div className="lifeos-shell">
      <Sidebar />
      <div className="lifeos-main">
        <Header />
        <ContentFrame>
          <Outlet />
        </ContentFrame>
      </div>
    </div>
  );
}
