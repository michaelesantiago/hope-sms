-- M3 PR-04: db/trigger-cascade-sales
-- Cascade soft-delete trigger: sales → salesDetail
-- When a sales row changes record_status:
--   ACTIVE → INACTIVE : all its salesDetail rows also set to INACTIVE
--   INACTIVE → ACTIVE  : all its salesDetail rows restored to ACTIVE
--
-- CRITICAL: This trigger must be committed and tested together.
-- No hard DELETE is involved — only record_status UPDATE.

-- ─── Drop existing trigger and function if re-running migration ───────────────
DROP TRIGGER IF EXISTS on_sales_status_change ON sales;
DROP FUNCTION IF EXISTS cascade_sales_soft_delete();

-- ─── Function ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION cascade_sales_soft_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- ── Cascade SOFT DELETE: ACTIVE → INACTIVE ──────────────────────────────────
  IF NEW.record_status = 'INACTIVE' AND OLD.record_status = 'ACTIVE' THEN
    UPDATE "salesDetail"
    SET
      record_status = 'INACTIVE',
      stamp = 'CASCADE-DEL from ' || NEW."transNo" || ' | ' || NOW()::text
    WHERE "transNo" = NEW."transNo"
      AND record_status = 'ACTIVE';
    -- Only updates ACTIVE lines — already-INACTIVE lines are left untouched.
    -- This preserves the original stamp on individually soft-deleted lines.
  END IF;

  -- ── Cascade RECOVERY: INACTIVE → ACTIVE ─────────────────────────────────────
  IF NEW.record_status = 'ACTIVE' AND OLD.record_status = 'INACTIVE' THEN
    UPDATE "salesDetail"
    SET
      record_status = 'ACTIVE',
      stamp = 'CASCADE-RECOVER from ' || NEW."transNo" || ' | ' || NOW()::text
    WHERE "transNo" = NEW."transNo"
      AND record_status = 'INACTIVE';
    -- Restores all INACTIVE lines belonging to this transaction.
    -- Lines that were individually soft-deleted before the parent will also
    -- be restored here (matches cascade behavior documented in spec).
  END IF;

  RETURN NEW;
END;
$$;

-- ─── Trigger ──────────────────────────────────────────────────────────────────
CREATE TRIGGER on_sales_status_change
  AFTER UPDATE OF record_status ON sales
  FOR EACH ROW
  EXECUTE FUNCTION cascade_sales_soft_delete();

-- ─── VERIFICATION QUERIES ─────────────────────────────────────────────────────
-- Step 1: Check current line item count for TR000001
SELECT "transNo", "prodCode", record_status, stamp
FROM "salesDetail"
WHERE "transNo" = 'TR000001'
ORDER BY "prodCode";

-- Step 2: Soft-delete TR000001 (run as SUPERADMIN)
-- UPDATE sales SET record_status = 'INACTIVE', stamp = 'TEST DEL'
-- WHERE "transNo" = 'TR000001';

-- Step 3: Verify cascade — all TR000001 salesDetail rows should now be INACTIVE
-- SELECT "transNo", "prodCode", record_status FROM "salesDetail"
-- WHERE "transNo" = 'TR000001';

-- Step 4: As USER — query should return zero rows (RLS blocks INACTIVE)
-- SELECT * FROM "salesDetail" WHERE "transNo" = 'TR000001';

-- Step 5: Recover TR000001 (run as ADMIN or SUPERADMIN)
-- UPDATE sales SET record_status = 'ACTIVE', stamp = 'TEST RECOVER'
-- WHERE "transNo" = 'TR000001';

-- Step 6: Verify recovery — all TR000001 salesDetail rows should be ACTIVE again
-- SELECT "transNo", "prodCode", record_status FROM "salesDetail"
-- WHERE "transNo" = 'TR000001';

-- Confirm trigger exists:
SELECT tgname, tgenabled FROM pg_trigger
WHERE tgname = 'on_sales_status_change';
