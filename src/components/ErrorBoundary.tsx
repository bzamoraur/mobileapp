import { Component, type ErrorInfo, type ReactNode } from 'react';

/** Catches render-time errors (incl. invalid trip data) and shows a readable message. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  override state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error en la app:', error, info.componentStack);
  }

  override render() {
    if (this.state.error) {
      return (
        <main className="flex min-h-dvh flex-col items-center justify-center gap-3 p-8 text-center">
          <h1 className="font-display text-3xl font-bold text-ink-900">Algo ha fallado</h1>
          <p className="max-w-app whitespace-pre-line text-ink-500">{this.state.error.message}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="tap mt-2 rounded-pill bg-brand-600 px-6 py-3 font-semibold text-white"
          >
            Reintentar
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}
