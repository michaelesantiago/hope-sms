// M1 PR-02: feat/reports-api
// reportsService.js — All 4 report service functions.
// Each queries a dedicated SQL view created by M3 PR-01 (db/views-reports-3).
// All functions are read-only — no insert, update, or delete.

import { supabase } from '../supabaseClient';

/**
 * Sales by Employee report.
 * Source view: sales_by_employee
 * Returns: empNo, empName, totalTransactions, totalRevenue
 * Ordered by totalRevenue DESC.
 */
export async function getSalesByEmployee() {
  const { data, error } = await supabase
    .from('sales_by_employee')
    .select('empNo, empName, totalTransactions, totalRevenue')
    .order('totalRevenue', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Sales by Customer report.
 * Source view: sales_by_customer
 * Returns: custNo, custname, payterm, totalTransactions, totalSpend
 * Ordered by totalSpend DESC.
 */
export async function getSalesByCustomer() {
  const { data, error } = await supabase
    .from('sales_by_customer')
    .select('custNo, custname, payterm, totalTransactions, totalSpend')
    .order('totalSpend', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Top Products Sold report.
 * Source view: top_products_sold
 * Returns: prodCode, description, unit, totalQtySold, totalRevenue
 * Ordered by totalRevenue DESC.
 */
export async function getTopProducts() {
  const { data, error } = await supabase
    .from('top_products_sold')
    .select('prodCode, description, unit, totalQtySold, totalRevenue')
    .order('totalRevenue', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Monthly Sales Trend report.
 * Source view: monthly_sales_trend
 * Returns: saleMonth (YYYY-MM), transactionCount, totalRevenue
 * Ordered by saleMonth ASC (chronological).
 * Optional date range filter.
 * @param {{ from?: string, to?: string }} range — YYYY-MM strings
 */
export async function getMonthlySalesTrend({ from = null, to = null } = {}) {
  let query = supabase
    .from('monthly_sales_trend')
    .select('saleMonth, transactionCount, totalRevenue')
    .order('saleMonth', { ascending: true });

  if (from) query = query.gte('saleMonth', from);
  if (to)   query = query.lte('saleMonth', to);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Helper: format currency for display in report tables and charts.
 * @param {number} value
 * @returns {string} e.g. "$12,345.67"
 */
export function formatCurrency(value) {
  return value != null
    ? `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : '—';
}

/**
 * Helper: format month label for chart axis.
 * @param {string} saleMonth — "YYYY-MM"
 * @returns {string} e.g. "Jan 2010"
 */
export function formatMonth(saleMonth) {
  if (!saleMonth) return '—';
  const [year, month] = saleMonth.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
