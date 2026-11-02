'use strict';

// Demo data layer. Everything here is simulated: there is no real POS connected yet.
// The aggregate functions are pure and are the only place numbers are computed,
// so every card, chart bar and table row adds up to the same total.

const CONFIG = {
  shopName: 'Bakery & Cake',
  currency: 'USD',
  locale: 'en-US',
  openHour: 6,
  closeHour: 20, // last hourly bucket is 19:00 to 20:00
  staleAfterMin: 5,
};

const CATEGORIES = [
  { id: 'bread', name: 'Bread', icon: 'bread' },
  { id: 'pastry', name: 'Pastry', icon: 'croissant' },
  { id: 'cakes', name: 'Cakes', icon: 'cake' },
  { id: 'drinks', name: 'Drinks', icon: 'coffee' },
];

// Invented demo catalog. Prices are integer cents.
const PRODUCTS = [
  { sku: 'SOUR', name: 'Sourdough loaf', category: 'bread', price: 900, weight: 5 },
  { sku: 'BAGU', name: 'Baguette', category: 'bread', price: 450, weight: 6 },
  { sku: 'CROI', name: 'Butter croissant', category: 'pastry', price: 380, weight: 9 },
  { sku: 'CINN', name: 'Cinnamon roll', category: 'pastry', price: 420, weight: 5 },
  { sku: 'CHEE', name: 'Cheesecake slice', category: 'cakes', price: 650, weight: 4 },
  { sku: 'CHOC', name: 'Chocolate cake slice', category: 'cakes', price: 600, weight: 4 },
  { sku: 'WCAK', name: 'Celebration cake', category: 'cakes', price: 3800, weight: 0.6 },
  { sku: 'COFF', name: 'Coffee', category: 'drinks', price: 350, weight: 10 },
  { sku: 'TEA', name: 'Iced tea', category: 'drinks', price: 300, weight: 4 },
];

// Relative footfall for each open hour (06:00 to 19:00) and for each weekday (Sun to Sat).
const HOUR_CURVE = [0.6, 1.4, 1.6, 1.1, 0.8, 1.0, 1.4, 1.1, 0.8, 0.7, 0.9, 1.0, 0.8, 0.5];
const DOW_FACTOR = [1.15, 0.9, 0.9, 0.95, 1.0, 1.15, 1.3];

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// Calendar-day arithmetic that keeps the clock time and survives DST changes.
function addDays(d, n) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
}

function pickProduct(rng, totalWeight) {
  let r = rng() * totalWeight;
  for (const p of PRODUCTS) {
    r -= p.weight;
    if (r <= 0) return p;
  }
  return PRODUCTS[0];
}

// Deterministic: the same calendar day always produces the same sales, so reloads are stable.
// Sales after `asOf` are dropped, but the random stream is still consumed so earlier hours never change.
function generateSales(asOf, days = 62) {
  const sales = [];
  const totalWeight = PRODUCTS.reduce((s, p) => s + p.weight, 0);
  const today0 = startOfDay(asOf);
  const asOfMs = asOf.getTime();

  for (let back = days - 1; back >= 0; back--) {
    const day = addDays(today0, -back);
    const dayKey = Math.floor(day.getTime() / 864e5);
    const rng = mulberry32(Math.imul(dayKey, 2654435761));
    const dow = DOW_FACTOR[day.getDay()];

    for (let h = CONFIG.openHour; h < CONFIG.closeHour; h++) {
      const expected = 9 * HOUR_CURVE[h - CONFIG.openHour] * dow * (0.85 + rng() * 0.3);
      const n = Math.max(0, Math.round(expected + (rng() - 0.5) * 3));

      for (let k = 0; k < n; k++) {
        const ts = new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, Math.floor(rng() * 60)).getTime();
        const r = rng();
        const lineCount = r < 0.5 ? 1 : r < 0.85 ? 2 : 3;
        const items = [];
        for (let i = 0; i < lineCount; i++) {
          let p = pickProduct(rng, totalWeight);
          for (let t = 0; t < 10 && items.some((it) => it.sku === p.sku); t++) p = pickProduct(rng, totalWeight);
          if (items.some((it) => it.sku === p.sku)) continue;
          const qty = p.sku === 'WCAK' ? 1 : 1 + (rng() < 0.3 ? 1 : 0) + (rng() < 0.1 ? 1 : 0);
          items.push({ sku: p.sku, name: p.name, category: p.category, qty, unitPrice: p.price });
        }
        const status = rng() < 0.01 ? 'void' : 'completed';
        if (ts > asOfMs) continue;
        sales.push({
          id: `S${dayKey}-${h}-${k}`,
          ts,
          status,
          total: items.reduce((s, it) => s + it.qty * it.unitPrice, 0),
          items,
        });
      }
    }
  }
  return sales;
}

// Half-open range [from, to). Only completed sales count. With a category filter, revenue and
// items come from that category's lines, and an order counts if it has at least one such line.
function aggregate(sales, from, to, category) {
  let revenue = 0;
  let orders = 0;
  let items = 0;
  for (const s of sales) {
    if (s.status !== 'completed' || s.ts < from || s.ts >= to) continue;
    let hit = false;
    for (const it of s.items) {
      if (category && it.category !== category) continue;
      revenue += it.qty * it.unitPrice;
      items += it.qty;
      hit = true;
    }
    if (hit) orders++;
  }
  return { revenue, orders, items };
}

function topProducts(sales, from, to, category) {
  const map = new Map();
  for (const s of sales) {
    if (s.status !== 'completed' || s.ts < from || s.ts >= to) continue;
    for (const it of s.items) {
      if (category && it.category !== category) continue;
      const row = map.get(it.sku) || { sku: it.sku, name: it.name, category: it.category, units: 0, revenue: 0 };
      row.units += it.qty;
      row.revenue += it.qty * it.unitPrice;
      map.set(it.sku, row);
    }
  }
  return [...map.values()].sort((a, b) => b.units - a.units || b.revenue - a.revenue);
}

function categoryTotals(sales, from, to) {
  const totals = Object.fromEntries(CATEGORIES.map((c) => [c.id, 0]));
  for (const s of sales) {
    if (s.status !== 'completed' || s.ts < from || s.ts >= to) continue;
    for (const it of s.items) totals[it.category] += it.qty * it.unitPrice;
  }
  return totals;
}
