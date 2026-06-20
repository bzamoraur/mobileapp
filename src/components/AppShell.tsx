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
 * App shell: a fixed-height column where only the content area scrolls, so the
 * bottom tab bar is a non-scrolling flex sibling — truly anchored to the bottom
 * even with iOS rubber-band overscroll. Height is `h-full` (100%) to match the
 * `html, body, #root { height: 100% }` chain: in an installed iOS PWA `100dvh`
 * resolves *shorter* than 100%, which left a strip of body colour showing under
 * the nav. `overscroll-contain` keeps the scroll from chaining out to the page.
 */
export function AppShell() {
  return (
    <div className="app-canvas flex h-full flex-col overflow-hidden">
      <ScrollToTop />
      <main id="app-scroll" className="flex-1 overflow-y-auto overscroll-contain pb-4">
        <Outlet />
      </main>
      <TabBar />
    </div>
  );
}
