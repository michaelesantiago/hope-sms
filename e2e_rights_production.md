# Production Rights Regression Test Log
**PR:** test/e2e-rights-production  
**Branch:** test/e2e-rights-production  
**Assignee:** Manilag, Sebastian Andrew N.  
**Sprint:** Sprint 3  
**Environment:** Production — `https://hope-sms.vercel.app`

---

## Test Accounts Used

| Role | Email | Status |
|---|---|---|
| USER | test.agent@neu.edu.ph | ACTIVE |
| ADMIN | test.manager@neu.edu.ph | ACTIVE |
| SUPERADMIN | jcesperanza@neu.edu.ph | ACTIVE |

---

## Section 1 — All 13 Rights × 3 User Types (39 cases)

| Right | USER | ADMIN | SUPERADMIN |
|---|:-:|:-:|:-:|
| SALES_VIEW | 1 ✅ | 1 ✅ | 1 ✅ |
| SALES_ADD | 0 ✅ | 1 ✅ | 1 ✅ |
| SALES_EDIT | 0 ✅ | 1 ✅ | 1 ✅ |
| SALES_DEL | 0 ✅ | 0 ✅ | 1 ✅ |
| SD_VIEW | 1 ✅ | 1 ✅ | 1 ✅ |
| SD_ADD | 0 ✅ | 1 ✅ | 1 ✅ |
| SD_EDIT | 0 ✅ | 1 ✅ | 1 ✅ |
| SD_DEL | 0 ✅ | 0 ✅ | 1 ✅ |
| CUST_LOOKUP | 1 ✅ | 1 ✅ | 1 ✅ |
| EMP_LOOKUP | 1 ✅ | 1 ✅ | 1 ✅ |
| PROD_LOOKUP | 1 ✅ | 1 ✅ | 1 ✅ |
| PRICE_LOOKUP | 1 ✅ | 1 ✅ | 1 ✅ |
| ADM_USER | 0 ✅ | 1 ✅ | 1 ✅ |

**Result: 39 / 39 PASS**

---

## Section 2 — Button States per Page

### SalesListPage

| Element | USER | ADMIN | SUPERADMIN |
|---|:-:|:-:|:-:|
| Create Transaction button | Hidden ✅ | Visible ✅ | Visible ✅ |
| Edit button per row | Hidden ✅ | Visible ✅ | Visible ✅ |
| Delete button per row | Hidden ✅ | Hidden ✅ | Visible ✅ |
| Stamp column | Hidden ✅ | Visible ✅ | Visible ✅ |
| INACTIVE rows visible | No ✅ | Yes ✅ | Yes ✅ |

### SalesDetailPage

| Element | USER | ADMIN | SUPERADMIN |
|---|:-:|:-:|:-:|
| Add Line Item button | Hidden ✅ | Visible ✅ | Visible ✅ |
| Edit button per line | Hidden ✅ | Visible ✅ | Visible ✅ |
| Delete button per line | Hidden ✅ | Hidden ✅ | Visible ✅ |
| Stamp column | Hidden ✅ | Visible ✅ | Visible ✅ |

### Lookup Pages (all 4)

| Element | USER | ADMIN | SUPERADMIN |
|---|:-:|:-:|:-:|
| Add / Edit / Delete buttons | None ✅ | None ✅ | None ✅ |

---

## Section 3 — Route Access

| Route | USER | ADMIN | SUPERADMIN |
|---|:-:|:-:|:-:|
| `/sales` | ✅ | ✅ | ✅ |
| `/sales/:transNo` | ✅ | ✅ | ✅ |
| `/lookups/*` | ✅ | ✅ | ✅ |
| `/reports/*` | ✅ | ✅ | ✅ |
| `/deleted-items` | Redirects to `/sales` ✅ | ✅ | ✅ |
| `/admin` | Redirects to `/sales` ✅ | ✅ | ✅ |

---

## Section 4 — SUPERADMIN Protection

| # | Test | Result |
|---|---|:-:|
| 4.1 | SUPERADMIN rows appear greyed out in UserManagementPage | ✅ |
| 4.2 | Activate button disabled on SUPERADMIN rows | ✅ |
| 4.3 | Deactivate button disabled on SUPERADMIN rows | ✅ |
| 4.4 | Tooltip "SUPERADMIN accounts cannot be modified" on hover | ✅ |
| 4.5 | ADMIN direct Supabase UPDATE on SUPERADMIN row — RLS rejects | ✅ |

---

## Section 5 — Cascade Trigger in Production

| # | Test | Result |
|---|---|:-:|
| 5.1 | Soft-delete TR000001 as SUPERADMIN | ✅ |
| 5.2 | All TR000001 salesDetail rows cascade to INACTIVE | ✅ |
| 5.3 | USER sees 0 rows for TR000001 after soft-delete | ✅ |
| 5.4 | Recover TR000001 as ADMIN | ✅ |
| 5.5 | All TR000001 salesDetail rows cascade back to ACTIVE | ✅ |
| 5.6 | USER sees TR000001 and all line items after recovery | ✅ |

---

## Section 6 — Google OAuth in Production

| # | Test | Result |
|---|---|:-:|
| 6.1 | Google sign-in button triggers OAuth flow | ✅ |
| 6.2 | `/auth/callback` processes redirect correctly | ✅ |
| 6.3 | New Google user provisioned as USER/INACTIVE | ✅ |
| 6.4 | INACTIVE user sees activation error message | ✅ |
| 6.5 | ADMIN activates Google user — user can log in | ✅ |

---

## Overall Result

**ALL TESTS PASS — 39/39 rights cases + all button states + all routes + SUPERADMIN guard + cascade + Google OAuth**

Tested by: Manilag, Sebastian Andrew N.  
Date: Sprint 3, Week 6  
Production URL: `https://hope-sms.vercel.app`
