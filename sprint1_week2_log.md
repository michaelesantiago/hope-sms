# Sprint 1 Log — Week 2
**Sprint:** 1 | **Week:** 2 | **Theme:** Carry-overs, ERD, Branch Protection, Sprint Gate

---

## Week 2 Tasks

### M1 — Santiago (Project Lead)
| Task | Branch | Status |
|------|--------|--------|
| Branch protection rules documented in README | chore/github-protection | ✅ Done |
| PR template added to .github/ folder | chore/github-protection | ✅ Done |
| All placeholder routes verified and working | feat/routing-skeleton | ✅ Done |

### M2 — Velasco (Frontend Developer)
| Task | Branch | Status |
|------|--------|--------|
| AppShell sidebar polish and mobile responsive fixes | feat/ui-app-shell | ✅ Done |
| /auth/callback page verified working with Google OAuth | feat/ui-auth-callback | ✅ Done |

### M3 — Bachiler (DB Engineer)
| Task | Branch | Status |
|------|--------|--------|
| ERD diagram created and committed to /docs | docs/db-erd | ✅ Done |
| HopeDB full seed data verified via 004_verify_seed.sql | db/verify-seed | ✅ Done |

### M4 — Manilag (Rights & Auth)
| Task | Branch | Status |
|------|--------|--------|
| Google OAuth localhost redirect URL configured | feat/auth-google | ✅ Done |
| Google OAuth production redirect URL prepared | feat/auth-google | ✅ Done |
| Login guard column casing fix (userid lowercase) | feat/auth-context | ✅ Done |
| useRef guard added to prevent concurrent login guard runs | feat/auth-context | ✅ Done |

### M5 — Loterte (QA / Docs)
| Task | Branch | Status |
|------|--------|--------|
| Sprint 1 gate checklist completed — 56/56 criteria passed | docs/sprint1-log-readme | ✅ Done |
| Sprint 1 Week 2 log completed | docs/sprint1-log-readme | ✅ Done |
| All 10 auth test cases confirmed passing | test/sprint1-auth-flows | ✅ Done |

---

## Week 2 PRs Merged to dev

| PR | Branch | Author | Reviewer | Status |
|----|--------|--------|----------|--------|
| PR-M1-04 | chore/github-protection | M1 | M5 | ✅ Merged |
| PR-M2-03 | feat/ui-app-shell | M2 | M1 | ✅ Merged |
| PR-M2-04 | feat/ui-auth-callback | M2 | M4 | ✅ Merged |
| PR-M3-03 | docs/db-erd | M3 | M5 | ✅ Merged |
| PR-M4-03 | feat/auth-google | M4 | M1 | ✅ Merged |
| PR-M5-02 | docs/sprint1-log-readme | M5 | M2 | ✅ Merged |

---

## Blockers & Resolutions (Week 2)

| Blocker | Resolution |
|---------|------------|
| AuthContext used userId (capital I) but PostgreSQL stores userid (lowercase) | Changed all .select() and .eq() calls to use lowercase userid |
| Auth state change listener causing continuous loading loop on /sales | Restricted onAuthStateChange to fire runLoginGuard on SIGNED_IN event only; added useRef guardRunning flag |
| Google OAuth Error 400 redirect_uri_mismatch | Added exact Supabase callback URI to both Google Cloud Console Authorized Redirect URIs and Supabase Authentication Redirect URLs |
| SUPERADMIN account not auto-provisioned correctly | Manually inserted user row with correct auth.uid() and updated to SUPERADMIN/ACTIVE via SQL |

---

## Sprint 1 Final Gate Status
✅ All 56 criteria passed — See docs/sprint1_gate_checklist.md

**Sprint 2 begins next week.**
