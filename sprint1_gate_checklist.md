# Sprint 1 Gate Checklist
**Sprint:** 1 | **Weeks:** 1–2 | **Status:** ✅ PASSED

> This checklist must be 100% complete before Sprint 2 begins.
> Verified by: M5 Loterte, Justine R.

---

## Database

| # | Criteria | Status | Verified By |
|---|----------|--------|-------------|
| 1 | Supabase project created and accessible | ✅ Passed | M3 |
| 2 | employee table seeded — 31 rows | ✅ Passed | M3 |
| 3 | customer table seeded — 82 rows | ✅ Passed | M3 |
| 4 | product table seeded — 52 rows | ✅ Passed | M3 |
| 5 | sales table seeded — 124 rows | ✅ Passed | M3 |
| 6 | salesDetail table seeded — ~310 rows | ✅ Passed | M3 |
| 7 | priceHist table seeded — ~70 rows | ✅ Passed | M3 |
| 8 | record_status (DEFAULT 'ACTIVE') added to sales only | ✅ Passed | M3 |
| 9 | stamp column added to sales only | ✅ Passed | M3 |
| 10 | record_status (DEFAULT 'ACTIVE') added to salesDetail only | ✅ Passed | M3 |
| 11 | stamp column added to salesDetail only | ✅ Passed | M3 |
| 12 | customer, employee, product, priceHist — NO record_status or stamp | ✅ Passed | M3 |
| 13 | 4 modules seeded: Sales_Mod, SD_Mod, Lookup_Mod, Adm_Mod | ✅ Passed | M3 |
| 14 | 13 rights seeded with correct module assignments | ✅ Passed | M3 |
| 15 | SUPERADMIN jcesperanza@neu.edu.ph seeded with all 13 rights = 1 | ✅ Passed | M3 |
| 16 | All migration files committed to /db/migrations in order | ✅ Passed | M3 |
| 17 | 004_verify_seed.sql run — all counts correct, zero FK violations | ✅ Passed | M5 |

---

## Authentication

| # | Criteria | Status | Verified By |
|---|----------|--------|-------------|
| 18 | Email registration form works — sends confirmation email | ✅ Passed | M4 |
| 19 | Email login works for ACTIVE accounts | ✅ Passed | M4 |
| 20 | Google OAuth configured in Google Cloud Console | ✅ Passed | M4 |
| 21 | Google OAuth configured in Supabase Auth providers | ✅ Passed | M4 |
| 22 | Google sign-in works and redirects to /auth/callback | ✅ Passed | M4 |
| 23 | /auth/callback page handles OAuth redirect correctly | ✅ Passed | M2 |
| 24 | provision_new_user() trigger fires on new registration | ✅ Passed | M4 |
| 25 | New accounts provisioned as USER / INACTIVE | ✅ Passed | M4 |
| 26 | New accounts get SALES_VIEW=1, SD_VIEW=1, all LOOKUP=1 | ✅ Passed | M4 |
| 27 | New accounts get all ADD/EDIT/DEL/ADM=0 | ✅ Passed | M4 |
| 28 | Login guard blocks INACTIVE accounts — shows correct message | ✅ Passed | M4 |
| 29 | Login guard allows ACTIVE accounts through to /sales | ✅ Passed | M4 |

---

## Frontend

| # | Criteria | Status | Verified By |
|---|----------|--------|-------------|
| 30 | Login page renders correctly on desktop and mobile | ✅ Passed | M2 |
| 31 | Register page renders correctly on desktop and mobile | ✅ Passed | M2 |
| 32 | Register success screen shows USER/INACTIVE message | ✅ Passed | M2 |
| 33 | AppShell renders with sidebar and all navigation links | ✅ Passed | M2 |
| 34 | /sales route loads after successful login | ✅ Passed | M1 |
| 35 | All 9 SMS routes are accessible when authenticated | ✅ Passed | M1 |
| 36 | Unauthenticated access to /sales redirects to /login | ✅ Passed | M1 |

---

## Testing

| # | Criteria | Status | Verified By |
|---|----------|--------|-------------|
| 37 | Vitest + RTL installed and configured | ✅ Passed | M5 |
| 38 | Supabase mock in place — no real network calls in tests | ✅ Passed | M5 |
| 39 | TC-01: Registration success — shows confirmation screen | ✅ Passed | M5 |
| 40 | TC-02: Empty form — shows all validation errors | ✅ Passed | M5 |
| 41 | TC-03: Password mismatch — shows error | ✅ Passed | M5 |
| 42 | TC-04: Wrong credentials — shows friendly error | ✅ Passed | M5 |
| 43 | TC-05: Empty login — shows validation errors | ✅ Passed | M5 |
| 44 | TC-06: Google OAuth button — calls signInWithOAuth | ✅ Passed | M5 |
| 45 | TC-07: Login guard — signs out INACTIVE account | ✅ Passed | M5 |
| 46 | TC-08: Login guard — allows ACTIVE account | ✅ Passed | M5 |
| 47 | TC-09: Provision defaults — correct rights structure | ✅ Passed | M5 |
| 48 | TC-10: Duplicate email — shows friendly error | ✅ Passed | M5 |

---

## Documentation & Version Control

| # | Criteria | Status | Verified By |
|---|----------|--------|-------------|
| 49 | README.md complete with setup instructions | ✅ Passed | M5 |
| 50 | .env.example committed — no real keys | ✅ Passed | M1 |
| 51 | .gitignore excludes .env.local and node_modules | ✅ Passed | M1 |
| 52 | GitHub repository created and accessible | ✅ Passed | M1 |
| 53 | main and dev branches exist on GitHub | ✅ Passed | M1 |
| 54 | PR template added to .github/ folder | ✅ Passed | M1 |
| 55 | ERD diagram committed to /docs folder | ✅ Passed | M3 |
| 56 | Sprint 1 log completed and committed | ✅ Passed | M5 |

---

## Sprint 1 Gate Result

| Total Criteria | Passed | Failed | Result |
|---------------|--------|--------|--------|
| 56 | 56 | 0 | ✅ SPRINT 1 GATE PASSED |

**Sprint 2 may begin.** ✅

---
*Verified by M5 Loterte, Justine R. | New Era University | AY 2025–2026*
