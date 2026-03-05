// ────────────────────────────────────────────────
//  Utility
// ────────────────────────────────────────────────
function fmt(n, decimals = 2) {
  if (isNaN(n) || !isFinite(n)) return '—';
  return new Intl.NumberFormat('he-IL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(n);
}

function fmtCurrency(n) {
  if (isNaN(n) || !isFinite(n)) return '—';
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(n);
}

function showResult(boxId, value, sub = '') {
  const box = document.getElementById(boxId);
  box.querySelector('.result-value').textContent = value;
  if (sub) box.querySelector('.result-sub').textContent = sub;
  box.classList.add('visible');
}

function hideResult(boxId) {
  document.getElementById(boxId)?.classList.remove('visible');
}

function showError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.add('visible');
}

function hideError(id) {
  document.getElementById(id)?.classList.remove('visible');
}

function getVal(id) {
  const v = parseFloat(document.getElementById(id)?.value);
  return isNaN(v) ? null : v;
}

// ────────────────────────────────────────────────
//  Tab Navigation
// ────────────────────────────────────────────────
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
  document.getElementById(`tab-${tab}`).classList.add('active');
}

// ────────────────────────────────────────────────
//  Percentage Calculator
// ────────────────────────────────────────────────
let pctMode = 'pct-of'; // current mode

const PCT_MODES = {
  'pct-of':     { label: 'X% מתוך Y',        inputs: ['pct-x-percent', 'pct-x-base'],        fn: calcPctOf },
  'what-pct':   { label: 'X הוא כמה % מ-Y',   inputs: ['pct-w-part', 'pct-w-total'],          fn: calcWhatPct },
  'add-pct':    { label: 'הוסף % לסכום',       inputs: ['pct-a-base', 'pct-a-percent'],        fn: calcAddPct },
  'sub-pct':    { label: 'הפחת % מסכום',       inputs: ['pct-s-base', 'pct-s-percent'],        fn: calcSubPct },
  'pct-change': { label: 'שינוי אחוזי',        inputs: ['pct-c-from', 'pct-c-to'],             fn: calcPctChange },
  'reverse-pct':{ label: 'מה הבסיס לפני %?',  inputs: ['pct-r-result', 'pct-r-percent'],      fn: calcReversePct }
};

function calcPctOf() {
  const pct = getVal('pct-x-percent'), base = getVal('pct-x-base');
  if (pct === null || base === null) return showError('pct-error', 'יש למלא את כל השדות');
  const res = (pct / 100) * base;
  showResult('pct-result', fmt(res), `${fmt(pct)}% מתוך ${fmt(base, 0)} = ${fmt(res)}`);
}

function calcWhatPct() {
  const part = getVal('pct-w-part'), total = getVal('pct-w-total');
  if (part === null || total === null) return showError('pct-error', 'יש למלא את כל השדות');
  if (total === 0) return showError('pct-error', 'הסכום הכולל לא יכול להיות 0');
  const res = (part / total) * 100;
  showResult('pct-result', `${fmt(res)}%`, `${fmt(part, 0)} מתוך ${fmt(total, 0)}`);
}

function calcAddPct() {
  const base = getVal('pct-a-base'), pct = getVal('pct-a-percent');
  if (base === null || pct === null) return showError('pct-error', 'יש למלא את כל השדות');
  const addition = (pct / 100) * base;
  const res = base + addition;
  showResult('pct-result', fmt(res), `${fmt(base, 0)} + ${fmt(pct)}% (${fmt(addition)}) = ${fmt(res)}`);
}

function calcSubPct() {
  const base = getVal('pct-s-base'), pct = getVal('pct-s-percent');
  if (base === null || pct === null) return showError('pct-error', 'יש למלא את כל השדות');
  const subtraction = (pct / 100) * base;
  const res = base - subtraction;
  showResult('pct-result', fmt(res), `${fmt(base, 0)} − ${fmt(pct)}% (${fmt(subtraction)}) = ${fmt(res)}`);
}

