'use strict';

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  // Outline icons, 24px grid, 2px stroke (Lucide style).
  const ICONS = {
    refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>',
    basket: '<path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="M4.5 15.5h15"/><path d="m5 11 4-7"/><path d="m9 11 1 9"/>',
    wheat: '<path d="M12 22V8"/><path d="M12 8c-2.2-.2-3.6-1.6-3.6-3.8C10.6 4.4 12 5.8 12 8Z"/><path d="M12 8c2.2-.2 3.6-1.6 3.6-3.8C13.4 4.4 12 5.8 12 8Z"/><path d="M12 14c-2.8 0-4.6-1.6-4.8-4.2 2.8 0 4.6 1.6 4.8 4.2Z"/><path d="M12 14c2.8 0 4.6-1.6 4.8-4.2-2.8 0-4.6 1.6-4.8 4.2Z"/><path d="M12 20c-2.8 0-4.6-1.6-4.8-4.2 2.8 0 4.6 1.6 4.8 4.2Z"/><path d="M12 20c2.8 0 4.6-1.6 4.8-4.2-2.8 0-4.6 1.6-4.8 4.2Z"/>',
    bread: '<path d="M5 20h14v-7c2 0 3-1.5 3-3.5S20 6 17 6H7C4 6 2 7.5 2 9.5S3 13 5 13Z"/><path d="m9 10 1 3"/><path d="m14 10 1 3"/>',
    croissant: '<path d="M3 16c0-6 4-11 9-11s9 5 9 11l-3 2-3-3-3 3-3-3-3 3Z"/><path d="m9 6 1 7"/><path d="m15 6-1 7"/>',
    cake: '<path d="M3 21h18V13a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z"/><path d="M3 16c3 2 6-2 9 0s6 2 9 0"/><path d="M12 11V7"/><path d="M12 4c1 1.3 1 2.2 0 3-1-.8-1-1.7 0-3Z"/>',
    coffee: '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',
    home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    package: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  };
  const icon = (name, size = 32) =>
    `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;
  const hydrateIcons = (root = document) =>
    $$('[data-icon]', root).forEach((el) => { el.innerHTML = icon(el.dataset.icon, Number(el.dataset.size) || 32); });

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Formatting. Money is integer cents everywhere.
  const money = (opts) => new Intl.NumberFormat(CONFIG.locale, { style: 'currency', currency: CONFIG.currency, ...opts });
  const money0 = money({ maximumFractionDigits: 0 });
  const money2 = money({ minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const moneyCompact = money({ notation: 'compact', maximumFractionDigits: 1 });
  const fmt0 = (c) => money0.format(c / 100);
  const fmt2 = (c) => money2.format(c / 100);
  const fmtCompact = (c) => moneyCompact.format(c / 100);
  const fmtInt = new Intl.NumberFormat(CONFIG.locale);
  const dfDate = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  const dfWeekday = new Intl.DateTimeFormat('en-GB', { weekday: 'short' });
  const dfTime = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' });
  const pad2 = (n) => String(n).padStart(2, '0');

  function loadPref(key, fallback) {
    try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
  }
  function savePref(key, value) {
    try { localStorage.setItem(key, value); } catch { /* storage can be blocked; the page works without it */ }
  }

  const params = new URLSearchParams(location.search);
  const demoState = params.get('state'); // error | empty | offline, used to preview the non-happy states
  const PERIODS = ['today', 'week', 'month'];
  const state = {
    view: 'home',
    period: PERIODS.includes(loadPref('bakery.period', 'today')) ? loadPref('bakery.period', 'today') : 'today',
    category: null,
    sales: null,
    asOf: null,
    updatedAt: null,
    error: false,
    offline: demoState === 'offline' || !navigator.onLine,
    forceError: demoState === 'error',
    tableView: false,
    selected: null,
  };
  let chartData = null;
  let chartMeta = null;

  // Demo "now": today's sales are simulated up to the current time, but never earlier than noon,
  // so the first look is not empty when the page is opened in the morning.
  function fetchSales() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (state.forceError) { reject(new Error('Simulated load failure')); return; }
        const now = new Date();
        const noon = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
        const asOf = now > noon ? now : noon;
        resolve({ asOf, sales: demoState === 'empty' ? [] : generateSales(asOf) });
      }, 600);
    });
  }

  const at = (day, hour) => new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour).getTime();

  // Current window, previous window to compare with, and the chart buckets for each period.
  function periodWindow(period, asOf) {
    const sod = startOfDay(asOf);
    const end = asOf.getTime() + 1;
    const buckets = [];

    if (period === 'today') {
      const prevDay = addDays(sod, -7);
      for (let h = CONFIG.openHour; h < CONFIG.closeHour; h++) {
        buckets.push({
          start: at(sod, h), end: at(sod, h + 1), pStart: at(prevDay, h), pEnd: at(prevDay, h + 1),
          label: pad2(h), full: `${pad2(h)}:00 to ${pad2(h + 1)}:00`,
          isNow: asOf.getHours() === h,
        });
      }
      return {
        cur: [sod.getTime(), end], prev: [prevDay.getTime(), addDays(asOf, -7).getTime() + 1], buckets,
        compare: 'Change compared with the same weekday last week, up to the same hour.',
        unit: 'hour', title: 'Sales by hour', empty: 'No sales yet today',
      };
    }

    const n = period === 'week' ? 7 : 30;
    for (let i = 0; i < n; i++) {
      const day = addDays(sod, -(n - 1) + i);
      const prevDay = addDays(day, -n);
      buckets.push({
        start: day.getTime(), end: addDays(day, 1).getTime(), pStart: prevDay.getTime(), pEnd: addDays(prevDay, 1).getTime(),
        label: period === 'week' ? dfWeekday.format(day) : String(day.getDate()),
        full: dfDate.format(day), isNow: i === n - 1,
      });
    }
    return {
      cur: [buckets[0].start, end], prev: [buckets[0].pStart, buckets[0].start], buckets,
      compare: period === 'week' ? 'Change compared with the previous 7 days.' : 'Change compared with the previous 30 days.',
      unit: 'day', title: period === 'week' ? 'Sales by day, last 7 days' : 'Sales by day, last 30 days', empty: 'No sales in this period',
    };
  }

  /* ---------- Render ---------- */

  function periodLabel() {
    return { today: 'Today', week: 'Last 7 days', month: 'Last 30 days' }[state.period];
  }

  function deltaChip(cur, prev, versus) {
    if (!prev) return '<span class="delta flat" aria-label="No data for the previous period">&ndash; n/a</span>';
    const pct = ((cur - prev) / prev) * 100;
    if (Math.abs(pct) < 0.5) return `<span class="delta flat" aria-label="Flat versus ${versus}">&ndash; 0%</span>`;
    const abs = Math.abs(pct).toFixed(1);
    return pct > 0
      ? `<span class="delta up" aria-label="Up ${abs} percent versus ${versus}">&#9650; +${abs}%</span>`
      : `<span class="delta down" aria-label="Down ${abs} percent versus ${versus}">&#9660; -${abs}%</span>`;
  }

  function renderKpis(cur, prev, win) {
    const versus = state.period === 'today' ? 'last week' : state.period === 'week' ? 'the previous 7 days' : 'the previous 30 days';
    const avg = (a) => (a.orders ? Math.round(a.revenue / a.orders) : 0);
    const kpis = [
      { label: 'Revenue', icon: 'wallet', text: fmt0(cur.revenue), c: cur.revenue, p: prev.revenue },
      { label: 'Orders', icon: 'receipt', text: fmtInt.format(cur.orders), c: cur.orders, p: prev.orders },
      { label: 'Avg order', icon: 'basket', text: cur.orders ? fmt2(avg(cur)) : '—', c: avg(cur), p: avg(prev) },
      { label: 'Items sold', icon: 'wheat', text: fmtInt.format(cur.items), c: cur.items, p: prev.items },
    ];
    $('#kpis').innerHTML = kpis.map((k) => `
      <article class="kpi">
        <div class="kpi-top"><span class="kpi-icon">${icon(k.icon, 40)}</span>${deltaChip(k.c, k.p, versus)}</div>
        <h3 class="kpi-label">${k.label}</h3>
        <p class="kpi-value${k.text.length > 6 ? ' long' : ''}">${k.text}</p>
      </article>`).join('');
    $('#compare-note').textContent = win.compare;
  }

  const niceMax = (v) => {
    const pow = 10 ** Math.floor(Math.log10(v));
    return ([1, 2, 2.5, 5, 10].map((m) => m * pow).find((c) => c >= v)) || 10 * pow;
  };

  function buildChartData(win) {
    const prevCut = win.prev[1];
    return win.buckets.map((b) => ({
      label: b.label, full: b.full, isNow: b.isNow,
      cur: aggregate(state.sales, b.start, b.end, state.category).revenue,
      prev: b.pStart < prevCut ? aggregate(state.sales, b.pStart, b.pEnd, state.category).revenue : null,
      future: state.period === 'today' && b.start > state.asOf.getTime(),
    }));
  }

  function drawChart() {
    const wrap = $('#chart');
    if (!chartData) return;
    const W = Math.max(280, wrap.clientWidth || 320);
    const H = 220;
    const m = { l: 48, r: 8, t: 12, b: 28 };
    const iw = W - m.l - m.r;
    const ih = H - m.t - m.b;
    const n = chartData.length;
    const max = niceMax(Math.max(1, ...chartData.map((d) => Math.max(d.cur, d.prev || 0))));
    const slot = iw / n;
    const bw = Math.max(4, slot * 0.68);
    const y = (v) => m.t + ih - (v / max) * ih;
    const cx = (i) => m.l + slot * i + slot / 2;
    const step = Math.ceil(n / 6);

    let out = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" tabindex="0" aria-label="${esc(chartMeta.title)}. Use the table view for exact values.">`;
    [0, 0.5, 1].forEach((f) => {
      const gy = y(max * f);
      out += `<line class="grid" x1="${m.l}" x2="${W - m.r}" y1="${gy}" y2="${gy}"/><text x="${m.l - 6}" y="${gy + 4}" text-anchor="end">${fmtCompact(max * f)}</text>`;
    });
    chartData.forEach((d, i) => {
      const h = Math.max(d.cur ? 2 : 0, (d.cur / max) * ih);
      const cls = `bar${d.isNow ? ' now' : ''}${state.selected === i ? ' sel' : ''}`;
      out += `<rect class="${cls}" data-i="${i}" x="${cx(i) - bw / 2}" y="${m.t + ih - h}" width="${bw}" height="${h}" rx="3"/>`;
      if (i % step === 0) out += `<text x="${cx(i)}" y="${H - 8}" text-anchor="middle">${esc(d.label)}</text>`;
    });
    const pts = chartData.map((d, i) => (d.prev === null ? null : [cx(i), y(d.prev)])).filter(Boolean);
    if (pts.length > 1) out += `<polyline class="prev-line" points="${pts.map((p) => p.join(',')).join(' ')}"/>`;
    if (n <= 15) pts.forEach((p) => { out += `<circle class="prev-dot" cx="${p[0]}" cy="${p[1]}" r="4"/>`; });
    chartData.forEach((_, i) => { out += `<rect class="hit" data-i="${i}" x="${m.l + slot * i}" y="0" width="${slot}" height="${H}"/>`; });
    out += '</svg>';
    wrap.innerHTML = out;
    wrap._geo = { m, slot, W, max, ih, y, cx };

    const svg = wrap.firstElementChild;
    const pick = (e) => {
      const rect = svg.getBoundingClientRect();
      const i = Math.min(n - 1, Math.max(0, Math.floor((e.clientX - rect.left - m.l) / slot)));
      showTip(i);
    };
    svg.addEventListener('pointerdown', pick);
    svg.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' || e.buttons) pick(e); });
    svg.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const next = state.selected === null ? 0 : state.selected + (e.key === 'ArrowRight' ? 1 : -1);
      showTip(Math.min(n - 1, Math.max(0, next)));
    });
    if (state.selected !== null) showTip(state.selected);
  }

  function showTip(i) {
    const d = chartData && chartData[i];
    const wrap = $('#chart');
    if (!d || !wrap._geo) return;
    state.selected = i;
    $$('#chart .bar').forEach((r) => r.classList.toggle('sel', Number(r.dataset.i) === i));
    const tip = $('#tip');
    tip.hidden = false;
    tip.innerHTML = `<strong>${esc(d.full)}</strong><br>Revenue ${fmt0(d.cur)}${d.prev === null ? '' : `<br>Previous ${fmt0(d.prev)}`}`;
    const { m, W, ih, y, cx } = wrap._geo;
    const left = Math.min(W - tip.offsetWidth, Math.max(0, cx(i) - tip.offsetWidth / 2));
    const barTop = y(d.cur);
    tip.style.left = `${left}px`;
    tip.style.top = `${Math.max(0, barTop - tip.offsetHeight - 8)}px`;
  }

  function hideTip() {
    state.selected = null;
    $('#tip').hidden = true;
    $$('#chart .bar.sel').forEach((r) => r.classList.remove('sel'));
  }

  function renderChartSection(win, cur) {
    $('#chart-title').textContent = win.title;
    chartMeta = win;
    chartData = buildChartData(win);
    hideTip();
    const empty = cur.orders === 0;
    $('#chart-empty').hidden = !empty;
    $('#chart-empty-text').textContent = win.empty;
    $('#chart').hidden = empty || state.tableView;
    $('#table-view').hidden = empty || !state.tableView;
    $('#toggle-table').hidden = empty;

    if (empty) {
      $('#chart-summary').textContent = win.empty + '.';
      return;
    }
    const best = chartData.reduce((a, b) => (b.cur > a.cur ? b : a));
    $('#chart-summary').textContent = win.unit === 'hour'
      ? `Busiest hour: ${best.full}, ${fmt0(best.cur)}`
      : `Best day: ${best.full}, ${fmt0(best.cur)}`;

    $('#table-view').innerHTML = `<table><caption class="sr-only">${esc(win.title)}</caption>
      <thead><tr><th scope="col">${win.unit === 'hour' ? 'Hour' : 'Day'}</th><th scope="col">Revenue</th><th scope="col">Previous</th></tr></thead>
      <tbody>${chartData.filter((d) => !d.future).map((d) => `<tr><th scope="row">${esc(d.full)}</th><td>${fmt0(d.cur)}</td><td>${d.prev === null ? '—' : fmt0(d.prev)}</td></tr>`).join('')}</tbody></table>`;
    if (!state.tableView) drawChart();
  }

  const catById = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

  function renderTop(win) {
    const top = topProducts(state.sales, win.cur[0], win.cur[1], state.category).slice(0, 5);
    const maxUnits = top.length ? top[0].units : 1;
    $('#top-list').innerHTML = top.length
      ? top.map((p, i) => `
        <li class="row">
          <span class="row-ic">${icon(catById[p.category].icon, 32)}</span>
          <div><div class="row-name">${esc(p.name)}</div><div class="bar-track"><span class="${i === 0 ? 'first' : ''}" style="width:${Math.max(4, (p.units / maxUnits) * 100)}%"></span></div></div>
          <div class="row-num"><strong>${fmtInt.format(p.units)}</strong><span>${fmt0(p.revenue)}</span></div>
        </li>`).join('')
      : '<li class="empty-row">No sales in this period</li>';
  }

  function renderTiles(win) {
    const totals = categoryTotals(state.sales, win.cur[0], win.cur[1]);
    const sum = Object.values(totals).reduce((a, b) => a + b, 0);
    $('#tiles').innerHTML = CATEGORIES.map((c) => `
      <button type="button" class="tile" data-cat="${c.id}" aria-pressed="${state.category === c.id}">
        <span class="tile-head">${icon(c.icon, 32)}${c.name}</span>
        <strong>${fmt0(totals[c.id])}</strong>
        <span class="tile-meta">${sum ? Math.round((totals[c.id] / sum) * 100) : 0}% of sales</span>
      </button>`).join('');
    $('#cat-note').textContent = state.category
      ? `Showing ${catById[state.category].name} only. Tap the tile again to clear.`
      : 'Tap a category to filter everything above.';
  }

  function renderHeader() {
    const stale = state.updatedAt && Date.now() - state.updatedAt.getTime() > CONFIG.staleAfterMin * 60000;
    const mins = state.updatedAt ? Math.round((Date.now() - state.updatedAt.getTime()) / 60000) : 0;
    $('#date').innerHTML = esc(dfDate.format(new Date())) + (stale ? ` &middot; <span class="stale">Updated ${mins} min ago</span>` : '');
    const banner = $('#offline-banner');
    banner.hidden = !state.offline;
    if (state.offline) banner.textContent = `Offline, showing data from ${dfTime.format(state.updatedAt || new Date())}`;
    $('#refresh').disabled = state.offline;
    $('#export').disabled = state.offline;
  }

  function render() {
    renderHeader();
    PERIODS.forEach((p) => {
      const tab = $(`#tab-${p}`);
      tab.setAttribute('aria-selected', String(p === state.period));
      tab.tabIndex = p === state.period ? 0 : -1;
    });
    $('#panel').setAttribute('aria-labelledby', `tab-${state.period}`);
    $('#error-card').hidden = !state.error;
    const hasData = Array.isArray(state.sales);
    $('#panel').hidden = !hasData;
    $('#print-title').textContent = `${CONFIG.shopName}, ${periodLabel()}, ${dfDate.format(new Date())}. Demo data.`;
    if (!hasData) return;

    const win = periodWindow(state.period, state.asOf);
    const cur = aggregate(state.sales, win.cur[0], win.cur[1], state.category);
    const prev = aggregate(state.sales, win.prev[0], win.prev[1], state.category);
    state.last = { win, cur, prev };
    renderKpis(cur, prev, win);
    renderChartSection(win, cur);
    renderTop(win);
    renderTiles(win);
  }

  /* ---------- Actions ---------- */

  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 3000);
  }

  function setRefreshing(on) {
    $('#refresh').classList.toggle('spinning', on);
    $('#main').classList.toggle('loading', on && !Array.isArray(state.sales));
  }

  async function load() {
    setRefreshing(true);
    try {
      const r = await fetchSales();
      state.sales = r.sales;
      state.asOf = r.asOf;
      state.updatedAt = new Date();
      state.error = false;
      savePref('bakery.updated', String(state.updatedAt.getTime()));
    } catch {
      state.error = true;
    } finally {
      setRefreshing(false);
    }
    render();
    const splash = $('#splash');
    if (splash) {
      splash.classList.add('hide');
      setTimeout(() => splash.remove(), 300);
    }
  }

  function summaryText() {
    const { cur } = state.last;
    const avg = cur.orders ? fmt2(Math.round(cur.revenue / cur.orders)) : '—';
    const filter = state.category ? `, ${catById[state.category].name} only` : '';
    return `${CONFIG.shopName}, ${periodLabel()}${filter} (${dfDate.format(new Date())}): revenue ${fmt0(cur.revenue)}, ${fmtInt.format(cur.orders)} orders, average order ${avg}, ${fmtInt.format(cur.items)} items sold. Demo data.`;
  }

  async function share() {
    if (!state.last) return;
    const text = summaryText();
    if (navigator.share) {
      try { await navigator.share({ title: CONFIG.shopName, text }); return; } catch (e) { if (e.name === 'AbortError') return; }
    }
    try { await navigator.clipboard.writeText(text); toast('Summary copied'); } catch { toast('Could not share. Copy the numbers from the screen.'); }
  }

  function showView(view) {
    state.view = view;
    const home = view === 'home';
    $('#view-home').hidden = !home;
    $('#view-soon').hidden = home;
    if (!home) $('#soon-title').textContent = `${view}: coming soon`;
    $$('.nav-btn').forEach((b) => {
      if (b.dataset.view === view) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
  }

  /* ---------- Wiring ---------- */

  function init() {
    hydrateIcons();
    $('#date').textContent = dfDate.format(new Date());

    $$('.tabs [role="tab"]').forEach((tab) => {
      tab.addEventListener('click', () => {
        state.period = tab.dataset.period;
        savePref('bakery.period', state.period);
        render();
      });
      tab.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        const i = PERIODS.indexOf(state.period) + (e.key === 'ArrowRight' ? 1 : -1);
        state.period = PERIODS[(i + PERIODS.length) % PERIODS.length];
        savePref('bakery.period', state.period);
        render();
        $(`#tab-${state.period}`).focus();
      });
    });

    $('#tiles').addEventListener('click', (e) => {
      const tile = e.target.closest('.tile');
      if (!tile) return;
      state.category = state.category === tile.dataset.cat ? null : tile.dataset.cat;
      render();
    });

    $('#toggle-table').addEventListener('click', () => {
      state.tableView = !state.tableView;
      $('#toggle-table').setAttribute('aria-pressed', String(state.tableView));
      $('#toggle-table').textContent = state.tableView ? 'View as chart' : 'View as table';
      render();
    });

    $('#refresh').addEventListener('click', load);
    $('#retry').addEventListener('click', () => { state.forceError = false; load(); });
    $('#see-all').addEventListener('click', () => toast('Full product list is coming soon'));
    $('#export').addEventListener('click', () => window.print());
    $('#share').addEventListener('click', share);
    $$('.nav-btn').forEach((b) => b.addEventListener('click', () => showView(b.dataset.view)));

    document.addEventListener('pointerdown', (e) => { if (!e.target.closest('#chart-wrap')) hideTip(); });
    if ('ResizeObserver' in window) new ResizeObserver(() => { if (!$('#chart').hidden) drawChart(); }).observe($('#chart-wrap'));
    window.addEventListener('online', () => { state.offline = false; renderHeader(); });
    window.addEventListener('offline', () => { state.offline = true; renderHeader(); });
    setInterval(renderHeader, 30000);

    $('#main').classList.add('loading');
    load();
  }

  init();
})();
