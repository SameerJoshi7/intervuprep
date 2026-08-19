# Deploying IntervuPrep for $0

This guide deploys the whole app on free tiers — **no credit card required for the
core path, and no ongoing cost**:

- **Database:** Neon (free Postgres)
- **API:** Render (free web service)
- **Frontend:** Vercel (free static hosting)

Total: **$0/month**. Read the "Free-tier caveats" section at the end so nothing surprises you.

---

## 0. Push the repo to GitHub

All three hosts deploy from a Git repo.

```bash
cd intervu-prep
git init
git add .
git commit -m "IntervuPrep"
# create a repo on github.com, then:
git remote add origin https://github.com/<you>/intervu-prep.git
git push -u origin main
```

> `server/.env` and `client/.env*` are gitignored — your secrets are not committed.

---

## 1. Database — Neon (free Postgres)

1. Go to https://neon.tech and sign up (GitHub login, no card).
2. Create a project → it gives you a **connection string** like:
   `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
3. Copy it — you'll paste it into Render as `DATABASE_URL`.

That's it. Neon runs your Postgres; migrations run automatically on the API's first deploy (see below).

---

## 2. API — Render (free web service)

1. Go to https://render.com → **New → Web Service** → connect your GitHub repo.
2. Configure:
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
   - **Start Command:** `npm start`
3. Add **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | (the Neon connection string from step 1) |
   | `JWT_SECRET` | a long random string (generate one below) |
   | `CLIENT_ORIGIN` | your Vercel URL, e.g. `https://intervu-prep.vercel.app` |
   | `NODE_ENV` | `production` |
4. Deploy. When it's live you'll get a URL like `https://intervu-prep-api.onrender.com`.
5. Sanity check: open `https://<your-api>.onrender.com/api/health` → `{"ok":true}`.

Generate a strong `JWT_SECRET` locally:
```powershell
-join ((48..57)+(65..90)+(97..122) | Get-Random -Count 48 | ForEach-Object {[char]$_})
```

> `NODE_ENV=production` makes the auth cookie `Secure` + `SameSite=None` so it works
> across the Vercel ↔ Render domains. This is already wired in the code.

---

## 3. Frontend — Vercel

1. Go to https://vercel.com → **Add New → Project** → import your GitHub repo.
2. Configure:
   - **Root Directory:** `client`
   - Framework preset: **Vite** (auto-detected)
   - Build command: `npm run build` · Output dir: `dist` (defaults are fine)
3. Add **Environment Variable**:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://<your-api>.onrender.com/api` |
4. Deploy. You'll get `https://intervu-prep.vercel.app`.
5. **Important:** go back to Render and make sure `CLIENT_ORIGIN` exactly matches this
   Vercel URL (no trailing slash), then redeploy the API if you changed it.

`client/vercel.json` already handles SPA routing so deep links (e.g. `/topic/react`) work.

---

## 4. Verify end-to-end

1. Open your Vercel URL.
2. Click **Sign in → Create account**.
3. Save a note on a question, mark something mastered.
4. Log out, log back in (or open the site on your phone) → your data is there.

---

## Free-tier caveats (read this)

- **Render free services sleep after ~15 min idle.** The first request after sleeping
  takes ~30–50s (cold start). To keep it warm for free, create a scheduled ping:
  - Use https://cron-job.org (free) to GET `https://<your-api>.onrender.com/api/health`
    every 10 minutes.
- **Neon free tier** may pause an idle database; it wakes on the next connection
  (adds a small delay). Storage is limited (~0.5 GB) — plenty for this app.
- **HTTPS is included** on both `*.vercel.app` and `*.onrender.com`. A custom domain is
  optional (~$10/yr) and NOT required.
- **Why not AWS?** AWS Free Tier is only 12 months and RDS can incur charges. For an
  indefinitely-free host, this Vercel + Render + Neon stack is safer.

---

## Local development recap

```powershell
# API
cd server
npm install
npm run prisma:generate
npm run prisma:migrate   # needs local Postgres + server/.env
npm run dev              # http://localhost:4000

# Frontend (separate terminal)
cd client
npm install
npm run dev              # http://localhost:5173
```