function calcPctChange() {
  const from = getVal('pct-c-from'), to = getVal('pct-c-to');
  if (from === null || to === null) return showError('pct-error', 'יש למלא את כל השדות');
  if (from === 0) return showError('pct-error', 'ערך ההתחלה לא יכול להיות 0');
  const res = ((to - from) / Math.abs(from)) * 100;
  const sign = res >= 0 ? '+' : '';
  showResult('pct-result', `${sign}${fmt(res)}%`, `מ-${fmt(from, 0)} ל-${fmt(to, 0)}: שינוי של ${sign}${fmt(res)}%`);
}

function calcReversePct() {
  const result = getVal('pct-r-result'), pct = getVal('pct-r-percent');
  if (result === null || pct === null) return showError('pct-error', 'יש למלא את כל השדות');
  if (pct === -100) return showError('pct-error', 'אחוז לא יכול להיות 100%-');
  const base = result / (1 + pct / 100);
  showResult('pct-result', fmt(base), `לפני ${fmt(pct)}%: הסכום היה ${fmt(base)}`);
}

function setPctMode(mode) {
  pctMode = mode;
  document.querySelectorAll('.pct-mode-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.mode === mode);
  });
  // Show/hide input groups
  document.querySelectorAll('.pct-inputs').forEach(el => {
    el.style.display = el.dataset.mode === mode ? 'block' : 'none';
  });
  hideResult('pct-result');
  hideError('pct-error');
}

function calcPercent() {
  hideError('pct-error');
  const fn = PCT_MODES[pctMode]?.fn;
  if (fn) fn();
}

// ────────────────────────────────────────────────
//  Loan Calculator
// ────────────────────────────────────────────────

// Monthly payment given principal, monthly rate, num months (Shpitzer)
function shpitzerPayment(P, monthlyRate, n) {
  if (monthlyRate === 0) return P / n;
  return P * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
}

// Find monthly interest rate from payment, principal, months using bisection
function findRate(P, payment, n) {
  // If payment * n <= P → impossible
  if (payment * n <= P) return null;

  let lo = 0.000001, hi = 5; // monthly rate bounds (up to 500% annual)
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const calcPmt = shpitzerPayment(P, mid, n);
    if (Math.abs(calcPmt - payment) < 0.001) return mid;
    if (calcPmt < payment) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

function buildAmortTable(P, monthlyRate, n, payment) {
  const rows = [];
  let balance = P;
  for (let i = 1; i <= n; i++) {
    const interest = balance * monthlyRate;
    const principal = payment - interest;
    balance -= principal;
    if (balance < 0.01) balance = 0;
    rows.push({ month: i, payment, interest, principal, balance });
  }
  return rows;
}

function renderAmortTable(rows) {
  const tbody = document.querySelector('#amort-table tbody');
  tbody.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.month}</td>
      <td>₪${fmt(r.payment, 0)}</td>
      <td>₪${fmt(r.principal, 0)}</td>
      <td>₪${fmt(r.interest, 0)}</td>
      <td>₪${fmt(r.balance, 0)}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Mode: forward = calculate monthly payment; reverse = calculate interest rate
let loanMode = 'forward';

function setLoanMode(mode) {
  loanMode = mode;
  document.querySelectorAll('.loan-mode-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.mode === mode);
  });
  document.querySelectorAll('.loan-inputs').forEach(el => {
    el.style.display = el.dataset.mode === mode ? 'block' : 'none';
  });
  hideResult('loan-result');
  hideError('loan-error');
  document.getElementById('amort-section').classList.remove('visible');
}

// Unit: years or months
let loanUnit = 'years';

function setLoanUnit(unit) {
  loanUnit = unit;
  document.querySelectorAll('.unit-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.unit === unit);
  });
}

function getMonths(fieldId) {
  const v = getVal(fieldId);
  if (v === null) return null;
  return loanUnit === 'years' ? Math.round(v * 12) : Math.round(v);
}

