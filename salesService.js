// M1 PR-01: feat/sales-api
// salesService.js — All sales table service functions
// Soft-delete only. No DELETE keyword used anywhere.

import { supabase } from '../supabaseClient';

/**
 * Fetch sales transactions.
 * USER sees ACTIVE only (RLS also enforces this at DB level).
 * ADMIN / SUPERADMIN see all records.
 */
export async function getSales(userType) {
  let query = supabase
    .from('sales_with_lookup')   // SQL view: joins customer + employee + salesDetail + priceHist
    .select('*')
    .order('salesDate', { ascending: false });

  if (userType === 'USER') {
    query = query.eq('record_status', 'ACTIVE');
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Fetch a single sales transaction by transNo.
 */
export async function getSaleByTransNo(transNo) {
  const { data, error } = await supabase
    .from('sales_with_lookup')
    .select('*')
    .eq('transNo', transNo)
    .single();
  if (error) throw error;
  return data;
}

/**
 * Create a new sales transaction.
 * Requires SALES_ADD = 1.
 * stamp: records who created it and when.
 */
export async function createSale({ salesDate, custNo, empNo, userId, username }) {
  const stamp = `CREATED by ${username} (${userId}) on ${new Date().toISOString()}`;

  const { data, error } = await supabase
    .from('sales')
    .insert([{ salesDate, custNo, empNo, record_status: 'ACTIVE', stamp }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing sales transaction (header fields only).
 * Requires SALES_EDIT = 1.
 */
export async function updateSale(transNo, { salesDate, custNo, empNo, userId, username }) {
  const stamp = `EDITED by ${username} (${userId}) on ${new Date().toISOString()}`;

  const { data, error } = await supabase
    .from('sales')
    .update({ salesDate, custNo, empNo, stamp })
    .eq('transNo', transNo)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Soft-delete a sales transaction.
 * Sets record_status = 'INACTIVE' on the sales row.
 * The cascade trigger (on_sales_status_change) automatically sets
 * all salesDetail rows for this transNo to INACTIVE as well.
 * Requires SALES_DEL = 1 (SUPERADMIN only).
 */
export async function softDeleteSale(transNo, { userId, username }) {
  const stamp = `DELETED by ${username} (${userId}) on ${new Date().toISOString()}`;

  const { data, error } = await supabase
    .from('sales')
    .update({ record_status: 'INACTIVE', stamp })
    .eq('transNo', transNo)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Recover a soft-deleted sales transaction.
 * Sets record_status = 'ACTIVE' on the sales row.
 * The cascade trigger automatically restores all salesDetail rows.
 * Requires ADMIN or SUPERADMIN.
 */
export async function recoverSale(transNo, { userId, username }) {
  const stamp = `RECOVERED by ${username} (${userId}) on ${new Date().toISOString()}`;

  const { data, error } = await supabase
    .from('sales')
    .update({ record_status: 'ACTIVE', stamp })
    .eq('transNo', transNo)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Fetch only INACTIVE (soft-deleted) sales — for Deleted Items panel.
 * ADMIN / SUPERADMIN only (RLS enforces at DB level).
 */
export async function getDeletedSales() {
  const { data, error } = await supabase
    .from('sales_with_lookup')
    .select('*')
    .eq('record_status', 'INACTIVE')
    .order('salesDate', { ascending: false });

  if (error) throw error;
  return data;
}
