-- M3 PR-02: db/rls-admin-superadmin-guard
-- SUPERADMIN protection RLS policies.
-- ADMIN cannot INSERT/UPDATE/DELETE rows belonging to SUPERADMIN users.
-- This is the DB-level enforcement that backs up the UI protection in M4 PR-02.

-- ═══════════════════════════════════════════════════════════════
-- PART 1: user table — ADMIN UPDATE restriction
-- ADMIN can only update record_status on USER accounts.
-- SUPERADMIN rows are completely off-limits for ADMIN updates.
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts (from Sprint 2 M3)
DROP POLICY IF EXISTS user_select_own ON public.user;
DROP POLICY IF EXISTS user_select_admin ON public.user;
DROP POLICY IF EXISTS user_update_admin ON public.user;

-- SELECT: own row
CREATE POLICY user_select_own ON public.user
  FOR SELECT TO authenticated
  USING ("userId" = auth.uid()::text);

-- SELECT: ADMIN/SUPERADMIN see all
CREATE POLICY user_select_admin ON public.user
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user u
      WHERE u."userId" = auth.uid()::text
        AND u.user_type IN ('ADMIN', 'SUPERADMIN')
    )
  );

-- UPDATE: ADMIN can only modify non-SUPERADMIN rows
-- SUPERADMIN can modify any row (for their own account management)
DROP POLICY IF EXISTS user_update_admin ON public.user;
CREATE POLICY user_update_admin ON public.user
  FOR UPDATE TO authenticated
  USING (
    (
      -- ADMIN: can update any row EXCEPT SUPERADMIN rows
      EXISTS (
        SELECT 1 FROM public.user u
        WHERE u."userId" = auth.uid()::text
          AND u.user_type = 'ADMIN'
      )
      AND user_type != 'SUPERADMIN'
    )
    OR
    (
      -- SUPERADMIN: can update any row including their own
      EXISTS (
        SELECT 1 FROM public.user u
        WHERE u."userId" = auth.uid()::text
          AND u.user_type = 'SUPERADMIN'
      )
    )
  )
  WITH CHECK (
    -- Neither ADMIN nor SUPERADMIN can escalate a user to SUPERADMIN via UI
    -- (They can only toggle record_status between ACTIVE and INACTIVE)
    user_type != 'SUPERADMIN'
    OR EXISTS (
      SELECT 1 FROM public.user u
      WHERE u."userId" = auth.uid()::text
        AND u.user_type = 'SUPERADMIN'
    )
  );

-- ═══════════════════════════════════════════════════════════════
-- PART 2: UserModule_Rights — ADMIN cannot touch SUPERADMIN rights
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE public."UserModule_Rights" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS umr_select ON public."UserModule_Rights";
DROP POLICY IF EXISTS umr_insert_admin ON public."UserModule_Rights";
DROP POLICY IF EXISTS umr_update_admin ON public."UserModule_Rights";
DROP POLICY IF EXISTS umr_delete_admin ON public."UserModule_Rights";

-- SELECT: authenticated users can read own rights; ADMIN/SA read all
CREATE POLICY umr_select ON public."UserModule_Rights"
  FOR SELECT TO authenticated
  USING (
    "userId" = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM public.user u
      WHERE u."userId" = auth.uid()::text
        AND u.user_type IN ('ADMIN', 'SUPERADMIN')
    )
  );

-- INSERT: ADMIN cannot insert rights for SUPERADMIN users
CREATE POLICY umr_insert_admin ON public."UserModule_Rights"
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user u
      WHERE u."userId" = auth.uid()::text
        AND u.user_type IN ('ADMIN', 'SUPERADMIN')
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.user target
      WHERE target."userId" = "userId"
        AND target.user_type = 'SUPERADMIN'
        AND NOT EXISTS (
          SELECT 1 FROM public.user actor
          WHERE actor."userId" = auth.uid()::text
            AND actor.user_type = 'SUPERADMIN'
        )
    )
  );

-- UPDATE: ADMIN cannot update rights for SUPERADMIN users
CREATE POLICY umr_update_admin ON public."UserModule_Rights"
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user u
      WHERE u."userId" = auth.uid()::text
        AND u.user_type IN ('ADMIN', 'SUPERADMIN')
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.user target
      WHERE target."userId" = "UserModule_Rights"."userId"
        AND target.user_type = 'SUPERADMIN'
        AND NOT EXISTS (
          SELECT 1 FROM public.user actor
          WHERE actor."userId" = auth.uid()::text
            AND actor.user_type = 'SUPERADMIN'
        )
    )
  );

-- ═══════════════════════════════════════════════════════════════
-- VERIFICATION TESTS
-- Run each as ADMIN account to confirm blocks:
-- ═══════════════════════════════════════════════════════════════

-- Test 1: ADMIN tries to deactivate SUPERADMIN — should be BLOCKED
-- UPDATE public.user SET record_status = 'INACTIVE'
-- WHERE "userId" = '[superadmin-user-id]';
-- Expected: ERROR: new row violates row-level security policy

-- Test 2: ADMIN tries to update SUPERADMIN rights — should be BLOCKED
-- UPDATE public."UserModule_Rights" SET right_value = 0
-- WHERE "userId" = '[superadmin-user-id]';
-- Expected: ERROR: new row violates row-level security policy

-- Test 3: SUPERADMIN updates another user — should SUCCEED
-- UPDATE public.user SET record_status = 'INACTIVE'
-- WHERE "userId" = '[regular-user-id]';
-- Expected: 1 row updated

-- Confirm policies:
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('user', 'UserModule_Rights')
ORDER BY tablename, policyname;
