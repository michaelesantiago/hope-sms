<div align="center">

<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
<img src="https://img.shields.io/badge/Vitest-Testing-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" />

<br/><br/>

# 🏢 Hope, Inc.
## Sales Management System

**A full-stack web application for managing sales transactions with role-based access control, soft-delete, and Google OAuth authentication.**

<br/>

[![Sprint](https://img.shields.io/badge/Sprint-1%20Complete-2ea44f?style=flat-square)](https://github.com/michaelesantiago/hope-sms)
[![Gate](https://img.shields.io/badge/Gate-56%2F56%20Passed-2ea44f?style=flat-square)](./docs/sprint1_gate_checklist.md)
[![License](https://img.shields.io/badge/License-Academic-blue?style=flat-square)]()

<br/>

> 📚 **BS Information Technology** · New Era University – College of Computer Studies
> Information Management Course · Academic Year 2025–2026
> Prepared by: **Jeremias C. Esperanza**

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Team Members](#-team-members)
- [Technology Stack](#-technology-stack)
- [System Features](#-system-features)
- [Database Design](#-database-design)
- [User Roles & Access Rights](#-user-roles--access-rights)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Branching Strategy](#-branching-strategy)
- [Sprint Progress](#-sprint-progress)
- [Key System Rules](#-key-system-rules)

---

## 🏢 About the Project

The **Hope, Inc. Sales Management System (HMS)** is a capstone web application developed for the Information Management course. It provides a structured platform for managing the sales operations of Hope, Inc., enforcing a strict role-based access control (RBAC) system across all features.

### What the system does:
- Manages **sales transactions** and their **line items** from the HopeDB database
- Enforces **three user types** — SUPERADMIN, ADMIN (Sales Manager), and USER (Sales Agent)
- Implements **soft-delete** — no record is ever permanently removed from the database
- Uses **four reference tables** (customer, employee, product, priceHist) as read-only lookups
- Supports **Google OAuth** and email/password authentication with automatic account provisioning

---

## 👥 Team Members

| # | Name | Role | Responsibilities |
|---|------|------|-----------------|
| **M1** | Santiago, Michael E. | Project Lead / Full-Stack Developer | Sprint coordination, GitHub management, Supabase setup, API wiring, routing, deployment |
| **M2** | Velasco, Crisglynver G. | Frontend Developer (UI/UX) | All React pages, modals, lookup pages, reports pages, responsive design |
| **M3** | Bachiler, Ranezet Vhon | Backend / Database Engineer | Schema, migrations, RLS policies, triggers, SQL views |
| **M4** | Manilag, Sebastian Andrew N. | Rights & Auth Specialist | AuthContext, rights gating, Google OAuth, login guard, account activation |
| **M5** | Loterte, Justine R. | QA / Documentation | Test cases, rights matrix, user manual, sprint logs, presentation |

---

## 🛠 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite 5 | Single-page application, component-based UI |
| **Styling** | Tailwind CSS 3 | Utility-first responsive design system |
| **Backend / DB** | Supabase (PostgreSQL) | Database, Auth, RLS Policies, Triggers, Functions |
| **Authentication** | Supabase Auth | Email/password + Google OAuth 2.0 sign-in |
| **State Management** | React Context API | Global auth session and user rights map |
| **Version Control** | Git + GitHub | Source control, branching, pull requests |
| **Testing** | Vitest + React Testing Library | Unit and integration test suite |
| **Deployment** | Vercel / Netlify | Free-tier production hosting *(Sprint 3)* |

---

## ✨ System Features

### 🔐 Authentication
- Email/password registration with email confirmation
- Google OAuth 2.0 sign-in and registration
- Automatic account provisioning as `USER / INACTIVE` on registration
- Login guard — blocks inactive accounts on every sign-in attempt
- Admin activation workflow before users can access the system

### 📊 Sales Management *(Sprint 2)*
- Full CRUD on sales transactions (transNo, salesDate, customer, employee)
- Full CRUD on sales detail line items (product, quantity, unit price)
- Customer and employee dropdown lookups on sales forms
- Product dropdown with automatic price lookup from price history
- Soft-delete with cascade — deleting a sale hides all its line items

### 👁 Role-Based Visibility
- `USER` accounts see only `ACTIVE` records across all views
- `ADMIN` and `SUPERADMIN` see all records including deleted items
- Deleted Items panel (tabbed: Transactions / Line Items) for ADMIN+
- Recovery of soft-deleted records by ADMIN and SUPERADMIN

### 📈 Reports *(Sprint 3)*
- Sales summary by employee
- Sales summary by customer
- Top products sold
- Monthly sales trend

### 🛡 Admin Module *(Sprint 3)*
- User activation and deactivation
- SUPERADMIN accounts are fully protected — cannot be modified by anyone

---

## 🗄 Database Design

The system uses **6 HopeDB tables** plus **5 rights/auth tables** (11 total).

### HopeDB Tables

| Table | Role | CRUD / Lookup | Seed Records |
|-------|------|--------------|--------------|
| `sales` | Primary — sales transactions | Full CRUD (soft-delete) | 124 transactions |
| `salesDetail` | Primary — line items | Full CRUD (soft-delete) | ~310 line items |
| `customer` | Lookup only — customer dropdown | SELECT only | 82 customers |
| `employee` | Lookup only — employee dropdown | SELECT only | 31 employees |
| `product` | Lookup only — product dropdown | SELECT only | 52 products |
| `priceHist` | Lookup only — unit price auto-fill | SELECT only | ~70 price entries |

### Critical Design Decisions

```
✅  record_status and stamp columns added to sales and salesDetail ONLY
✅  customer, employee, product, priceHist — ZERO structural changes
✅  Cascade soft-delete trigger: sales INACTIVE → all salesDetail INACTIVE
✅  Cascade recovery: sales ACTIVE → all salesDetail ACTIVE
✅  No DELETE keyword anywhere in application code or database functions
```

---

## 👤 User Roles & Access Rights

### Rights Matrix

| Right | SUPERADMIN | ADMIN | USER |
|-------|:----------:|:-----:|:----:|
| View Transactions | ✅ | ✅ | ✅ |
| Create Transaction | ✅ | ✅ | ❌ |
| Edit Transaction | ✅ | ✅ | ❌ |
| **Soft Delete Transaction** | ✅ | ❌ | ❌ |
| View Sales Detail | ✅ | ✅ | ✅ |
| Add Line Item | ✅ | ✅ | ❌ |
| Edit Line Item | ✅ | ✅ | ❌ |
| **Soft Delete Line Item** | ✅ | ❌ | ❌ |
| Lookup Customers | ✅ | ✅ | ✅ |
| Lookup Employees | ✅ | ✅ | ✅ |
| Lookup Products | ✅ | ✅ | ✅ |
| Lookup Price History | ✅ | ✅ | ✅ |
| **Admin / User Management** | ✅ | ❌ | ❌ |

### Soft-Delete Visibility

| Record Status | USER | ADMIN | SUPERADMIN | Recoverable? |
|--------------|:----:|:-----:|:----------:|:------------:|
| `ACTIVE` | ✅ Visible | ✅ Visible | ✅ Visible | N/A |
| `INACTIVE` | ❌ Hidden | ✅ Deleted Items panel | ✅ Deleted Items panel | ✅ Yes |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher (`node -v` to check)
- A **Supabase** project (free tier at [supabase.com](https://supabase.com))
- A **GitHub** account

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/michaelesantiago/hope-sms.git
cd hope-sms

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env.local
```

### Environment Configuration

Open `.env.local` and fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

> ⚠️ **Never commit `.env.local`** — it is already excluded by `.gitignore`

### Database Setup

Run the SQL migrations **in order** inside the Supabase SQL Editor:

```sql
-- Step 1: Create all 6 HopeDB tables
db/migrations/001_initial_schema.sql

-- Step 2: Seed modules, rights, and SUPERADMIN account
db/migrations/002_rights_seed.sql

-- Step 3: Create the auto-provision trigger for new users
db/migrations/003_trigger_provision_user.sql

-- Step 4: Verify row counts and FK integrity (run after seeding HopeDB data)
db/migrations/004_verify_seed.sql
```

Then seed the full HopeDB dataset (employees, customers, products, sales, salesDetail, priceHist, payments) from the original `HopeDB.sql` file.

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com) → Credentials
2. Create or use an existing **OAuth 2.0 Client ID** (Web application)
3. Add to **Authorized Redirect URIs**:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   http://localhost:5173/auth/callback
   ```
4. In Supabase → Authentication → Providers → **Google** → paste Client ID and Secret

### Run the Application

```bash
# Start development server
npm run dev

# Open in browser
http://localhost:5173
```

### Run Tests

```bash
# Run all test cases
npm test

# Run with coverage report
npm run test:coverage
```

---

## 📁 Project Structure

```
hope-sms/
│
├── 📁 .github/
│   └── PULL_REQUEST_TEMPLATE.md     # PR checklist enforcing SMS rules
│
├── 📁 db/
│   └── 📁 migrations/
│       ├── 001_initial_schema.sql   # All 6 HopeDB tables
│       ├── 002_rights_seed.sql      # Modules, rights, SUPERADMIN
│       ├── 003_trigger_provision_user.sql  # Auto-provision trigger
│       └── 004_verify_seed.sql      # Row count & FK integrity checks
│
├── 📁 docs/
│   ├── db_erd.md                    # ERD — all 11 tables documented
│   ├── sprint1_log.md               # Sprint 1 Week 1 progress log
│   ├── sprint1_week2_log.md         # Sprint 1 Week 2 progress log
│   └── sprint1_gate_checklist.md   # 56-criteria gate — all passed ✅
│
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 auth/
│   │   │   └── ProtectedRoute.jsx   # Blocks unauthenticated access
│   │   └── 📁 layout/
│   │       └── AppShell.jsx         # Sidebar + Navbar layout wrapper
│   │
│   ├── 📁 contexts/
│   │   └── AuthContext.jsx          # Global auth state + login guard
│   │
│   ├── 📁 pages/
│   │   ├── 📁 auth/
│   │   │   ├── LoginPage.jsx        # Email + Google OAuth login
│   │   │   ├── RegisterPage.jsx     # Registration with confirmation
│   │   │   └── AuthCallbackPage.jsx # OAuth redirect handler
│   │   └── PlaceholderPages.jsx     # Sprint 2 & 3 pages (coming soon)
│   │
│   ├── 📁 services/
│   │   ├── supabaseClient.js        # Supabase JS client initialization
│   │   └── authService.js           # All auth functions (email + Google)
│   │
│   └── 📁 test/
│       ├── setup.js                 # Vitest + jest-dom configuration
│       ├── sprint1-auth-flows.test.jsx  # 10 auth test cases
│       └── 📁 __mocks__/
│           └── supabaseClient.js    # Supabase mock (no real API calls)
│
├── .env.example                     # Environment variable template
├── .gitignore                       # Excludes .env.local, node_modules
├── index.html                       # App entry point
├── package.json                     # Dependencies and scripts
├── tailwind.config.js               # Tailwind + custom hope-* colors
├── vite.config.js                   # Vite + Vitest configuration
└── README.md                        # This file
```

---

## 🌿 Branching Strategy

```
main ──────────────────────────────────── Production releases only
  │                                        PR required · All 5 members review
  │
  └─► dev ──────────────────────────────── Integration branch
        │                                   PR required · 1+ reviewer
        │
        ├─► feat/sales-list-page           Feature branches
        ├─► fix/cascade-trigger-recovery   Bug fixes
        ├─► db/rls-sales-policies          Database changes
        ├─► test/rights-39-cases           Test files
        ├─► docs/sprint2-log               Documentation
        └─► chore/vercel-deploy            Config & tooling
```

### Branch Naming Convention

| Prefix | When to Use | Example |
|--------|-------------|---------|
| `feat/` | New feature | `feat/ui-sales-list` |
| `fix/` | Bug fix | `fix/cascade-trigger-recovery` |
| `db/` | DB schema, RLS, trigger, view | `db/rls-sales-select` |
| `test/` | Test files | `test/rights-39-cases` |
| `docs/` | Documentation | `docs/user-manual-draft` |
| `chore/` | Config, tooling, deployment | `chore/vercel-deploy` |

> **Rule:** Never push directly to `main` or `dev`. All changes go through a Pull Request reviewed by at least one teammate.

---

## 📅 Sprint Progress

### Sprint 1 — Weeks 1 & 2 ✅ Complete

| Deliverable | Member | Status |
|-------------|--------|--------|
| Vite + React 18 + Tailwind CSS scaffold | M1 | ✅ Done |
| Supabase JS client + environment config | M1 | ✅ Done |
| React Router v6 + ProtectedRoute + all 9 routes | M1 | ✅ Done |
| GitHub repo + branch protection + PR template | M1 | ✅ Done |
| Login page — email + Google OAuth | M2 | ✅ Done |
| Register page — 6 fields + confirmation screen | M2 | ✅ Done |
| AppShell — sidebar + mobile responsive | M2 | ✅ Done |
| /auth/callback — OAuth redirect handler | M2 | ✅ Done |
| All 6 HopeDB tables + record_status/stamp | M3 | ✅ Done |
| 4 modules + 13 rights + SUPERADMIN seeded | M3 | ✅ Done |
| ERD diagram — docs/db_erd.md | M3 | ✅ Done |
| AuthContext + login guard | M4 | ✅ Done |
| Google OAuth configured | M4 | ✅ Done |
| provision_new_user() trigger | M4 | ✅ Done |
| Vitest + RTL + 10 test cases | M5 | ✅ Done |
| README + sprint logs + gate checklist | M5 | ✅ Done |

**Sprint 1 Gate: 56/56 criteria passed ✅**

---

### Sprint 2 — Weeks 3 & 4 🔄 In Progress

| Focus | Member | Status |
|-------|--------|--------|
| Sales + salesDetail API service functions | M1 | 🔄 In Progress |
| UserRightsContext + route guards | M1 | 🔄 In Progress |
| SalesListPage + CRUD modals | M2 | 🔄 In Progress |
| SalesDetailPage + line items | M2 | 🔄 In Progress |
| 4 read-only lookup pages | M2 | 🔄 In Progress |
| DeletedItemsPage | M2 | 🔄 In Progress |
| RLS policies for sales + salesDetail | M3 | 🔄 In Progress |
| Cascade soft-delete trigger | M3 | 🔄 In Progress |
| SQL views for enriched data | M3 | 🔄 In Progress |
| UserRightsContext + 13-right gating | M4 | 🔄 In Progress |
| 39-case rights test matrix | M5 | 🔄 In Progress |

---

### Sprint 3 — Weeks 5 & 6 ⏳ Upcoming

| Focus | Member |
|-------|--------|
| 4 report pages + admin API | M1 |
| Reports UI + admin user management | M2 |
| 4 report SQL views + admin RLS | M3 |
| Full rights regression + SUPERADMIN guard | M4 |
| E2E production tests + User Manual | M5 |

---

## 🔒 Key System Rules

| # | Rule | Detail |
|---|------|--------|
| 1 | **No hard deletes** | The `DELETE` keyword must never appear in any application code, Supabase function, or RLS policy |
| 2 | **Soft-delete only** | All removals set `record_status = 'INACTIVE'` on the sales or salesDetail row |
| 3 | **Cascade soft-delete** | Soft-deleting a `sales` row sets ALL its `salesDetail` rows to `INACTIVE` in the same operation |
| 4 | **INACTIVE = invisible to USER** | USER accounts never see INACTIVE records in any view, list, or lookup |
| 5 | **Lookup tables are read-only** | `customer`, `employee`, `product`, `priceHist` — SELECT only, zero mutations ever |
| 6 | **SUPERADMIN is protected** | ADMIN cannot modify a SUPERADMIN account at UI or database level |
| 7 | **Auto-provisioning** | New registrations are automatically USER / INACTIVE pending admin activation |
| 8 | **Stamp is hidden from USER** | The `stamp` audit column is never shown to USER accounts in any view |

---

## 🧪 Testing

Sprint 1 test coverage — **10 test cases** in `src/test/sprint1-auth-flows.test.jsx`:

| Test Case | Description | Status |
|-----------|-------------|--------|
| TC-01 | Email registration — shows confirmation screen | ✅ Pass |
| TC-02 | Empty form submission — shows all validation errors | ✅ Pass |
| TC-03 | Password mismatch — shows error | ✅ Pass |
| TC-04 | Wrong credentials — shows friendly error | ✅ Pass |
| TC-05 | Empty login fields — shows validation errors | ✅ Pass |
| TC-06 | Google OAuth button — triggers signInWithOAuth | ✅ Pass |
| TC-07 | Login guard — signs out INACTIVE account | ✅ Pass |
| TC-08 | Login guard — allows ACTIVE account through | ✅ Pass |
| TC-09 | Provision defaults — correct USER/INACTIVE rights | ✅ Pass |
| TC-10 | Duplicate email — shows friendly error | ✅ Pass |

Sprint 2 will add **39 test cases** covering all 3 user types × 13 rights.

---

## 🏫 Academic Information

| Field | Detail |
|-------|--------|
| **Institution** | New Era University — College of Computer Studies |
| **Program** | BS Information Technology |
| **Course** | Information Management |
| **Academic Year** | 2025–2026 |
| **Project Type** | Capstone Project |
| **Instructor** | Jeremias C. Esperanza |
| **Sprint Plan** | 3 Sprints × 2 Weeks = 6 Weeks Total |

---

<div align="center">

**Hope, Inc. Sales Management System**
*New Era University · BS Information Technology · AY 2025–2026*

</div>
