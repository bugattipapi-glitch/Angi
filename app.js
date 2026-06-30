const COLORS = {
  angi: '#f15a5b', navy: '#0b2d42', blue: '#2c7da0', gold: '#f4b942',
  green: '#1b9a59', red: '#b94a48', orange: '#d97706', slate: '#64748b'
};

const pages = [...document.querySelectorAll('.page')];
const nav = document.getElementById('chapterNav');
pages.forEach((page, i) => {
  const a = document.createElement('a');
  a.href = `#${page.id}`;
  a.dataset.num = String(i + 1).padStart(2, '0');
  a.textContent = page.dataset.title;
  nav.appendChild(a);
});
const navLinks = [...nav.querySelectorAll('a')];

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
      currentIndex = pages.findIndex(p => p.id === entry.target.id);
      updatePresentCount();
    }
  });
}, { threshold: 0.55 });
pages.forEach(p => observer.observe(p));

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById('progressBar').style.width = `${Math.min(100, (scrollTop / docHeight) * 100)}%`;
});

function moneyK(n) { return `$${n.toFixed(n < 10 ? 1 : 0)}K`; }
function money(n) { return `$${Math.round(n).toLocaleString()}`; }
function pct(n) { return `${n.toFixed(n % 1 === 0 ? 0 : 1)}%`; }
function roas(n) { return `${n.toFixed(2)}x`; }

