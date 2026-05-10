// M4 PR-02: feat/rights-superadmin-guard
// Branch: feat/rights-superadmin-guard
// File: src/hooks/useSuperAdminGuard.js
//
// Provides the hook and helper used by UserManagementPage (M2 PR-01)
// to disable and grey out SUPERADMIN rows.
//
// Three layers of SUPERADMIN protection:
//   Layer 1 (this file) — UI: buttons disabled + greyed out
//   Layer 2 (adminService.js M1 PR-01) — service: throws before calling Supabase
//   Layer 3 (rls_admin_superadmin_guard.sql M3 PR-02) — DB: RLS rejects the UPDATE

import { useAuth } from '../context/AuthContext';

/**
 * useSuperAdminGuard
 * Returns helpers for protecting SUPERADMIN rows in UserManagementPage.
 *
 * Usage:
 *   const { isProtected, isCurrentUser, getTooltip, getButtonProps } = useSuperAdminGuard();
 *
 *   <button
 *     {...getButtonProps(row)}
 *     onClick={() => handleActivate(row)}
 *   >
 *     Activate
 *   </button>
 *
 *   <tr className={isProtected(row) ? 'opacity-60 bg-purple-50' : ''}>
 */
export function useSuperAdminGuard() {
  const { currentUser } = useAuth();

  /**
   * Returns true when the row belongs to a SUPERADMIN account.
   * SUPERADMIN rows must be disabled for ALL users, including other SUPERADMINs.
   */
  function isProtected(userRow) {
    return userRow.user_type === 'SUPERADMIN';
  }

  /**
   * Returns true when the row is the currently logged-in user.
   * Users must not be able to deactivate their own account.
   */
  function isCurrentUser(userRow) {
    return userRow.userId === currentUser?.userId;
  }

  /**
   * Returns the tooltip string to show on hover for a disabled row.
   * Returns null when no tooltip is needed.
   */
  function getTooltip(userRow) {
    if (isProtected(userRow)) {
      return 'SUPERADMIN accounts cannot be modified';
    }
    if (isCurrentUser(userRow)) {
      return 'You cannot modify your own account';
    }
    return null;
  }

  /**
   * Returns button props (disabled + title) merged into one object.
   * Spread directly onto the Activate/Deactivate <button> element.
   *
   * Example:
   *   <button {...getButtonProps(row)} onClick={...}>Activate</button>
   */
  function getButtonProps(userRow) {
    const disabled = isProtected(userRow) || isCurrentUser(userRow);
    const title = getTooltip(userRow) ?? undefined;
    return {
      disabled,
      title,
      'aria-disabled': disabled,
      className: disabled
        ? 'text-xs px-3 py-1 rounded-lg bg-gray-100 text-gray-300 cursor-not-allowed'
        : undefined,
    };
  }

  /**
   * Returns the className for a table row.
   * Greyed-out purple tint for SUPERADMIN rows, normal hover for others.
   */
  function getRowClass(userRow) {
    return isProtected(userRow)
      ? 'bg-purple-50/40 opacity-60'
      : 'hover:bg-gray-50 transition-colors';
  }

  return { isProtected, isCurrentUser, getTooltip, getButtonProps, getRowClass };
}

// ─── How this integrates into UserManagementPage ──────────────────────────────
//
// In UserManagementPage.jsx (M2 PR-01), replace the inline logic with:
//
//   import { useSuperAdminGuard } from '../hooks/useSuperAdminGuard';
//
//   const { isProtected, isCurrentUser, getButtonProps, getRowClass } = useSuperAdminGuard();
//
//   {users.map((user) => (
//     <tr key={user.userId} className={getRowClass(user)}>
//       ...
//       <td>
//         {isProtected(user) ? (
//           <span
//             className="text-xs text-gray-300 cursor-not-allowed"
//             title="SUPERADMIN accounts cannot be modified"
//           >
//             Protected
//           </span>
//         ) : isCurrentUser(user) ? (
//           <span className="text-xs text-gray-300">—</span>
//         ) : (
//           <>
//             {user.record_status === 'INACTIVE' ? (
//               <button
//                 {...getButtonProps(user)}
//                 onClick={() => handleActivate(user)}
//                 className="text-xs px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
//               >
//                 Activate
//               </button>
//             ) : (
//               <button
//                 {...getButtonProps(user)}
//                 onClick={() => handleDeactivate(user)}
//                 className="text-xs px-3 py-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
//               >
//                 Deactivate
//               </button>
//             )}
//           </>
//         )}
//       </td>
//     </tr>
//   ))}
