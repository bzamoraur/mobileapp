import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Image with a deterministic warm-gradient fallback. If `src` is missing OR the
 * file fails to load (e.g. a not-yet-added /img asset), it shows the gradient,
 * so the layout always looks intentional and real photos appear the moment they
 * are dropped in.
 */
const GRADIENTS = [
  'from-brand-500 to-brand-800', // clay
  'from-moss-500 to-moss-700', // acacia
  'from-amber-500 to-brand-700', // savanna sun
  'from-teal-600 to-cyan-800', // indian ocean
  'from-stone-600 to-stone-900', // dusk
  'from-orange-500 to-rose-800', // sunset
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
  const [failed, setFailed] = useState(false);
  const showImg = Boolean(src) && !failed;

  return (
    <div className={cn('relative overflow-hidden bg-sand-200', className)}>
      {showImg ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          className={cn('h-full w-full bg-gradient-to-br', gradientFor(seed))}
          aria-hidden
        />
      )}
      {children}
    </div>
  );
}
