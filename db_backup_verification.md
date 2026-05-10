# Database Backup Verification Log
**PR:** db/final-db-backup  
**Assignee:** Bachiler, Ranezet Vhon  
**Sprint:** Sprint 3

---

## Supabase Backup Verification Steps

### Step 1 — Confirm Point-in-Time Recovery is enabled

1. Go to Supabase Dashboard → **Project Settings** → **Database**
2. Scroll to **Backups** section
3. Confirm: **Daily backups** are enabled (Pro plan) or note that free tier has 7-day PITR

> **Free tier note:** Supabase free tier includes daily backups retained for 7 days.
> Pro tier includes Point-in-Time Recovery (PITR) retained for up to 30 days.

---

### Step 2 — Export a manual backup via Supabase Dashboard

1. Go to **Project Settings** → **Database** → **Backups**
2. Click **Download backup** on the latest snapshot
3. Save the `.sql` dump file as: `hopedb_backup_sprint3_YYYYMMDD.sql`
4. Commit the filename (not the file itself) to `/docs/backups/` as proof

---

### Step 3 — Verify row counts before backup

Run in Supabase SQL Editor:

```sql
SELECT 'sales'          AS tbl, COUNT(*) AS rows FROM sales
UNION ALL
SELECT 'salesDetail',           COUNT(*)          FROM "salesDetail"
UNION ALL
SELECT 'customer',              COUNT(*)          FROM customer
UNION ALL
SELECT 'employee',              COUNT(*)          FROM employee
UNION ALL
SELECT 'product',               COUNT(*)          FROM product
UNION ALL
SELECT 'priceHist',             COUNT(*)          FROM "priceHist"
UNION ALL
SELECT 'user',                  COUNT(*)          FROM public.user
UNION ALL
SELECT 'UserModule_Rights',     COUNT(*)          FROM public."UserModule_Rights"
ORDER BY tbl;
```

**Expected minimum row counts (from seed data):**

| Table | Min Rows |
|---|---|
| `sales` | 124 |
| `salesDetail` | ~310 |
| `customer` | 82 |
| `employee` | 31 |
| `product` | 52 |
| `priceHist` | ~70 |
| `user` | ≥ 1 (SUPERADMIN + registered users) |
| `UserModule_Rights` | ≥ 13 (per user) |

---

### Step 4 — Verify foreign key integrity

```sql
-- Sales referencing non-existent customers
SELECT COUNT(*) AS broken_sales_cust
FROM sales s
WHERE NOT EXISTS (SELECT 1 FROM customer c WHERE c.custno = s."custNo");

-- Sales referencing non-existent employees
SELECT COUNT(*) AS broken_sales_emp
FROM sales s
WHERE NOT EXISTS (SELECT 1 FROM employee e WHERE e.empno = s."empNo");

-- SalesDetail referencing non-existent transactions
SELECT COUNT(*) AS broken_sd_trans
FROM "salesDetail" sd
WHERE NOT EXISTS (SELECT 1 FROM sales s WHERE s."transNo" = sd."transNo");

-- SalesDetail referencing non-existent products
SELECT COUNT(*) AS broken_sd_prod
FROM "salesDetail" sd
WHERE NOT EXISTS (SELECT 1 FROM product p WHERE p."prodCode" = sd."prodCode");
```

**Expected result:** All queries return 0. Any non-zero value indicates a FK integrity issue.

---

## Backup Log

| Item | Status | Notes |
|---|---|---|
| Daily backup enabled in Supabase Dashboard | ✅ Confirmed | Free tier — 7-day retention |
| Manual SQL dump exported | ✅ Completed | `hopedb_backup_sprint3_[date].sql` |
| Row counts verified | ✅ Pass | All tables meet minimum seed counts |
| FK integrity verified | ✅ Pass | All 4 FK checks return 0 |
| Backup filename committed to `/docs/backups/` | ✅ Done | |

---

Completed by: Bachiler, Ranezet Vhon  
Date: Sprint 3, Week 6
