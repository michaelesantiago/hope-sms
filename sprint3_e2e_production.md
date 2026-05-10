# Sprint 3 — End-to-End Production Test Report
**PR:** test/sprint3-e2e-production  
**Assignee:** Loterte, Justine R.  
**Sprint:** Sprint 3  
**Environment:** Production

---

## Test Summary

| Section | Tests | Pass | Fail |
|---|:-:|:-:|:-:|
| Authentication | 8 | 8 | 0 |
| Sales CRUD | 12 | 12 | 0 |
| SalesDetail CRUD | 10 | 10 | 0 |
| Lookup Pages | 12 | 12 | 0 |
| Reports | 8 | 8 | 0 |
| Admin Module | 7 | 7 | 0 |
| Cascade | 6 | 6 | 0 |
| SUPERADMIN Protection | 5 | 5 | 0 |
| **TOTAL** | **68** | **68** | **0** |

---

## Section 1 — Authentication

| # | Test Case | User Type | Expected | Result |
|---|---|---|---|:-:|
| 1.1 | Email registration | New user | Account created, INACTIVE status | ✅ |
| 1.2 | Email login — INACTIVE user | USER | Blocked with error message | ✅ |
| 1.3 | ADMIN activates new user | ADMIN | Status set to ACTIVE | ✅ |
| 1.4 | Email login — ACTIVE user | USER | Redirected to `/sales` | ✅ |
| 1.5 | Google OAuth registration | New user | Account created, INACTIVE status | ✅ |
| 1.6 | Google OAuth login — ACTIVE user | USER | Redirected to `/sales` | ✅ |
| 1.7 | Direct URL access while unauthenticated | — | Redirected to `/login` | ✅ |
| 1.8 | Logout | All | Session cleared, redirected to `/login` | ✅ |

---

## Section 2 — Sales CRUD (all 3 user types)

| # | Test Case | USER | ADMIN | SUPERADMIN |
|---|---|:-:|:-:|:-:|
| 2.1 | Sales list page loads with correct columns | ✅ | ✅ | ✅ |
| 2.2 | Stamp column hidden for USER, visible for ADMIN/SA | ✅ | ✅ | ✅ |
| 2.3 | INACTIVE rows hidden for USER | ✅ | — | — |
| 2.4 | INACTIVE rows visible for ADMIN/SA | — | ✅ | ✅ |
| 2.5 | Create Transaction button hidden for USER | ✅ | — | — |
| 2.6 | Create Transaction — modal opens, dropdowns populated | — | ✅ | ✅ |
| 2.7 | Create Transaction — saves correctly, appears in list | — | ✅ | ✅ |
| 2.8 | Edit button hidden for USER | ✅ | — | — |
| 2.9 | Edit Transaction — pre-fills form, saves changes | — | ✅ | ✅ |
| 2.10 | Delete button hidden for USER and ADMIN | ✅ | ✅ | — |
| 2.11 | Soft-delete Transaction — moves to Deleted Items | — | — | ✅ |
| 2.12 | Recover Transaction — returns to active list | — | ✅ | ✅ |

---

## Section 3 — SalesDetail CRUD

| # | Test Case | USER | ADMIN | SUPERADMIN |
|---|---|:-:|:-:|:-:|
| 3.1 | Transaction header shows correct customer and employee | ✅ | ✅ | ✅ |
| 3.2 | Line items table loads with description, qty, price, total | ✅ | ✅ | ✅ |
| 3.3 | Add Line Item button hidden for USER | ✅ | — | — |
| 3.4 | Add Line Item — product dropdown populated | — | ✅ | ✅ |
| 3.5 | Add Line Item — unit price auto-fills on product select | — | ✅ | ✅ |
| 3.6 | Add Line Item — line total preview updates with quantity | — | ✅ | ✅ |
| 3.7 | Edit line item — quantity updates, total recalculates | — | ✅ | ✅ |
| 3.8 | Delete line item button hidden for USER and ADMIN | ✅ | ✅ | — |
| 3.9 | Soft-delete line item — item disappears from USER view | — | — | ✅ |
| 3.10 | Recover line item — item reappears for USER | — | ✅ | ✅ |

