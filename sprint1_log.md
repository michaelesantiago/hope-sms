# Sprint 1 Log
**Sprint:** 1 | **Weeks:** 1-2 | **Theme:** Setup, Database & Authentication

## Week 1 Status

| Member | Task | Branch | Status |
|--------|------|--------|--------|
| M1 | Scaffold Vite + React + Tailwind | feat/project-scaffold | Done |
| M1 | Supabase JS client + .env.example | feat/supabase-client | Done |
| M2 | Login page | feat/ui-login-page | Done |
| M2 | Register page | feat/ui-register-page | Done |
| M3 | All 6 tables + record_status/stamp on sales & salesDetail | db/initial-schema | Done |
| M3 | 4 modules + 13 rights + SUPERADMIN seed | db/rights-seed | Done |
| M3 | Verification queries | db/verify-seed | Done |
| M4 | AuthContext + login guard | feat/auth-context | Done |
| M4 | Email signUp/signIn wired | feat/auth-email | Done |
| M4 | provision_new_user() trigger | db/trigger-provision-user | Done |
| M5 | 10 auth flow test cases | test/sprint1-auth-flows | Done |

## Week 2 Carry-overs
- M1: feat/routing-skeleton — all placeholder routes + ProtectedRoute
- M1: chore/github-protection — branch protection rules
- M2: feat/ui-app-shell — Navbar + Sidebar
- M2: feat/ui-auth-callback — /auth/callback page
- M3: docs/db-erd — ERD diagram
- M4: feat/auth-google — Google OAuth + /auth/callback wiring

## Sprint 1 Gate Checklist
- [ ] All 6 tables seeded (verified via 004_verify_seed.sql)
- [ ] Login guard blocks INACTIVE (email)
- [ ] Login guard blocks INACTIVE (Google OAuth)
- [ ] Login guard allows ACTIVE accounts
- [ ] provision_new_user() creates USER/INACTIVE with correct rights
- [ ] README setup instructions complete

## Blockers
| Blocker | Resolution |
|---------|------------|
| Trigger needs SECURITY DEFINER to write to public tables | Added SECURITY DEFINER + SET search_path = public |
| SUPERADMIN userId must match real Supabase auth.uid() | Placeholder 'user1' in migration 002 — update after invite |
