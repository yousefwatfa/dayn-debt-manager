# E2E results

Run against `http://localhost:3100` on 2026-11-05 — **41/41 passed**

| # | Check | Result | Detail |
|---|---|---|---|
| 1 | Login page renders (RTL Arabic) | ✅ PASS |  |
| 2 | Wrong password is rejected with an error message | ✅ PASS |  |
| 3 | Login succeeds and dashboard loads | ✅ PASS |  |
| 4 | Dashboard totals are correct (USD receivable 1,300 / payable 800 / net 500) | ✅ PASS | ‏1,300.00 US$ / ‏2,200.00 ر.س.‏ / ‏800.00 US$ / ‏0.00 ر.س.‏ / ‏500.00 US$ / ‏2,200.00 ر.س.‏ |
| 5 | Overdue and upcoming lists are populated | ✅ PASS |  |
| 6 | Sync badge shows "synced" | ✅ PASS | تمت المزامنة |
| 7 | Live exchange rates card shows converted totals | ✅ PASS |  |
| 8 | Parties list shows 4 demo parties | ✅ PASS |  |
| 9 | Party detail opens with debts and balance | ✅ PASS |  |
| 10 | Party form validates required name (dialog stays open) | ✅ PASS |  |
| 11 | Creating a party works | ✅ PASS |  |
| 12 | Debts list shows all 5 demo debts | ✅ PASS | 5 |
| 13 | Due date before issue date is rejected | ✅ PASS |  |
| 14 | Creating a debt navigates to its detail page | ✅ PASS |  |
| 15 | Partial payment updates paid/remaining (200 / 300) | ✅ PASS | ‏500.00 US$ / ‏200.00 US$ / ‏300.00 US$ |
| 16 | Debt status becomes "partially paid" | ✅ PASS |  |
| 17 | Overpayment is rejected | ✅ PASS |  |
| 18 | Voiding a payment restores the remaining balance | ✅ PASS |  |
| 19 | Report filter "overdue" returns only overdue debts | ✅ PASS | 1 |
| 20 | CSV export contains header and data rows | ✅ PASS | 7 lines |
| 21 | Profile update works (toast shown) | ✅ PASS |  |
| 22 | Wrong current password is rejected | ✅ PASS |  |
| 23 | Admin page lists users and audit log | ✅ PASS |  |
| 24 | Dark mode toggles | ✅ PASS |  |
| 25 | Language switches to English / LTR | ✅ PASS |  |
| 26 | Mobile: no horizontal scroll on dashboard | ✅ PASS |  |
| 27 | Mobile: bottom navigation visible | ✅ PASS |  |
| 28 | Mobile: no horizontal scroll on debts | ✅ PASS |  |
| 29 | A11y: every form control has a label | ✅ PASS | 0 unlabeled |
| 30 | A11y: every button/link has an accessible name | ✅ PASS | 0 nameless |
| 31 | A11y: skip link and landmarks present | ✅ PASS |  |
| 32 | Offline: badge shows offline | ✅ PASS | Offline — saved locally |
| 33 | Offline: new party is visible immediately | ✅ PASS |  |
| 34 | Offline: change is queued (pending = 1) | ✅ PASS | Offline — saved locally (1) |
| 35 | Back online: queue syncs automatically | ✅ PASS | Synced |
| 36 | Back online: offline-created party exists on the server | ✅ PASS |  |
| 37 | Service worker is active and controls the page | ✅ PASS |  |
| 38 | Service worker cached the app shell | ✅ PASS |  |
| 39 | Server is really down | ✅ PASS |  |
| 40 | Server down: page still opens and shows local data after a reload | ✅ PASS |  |
| 41 | Logout returns to the login page and clears local data | ✅ PASS |  |
