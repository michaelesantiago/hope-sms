# Hope SMS — 12-Slide Capstone Presentation Outline
**PR:** docs/presentation-slides  
**Assignee:** Loterte, Justine R.  
**Course:** BS Information Technology Capstone  
**University:** New Era University

---

## Slide 1 — Title Slide
**Title:** Hope SMS — Sales Management System  
**Subtitle:** BS Information Technology Capstone Project  
**Team:**
- M1: Santiago, Michael E. — Project Lead
- M2: Velasco, Crisglynver G. — Frontend Developer
- M3: Bachiler, Ranezet Vhon — Database Engineer
- M4: Manilag, Sebastian Andrew N. — Rights & Auth
- M5: Loterte, Justine R. — QA / Documentation

**Visual:** App logo / landing screenshot

---

## Slide 2 — Project Overview
**Title:** What is Hope SMS?

**Content:**
- Web-based Sales Management System for Hope, Inc.
- Built with React 18, Vite, Tailwind CSS, and Supabase
- 3 user types: USER (Sales Agent), ADMIN (Sales Manager), SUPERADMIN
- 13 rights controlling every button and route in the system
- Deployed to production at [URL]

**Visual:** Screenshot of the Sales Transactions page

---

## Slide 3 — 6-Table Database Architecture
**Title:** HopeDB — 6-Table Architecture

**Content:**
- `sales` — transaction header (transNo, salesDate, custNo, empNo)
- `salesDetail` — line items (transNo, prodCode, quantity)
- `customer` — 82 records (read-only lookup)
- `employee` — 31 records (read-only lookup)
- `product` — 52 records (read-only lookup)
- `priceHist` — price history with effective dates
- `record_status` + `stamp` on sales and salesDetail only
- Cascade soft-delete trigger: sales → salesDetail

**Visual:** ERD diagram from M3 Sprint 1

---

## Slide 4 — Rights Matrix
**Title:** 13 Rights × 3 User Types

**Content (table):**

| Right | USER | ADMIN | SUPERADMIN |
|---|:-:|:-:|:-:|
| SALES_VIEW | 1 | 1 | 1 |
| SALES_ADD | 0 | 1 | 1 |
| SALES_EDIT | 0 | 1 | 1 |
| SALES_DEL | 0 | 0 | 1 |
| SD_VIEW | 1 | 1 | 1 |
| SD_ADD | 0 | 1 | 1 |
| SD_EDIT | 0 | 1 | 1 |
| SD_DEL | 0 | 0 | 1 |
| CUST/EMP/PROD/PRICE_LOOKUP | 1 | 1 | 1 |
| ADM_USER | 0 | 1 | 1 |

**Visual:** Color-coded table (green = 1, red = 0)

---

## Slide 5 — Sales CRUD Demo
**Title:** Sales Transactions — Rights-Gated CRUD

**Content:**
- SalesListPage: filter by date and customer
- AddSaleModal: customer and employee lookup dropdowns
- EditSaleModal: pre-filled from existing record
- SoftDeleteSaleDialog: SUPERADMIN only
- Stamp column: visible to ADMIN/SUPERADMIN only

**Visual:** Side-by-side screenshots of the same page as USER vs ADMIN (showing/hiding buttons)

---

## Slide 6 — Lookup Dropdown Integration
**Title:** Lookup Dropdowns + Price Auto-Fill

**Content:**
- Customer dropdown in AddSaleModal — populated from `customer` table via RLS SELECT
- Employee dropdown — populated from `employee` table
- Product dropdown in AddLineItemModal — populated from `product` table
- Unit price auto-fills from `priceHist` using MAX(effDate) per product
- Example: PC0001 — two price entries, system picks $454.54 (2010-07-12) over $499.99 (2010-05-15)

**Visual:** Screenshot of AddLineItemModal with price auto-filled

---

## Slide 7 — Cascade Soft-Delete Demo
**Title:** Cascade Soft-Delete & Recovery

**Content:**
- No hard DELETE anywhere in the system
- Soft-delete: set record_status = 'INACTIVE'
- Cascade trigger (on_sales_status_change): sales INACTIVE → all salesDetail rows INACTIVE
- Recovery: INACTIVE → ACTIVE, same cascade in reverse
- RLS enforces visibility: USER sees ACTIVE only, ADMIN/SUPERADMIN see all

**Visual:** Before/after table showing TR000001 disappearing from USER view, visible in Deleted Items for ADMIN

---

## Slide 8 — 4 Reports
**Title:** Sales Reports

**Content:**
- Sales by Employee — bar chart, sortable table
- Sales by Customer — top 10 chart, full table
- Top Products Sold — horizontal bar chart, revenue ranked
- Monthly Sales Trend — time-series bar chart, date range filter
- All powered by 4 SQL views (sales_by_employee, sales_by_customer, top_products_sold, monthly_sales_trend)

**Visual:** Screenshot of Monthly Sales Trend page with chart

---

## Slide 9 — Admin Module + SUPERADMIN Protection
**Title:** User Management & SUPERADMIN Guard

**Content:**
- UserManagementPage: visible to ADMIN and SUPERADMIN only
- Activate / Deactivate buttons per user
- SUPERADMIN rows: greyed out, buttons disabled, tooltip shown
- DB-level RLS: ADMIN UPDATE on SUPERADMIN row → rejected
- Two layers of protection: UI + RLS

**Visual:** Screenshot of UserManagementPage with SUPERADMIN row greyed out

---

## Slide 10 — Security Architecture
**Title:** Row-Level Security (RLS) Summary

**Content:**
- 8 tables with RLS enabled
- `sales` + `salesDetail`: 5 policies each (SELECT, INSERT, UPDATE ×3)
- `customer`, `employee`, `product`, `priceHist`: SELECT only (no write policies)
- `user` + `UserModule_Rights`: SUPERADMIN guard
- 0 hard DELETE policies on any table
- 23 RLS policies total across all tables

**Visual:** Summary table from M3 Final RLS Audit

---

## Slide 11 — Testing & QA
**Title:** Test Coverage

**Content:**
- 39-case rights matrix (13 rights × 3 user types) — all PASS
- Cascade soft-delete + recovery — 6 test cases — all PASS
- RLS bypass test — USER direct API call blocked — PASS
- Lookup mutation-free — 12 test cases (4 pages × 3 user types) — all PASS
- Price auto-fill — getCurrentPrice returns MAX effDate — PASS
- Full production E2E — 68 test cases — all PASS

**Visual:** Test results summary table

---

## Slide 12 — Lessons Learned & Conclusion
**Title:** Lessons Learned

**Content:**
- Merge order matters — DB views must exist before service functions query them
- RLS is not optional — client-side filtering alone is bypassable
- Soft-delete is harder than hard delete but preserves audit history
- Price history with effective dates requires MAX(effDate) not just the latest row
- Sprint planning upfront (PRs before code) prevented scope creep

**Conclusion:**
- Live URL: `https://hope-sms.vercel.app`
- 57 PRs merged across 3 sprints
- 6 tables, 13 rights, 3 user types, 4 reports, 1 cascade trigger
- 0 hard deletes

**Visual:** App final screenshot / team photo
