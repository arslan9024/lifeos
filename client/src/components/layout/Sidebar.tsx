import { NavLink } from 'react-router-dom';

const items = [
  { to: '/app', label: 'Dashboard' },
  { to: '/app/goals', label: 'Goals' },
  { to: '/app/tasks', label: 'Tasks' },
  { to: '/app/calendar', label: 'Calendar' },
  { to: '/app/notes', label: 'Notes' },
  { to: '/app/documents', label: 'Documents' },
  { to: '/app/budget', label: 'Budget' },
  { to: '/app/notifications', label: 'Notifications' },
  { to: '/app/analytics', label: 'Analytics' },
  { to: '/app/assistant', label: 'AI Assistant' },
  { to: '/app/settings', label: 'Settings' },
  { to: '/legacy', label: 'Legacy' },
];

export function Sidebar() {
  return (
    <aside className="lifeos-sidebar">
      <div className="lifeos-sidebar__brand">
        <span className="lifeos-sidebar__mark">L</span>
        <div>
          <div className="lifeos-sidebar__title">LifeOS</div>
          <div className="lifeos-sidebar__subtitle">Personal operating system</div>
        </div>
      </div>
      <nav className="lifeos-nav" aria-label="Primary navigation">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/app'}
            className={({ isActive }) =>
              `lifeos-nav__link${isActive ? ' lifeos-nav__link--active' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
