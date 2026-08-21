import { Component, type ErrorInfo, type ReactNode } from 'react';

// ponytail: one boundary at the root, not per-route — enough to prevent full blackout.
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center bg-(--color-paper) dark:bg-(--color-paper-dark) text-(--color-ink) dark:text-(--color-ink-light)">
          <h1 className="text-2xl font-bold font-display">Algo salió mal</h1>
          <p className="text-(--color-ink-soft) max-w-sm">
            Ocurrió un error inesperado. Recarga la página para volver a intentarlo.
          </p>
          <button onClick={() => window.location.reload()} className="eb-btn-primary px-6 py-3">
            Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
