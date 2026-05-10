-- M3 PR-01: db/views-reports-3
-- Three SQL views for the Sprint 3 report pages.
-- All views are read-only aggregations — no DML.
-- Run in Supabase SQL Editor in order (1 → 2 → 3).

-- ═══════════════════════════════════════════════════════════════
-- VIEW 1: sales_by_employee
-- Used by: SalesByEmployeePage
-- Groups active sales by employee; joins employee name.
-- ═══════════════════════════════════════════════════════════════
DROP VIEW IF EXISTS sales_by_employee;

CREATE VIEW sales_by_employee AS
SELECT
  s."empNo",
  e.lastname || ', ' || e.firstname   AS "empName",
  COUNT(DISTINCT s."transNo")         AS "totalTransactions",
  SUM(sd.quantity * ph."unitPrice")   AS "totalRevenue"

FROM sales s
JOIN employee e ON e.empno = s."empNo"

LEFT JOIN "salesDetail" sd
  ON sd."transNo"      = s."transNo"
  AND sd.record_status = 'ACTIVE'

LEFT JOIN (
  SELECT ph1."prodCode", ph1."unitPrice"
  FROM "priceHist" ph1
  WHERE ph1."effDate" = (
    SELECT MAX(ph2."effDate") FROM "priceHist" ph2
    WHERE ph2."prodCode" = ph1."prodCode"
  )
) ph ON ph."prodCode" = sd."prodCode"

WHERE s.record_status = 'ACTIVE'

GROUP BY s."empNo", e.lastname, e.firstname
ORDER BY "totalRevenue" DESC;

-- Verification:
-- SELECT * FROM sales_by_employee;
-- Should list each employee with their transaction count and total revenue.


-- ═══════════════════════════════════════════════════════════════
-- VIEW 2: sales_by_customer
-- Used by: SalesByCustomerPage
-- Groups active sales by customer; joins customer name + payterm.
-- ═══════════════════════════════════════════════════════════════
DROP VIEW IF EXISTS sales_by_customer;

CREATE VIEW sales_by_customer AS
SELECT
  s."custNo",
  c.custname,
  c.payterm,
  COUNT(DISTINCT s."transNo")         AS "totalTransactions",
  SUM(sd.quantity * ph."unitPrice")   AS "totalSpend"

FROM sales s
JOIN customer c ON c.custno = s."custNo"

LEFT JOIN "salesDetail" sd
  ON sd."transNo"      = s."transNo"
  AND sd.record_status = 'ACTIVE'

LEFT JOIN (
  SELECT ph1."prodCode", ph1."unitPrice"
  FROM "priceHist" ph1
  WHERE ph1."effDate" = (
    SELECT MAX(ph2."effDate") FROM "priceHist" ph2
    WHERE ph2."prodCode" = ph1."prodCode"
  )
) ph ON ph."prodCode" = sd."prodCode"

WHERE s.record_status = 'ACTIVE'

GROUP BY s."custNo", c.custname, c.payterm
ORDER BY "totalSpend" DESC;

-- Verification:
-- SELECT * FROM sales_by_customer LIMIT 5;
-- Top customer should appear first.


-- ═══════════════════════════════════════════════════════════════
-- VIEW 3: top_products_sold
-- Used by: TopProductsPage
-- Aggregates active line items by product; joins description + unit.
-- ═══════════════════════════════════════════════════════════════
DROP VIEW IF EXISTS top_products_sold;

CREATE VIEW top_products_sold AS
SELECT
  sd."prodCode",
  p.description,
  p.unit,
  SUM(sd.quantity)                    AS "totalQtySold",
  SUM(sd.quantity * ph."unitPrice")   AS "totalRevenue"

FROM "salesDetail" sd
JOIN product p ON p."prodCode" = sd."prodCode"

LEFT JOIN (
  SELECT ph1."prodCode", ph1."unitPrice"
  FROM "priceHist" ph1
  WHERE ph1."effDate" = (
    SELECT MAX(ph2."effDate") FROM "priceHist" ph2
    WHERE ph2."prodCode" = ph1."prodCode"
  )
) ph ON ph."prodCode" = sd."prodCode"

WHERE sd.record_status = 'ACTIVE'

GROUP BY sd."prodCode", p.description, p.unit
ORDER BY "totalRevenue" DESC;

-- Verification:
-- SELECT * FROM top_products_sold LIMIT 5;
-- Product with highest revenue appears first.


-- ═══════════════════════════════════════════════════════════════
-- VIEW 4: monthly_sales_trend
-- Used by: MonthlySalesTrendPage
-- Groups active sales by YYYY-MM; shows count + total revenue.
-- ═══════════════════════════════════════════════════════════════
DROP VIEW IF EXISTS monthly_sales_trend;

CREATE VIEW monthly_sales_trend AS
SELECT
  TO_CHAR(s."salesDate", 'YYYY-MM')   AS "saleMonth",
  COUNT(DISTINCT s."transNo")          AS "transactionCount",
  SUM(sd.quantity * ph."unitPrice")    AS "totalRevenue"

FROM sales s

LEFT JOIN "salesDetail" sd
  ON sd."transNo"      = s."transNo"
  AND sd.record_status = 'ACTIVE'

LEFT JOIN (
  SELECT ph1."prodCode", ph1."unitPrice"
  FROM "priceHist" ph1
  WHERE ph1."effDate" = (
    SELECT MAX(ph2."effDate") FROM "priceHist" ph2
    WHERE ph2."prodCode" = ph1."prodCode"
  )
) ph ON ph."prodCode" = sd."prodCode"

WHERE s.record_status = 'ACTIVE'

GROUP BY TO_CHAR(s."salesDate", 'YYYY-MM')
ORDER BY "saleMonth" ASC;

-- Verification:
-- SELECT * FROM monthly_sales_trend;
-- Should return one row per month in chronological order.
-- Check: earliest month in DB is 2010-01 based on seed data.
