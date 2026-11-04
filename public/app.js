'use strict';
/* ---------- i18n ---------- */
const L = {
  ar: {
    app: 'دَين', tagline: 'إدارة الديون والمستحقات بوضوح', skip: 'تخطَّ إلى المحتوى',
    login: 'تسجيل الدخول', register: 'إنشاء حساب', logout: 'خروج', name: 'الاسم', email: 'البريد الإلكتروني', password: 'كلمة المرور',
    pwHint: '8 أحرف على الأقل', noAcct: 'ليس لديك حساب؟', haveAcct: 'لديك حساب؟', firstAdmin: 'أول حساب يُنشأ يصبح مديراً للنظام.',
    dashboard: 'الرئيسية', parties: 'الأطراف', debts: 'الديون', reports: 'التقارير', settings: 'الإعدادات', admin: 'الإدارة',
    toCollect: 'مستحق لي (للتحصيل)', toPay: 'عليّ (للسداد)', net: 'صافي الرصيد', overdue: 'متأخر', upcoming: 'يستحق خلال 7 أيام',
    noOverdue: 'لا توجد ديون متأخرة. عمل رائع!', noUpcoming: 'لا توجد استحقاقات قريبة', noData: 'لا توجد بيانات بعد',
    addParty: 'إضافة طرف', editParty: 'تعديل الطرف', phone: 'الهاتف', address: 'العنوان', notes: 'ملاحظات', save: 'حفظ', cancel: 'إلغاء', delete: 'حذف', edit: 'تعديل',
    noParties: 'لم تضف أي طرف بعد', noPartiesHint: 'أضف الأشخاص أو الجهات التي تتعامل معها لتبدأ.',
    confirmDelParty: 'سيتم حذف هذا الطرف (حذف ناعم) وتبقى سجلاته. متابعة؟',
    addDebt: 'تسجيل دين', editDebt: 'تعديل الدين', party: 'الطرف', choose: 'اختر…', type: 'النوع', given: 'أعطيته مالاً (مستحق لي)', taken: 'أخذت مالاً (عليّ)',
    receivable: 'مستحق لي', payable: 'عليّ', amount: 'المبلغ', currency: 'العملة', issueDate: 'تاريخ الإصدار', dueDate: 'تاريخ الاستحقاق', attachment: 'مرفق (إيصال/عقد)', attHint: 'صورة أو PDF حتى 3 م.ب',
    total: 'الإجمالي', paid: 'المدفوع', remaining: 'المتبقي', status: 'الحالة', unpaid: 'غير مدفوع', partial: 'مدفوع جزئياً', fullyPaid: 'مدفوع بالكامل', all: 'الكل',
    addPayment: 'تسجيل دفعة', payments: 'الدفعات', method: 'طريقة الدفع', cash: 'نقداً', bank: 'تحويل بنكي', card: 'بطاقة', wallet: 'محفظة', other: 'أخرى', date: 'التاريخ',
    noPayments: 'لا توجد دفعات بعد', voidIt: 'إلغاء', voidDebt: 'إلغاء الدين', voidPay: 'إلغاء الدفعة', reason: 'السبب (اختياري)', confirmVoid: 'سيتم إلغاء هذا السجل مع الاحتفاظ به في سجل التدقيق. متابعة؟',
    viewAtt: 'عرض المرفق', balance: 'الرصيد', settled: 'مسوّى', theyOweMe: 'مدين لي', iOweThem: 'أنا مدين له',
    from: 'من', to: 'إلى', apply: 'تطبيق', exportCsv: 'تصدير Excel/CSV', printPdf: 'طباعة / PDF', statement: 'كشف حساب', generated: 'أُنشئ في',
    profile: 'الملف الشخصي', changePw: 'تغيير كلمة المرور', currentPw: 'كلمة المرور الحالية', newPw: 'كلمة المرور الجديدة', prefCurrency: 'العملة المفضلة',
    appearance: 'المظهر', theme: 'الوضع', dark: 'داكن', light: 'فاتح', language: 'اللغة',
    notifications: 'إشعارات تيليجرام', tgToken: 'رمز البوت (Bot token)', tgChat: 'معرّف المحادثة (Chat ID)', freq: 'التكرار', off: 'متوقف', daily: 'يومي', weekly: 'أسبوعي', sendTest: 'إرسال ملخص تجريبي', tgSaved: 'محفوظ — اتركه فارغاً للإبقاء عليه',
    users: 'المستخدمون', logs: 'سجل التدقيق', role: 'الدور', active: 'نشط', disabled: 'معطّل', actionCol: 'الإجراء', entity: 'الكيان', when: 'الوقت', userCol: 'المستخدم',
    saved: 'تم الحفظ', done: 'تمت العملية', due: 'الاستحقاق', daysLate: 'متأخر', loading: 'جارٍ التحميل…', error: 'حدث خطأ', openDebt: 'فتح', back: 'رجوع', close: 'إغلاق', ofTotal: 'من',
    search: 'بحث', navMain: 'التنقل الرئيسي', unnamed: 'بدون', noDue: 'بدون استحقاق', admin_: 'مدير', user_: 'مستخدم', counts: 'ديون مسجلة', settledPct: 'مسدد',
  },
  en: {
    app: 'Dayn', tagline: 'Track debts and receivables with clarity', skip: 'Skip to content',
    login: 'Sign in', register: 'Create account', logout: 'Sign out', name: 'Name', email: 'Email', password: 'Password',
    pwHint: 'At least 8 characters', noAcct: "Don't have an account?", haveAcct: 'Already have an account?', firstAdmin: 'The first account created becomes the system admin.',
    dashboard: 'Dashboard', parties: 'Parties', debts: 'Debts', reports: 'Reports', settings: 'Settings', admin: 'Admin',
    toCollect: 'Owed to me (to collect)', toPay: 'I owe (to pay)', net: 'Net balance', overdue: 'Overdue', upcoming: 'Due within 7 days',
    noOverdue: 'Nothing overdue. Nice work!', noUpcoming: 'No upcoming due dates', noData: 'No data yet',
    addParty: 'Add party', editParty: 'Edit party', phone: 'Phone', address: 'Address', notes: 'Notes', save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit',
    noParties: 'No parties yet', noPartiesHint: 'Add the people or businesses you deal with to get started.',
    confirmDelParty: 'This party will be soft-deleted and its records kept. Continue?',
    addDebt: 'Record debt', editDebt: 'Edit debt', party: 'Party', choose: 'Choose…', type: 'Type', given: 'I gave money (receivable)', taken: 'I took money (payable)',
    receivable: 'Receivable', payable: 'Payable', amount: 'Amount', currency: 'Currency', issueDate: 'Issue date', dueDate: 'Due date', attachment: 'Attachment (receipt/contract)', attHint: 'Image or PDF up to 3 MB',
    total: 'Total', paid: 'Paid', remaining: 'Remaining', status: 'Status', unpaid: 'Unpaid', partial: 'Partially paid', fullyPaid: 'Fully paid', all: 'All',
    addPayment: 'Record payment', payments: 'Payments', method: 'Method', cash: 'Cash', bank: 'Bank transfer', card: 'Card', wallet: 'Wallet', other: 'Other', date: 'Date',
    noPayments: 'No payments yet', voidIt: 'Void', voidDebt: 'Void debt', voidPay: 'Void payment', reason: 'Reason (optional)', confirmVoid: 'This record will be voided and kept in the audit trail. Continue?',
    viewAtt: 'View attachment', balance: 'Balance', settled: 'Settled', theyOweMe: 'Owes me', iOweThem: 'I owe',
    from: 'From', to: 'To', apply: 'Apply', exportCsv: 'Export Excel/CSV', printPdf: 'Print / PDF', statement: 'Account statement', generated: 'Generated',
    profile: 'Profile', changePw: 'Change password', currentPw: 'Current password', newPw: 'New password', prefCurrency: 'Preferred currency',
    appearance: 'Appearance', theme: 'Theme', dark: 'Dark', light: 'Light', language: 'Language',
    notifications: 'Telegram notifications', tgToken: 'Bot token', tgChat: 'Chat ID', freq: 'Frequency', off: 'Off', daily: 'Daily', weekly: 'Weekly', sendTest: 'Send test summary', tgSaved: 'Saved — leave empty to keep',
    users: 'Users', logs: 'Audit log', role: 'Role', active: 'Active', disabled: 'Disabled', actionCol: 'Action', entity: 'Entity', when: 'When', userCol: 'User',
    saved: 'Saved', done: 'Done', due: 'Due', daysLate: 'late', loading: 'Loading…', error: 'Something went wrong', openDebt: 'Open', back: 'Back', close: 'Close', ofTotal: 'of',
    search: 'Search', navMain: 'Main navigation', unnamed: 'None', noDue: 'No due date', admin_: 'Admin', user_: 'User', counts: 'debts recorded', settledPct: 'settled',
  },
};
const S = { token: localStorage.getItem('token'), user: null, lang: localStorage.getItem('lang') || 'ar', theme: document.documentElement.dataset.theme || 'light' };
const t = k => L[S.lang][k] ?? L.en[k] ?? k;

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const CURRENCIES = ['USD', 'EUR', 'GBP', 'SAR', 'AED', 'KWD', 'QAR', 'JOD', 'ILS', 'EGP', 'TRY', 'IQD', 'LBP', 'MAD', 'DZD'];
const money = (n, c) => {
  try { return new Intl.NumberFormat(S.lang === 'ar' ? 'ar-u-nu-latn' : 'en-US', { style: 'currency', currency: c || 'USD' }).format(n); }
  catch { return `${Number(n).toFixed(2)} ${c}`; }
};
const today = () => new Date().toISOString().slice(0, 10);
const ic = d => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const I = {
  home: ic('<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>'),
  users: ic('<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-7 7-7s7 3 7 7"/><path d="M17 4a4 4 0 010 8M22 21c0-3-2-5-5-6"/>'),
  wallet: ic('<path d="M3 7h16a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M3 7l12-4v4"/><circle cx="17" cy="14" r="1.5"/>'),
  chart: ic('<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>'),
  gear: ic('<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 00-.1-1.3l2-1.5-2-3.4-2.3 1a7 7 0 00-2.2-1.3L14 3h-4l-.4 2.5a7 7 0 00-2.2 1.3l-2.3-1-2 3.4 2 1.5a7 7 0 000 2.6l-2 1.5 2 3.4 2.3-1a7 7 0 002.2 1.3L10 21h4l.4-2.5a7 7 0 002.2-1.3l2.3 1 2-3.4-2-1.5c.1-.4.1-.9.1-1.3z"/>'),
  shield: ic('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>'),
  plus: ic('<path d="M12 5v14M5 12h14"/>'),
  down: ic('<path d="M12 4v14M6 12l6 6 6-6"/>'),
  up: ic('<path d="M12 20V6M6 12l6-6 6 6"/>'),
  scale: ic('<path d="M12 3v18M5 7h14M5 7l-3 8a3.5 3.5 0 006 0zM19 7l-3 8a3.5 3.5 0 006 0z"/>'),
  moon: ic('<path d="M21 13a9 9 0 11-10-10 7 7 0 0010 10z"/>'),
  sun: ic('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>'),
  out: ic('<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>'),
  globe: ic('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'),
  empty: ic('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 14h4"/>'),
  clip: ic('<path d="M21 11l-9 9a5 5 0 01-7-7l9-9a3.5 3.5 0 015 5l-9 9a2 2 0 01-3-3l8-8"/>'),
  dl: ic('<path d="M12 3v12M6 11l6 6 6-6M4 21h16"/>'),
  print: ic('<path d="M6 9V3h12v6M6 18H4a1 1 0 01-1-1v-6a2 2 0 012-2h14a2 2 0 012 2v6a1 1 0 01-1 1h-2"/><rect x="6" y="14" width="12" height="7"/>'),
};

