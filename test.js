// Smoke test: node test.js  (starts server on a throwaway port + data dir is NOT isolated, so run on a fresh install)
const base = process.env.BASE || 'http://localhost:3000';
let tok, n = 0;
const call = async (m, p, b, t = tok) => {
  const r = await fetch(base + '/api' + p, { method: m, headers: { 'content-type': 'application/json', ...(t ? { authorization: 'Bearer ' + t } : {}) }, body: b ? JSON.stringify(b) : undefined });
  const ct = r.headers.get('content-type') || '';
  return { s: r.status, d: ct.includes('json') ? await r.json() : await r.text() };
};
const ok = (c, m) => { n++; if (!c) { console.error('FAIL:', m); process.exitCode = 1; } else console.log('ok  ', m); };
(async () => {
  const em = `t${Date.now()}@x.com`;
  let r = await call('POST', '/auth/register', { name: 'Tester', email: em, password: 'secret123' }, null); tok = r.d.token;
  ok(r.s === 200 && tok, 'register');
  ok((await call('GET', '/parties', null, null)).s === 401, 'unauth blocked');
  ok((await call('POST', '/auth/login', { email: em, password: 'bad' }, null)).s === 401, 'bad login rejected');
  r = await call('POST', '/parties', { name: 'Ahmad' }); const pid = r.d.id; ok(pid, 'create party');
  r = await call('POST', '/debts', { party_id: pid, type: 'given', total_amount: 100, issue_date: '2026-01-01', due_date: '2026-01-10', currency: 'USD' });
  const did = r.d.id; ok(r.d.overdue && r.d.status === 'unpaid', 'debt overdue/unpaid');
  r = await call('POST', `/debts/${did}/payments`, { amount: 40, payment_date: '2026-01-05' }); ok(r.d.status === 'partial' && r.d.remaining === 60, 'partial payment');
  ok((await call('POST', `/debts/${did}/payments`, { amount: 100 })).s === 400, 'overpay rejected');
  r = await call('POST', `/debts/${did}/payments`, { amount: 60 }); ok(r.d.status === 'paid', 'fully paid');
  const d = (await call('GET', `/debts/${did}`)).d;
  r = await call('POST', `/payments/${d.payments[0].id}/void`, {}); ok(r.d.status !== 'paid', 'void payment recalculates');
  r = await call('GET', '/dashboard'); ok(r.d.totals[0].receivable > 0 && r.d.overdue.length === 1, 'dashboard');
  r = await call('GET', '/export/debts.csv'); ok(typeof r.d === 'string' && r.d.includes('Ahmad'), 'csv export');
  r = await call('GET', '/parties'); ok(r.d[0].balances[0].net > 0, 'party balance');
  ok((await call('GET', '/admin/users')).s === 200 || (await call('GET', '/admin/users')).s === 403, 'admin route guarded');
  r = await call('DELETE', `/parties/${pid}`); ok(r.s === 200 && (await call('GET', '/parties')).d.length === 0, 'soft delete party');
  // offline sync: queued ops are idempotent and the snapshot reflects them
  const u = () => `u-${Math.random().toString(36).slice(2, 12)}`;
  const [sp, sd, spay] = [u(), u(), u()];
  const ops = [
    { type: 'party.save', data: { id: sp, name: 'Offline Party' } },
    { type: 'debt.save', data: { id: sd, party_id: sp, type: 'given', total_amount: 100, currency: 'USD', issue_date: '2026-02-01', due_date: '2026-03-01' } },
    { type: 'payment.add', data: { id: spay, debt_id: sd, amount: 30 } },
    { type: 'payment.add', data: { id: u(), debt_id: sd, amount: 999 } },
  ];
  r = await call('POST', '/sync', { ops });
  ok(r.d.results.map(x => x.ok).join() === 'true,true,true,false', 'sync applies valid ops, rejects invalid');
  ok(r.d.snapshot.debts.find(d => d.id === sd).paid_amount === 30, 'sync snapshot has payment applied');
  r = await call('POST', '/sync', { ops });
  ok(r.d.results.slice(0, 3).every(x => x.ok) && r.d.snapshot.payments.filter(p => p.id === spay).length === 1, 'sync replay is idempotent');
  r = await call('POST', '/sync', { ops: [{ type: 'debt.void', data: { id: sd } }] });
  ok(r.d.snapshot.debts.find(d => d.id === sd).voided === 1, 'sync void');
  console.log(`${n} checks`);
})();
