// M1 PR-05: feat/error-loading-states
// ErrorBoundary.jsx + LoadingSpinner.jsx + EmptyState.jsx
// Used on all data-fetching pages throughout the app.

// ─── ErrorBoundary ─────────────────────────────────────────────────────────
import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center px-6">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold text-red-600 mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-500 mb-4">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── LoadingSpinner ────────────────────────────────────────────────────────
export function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

// ─── LoadingSkeleton (table rows) ──────────────────────────────────────────
export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3 border-b border-gray-100">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-4 bg-gray-200 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── EmptyState ────────────────────────────────────────────────────────────
export function EmptyState({ icon = '📭', title = 'No records found', description = '' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center px-6">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-base font-semibold text-gray-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-400">{description}</p>}
    </div>
  );
}

// ─── PageError (inline, non-boundary) ─────────────────────────────────────
export function PageError({ message, onRetry }) {
  return (
    <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
      <span className="text-red-500 text-lg">✕</span>
      <div className="flex-1">
        <p className="text-sm text-red-700 font-medium">Error loading data</p>
        <p className="text-xs text-red-500 mt-1">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-red-600 underline hover:text-red-800"
        >
          Retry
        </button>
      )}
    </div>
  );
}