---

## Section 4 — Lookup Pages (all 3 user types)

| # | Test Case | USER | ADMIN | SUPERADMIN |
|---|---|:-:|:-:|:-:|
| 4.1 | Customer Lookup — loads with custno, name, address, payterm | ✅ | ✅ | ✅ |
| 4.2 | Customer Lookup — zero add/edit/delete buttons | ✅ | ✅ | ✅ |
| 4.3 | Employee Lookup — loads with empno, name, gender, hiredate | ✅ | ✅ | ✅ |
| 4.4 | Employee Lookup — zero add/edit/delete buttons | ✅ | ✅ | ✅ |
| 4.5 | Product Lookup — loads with prodCode, description, unit | ✅ | ✅ | ✅ |
| 4.6 | Product Lookup — zero add/edit/delete buttons | ✅ | ✅ | ✅ |
| 4.7 | Price History — loads with prodCode, effDate, unitPrice | ✅ | ✅ | ✅ |
| 4.8 | Price History — zero add/edit/delete buttons | ✅ | ✅ | ✅ |
| 4.9 | Network tab — no POST/PATCH/DELETE from any lookup page | ✅ | ✅ | ✅ |
| 4.10 | Direct Supabase INSERT into customer — RLS blocks | ✅ | ✅ | ✅ |
| 4.11 | Direct Supabase UPDATE on employee — RLS blocks | ✅ | ✅ | ✅ |
| 4.12 | Search filter works on all 4 pages | ✅ | ✅ | ✅ |

---

## Section 5 — Reports (all 3 user types)

| # | Test Case | Result |
|---|---|:-:|
| 5.1 | Sales by Employee — loads with correct data and chart | ✅ |
| 5.2 | Sales by Employee — sortable by transactions and revenue | ✅ |
| 5.3 | Sales by Customer — loads, top 10 chart visible | ✅ |
| 5.4 | Sales by Customer — sortable columns | ✅ |
| 5.5 | Top Products — horizontal bar chart renders correctly | ✅ |
| 5.6 | Monthly Sales Trend — chronological order, chart renders | ✅ |
| 5.7 | Monthly Sales Trend — date range filter works | ✅ |
| 5.8 | All 4 reports accessible to USER, ADMIN, SUPERADMIN | ✅ |

---

## Section 6 — Admin Module

| # | Test Case | Result |
|---|---|:-:|
| 6.1 | Admin sidebar link hidden for USER | ✅ |
| 6.2 | `/admin` route redirects USER to `/sales` | ✅ |
| 6.3 | UserManagementPage loads all users for ADMIN | ✅ |
| 6.4 | SUPERADMIN rows greyed out with "Protected" label | ✅ |
| 6.5 | Activate button enables INACTIVE user login | ✅ |
| 6.6 | Deactivate button blocks ACTIVE user login | ✅ |
| 6.7 | Cannot deactivate own account | ✅ |

---

## Section 7 — SUPERADMIN Protection

| # | Test Case | Result |
|---|---|:-:|
| 7.1 | Activate/Deactivate buttons disabled on SUPERADMIN rows | ✅ |
| 7.2 | Tooltip shown on hover of disabled SUPERADMIN row | ✅ |
| 7.3 | ADMIN direct API UPDATE on SUPERADMIN row — RLS rejects | ✅ |
| 7.4 | ADMIN cannot update SUPERADMIN's UserModule_Rights | ✅ |
| 7.5 | Hard delete grep: 0 results across entire codebase | ✅ |

---

## Sprint 3 Gate — FINAL CONFIRMATION

- [x] Live URL accessible and all 3 user types log in via email and Google
- [x] All lookup dropdowns populated correctly in AddSaleModal and AddLineItemModal
- [x] Cascade soft-delete and recovery verified in production (6 test cases)
- [x] All 4 lookup pages confirmed mutation-free for all 3 user types
- [x] All 4 reports functional with correct data and charts
- [x] SUPERADMIN protection confirmed at UI and DB level
- [x] No hard DELETE statements in any file
- [x] All docs submitted

**PROJECT COMPLETE ✅**

Tested by: Loterte, Justine R.  
Date: Sprint 3, Week 6
