import { useEffect, useRef, type ReactNode } from 'react';
import { CloseIcon } from './icons';

/** Accessible bottom-sheet style modal: Esc to close, backdrop click, focus moved in. */
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      {/* Backdrop as a real button so it's keyboard- and screen-reader-accessible. */}
      <button
        type="button"
        aria-label="Cerrar"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-ink-900/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative max-h-[85dvh] w-full max-w-app overflow-y-auto rounded-t-card bg-surface p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-card sm:rounded-card"
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-ink-900">{title}</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="tap -m-2 rounded-full p-2 text-ink-500 hover:bg-surface-muted"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="text-ink-700">{children}</div>
      </div>
    </div>
  );
}
