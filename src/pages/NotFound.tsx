import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="font-display text-4xl font-bold text-ink-900">Perdido</h1>
      <p className="text-ink-500">Esta página no existe.</p>
      <Link
        to="/"
        className="tap rounded-pill bg-brand-600 px-6 py-3 font-semibold text-white active:scale-95"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
