import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { sha256Hex } from './sha256';

const STORAGE_KEY = 'viaje.access.ok';
const EXPECTED_HASH = import.meta.env.VITE_ACCESS_CODE_HASH;

/**
 * Lightweight family access gate.
 *
 * SECURITY NOTE: this keeps the app out of casual reach (and out of search
 * engines), but it is NOT authentication — the bundle is fully downloadable, so
 * a determined person can read the trip data. For real protection, front the
 * deployment with Cloudflare Access. See docs/SECURITY.md.
 *
 * If `VITE_ACCESS_CODE_HASH` is unset, the gate is disabled (useful in dev).
 */
export function AccessGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => {
    if (!EXPECTED_HASH) return true;
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  });
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (unlocked && EXPECTED_HASH) sessionStorage.setItem(STORAGE_KEY, '1');
  }, [unlocked]);

  useEffect(() => {
    if (!unlocked) inputRef.current?.focus();
  }, [unlocked]);

  if (unlocked) return <>{children}</>;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setChecking(true);
    setError(false);
    const hash = await sha256Hex(code.trim());
    if (hash === EXPECTED_HASH) {
      setUnlocked(true);
    } else {
      setError(true);
      setCode('');
    }
    setChecking(false);
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-surface-muted px-6">
      <form
        onSubmit={(e) => void onSubmit(e)}
        className="w-full max-w-app rounded-card bg-surface p-7 shadow-card"
      >
        <h1 className="font-display text-3xl text-ink-900">Viaje</h1>
        <p className="mt-2 text-ink-500">Introduce el código de la familia para entrar.</p>
        <label htmlFor="access-code" className="sr-only">
          Código de acceso
        </label>
        <input
          ref={inputRef}
          id="access-code"
          type="password"
          inputMode="text"
          autoComplete="off"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          aria-invalid={error}
          aria-describedby={error ? 'access-error' : undefined}
          className="mt-5 w-full rounded-2xl border border-surface-sunken bg-surface-muted px-4 py-3 text-lg text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          placeholder="Código"
        />
        {error && (
          <p id="access-error" role="alert" className="mt-2 text-sm text-red-600">
            Código incorrecto. Inténtalo de nuevo.
          </p>
        )}
        <button
          type="submit"
          disabled={checking || code.trim().length === 0}
          className="mt-5 w-full rounded-2xl bg-brand-600 py-3 text-lg font-semibold text-white transition active:scale-[0.99] disabled:opacity-50"
        >
          {checking ? 'Comprobando…' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}
