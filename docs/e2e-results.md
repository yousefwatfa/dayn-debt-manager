# E2E results

Run against `http://localhost:3100` on 2026-11-05 — **40/40 passed**

| # | Check | Result | Detail |
|---|---|---|---|
| 1 | Login page renders (RTL Arabic) | ✅ PASS |  |
| 2 | Wrong password is rejected with an error message | ✅ PASS |  |
| 3 | Login succeeds and dashboard loads | ✅ PASS |  |
| 4 | Dashboard totals are correct (USD receivable 1,300 / payable 800 / net 500) | ✅ PASS | ‏1,300.00 US$ / ‏2,200.00 ر.س.‏ / ‏800.00 US$ / ‏0.00 ر.س.‏ / ‏500.00 US$ / ‏2,200.00 ر.س.‏ |
| 5 | Overdue and upcoming lists are populated | ✅ PASS |  |
| 6 | Sync badge shows "synced" | ✅ PASS | تمت المزامنة |
| 7 | Parties list shows 4 demo parties | ✅ PASS |  |
| 8 | Party detail opens with debts and balance | ✅ PASS |  |
| 9 | Party form validates required name (dialog stays open) | ✅ PASS |  |
| 10 | Creating a party works | ✅ PASS |  |
| 11 | Debts list shows all 5 demo debts | ✅ PASS | 5 |
| 12 | Due date before issue date is rejected | ✅ PASS |  |
| 13 | Creating a debt navigates to its detail page | ✅ PASS |  |
| 14 | Partial payment updates paid/remaining (200 / 300) | ✅ PASS | ‏500.00 US$ / ‏200.00 US$ / ‏300.00 US$ |
| 15 | Debt status becomes "partially paid" | ✅ PASS |  |
| 16 | Overpayment is rejected | ✅ PASS |  |
| 17 | Voiding a payment restores the remaining balance | ✅ PASS |  |
| 18 | Report filter "overdue" returns only overdue debts | ✅ PASS | 1 |
| 19 | CSV export contains header and data rows | ✅ PASS | 7 lines |
| 20 | Profile update works (toast shown) | ✅ PASS |  |
| 21 | Wrong current password is rejected | ✅ PASS |  |
| 22 | Admin page lists users and audit log | ✅ PASS |  |
| 23 | Dark mode toggles | ✅ PASS |  |
| 24 | Language switches to English / LTR | ✅ PASS |  |
| 25 | Mobile: no horizontal scroll on dashboard | ✅ PASS |  |
| 26 | Mobile: bottom navigation visible | ✅ PASS |  |
| 27 | Mobile: no horizontal scroll on debts | ✅ PASS |  |
| 28 | A11y: every form control has a label | ✅ PASS | 0 unlabeled |
| 29 | A11y: every button/link has an accessible name | ✅ PASS | 0 nameless |
| 30 | A11y: skip link and landmarks present | ✅ PASS |  |
| 31 | Offline: badge shows offline | ✅ PASS | Offline — saved locally |
| 32 | Offline: new party is visible immediately | ✅ PASS |  |
| 33 | Offline: change is queued (pending = 1) | ✅ PASS | Offline — saved locally (1) |
| 34 | Back online: queue syncs automatically | ✅ PASS | Synced |
| 35 | Back online: offline-created party exists on the server | ✅ PASS |  |
| 36 | Service worker is active and controls the page | ✅ PASS |  |
| 37 | Service worker cached the app shell | ✅ PASS |  |
| 38 | Server is really down | ✅ PASS |  |
| 39 | Server down: page still opens and shows local data after a reload | ✅ PASS |  |
| 40 | Logout returns to the login page and clears local data | ✅ PASS |  |
