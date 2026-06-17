import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

/**
 * Image with a deterministic gradient fallback so cards look intentional even
 * before/without imagery. `seed` keeps the gradient stable per item.
 */
const GRADIENTS = [
  'from-slate-700 to-slate-900',
  'from-brand-600 to-indigo-800',
  'from-emerald-600 to-teal-800',
  'from-rose-500 to-fuchsia-700',
  'from-amber-500 to-orange-700',
  'from-cyan-600 to-blue-800',
];

function gradientFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length]!;
}

export function HeroImage({
  src,
  alt,
  seed,
  className,
  children,
}: {
  src?: string | undefined;
  alt: string;
  seed: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <div className={cn('h-full w-full bg-gradient-to-br', gradientFor(seed))} aria-hidden />
      )}
      {children}
    </div>
  );
}
