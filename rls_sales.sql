-- M3 PR-01: db/rls-sales
-- Row Level Security for the sales table.
-- 5 policies: SELECT visibility, INSERT, UPDATE (edit), UPDATE (soft-delete), UPDATE (recover)
-- NO DELETE policy — hard deletes are prohibited by project rules.
-- Run in Supabase SQL Editor. Enable RLS first.

-- ─── 0. Enable RLS ────────────────────────────────────────────────────────────
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- ─── 1. SELECT — Visibility Policy ───────────────────────────────────────────
-- USER sees ACTIVE rows only.
-- ADMIN and SUPERADMIN see ALL rows (including INACTIVE).
DROP POLICY IF EXISTS sales_select ON sales;
CREATE POLICY sales_select ON sales
  FOR SELECT TO authenticated
  USING (
    record_status = 'ACTIVE'
    OR EXISTS (
      SELECT 1 FROM public.user u
      WHERE u."userId" = auth.uid()::text
        AND u.user_type IN ('ADMIN', 'SUPERADMIN')
    )
  );

-- ─── 2. INSERT — Create Transaction (SALES_ADD = 1) ──────────────────────────
DROP POLICY IF EXISTS sales_insert ON sales;
CREATE POLICY sales_insert ON sales
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."UserModule_Rights" r
      WHERE r."userId" = auth.uid()::text
        AND r."rightCode" = 'SALES_ADD'
        AND r.right_value = 1
    )
  );

-- ─── 3. UPDATE (edit fields) — SALES_EDIT = 1 ────────────────────────────────
-- Allows updating salesDate, custNo, empNo, stamp (NOT record_status).
-- Note: record_status changes are handled by the two policies below.
DROP POLICY IF EXISTS sales_update_edit ON sales;
CREATE POLICY sales_update_edit ON sales
  FOR UPDATE TO authenticated
  USING (
    record_status = 'ACTIVE'
    AND EXISTS (
      SELECT 1 FROM public."UserModule_Rights" r
      WHERE r."userId" = auth.uid()::text
        AND r."rightCode" = 'SALES_EDIT'
        AND r.right_value = 1
    )
  )
  WITH CHECK (record_status = 'ACTIVE');

-- ─── 4. UPDATE record_status ACTIVE → INACTIVE (Soft Delete) — SALES_DEL = 1 ─
DROP POLICY IF EXISTS sales_update_softdelete ON sales;
CREATE POLICY sales_update_softdelete ON sales
  FOR UPDATE TO authenticated
  USING (
    record_status = 'ACTIVE'
    AND EXISTS (
      SELECT 1 FROM public."UserModule_Rights" r
      WHERE r."userId" = auth.uid()::text
        AND r."rightCode" = 'SALES_DEL'
        AND r.right_value = 1
    )
  )
  WITH CHECK (record_status = 'INACTIVE');

-- ─── 5. UPDATE record_status INACTIVE → ACTIVE (Recovery) — ADMIN/SUPERADMIN ─
DROP POLICY IF EXISTS sales_update_recover ON sales;
CREATE POLICY sales_update_recover ON sales
  FOR UPDATE TO authenticated
  USING (
    record_status = 'INACTIVE'
    AND EXISTS (
      SELECT 1 FROM public.user u
      WHERE u."userId" = auth.uid()::text
        AND u.user_type IN ('ADMIN', 'SUPERADMIN')
    )
  )
  WITH CHECK (record_status = 'ACTIVE');

-- ─── Verification ─────────────────────────────────────────────────────────────
-- Run as each user type to confirm behavior:

-- As USER: should only return ACTIVE rows
-- SELECT * FROM sales WHERE record_status = 'INACTIVE'; -- should return empty

-- As ADMIN: should return all rows
-- SELECT transNo, record_status FROM sales ORDER BY salesDate DESC LIMIT 5;

-- Confirm no DELETE policy exists:
SELECT policyname, cmd FROM pg_policies
WHERE tablename = 'sales'
ORDER BY policyname;
-- Expected: sales_insert, sales_select, sales_update_edit, sales_update_softdelete, sales_update_recover
-- NO policy with cmd = 'DELETE' should appear.
