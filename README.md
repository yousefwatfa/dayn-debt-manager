# Dayn — Debt Manager

Web app to track debts and receivables: parties, debts, partial payments, reports, Telegram reminders.
Arabic (RTL) / English, light / dark mode, mobile-first.

## Offline-first
The app keeps a full local copy of your data in the browser (IndexedDB). Everything works without a connection;
changes are queued and pushed to the database automatically when the connection returns
(`POST /api/sync`, see `web/local.js`). A badge shows Offline / Syncing / Synced / pending count.
Notes: first sign-in on a device needs a connection; Settings, Telegram and Admin need a connection;
if two devices edit the same record, the server applies changes in arrival order and the last one wins.
A service worker (`web/sw.js`) caches the app shell so the page itself opens offline.

## Local development
Node.js 22+ (uses built-in `node:sqlite` when no Turso URL is set).
```
npm install
node dev-server.js
```
Open http://localhost:3000. The first account registered becomes admin.

## Deploy on Vercel (free)
1. Create a free database at https://turso.tech and note its **URL** (`libsql://...`) and an **auth token**.
2. In Vercel project settings, add environment variables:
   - `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`
   - `JWT_SECRET` (any long random string)
   - `CRON_SECRET` (any random string; enables the daily Telegram summary cron)
3. Deploy (`vercel --prod` or connect the GitHub repo). Tables are created automatically on first request.

## Env vars
`PORT`, `DATA_DIR` (local only), `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `JWT_SECRET`, `CRON_SECRET`.

## Test
```
set DATA_DIR=%TEMP%\dayn-test && set PORT=3100 && node dev-server.js
set BASE=http://localhost:3100 && node test.js
```

