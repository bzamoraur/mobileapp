import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TabBar } from './TabBar';

/** Scrolls to top on route change (native-app feel). */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function AppShell() {
  return (
    <div className="app-canvas flex min-h-dvh flex-col">
      <ScrollToTop />
      <main className="flex-1 pb-4">
        <Outlet />
      </main>
      <TabBar />
    </div>
  );
}
