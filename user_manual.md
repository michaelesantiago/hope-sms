# Hope SMS — User Manual
**System:** Hope Sales Management System  
**Version:** 1.0 (Sprint 3 Final)  
**Prepared by:** Loterte, Justine R.  
**Course:** BS Information Technology Capstone  
**University:** New Era University

---

## Table of Contents
1. Getting Started
2. Registration
3. Login
4. Sales Transactions
5. Line Items
6. Lookup Pages
7. Reports
8. Admin Module
9. Deleted Items
10. Logout

---

## 1. Getting Started

Hope SMS (Sales Management System) is a web application for managing sales transactions, customers, employees, and products for Hope, Inc.

**Access the system at:** `https://hope-sms.vercel.app`

**User types:**

| Type | Access Level |
|---|---|
| USER (Sales Agent) | View sales, view lookups, view reports |
| ADMIN (Sales Manager) | Above + create/edit sales, manage users |
| SUPERADMIN | Full access including delete and rights management |

> **Note:** New accounts start as INACTIVE. A Sales Manager (ADMIN) must activate your account before you can log in.

---

## 2. Registration

### Email Registration
1. Go to the app URL and click **Register**
2. Fill in: First Name, Last Name, Username, Email, Password
3. Click **Create Account**
4. Wait for a Sales Manager to activate your account
5. You will receive a confirmation — then log in normally

### Google Registration
1. On the Register page, click **Sign up with Google**
2. Select your Google account
3. Wait for activation — same as email registration

---

## 3. Login

### Email Login
1. Enter your registered **email** and **password**
2. Click **Sign In**
3. If your account is INACTIVE, you will see: *"Your account is pending activation by a Sales Manager."*
4. On success, you are redirected to the **Sales Transactions** page

### Google Login
1. Click **Sign in with Google**
2. Select your Google account
3. You are redirected to `/auth/callback` briefly, then to **Sales Transactions**

---

## 4. Sales Transactions

Navigate to **Sales** in the sidebar.

### Viewing Transactions
- All users see the transaction list with: Transaction No., Date, Customer, Employee, Items, Total
- ADMIN and SUPERADMIN also see: Status column and Stamp column
- Click any **Transaction No.** to open the detail view

### Filtering
- Filter by **customer name** using the search box
- Filter by **date range** using the From and To date inputs
- Click **Clear** to reset all filters

### Creating a Transaction *(ADMIN and SUPERADMIN only)*
1. Click **+ Create Transaction**
2. Select **Sales Date**, **Customer** (dropdown), **Employee** (dropdown)
3. Click **Create Transaction**

### Editing a Transaction *(ADMIN and SUPERADMIN only)*
1. Click **Edit** on any active transaction row
2. Update the fields
3. Click **Save Changes**

### Deleting a Transaction *(SUPERADMIN only)*
1. Click **Delete** on any active transaction row
2. Confirm the soft-delete dialog
3. The transaction moves to **Deleted Items** — it is not permanently removed

---

## 5. Line Items

Click any Transaction No. to open the **Transaction Detail** page.

### Viewing Line Items
- See all products, quantities, unit prices, and line totals
- The transaction total (active lines only) appears in the header

### Adding a Line Item *(ADMIN and SUPERADMIN only)*
1. Click **+ Add Line Item**
2. Select a **Product** from the dropdown
3. The **Unit Price** auto-fills with the current price from price history
4. Enter the **Quantity**
5. A line total preview appears
6. Click **Add Line Item**

### Editing a Line Item *(ADMIN and SUPERADMIN only)*
1. Click **Edit** on a line item row
2. Update the quantity (product cannot be changed — it is the record key)
3. Click **Save Changes**

### Deleting a Line Item *(SUPERADMIN only)*
1. Click **Delete** on a line item row
2. Confirm — the item moves to Deleted Items (Line Items tab)

---

## 6. Lookup Pages

All four lookup pages are **read-only** — no add, edit, or delete actions are available to any user type.

| Page | Data Shown |
|---|---|
| **Customers** | Customer ID, Name, Address, Payment Term |
| **Employees** | Employee ID, Full Name, Gender, Hire Date |
| **Products** | Product Code, Description, Unit |
| **Price History** | Product Code, Effective Date, Unit Price |

Use the **search box** on each page to filter by name or code.

---

## 7. Reports

Navigate to **Reports** in the sidebar. All reports are accessible to all user types.

### Sales by Employee
- Shows each employee's total transactions and revenue
- Click column headers to sort
- Bar chart shows revenue comparison

### Sales by Customer
- Shows each customer's total transactions and spend
- Highlights the top customer
- Bar chart shows top 10 customers

### Top Products Sold
- Shows products ranked by total quantity sold and revenue
- Horizontal bar chart for easy comparison

### Monthly Sales Trend
- Shows revenue and transaction count per month
- Use the **From** and **To** month filters to narrow the range
- Click **Apply** to refresh the chart

---

## 8. Admin Module *(ADMIN and SUPERADMIN only)*

Navigate to **Admin** → **User Management** in the sidebar.

### Viewing Users
- See all registered users with their role and status

### Activating a User
1. Find the user with **INACTIVE** status
2. Click **Activate**
3. The user can now log in

### Deactivating a User
1. Find the user with **ACTIVE** status
2. Click **Deactivate** and confirm
3. The user is immediately blocked from logging in

> **Important:** SUPERADMIN accounts are protected — they appear greyed out and cannot be activated or deactivated by anyone.

---

## 9. Deleted Items *(ADMIN and SUPERADMIN only)*

Navigate to **Deleted Items** in the sidebar.

### Transactions tab
- Shows all soft-deleted sales transactions
- Click **Recover** to restore a transaction and all its line items

### Line Items tab
- Shows all individually soft-deleted line items
- Click **Recover** to restore a specific line item

> **Note:** Recovering a transaction also recovers all its line items. Individual line item recovery is also available.

---

## 10. Logout

Click your **username** in the bottom of the sidebar, then click **Sign out**.

Your session is cleared and you are returned to the login page.

---

*Hope SMS v1.0 — Hope, Inc. Sales Management System*  
*New Era University — BS Information Technology Capstone*
