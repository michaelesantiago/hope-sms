// M4 PR-01: feat/rights-admin-gating
// M4 PR-02: feat/rights-superadmin-guard
//
// AdminGating.jsx  — ADM_USER sidebar link gating
// SuperAdminGuard.jsx — SUPERADMIN row disabling in UserManagementPage

// ════════════════════════════════════════════════════════════════
// M4 PR-01: AdminGating
// The Admin sidebar link is already conditionally rendered in Sidebar.jsx
// via rights.ADM_USER === 1. This file documents the pattern and provides
// the AdminRoute guard for the /admin route itself.
// ════════════════════════════════════════════════════════════════
import { Navigate } from 'react-router-dom';
import { useRights } from '../context/UserRightsContext';
import { useAuth } from '../context/AuthContext';

/**
 * AdminRoute — blocks the /admin route for anyone without ADM_USER = 1.
 * Usage in App.jsx:
 *   <Route path="admin" element={<AdminRoute><UserManagementPage /></AdminRoute>} />
 */
export function AdminRoute({ children }) {
  const { rights, rightsLoaded } = useRights();
  if (!rightsLoaded) return null;
  if (rights.ADM_USER !== 1) return <Navigate to="/sales" replace />;
  return children;
}

/**
 * ReportsRoute — all authenticated users can access reports.
 * No right gating required — all 3 user types have access.
 * This component just confirms the route is open (no redirect).
 */
export function ReportsRoute({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
}

// ════════════════════════════════════════════════════════════════
// M4 PR-02: SuperAdminGuard
// Utility hook and component for protecting SUPERADMIN rows
// in UserManagementPage.
// ════════════════════════════════════════════════════════════════

/**
 * useSuperAdminGuard
 * Returns helpers for determining if a user row should be protected.
 *
 * Usage in UserManagementPage:
 *   const { isProtected, getTooltip, getButtonState } = useSuperAdminGuard();
 *
 *   const disabled = isProtected(row) || isCurrentUser(row);
 *   const tooltip = getTooltip(row);
 */
export function useSuperAdminGuard() {
  const { currentUser } = useAuth();

  /**
   * Returns true if the row represents a SUPERADMIN account.
   * These rows must be disabled for ALL users including other SUPERADMINs.
   */
  function isProtected(userRow) {
    return userRow.user_type === 'SUPERADMIN';
  }

  /**
   * Returns true if the row is the currently logged-in user.
   * Users should not be able to deactivate their own account.
   */
  function isCurrentUser(userRow) {
    return userRow.userId === currentUser?.userId;
  }

  /**
   * Returns the appropriate tooltip message for a disabled row.
   */
  function getTooltip(userRow) {
    if (isProtected(userRow)) return 'SUPERADMIN accounts cannot be modified';
    if (isCurrentUser(userRow)) return 'You cannot modify your own account';
    return null;
  }

  /**
   * Returns props for Activate/Deactivate buttons.
   * Merges disabled state + title tooltip into a single object.
   */
  function getButtonState(userRow) {
    const disabled = isProtected(userRow) || isCurrentUser(userRow);
    const title = getTooltip(userRow);
    return { disabled, title };
  }

  return { isProtected, isCurrentUser, getTooltip, getButtonState };
}

/**
 * SuperAdminBadge — shown on protected rows instead of action buttons.
 * @param {{ reason?: string }} props
 */
export function SuperAdminBadge({ reason = 'SUPERADMIN accounts cannot be modified' }) {
  return (
    <span
      className="text-xs text-gray-300 cursor-not-allowed select-none"
      title={reason}
      aria-label={reason}
    >
      Protected
    </span>
  );
}

/**
 * ProtectedRowHighlight — visual indicator for SUPERADMIN rows.
 * Wrap the <tr> className with this helper.
 * @param {boolean} isProtected
 * @param {string} baseClass
 */
export function protectedRowClass(isProtected, baseClass = '') {
  return `${baseClass} ${isProtected ? 'bg-purple-50/40 opacity-70' : 'hover:bg-gray-50'}`.trim();
}

// ════════════════════════════════════════════════════════════════
// Updated App.jsx additions for Sprint 3 (M4 changes)
// ════════════════════════════════════════════════════════════════
export const APP_ROUTE_ADDITIONS = `
// Add to App.jsx imports:
import { AdminRoute } from './context/AdminGating';

// Replace the admin placeholder route:
<Route
  path="admin"
  element={
    <AdminRoute>
      <UserManagementPage />
    </AdminRoute>
  }
/>
`;
