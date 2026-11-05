'use strict';
/* End-to-end test + screenshot run. Drives a headless Edge/Chrome over the DevTools protocol (no dependencies).
   Prereq: a server with the demo data from e2e/seed.js is running.
     BASE=http://localhost:3100 node e2e/run.js
   Output: docs/screenshots/*.png and docs/e2e-results.md */
const { spawn } = require('node:child_process');
const fs = require('node:fs'), os = require('node:os'), path = require('node:path');

const BASE = process.env.BASE || 'http://localhost:3100';
const BROWSER = process.env.BROWSER || [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(p => fs.existsSync(p));
const SHOTS = path.join(__dirname, '..', 'docs', 'screenshots');
const PORT = 9333, sleep = ms => new Promise(r => setTimeout(r, ms));
fs.mkdirSync(SHOTS, { recursive: true });

const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok: !!ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`); };

let ws, nextId = 1; const pending = new Map();
const send = (method, params = {}) => new Promise((res, rej) => { const id = nextId++; pending.set(id, { res, rej }); ws.send(JSON.stringify({ id, method, params })); });
const ev = async expr => {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};
const until = async (expr, ms = 10000) => { const t = Date.now(); while (Date.now() - t < ms) { try { if (await ev(expr)) return true; } catch {} await sleep(120); } return false; };
const J = JSON.stringify;
const fill = (sel, v) => ev(`(()=>{const e=document.querySelector(${J(sel)});if(!e)throw new Error('missing ${sel}');e.value=${J(String(v))};e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));})()`);
const click = sel => ev(`(()=>{const e=document.querySelector(${J(sel)});if(!e)throw new Error('missing ${sel}');e.click();})()`);
const text = sel => ev(`document.querySelector(${J(sel)})?.textContent?.trim() ?? null`);
const go = async hash => { await ev(`location.hash=${J(hash)}`); await sleep(900); };
const shot = async name => { await sleep(350); const r = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(SHOTS, name + '.png'), Buffer.from(r.data, 'base64')); console.log('      screenshot', name); };
const viewport = (w, h, mobile = false) => send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: mobile ? 2 : 1, mobile });
const reload = async () => { await send('Page.reload'); await sleep(1200); };

async function launch() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dayn-e2e-'));
  const proc = spawn(BROWSER, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${dir}`, '--no-first-run', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  for (let i = 0; i < 60; i++) { try { const r = await fetch(`http://127.0.0.1:${PORT}/json/list`); const t = (await r.json()).find(x => x.type === 'page'); if (t) { ws = new WebSocket(t.webSocketDebuggerUrl); break; } } catch {} await sleep(250); }
  if (!ws) throw new Error('browser did not start');
  await new Promise(r => ws.addEventListener('open', r));
  ws.addEventListener('message', m => { const d = JSON.parse(m.data); const p = pending.get(d.id); if (p) { pending.delete(d.id); d.error ? p.rej(new Error(d.error.message)) : p.res(d.result); } });
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  return { proc, dir };
}

const dashVals = () => ev(`[...document.querySelectorAll('.stat .val')].map(e=>e.textContent)`);
const badge = () => text('#syncbadge');