function verticalBars(el, data, opts = {}) {
  const node = typeof el === 'string' ? document.getElementById(el) : el;
  node.innerHTML = '';
  const max = opts.max ?? Math.max(...data.map(d => d.value));
  data.forEach(d => {
    const item = document.createElement('div');
    item.className = 'barItem';
    const val = document.createElement('div');
    val.className = 'barVal';
    val.textContent = d.display ?? d.value;
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${Math.max(2, (d.value / max) * 100)}%`;
    bar.style.background = d.color ?? COLORS.blue;
    const label = document.createElement('div');
    label.className = 'barLabel';
    label.textContent = d.label;
    item.append(val, bar, label);
    node.appendChild(item);
  });
}

function horizontalBars(el, data, opts = {}) {
  const node = typeof el === 'string' ? document.getElementById(el) : el;
  node.innerHTML = '';
  const max = opts.max ?? Math.max(...data.map(d => d.value));
  data.forEach(d => {
    const row = document.createElement('div');
    row.className = 'hRow';
    row.innerHTML = `
      <div class="hRowLabel">${d.label}</div>
      <div class="hTrack"><div class="hFill" style="width:${Math.max(2,(d.value/max)*100)}%; background:${d.color ?? COLORS.blue}"></div></div>
      <div class="hValue">${d.display}</div>`;
    node.appendChild(row);
  });
}

function createTable(el, headers, rows) {
  const table = typeof el === 'string' ? document.getElementById(el) : el;
  table.innerHTML = '';
  const thead = document.createElement('thead');
  thead.innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
  const tbody = document.createElement('tbody');
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = r.map(c => `<td>${c}</td>`).join('');
    tbody.appendChild(tr);
  });
  table.append(thead, tbody);
}

verticalBars('revenueChart', [
  { label: 'Spend', value: 90, display: '$90K', color: COLORS.angi },
  { label: 'Gross revenue', value: 312, display: '$312K', color: COLORS.blue },
  { label: 'Net revenue', value: 263, display: '$263K', color: COLORS.green },
], { max: 330 });

const funnel = [
  { stage: 'Leads', count: '1,062', conversion: '100%' },
  { stage: 'Set', count: '181', conversion: '17.0%', highlight: true },
  { stage: 'Issue', count: '136', conversion: '75.1%' },
  { stage: 'Demo', count: '117', conversion: '86.0%' },
  { stage: 'Sold', count: '40', conversion: '34.2%', final: true },
];
document.getElementById('funnelViz').innerHTML = funnel.map(f => `
  <div class="funnelStage ${f.highlight ? 'highlight' : ''} ${f.final ? 'final' : ''}">
    <span>${f.stage}</span><strong>${f.count}</strong><small>${f.conversion}</small>
  </div>`).join('');

verticalBars('conversionChart', [
  { label: 'Lead → Set', value: 17.0, display: '17.0%', color: COLORS.orange },
  { label: 'Set → Issue', value: 75.1, display: '75.1%', color: COLORS.blue },
  { label: 'Issue → Demo', value: 86.0, display: '86.0%', color: COLORS.green },
  { label: 'Demo → Sold', value: 34.2, display: '34.2%', color: COLORS.gold },
  { label: 'Lead → Sold', value: 3.8, display: '3.8%', color: COLORS.angi },
], { max: 100 });

verticalBars('callActivityChart', [
  { label: '≤20 calls', value: 3724, display: '3,724', color: COLORS.blue },
  { label: '>20 calls', value: 16630, display: '16,630', color: COLORS.orange },
], { max: 17000 });
verticalBars('callRevenueChart', [
  { label: '≤20 calls', value: 263, display: '$262.7K', color: COLORS.green },
  { label: '>20 calls', value: 0.1, display: '$0', color: COLORS.red },
], { max: 270 });
verticalBars('agedLeadChart', [
  { label: '<10 calls', value: 355, display: '355 / 47%', color: COLORS.blue },
  { label: '10–19 calls', value: 76, display: '76 / 10%', color: COLORS.gold },
  { label: '20+ calls', value: 332, display: '332 / 44%', color: COLORS.orange },
], { max: 380 });

const stateProduct = [
  { segment: 'RI Patio Slider', leads: 2, spend: 0.2, revenue: 5.3, roas: 31.08, color: COLORS.green },
  { segment: 'NJ Patio Slider', leads: 17, spend: 1.4, revenue: 25.5, roas: 17.69, color: COLORS.green },
  { segment: 'NJ Windows', leads: 116, spend: 9.8, revenue: 40.7, roas: 4.14, color: COLORS.green },
  { segment: 'DE Doors', leads: 68, spend: 5.8, revenue: 22.7, roas: 3.93, color: COLORS.gold },
  { segment: 'CT Doors', leads: 124, spend: 10.5, revenue: 40.0, roas: 3.81, color: COLORS.blue },
  { segment: 'VA Doors', leads: 124, spend: 10.5, revenue: 39.9, roas: 3.79, color: COLORS.blue },
  { segment: 'NY Doors', leads: 59, spend: 5.0, revenue: 17.5, roas: 3.50, color: COLORS.blue },
  { segment: 'RI Doors', leads: 56, spend: 4.7, revenue: 10.6, roas: 2.23, color: COLORS.orange },
  { segment: 'NJ Doors', leads: 365, spend: 30.9, revenue: 60.6, roas: 1.96, color: COLORS.angi },
  { segment: 'CT Windows', leads: 63, spend: 5.3, revenue: 0, roas: 0, color: COLORS.red },
  { segment: 'NY Windows', leads: 39, spend: 3.3, revenue: 0, roas: 0, color: COLORS.red },
  { segment: 'PA Doors', leads: 11, spend: 0.9, revenue: 0, roas: 0, color: COLORS.red },
  { segment: 'CT Patio Slider', leads: 4, spend: 0.3, revenue: 0, roas: 0, color: COLORS.red },
  { segment: 'DE Patio Slider', leads: 4, spend: 0.3, revenue: 0, roas: 0, color: COLORS.red },
  { segment: 'VA Patio Slider', leads: 4, spend: 0.3, revenue: 0, roas: 0, color: COLORS.red },
  { segment: 'NY Patio Slider', leads: 3, spend: 0.3, revenue: 0, roas: 0, color: COLORS.red },
];
const maxStateRoas = Math.max(...stateProduct.map(d => d.roas));
const minStateRoas = Math.min(...stateProduct.map(d => d.roas));
function roasCell(d) {
  const klass = d.roas === maxStateRoas ? 'roasHigh' : d.roas === minStateRoas ? 'roasLow' : '';
  return `<span class="${klass}">${roas(d.roas)}</span>`;
}
createTable('stateProductTable', ['State / Product', 'Leads', 'Est. Spend', 'Net Revenue', 'Net ROAS'],
  [...stateProduct]
    .sort((a, b) => b.leads - a.leads)
    .map(d => [d.segment, d.leads.toLocaleString(), moneyK(d.spend), moneyK(d.revenue), roasCell(d)]));

const stateChartTitle = document.getElementById('stateChartTitle');
const stateChartSub = document.getElementById('stateChartSub');
function renderStateChart(type = 'spend') {
  const config = {
    spend: { key: 'spend', title: 'Estimated spend', sub: 'Sorted by lead volume', formatter: moneyK },
    roas: { key: 'roas', title: 'Net ROAS', sub: 'Sorted by lead volume', formatter: roas },
    revenue: { key: 'revenue', title: 'Net revenue', sub: 'Sorted by lead volume', formatter: moneyK },
  }[type];
  stateChartTitle.textContent = config.title;
  stateChartSub.textContent = config.sub;
  const data = [...stateProduct]
    .sort((a, b) => b.leads - a.leads)
    .map(d => ({
      label: d.segment,
      value: d[config.key],
      display: config.formatter(d[config.key]),
      color: type === 'roas' && d.roas === maxStateRoas ? COLORS.green : type === 'roas' && d.roas === minStateRoas ? COLORS.red : d.color
    }));
  horizontalBars('stateProductChart', data, { max: Math.max(...data.map(d => d.value)) || 1 });
}
renderStateChart();
document.querySelectorAll('[data-chart]').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('[data-chart]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderStateChart(btn.dataset.chart);
}));

const quadrants = [
  { id: 'scale', title: 'Scale / protect', color: COLORS.green, items: ['NJ Windows: 116 leads | 4.14x ROAS', 'CT Doors: 124 leads | 3.81x ROAS', 'VA Doors: 124 leads | 3.79x ROAS', 'DE Doors: 68 leads | 3.93x ROAS', 'NY Doors: 59 leads | 3.50x ROAS'] },
  { id: 'optimize', title: 'Optimize core', color: COLORS.orange, items: ['NJ Doors: largest segment | 1.96x ROAS', 'RI Doors: 56 leads | 2.23x ROAS', 'Improve routing + close discipline while protecting core volume'] },
  { id: 'test', title: 'Test carefully', color: COLORS.gold, items: ['NJ Patio Slider: 17 leads | 17.69x ROAS', 'RI Patio Slider: 2 leads | 31.08x ROAS', 'Strong signal, low sample — validate with controlled volume'] },
  { id: 'pause', title: 'Investigate / pause', color: COLORS.red, items: ['CT Windows: 63 leads | $0 net revenue', 'NY Windows: 39 leads | $0 net revenue', 'PA Doors: 11 leads | $0 net revenue', 'Review fit, pricing, availability, and lead quality'] },
];
const filterWrap = document.getElementById('matrixFilters');
filterWrap.innerHTML = `<button class="chip active" data-filter="all">All</button>` + quadrants.map(q => `<button class="chip" data-filter="${q.id}">${q.title}</button>`).join('');
document.getElementById('growthMatrix').innerHTML = quadrants.map(q => `
  <article class="quadrant" data-quad="${q.id}" style="border-color:${q.color}">
    <h3 style="background:${q.color}">${q.title}</h3>
    <ul>${q.items.map(i => `<li>${i}</li>`).join('')}</ul>
  </article>`).join('');
filterWrap.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
  filterWrap.querySelectorAll('button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const f = btn.dataset.filter;
  document.querySelectorAll('[data-quad]').forEach(q => q.classList.toggle('hide', f !== 'all' && q.dataset.quad !== f));
}));

const roadmap = [
  { title: 'Week 1: setup', items: ['Enable automated responses', 'Confirm lead ownership / CRM routing', 'Define lead lifecycle stages'] },
  { title: 'Weeks 2–3: run sprint', items: ['15-minute speed-to-lead SLA', 'Multi-channel outreach cadence', 'Daily review of new + high-intent leads'] },
  { title: 'Week 4: inspect', items: ['Review set rate by state/product', 'Audit >20-call exceptions', 'Identify scale-ready segments'] },
  { title: 'Next QBR', items: ['Compare conversion vs. baseline', 'Finalize budget reallocation', 'Approve controlled expansion test'] },
];
document.getElementById('roadmap').innerHTML = roadmap.map((r, i) => `
  <article class="roadItem"><span>${i + 1}</span><h3>${r.title}</h3><ul>${r.items.map(v => `<li>${v}</li>`).join('')}</ul></article>`).join('');

const scenarioMap = {
  17: { sold: 40, rev: 262.7, roas: 2.92 },
  18: { sold: 42, rev: 275.9, roas: 3.07 },
  19: { sold: 45, rev: 295.6, roas: 3.28 },
  20: { sold: 47, rev: 308.7, roas: 3.43 },
  21: { sold: 49, rev: 321.8, roas: 3.58 },
  22: { sold: 52, rev: 341.5, roas: 3.79 },
  23: { sold: 54, rev: 354.6, roas: 3.94 },
  24: { sold: 56, rev: 367.8, roas: 4.09 },
  25: { sold: 59, rev: 387.5, roas: 4.31 },
};
const setRateSlider = document.getElementById('setRateSlider');
function renderScenario() {
  const rate = setRateSlider.value;
  const s = scenarioMap[rate];
  document.getElementById('scenarioMetrics').innerHTML = `
    <div class="miniMetric"><span>Lead → Set</span><b>${rate}%</b></div>
    <div class="miniMetric"><span>Estimated sold</span><b>${s.sold}</b></div>
    <div class="miniMetric"><span>Net revenue</span><b>${moneyK(s.rev)}</b></div>
    <div class="miniMetric"><span>Net ROAS</span><b>${roas(s.roas)}</b></div>`;
  verticalBars('scenarioChart', [
    { label: 'Current 17%', value: 262.7, display: '$263K', color: COLORS.blue },
    { label: `${rate}% scenario`, value: s.rev, display: moneyK(s.rev), color: COLORS.green },
  ], { max: 400 });
}
setRateSlider.addEventListener('input', renderScenario);
renderScenario();

const spendSlider = document.getElementById('spendSlider');
function renderSpendScenario() {
  const spend = Number(spendSlider.value);
  const baselineSpend = 15000;
  const baselineRevenue = 262686 / 6;
  const baselineRoas = baselineRevenue / baselineSpend;
  const smarterIncrementalRoas = 4.19;
  const incrementalRevenue = spend * smarterIncrementalRoas;
  const projectedRevenue = baselineRevenue + incrementalRevenue;
  const projectedSpend = baselineSpend + spend;
  const projectedRoas = projectedRevenue / projectedSpend;
  const lift = projectedRoas - baselineRoas;
  document.getElementById('spendScenarioMetrics').innerHTML = `
    <div class="miniMetric"><span>Incremental spend</span><b>${money(spend)}</b></div>
    <div class="miniMetric"><span>Smarter spend ROAS</span><b>${roas(smarterIncrementalRoas)}</b></div>
    <div class="miniMetric"><span>Projected net ROAS</span><b>${roas(projectedRoas)}</b></div>
    <div class="miniMetric"><span>Estimated lift</span><b>+${roas(lift)}</b></div>`;
  verticalBars('spendScenarioChart', [
    { label: 'Current monthly', value: baselineRevenue / 1000, display: moneyK(baselineRevenue / 1000), color: COLORS.blue },
    { label: 'Projected monthly', value: projectedRevenue / 1000, display: moneyK(projectedRevenue / 1000), color: COLORS.green },
  ], { max: 80 });
}
spendSlider.addEventListener('input', renderSpendScenario);
renderSpendScenario();

createTable('measurementTable', ['Focus area', 'Primary metric', 'Watch metric', 'Action trigger'], [
  ['Response discipline', 'Speed-to-lead', '% first touch <15 minutes', 'Automated response enabled'],
  ['Lead lifecycle', 'New leads by status', '30+ day unset volume', '>20-call exceptions'],
  ['Funnel health', 'Lead → Set', 'Issue → Demo', 'Demo → Sold'],
  ['Economics', 'Net ROAS', 'Cost per sold job', 'Net revenue per lead'],
  ['Allocation', 'State/product ROAS', 'Budget mix by segment', 'Capacity by state/product'],
]);

let currentIndex = 0;
const controls = document.getElementById('presentControls');
function updatePresentCount() {
  const count = document.getElementById('presentCount');
  if (count) count.textContent = `${currentIndex + 1} / ${pages.length}`;
}
function goToIndex(i) {
  currentIndex = Math.max(0, Math.min(pages.length - 1, i));
  pages[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
  updatePresentCount();
}
document.getElementById('presentBtn').addEventListener('click', () => {
  document.body.classList.add('presenting');
  controls.hidden = false;
  updatePresentCount();
});
document.getElementById('exitPresent').addEventListener('click', () => {
  document.body.classList.remove('presenting');
  controls.hidden = true;
});
document.getElementById('nextSlide').addEventListener('click', () => goToIndex(currentIndex + 1));
document.getElementById('prevSlide').addEventListener('click', () => goToIndex(currentIndex - 1));
document.getElementById('overviewBtn').addEventListener('click', () => document.getElementById('summary').scrollIntoView({ behavior: 'smooth' }));
window.addEventListener('keydown', e => {
  if (!document.body.classList.contains('presenting')) return;
  if (e.key === 'ArrowRight' || e.key === 'PageDown') goToIndex(currentIndex + 1);
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') goToIndex(currentIndex - 1);
  if (e.key === 'Escape') document.getElementById('exitPresent').click();
});
