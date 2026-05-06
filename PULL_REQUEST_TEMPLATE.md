## Pull Request Description

### What changed?
<!-- Briefly describe what this PR does -->

### Why is it needed?
<!-- Explain the reason for this change -->

### Type of change
- [ ] `feat/` — New feature
- [ ] `fix/` — Bug fix
- [ ] `db/` — Database change (schema, RLS, trigger, view)
- [ ] `test/` — Test files
- [ ] `docs/` — Documentation
- [ ] `chore/` — Config / tooling / deployment
- [ ] `refactor/` — Code cleanup, no behavior change

### How to test
<!-- Step-by-step instructions for the reviewer to verify this PR -->
1. 
2. 
3. 

### Checklist
- [ ] Branch forked from `dev` — never from `main`
- [ ] Branch name follows convention (`feat/`, `fix/`, `db/`, `test/`, `docs/`, `chore/`)
- [ ] PR title is imperative and specific (e.g. "Add cascade soft-delete trigger for sales")
- [ ] All Vitest tests pass locally before requesting review
- [ ] No `console.log` statements in production code
- [ ] No `.env` files or Supabase keys committed
- [ ] At least one teammate has reviewed and approved
- [ ] Merge target is `dev` — never `main`
- [ ] Feature branch will be deleted after merge

### SMS-Specific Rules (check if applicable)
- [ ] No `DELETE` SQL keyword used anywhere in this PR
- [ ] Soft-delete uses `record_status = 'INACTIVE'` only
- [ ] Lookup tables (customer, employee, product, priceHist) — SELECT only, no mutations
- [ ] INACTIVE records hidden from USER accounts
- [ ] Stamp column hidden from USER accounts

### Related Branch
`feature/branch-name-here`

### Screenshots (if UI change)
<!-- Add screenshots here if this PR changes any UI -->