async function main() {
  const { proc, dir } = await launch();
  try {
    /* ---------- 1. Auth ---------- */
    await viewport(1280, 800);
    await send('Page.navigate', { url: BASE + '/' }); await sleep(1200);
    await ev(`localStorage.clear(); localStorage.setItem('theme','light'); localStorage.setItem('lang','ar'); new Promise(r=>{const q=indexedDB.deleteDatabase('dayn');q.onsuccess=q.onerror=q.onblocked=r})`);
    await reload();
    check('Login page renders (RTL Arabic)', await ev(`document.documentElement.dir==='rtl' && !!document.querySelector('#auth')`));
    await shot('01-login-ar-light');

    await fill('#a-email', 'demo@dayn.test'); await fill('#a-pw', 'wrong-password');
    await ev(`document.querySelector('#auth').requestSubmit()`); await sleep(900);
    check('Wrong password is rejected with an error message', !!(await text('#auth .err')));
    await fill('#a-pw', 'Demo12345'); await ev(`document.querySelector('#auth').requestSubmit()`);
    check('Login succeeds and dashboard loads', await until(`document.querySelectorAll('.stat').length===3 && document.querySelectorAll('.stat .val').length>=3`));

    /* ---------- 2. Dashboard ---------- */
    await sleep(800);
    const vals = (await dashVals()).join(' | ');
    check('Dashboard totals are correct (USD receivable 1,300 / payable 800 / net 500)', /1,300\.00/.test(vals) && /800\.00/.test(vals) && /500\.00/.test(vals), vals);
    check('Overdue and upcoming lists are populated', await ev(`document.querySelectorAll('#h-od ~ .list .item, #h-up ~ .list .item').length>=2`));
    check('Sync badge shows "synced"', /تمت المزامنة/.test(await badge() || ''), await badge());
    await shot('02-dashboard-ar-light');

    /* ---------- 3. Parties ---------- */
    await go('#/parties');
    check('Parties list shows 4 demo parties', (await ev(`document.querySelectorAll('a.item').length`)) === 4);
    await shot('03-parties');
    await click('a.item'); await sleep(900);
    check('Party detail opens with debts and balance', await ev(`!!document.querySelector('h1') && document.querySelectorAll('.list a.item').length>=1`));
    await shot('04-party-detail');

    await go('#/parties'); await click('[data-act=party-new]'); await sleep(300);
    await shot('05-party-dialog');
    await click('dialog button[type=submit]'); await sleep(500);
    check('Party form validates required name (dialog stays open)', await ev(`!!document.querySelector('dialog[open]')`));
    await fill('#p-name', 'عميل اختبار E2E'); await fill('#p-phone', '0599000000'); await click('dialog button[type=submit]'); await sleep(1000);
    check('Creating a party works', await ev(`[...document.querySelectorAll('a.item strong')].some(e=>e.textContent.includes('E2E'))`));

    /* ---------- 4. Debts & payments ---------- */
    await go('#/debts');
    const rows = await ev(`document.querySelectorAll('tbody tr').length`);
    check('Debts list shows all 5 demo debts', rows === 5, String(rows));
    await shot('06-debts');
    await click('[data-act=debt-new]'); await sleep(400);
    await shot('07-add-debt-dialog');
    await fill('#d-party', await ev(`[...document.querySelectorAll('#d-party option')].find(o=>o.textContent.includes('E2E')).value`));
    await fill('#d-amt', '500'); await fill('#d-iss', '2026-01-01'); await fill('#d-due', '2025-12-01');
    await click('dialog button[type=submit]'); await sleep(700);
    check('Due date before issue date is rejected', /Due date/.test(await text('dialog .err') || ''));
    await fill('#d-due', '2026-12-31'); await click('dialog button[type=submit]');
    check('Creating a debt navigates to its detail page', await until(`location.hash.startsWith('#/debts/') && !!document.querySelector('.stat .val')`));
    await sleep(500);
    await click('[data-act=pay-new]'); await sleep(400);
    await shot('08-add-payment-dialog');
    await fill('#pa-amt', '200'); await click('dialog button[type=submit]'); await sleep(1000);
    const dv = (await dashVals()).join(' | ');
    check('Partial payment updates paid/remaining (200 / 300)', /200\.00/.test(dv) && /300\.00/.test(dv), dv);
    check('Debt status becomes "partially paid"', /جزئياً/.test(await text('section .badge') || ''));
    await click('[data-act=pay-new]'); await sleep(300);
    await ev(`document.querySelector('#pa-amt').removeAttribute('max')`); await fill('#pa-amt', '9999'); await click('dialog button[type=submit]'); await sleep(600);
    check('Overpayment is rejected', /exceeds/.test(await text('dialog .err') || ''));
    await click('dialog [data-x]'); await sleep(300);
    await shot('09-debt-detail');
    await click('[data-act=pay-void]'); await sleep(300); await click('dialog button[type=submit]'); await sleep(900);
    check('Voiding a payment restores the remaining balance', /500\.00/.test((await dashVals()).join(' ')));

    /* ---------- 5. Reports ---------- */
    await go('#/reports');
    await shot('10-reports');
    await fill('#f-status', 'overdue'); await ev(`document.querySelector('#filters').requestSubmit()`); await sleep(900);
    const od = await ev(`document.querySelectorAll('tbody tr').length`);
    check('Report filter "overdue" returns only overdue debts', od >= 1 && od < 6, String(od));
    const csv = await ev(`Local.handle('GET','/export/debts.csv').then(r=>r.text())`);
    check('CSV export contains header and data rows', /Party,Type/.test(csv) && csv.split('\r\n').length >= 3, csv.split('\r\n').length + ' lines');

    /* ---------- 6. Settings & admin ---------- */
    await go('#/settings'); await shot('11-settings');
    await fill('#s-name', 'يوسف (E2E)'); await ev(`document.querySelector('#f-prof').requestSubmit()`); await sleep(900);
    check('Profile update works (toast shown)', !!(await text('.toast')));
    await fill('#s-cp', 'wrong'); await fill('#s-np', 'NewPass12345'); await ev(`document.querySelector('#f-pw').requestSubmit()`); await sleep(800);
    check('Wrong current password is rejected', /incorrect/.test(await text('#f-pw .err') || ''));
    await go('#/admin');
    check('Admin page lists users and audit log', (await ev(`document.querySelectorAll('tbody')[0]?.children.length`)) >= 2 && (await ev(`document.querySelectorAll('tbody')[1]?.children.length`)) > 5);
    await shot('12-admin');

    /* ---------- 7. Theme / language ---------- */
    await go('#/');
    await click('[data-act=theme]'); await sleep(500);
    check('Dark mode toggles', (await ev(`document.documentElement.dataset.theme`)) === 'dark');
    await shot('13-dashboard-ar-dark');
    await click('[data-act=lang]'); await sleep(700);
    check('Language switches to English / LTR', (await ev(`document.documentElement.dir`)) === 'ltr' && /Dashboard/.test(await text('h1') || ''));
    await shot('14-dashboard-en-dark');
    await click('[data-act=theme]'); await sleep(400);

    /* ---------- 8. Mobile ---------- */
    await viewport(390, 844, true);
    await go('#/');
    check('Mobile: no horizontal scroll on dashboard', await ev(`document.documentElement.scrollWidth<=innerWidth`));
    check('Mobile: bottom navigation visible', await ev(`getComputedStyle(document.querySelector('.bottom')).display!=='none'`));
    await shot('15-mobile-dashboard');
    await go('#/debts'); await shot('16-mobile-debts');
    check('Mobile: no horizontal scroll on debts', await ev(`document.documentElement.scrollWidth<=innerWidth`));
    await click('[data-act=debt-new]'); await sleep(400); await shot('17-mobile-add-debt'); await click('dialog [data-x]'); await sleep(300);

    /* ---------- 9. Accessibility spot checks ---------- */
    await viewport(1280, 800);
    await go('#/debts');
    const unlabeled = await ev(`[...document.querySelectorAll('input:not([type=hidden]),select,textarea')].filter(e=>!e.labels?.length && !e.getAttribute('aria-label')).length`);
    check('A11y: every form control has a label', unlabeled === 0, `${unlabeled} unlabeled`);
    const nameless = await ev(`[...document.querySelectorAll('button,a')].filter(e=>!(e.textContent.trim()||e.getAttribute('aria-label')||e.title)).length`);
    check('A11y: every button/link has an accessible name', nameless === 0, `${nameless} nameless`);
    check('A11y: skip link and landmarks present', await ev(`!!document.querySelector('.skip') && !!document.querySelector('main') && !!document.querySelector('nav[aria-label]')`));

    /* ---------- 10. Offline-first ---------- */
    await go('#/parties');
    await send('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
    await sleep(500);
    check('Offline: badge shows offline', await until(`document.querySelector('#syncbadge')?.className.includes('sync-off')`, 5000), await badge());
    await click('[data-act=party-new]'); await sleep(300); await fill('#p-name', 'طرف أُنشئ بدون إنترنت'); await click('dialog button[type=submit]'); await sleep(1000);
    check('Offline: new party is visible immediately', await ev(`[...document.querySelectorAll('a.item strong')].some(e=>e.textContent.includes('بدون إنترنت'))`));
    check('Offline: change is queued (pending = 1)', (await ev(`Local.pending()`)) === 1, await badge());
    await shot('18-offline-pending');
    await send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
    check('Back online: queue syncs automatically', await until(`Local.pending()===0 && document.querySelector('#syncbadge')?.className.includes('sync-ok')`, 40000), await badge());
    const onServer = await ev(`fetch('/api/sync',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+localStorage.token},body:'{"ops":[]}'}).then(r=>r.json()).then(s=>s.snapshot.parties.some(p=>p.name.includes('بدون إنترنت')))`);
    check('Back online: offline-created party exists on the server', onServer);
    await shot('19-synced');

    /* ---------- 10b. App shell offline (service worker) — kills the server for real ---------- */
    if (process.env.SERVER_PID) {
      check('Service worker is active and controls the page', await until(`!!navigator.serviceWorker.controller`, 10000));
      check('Service worker cached the app shell', await ev(`caches.open('dayn-shell-v1').then(c=>c.keys()).then(k=>k.length>=5)`));
      process.kill(Number(process.env.SERVER_PID)); await sleep(1500);
      check('Server is really down', await ev(`fetch('/api/me').then(()=>false,()=>true)`));
      await go('#/'); await send('Page.reload'); await sleep(2500);
      check('Server down: page still opens and shows local data after a reload', await until(`document.querySelectorAll('.stat .val').length>=3 && /\\d/.test(document.querySelector('.stat .val').textContent)`, 10000));
      await shot('20-server-down-reload');
    }

    /* ---------- 11. Logout ---------- */
    await click('[data-act=logout]'); await sleep(1200);
    check('Logout returns to the login page and clears local data', await ev(`!!document.querySelector('#auth') && !localStorage.token`));
  } finally {
    ws?.close(); proc.kill();
    await sleep(500); try { fs.rmSync(dir, { recursive: true, force: true }); } catch {}
  }

  const pass = results.filter(r => r.ok).length;
  const md = [`# E2E results`, '', `Run against \`${BASE}\` on ${new Date().toISOString().slice(0, 10)} — **${pass}/${results.length} passed**`, '',
    '| # | Check | Result | Detail |', '|---|---|---|---|', ...results.map((r, i) => `| ${i + 1} | ${r.name} | ${r.ok ? '✅ PASS' : '❌ FAIL'} | ${r.detail.replace(/\|/g, '/')} |`), ''].join('\n');
  fs.writeFileSync(path.join(__dirname, '..', 'docs', 'e2e-results.md'), md);
  console.log(`\n${pass}/${results.length} passed`);
  process.exitCode = pass === results.length ? 0 : 1;
}
main().catch(e => { console.error('E2E crashed:', e); process.exit(2); });
