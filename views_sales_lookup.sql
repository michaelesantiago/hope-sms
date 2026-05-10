-- M3 PR-05: db/views-sales-lookup
-- Two SQL views for enriched data display:
--   1. sales_with_lookup      — sales + customer + employee + line item count + total amount
--   2. salesdetail_with_product — salesDetail + product description + current unit price

-- ═══════════════════════════════════════════════════════════════
-- VIEW 1: sales_with_lookup
-- Used by: SalesListPage, SalesDetailPage (header section)
-- Joins: sales → customer, employee; aggregates salesDetail + priceHist
-- ═══════════════════════════════════════════════════════════════
DROP VIEW IF EXISTS sales_with_lookup;

CREATE VIEW sales_with_lookup AS
SELECT
  s."transNo",
  s."salesDate",
  s."record_status",
  s."stamp",

  -- Customer fields
  s."custNo",
  c.custname,
  c.payterm,

  -- Employee fields
  s."empNo",
  e.lastname || ', ' || e.firstname AS "empName",

  -- Line item aggregates (ACTIVE lines only for count + total)
  COUNT(sd."prodCode")                         AS "lineItemCount",
  SUM(sd.quantity * ph."unitPrice")            AS "totalAmount"

FROM sales s
JOIN customer  c   ON c.custno   = s."custNo"
JOIN employee  e   ON e.empno    = s."empNo"

-- Join ACTIVE salesDetail lines only for aggregation
LEFT JOIN "salesDetail" sd
  ON sd."transNo"       = s."transNo"
  AND sd.record_status  = 'ACTIVE'

-- Latest price per product (subquery gets MAX effDate per prodCode)
LEFT JOIN (
  SELECT ph1."prodCode", ph1."unitPrice"
  FROM "priceHist" ph1
  WHERE ph1."effDate" = (
    SELECT MAX(ph2."effDate")
    FROM "priceHist" ph2
    WHERE ph2."prodCode" = ph1."prodCode"
  )
) ph ON ph."prodCode" = sd."prodCode"

GROUP BY
  s."transNo", s."salesDate", s."record_status", s."stamp",
  s."custNo", c.custname, c.payterm,
  s."empNo", e.lastname, e.firstname

ORDER BY s."salesDate" DESC;

-- ─── Verification ────────────────────────────────────────────────────────────
-- SELECT * FROM sales_with_lookup LIMIT 5;
-- Should show transNo, salesDate, custname, empName, lineItemCount, totalAmount


-- ═══════════════════════════════════════════════════════════════
-- VIEW 2: salesdetail_with_product
-- Used by: SalesDetailPage (line items table), DeletedItemsPage (Line Items tab)
-- Joins: salesDetail → product description + latest priceHist unit price
-- ═══════════════════════════════════════════════════════════════
DROP VIEW IF EXISTS salesdetail_with_product;

CREATE VIEW salesdetail_with_product AS
SELECT
  sd."transNo",
  sd."prodCode",
  sd.quantity,
  sd.record_status,
  sd.stamp,

  -- Product fields
  p.description,
  p.unit,

  -- Current unit price from priceHist (MAX effDate)
  ph."unitPrice",
  ph."effDate"   AS "priceEffDate",

  -- Computed line total
  (sd.quantity * ph."unitPrice") AS "lineTotal"

FROM "salesDetail" sd
JOIN product p ON p."prodCode" = sd."prodCode"

LEFT JOIN (
  SELECT ph1."prodCode", ph1."unitPrice", ph1."effDate"
  FROM "priceHist" ph1
  WHERE ph1."effDate" = (
    SELECT MAX(ph2."effDate")
    FROM "priceHist" ph2
    WHERE ph2."prodCode" = ph1."prodCode"
  )
) ph ON ph."prodCode" = sd."prodCode"

ORDER BY sd."transNo", sd."prodCode";

-- ─── Verification ────────────────────────────────────────────────────────────
-- SELECT * FROM salesdetail_with_product WHERE "transNo" = 'TR000001';
-- Expected: 4 rows (AK0002, AM0003, MD0001, PC0002) with description, unit, unitPrice, lineTotal

-- Verify price auto-fill logic (same as getCurrentPrice in lookupService.js):
-- SELECT "prodCode", "unitPrice", "effDate"
-- FROM "priceHist"
-- WHERE "effDate" = (SELECT MAX("effDate") FROM "priceHist" WHERE "prodCode" = 'PC0001')
--   AND "prodCode" = 'PC0001';
-- Expected: effDate = 2010-07-12, unitPrice = 454.54 (the more recent of the two PC0001 entries)
