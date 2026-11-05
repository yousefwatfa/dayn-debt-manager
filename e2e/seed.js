// Seeds demo data through the public API (base URL from BASE)
const base = process.env.BASE || 'http://localhost:3100';
const call = async (m, p, b, t) => {
  const r = await fetch(base + '/api' + p, { method: m, headers: { 'content-type': 'application/json', ...(t ? { authorization: 'Bearer ' + t } : {}) }, body: b ? JSON.stringify(b) : undefined });
  const d = await r.json(); if (!r.ok) throw new Error(p + ' ' + JSON.stringify(d)); return d;
};
const day = n => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
(async () => {
  const { token: t } = await call('POST', '/auth/register', { name: 'يوسف', email: 'demo@dayn.test', password: 'Demo12345' });
  await call('POST', '/auth/register', { name: 'Second User', email: 'user2@dayn.test', password: 'Demo12345' });
  const P = async (name, phone) => (await call('POST', '/parties', { name, phone }, t)).id;
  const ahmad = await P('أحمد علي', '+970 599 123 456'), nour = await P('متجر النور', '+970 59 555 0101');
  const sara = await P('سارة محمود', '+966 50 123 4567'), glob = await P('Global Supplies Ltd', '+44 20 7946 0000');
  const D = async b => (await call('POST', '/debts', b, t));
  const d1 = await D({ party_id: ahmad, type: 'given', total_amount: 1500, currency: 'USD', issue_date: day(-60), due_date: day(-10), notes: 'قرض شخصي' });
  const d2 = await D({ party_id: nour, type: 'taken', total_amount: 800, currency: 'USD', issue_date: day(-20), due_date: day(4), notes: 'بضاعة بالآجل' });
  const d3 = await D({ party_id: sara, type: 'given', total_amount: 3200, currency: 'SAR', issue_date: day(-30), due_date: day(20) });
  const d4 = await D({ party_id: glob, type: 'taken', total_amount: 2400, currency: 'USD', issue_date: day(-90), due_date: day(-45), notes: 'Invoice #2291' });
  const d5 = await D({ party_id: ahmad, type: 'given', total_amount: 300, currency: 'USD', issue_date: day(-5), due_date: day(10) });
  await call('POST', `/debts/${d1.id}/payments`, { amount: 500, payment_date: day(-30), payment_method: 'bank' }, t);
  await call('POST', `/debts/${d4.id}/payments`, { amount: 2400, payment_date: day(-40), payment_method: 'bank' }, t);
  await call('POST', `/debts/${d3.id}/payments`, { amount: 1000, payment_date: day(-3), payment_method: 'cash', notes: 'دفعة أولى' }, t);
  console.log('seeded');
})().catch(e => { console.error(e); process.exit(1); });
