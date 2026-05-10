// M1 PR-04: feat/rights-context-route-guard
// UserRightsContext.jsx — Provides all 13 rights to the entire app.
// Also exports DeletedItemsRoute guard that blocks USER accounts.

import { createContext, useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

// ─── Default: all rights OFF until loaded ───────────────────────────────────
const DEFAULT_RIGHTS = {
  SALES_VIEW: 0,
  SALES_ADD: 0,
  SALES_EDIT: 0,
  SALES_DEL: 0,
  SD_VIEW: 0,
  SD_ADD: 0,
  SD_EDIT: 0,
  SD_DEL: 0,
  CUST_LOOKUP: 0,
  EMP_LOOKUP: 0,
  PROD_LOOKUP: 0,
  PRICE_LOOKUP: 0,
  ADM_USER: 0,
};

const UserRightsContext = createContext({
  rights: DEFAULT_RIGHTS,
  rightsLoaded: false,
});

// ─── Provider ────────────────────────────────────────────────────────────────
export function UserRightsProvider({ children }) {
  const { currentUser } = useAuth();
  const [rights, setRights] = useState(DEFAULT_RIGHTS);
  const [rightsLoaded, setRightsLoaded] = useState(false);

  useEffect(() => {
    if (!currentUser?.userId) {
      setRights(DEFAULT_RIGHTS);
      setRightsLoaded(false);
      return;
    }

    async function loadRights() {
      const { data, error } = await supabase
        .from('UserModule_Rights')
        .select('rightCode, right_value')
        .eq('userId', currentUser.userId);

      if (error) {
        console.error('Failed to load rights:', error);
        setRights(DEFAULT_RIGHTS);
        setRightsLoaded(true);
        return;
      }

      // Build rights map from DB rows
      const loaded = { ...DEFAULT_RIGHTS };
      data.forEach(({ rightCode, right_value }) => {
        if (rightCode in loaded) {
          loaded[rightCode] = right_value;
        }
      });

      setRights(loaded);
      setRightsLoaded(true);
    }

    loadRights();
  }, [currentUser]);

  return (
    <UserRightsContext.Provider value={{ rights, rightsLoaded }}>
      {children}
    </UserRightsContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useRights() {
  return useContext(UserRightsContext);
}

// ─── Route Guard: /deleted-items — blocked for USER ──────────────────────────
// Usage in router:
//   <Route path="/deleted-items" element={
//     <DeletedItemsRoute><DeletedItemsPage /></DeletedItemsRoute>
//   } />
export function DeletedItemsRoute({ children }) {
  const { currentUser } = useAuth();
  const { rightsLoaded } = useRights();

  if (!rightsLoaded) return null; // wait for rights to load

  if (currentUser?.user_type === 'USER') {
    return <Navigate to="/sales" replace />;
  }

  return children;
}
