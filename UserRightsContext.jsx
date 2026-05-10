// M4 PR-01: feat/rights-context
// M4 PR-02: feat/rights-sales-gating
//
// UserRightsContext.jsx — loads all 13 rights on login
// useRights.js          — exposes rights map to all components
// RightsGate.jsx        — conditional render wrapper for gated UI elements

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

// ─── Default rights (all OFF) ─────────────────────────────────────────────────
export const DEFAULT_RIGHTS = {
  SALES_VIEW:   0,
  SALES_ADD:    0,
  SALES_EDIT:   0,
  SALES_DEL:    0,
  SD_VIEW:      0,
  SD_ADD:       0,
  SD_EDIT:      0,
  SD_DEL:       0,
  CUST_LOOKUP:  0,
  EMP_LOOKUP:   0,
  PROD_LOOKUP:  0,
  PRICE_LOOKUP: 0,
  ADM_USER:     0,
};

const UserRightsContext = createContext({
  rights: DEFAULT_RIGHTS,
  rightsLoaded: false,
  reloadRights: () => {},
});

// ═══════════════════════════════════════════════════════════════
// Provider — wrap at app root (inside AuthProvider)
// ═══════════════════════════════════════════════════════════════
export function UserRightsProvider({ children }) {
  const { currentUser } = useAuth();
  const [rights, setRights] = useState(DEFAULT_RIGHTS);
  const [rightsLoaded, setRightsLoaded] = useState(false);

  async function loadRights(userId) {
    if (!userId) {
      setRights(DEFAULT_RIGHTS);
      setRightsLoaded(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('UserModule_Rights')
        .select('rightCode, right_value')
        .eq('userId', userId);

      if (error) throw error;

      const loaded = { ...DEFAULT_RIGHTS };
      (data || []).forEach(({ rightCode, right_value }) => {
        if (rightCode in loaded) loaded[rightCode] = right_value;
      });

      setRights(loaded);
    } catch (err) {
      console.error('[UserRightsContext] Failed to load rights:', err.message);
      setRights(DEFAULT_RIGHTS);
    } finally {
      setRightsLoaded(true);
    }
  }

  useEffect(() => {
    loadRights(currentUser?.userId ?? null);
  }, [currentUser?.userId]);

  const reloadRights = () => loadRights(currentUser?.userId ?? null);

  return (
    <UserRightsContext.Provider value={{ rights, rightsLoaded, reloadRights }}>
      {children}
    </UserRightsContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════
// useRights — M4 PR-01
// Exposes rights map + loaded flag to any component
// Usage: const { rights, rightsLoaded } = useRights();
//        if (rights.SALES_ADD === 1) { ... }
// ═══════════════════════════════════════════════════════════════
export function useRights() {
  const ctx = useContext(UserRightsContext);
  if (!ctx) throw new Error('useRights must be used inside <UserRightsProvider>');
  return ctx;
}

// ═══════════════════════════════════════════════════════════════
// RightsGate — M4 PR-02
// Renders children only when the specified right equals 1.
// Renders nothing (or fallback) otherwise.
//
// Usage:
//   <RightsGate right="SALES_ADD">
//     <button>Create Transaction</button>
//   </RightsGate>
//
//   <RightsGate right="SALES_DEL" fallback={<span className="text-gray-300 text-xs">—</span>}>
//     <button>Delete</button>
//   </RightsGate>
// ═══════════════════════════════════════════════════════════════
export function RightsGate({ right, children, fallback = null }) {
  const { rights, rightsLoaded } = useRights();
  if (!rightsLoaded) return null;
  return rights[right] === 1 ? children : fallback;
}

// ═══════════════════════════════════════════════════════════════
// AdminPlusGate — renders children for ADMIN and SUPERADMIN only
// Usage: <AdminPlusGate><StampColumn /></AdminPlusGate>
// ═══════════════════════════════════════════════════════════════
export function AdminPlusGate({ children, fallback = null }) {
  const { currentUser } = useAuth();
  const isAdminPlus = ['ADMIN', 'SUPERADMIN'].includes(currentUser?.user_type);
  return isAdminPlus ? children : fallback;
}

// ═══════════════════════════════════════════════════════════════
// SuperAdminGate — renders children for SUPERADMIN only
// Usage: <SuperAdminGate><DeleteButton /></SuperAdminGate>
// ═══════════════════════════════════════════════════════════════
export function SuperAdminGate({ children, fallback = null }) {
  const { currentUser } = useAuth();
  return currentUser?.user_type === 'SUPERADMIN' ? children : fallback;
}

// ─── Quick reference: button gating patterns ──────────────────────────────────
//
// SALES module:
//   <RightsGate right="SALES_ADD"><button>Create Transaction</button></RightsGate>
//   <RightsGate right="SALES_EDIT"><button>Edit</button></RightsGate>
//   <RightsGate right="SALES_DEL"><button>Delete</button></RightsGate>  // SUPERADMIN only (right_value=1 only for SUPERADMIN)
//
// SALESDETAIL module:
//   <RightsGate right="SD_ADD"><button>Add Line Item</button></RightsGate>
//   <RightsGate right="SD_EDIT"><button>Edit</button></RightsGate>
//   <RightsGate right="SD_DEL"><button>Delete</button></RightsGate>  // SUPERADMIN only
//
// STAMP columns (hidden for USER):
//   <AdminPlusGate><td>{row.stamp}</td></AdminPlusGate>
//
// SIDEBAR links (Deleted Items + Admin):
//   <AdminPlusGate><NavLink to="/deleted-items">Deleted Items</NavLink></AdminPlusGate>
//   <RightsGate right="ADM_USER"><NavLink to="/admin">Admin</NavLink></RightsGate>
