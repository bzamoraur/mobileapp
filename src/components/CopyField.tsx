import { useState } from 'react';
import { CopyIcon } from './icons';

/** A labelled value with a copy-to-clipboard button (booking locators, etc.). */
export function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be blocked; the value is still visible to read/type.
    }
  }

  return (
    <div className="card flex items-center justify-between gap-3 p-4">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</p>
        <p className="truncate text-lg font-bold text-ink-900">{value}</p>
      </div>
      <button
        type="button"
        onClick={() => void copy()}
        className="tap inline-flex items-center gap-1.5 rounded-pill bg-surface-muted px-3 py-2 text-sm font-semibold text-ink-700 active:scale-95"
      >
        <CopyIcon width={16} height={16} />
        {copied ? 'Copiado' : 'Copiar'}
      </button>
    </div>
  );
}
