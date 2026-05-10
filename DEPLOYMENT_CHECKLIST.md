# Production Deployment Checklist
**PR:** chore/production-deploy  
**Assignee:** Santiago, Michael E.  
**Sprint:** Sprint 3

---

## Step 1 — Build locally first

```bash
npm run build
```
Confirm: no build errors, `dist/` folder created.

---

## Step 2 — Deploy to Vercel (recommended)

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import the `hope-sms` GitHub repository
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`

### Add environment variables in Vercel dashboard:

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

6. Click **Deploy**
7. Copy the production URL (e.g. `https://hope-sms.vercel.app`)

---

## Step 3 — Add production redirect URL to Supabase

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Under **Redirect URLs**, add:
   ```
   https://hope-sms.vercel.app/auth/callback
   ```
3. Under **Site URL**, set:
   ```
   https://hope-sms.vercel.app
   ```
4. Save changes

---

## Step 4 — Add production redirect URL to Google Cloud Console

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. APIs & Services → **Credentials** → OAuth 2.0 Client
3. Under **Authorized redirect URIs**, add:
   ```
   https://[your-supabase-project-id].supabase.co/auth/v1/callback
   ```
   (This was already added for localhost — production uses the same Supabase callback URL)
4. Save

---

## Step 5 — Verify production deployment

| Check | Expected |
|---|---|
| App loads at production URL | ✅ |
| Email login works | ✅ |
| Google OAuth login works | ✅ |
| `/auth/callback` redirects to `/sales` | ✅ |
| INACTIVE user blocked at login | ✅ |
| Sales list loads with correct data | ✅ |
| All 4 lookup pages load | ✅ |
| All 4 reports load | ✅ |
| Deleted Items visible for ADMIN/SUPERADMIN | ✅ |
| No console errors in production | ✅ |

---

## Step 6 — Delete stale feature branches

After final `dev → main` merge, delete all merged feature branches:

```bash
# List merged branches
git branch --merged main

# Delete locally
git branch -d feat/sales-api feat/lookup-api feat/admin-api ...

# Delete from GitHub
git push origin --delete feat/sales-api feat/lookup-api feat/admin-api ...
```

Or use GitHub UI: **Branches** → filter merged → delete each one.

---

Completed by: Santiago, Michael E.  
Date: Sprint 3, Week 6
