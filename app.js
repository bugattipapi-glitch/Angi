const fmtCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const fmtNumber = new Intl.NumberFormat("en-US");

const funnelData = [
  { label: "Leads", value: "1,062", note: "Angi leads received", fill: 1 },
  { label: "Set", value: "181", note: "17.0% of leads", fill: 0.72 },
  { label: "Issue", value: "136", note: "75.1% of set appts.", fill: 0.6 },
  { label: "Demo", value: "117", note: "86.0% of issued", fill: 0.52 },
  { label: "Sold", value: "40", note: "34.2% of demos", fill: 0.34 },
];

const callRows = [
  { label: "<=20 calls", leads: 718, calls: 3724, sold: 39, net: 262686 },
  { label: ">20 calls", leads: 344, calls: 16630, sold: 1, net: 0 },
];

const stateProduct = [
  { key: "RI Patio Slider", leads: 2, estSpend: 169, netRevenue: 5267, netRoas: 31.08, category: "test" },
  { key: "NJ Patio Slider", leads: 17, estSpend: 1441, netRevenue: 25492, netRoas: 17.69, category: "test" },
  { key: "NJ Windows", leads: 116, estSpend: 9831, netRevenue: 40658, netRoas: 4.14, category: "scale" },
  { key: "DE Doors", leads: 68, estSpend: 5763, netRevenue: 22650, netRoas: 3.93, category: "scale" },
  { key: "CT Doors", leads: 124, estSpend: 10508, netRevenue: 40045, netRoas: 3.81, category: "scale" },
  { key: "VA Doors", leads: 124, estSpend: 10508, netRevenue: 39875, netRoas: 3.79, category: "scale" },
  { key: "NY Doors", leads: 59, estSpend: 5000, netRevenue: 17497, netRoas: 3.5, category: "scale" },
  { key: "RI Doors", leads: 56, estSpend: 4746, netRevenue: 10600, netRoas: 2.23, category: "optimize" },
  { key: "NJ Doors", leads: 365, estSpend: 30932, netRevenue: 60602, netRoas: 1.96, category: "optimize" },
  { key: "CT Windows", leads: 63, estSpend: 5339, netRevenue: 0, netRoas: 0, category: "investigate" },
  { key: "NY Windows", leads: 39, estSpend: 3305, netRevenue: 0, netRoas: 0, category: "investigate" },
  { key: "PA Doors", leads: 11, estSpend: 932, netRevenue: 0, netRoas: 0, category: "investigate" },
  { key: "CT Patio Slider", leads: 4, estSpend: 339, netRevenue: 0, netRoas: 0, category: "test" },
  { key: "DE Patio Slider", leads: 4, estSpend: 339, netRevenue: 0, netRoas: 0, category: "test" },
  { key: "VA Patio Slider", leads: 4, estSpend: 339, netRevenue: 0, netRoas: 0, category: "test" },
  { key: "NY Patio Slider", leads: 3, estSpend: 254, netRevenue: 0, netRoas: 0, category: "test" },
];

const matrix = [
  {
    id: "scale",
    title: "Scale / protect",
    copy: "Positive ROAS with enough volume to justify immediate moderate investment.",
    items: ["NJ Windows", "CT Doors", "VA Doors", "DE Doors", "NY Doors"],
  },
  {
    id: "test",
    title: "Test carefully",
    copy: "Strong signal or strategic fit, but lower sample size requires a capped test.",
    items: ["NJ Patio Slider", "RI Patio Slider", "Other Patio Slider pockets"],
  },
  {
    id: "optimize",
    title: "Optimize core",
    copy: "Important volume pools where conversion discipline should improve return.",
    items: ["NJ Doors", "RI Doors"],
  },
  {
    id: "investigate",
    title: "Investigate / pause",
    copy: "Low or no net return in current data; inspect targeting and lead handling.",
    items: ["CT Windows", "NY Windows", "PA Doors"],
  },
];

function initFunnel() {
  const root = document.querySelector("#funnelGrid");
  root.innerHTML = funnelData
    .map(
      (item) => `
        <article class="funnel-card" style="--fill:${item.fill}">
          <span>${item.label}</span>
          <strong>${item.value}</strong>
          <p>${item.note}</p>
        </article>
      `,
    )
    .join("");
}

