'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="rounded-lg border border-predix-danger/40 bg-predix-danger/10 p-6 text-center">
            <p className="text-lg font-medium text-predix-danger">Something went wrong</p>
            <p className="mt-2 text-sm text-predix-muted">Please refresh the page or try again later.</p>
            <button
              type="button"
              className="mt-4 rounded-md bg-predix-accent px-4 py-2 text-sm font-medium text-predix-bg"
              onClick={() => this.setState({ hasError: false })}
            >
              Retry
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
