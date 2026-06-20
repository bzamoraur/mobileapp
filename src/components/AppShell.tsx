import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TabBar } from './TabBar';

/** Scrolls the content area (not the window) to top on route change. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.getElementById('app-scroll')?.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/**
 * App shell: a fixed-height (dvh) column where only the content area scrolls, so
 * the bottom tab bar is a non-scrolling flex sibling — truly anchored to the
 * bottom even with iOS rubber-band overscroll. `overscroll-contain` keeps the
 * scroll from chaining out to the page.
 */
export function AppShell() {
  return (
    <div className="app-canvas flex h-dvh flex-col overflow-hidden">
      <ScrollToTop />
      <main id="app-scroll" className="flex-1 overflow-y-auto overscroll-contain pb-4">
        <Outlet />
      </main>
      <TabBar />
    </div>
  );
}