function initCallComparison() {
  const maxCalls = Math.max(...callRows.map((row) => row.calls));
  const root = document.querySelector("#callComparison");
  root.innerHTML = `
    <div class="chart-title">
      <strong>Lead effort comparison</strong>
      <span>Numbers shown by segment</span>
    </div>
    ${callRows
      .map((row) => {
        const width = Math.max(6, (row.calls / maxCalls) * 100);
        return `
          <div class="comparison-row">
            <span>${row.label}</span>
            <span class="bar-track"><span style="width:${width}%"></span></span>
            <b>${fmtNumber.format(row.calls)} calls</b>
          </div>
          <div class="comparison-row">
            <span>Leads</span>
            <span class="bar-track"><span style="width:${Math.max(6, (row.leads / 718) * 100)}%"></span></span>
            <b>${fmtNumber.format(row.leads)}</b>
          </div>
          <div class="comparison-row">
            <span>Sold</span>
            <span class="bar-track"><span style="width:${Math.max(3, (row.sold / 39) * 100)}%"></span></span>
            <b>${fmtNumber.format(row.sold)}</b>
          </div>
          <div class="comparison-row">
            <span>Net rev.</span>
            <span class="bar-track"><span style="width:${row.net ? 100 : 3}%"></span></span>
            <b>${fmtCurrency.format(row.net)}</b>
          </div>
        `;
      })
      .join("")}
  `;
}

function metricValue(row, metric) {
  if (metric === "estSpend") return row.estSpend;
  if (metric === "netRevenue") return row.netRevenue;
  return row.netRoas;
}

function metricLabel(value, metric) {
  if (metric === "netRoas") return `${value.toFixed(2)}x`;
  return fmtCurrency.format(value);
}

function renderStateProduct(metric = "estSpend") {
  const titleMap = {
    estSpend: "Estimated spend by state/product",
    netRevenue: "Net revenue by state/product",
    netRoas: "Net ROAS by state/product",
  };
  document.querySelector("#stateChartTitle").textContent = titleMap[metric];

  const sorted = [...stateProduct].sort((a, b) => metricValue(b, metric) - metricValue(a, metric));
  const max = Math.max(...sorted.map((row) => metricValue(row, metric))) || 1;
  const maxRoas = Math.max(...stateProduct.map((row) => row.netRoas));
  const minRoas = Math.min(...stateProduct.map((row) => row.netRoas));

  document.querySelector("#stateBars").innerHTML = sorted
    .slice(0, 10)
    .map((row) => {
      const value = metricValue(row, metric);
      const width = Math.max(3, (value / max) * 100);
      const tone = row.netRoas === maxRoas ? "high" : row.netRoas === minRoas ? "low" : "";
      return `
        <div class="dynamic-bar">
          <span class="dynamic-label">${row.key}</span>
          <span class="dynamic-track ${tone}"><span style="width:${width}%"></span></span>
          <strong class="dynamic-value">${metricLabel(value, metric)}</strong>
        </div>
      `;
    })
    .join("");

  document.querySelector("#stateTable").innerHTML = stateProduct
    .map((row) => {
      const className = row.netRoas === maxRoas ? "high-roas" : row.netRoas === minRoas ? "low-roas" : "";
      return `
        <tr class="${className}">
          <td>${row.key}</td>
          <td>${fmtNumber.format(row.leads)}</td>
          <td>${fmtCurrency.format(row.estSpend)}</td>
          <td>${fmtCurrency.format(row.netRevenue)}</td>
          <td>${row.netRoas.toFixed(2)}x</td>
        </tr>
      `;
    })
    .join("");
}

function initMetricButtons() {
  document.querySelectorAll(".toolbar .chip").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".toolbar .chip").forEach((chip) => chip.classList.remove("active"));
      button.classList.add("active");
      renderStateProduct(button.dataset.metric);
    });
  });
}

