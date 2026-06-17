import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from './icons';

/** Sticky page title with an optional back button. */
export function PageHeader({ title, back = false }: { title: string; back?: boolean }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-20 bg-surface-muted/90 px-5 pb-2 pt-[calc(0.75rem+env(safe-area-inset-top))] backdrop-blur">
      {back && (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="tap mb-2 inline-flex items-center gap-1 rounded-pill bg-surface px-3 py-1.5 text-sm font-semibold text-ink-700 shadow-card"
        >
          <ChevronLeftIcon width={18} height={18} />
          Atrás
        </button>
      )}
      <h1 className="font-display text-3xl font-bold text-ink-900">{title}</h1>
    </header>
  );
}
