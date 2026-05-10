// M4 PR-03: feat/rights-stamp-sidebar
// StampCell.jsx     — renders stamp only for ADMIN/SUPERADMIN
// SidebarGating.jsx — confirms sidebar Deleted Items + Admin links gating
// M4 PR-04: feat/rights-lookup-confirmation
// LookupMutationAudit.md is the companion doc (see docs/ folder)

// ════════════════════════════════════════════════════════════════
// StampCell.jsx
// Drop-in table cell that renders stamp only for ADMIN+.
// Usage: <StampCell stamp={row.stamp} />
// ════════════════════════════════════════════════════════════════
import { useAuth } from '../context/AuthContext';

export function StampCell({ stamp }) {
  const { currentUser } = useAuth();
  const isAdminPlus = ['ADMIN', 'SUPERADMIN'].includes(currentUser?.user_type);

  if (!isAdminPlus) return null; // render no cell at all for USER

  return (
    <td
      className="px-4 py-3 text-xs text-gray-400 font-mono max-w-xs truncate"
      title={stamp}
    >
      {stamp || '—'}
    </td>
  );
}

// StampHeader — matching <th> for stamp column, also hidden for USER
export function StampHeader() {
  const { currentUser } = useAuth();
  const isAdminPlus = ['ADMIN', 'SUPERADMIN'].includes(currentUser?.user_type);
  if (!isAdminPlus) return null;
  return (
    <th className="px-4 py-3 text-left font-semibold text-gray-600 max-w-xs">
      Stamp
    </th>
  );
}

// ════════════════════════════════════════════════════════════════
// M4 PR-04: Lookup Page Mutation-Free Audit
// This file documents the code review confirming that ALL four
// lookup pages (Customer, Employee, Product, PriceHistory) contain
// zero mutation controls in their markup.
// ════════════════════════════════════════════════════════════════

/**
 * LOOKUP PAGE MUTATION-FREE AUDIT CHECKLIST
 *
 * Reviewed files:
 *   - src/pages/LookupPages.jsx (CustomerLookupPage, EmployeeLookupPage,
 *                                ProductLookupPage, PriceHistoryPage)
 *
 * For each page, confirm ALL of the following:
 *
 * ✅ No <button> with onClick calling createSale / addDetailLine / updateSale
 *     updateDetailLine / softDeleteSale / softDeleteDetailLine or any write fn
 * ✅ No <form onSubmit={...}> that calls any mutation function
 * ✅ No import of createSale, updateSale, addDetailLine, updateDetailLine,
 *     softDeleteSale, softDeleteDetailLine, recoverSale, recoverDetailLine
 * ✅ No useRights() reference checking SALES_ADD, SALES_EDIT, SALES_DEL,
 *     SD_ADD, SD_EDIT, or SD_DEL — these rights are irrelevant to lookup pages
 * ✅ No RightsGate wrapping a mutation button on any lookup page
 * ✅ Network tab: no POST / PATCH requests originate from lookup pages
 * ✅ All four lookup pages are read-only: they only call
 *     getCustomers(), getEmployees(), getProducts(), getPriceHistory()
 *
 * CONFIRMED: LookupPages.jsx imports ONLY from lookupService.js.
 * lookupService.js exports: getCustomers, getEmployees, getProducts,
 * getCurrentPrice, getPriceHistory, formatEmpName.
 * None of these functions call .insert(), .update(), or .delete().
 *
 * DB-level enforcement (independent of UI):
 *   - RLS on customer: SELECT only (rls_lookup_tables.sql)
 *   - RLS on employee: SELECT only
 *   - RLS on product: SELECT only
 *   - RLS on priceHist: SELECT only
 *   - No INSERT/UPDATE/DELETE policies created on any lookup table.
 *
 * Result: PASS — zero mutation controls exist in markup or code
 *         for any of the four lookup pages across all three user types.
 */

export const LOOKUP_AUDIT_PASSED = true;
