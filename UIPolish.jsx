// M2 PR-03: fix/ui-final-polish
// Toast.jsx        — error/success toast notifications
// PageSkeleton.jsx — full page loading skeleton
// Updated App.jsx route additions for Sprint 3 pages

// ════════════════════════════════════════════════════════════════
// Toast.jsx — global toast notification system
// Usage: import { useToast, ToastContainer } from '../components/Toast'
//        const { showToast } = useToast();
//        showToast('Saved!', 'success');
//        showToast('Something went wrong.', 'error');
// ════════════════════════════════════════════════════════════════
import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext({ showToast: () => {} });

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
            t.type === 'error'
              ? 'bg-red-600 text-white'
              : t.type === 'warning'
              ? 'bg-yellow-500 text-white'
              : 'bg-green-600 text-white'
          }`}
        >
          <span className="text-base leading-none mt-0.5">
            {t.type === 'error' ? '✕' : t.type === 'warning' ? '⚠' : '✓'}
          </span>
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => onDismiss(t.id)}
            className="text-white/70 hover:text-white text-lg leading-none ml-2"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PageSkeleton.jsx — full-page shimmer skeleton for report pages
// Usage: if (loading) return <PageSkeleton rows={6} />;
// ════════════════════════════════════════════════════════════════
export function PageSkeleton({ rows = 5, showChart = false }) {
  return (
    <div className="p-6 max-w-5xl mx-auto animate-pulse">
      {/* Title skeleton */}
      <div className="h-7 bg-gray-200 rounded w-64 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-40 mb-6" />

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 rounded-xl p-4 h-20" />
        ))}
      </div>

      {/* Chart skeleton */}
      {showChart && (
        <div className="bg-gray-100 rounded-xl h-64 mb-6" />
      )}

      {/* Table skeleton */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 h-10" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-3 border-b border-gray-100">
            <div className="h-4 bg-gray-200 rounded w-8" />
            <div className="h-4 bg-gray-200 rounded flex-1" />
            <div className="h-4 bg-gray-200 rounded w-16" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Sprint 3 route additions for App.jsx
// Add these routes inside the protected <Route path="/"> block
// ════════════════════════════════════════════════════════════════
export const SPRINT3_ROUTES = `
// Add to App.jsx inside the protected route block:

import UserManagementPage from './pages/UserManagementPage';
import {
  SalesByEmployeePage,
  SalesByCustomerPage,
  TopProductsPage,
  MonthlySalesTrendPage,
} from './pages/reports/ReportPages';

// Inside <Route path="/">:
<Route path="admin"                    element={<UserManagementPage />} />
<Route path="reports/by-employee"      element={<SalesByEmployeePage />} />
<Route path="reports/by-customer"      element={<SalesByCustomerPage />} />
<Route path="reports/top-products"     element={<TopProductsPage />} />
<Route path="reports/monthly-trend"    element={<MonthlySalesTrendPage />} />
`;

// ════════════════════════════════════════════════════════════════
// Mobile responsive utility classes (apply to existing pages)
// Add these to modals that need mobile fixes
// ════════════════════════════════════════════════════════════════
export const RESPONSIVE_FIXES = {
  // Modal container — full screen on mobile
  modalContainer: 'fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40',
  // Modal box — full width on mobile, max-w-md on desktop
  modalBox: 'bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md mx-0 sm:mx-4 overflow-hidden',
  // Table wrapper — horizontal scroll on mobile
  tableWrapper: 'overflow-x-auto -mx-6 sm:mx-0 sm:rounded-xl border border-gray-200 shadow-sm',
  // Page padding — smaller on mobile
  pagePadding: 'p-4 sm:p-6 max-w-full',
};
