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

[![Sprint 1](https://img.shields.io/badge/Sprint_1-Complete-2ea44f?style=flat-square)](https://github.com/michaelesantiago/hope-sms)
[![Sprint 2](https://img.shields.io/badge/Sprint_2-Complete-2ea44f?style=flat-square)](https://github.com/michaelesantiago/hope-sms)
[![Sprint 3](https://img.shields.io/badge/Sprint_3-Complete-2ea44f?style=flat-square)](https://github.com/michaelesantiago/hope-sms)
[![Live](https://img.shields.io/badge/Live-hopesms--chi.vercel.app-0070f3?style=flat-square&logo=vercel)](https://hopesms-chi.vercel.app)
[![License](https://img.shields.io/badge/License-Academic-blue?style=flat-square)]()

<br/>

> 📚 **BS Information Technology** · New Era University – College of Computer Studies
> Information Management Course · Academic Year 2025–2026
> Instructor: **Jeremias C. Esperanza**

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Live Demo](#-live-demo)
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
- Provides **4 analytics charts** via a dedicated Reports page powered by SQL views
- Includes **User Management** for SUPERADMIN to activate, deactivate, and assign roles

---

## 🌐 Live Demo

| Environment | URL |
|-------------|-----|
| **Production** | [https://hopesms-chi.vercel.app](https://hopesms-chi.vercel.app) |
| **Local Dev** | http://localhost:5173 |

> 🔐 New users must register and wait for SUPERADMIN activation before accessing the system.

---

## 👥 Team Members

| # | Name | Role | Responsibilities |
|---|------|------|-----------------|
| **M1** | Santiago, Michael E. | Project Lead / Full-Stack Developer | Sprint coordination, GitHub management, Supabase setup, API services, routing, Vercel deployment |
| **M2** | Velasco, Crisglynver G. | Frontend Developer (UI/UX) | All React pages, modals, lookup pages, reports charts, admin page, responsive design |
| **M3** | Bachiler, Ranezet Vhon | Backend / Database Engineer | Schema, migrations, RLS policies, triggers, SQL views (sales_with_lookup, salesdetail_with_product, monthly_sales_trend, sales_by_customer, top_products_sold) |
| **M4** | Manilag, Sebastian Andrew N. | Rights & Auth Specialist | AuthContext, RightsContext, 13-right gating, Google OAuth, login guard, account activation |
| **M5** | Loterte, Justine R. | QA / Documentation | Test cases, rights matrix, user manual, sprint logs, presentation |

---

## 🛠 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite 5 | Single-page application, component-based UI |
| **Styling** | Tailwind CSS 3 | Utility-first responsive design system |
| **Charts** | Recharts | Bar charts and pie chart for Reports page |
| **Backend / DB** | Supabase (PostgreSQL) | Database, Auth, RLS Policies, Triggers, Functions, Views |
| **Authentication** | Supabase Auth | Email/password + Google OAuth 2.0 sign-in |
| **State Management** | React Context API | Global auth session and user rights map |
| **Version Control** | Git + GitHub | Source control, branching, pull requests |
| **Testing** | Vitest + React Testing Library | Unit and integration test suite |
| **Deployment** | Vercel | Production hosting at hopesms-chi.vercel.app |

---

## ✨ System Features

### 🔐 Authentication
- Email/password registration with email confirmation
- Google OAuth 2.0 sign-in and registration
- Automatic account provisioning as `USER / INACTIVE` on registration
- Login guard — blocks inactive accounts on every sign-in attempt
- Admin activation workflow before users can access the system

### 📊 Sales Management *(Sprint 2)*
- Full CRUD on sales transactions (transno, salesdate, customer, employee)
- Full CRUD on sales detail line items (product, quantity, unit price)
- Customer and employee dropdown lookups on sales forms
- Product dropdown with automatic price lookup from price history
- Soft-delete with cascade — deleting a sale hides all its line items
- Stamp audit trail on every create, update, delete, and recover operation

### 👁 Role-Based Visibility
- `USER` accounts see only `ACTIVE` records across all views
- `ADMIN` and `SUPERADMIN` see all records including deleted items
- Stamp column hidden from USER accounts
- Deleted Items panel (tabbed: Transactions / Line Items) for ADMIN+
- Recovery of soft-deleted records by ADMIN and SUPERADMIN

### 📋 Lookup Pages *(Read-only)*
- Customer Lookup — 82 customers with search
- Employee Lookup — 32 employees with hire/sep dates
- Product Lookup — 57 products with unit
- Price History Lookup — 79 price entries

### 📈 Reports *(Sprint 3)*
- **Summary stats** — Total Revenue (₱689,740.53), 124 Transactions, 1,797 Units Sold
- **Monthly Sales Trend** — bar chart from `monthly_sales_trend` SQL view
- **Top 5 Customers** — horizontal bar from `sales_by_customer` SQL view
- **Top 5 Products** — horizontal bar from `top_products_sold` SQL view
- **Transactions by Sales Agent** — donut pie chart from `sales_with_lookup`

### 🛡 Admin Module *(Sprint 3)*
- List all users with role, status, full name, and email
- Activate / Deactivate user accounts (with stamp audit trail)
- SUPERADMIN can change user roles between USER and ADMIN
- SUPERADMIN accounts are fully protected — cannot be modified by anyone
- Gated by `ADM_USER` right

---

## 🗄 Database Design

The system uses **6 HopeDB tables** + **5 SQL views** + **rights/auth tables**.

### HopeDB Tables

| Table | Role | CRUD / Lookup | Seed Records |
|-------|------|--------------|--------------|
| `sales` | Primary — sales transactions | Full CRUD (soft-delete) | 124 transactions |
| `salesdetail` | Primary — line items | Full CRUD (soft-delete) | ~310 line items |
| `customer` | Lookup only | SELECT only | 82 customers |
| `employee` | Lookup only | SELECT only | 32 employees |
| `product` | Lookup only | SELECT only | 57 products |
| `pricehist` | Lookup only — unit price auto-fill | SELECT only | 79 price entries |

### SQL Views

| View | Purpose |
|------|---------|
| `sales_with_lookup` | Sales joined with customer and employee names |
| `salesdetail_with_product` | Line items joined with product description and unit price |
| `monthly_sales_trend` | Revenue and transaction count grouped by month |
| `sales_by_customer` | Total revenue ranked by customer |
| `top_products_sold` | Total qty and revenue ranked by product |

### Critical Design Decisions

```
✅  record_status and stamp columns added to sales and salesdetail ONLY
✅  customer, employee, product, pricehist — ZERO structural changes
✅  Cascade soft-delete trigger: sales INACTIVE → all salesdetail INACTIVE
✅  Cascade recovery: sales ACTIVE → all salesdetail ACTIVE
✅  No DELETE keyword anywhere in application code or database functions
✅  All column names are lowercase (PostgreSQL standard)
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

### Production Deployment

The app is deployed on **Vercel** at [https://hopesms-chi.vercel.app](https://hopesms-chi.vercel.app).

To redeploy after changes:
```bash
vercel --prod
```

---

## 📁 Project Structure

```
hope-sms/
│
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 auth/
│   │   │   ├── ProtectedRoute.jsx       # Blocks unauthenticated access
│   │   │   └── AdminRoute.jsx           # Blocks non-ADMIN/SUPERADMIN
│   │   ├── 📁 layout/
│   │   │   └── AppShell.jsx             # Sidebar + responsive layout
│   │   ├── 📁 sales/
│   │   │   ├── AddSaleModal.jsx         # Create transaction modal
│   │   │   ├── EditSaleModal.jsx        # Edit transaction modal
│   │   │   ├── AddLineItemModal.jsx     # Add line item + price autofill
│   │   │   └── EditLineItemModal.jsx    # Edit line item modal
│   │   └── 📁 ui/
│   │       └── index.jsx                # LoadingSpinner, EmptyState, Modal, etc.
│   │
│   ├── 📁 contexts/
│   │   ├── AuthContext.jsx              # Global auth state + login guard
│   │   └── RightsContext.jsx           # 13-right map loaded on login
│   │
│   ├── 📁 pages/
│   │   ├── 📁 auth/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── AuthCallbackPage.jsx
│   │   ├── 📁 sales/
│   │   │   ├── SalesListPage.jsx        # 124 transactions with CRUD
│   │   │   └── SalesDetailPage.jsx      # Transaction header + line items
│   │   ├── 📁 lookups/
│   │   │   └── LookupPages.jsx          # 4 read-only lookup pages
│   │   ├── 📁 reports/
│   │   │   └── ReportsPage.jsx          # 4 charts + 3 summary stats
│   │   ├── 📁 admin/
│   │   │   ├── AdminPage.jsx            # User management
│   │   │   └── DeletedItemsPage.jsx     # Soft-deleted items recovery
│   │   └── PlaceholderPages.jsx         # Re-exports Reports + Admin
│   │
│   ├── 📁 services/
│   │   ├── supabaseClient.js            # Supabase JS client
│   │   ├── authService.js               # Auth functions
│   │   ├── salesService.js              # Sales CRUD + soft-delete
│   │   ├── salesDetailService.js        # Line items CRUD + soft-delete
│   │   ├── lookupService.js             # Read-only lookups
│   │   ├── reportsService.js            # 3 SQL view queries
│   │   └── adminService.js              # User management functions
│   │
│   └── 📁 test/
│       ├── setup.js
│       ├── sprint1-auth-flows.test.jsx   # 10 auth test cases
│       ├── sprint2-cascade-visibility.test.js
│       └── sprint2-rights-39-cases.test.js
│
├── vercel.json                          # SPA rewrite rule for Vercel
├── .env.example                         # Environment variable template
├── .nvmrc                               # Node version (24)
├── package.json
├── vite.config.js
└── README.md
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

---

## 📅 Sprint Progress

### Sprint 1 — Weeks 1 & 2 ✅ Complete

| Deliverable | Member | Status |
|-------------|--------|--------|
| Vite + React 18 + Tailwind CSS scaffold | M1 | ✅ Done |
| Supabase JS client + environment config | M1 | ✅ Done |
| React Router v6 + ProtectedRoute + all routes | M1 | ✅ Done |
| GitHub repo + branch protection + PR template | M1 | ✅ Done |
| Login page — email + Google OAuth | M2 | ✅ Done |
| Register page — 6 fields + confirmation screen | M2 | ✅ Done |
| AppShell — sidebar + mobile responsive | M2 | ✅ Done |
| /auth/callback — OAuth redirect handler | M2 | ✅ Done |
| All 6 HopeDB tables + record_status/stamp | M3 | ✅ Done |
| 4 modules + 13 rights + SUPERADMIN seeded | M3 | ✅ Done |
| ERD diagram | M3 | ✅ Done |
| AuthContext + login guard | M4 | ✅ Done |
| Google OAuth configured | M4 | ✅ Done |
| provision_new_user() trigger | M4 | ✅ Done |
| Vitest + RTL + 10 test cases | M5 | ✅ Done |
| README + sprint logs + gate checklist | M5 | ✅ Done |

**Sprint 1 Gate: 56/56 criteria passed ✅**

---

### Sprint 2 — Weeks 3 & 4 ✅ Complete

| Deliverable | Member | Status |
|-------------|--------|--------|
| salesService.js — full CRUD + soft-delete + recover | M1 | ✅ Done |
| salesDetailService.js — full CRUD + soft-delete + recover | M1 | ✅ Done |
| RightsContext — 13-right map loaded on login | M1 | ✅ Done |
| AdminRoute guard | M1 | ✅ Done |
| SalesListPage — table + search + CRUD modals | M2 | ✅ Done |
| SalesDetailPage — header + line items + modals | M2 | ✅ Done |
| AddSaleModal + EditSaleModal | M2 | ✅ Done |
| AddLineItemModal + EditLineItemModal (price autofill) | M2 | ✅ Done |
| DeletedItemsPage — tabbed transactions + line items | M2 | ✅ Done |
| 4 read-only lookup pages | M2 | ✅ Done |
| sales_with_lookup SQL view | M3 | ✅ Done |
| salesdetail_with_product SQL view | M3 | ✅ Done |
| Cascade soft-delete trigger | M3 | ✅ Done |
| RLS policies for sales + salesdetail | M3 | ✅ Done |
| 13-right gating on all CRUD buttons | M4 | ✅ Done |
| Stamp visibility gated by user type | M4 | ✅ Done |
| 39-case rights test matrix | M5 | ✅ Done |
| Cascade visibility test suite | M5 | ✅ Done |

---

### Sprint 3 — Weeks 5 & 6 ✅ Complete

| Deliverable | Member | Status |
|-------------|--------|--------|
| reportsService.js — 3 SQL view queries | M1 | ✅ Done |
| adminService.js — getUsers, activate, deactivate, changeRole | M1 | ✅ Done |
| Vercel production deployment | M1 | ✅ Done |
| ReportsPage — 4 charts + 3 summary stats | M2 | ✅ Done |
| AdminPage — user management with role control | M2 | ✅ Done |
| monthly_sales_trend SQL view | M3 | ✅ Done |
| sales_by_customer SQL view | M3 | ✅ Done |
| top_products_sold SQL view | M3 | ✅ Done |
| SUPERADMIN protection — UI + DB level | M4 | ✅ Done |
| ADM_USER right gating on Admin page | M4 | ✅ Done |

---

## 🔒 Key System Rules

| # | Rule | Detail |
|---|------|--------|
| 1 | **No hard deletes** | The `DELETE` keyword must never appear in any application code, Supabase function, or RLS policy |
| 2 | **Soft-delete only** | All removals set `record_status = 'INACTIVE'` on the sales or salesdetail row |
| 3 | **Cascade soft-delete** | Soft-deleting a `sales` row sets ALL its `salesdetail` rows to `INACTIVE` |
| 4 | **INACTIVE = invisible to USER** | USER accounts never see INACTIVE records in any view, list, or lookup |
| 5 | **Lookup tables are read-only** | `customer`, `employee`, `product`, `pricehist` — SELECT only, zero mutations ever |
| 6 | **SUPERADMIN is protected** | ADMIN cannot modify a SUPERADMIN account at UI or database level |
| 7 | **Auto-provisioning** | New registrations are automatically USER / INACTIVE pending admin activation |
| 8 | **Stamp is hidden from USER** | The `stamp` audit column is never shown to USER accounts in any view |
| 9 | **All columns lowercase** | PostgreSQL normalizes all column names to lowercase — code uses lowercase throughout |

---

## 🧪 Testing

| Sprint | Test File | Cases | Status |
|--------|-----------|-------|--------|
| Sprint 1 | `sprint1-auth-flows.test.jsx` | 10 | ✅ All Pass |
| Sprint 2 | `sprint2-rights-39-cases.test.js` | 39 | ✅ All Pass |
| Sprint 2 | `sprint2-cascade-visibility.test.js` | 13 | ✅ All Pass |

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
| **Live URL** | https://hopesms-chi.vercel.app |

---

<div align="center">

**Hope, Inc. Sales Management System**
*New Era University · BS Information Technology · AY 2025–2026*

🌐 [hopesms-chi.vercel.app](https://hopesms-chi.vercel.app)

</div>
