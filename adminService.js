// M1 PR-01: feat/admin-api
// adminService.js — User management functions for Admin module.
// SUPERADMIN rows are fully protected:
//   - getUsers() returns all users but UI flags SUPERADMIN rows
//   - activateUser() and deactivateUser() throw if target is SUPERADMIN
//   - RLS on the DB also rejects writes to SUPERADMIN rows (M3 PR-02)

import { supabase } from '../supabaseClient';

/**
 * Fetch all users for the User Management page.
 * ADMIN and SUPERADMIN only (RLS enforces this at DB level).
 * Returns: userId, username, user_type, record_status
 */
export async function getUsers() {
  const { data, error } = await supabase
    .from('user')
    .select('userId, username, user_type, record_status')
    .order('user_type', { ascending: true })
    .order('username', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Activate a user account (set record_status = 'ACTIVE').
 * SUPERADMIN rows are blocked at both service and RLS level.
 * @param {string} targetUserId
 * @param {{ userId: string, username: string }} currentUser
 */
export async function activateUser(targetUserId, { userId, username }) {
  // Guard: never modify SUPERADMIN rows — enforced here AND by RLS
  const { data: target, error: fetchError } = await supabase
    .from('user')
    .select('user_type, username')
    .eq('userId', targetUserId)
    .single();

  if (fetchError) throw fetchError;
  if (target.user_type === 'SUPERADMIN') {
    throw new Error('SUPERADMIN accounts cannot be modified.');
  }

  const stamp = `ACTIVATED by ${username} (${userId}) on ${new Date().toISOString()}`;

  const { data, error } = await supabase
    .from('user')
    .update({ record_status: 'ACTIVE', stamp })
    .eq('userId', targetUserId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Deactivate a user account (set record_status = 'INACTIVE').
 * SUPERADMIN rows are blocked at both service and RLS level.
 * @param {string} targetUserId
 * @param {{ userId: string, username: string }} currentUser
 */
export async function deactivateUser(targetUserId, { userId, username }) {
  // Guard: never modify SUPERADMIN rows
  const { data: target, error: fetchError } = await supabase
    .from('user')
    .select('user_type, username')
    .eq('userId', targetUserId)
    .single();

  if (fetchError) throw fetchError;
  if (target.user_type === 'SUPERADMIN') {
    throw new Error('SUPERADMIN accounts cannot be modified.');
  }

  const stamp = `DEACTIVATED by ${username} (${userId}) on ${new Date().toISOString()}`;

  const { data, error } = await supabase
    .from('user')
    .update({ record_status: 'INACTIVE', stamp })
    .eq('userId', targetUserId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
