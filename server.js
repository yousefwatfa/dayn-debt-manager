'use strict';
// Debt Management App - zero-dependency Node server (node:http + node:sqlite)
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const PUBLIC_DIR = path.join(__dirname, 'public');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ---------- secret ----------
const SECRET_FILE = path.join(DATA_DIR, 'jwt.secret');
if (!fs.existsSync(SECRET_FILE)) fs.writeFileSync(SECRET_FILE, crypto.randomBytes(48).toString('hex'));
const SECRET = process.env.JWT_SECRET || fs.readFileSync(SECRET_FILE, 'utf8');

// ---------- db ----------
const db = new DatabaseSync(path.join(DATA_DIR, 'debts.db'));
db.exec(`
PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'user', currency TEXT NOT NULL DEFAULT 'USD',
  phone TEXT DEFAULT '', active INTEGER NOT NULL DEFAULT 1,
  tg_token TEXT DEFAULT '', tg_chat TEXT DEFAULT '', notify_freq TEXT DEFAULT 'off', last_notified TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS parties(
  id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL REFERENCES users(id),
  name TEXT NOT NULL, phone TEXT DEFAULT '', email TEXT DEFAULT '', address TEXT DEFAULT '', notes TEXT DEFAULT '',
  deleted_at TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_parties_user ON parties(user_id);
CREATE TABLE IF NOT EXISTS debts(
  id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL REFERENCES users(id),
  party_id INTEGER NOT NULL REFERENCES parties(id), type TEXT NOT NULL CHECK(type IN('given','taken')),
  total_amount REAL NOT NULL, paid_amount REAL NOT NULL DEFAULT 0, currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'unpaid', issue_date TEXT NOT NULL, due_date TEXT, notes TEXT DEFAULT '',
  attachment_name TEXT DEFAULT '', attachment_file TEXT DEFAULT '', voided INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_debts_user ON debts(user_id);
CREATE INDEX IF NOT EXISTS idx_debts_party ON debts(party_id);
CREATE INDEX IF NOT EXISTS idx_debts_due ON debts(due_date);
CREATE TABLE IF NOT EXISTS payments(
  id INTEGER PRIMARY KEY AUTOINCREMENT, debt_id INTEGER NOT NULL REFERENCES debts(id),
  amount REAL NOT NULL, payment_date TEXT NOT NULL, payment_method TEXT DEFAULT 'cash', notes TEXT DEFAULT '',
  voided INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_payments_debt ON payments(debt_id);
CREATE TABLE IF NOT EXISTS audit_logs(
  id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, action TEXT NOT NULL, entity TEXT, entity_id INTEGER,
  details TEXT DEFAULT '', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
`);

const q = (sql, ...p) => db.prepare(sql).all(...p);
const q1 = (sql, ...p) => db.prepare(sql).get(...p);
const run = (sql, ...p) => db.prepare(sql).run(...p);
const r2 = n => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
const today = () => new Date().toISOString().slice(0, 10);
const audit = (uid, action, entity, id, details) =>
  run('INSERT INTO audit_logs(user_id,action,entity,entity_id,details) VALUES(?,?,?,?,?)', uid, action, entity, id, details ? JSON.stringify(details) : '');