function calcLoan() {
  hideError('loan-error');
  hideResult('loan-result');
  document.getElementById('amort-section').classList.remove('visible');

  if (loanMode === 'forward') {
    const P = getVal('loan-amount');
    const n = getMonths('loan-period');
    const annualRate = getVal('loan-rate');

    if (P === null || n === null || annualRate === null)
      return showError('loan-error', 'יש למלא את כל השדות');
    if (P <= 0 || n <= 0 || annualRate < 0)
      return showError('loan-error', 'יש להזין ערכים חיוביים');

    const r = annualRate / 100 / 12;
    const pmt = shpitzerPayment(P, r, n);
    const totalPaid = pmt * n;
    const totalInterest = totalPaid - P;

    showResult('loan-result', `₪${fmt(pmt, 0)}`, 'החזר חודשי');

    // Summary
    document.getElementById('sum-total').textContent = `₪${fmt(totalPaid, 0)}`;
    document.getElementById('sum-interest').textContent = `₪${fmt(totalInterest, 0)}`;
    document.getElementById('sum-months').textContent = `${n} חודשים`;
    document.getElementById('sum-rate').textContent = `${fmt(annualRate)}%`;

    // Amort table
    const rows = buildAmortTable(P, r, n, pmt);
    renderAmortTable(rows);
    document.getElementById('amort-section').classList.add('visible');

  } else {
    // Reverse: find interest rate
    const P = getVal('loan-r-amount');
    const n = getMonths('loan-r-period');
    const pmt = getVal('loan-r-payment');

    if (P === null || n === null || pmt === null)
      return showError('loan-error', 'יש למלא את כל השדות');
    if (P <= 0 || n <= 0 || pmt <= 0)
      return showError('loan-error', 'יש להזין ערכים חיוביים');
    if (pmt * n <= P)
      return showError('loan-error', `ההחזר החודשי נמוך מדי — סה"כ תשלומים (₪${fmt(pmt * n, 0)}) חייב להיות גדול מסכום ההלוואה (₪${fmt(P, 0)})`);

    const monthlyRate = findRate(P, pmt, n);
    if (monthlyRate === null) return showError('loan-error', 'לא ניתן לחשב ריבית עבור הערכים שהוזנו');

    const annualRate = monthlyRate * 12 * 100;
    const totalPaid = pmt * n;
    const totalInterest = totalPaid - P;

    showResult('loan-result', `${fmt(annualRate)}%`, `ריבית שנתית | חודשית: ${fmt(monthlyRate * 100, 4)}%`);

    document.getElementById('sum-total').textContent = `₪${fmt(totalPaid, 0)}`;
    document.getElementById('sum-interest').textContent = `₪${fmt(totalInterest, 0)}`;
    document.getElementById('sum-months').textContent = `${n} חודשים`;
    document.getElementById('sum-rate').textContent = `${fmt(annualRate)}%`;

    const rows = buildAmortTable(P, monthlyRate, n, pmt);
    renderAmortTable(rows);
    document.getElementById('amort-section').classList.add('visible');
  }
}

// ────────────────────────────────────────────────
//  Init
// ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Percentage mode buttons
  document.querySelectorAll('.pct-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => setPctMode(btn.dataset.mode));
  });

  // Loan mode buttons
  document.querySelectorAll('.loan-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => setLoanMode(btn.dataset.mode));
  });

  // Unit toggle
  document.querySelectorAll('.unit-btn').forEach(btn => {
    btn.addEventListener('click', () => setLoanUnit(btn.dataset.unit));
  });

  // Calc buttons
  document.getElementById('btn-calc-pct').addEventListener('click', calcPercent);
  document.getElementById('btn-calc-loan').addEventListener('click', calcLoan);

  // Enter key support
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const tab = input.closest('.tab-content');
        if (tab?.id === 'tab-percent') calcPercent();
        if (tab?.id === 'tab-loan') calcLoan();
      }
    });
  });

  // Service worker registration
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  // Set initial states
  setPctMode('pct-of');
  setLoanMode('forward');
});
