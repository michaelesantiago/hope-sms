# Hope, Inc. — Sales Management System

> Capstone Project | BS Information Technology | New Era University | AY 2025-2026

## Team
| # | Member | Role |
|---|--------|------|
| M1 | Santiago, Michael E. | Project Lead / Full-Stack |
| M2 | Velasco, Crisglynver G. | Frontend Developer |
| M3 | Bachiler, Ranezet Vhon | DB Engineer |
| M4 | Manilag, Sebastian Andrew N. | Rights & Auth |
| M5 | Loterte, Justine R. | QA / Docs |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create env file
cp .env.example .env.local
# Edit .env.local and add your Supabase URL and anon key

# 3. Run dev server
npm run dev
# Open http://localhost:5173
```

## Database Setup
Run migrations in order in Supabase SQL Editor:
1. `db/migrations/001_initial_schema.sql`
2. `db/migrations/002_rights_seed.sql`
3. `db/migrations/003_trigger_provision_user.sql`
4. Then seed HopeDB data (employee, customer, product, sales, salesDetail, priceHist, payment)
5. `db/migrations/004_verify_seed.sql` — run to confirm row counts

## Branching Strategy
- `main` — production only, PR required, all 5 reviewers
- `dev` — integration branch, PR required
- `feature/*`, `fix/*`, `db/*`, `test/*`, `docs/*` — branch from dev

## Key Rules
- No hard deletes — use record_status = 'INACTIVE'
- Cascade: soft-deleting sales sets all salesDetail rows INACTIVE
- USER accounts never see INACTIVE records
- customer, employee, product, priceHist — SELECT only, no mutations
- ADMIN cannot modify SUPERADMIN accounts