async function api(path, { method = 'GET', body, raw } = {}) {
  const r = await fetch('/api' + path, { method, headers: { ...(body ? { 'content-type': 'application/json' } : {}), ...(S.token ? { authorization: 'Bearer ' + S.token } : {}) }, body: body ? JSON.stringify(body) : undefined });
  if (r.status === 401 && S.token) { logout(); throw new Error('Unauthorized'); }
  if (raw && r.ok) return r;
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || t('error'));
  return data;
}
function toast(msg) {
  const el = Object.assign(document.createElement('div'), { className: 'toast', textContent: msg });
  el.setAttribute('role', 'status'); document.body.append(el); setTimeout(() => el.remove(), 2800);
}
function logout() { localStorage.removeItem('token'); S.token = null; S.user = null; location.hash = ''; render(); }
function setLang(l) { S.lang = l; localStorage.setItem('lang', l); document.documentElement.lang = l; document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr'; render(); }
function setTheme(th) { S.theme = th; localStorage.setItem('theme', th); document.documentElement.dataset.theme = th; render(); }

const statusBadge = d => d.overdue ? `<span class="badge b-overdue">${t('overdue')}</span>`
  : `<span class="badge b-${d.status}">${d.status === 'paid' ? t('fullyPaid') : d.status === 'partial' ? t('partial') : t('unpaid')}</span>`;
const typeBadge = ty => ty === 'given' ? `<span class="badge b-in">${t('receivable')}</span>` : `<span class="badge b-out">${t('payable')}</span>`;
const amt = (n, c, cls = '') => `<span class="ltr ${cls}">${esc(money(n, c))}</span>`;
const netCls = n => n > 0 ? 'pos' : n < 0 ? 'neg' : '';

/* ---------- dialogs ---------- */
function dialog(title, bodyHtml, onSubmit, { submit = t('save'), danger = false } = {}) {
  const d = document.createElement('dialog');
  d.setAttribute('aria-labelledby', 'dlg-t');
  d.innerHTML = `<form method="dialog" novalidate><h2 id="dlg-t">${esc(title)}</h2><div class="err" role="alert" hidden></div>${bodyHtml}
    <div class="dlg-acts"><button type="button" class="btn" data-x>${t('cancel')}</button><button class="btn ${danger ? 'danger' : 'primary'}" type="submit">${esc(submit)}</button></div></form>`;
  document.body.append(d);
  const close = () => { d.close(); d.remove(); };
  d.addEventListener('cancel', e => { e.preventDefault(); close(); });
  $('[data-x]', d).onclick = close;
  $('form', d).onsubmit = async e => {
    e.preventDefault();
    const f = e.target, btn = $('button[type=submit]', f), err = $('.err', f);
    if (!f.reportValidity()) return;
    btn.disabled = true; err.hidden = true;
    try { await onSubmit(Object.fromEntries(new FormData(f)), f); close(); }
    catch (x) { err.textContent = x.message; err.hidden = false; btn.disabled = false; err.scrollIntoView({ block: 'nearest' }); }
  };
  d.showModal(); const first = $('input:not([type=radio]),select,textarea', d); first?.focus();
  return d;
}
const confirmBox = (msg, onYes, title = t('delete')) => dialog(title, `<p>${esc(msg)}</p>`, onYes, { submit: title, danger: true });
const field = (id, label, input, hint = '') => `<div class="field"><label for="${id}">${label}</label>${input}${hint ? `<span class="hint" id="${id}-h">${hint}</span>` : ''}</div>`;
const curOptions = sel => CURRENCIES.map(c => `<option ${c === sel ? 'selected' : ''}>${c}</option>`).join('');

/* ---------- shell ---------- */
const NAV = [['#/', 'dashboard', 'home'], ['#/parties', 'parties', 'users'], ['#/debts', 'debts', 'wallet'], ['#/reports', 'reports', 'chart'], ['#/settings', 'settings', 'gear']];
function shell(active, inner) {
  const items = [...NAV, ...(S.user.role === 'admin' ? [['#/admin', 'admin', 'shield']] : [])];
  const link = ([h, k, i]) => `<a href="${h}" ${active === h ? 'aria-current="page"' : ''}>${I[i]}<span>${t(k)}</span></a>`;
  return `<div class="app"><aside class="side"><div class="brand"><span class="logo" aria-hidden="true">${I.scale}</span>${t('app')}</div>
    <nav class="nav" aria-label="${t('navMain')}">${items.map(link).join('')}</nav>
    <div class="foot"><button class="btn" data-act="lang">${I.globe}${S.lang === 'ar' ? 'English' : 'العربية'}</button>
    <button class="btn" data-act="theme">${S.theme === 'dark' ? I.sun + t('light') : I.moon + t('dark')}</button>
    <button class="btn" data-act="logout">${I.out}${t('logout')}</button></div></aside>
    <main class="main" id="view" tabindex="-1">${inner}</main>
    <nav class="bottom" aria-label="${t('navMain')}">${items.slice(0, 5).map(link).join('')}</nav></div>`;
}

/* ---------- views ---------- */
function authView(mode) {
  return `<div class="auth"><div class="card"><div class="tools"><button class="btn sm" data-act="lang">${I.globe}${S.lang === 'ar' ? 'English' : 'العربية'}</button>
    <button class="btn sm icon" data-act="theme" aria-label="${t('theme')}">${S.theme === 'dark' ? I.sun : I.moon}</button></div>
    <div class="brand" style="padding-inline:0"><span class="logo" aria-hidden="true">${I.scale}</span>${t('app')}</div>
    <p class="muted" style="margin:0 0 18px">${t('tagline')}</p>
    <h1 style="margin-bottom:16px">${mode === 'login' ? t('login') : t('register')}</h1>
    <form id="auth" novalidate><div class="err" role="alert" hidden></div>
    ${mode === 'register' ? field('a-name', t('name'), '<input id="a-name" name="name" autocomplete="name" required>') : ''}
    ${field('a-email', t('email'), '<input id="a-email" name="email" type="email" autocomplete="email" required class="ltr">')}
    ${field('a-pw', t('password'), `<input id="a-pw" name="password" type="password" autocomplete="${mode === 'login' ? 'current-password' : 'new-password'}" required minlength="${mode === 'login' ? 1 : 8}" class="ltr">`, mode === 'register' ? t('pwHint') : '')}
    <button class="btn primary" style="width:100%" type="submit">${mode === 'login' ? t('login') : t('register')}</button></form>
    <p style="margin:16px 0 0;text-align:center">${mode === 'login' ? t('noAcct') : t('haveAcct')} <a href="#/${mode === 'login' ? 'register' : 'login'}">${mode === 'login' ? t('register') : t('login')}</a></p>
    ${mode === 'register' ? `<p class="muted" style="text-align:center;font-size:.85rem">${t('firstAdmin')}</p>` : ''}</div></div>`;
}
function bindAuth(mode) {
  $('#auth').onsubmit = async e => {
    e.preventDefault(); const f = e.target, err = $('.err', f), btn = $('button', f);
    if (!f.reportValidity()) return;
    btn.disabled = true; err.hidden = true;
    try {
      const r = await api('/auth/' + mode, { method: 'POST', body: Object.fromEntries(new FormData(f)) });
      S.token = r.token; S.user = r.user; localStorage.setItem('token', r.token); location.hash = '#/'; render();
    } catch (x) { err.textContent = x.message; err.hidden = false; btn.disabled = false; }
  };
}

const empty = (title, hint = '') => `<div class="empty">${I.empty}<p><strong>${title}</strong></p><p>${hint}</p></div>`;
const head = (title, acts = '') => `<div class="top"><h1>${title}</h1><div class="acts">${acts}</div></div>`;
const debtRow = d => `<a class="item" href="#/debts/${d.id}"><div><strong>${esc(d.party_name)}</strong> ${typeBadge(d.type)}
  <div class="sub">${t('due')}: <span class="ltr">${d.due_date || t('noDue')}</span></div></div><div style="text-align:end">${amt(d.remaining, d.currency, d.type === 'given' ? 'pos' : 'neg')}<div>${statusBadge(d)}</div></div></a>`;

async function dashboard() {
  const d = await api('/dashboard');
  const tot = d.totals.length ? d.totals : [{ currency: S.user.currency, receivable: 0, payable: 0, net: 0 }];
  const stat = (cls, ico, lbl, key) => `<div class="card stat ${cls}"><div class="lbl"><span class="ic">${ico}</span>${lbl}</div>
    ${tot.map(x => `<div class="val ${key === 'net' ? netCls(x[key]) : ''}">${esc(money(x[key], x.currency))}</div>`).join('')}</div>`;
  const pct = d.counts.total ? Math.round(100 * d.counts.paid / d.counts.total) : 0;
  return shell('#/', head(t('dashboard'), `<a class="btn primary" href="#/debts?new=1">${I.plus}${t('addDebt')}</a>`) +
    `<div class="grid g3">${stat('in', I.down, t('toCollect'), 'receivable')}${stat('out', I.up, t('toPay'), 'payable')}${stat('net', I.scale, t('net'), 'net')}</div>
    <div class="grid g2" style="margin-top:16px">
    <section class="card" aria-labelledby="h-od"><h2 id="h-od" style="margin-bottom:12px">${t('overdue')} <span class="badge b-overdue">${d.overdue.length}</span></h2>
      <div class="list">${d.overdue.length ? d.overdue.map(debtRow).join('') : `<p class="muted">${t('noOverdue')}</p>`}</div></section>
    <section class="card" aria-labelledby="h-up"><h2 id="h-up" style="margin-bottom:12px">${t('upcoming')} <span class="badge b-partial">${d.upcoming.length}</span></h2>
      <div class="list">${d.upcoming.length ? d.upcoming.map(debtRow).join('') : `<p class="muted">${t('noUpcoming')}</p>`}</div></section></div>
    <section class="card" style="margin-top:16px"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><strong>${d.counts.total || 0} ${t('counts')}</strong><span>${pct}% ${t('settledPct')}</span></div>
      <div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div></section>`);
}

const balanceText = p => !p.balances.length || p.balances.every(b => b.net === 0) ? `<span class="muted">${t('settled')}</span>`
  : p.balances.filter(b => b.net).map(b => `<div>${amt(b.net, b.currency, netCls(b.net))} <span class="sub">${b.net > 0 ? t('theyOweMe') : t('iOweThem')}</span></div>`).join('');

async function parties() {
  const list = await api('/parties');
  return shell('#/parties', head(t('parties'), `<button class="btn primary" data-act="party-new">${I.plus}${t('addParty')}</button>`) +
    (list.length ? `<div class="list">${list.map(p => `<a class="item" href="#/parties/${p.id}"><div><strong>${esc(p.name)}</strong><div class="sub ltr">${esc(p.phone || p.email || '')}</div></div><div style="text-align:end">${balanceText(p)}</div></a>`).join('')}</div>`
      : `<div class="card">${empty(t('noParties'), t('noPartiesHint'))}</div>`));
}
function partyForm(p = {}) {
  return field('p-name', t('name'), `<input id="p-name" name="name" required value="${esc(p.name)}">`) +
    `<div class="row2">${field('p-phone', t('phone'), `<input id="p-phone" name="phone" type="tel" class="ltr" value="${esc(p.phone)}">`)}${field('p-email', t('email'), `<input id="p-email" name="email" type="email" class="ltr" value="${esc(p.email)}">`)}</div>` +
    field('p-addr', t('address'), `<input id="p-addr" name="address" value="${esc(p.address)}">`) + field('p-notes', t('notes'), `<textarea id="p-notes" name="notes">${esc(p.notes)}</textarea>`);
}
async function partyDetail(id) {
  const p = await api('/parties/' + id);
  window.__party = p;
  return shell('#/parties', head(esc(p.name), `<button class="btn" data-act="party-edit">${t('edit')}</button><button class="btn danger" data-act="party-del">${t('delete')}</button>
    <a class="btn primary" href="#/debts?new=1&party=${p.id}">${I.plus}${t('addDebt')}</a>`) +
    `<div class="grid g2"><section class="card"><dl class="kv"><dt>${t('phone')}</dt><dd class="ltr">${esc(p.phone) || '—'}</dd><dt>${t('email')}</dt><dd class="ltr">${esc(p.email) || '—'}</dd>
    <dt>${t('address')}</dt><dd>${esc(p.address) || '—'}</dd><dt>${t('notes')}</dt><dd>${esc(p.notes) || '—'}</dd></dl></section>
    <section class="card"><h2 style="margin-bottom:8px">${t('balance')}</h2>${balanceText(p)}</section></div>
    <h2 style="margin:24px 0 12px">${t('debts')}</h2><div class="list">${p.debts.length ? p.debts.map(debtRow).join('') : `<div class="card">${empty(t('noData'))}</div>`}</div>`);
}

function debtTable(rows) {
  return `<div class="tbl-wrap"><table class="stack"><thead><tr><th>${t('party')}</th><th>${t('type')}</th><th class="num">${t('total')}</th><th class="num">${t('remaining')}</th><th>${t('dueDate')}</th><th>${t('status')}</th></tr></thead><tbody>
  ${rows.map(d => `<tr class="click" data-href="#/debts/${d.id}"><td data-l="${t('party')}"><a href="#/debts/${d.id}"><strong>${esc(d.party_name)}</strong></a></td><td data-l="${t('type')}">${typeBadge(d.type)}</td>
  <td class="num" data-l="${t('total')}">${esc(money(d.total_amount, d.currency))}</td><td class="num" data-l="${t('remaining')}">${esc(money(d.remaining, d.currency))}</td>
  <td data-l="${t('dueDate')}" class="ltr">${d.due_date || '—'}</td><td data-l="${t('status')}">${statusBadge(d)}</td></tr>`).join('')}</tbody></table></div>`;
}
const filterQS = () => new URLSearchParams([...new URLSearchParams(location.hash.split('?')[1] || '')].filter(([k, v]) => v && !['new', 'party'].includes(k) || k === 'party' && 0));
function filterBar(parties, qs) {
  const v = k => esc(qs.get(k) || '');
  const sel = (k, opts) => opts.map(([val, lab]) => `<option value="${val}" ${(qs.get(k) || '') === val ? 'selected' : ''}>${lab}</option>`).join('');
  return `<form class="filters" id="filters" role="search">
    ${field('f-party', t('party'), `<select id="f-party" name="party_id"><option value="">${t('all')}</option>${sel('party_id', parties.map(p => [p.id, esc(p.name)]))}</select>`)}
    ${field('f-type', t('type'), `<select id="f-type" name="type">${sel('type', [['', t('all')], ['given', t('receivable')], ['taken', t('payable')]])}</select>`)}
    ${field('f-status', t('status'), `<select id="f-status" name="status">${sel('status', [['', t('all')], ['unpaid', t('unpaid')], ['partial', t('partial')], ['paid', t('fullyPaid')], ['overdue', t('overdue')]])}</select>`)}
    ${field('f-from', t('from'), `<input id="f-from" type="date" name="from" value="${v('from')}">`)}${field('f-to', t('to'), `<input id="f-to" type="date" name="to" value="${v('to')}">`)}
    <div class="field" style="justify-content:flex-end"><button class="btn primary" type="submit">${t('apply')}</button></div></form>`;
}
async function debts(report) {
  const qs = filterQS(); const [ps, rows] = await Promise.all([api('/parties'), api('/debts?' + qs)]);
  window.__parties = ps;
  const acts = report ? `<button class="btn" data-act="csv">${I.dl}${t('exportCsv')}</button><button class="btn" data-act="print">${I.print}${t('printPdf')}</button>`
    : `<button class="btn primary" data-act="debt-new">${I.plus}${t('addDebt')}</button>`;
  let sums = '';
  if (report) {
    const by = {}; rows.forEach(d => { const c = by[d.currency] ||= { r: 0, p: 0 }; if (d.status !== 'paid') c[d.type === 'given' ? 'r' : 'p'] += d.remaining; });
    sums = `<div class="card" style="margin-top:16px"><h2 style="margin-bottom:8px">${t('statement')}</h2><p class="muted noprint-hide" style="margin-top:0">${t('generated')}: <span class="ltr">${today()}</span></p>
      ${Object.entries(by).map(([c, v]) => `<div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap"><strong>${c}</strong><span>${t('toCollect')}: ${amt(v.r, c, 'pos')} · ${t('toPay')}: ${amt(v.p, c, 'neg')} · ${t('net')}: ${amt(v.r - v.p, c, netCls(v.r - v.p))}</span></div>`).join('') || `<p class="muted">${t('noData')}</p>`}</div>`;
  }
  return shell(report ? '#/reports' : '#/debts', head(report ? t('reports') : t('debts'), acts) + filterBar(ps, qs) +
    (rows.length ? `<div class="card" style="padding:6px 12px">${debtTable(rows)}</div>` : `<div class="card">${empty(t('noData'))}</div>`) + sums);
}
function debtForm(d, preParty = '') {
  d = d || {};
  const ps = window.__parties || [];
  const ty = d.type || 'given';
  return field('d-party', t('party'), `<select id="d-party" name="party_id" required><option value="">${t('choose')}</option>${ps.map(p => `<option value="${p.id}" ${String(p.id) === String(d.party_id || preParty) ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}</select>`) +
    `<fieldset class="field" style="border:0;padding:0;margin:0 0 14px"><legend style="font-weight:600;font-size:.92rem;margin-bottom:6px">${t('type')}</legend><div class="seg">
      <label><input type="radio" name="type" value="given" ${ty === 'given' ? 'checked' : ''}><span>${t('given')}</span></label>
      <label><input type="radio" name="type" value="taken" ${ty === 'taken' ? 'checked' : ''}><span>${t('taken')}</span></label></div></fieldset>
    <div class="row2">${field('d-amt', t('amount'), `<input id="d-amt" name="total_amount" type="number" step="0.01" min="0.01" inputmode="decimal" required class="ltr" value="${d.total_amount ?? ''}">`)}
    ${field('d-cur', t('currency'), `<select id="d-cur" name="currency">${curOptions(d.currency || S.user.currency)}</select>`)}</div>
    <div class="row2">${field('d-iss', t('issueDate'), `<input id="d-iss" name="issue_date" type="date" required value="${d.issue_date || today()}">`)}${field('d-due', t('dueDate'), `<input id="d-due" name="due_date" type="date" value="${d.due_date || ''}">`)}</div>
    ${field('d-notes', t('notes'), `<textarea id="d-notes" name="notes">${esc(d.notes)}</textarea>`)}
    ${field('d-att', t('attachment'), '<input id="d-att" type="file" accept="image/*,application/pdf" name="file">', t('attHint'))}`;
}
const readFile = f => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res({ name: f.name, data: r.result }); r.onerror = rej; r.readAsDataURL(f); });
async function submitDebt(data, form, id) {
  const file = $('input[type=file]', form).files[0];
  const body = { ...data }; delete body.file;
  if (file) body.attachment = await readFile(file);
  const r = await api(id ? '/debts/' + id : '/debts', { method: id ? 'PUT' : 'POST', body });
  toast(t('saved')); id ? render() : (location.hash = '#/debts/' + r.id);
}
function openDebtDialog(d, preParty) { dialog(d ? t('editDebt') : t('addDebt'), debtForm(d, preParty), (data, f) => submitDebt(data, f, d?.id)); }

async function debtDetail(id) {
  const d = await api('/debts/' + id); window.__debt = d;
  const pct = Math.min(100, Math.round(100 * d.paid_amount / d.total_amount));
  const canPay = !d.voided && d.status !== 'paid';
  return shell('#/debts', head(`${esc(d.party_name)} ${typeBadge(d.type)}`,
    `<a class="btn" href="#/debts">${t('back')}</a>${d.voided ? '' : `<button class="btn" data-act="debt-edit">${t('edit')}</button><button class="btn danger" data-act="debt-void">${t('voidDebt')}</button>`}${canPay ? `<button class="btn primary" data-act="pay-new">${I.plus}${t('addPayment')}</button>` : ''}`) +
    `<div class="grid g3"><div class="card stat"><div class="lbl">${t('total')}</div><div class="val">${esc(money(d.total_amount, d.currency))}</div></div>
    <div class="card stat in"><div class="lbl">${t('paid')}</div><div class="val">${esc(money(d.paid_amount, d.currency))}</div></div>
    <div class="card stat out"><div class="lbl">${t('remaining')}</div><div class="val">${esc(money(d.remaining, d.currency))}</div></div></div>
    <section class="card" style="margin-top:16px"><div style="display:flex;justify-content:space-between;margin-bottom:8px">${d.voided ? `<span class="badge b-overdue">${t('voidIt')}</span>` : statusBadge(d)}<span>${pct}%</span></div>
      <div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>
      <dl class="kv" style="margin-top:16px"><dt>${t('issueDate')}</dt><dd class="ltr">${d.issue_date}</dd><dt>${t('dueDate')}</dt><dd class="ltr">${d.due_date || '—'}</dd><dt>${t('notes')}</dt><dd>${esc(d.notes) || '—'}</dd>
      ${d.attachment_name ? `<dt>${t('attachment')}</dt><dd><button class="btn sm" data-act="att">${I.clip}${esc(d.attachment_name)}</button></dd>` : ''}</dl></section>
    <h2 style="margin:24px 0 12px">${t('payments')}</h2>
    ${d.payments.length ? `<div class="list">${d.payments.map(p => `<div class="item" ${p.voided ? 'style="opacity:.55;text-decoration:line-through"' : ''}><div><strong class="ltr">${esc(money(p.amount, d.currency))}</strong>
      <div class="sub"><span class="ltr">${p.payment_date}</span> · ${t(p.payment_method)}${p.notes ? ' · ' + esc(p.notes) : ''}</div></div>
      ${p.voided || d.voided ? '' : `<button class="btn sm danger" data-act="pay-void" data-id="${p.id}">${t('voidIt')}</button>`}</div>`).join('')}</div>` : `<div class="card">${empty(t('noPayments'))}</div>`}`);
}

async function settings() {
  const u = S.user;
  return shell('#/settings', head(t('settings')) + `<div class="grid g2">
  <form class="card" id="f-prof" novalidate><h2 style="margin-bottom:14px">${t('profile')}</h2><div class="err" role="alert" hidden></div>
    ${field('s-name', t('name'), `<input id="s-name" name="name" required value="${esc(u.name)}">`)}${field('s-email', t('email'), `<input id="s-email" disabled class="ltr" value="${esc(u.email)}">`)}
    ${field('s-phone', t('phone'), `<input id="s-phone" name="phone" type="tel" class="ltr" value="${esc(u.phone)}">`)}
    ${field('s-cur', t('prefCurrency'), `<select id="s-cur" name="currency">${curOptions(u.currency)}</select>`)}<button class="btn primary" type="submit">${t('save')}</button></form>
  <form class="card" id="f-tg" novalidate><h2 style="margin-bottom:14px">${t('notifications')}</h2><div class="err" role="alert" hidden></div>
    ${field('s-tok', t('tgToken'), `<input id="s-tok" name="tg_token" class="ltr" autocomplete="off" placeholder="${u.tg_set ? '••••••••' : ''}">`, u.tg_set ? t('tgSaved') : '')}
    ${field('s-chat', t('tgChat'), `<input id="s-chat" name="tg_chat" class="ltr" value="${esc(u.tg_chat)}">`)}
    ${field('s-freq', t('freq'), `<select id="s-freq" name="notify_freq">${['off', 'daily', 'weekly'].map(f => `<option value="${f}" ${u.notify_freq === f ? 'selected' : ''}>${t(f)}</option>`).join('')}</select>`)}
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary" type="submit">${t('save')}</button><button class="btn" type="button" data-act="tg-test">${t('sendTest')}</button></div></form>
  <form class="card" id="f-pw" novalidate><h2 style="margin-bottom:14px">${t('changePw')}</h2><div class="err" role="alert" hidden></div>
    ${field('s-cp', t('currentPw'), '<input id="s-cp" name="current" type="password" autocomplete="current-password" required class="ltr">')}
    ${field('s-np', t('newPw'), '<input id="s-np" name="password" type="password" autocomplete="new-password" required minlength="8" class="ltr">', t('pwHint'))}<button class="btn primary" type="submit">${t('changePw')}</button></form>
  <section class="card"><h2 style="margin-bottom:14px">${t('appearance')}</h2><div style="display:flex;gap:8px;flex-wrap:wrap">
    <button class="btn" data-act="theme">${S.theme === 'dark' ? I.sun + t('light') : I.moon + t('dark')}</button><button class="btn" data-act="lang">${I.globe}${S.lang === 'ar' ? 'English' : 'العربية'}</button></div></section></div>`);
}
function bindSettings() {
  const wire = (sel, fn) => $(sel).onsubmit = async e => {
    e.preventDefault(); const f = e.target, err = $('.err', f);
    if (!f.reportValidity()) return; err.hidden = true;
    try { await fn(Object.fromEntries(new FormData(f)), f); } catch (x) { err.textContent = x.message; err.hidden = false; }
  };
  wire('#f-prof', async d => { S.user = await api('/me', { method: 'PUT', body: d }); toast(t('saved')); });
  wire('#f-tg', async d => { if (!d.tg_token) delete d.tg_token; S.user = await api('/me', { method: 'PUT', body: d }); toast(t('saved')); render(); });
  wire('#f-pw', async (d, f) => { await api('/me/password', { method: 'PUT', body: d }); f.reset(); toast(t('saved')); });
}

async function adminView() {
  const [us, logs] = await Promise.all([api('/admin/users'), api('/admin/logs')]);
  return shell('#/admin', head(t('admin')) + `<h2 style="margin-bottom:12px">${t('users')}</h2><div class="card" style="padding:6px 12px"><div class="tbl-wrap"><table class="stack"><thead><tr><th>${t('name')}</th><th>${t('email')}</th><th>${t('role')}</th><th>${t('status')}</th><th></th></tr></thead><tbody>
  ${us.map(u => `<tr><td data-l="${t('name')}">${esc(u.name)}</td><td data-l="${t('email')}" class="ltr">${esc(u.email)}</td><td data-l="${t('role')}">${t(u.role + '_')}</td>
  <td data-l="${t('status')}"><span class="badge ${u.active ? 'b-paid' : 'b-overdue'}">${u.active ? t('active') : t('disabled')}</span></td>
  <td>${u.id === S.user.id ? '' : `<button class="btn sm" data-act="u-toggle" data-id="${u.id}" data-active="${u.active}">${u.active ? t('disabled') : t('active')}</button>
  <button class="btn sm" data-act="u-role" data-id="${u.id}" data-role="${u.role}">${t(u.role === 'admin' ? 'user_' : 'admin_')}</button>`}</td></tr>`).join('')}</tbody></table></div></div>
  <h2 style="margin:24px 0 12px">${t('logs')}</h2><div class="card" style="padding:6px 12px"><div class="tbl-wrap"><table class="stack"><thead><tr><th>${t('when')}</th><th>${t('userCol')}</th><th>${t('actionCol')}</th><th>${t('entity')}</th></tr></thead><tbody>
  ${logs.map(l => `<tr><td data-l="${t('when')}" class="ltr">${esc(l.created_at)}</td><td data-l="${t('userCol')}" class="ltr">${esc(l.email || '—')}</td><td data-l="${t('actionCol')}">${esc(l.action)}</td><td data-l="${t('entity')}">${esc(l.entity || '')} ${l.entity_id ?? ''}</td></tr>`).join('')}</tbody></table></div></div>`);
}

/* ---------- router ---------- */
async function render() {
  const root = $('#root'); $('#skip').textContent = t('skip');
  document.title = `${t('app')} — ${t('tagline')}`;
  const [path] = (location.hash.slice(1) || '/').split('?');
  if (!S.token) {
    const mode = path === '/register' ? 'register' : 'login';
    root.innerHTML = authView(mode); bindAuth(mode); return;
  }
  if (!S.user) { try { S.user = await api('/me'); } catch { return; } }
  root.innerHTML = shell('', `<p class="muted" role="status">${t('loading')}</p>`);
  const seg = path.split('/').filter(Boolean);
  try {
    let html;
    if (!seg.length || path === '/login' || path === '/register') html = await dashboard();
    else if (seg[0] === 'parties') html = seg[1] ? await partyDetail(seg[1]) : await parties();
    else if (seg[0] === 'debts') html = seg[1] ? await debtDetail(seg[1]) : await debts(false);
    else if (seg[0] === 'reports') html = await debts(true);
    else if (seg[0] === 'settings') html = await settings();
    else if (seg[0] === 'admin' && S.user.role === 'admin') html = await adminView();
    else html = await dashboard();
    root.innerHTML = html;
    if (seg[0] === 'settings') bindSettings();
    if (seg[0] === 'debts' && !seg[1] && new URLSearchParams(location.hash.split('?')[1] || '').get('new')) {
      const pp = new URLSearchParams(location.hash.split('?')[1]).get('party') || '';
      history.replaceState(null, '', '#/debts'); openDebtDialog(null, pp);
    }
    $('#view')?.focus({ preventScroll: true });
  } catch (e) {
    $('#view').innerHTML = `<div class="err" role="alert">${esc(e.message)}</div>`;
  }
}

/* ---------- events ---------- */
document.addEventListener('submit', e => {
  if (e.target.id === 'filters') {
    e.preventDefault();
    const p = new URLSearchParams([...new FormData(e.target)].filter(([, v]) => v));
    const base = location.hash.split('?')[0]; location.hash = base + (p.toString() ? '?' + p : '');
    if (!p.toString()) render();
  }
});
document.addEventListener('click', async e => {
  const row = e.target.closest('tr[data-href]');
  if (row && !e.target.closest('a,button')) { location.hash = row.dataset.href; return; }
  const b = e.target.closest('[data-act]'); if (!b) return;
  const a = b.dataset.act, d = window.__debt, p = window.__party;
  const go = async fn => { try { await fn(); } catch (x) { toast(x.message); } };
  if (a === 'lang') setLang(S.lang === 'ar' ? 'en' : 'ar');
  else if (a === 'theme') setTheme(S.theme === 'dark' ? 'light' : 'dark');
  else if (a === 'logout') logout();
  else if (a === 'party-new') dialog(t('addParty'), partyForm(), async data => { await api('/parties', { method: 'POST', body: data }); toast(t('saved')); render(); });
  else if (a === 'party-edit') dialog(t('editParty'), partyForm(p), async data => { await api('/parties/' + p.id, { method: 'PUT', body: data }); toast(t('saved')); render(); });
  else if (a === 'party-del') confirmBox(t('confirmDelParty'), async () => { await api('/parties/' + p.id, { method: 'DELETE' }); location.hash = '#/parties'; });
  else if (a === 'debt-new') openDebtDialog(null);
  else if (a === 'debt-edit') openDebtDialog(d);
  else if (a === 'debt-void') dialog(t('voidDebt'), `<p>${t('confirmVoid')}</p>${field('v-r', t('reason'), '<input id="v-r" name="reason">')}`, async data => { await api(`/debts/${d.id}/void`, { method: 'POST', body: data }); location.hash = '#/debts'; }, { submit: t('voidDebt'), danger: true });
  else if (a === 'pay-new') dialog(t('addPayment'), `${field('pa-amt', `${t('amount')} (${t('remaining')}: ${money(d.remaining, d.currency)})`, `<input id="pa-amt" name="amount" type="number" step="0.01" min="0.01" max="${d.remaining}" inputmode="decimal" required class="ltr" value="${d.remaining}">`)}
    <div class="row2">${field('pa-date', t('date'), `<input id="pa-date" name="payment_date" type="date" value="${today()}" required>`)}${field('pa-m', t('method'), `<select id="pa-m" name="payment_method">${['cash', 'bank', 'card', 'wallet', 'other'].map(m => `<option value="${m}">${t(m)}</option>`).join('')}</select>`)}</div>
    ${field('pa-n', t('notes'), '<input id="pa-n" name="notes">')}`, async data => { await api(`/debts/${d.id}/payments`, { method: 'POST', body: data }); toast(t('saved')); render(); });
  else if (a === 'pay-void') dialog(t('voidPay'), `<p>${t('confirmVoid')}</p>${field('v-r', t('reason'), '<input id="v-r" name="reason">')}`, async data => { await api(`/payments/${b.dataset.id}/void`, { method: 'POST', body: data }); toast(t('done')); render(); }, { submit: t('voidPay'), danger: true });
  else if (a === 'att') go(async () => { const r = await api(`/debts/${d.id}/attachment`, { raw: true }); window.open(URL.createObjectURL(await r.blob()), '_blank', 'noopener'); });
  else if (a === 'csv') go(async () => {
    const r = await api('/export/debts.csv?' + filterQS(), { raw: true }); const url = URL.createObjectURL(await r.blob());
    const l = Object.assign(document.createElement('a'), { href: url, download: `debts-${today()}.csv` }); l.click(); URL.revokeObjectURL(url);
  });
  else if (a === 'print') window.print();
  else if (a === 'tg-test') go(async () => { await api('/notify/test', { method: 'POST' }); toast(t('done')); });
  else if (a === 'u-toggle') go(async () => { await api('/admin/users/' + b.dataset.id, { method: 'PUT', body: { active: b.dataset.active !== '1' } }); render(); });
  else if (a === 'u-role') go(async () => { await api('/admin/users/' + b.dataset.id, { method: 'PUT', body: { role: b.dataset.role === 'admin' ? 'user' : 'admin' } }); render(); });
});
addEventListener('hashchange', render);
render();