function renderMatrix(filter = "all") {
  const root = document.querySelector("#matrixGrid");
  const cards = filter === "all" ? matrix : matrix.filter((card) => card.id === filter);
  root.innerHTML = cards
    .map(
      (card) => `
        <article class="matrix-card ${card.id}">
          <h3>${card.title}</h3>
          <p>${card.copy}</p>
          <ul>${card.items.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
      `,
    )
    .join("");
}

function initMatrixButtons() {
  document.querySelectorAll(".matrix-controls .chip").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".matrix-controls .chip").forEach((chip) => chip.classList.remove("active"));
      button.classList.add("active");
      renderMatrix(button.dataset.filter);
    });
  });
}

function renderScenario() {
  const slider = document.querySelector("#spendSlider");
  const spend = Number(slider.value);
  const baselineSpend = 15000;
  const baselineMonthlyRevenue = 262686 / 6;
  const blendedIncrementalRoas = 4.19;
  const incrementalRevenue = spend * blendedIncrementalRoas;
  const totalSpend = baselineSpend + spend;
  const projectedRevenue = baselineMonthlyRevenue + incrementalRevenue;
  const projectedRoas = projectedRevenue / totalSpend;

  document.querySelector("#spendValue").textContent = fmtCurrency.format(spend);
  document.querySelector("#scenarioResults").innerHTML = `
    <article class="scenario-card">
      <span>Incremental revenue</span>
      <strong>${fmtCurrency.format(incrementalRevenue)}</strong>
      <p>Estimated monthly net revenue from smarter incremental spend.</p>
    </article>
    <article class="scenario-card">
      <span>Projected monthly revenue</span>
      <strong>${fmtCurrency.format(projectedRevenue)}</strong>
      <p>Baseline monthly net revenue plus incremental return.</p>
    </article>
    <article class="scenario-card">
      <span>Projected net ROAS</span>
      <strong>${projectedRoas.toFixed(2)}x</strong>
      <p>Total projected net revenue divided by total monthly spend.</p>
    </article>
    <article class="scenario-card">
      <span>Recommended posture</span>
      <strong>${spend <= 3500 ? "Moderate" : "Aggressive"}</strong>
      <p>${spend <= 3500 ? "Good fit for an immediate test before the next call." : "Useful upside case, but monitor capacity and conversion closely."}</p>
    </article>
  `;
}

function initScenario() {
  const slider = document.querySelector("#spendSlider");
  slider.addEventListener("input", renderScenario);
  renderScenario();
}

function initNavSpy() {
  const links = [...document.querySelectorAll(".topnav a")];
  const sections = [...document.querySelectorAll(".section")];
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    },
    { threshold: [0.35, 0.6] },
  );
  sections.forEach((section) => observer.observe(section));
}

function initPresentMode() {
  const sections = [...document.querySelectorAll(".section")];
  const toggle = document.querySelector("#presentToggle");
  const prev = document.querySelector("#prevSection");
  const next = document.querySelector("#nextSection");
  const counter = document.querySelector("#sectionCounter");
  let index = 0;

  function update() {
    sections.forEach((section, idx) => section.classList.toggle("current", idx === index));
    counter.textContent = `${index + 1} / ${sections.length}`;
    if (document.body.classList.contains("presenting")) {
      sections[index].scrollIntoView({ block: "start" });
    }
  }

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("presenting");
    toggle.textContent = document.body.classList.contains("presenting") ? "Exit present mode" : "Present mode";
    const current = sections.findIndex((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= 120 && rect.bottom > 120;
    });
    index = current >= 0 ? current : index;
    update();
  });

  prev.addEventListener("click", () => {
    index = Math.max(0, index - 1);
    update();
  });

  next.addEventListener("click", () => {
    index = Math.min(sections.length - 1, index + 1);
    update();
  });

  window.addEventListener("keydown", (event) => {
    if (!document.body.classList.contains("presenting")) return;
    if (event.key === "ArrowRight" || event.key === "PageDown") next.click();
    if (event.key === "ArrowLeft" || event.key === "PageUp") prev.click();
    if (event.key === "Escape") toggle.click();
  });

  update();
}

initFunnel();
initCallComparison();
renderStateProduct();
initMetricButtons();
renderMatrix();
initMatrixButtons();
initScenario();
initNavSpy();
initPresentMode();
