# Final RLS Audit Checklist
**PR:** docs/final-rls-audit  
**Assignee:** Bachiler, Ranezet Vhon  
**Sprint:** Sprint 3

---

## RLS Policy Audit — All 6 Tables + Rights Tables

### 1. `sales` table — 5 policies expected

| Policy | CMD | Right Required | Expected Behavior |
|---|---|---|---|
| `sales_select` | SELECT | — | USER sees ACTIVE only; ADMIN/SUPERADMIN see all |
| `sales_insert` | INSERT | SALES_ADD = 1 | Any user with SALES_ADD right can create |
| `sales_update_edit` | UPDATE | SALES_EDIT = 1 | Edit header fields on ACTIVE rows |
| `sales_update_softdelete` | UPDATE | SALES_DEL = 1 | Set ACTIVE → INACTIVE |
| `sales_update_recover` | UPDATE | ADMIN/SUPERADMIN | Set INACTIVE → ACTIVE |

**Verification query:**
```sql
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'sales' ORDER BY policyname;
```
Expected: 5 rows. **No DELETE policy.**

---

### 2. `salesDetail` table — 5 policies expected

| Policy | CMD | Right Required | Expected Behavior |
|---|---|---|---|
| `salesdetail_select` | SELECT | — | USER sees ACTIVE only; ADMIN/SUPERADMIN see all |
| `salesdetail_insert` | INSERT | SD_ADD = 1 | Any user with SD_ADD right can add line items |
| `salesdetail_update_edit` | UPDATE | SD_EDIT = 1 | Edit quantity on ACTIVE rows |
| `salesdetail_update_softdelete` | UPDATE | SD_DEL = 1 | Set ACTIVE → INACTIVE |
| `salesdetail_update_recover` | UPDATE | ADMIN/SUPERADMIN | Set INACTIVE → ACTIVE |

**Verification query:**
```sql
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'salesDetail' ORDER BY policyname;
```
Expected: 5 rows. **No DELETE policy.**

---

### 3. `customer` table — 1 policy expected (SELECT only)

| Policy | CMD | Expected Behavior |
|---|---|---|
| `customer_lookup` | SELECT | All authenticated users can read |

**Verification:**
```sql
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'customer';
```
Expected: 1 row (SELECT). **No INSERT, UPDATE, or DELETE policies.**

---

### 4. `employee` table — 1 policy expected (SELECT only)

Same pattern as `customer`. **No write policies.**

---

### 5. `product` table — 1 policy expected (SELECT only)

Same pattern as `customer`. **No write policies.**

---

### 6. `priceHist` table — 1 policy expected (SELECT only)

Same pattern as `customer`. **No write policies.**

---

### 7. `user` table — 3 policies expected

| Policy | CMD | Expected Behavior |
|---|---|---|
| `user_select_own` | SELECT | Users read their own row |
| `user_select_admin` | SELECT | ADMIN/SUPERADMIN read all rows |
| `user_update_admin` | UPDATE | ADMIN updates non-SUPERADMIN rows only |

**SUPERADMIN guard confirmed:** ADMIN cannot UPDATE rows where `user_type = 'SUPERADMIN'`.

---

### 8. `UserModule_Rights` table — 3 policies expected

| Policy | CMD | Expected Behavior |
|---|---|---|
| `umr_select` | SELECT | Users read own rights; ADMIN/SA read all |
| `umr_insert_admin` | INSERT | ADMIN cannot insert for SUPERADMIN users |
| `umr_update_admin` | UPDATE | ADMIN cannot update SUPERADMIN user rights |

---

## Hard Delete Audit

**Grep command — run in project root:**
```bash
grep -r "\.delete(" src/
grep -r " DELETE " src/
grep -rn "DELETE FROM" supabase/
```

**Expected result:** 0 matches in all three commands.

**Result:** ✅ 0 hard DELETE statements found in any application or database file.

---

## Cascade Trigger Audit

**Confirm trigger exists:**
```sql
SELECT tgname, tgenabled FROM pg_trigger
WHERE tgname = 'on_sales_status_change';
```
Expected: 1 row, `tgenabled = 'O'` (origin).

**Confirm trigger function:**
```sql
SELECT proname FROM pg_proc WHERE proname = 'cascade_sales_soft_delete';
```
Expected: 1 row.

---

## Final Summary

| Table | RLS Enabled | Policy Count | DELETE Policy | Result |
|---|:-:|:-:|:-:|:-:|
| `sales` | ✅ | 5 | ❌ None | ✅ PASS |
| `salesDetail` | ✅ | 5 | ❌ None | ✅ PASS |
| `customer` | ✅ | 1 (SELECT) | ❌ None | ✅ PASS |
| `employee` | ✅ | 1 (SELECT) | ❌ None | ✅ PASS |
| `product` | ✅ | 1 (SELECT) | ❌ None | ✅ PASS |
| `priceHist` | ✅ | 1 (SELECT) | ❌ None | ✅ PASS |
| `user` | ✅ | 3 | ❌ None | ✅ PASS |
| `UserModule_Rights` | ✅ | 3 | ❌ None | ✅ PASS |
| Hard delete in code | — | — | 0 found | ✅ PASS |
| Cascade trigger | — | — | — | ✅ PASS |

**Overall: ALL PASS**

Audited by: Bachiler, Ranezet Vhon  
Date: Sprint 3, Week 6
