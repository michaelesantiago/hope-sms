// M1 PR-02: feat/salesdetail-api
// salesDetailService.js — All salesDetail table service functions
// Soft-delete only. No DELETE keyword used anywhere.

import { supabase } from '../supabaseClient';

/**
 * Fetch all line items for a given transaction.
 * USER sees ACTIVE only. ADMIN/SUPERADMIN see all.
 */
export async function getDetailByTrans(transNo, userType) {
  let query = supabase
    .from('salesdetail_with_product')  // SQL view: joins product + latest priceHist
    .select('*')
    .eq('transNo', transNo)
    .order('prodCode', { ascending: true });

  if (userType === 'USER') {
    query = query.eq('record_status', 'ACTIVE');
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Add a new line item to a transaction.
 * Requires SD_ADD = 1.
 * Note: composite PK is (transNo, prodCode) — one product per transaction.
 */
export async function addDetailLine({ transNo, prodCode, quantity, userId, username }) {
  const stamp = `CREATED by ${username} (${userId}) on ${new Date().toISOString()}`;

  const { data, error } = await supabase
    .from('salesDetail')
    .insert([{ transNo, prodCode, quantity, record_status: 'ACTIVE', stamp }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing line item (quantity only — prodCode is part of PK).
 * Requires SD_EDIT = 1.
 */
export async function updateDetailLine(transNo, prodCode, { quantity, userId, username }) {
  const stamp = `EDITED by ${username} (${userId}) on ${new Date().toISOString()}`;

  const { data, error } = await supabase
    .from('salesDetail')
    .update({ quantity, stamp })
    .eq('transNo', transNo)
    .eq('prodCode', prodCode)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Soft-delete a single line item.
 * Sets record_status = 'INACTIVE' on this salesDetail row only.
 * Does NOT cascade to the parent sales row.
 * Requires SD_DEL = 1 (SUPERADMIN only).
 */
export async function softDeleteDetailLine(transNo, prodCode, { userId, username }) {
  const stamp = `DELETED by ${username} (${userId}) on ${new Date().toISOString()}`;

  const { data, error } = await supabase
    .from('salesDetail')
    .update({ record_status: 'INACTIVE', stamp })
    .eq('transNo', transNo)
    .eq('prodCode', prodCode)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Recover a soft-deleted line item.
 * Requires ADMIN or SUPERADMIN.
 */
export async function recoverDetailLine(transNo, prodCode, { userId, username }) {
  const stamp = `RECOVERED by ${username} (${userId}) on ${new Date().toISOString()}`;

  const { data, error } = await supabase
    .from('salesDetail')
    .update({ record_status: 'ACTIVE', stamp })
    .eq('transNo', transNo)
    .eq('prodCode', prodCode)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Fetch only INACTIVE line items — for Deleted Items panel (Line Items tab).
 * ADMIN / SUPERADMIN only (RLS enforces at DB level).
 */
export async function getDeletedDetailLines() {
  const { data, error } = await supabase
    .from('salesdetail_with_product')
    .select('*')
    .eq('record_status', 'INACTIVE')
    .order('transNo', { ascending: true });

  if (error) throw error;
  return data;
}
