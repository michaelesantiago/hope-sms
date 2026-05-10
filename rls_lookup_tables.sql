-- M3 PR-03: db/rls-lookup-tables
-- SELECT-only RLS for all four lookup tables.
-- RULE: No INSERT, UPDATE, or DELETE policies are created for any of these tables.
-- This enforces the lookup-only constraint at the database level
-- regardless of any UI-level controls.

-- ═══════════════════════════════════════════════════════════════
-- customer
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE customer ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS customer_lookup ON customer;
CREATE POLICY customer_lookup ON customer
  FOR SELECT TO authenticated
  USING (true);

-- NO INSERT policy for customer
-- NO UPDATE policy for customer
-- NO DELETE policy for customer

-- ═══════════════════════════════════════════════════════════════
-- employee
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE employee ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS employee_lookup ON employee;
CREATE POLICY employee_lookup ON employee
  FOR SELECT TO authenticated
  USING (true);

-- NO INSERT policy for employee
-- NO UPDATE policy for employee
-- NO DELETE policy for employee

-- ═══════════════════════════════════════════════════════════════
-- product
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE product ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS product_lookup ON product;
CREATE POLICY product_lookup ON product
  FOR SELECT TO authenticated
  USING (true);

-- NO INSERT policy for product
-- NO UPDATE policy for product
-- NO DELETE policy for product

-- ═══════════════════════════════════════════════════════════════
-- priceHist
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE "priceHist" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pricehist_lookup ON "priceHist";
CREATE POLICY pricehist_lookup ON "priceHist"
  FOR SELECT TO authenticated
  USING (true);

-- NO INSERT policy for priceHist
-- NO UPDATE policy for priceHist
-- NO DELETE policy for priceHist

-- ─── VERIFICATION — Confirm only SELECT policies exist ────────────────────────
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('customer', 'employee', 'product', 'priceHist')
ORDER BY tablename, cmd;

-- Expected output:
-- customer  | customer_lookup  | SELECT
-- employee  | employee_lookup  | SELECT
-- priceHist | pricehist_lookup | SELECT
-- product   | product_lookup   | SELECT
--
-- No INSERT, UPDATE, or DELETE rows should appear for any of these tables.

-- ─── BYPASS TEST — Try writing to a lookup table (should fail) ────────────────
-- Run as any authenticated user. All of these should throw permission denied:
--
-- INSERT INTO customer VALUES ('C9999','Test Corp','Test St','COD');
-- UPDATE customer SET custname = 'Hacked' WHERE custno = 'C0001';
-- UPDATE employee SET lastname = 'Hacked' WHERE empno = '00001';
-- UPDATE product SET description = 'Hacked' WHERE "prodCode" = 'AD0001';
-- UPDATE "priceHist" SET "unitPrice" = 0 WHERE "prodCode" = 'AD0001';
