# Testing & screenshots

| Suite | What it covers | Result |
|---|---|---|
| `node test.js` | REST API + offline-sync endpoint (auth, parties, debts, payments, void, CSV, admin guard, sync idempotency) | **18 / 18** — [output](api-test-results.txt) |
| `node e2e/run.js` | Real browser (headless Edge over CDP): every screen, form validation, payments, reports, settings, admin, dark mode, Arabic/English, mobile, accessibility spot checks, offline mode, sync, **server-down reload** | **40 / 40** — [details](e2e-results.md) |

## How to reproduce
```
# 1) API tests (fresh DB)
set DATA_DIR=%TEMP%\dayn-api && set PORT=3101 && node dev-server.js
set BASE=http://localhost:3101 && node test.js

# 2) E2E + screenshots (fresh DB with demo data)
set DATA_DIR=%TEMP%\dayn-demo && set PORT=3100 && node dev-server.js
set BASE=http://localhost:3100 && node e2e/seed.js
set BASE=http://localhost:3100 && set SERVER_PID=<pid of the server above> && node e2e/run.js
```
`SERVER_PID` is optional: when set, the run kills the server near the end to prove the page still opens offline.
Requires Microsoft Edge or Chrome (override the path with `BROWSER=`).

## What was checked
- **Auth:** wrong password rejected, login, logout clears local data.
- **Dashboard:** totals per currency (USD / SAR), overdue and due-within-7-days lists, sync badge.
- **Parties:** list, detail with balances, required-name validation, create.
- **Debts & payments:** create, due-before-issue rejected, partial payment (paid / remaining / status), overpayment rejected, void payment restores balance.
- **Reports:** overdue filter, CSV export.
- **Settings / Admin:** profile update, wrong current password rejected, user list and audit log.
- **UI:** dark mode, Arabic RTL ↔ English LTR, mobile layout (no horizontal scroll, bottom navigation).
- **Accessibility spot checks:** every form control labelled, every button/link named, skip link and landmarks.
- **Offline-first:** offline badge, creating data offline, queued change, automatic sync on reconnect, data visible on the server afterwards, page reload while the server is down.

## Not covered
- Telegram delivery (needs a real bot token) and the daily cron.
- The deployed Vercel site was **not** driven by these tests, to avoid writing test data into the production database.
- Two devices editing the same record offline (last write wins; the server rejects invalid operations such as overpayment and the client shows a notice).

## Screenshots

### Desktop (Arabic, light)
| Login | Dashboard |
|---|---|
| ![](screenshots/01-login-ar-light.png) | ![](screenshots/02-dashboard-ar-light.png) |
| **Parties** | **Party detail** |
| ![](screenshots/03-parties.png) | ![](screenshots/04-party-detail.png) |
| **Debts** | **Debt detail & payments** |
| ![](screenshots/06-debts.png) | ![](screenshots/09-debt-detail.png) |
| **Add debt** | **Add payment** |
| ![](screenshots/07-add-debt-dialog.png) | ![](screenshots/08-add-payment-dialog.png) |
| **Reports** | **Settings** |
| ![](screenshots/10-reports.png) | ![](screenshots/11-settings.png) |
| **Admin** | **Add party** |
| ![](screenshots/12-admin.png) | ![](screenshots/05-party-dialog.png) |

### Dark mode and English
| Arabic, dark | English, dark |
|---|---|
| ![](screenshots/13-dashboard-ar-dark.png) | ![](screenshots/14-dashboard-en-dark.png) |

### Mobile (390 × 844)
| Dashboard | Debts | Add debt |
|---|---|---|
| ![](screenshots/15-mobile-dashboard.png) | ![](screenshots/16-mobile-debts.png) | ![](screenshots/17-mobile-add-debt.png) |

### Offline-first
| Offline, change queued | Synced after reconnect | Page reloaded with the server down |
|---|---|---|
| ![](screenshots/18-offline-pending.png) | ![](screenshots/19-synced.png) | ![](screenshots/20-server-down-reload.png) |
