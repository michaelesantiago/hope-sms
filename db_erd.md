# HopeDB Entity Relationship Diagram
**Sprint 1 · Week 2 | M3 — Bachiler, Ranezet Vhon**
**Branch:** docs/db-erd

---

## Table Overview

| Table | Type | Role |
|-------|------|------|
| `sales` | Primary managed | Sales transactions — full CRUD, soft-delete |
| `salesDetail` | Primary managed | Line items per transaction — full CRUD, soft-delete |
| `customer` | Lookup only | Populates custNo dropdown — SELECT only |
| `employee` | Lookup only | Populates empNo dropdown — SELECT only |
| `product` | Lookup only | Populates prodCode dropdown — SELECT only |
| `priceHist` | Lookup only | Auto-fills unit price — SELECT only |
| `user` | Auth/Rights | SMS user accounts — SUPERADMIN, ADMIN, USER |
| `Module` | Auth/Rights | Four SMS modules |
| `rights` | Auth/Rights | 13 individual rights |
| `user_module` | Auth/Rights | Maps users to modules |
| `UserModule_Rights` | Auth/Rights | Maps users to individual rights with 0/1 values |

---

## Relationships

| From | To | Relationship | Notes |
|------|----|-------------|-------|
| customer | sales | One-to-many | Each transaction belongs to one customer |
| employee | sales | One-to-many | Each transaction processed by one employee |
| sales | salesDetail | One-to-many | Each transaction has one or more line items |
| product | salesDetail | One-to-many | Each line item references one product |
| product | priceHist | One-to-many | Price history per product |
| Module | rights | One-to-many | Each right belongs to one module |
| user | user_module | One-to-many | User-to-module mapping |
| Module | user_module | One-to-many | Module-to-user mapping |
| user | UserModule_Rights | One-to-many | User-to-right mapping |
| rights | UserModule_Rights | One-to-many | Right-to-user mapping |

---

## Critical Design Notes

### Soft-Delete Fields (sales and salesDetail ONLY)
```
record_status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE'
  CONSTRAINT CHECK (record_status IN ('ACTIVE', 'INACTIVE'))

stamp VARCHAR(60)  -- audit string, hidden from USER accounts
```
**The four lookup tables (customer, employee, product, priceHist) do NOT have these columns.**

### Cascade Soft-Delete Rule
When `sales.record_status` is set to `INACTIVE`:
→ All `salesDetail` rows for that `transNo` are also set to `INACTIVE` via trigger.

When `sales.record_status` is recovered to `ACTIVE`:
→ All `salesDetail` rows for that `transNo` are restored to `ACTIVE` via trigger.

### Composite Primary Keys
- `salesDetail` → PK is (transNo, prodCode) — one product per transaction line
- `priceHist` → PK is (effDate, prodCode) — price per date per product
- `user_module` → PK is (userId, moduleCode)
- `UserModule_Rights` → PK is (userId, rightCode)

### Current Price Lookup
The current unit price for a product is always:
```sql
SELECT unitPrice FROM priceHist
WHERE prodCode = :prodCode
  AND effDate = (SELECT MAX(effDate) FROM priceHist WHERE prodCode = :prodCode)
```

---

*Prepared by M3 Bachiler, Ranezet Vhon | New Era University | AY 2025–2026*
