// M1 PR-03: feat/lookup-api
// lookupService.js — Read-only lookups for all 4 reference tables.
// NO write operations (insert / update / delete) exist here.
// RLS on the DB also enforces SELECT-only for all authenticated users.

import { supabase } from '../supabaseClient';

/**
 * Fetch all customers for dropdown and lookup page.
 * Returns: custno, custname, address, payterm
 */
export async function getCustomers() {
  const { data, error } = await supabase
    .from('customer')
    .select('custno, custname, address, payterm')
    .order('custname', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Fetch all employees for dropdown and lookup page.
 * Returns: empno, lastname, firstname, gender, hiredate (sepDate omitted from UI)
 */
export async function getEmployees() {
  const { data, error } = await supabase
    .from('employee')
    .select('empno, lastname, firstname, gender, hiredate')
    .order('lastname', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Fetch all products for dropdown and lookup page.
 * Returns: prodCode, description, unit
 */
export async function getProducts() {
  const { data, error } = await supabase
    .from('product')
    .select('prodCode, description, unit')
    .order('description', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Get the CURRENT unit price for a product.
 * Current = the priceHist row with MAX(effDate) for this prodCode.
 * Called when a user selects a product on the AddLineItem / EditLineItem modal
 * to auto-fill the unit price field.
 *
 * @param {string} prodCode
 * @returns {{ unitPrice: number, effDate: string }}
 */
export async function getCurrentPrice(prodCode) {
  const { data, error } = await supabase
    .from('priceHist')
    .select('prodCode, effDate, unitPrice')
    .eq('prodCode', prodCode)
    .order('effDate', { ascending: false })
    .limit(1)
    .single();

  if (error) throw error;
  return data;  // { prodCode, effDate, unitPrice }
}

/**
 * Fetch full price history for a product — used on the Price History lookup page.
 * @param {string} prodCode  (optional) — if omitted, returns all priceHist rows
 */
export async function getPriceHistory(prodCode = null) {
  let query = supabase
    .from('priceHist')
    .select('prodCode, effDate, unitPrice')
    .order('prodCode', { ascending: true })
    .order('effDate', { ascending: false });

  if (prodCode) {
    query = query.eq('prodCode', prodCode);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Helper: format employee full name for display in dropdowns.
 * @param {{ lastname: string, firstname: string }} emp
 */
export function formatEmpName(emp) {
  return `${emp.lastname}, ${emp.firstname}`;
}