// ---------- auth helpers ----------
const b64u = b => Buffer.from(b).toString('base64url');
function signJwt(payload) {
  const h = b64u(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const b = b64u(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 7 * 86400 }));
  const s = crypto.createHmac('sha256', SECRET).update(h + '.' + b).digest('base64url');
  return `${h}.${b}.${s}`;
}
function verifyJwt(t) {
  const [h, b, s] = String(t || '').split('.');
  if (!s) return null;
  const e = crypto.createHmac('sha256', SECRET).update(h + '.' + b).digest('base64url');
  if (e.length !== s.length || !crypto.timingSafeEqual(Buffer.from(e), Buffer.from(s))) return null;
  try { const p = JSON.parse(Buffer.from(b, 'base64url')); return p.exp > Date.now() / 1000 ? p : null; } catch { return null; }
}
function hashPw(pw) {
  const salt = crypto.randomBytes(16);
  const k = crypto.scryptSync(pw, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$${salt.toString('hex')}$${k.toString('hex')}`;
}
function checkPw(pw, stored) {
  const [, salt, key] = stored.split('$');
  const k = crypto.scryptSync(pw, Buffer.from(salt, 'hex'), 64, { N: 16384, r: 8, p: 1 });
  return crypto.timingSafeEqual(k, Buffer.from(key, 'hex'));
}
const attempts = new Map(); // simple login throttle
function throttled(ip) {
  const now = Date.now(), a = (attempts.get(ip) || []).filter(t => now - t < 15 * 60e3);
  attempts.set(ip, a); return a.length >= 10;
}

// ---------- validation ----------
class HttpError extends Error { constructor(s, m) { super(m); this.status = s; } }
const bad = m => new HttpError(400, m);
const str = (v, max = 500) => String(v ?? '').trim().slice(0, max);
const isDate = v => /^\d{4}-\d{2}-\d{2}$/.test(v || '') && !isNaN(Date.parse(v));
const CUR = /^[A-Z]{3}$/;
const publicUser = u => ({ id: u.id, name: u.name, email: u.email, role: u.role, currency: u.currency, phone: u.phone,
  tg_chat: u.tg_chat, tg_set: !!u.tg_token, notify_freq: u.notify_freq, created_at: u.created_at });

function statusOf(total, paid) { return paid <= 0 ? 'unpaid' : paid + 0.004 >= total ? 'paid' : 'partial'; }
function recalc(debtId) {
  const d = q1('SELECT total_amount FROM debts WHERE id=?', debtId);
  const paid = r2(q1('SELECT COALESCE(SUM(amount),0) s FROM payments WHERE debt_id=? AND voided=0', debtId).s);
  run('UPDATE debts SET paid_amount=?, status=? WHERE id=?', paid, statusOf(d.total_amount, paid), debtId);
}
const decorate = d => ({ ...d, remaining: r2(d.total_amount - d.paid_amount),
  overdue: !d.voided && d.status !== 'paid' && !!d.due_date && d.due_date < today() });

function ownDebt(uid, id) {
  const d = q1('SELECT d.*, p.name party_name FROM debts d JOIN parties p ON p.id=d.party_id WHERE d.id=? AND d.user_id=?', id, uid);
  if (!d) throw new HttpError(404, 'Not found');
  return d;
}
function ownParty(uid, id) {
  const p = q1('SELECT * FROM parties WHERE id=? AND user_id=? AND deleted_at IS NULL', id, uid);
  if (!p) throw new HttpError(404, 'Not found');
  return p;
}

function debtFilter(uid, qs) {
  let w = 'd.user_id=? AND d.voided=0', a = [uid];
  if (qs.get('party_id')) { w += ' AND d.party_id=?'; a.push(Number(qs.get('party_id'))); }
  if (qs.get('type')) { w += ' AND d.type=?'; a.push(qs.get('type')); }
  if (qs.get('from')) { w += ' AND d.issue_date>=?'; a.push(qs.get('from')); }
  if (qs.get('to')) { w += ' AND d.issue_date<=?'; a.push(qs.get('to')); }
  const st = qs.get('status');
  if (st === 'overdue') { w += " AND d.status!='paid' AND d.due_date IS NOT NULL AND d.due_date<?"; a.push(today()); }
  else if (st) { w += ' AND d.status=?'; a.push(st); }
  if (qs.get('voided') === '1') w = w.replace('d.voided=0', '1=1');
  return [w, a];
}

function summary(uid) {
  const rows = q(`SELECT type, currency, SUM(total_amount-paid_amount) rem FROM debts WHERE user_id=? AND voided=0 AND status!='paid' GROUP BY type, currency`, uid);
  const by = {};
  for (const r of rows) {
    const c = by[r.currency] ||= { currency: r.currency, receivable: 0, payable: 0, net: 0 };
    c[r.type === 'given' ? 'receivable' : 'payable'] = r2(r.rem);
  }
  Object.values(by).forEach(c => c.net = r2(c.receivable - c.payable));
  const t = today(), soon = new Date(Date.now() + 7 * 86400e3).toISOString().slice(0, 10);
  const base = `SELECT d.*, p.name party_name FROM debts d JOIN parties p ON p.id=d.party_id WHERE d.user_id=? AND d.voided=0 AND d.status!='paid' AND d.due_date`;
  return {
    totals: Object.values(by),
    overdue: q(base + '<? ORDER BY d.due_date', uid, t).map(decorate),
    upcoming: q(base + '>=? AND d.due_date<=? ORDER BY d.due_date', uid, t, soon).map(decorate),
    counts: q1(`SELECT COUNT(*) total, SUM(status='paid') paid FROM debts WHERE user_id=? AND voided=0`, uid),
    parties: q1('SELECT COUNT(*) n FROM parties WHERE user_id=? AND deleted_at IS NULL', uid).n,
  };
}

// ---------- telegram ----------
async function sendTelegram(u, text) {
  if (!u.tg_token || !u.tg_chat) throw bad('Telegram not configured');
  const r = await fetch(`https://api.telegram.org/bot${u.tg_token}/sendMessage`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: u.tg_chat, text }) });
  if (!r.ok) throw bad('Telegram rejected the message (check token / chat id)');
}
function summaryText(u) {
  const s = summary(u.id);
  const lines = ['📒 Debt summary'];
  s.totals.forEach(t => lines.push(`${t.currency}: to collect ${t.receivable} · to pay ${t.payable} · net ${t.net}`));
  if (s.overdue.length) { lines.push('', `⚠️ Overdue (${s.overdue.length}):`); s.overdue.slice(0, 10).forEach(d => lines.push(`• ${d.party_name}: ${d.remaining} ${d.currency} (due ${d.due_date})`)); }
  if (s.upcoming.length) { lines.push('', `⏰ Due within 7 days (${s.upcoming.length}):`); s.upcoming.slice(0, 10).forEach(d => lines.push(`• ${d.party_name}: ${d.remaining} ${d.currency} (due ${d.due_date})`)); }
  return lines.join('\n');
}
async function scheduler() {
  for (const u of q("SELECT * FROM users WHERE active=1 AND notify_freq!='off' AND tg_token!=''")) {
    const days = u.notify_freq === 'weekly' ? 7 : 1;
    if (u.last_notified && (Date.now() - Date.parse(u.last_notified)) < days * 86400e3 - 3600e3) continue;
    try { await sendTelegram(u, summaryText(u)); run('UPDATE users SET last_notified=? WHERE id=?', new Date().toISOString(), u.id); }
    catch (e) { console.error('notify failed', u.id, e.message); }
  }
}
setInterval(() => scheduler().catch(() => {}), 3600e3).unref();

// ---------- routes ----------
const routes = [];
const route = (method, pattern, handler, opts = {}) =>
  routes.push({ method, re: new RegExp('^' + pattern.replace(/:(\w+)/g, '(?<$1>[^/]+)') + '$'), handler, ...opts });
const csvCell = v => { let s = String(v ?? ''); if (/^[=+\-@]/.test(s)) s = "'" + s; return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };

// auth
route('POST', '/api/auth/register', ({ body, ip }) => {
  const name = str(body.name, 100), email = str(body.email, 200).toLowerCase(), pw = String(body.password || '');
  if (!name) throw bad('Name is required');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw bad('Invalid email');
  if (pw.length < 8) throw bad('Password must be at least 8 characters');
  if (q1('SELECT id FROM users WHERE email=?', email)) throw bad('Email already registered');
  const role = q1('SELECT COUNT(*) n FROM users').n === 0 ? 'admin' : 'user';
  const cur = CUR.test(body.currency) ? body.currency : 'USD';
  const id = Number(run('INSERT INTO users(name,email,password,role,currency) VALUES(?,?,?,?,?)', name, email, hashPw(pw), role, cur).lastInsertRowid);
  audit(id, 'register', 'user', id);
  return { token: signJwt({ uid: id }), user: publicUser(q1('SELECT * FROM users WHERE id=?', id)) };
}, { auth: false });

route('POST', '/api/auth/login', ({ body, ip }) => {
  if (throttled(ip)) throw new HttpError(429, 'Too many attempts, try again later');
  const u = q1('SELECT * FROM users WHERE email=?', str(body.email, 200).toLowerCase());
  if (!u || !checkPw(String(body.password || ''), u.password)) { attempts.get(ip).push(Date.now()); throw new HttpError(401, 'Invalid email or password'); }
  if (!u.active) throw new HttpError(403, 'Account disabled');
  audit(u.id, 'login', 'user', u.id);
  return { token: signJwt({ uid: u.id }), user: publicUser(u) };
}, { auth: false });

route('GET', '/api/me', ({ user }) => publicUser(user));
route('PUT', '/api/me', ({ user, body }) => {
  const name = str(body.name, 100) || user.name;
  const cur = CUR.test(body.currency) ? body.currency : user.currency;
  const freq = ['off', 'daily', 'weekly'].includes(body.notify_freq) ? body.notify_freq : user.notify_freq;
  const tok = body.tg_token === undefined ? user.tg_token : str(body.tg_token, 200);
  run('UPDATE users SET name=?, phone=?, currency=?, tg_chat=?, tg_token=?, notify_freq=? WHERE id=?',
    name, str(body.phone, 40), cur, str(body.tg_chat, 60), tok, freq, user.id);
  audit(user.id, 'update_profile', 'user', user.id);
  return publicUser(q1('SELECT * FROM users WHERE id=?', user.id));
});
route('PUT', '/api/me/password', ({ user, body }) => {
  if (!checkPw(String(body.current || ''), user.password)) throw bad('Current password is incorrect');
  if (String(body.password || '').length < 8) throw bad('Password must be at least 8 characters');
  run('UPDATE users SET password=? WHERE id=?', hashPw(body.password), user.id);
  audit(user.id, 'change_password', 'user', user.id);
  return { ok: true };
});
route('POST', '/api/notify/test', async ({ user }) => { await sendTelegram(user, summaryText(user)); return { ok: true }; });

// parties
route('GET', '/api/parties', ({ user }) => {
  const parties = q('SELECT * FROM parties WHERE user_id=? AND deleted_at IS NULL ORDER BY name COLLATE NOCASE', user.id);
  const bal = q(`SELECT party_id, type, currency, SUM(total_amount-paid_amount) rem FROM debts WHERE user_id=? AND voided=0 AND status!='paid' GROUP BY party_id,type,currency`, user.id);
  return parties.map(p => {
    const b = {};
    bal.filter(x => x.party_id === p.id).forEach(x => { b[x.currency] = r2((b[x.currency] || 0) + (x.type === 'given' ? x.rem : -x.rem)); });
    return { ...p, balances: Object.entries(b).map(([currency, net]) => ({ currency, net })) };
  });
});
route('POST', '/api/parties', ({ user, body }) => {
  const name = str(body.name, 120); if (!name) throw bad('Name is required');
  const id = Number(run('INSERT INTO parties(user_id,name,phone,email,address,notes) VALUES(?,?,?,?,?,?)', user.id, name, str(body.phone, 40), str(body.email, 200), str(body.address, 300), str(body.notes, 1000)).lastInsertRowid);
  audit(user.id, 'create', 'party', id, { name });
  return q1('SELECT * FROM parties WHERE id=?', id);
});
route('GET', '/api/parties/:id', ({ user, params }) => {
  const p = ownParty(user.id, params.id);
  const debts = q('SELECT d.*, ? party_name FROM debts d WHERE d.party_id=? AND d.user_id=? AND d.voided=0 ORDER BY d.issue_date DESC', p.name, p.id, user.id).map(decorate);
  const b = {};
  debts.filter(d => d.status !== 'paid').forEach(d => { b[d.currency] = r2((b[d.currency] || 0) + (d.type === 'given' ? d.remaining : -d.remaining)); });
  return { ...p, debts, balances: Object.entries(b).map(([currency, net]) => ({ currency, net })) };
});
route('PUT', '/api/parties/:id', ({ user, params, body }) => {
  const p = ownParty(user.id, params.id);
  run('UPDATE parties SET name=?, phone=?, email=?, address=?, notes=? WHERE id=?', str(body.name, 120) || p.name, str(body.phone, 40), str(body.email, 200), str(body.address, 300), str(body.notes, 1000), p.id);
  audit(user.id, 'update', 'party', p.id);
  return q1('SELECT * FROM parties WHERE id=?', p.id);
});
route('DELETE', '/api/parties/:id', ({ user, params }) => {
  const p = ownParty(user.id, params.id);
  run('UPDATE parties SET deleted_at=CURRENT_TIMESTAMP WHERE id=?', p.id);
  audit(user.id, 'soft_delete', 'party', p.id, { name: p.name });
  return { ok: true };
});

// debts
function saveAttachment(body) {
  if (!body.attachment || !body.attachment.data) return null;
  const m = /^data:([\w/+.-]+);base64,(.+)$/.exec(body.attachment.data);
  if (!m) throw bad('Invalid attachment');
  if (!/^(image\/(png|jpe?g|webp|gif)|application\/pdf)$/.test(m[1])) throw bad('Attachment must be an image or PDF');
  const buf = Buffer.from(m[2], 'base64');
  if (buf.length > 3 * 1024 * 1024) throw bad('Attachment must be under 3 MB');
  const file = crypto.randomUUID() + (m[1] === 'application/pdf' ? '.pdf' : '.' + m[1].split('/')[1].replace('jpeg', 'jpg'));
  fs.writeFileSync(path.join(UPLOAD_DIR, file), buf);
  return { file, name: str(body.attachment.name, 150) || file };
}
function debtFields(user, body) {
  const amount = r2(body.total_amount);
  if (!(amount > 0)) throw bad('Amount must be greater than zero');
  if (!['given', 'taken'].includes(body.type)) throw bad('Invalid type');
  if (!isDate(body.issue_date)) throw bad('Invalid issue date');
  if (body.due_date && !isDate(body.due_date)) throw bad('Invalid due date');
  if (body.due_date && body.due_date < body.issue_date) throw bad('Due date cannot be before issue date');
  ownParty(user.id, Number(body.party_id));
  return { amount, currency: CUR.test(body.currency) ? body.currency : user.currency };
}
route('GET', '/api/debts', ({ user, qs }) => {
  const [w, a] = debtFilter(user.id, qs);
  return q(`SELECT d.*, p.name party_name FROM debts d JOIN parties p ON p.id=d.party_id WHERE ${w} ORDER BY d.issue_date DESC, d.id DESC LIMIT 1000`, ...a).map(decorate);
});
route('POST', '/api/debts', ({ user, body }) => {
  const { amount, currency } = debtFields(user, body);
  const att = saveAttachment(body);
  const id = Number(run(`INSERT INTO debts(user_id,party_id,type,total_amount,currency,issue_date,due_date,notes,attachment_name,attachment_file) VALUES(?,?,?,?,?,?,?,?,?,?)`,
    user.id, Number(body.party_id), body.type, amount, currency, body.issue_date, body.due_date || null, str(body.notes, 1000), att?.name || '', att?.file || '').lastInsertRowid);
  audit(user.id, 'create', 'debt', id, { amount, currency, type: body.type });
  return decorate(ownDebt(user.id, id));
});
route('GET', '/api/debts/:id', ({ user, params }) => {
  const d = ownDebt(user.id, params.id);
  return { ...decorate(d), payments: q('SELECT * FROM payments WHERE debt_id=? ORDER BY payment_date DESC, id DESC', d.id) };
});
route('PUT', '/api/debts/:id', ({ user, params, body }) => {
  const d = ownDebt(user.id, params.id);
  if (d.voided) throw bad('Voided debts cannot be edited');
  const { amount, currency } = debtFields(user, body);
  if (amount + 0.004 < d.paid_amount) throw bad('Amount cannot be lower than what is already paid');
  const att = saveAttachment(body);
  run(`UPDATE debts SET party_id=?, type=?, total_amount=?, currency=?, issue_date=?, due_date=?, notes=?,
       attachment_name=COALESCE(?,attachment_name), attachment_file=COALESCE(?,attachment_file) WHERE id=?`,
    Number(body.party_id), body.type, amount, currency, body.issue_date, body.due_date || null, str(body.notes, 1000), att?.name ?? null, att?.file ?? null, d.id);
  recalc(d.id);
  audit(user.id, 'update', 'debt', d.id, { before: { total: d.total_amount, due: d.due_date, party: d.party_id }, after: { total: amount, due: body.due_date, party: body.party_id } });
  return decorate(ownDebt(user.id, d.id));
});
route('POST', '/api/debts/:id/void', ({ user, params, body }) => {
  const d = ownDebt(user.id, params.id);
  run('UPDATE debts SET voided=1 WHERE id=?', d.id);
  audit(user.id, 'void', 'debt', d.id, { reason: str(body.reason, 300) });
  return { ok: true };
});
route('GET', '/api/debts/:id/attachment', ({ user, params, res }) => {
  const d = ownDebt(user.id, params.id);
  if (!d.attachment_file) throw new HttpError(404, 'No attachment');
  const f = path.join(UPLOAD_DIR, path.basename(d.attachment_file));
  const ext = path.extname(f).slice(1);
  const type = ext === 'pdf' ? 'application/pdf' : 'image/' + (ext === 'jpg' ? 'jpeg' : ext);
  res.writeHead(200, { 'content-type': type, 'content-disposition': `inline; filename="${encodeURIComponent(d.attachment_name)}"`, 'x-content-type-options': 'nosniff' });
  res.end(fs.readFileSync(f)); return Symbol.for('handled');
});

// payments
route('POST', '/api/debts/:id/payments', ({ user, params, body }) => {
  const d = ownDebt(user.id, params.id);
  if (d.voided) throw bad('Debt is voided');
  const amount = r2(body.amount);
  if (!(amount > 0)) throw bad('Amount must be greater than zero');
  if (amount > r2(d.total_amount - d.paid_amount) + 0.004) throw bad('Payment exceeds the remaining balance');
  const date = isDate(body.payment_date) ? body.payment_date : today();
  const method = ['cash', 'bank', 'card', 'wallet', 'other'].includes(body.payment_method) ? body.payment_method : 'cash';
  const id = Number(run('INSERT INTO payments(debt_id,amount,payment_date,payment_method,notes) VALUES(?,?,?,?,?)', d.id, amount, date, method, str(body.notes, 500)).lastInsertRowid);
  recalc(d.id);
  audit(user.id, 'create', 'payment', id, { debt: d.id, amount });
  return decorate(ownDebt(user.id, d.id));
});
route('POST', '/api/payments/:id/void', ({ user, params, body }) => {
  const p = q1('SELECT p.* FROM payments p JOIN debts d ON d.id=p.debt_id WHERE p.id=? AND d.user_id=?', params.id, user.id);
  if (!p) throw new HttpError(404, 'Not found');
  run('UPDATE payments SET voided=1 WHERE id=?', p.id);
  recalc(p.debt_id);
  audit(user.id, 'void', 'payment', p.id, { amount: p.amount, reason: str(body.reason, 300) });
  return decorate(ownDebt(user.id, p.debt_id));
});

// dashboard & export
route('GET', '/api/dashboard', ({ user }) => summary(user.id));
route('GET', '/api/export/debts.csv', ({ user, qs, res }) => {
  const [w, a] = debtFilter(user.id, qs);
  const rows = q(`SELECT d.*, p.name party_name FROM debts d JOIN parties p ON p.id=d.party_id WHERE ${w} ORDER BY d.issue_date`, ...a).map(decorate);
  const head = ['ID', 'Party', 'Type', 'Currency', 'Total', 'Paid', 'Remaining', 'Status', 'Issue date', 'Due date', 'Notes'];
  const csv = '﻿' + [head, ...rows.map(d => [d.id, d.party_name, d.type === 'given' ? 'Receivable' : 'Payable', d.currency, d.total_amount, d.paid_amount, d.remaining, d.overdue ? 'overdue' : d.status, d.issue_date, d.due_date || '', d.notes])]
    .map(r => r.map(csvCell).join(',')).join('\r\n');
  res.writeHead(200, { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="debts.csv"' });
  res.end(csv); return Symbol.for('handled');
});

// admin
const admin = { admin: true };
route('GET', '/api/admin/users', () => q(`SELECT u.id,u.name,u.email,u.role,u.active,u.created_at,
  (SELECT COUNT(*) FROM debts WHERE user_id=u.id AND voided=0) debts FROM users u ORDER BY u.id`), admin);
route('PUT', '/api/admin/users/:id', ({ user, params, body }) => {
  const t = q1('SELECT * FROM users WHERE id=?', params.id);
  if (!t) throw new HttpError(404, 'Not found');
  if (t.id === user.id) throw bad('You cannot change your own role or status');
  const role = ['admin', 'user'].includes(body.role) ? body.role : t.role;
  const active = body.active === undefined ? t.active : (body.active === false || body.active === 0 ? 0 : 1);
  run('UPDATE users SET role=?, active=? WHERE id=?', role, active, t.id);
  audit(user.id, 'admin_update', 'user', t.id, { role, active: body.active });
  return { ok: true };
}, admin);
route('GET', '/api/admin/logs', () => q(`SELECT l.*, u.email FROM audit_logs l LEFT JOIN users u ON u.id=l.user_id ORDER BY l.id DESC LIMIT 300`), admin);

// ---------- http ----------
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.json': 'application/json' };
const SEC = {
  'content-security-policy': "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; frame-src 'self' blob:; object-src 'self' blob:; frame-ancestors 'none'",
  'x-content-type-options': 'nosniff', 'referrer-policy': 'no-referrer', 'x-frame-options': 'DENY',
};
const json = (res, status, data) => { res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', ...SEC }); res.end(JSON.stringify(data)); };

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => { size += c.length; if (size > 6e6) { reject(new HttpError(413, 'Payload too large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => { try { resolve(chunks.length ? JSON.parse(Buffer.concat(chunks)) : {}); } catch { reject(bad('Invalid JSON')); } });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  try {
    if (url.pathname.startsWith('/api/')) {
      const ip = req.socket.remoteAddress;
      const r = routes.find(r => r.method === req.method && r.re.test(url.pathname));
      if (!r) throw new HttpError(404, 'Not found');
      const params = url.pathname.match(r.re).groups || {};
      let user = null;
      if (r.auth !== false) {
        const p = verifyJwt((req.headers.authorization || '').replace(/^Bearer /, ''));
        user = p && q1('SELECT * FROM users WHERE id=? AND active=1', p.uid);
        if (!user) throw new HttpError(401, 'Unauthorized');
        if (r.admin && user.role !== 'admin') throw new HttpError(403, 'Forbidden');
      }
      const body = ['POST', 'PUT'].includes(req.method) ? await readBody(req) : {};
      const out = await r.handler({ req, res, user, body, params, qs: url.searchParams, ip });
      if (out !== Symbol.for('handled')) json(res, 200, out);
      return;
    }
    let f = path.normalize(path.join(PUBLIC_DIR, url.pathname === '/' ? 'index.html' : url.pathname));
    if (!f.startsWith(PUBLIC_DIR) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(PUBLIC_DIR, 'index.html');
    res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream', ...SEC });
    res.end(fs.readFileSync(f));
  } catch (e) {
    if (!(e instanceof HttpError)) console.error(e);
    if (!res.headersSent) json(res, e.status || 500, { error: e.status ? e.message : 'Server error' });
  }
});
server.listen(PORT, () => console.log(`Debt manager running on http://localhost:${PORT}`));
