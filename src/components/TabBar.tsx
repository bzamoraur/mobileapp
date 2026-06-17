import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { HomeIcon, CalendarIcon, MapIcon, ChatIcon, LifebuoyIcon } from './icons';
import type { ComponentType, SVGProps } from 'react';

type Item = { to: string; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> };

const ITEMS: Item[] = [
  { to: '/', label: 'Inicio', Icon: HomeIcon },
  { to: '/dias', label: 'Días', Icon: CalendarIcon },
  { to: '/mapa', label: 'Mapa', Icon: MapIcon },
  { to: '/frases', label: 'Frases', Icon: ChatIcon },
  { to: '/ayuda', label: 'Ayuda', Icon: LifebuoyIcon },
];

export function TabBar() {
  return (
    <nav
      aria-label="Navegación principal"
      className="sticky bottom-0 z-30 mx-auto w-full max-w-app border-t border-surface-sunken/60 bg-surface/95 pb-[env(safe-area-inset-bottom)] shadow-nav backdrop-blur"
    >
      <ul className="flex items-stretch justify-around">
        {ITEMS.map(({ to, label, Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'tap flex flex-col items-center gap-1 px-1 py-2 text-xs font-medium transition',
                  isActive ? 'text-brand-600' : 'text-ink-400',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'flex h-9 w-12 items-center justify-center rounded-pill transition',
                      isActive && 'bg-brand-50',
                    )}
                  >
                    <Icon width={22} height={22} />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
