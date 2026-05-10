-- M3 PR-02: db/rls-salesdetail
-- Row Level Security for the salesDetail table.
-- Same 5-policy pattern as sales: SELECT, INSERT, UPDATE (edit), UPDATE (soft-delete), UPDATE (recover)
-- NO DELETE policy.

-- ─── 0. Enable RLS ────────────────────────────────────────────────────────────
ALTER TABLE "salesDetail" ENABLE ROW LEVEL SECURITY;

-- ─── 1. SELECT — Visibility Policy ───────────────────────────────────────────
-- USER sees ACTIVE detail rows only.
-- ADMIN and SUPERADMIN see ALL (ACTIVE + INACTIVE).
DROP POLICY IF EXISTS salesdetail_select ON "salesDetail";
CREATE POLICY salesdetail_select ON "salesDetail"
  FOR SELECT TO authenticated
  USING (
    record_status = 'ACTIVE'
    OR EXISTS (
      SELECT 1 FROM public.user u
      WHERE u."userId" = auth.uid()::text
        AND u.user_type IN ('ADMIN', 'SUPERADMIN')
    )
  );

-- ─── 2. INSERT — Add Line Item (SD_ADD = 1) ───────────────────────────────────
DROP POLICY IF EXISTS salesdetail_insert ON "salesDetail";
CREATE POLICY salesdetail_insert ON "salesDetail"
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."UserModule_Rights" r
      WHERE r."userId" = auth.uid()::text
        AND r."rightCode" = 'SD_ADD'
        AND r.right_value = 1
    )
  );

-- ─── 3. UPDATE (edit quantity/stamp) — SD_EDIT = 1 ───────────────────────────
DROP POLICY IF EXISTS salesdetail_update_edit ON "salesDetail";
CREATE POLICY salesdetail_update_edit ON "salesDetail"
  FOR UPDATE TO authenticated
  USING (
    record_status = 'ACTIVE'
    AND EXISTS (
      SELECT 1 FROM public."UserModule_Rights" r
      WHERE r."userId" = auth.uid()::text
        AND r."rightCode" = 'SD_EDIT'
        AND r.right_value = 1
    )
  )
  WITH CHECK (record_status = 'ACTIVE');

-- ─── 4. UPDATE record_status ACTIVE → INACTIVE (Soft Delete) — SD_DEL = 1 ────
DROP POLICY IF EXISTS salesdetail_update_softdelete ON "salesDetail";
CREATE POLICY salesdetail_update_softdelete ON "salesDetail"
  FOR UPDATE TO authenticated
  USING (
    record_status = 'ACTIVE'
    AND EXISTS (
      SELECT 1 FROM public."UserModule_Rights" r
      WHERE r."userId" = auth.uid()::text
        AND r."rightCode" = 'SD_DEL'
        AND r.right_value = 1
    )
  )
  WITH CHECK (record_status = 'INACTIVE');

-- ─── 5. UPDATE record_status INACTIVE → ACTIVE (Recovery) — ADMIN/SUPERADMIN ─
DROP POLICY IF EXISTS salesdetail_update_recover ON "salesDetail";
CREATE POLICY salesdetail_update_recover ON "salesDetail"
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
-- After soft-deleting TR000001 as SUPERADMIN:
-- As USER: SELECT * FROM "salesDetail" WHERE "transNo" = 'TR000001'; -- should return empty
-- As ADMIN: SELECT * FROM "salesDetail" WHERE "transNo" = 'TR000001'; -- should return all rows

SELECT policyname, cmd FROM pg_policies
WHERE tablename = 'salesDetail'
ORDER BY policyname;
-- Expected 5 policies, NO DELETE policy.
