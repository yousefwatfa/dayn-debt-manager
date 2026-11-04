'use strict';
/* Offline-first data layer.
   - Every record has a client-generated id, so work done offline can be pushed idempotently.
   - Reads and writes happen against a local copy (IndexedDB); writes are queued in an outbox.
   - sync() pushes the outbox to /api/sync, then replaces the local copy with the server snapshot
     and replays any operations queued meanwhile. */
const Local = (() => {
  const cfg = { token: () => null, onUnauthorized() {}, onStatus() {}, onData() {} };
  let uid = null, D = empty(), outbox = [], syncing = false, lastSync = null, lastError = '', timer = null, netDown = false;

  function empty() { return { parties: [], debts: [], payments: [] }; }

  /* ---- storage: IndexedDB with in-memory fallback ---- */
  const mem = new Map();
  const dbp = new Promise(res => {
    try {
      const r = indexedDB.open('dayn', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('kv');
      r.onsuccess = () => res(r.result);
      r.onerror = () => res(null);
    } catch { res(null); }
  });
  async function kv(mode, fn) {
    const db = await dbp; if (!db) return undefined;
    return new Promise(res => { try { const rq = fn(db.transaction('kv', mode).objectStore('kv')); rq.onsuccess = () => res(rq.result); rq.onerror = () => res(undefined); } catch { res(undefined); } });
  }
  const key = k => `u${uid}:${k}`;
  const kget = async k => (await kv('readonly', s => s.get(key(k)))) ?? mem.get(key(k));
  const kset = async (k, v) => { mem.set(key(k), v); await kv('readwrite', s => s.put(v, key(k))); };
  const kdel = async k => { mem.delete(key(k)); await kv('readwrite', s => s.delete(key(k))); };
  const persist = () => Promise.all([kset('data', D), kset('outbox', outbox)]);

  /* ---- helpers ---- */
  const r2 = n => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
  const today = () => new Date().toISOString().slice(0, 10);
  const isDate = v => /^\d{4}-\d{2}-\d{2}$/.test(v || '') && !isNaN(Date.parse(v));
  const str = (v, max = 500) => String(v ?? '').trim().slice(0, max);
  const newId = () => (crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10));
  const fail = m => { throw new Error(m); };
  const statusOf = (total, paid) => paid <= 0 ? 'unpaid' : paid + 0.004 >= total ? 'paid' : 'partial';
  const party = id => D.parties.find(p => p.id === id && !p.deleted_at);
  const debt = id => D.debts.find(d => d.id === id);

  function recalc(d) {
    d.paid_amount = r2(D.payments.filter(p => p.debt_id === d.id && !p.voided).reduce((s, p) => s + p.amount, 0));
    d.status = statusOf(d.total_amount, d.paid_amount);
  }
  function decorate(d) {
    const p = D.parties.find(x => x.id === d.party_id);
    return { ...d, party_name: p ? p.name : '', remaining: r2(d.total_amount - d.paid_amount),
      overdue: !d.voided && d.status !== 'paid' && !!d.due_date && d.due_date < today() };
  }

  /* ---- operations (shared by optimistic apply and replay after sync) ---- */
  function apply(op) {
    const x = op.data;
    switch (op.type) {
      case 'party.save': {
        const name = str(x.name, 120); if (!name) fail('Name is required');
        const f = { name, phone: str(x.phone, 40), email: str(x.email, 200), address: str(x.address, 300), notes: str(x.notes, 1000) };
        const ex = party(x.id);
        if (ex) Object.assign(ex, f); else D.parties.push({ id: x.id, ...f, deleted_at: null, created_at: new Date().toISOString() });
        return;
      }
      case 'party.delete': { const p = party(x.id); if (p) p.deleted_at = new Date().toISOString(); return; }
      case 'debt.save': {
        const amount = r2(x.total_amount);
        if (!(amount > 0)) fail('Amount must be greater than zero');
        if (!['given', 'taken'].includes(x.type)) fail('Invalid type');
        if (!isDate(x.issue_date)) fail('Invalid issue date');
        if (x.due_date && !isDate(x.due_date)) fail('Invalid due date');
        if (x.due_date && x.due_date < x.issue_date) fail('Due date cannot be before issue date');
        if (!party(x.party_id)) fail('Party not found');
        const ex = debt(x.id);
        if (ex && ex.voided) fail('Voided debts cannot be edited');
        if (ex && amount + 0.004 < ex.paid_amount) fail('Amount cannot be lower than what is already paid');
        const f = { party_id: x.party_id, type: x.type, total_amount: amount, currency: /^[A-Z]{3}$/.test(x.currency) ? x.currency : 'USD', issue_date: x.issue_date, due_date: x.due_date || null, notes: str(x.notes, 1000) };
        if (x.attachment) f.attachment_name = str(x.attachment.name, 150) || 'attachment';
        if (ex) { Object.assign(ex, f); recalc(ex); }
        else D.debts.push({ id: x.id, ...f, paid_amount: 0, status: 'unpaid', attachment_name: f.attachment_name || '', voided: 0, created_at: new Date().toISOString() });
        return;
      }
      case 'debt.void': { const d = debt(x.id); if (!d) fail('Debt not found'); d.voided = 1; return; }
      case 'payment.add': {
        const d = debt(x.debt_id); if (!d) fail('Debt not found');
        if (D.payments.some(p => p.id === x.id)) return;
        if (d.voided) fail('Debt is voided');
        const amount = r2(x.amount);
        if (!(amount > 0)) fail('Amount must be greater than zero');
        if (amount > r2(d.total_amount - d.paid_amount) + 0.004) fail('Payment exceeds the remaining balance');
        D.payments.push({ id: x.id, debt_id: d.id, amount, payment_date: isDate(x.payment_date) ? x.payment_date : today(),
          payment_method: ['cash', 'bank', 'card', 'wallet', 'other'].includes(x.payment_method) ? x.payment_method : 'cash', notes: str(x.notes, 500), voided: 0, created_at: new Date().toISOString() });
        recalc(d); return;
      }
      case 'payment.void': {
        const p = D.payments.find(p => p.id === x.id); if (!p) fail('Payment not found');
        p.voided = 1; const d = debt(p.debt_id); if (d) recalc(d); return;
      }
      default: fail('Unknown operation');
    }
  }

  async function write(type, data, attachment) {
    const op = { type, data: { ...data } };
    const before = JSON.stringify(D);
    try { apply(op); } catch (e) { D = JSON.parse(before); throw e; }     // validate + apply locally first
    if (attachment) { op.data.attachment = attachment; await kset('att:' + op.data.id, attachment); }
    outbox.push(op);
    await persist(); emitStatus(); cfg.onData(false); schedule();
  }

  /* ---- queries (same shapes the REST API used to return) ---- */
  function partyBalances(pid) {
    const b = {};
    D.debts.filter(d => d.party_id === pid && !d.voided && d.status !== 'paid').forEach(d => { b[d.currency] = r2((b[d.currency] || 0) + (d.type === 'given' ? 1 : -1) * (d.total_amount - d.paid_amount)); });
    return Object.entries(b).map(([currency, net]) => ({ currency, net }));
  }
  function filterDebts(qs) {
    const st = qs.get('status'), t = today();
    return D.debts.filter(d => !d.voided && party(d.party_id) &&
      (!qs.get('party_id') || d.party_id === qs.get('party_id')) && (!qs.get('type') || d.type === qs.get('type')) &&
      (!qs.get('from') || d.issue_date >= qs.get('from')) && (!qs.get('to') || d.issue_date <= qs.get('to')) &&
      (!st || (st === 'overdue' ? d.status !== 'paid' && d.due_date && d.due_date < t : d.status === st)))
      .sort((a, b) => b.issue_date.localeCompare(a.issue_date) || (b.created_at || '').localeCompare(a.created_at || '')).map(decorate);
  }
  function summary() {
    const by = {};
    D.debts.filter(d => !d.voided && d.status !== 'paid' && party(d.party_id)).forEach(d => {
      const c = by[d.currency] ||= { currency: d.currency, receivable: 0, payable: 0, net: 0 };
      c[d.type === 'given' ? 'receivable' : 'payable'] = r2(c[d.type === 'given' ? 'receivable' : 'payable'] + d.total_amount - d.paid_amount);
    });
    Object.values(by).forEach(c => c.net = r2(c.receivable - c.payable));
    const t = today(), soon = new Date(Date.now() + 7 * 86400e3).toISOString().slice(0, 10);
    const open = D.debts.filter(d => !d.voided && d.status !== 'paid' && d.due_date && party(d.party_id));
    const byDue = (a, b) => a.due_date.localeCompare(b.due_date);
    const live = D.debts.filter(d => !d.voided);
    return { totals: Object.values(by), overdue: open.filter(d => d.due_date < t).sort(byDue).map(decorate),
      upcoming: open.filter(d => d.due_date >= t && d.due_date <= soon).sort(byDue).map(decorate),
      counts: { total: live.length, paid: live.filter(d => d.status === 'paid').length }, parties: D.parties.filter(p => !p.deleted_at).length };
  }
  const csvCell = v => { let s = String(v ?? ''); if (/^[=+\-@]/.test(s)) s = "'" + s; return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  function csv(qs) {
    const head = ['ID', 'Party', 'Type', 'Currency', 'Total', 'Paid', 'Remaining', 'Status', 'Issue date', 'Due date', 'Notes'];
    const rows = filterDebts(qs).sort((a, b) => a.issue_date.localeCompare(b.issue_date)).map(d => [d.id, d.party_name, d.type === 'given' ? 'Receivable' : 'Payable', d.currency, d.total_amount, d.paid_amount, d.remaining, d.overdue ? 'overdue' : d.status, d.issue_date, d.due_date || '', d.notes]);
    return '﻿' + [head, ...rows].map(r => r.map(csvCell).join(',')).join('\r\n');
  }

  /* ---- request router: mimics the REST endpoints the UI already calls ---- */
  async function handle(method, rawPath, body = {}, raw) {
    const u = new URL(rawPath, 'http://x'), seg = u.pathname.split('/').filter(Boolean), qs = u.searchParams, [a, id, sub] = seg;
    const dec = i => decorate(debt(i));
    if (a === 'dashboard') return summary();
    if (a === 'export') return new Response(new Blob([csv(qs)], { type: 'text/csv;charset=utf-8' }));
    if (a === 'parties') {
      if (!id && method === 'GET') return D.parties.filter(p => !p.deleted_at).sort((x, y) => x.name.localeCompare(y.name)).map(p => ({ ...p, balances: partyBalances(p.id) }));
      if (!id && method === 'POST') { const pid = newId(); await write('party.save', { ...body, id: pid }); return party(pid); }
      const p = party(id); if (!p) fail('Not found');
      if (method === 'GET') return { ...p, debts: D.debts.filter(d => d.party_id === id && !d.voided).sort((x, y) => y.issue_date.localeCompare(x.issue_date)).map(decorate), balances: partyBalances(id) };
      if (method === 'PUT') { await write('party.save', { ...body, id }); return party(id); }
      if (method === 'DELETE') { await write('party.delete', { id }); return { ok: true }; }
    }
    if (a === 'debts') {
      if (!id && method === 'GET') return filterDebts(qs);
      if (!id && method === 'POST') { const did = newId(); await write('debt.save', { ...body, id: did }, body.attachment); return dec(did); }
      if (!debt(id)) fail('Not found');
      if (!sub && method === 'GET') return { ...dec(id), payments: D.payments.filter(p => p.debt_id === id).sort((x, y) => y.payment_date.localeCompare(x.payment_date)) };
      if (!sub && method === 'PUT') { await write('debt.save', { ...body, id }, body.attachment); return dec(id); }
      if (sub === 'void') { await write('debt.void', { id, reason: body.reason }); return { ok: true }; }
      if (sub === 'payments') { await write('payment.add', { ...body, id: newId(), debt_id: id }); return dec(id); }
      if (sub === 'attachment') return attachment(id);
    }
    if (a === 'payments' && sub === 'void') {
      const p = D.payments.find(p => p.id === id); if (!p) fail('Not found');
      await write('payment.void', { id, reason: body.reason }); return dec(p.debt_id);
    }
    fail('Not found');
  }
  async function attachment(id) {
    const pending = await kget('att:' + id);
    if (pending) { const bin = atob(pending.data.split(',')[1]), buf = Uint8Array.from(bin, c => c.charCodeAt(0)); return new Response(new Blob([buf], { type: pending.data.slice(5, pending.data.indexOf(';')) })); }
    if (!navigator.onLine) fail('Attachment is not available offline');
    const r = await fetch('/api/attachments/' + encodeURIComponent(id), { headers: { authorization: 'Bearer ' + cfg.token() } });
    if (!r.ok) fail('Attachment not found');
    return r;
  }

  /* ---- sync ---- */
  const status = () => ({ online: navigator.onLine && !netDown, syncing, pending: outbox.length, error: lastError, lastSync });
  const emitStatus = () => cfg.onStatus(status());
  function schedule(ms = 400) { clearTimeout(timer); timer = setTimeout(() => sync().catch(() => {}), ms); }

  async function sync() {
    if (syncing || uid == null || !navigator.onLine || !cfg.token()) return false;
    syncing = true; lastError = ''; emitStatus();
    const rejected = [];
    try {
      for (let guard = 0; guard < 20; guard++) {
        // take as many queued ops as fit a ~3 MB request (Vercel's limit is 4.5 MB)
        const batch = []; let size = 0;
        for (const op of outbox) { const n = JSON.stringify(op).length; if (batch.length && size + n > 3e6) break; batch.push(op); size += n; }
        const r = await fetch('/api/sync', { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + cfg.token() }, body: JSON.stringify({ ops: batch }) })
          .catch(() => { throw Object.assign(new Error('offline'), { net: true }); });
        if (r.status === 401) { cfg.onUnauthorized(); return false; }
        const out = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(out.error || 'Sync failed');
        batch.forEach((op, i) => { if (!out.results[i].ok) rejected.push(out.results[i].error); else if (op.data.attachment) kdel('att:' + op.data.id); });
        outbox.splice(0, batch.length);
        // server snapshot + ops queued while the request was in flight
        const old = JSON.stringify(D);
        D = { parties: out.snapshot.parties, debts: out.snapshot.debts, payments: out.snapshot.payments };
        outbox = outbox.filter(op => { try { apply(op); return true; } catch { rejected.push('Dropped a change that no longer applies'); return false; } });
        await persist();
        lastSync = new Date().toISOString(); await kset('lastSync', lastSync);
        cfg.onData(JSON.stringify(D) !== old);
        if (!outbox.length) break;
      }
      if (rejected.length) cfg.onRejected?.(rejected);
      netDown = false;
      return true;
    } catch (e) {
      if (e.net) { netDown = true; lastError = ''; schedule(15000); }   // server unreachable: behave as offline, retry soon
      else lastError = e.message || 'Sync failed';
      return false;
    }
    finally { syncing = false; emitStatus(); }
  }

  addEventListener('online', () => { emitStatus(); schedule(300); });
  addEventListener('offline', emitStatus);
  setInterval(() => { if (navigator.onLine) sync().catch(() => {}); }, 60000);

  return {
    configure(c) { Object.assign(cfg, c); },
    async init(userId) {
      uid = userId; D = (await kget('data')) || empty(); outbox = (await kget('outbox')) || []; lastSync = (await kget('lastSync')) || null;
      lastError = ''; emitStatus();
    },
    neverSynced: () => !lastSync,
    handle, sync, status,
    async clear() { for (const k of ['data', 'outbox', 'lastSync']) await kdel(k); D = empty(); outbox = []; lastSync = null; uid = null; },
    pending: () => outbox.length,
  };
})();
