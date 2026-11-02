# Bakery & Cake: Sales Dashboard Spec

Status: draft v1. Items marked [TBD] need an owner decision (see section 11).

## 1. Purpose

A single-screen sales dashboard for the owner and counter staff of "Bakery & Cake" (est. 2021).
It answers three questions in under 5 seconds, on a phone, with one hand:

1. How much did we sell today (and is that up or down vs. the same period before)?
2. When did we sell it?
3. What sold best?

Primary device: phone, portrait, 360 to 430 px wide. Tablet and desktop are supported, not primary.

## 2. Design principles

| # | Principle | Meaning |
|---|-----------|---------|
| 1 | Mobile first | Designed at 390 px, then scaled up. No horizontal scroll at any width from 320 px. |
| 2 | Big targets | Every tappable element is at least 56 x 56 CSS px. Primary actions are 64 px tall. |
| 3 | Big icons | Icons are 32 px inside buttons and 40 px on KPI cards, always paired with a text label. |
| 4 | Brand-led | The supplied logo and its colors drive the whole look (section 3). |
| 5 | Glanceable | One idea per card. Numbers are the largest thing on screen. |

## 3. Brand and color

### 3.1 Logo

Source file: `assets/logo.png` (the supplied round badge: "Delicious Food / Bakery & Cake / est. 2021", bread loaf, wheat stalk).

Usage rules:

- Header: logo at 48 x 48 px (64 px on screens 768 px and wider), left of the title.
- Loading screen and empty states: logo at 96 px, centered.
- Favicon and app icon: logo cropped to the circle.
- Never stretch, recolor, rotate or place on a busy background. Keep 8 px clear space around it.
- Dark mode is out of scope for v1. The logo's cream fill is designed for a light page.

Asset problems to fix before build (the supplied file is a search-result screenshot):

- It has a baked-in gray checkerboard instead of real transparency.
- It has a small camera icon in the bottom-left corner.
- It is about 600 px wide, which is too soft for a 96 px retina render.

Need: a clean SVG, or a PNG of at least 1024 px with real transparency. [TBD]

### 3.2 Palette

Logo colors below were read by eye from the supplied image. Replace them with exact values sampled from the clean source file.

| Token | Hex | Where it comes from | Use |
|-------|-----|---------------------|-----|
| `--brown-900` | `#3B1D0F` | "Bakery" lettering, outer ring | Primary text, header bar, primary buttons |
| `--amber-600` | `#C9821C` | Inner ring, wheat | Icons, chart bars, active-tab underline |
| `--gold-400` | `#E8B23E` | Bread loaf | Selected-state fill, highlights, top-seller bar |
| `--cream-50` | `#FAF6EE` | Badge background | Page background |
| `--cream-200` | `#EFE4D0` | Tint of cream/gold | Card borders, dividers, skeletons |
| `--white` | `#FFFFFF` | n/a | Card surface |

Complementary accent. Amber sits at roughly 35 degrees on the color wheel, so its complement is blue at roughly 215 degrees. Blue is used sparingly so the warm brand colors stay dominant (about 60% cream/white, 30% brown/amber/gold, 10% blue).

| Token | Hex | Use |
|-------|-----|-----|
| `--blue-600` | `#2D6A9F` | "Previous period" comparison line, positive delta, secondary buttons, links |
| `--blue-100` | `#DCE9F4` | Tint behind comparison badges |
| `--red-600` | `#B3402A` | Negative delta only (a warm brick red that stays inside the brand family) |
| `--red-100` | `#F6E0DB` | Tint behind the negative delta chip and the error card |

### 3.3 Contrast rules (WCAG 2.2 AA)

- Body text: `--brown-900` on `--cream-50` or `--white`.
- Text on `--gold-400`: `--brown-900` only.
- Text on `--amber-600`: `--brown-900` only. White on amber fails AA for normal text, so it is not allowed.
- Text on `--brown-900`: `--cream-50`.
- Text on `--blue-600`: `--white`.
- Amber and gold are fills and icons, never small text on cream.
- All pairs must be verified with a contrast checker before sign-off (acceptance criterion 9).

### 3.4 Typography

- UI font: system stack (`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`). No webfont load for the data.
- Brand title ("Bakery & Cake"): one script webfont in the spirit of the logo lettering, header only. [TBD: exact font]
- Base size 18 px. KPI value 36 px bold. Card title 16 px semibold uppercase with 0.04em tracking. Minimum text size anywhere: 14 px.
- Numbers use `font-variant-numeric: tabular-nums` so columns align.
- Support browser font scaling up to 200% without clipped or overlapping text.

## 4. Layout (phone, 390 px)

Single column, 16 px side gutters, 12 px gap between cards, 16 px card radius, 16 px card padding.

```
┌──────────────────────────────────────┐
│ [logo 48]  Bakery & Cake    [Refresh]│  header, 72 px, brown-900
│            Sun, 2 Nov                │
├──────────────────────────────────────┤
│ [  Today  ][  Week  ][  Month  ]     │  period switch, 64 px
├──────────────────────────────────────┤
│ ┌────────────────┐ ┌────────────────┐│
│ │ [wallet 40]    │ │ [receipt 40]   ││  KPI cards, 2 x 2
│ │ REVENUE        │ │ ORDERS         ││  each min 128 px tall
│ │ 4,820          │ │ 163            ││
│ │ ▲ 12% vs prev  │ │ ▲ 5% vs prev   ││
│ └────────────────┘ └────────────────┘│
│ ┌────────────────┐ ┌────────────────┐│
│ │ [basket 40]    │ │ [wheat 40]     ││
│ │ AVG ORDER      │ │ ITEMS SOLD     ││
│ │ 29.6           │ │ 412            ││
│ │ ▼ 3% vs prev   │ │ ▲ 8% vs prev   ││
│ └────────────────┘ └────────────────┘│
├──────────────────────────────────────┤
│ SALES BY HOUR                        │  chart card, 220 px tall
│  ▂ ▃ ▆ █ ▇ ▅ ▃ ▂   bars = amber      │
│  ── line = previous period (blue)    │
├──────────────────────────────────────┤
│ TOP SELLERS                          │
│ [bread 32] Sourdough loaf   58  ▇▇▇▇ │  row min 64 px
│ [croissant]Butter croissant 49  ▇▇▇  │
│ [cake 32]  Cheesecake slice 31  ▇▇   │
│ [ ... 5 rows ... ]                   │
├──────────────────────────────────────┤
│ BY CATEGORY                          │
│ [ Bread ][ Pastry ]                  │  tiles, 2 x 2, min 88 px
│ [ Cakes ][ Drinks ]                  │
├──────────────────────────────────────┤
│ [ Export report ]  [ Share ]         │  action bar, 64 px
├──────────────────────────────────────┤
│ [Home][Sales][Products][Reports]     │  bottom nav, 72 px, sticky
└──────────────────────────────────────┘
```

Responsive behavior:

| Width | Layout |
|-------|--------|
| 320 to 599 px | As drawn above. |
| 600 to 1023 px | KPI cards in one row of 4. Chart and Top Sellers side by side. Bottom nav stays. |
| 1024 px and up | Max content width 1120 px, centered. Bottom nav becomes a left side rail. Same cards. |

Safe areas: pad the header and bottom nav with `env(safe-area-inset-*)` so nothing hides behind a notch or the home indicator.
Thumb zone: period switch, action bar and bottom nav stay in the lower two thirds or are sticky. Refresh is the only top-corner control.

## 5. Components

### 5.1 Header

- Brown background, cream text, logo badge on the left (the badge's cream fill reads cleanly on brown).
- Title "Bakery & Cake" in the script font, subtitle with today's date in 14 px.
- Refresh button: 56 x 56, icon `refresh` 32 px, shows a spinner while loading. Label for screen readers: "Refresh sales".

### 5.2 Period switch (segmented control)

- Three buttons: Today, Week, Month. Each is one third of the width, 64 px tall, 18 px bold label.
- Selected: `--gold-400` fill, `--brown-900` text, 2 px `--brown-900` border.
- Unselected: `--white` fill, `--cream-200` border.
- Default selection on open: Today. The last choice is remembered on the device.

### 5.3 KPI card

- Icon in a 56 px circle filled `--gold-400`, icon stroke `--brown-900`, 40 px.
- Label (16 px caps), value (36 px bold), delta chip.
- Delta chip shows an arrow, sign and percent, for example `▲ +12%`. The arrow and sign carry the meaning, so color is never the only signal.
- Up is `--blue-600` on `--blue-100`. Down is `--red-600` on a light red tint. Flat (under 0.5%) is gray with a dash.
- The whole card is a 56 px+ tap target that opens the matching detail view [TBD: detail views are out of scope for v1, so the tap is a no-op with pressed-state feedback].

| KPI | Icon | Definition |
|-----|------|-----------|
| Revenue | `wallet` | Sum of `total` of all completed sales in the period. |
| Orders | `receipt` | Count of completed sales. |
| Avg order | `shopping-basket` | Revenue divided by Orders. Show an em dash when Orders is 0. |
| Items sold | `wheat` | Sum of `qty` over all line items. |

Delta compares to the previous period of equal length: Today vs. same weekday last week, Week vs. previous 7 days, Month vs. previous 30 days. [TBD: confirm this comparison rule]

### 5.4 Sales chart

- Today: 24 hourly bars, or only open hours if the shop hours are configured. Week: 7 daily bars. Month: one bar per day.
- Bars `--amber-600`. The current hour or day is `--gold-400` with a brown outline.
- Previous period as a 3 px `--blue-600` line with round markers.
- Tap or long-press on a bar opens a 56 px-high tooltip above the finger (never under it) with label, value and previous-period value.
- A one-line text summary under the chart for screen readers and quick reading, for example "Busiest hour: 08:00 to 09:00, 612".
- Axis labels 14 px. Show at most 6 labels, thin out the rest.

### 5.5 Top sellers

- Five rows, ranked by units sold. Row: 32 px product icon, name (ellipsized to one line), units, revenue, horizontal bar scaled to the top item.
- Rank 1 bar is `--gold-400`, the rest `--amber-600`.
- A 56 px "See all" button below the list is a stub in v1 [TBD].

### 5.6 Category tiles

- Four tiles: Bread (`wheat`), Pastry (`croissant`), Cakes (`cake-slice`), Drinks (`coffee`). Category names are configurable.
- Each tile: 32 px icon, name, revenue, share of total as a percent.
- Tapping a tile filters the KPIs, chart and Top Sellers to that category. The selected tile uses the gold selected style from 5.2. Tapping it again clears the filter.

### 5.7 Action bar

- Export report: primary button, `--brown-900` fill, cream text, icon `download` 32 px. Produces a one-page PDF of the current period and filter.
- Share: secondary button, `--blue-600` fill, white text, icon `share-2` 32 px. Uses the native share sheet with the PDF, falls back to copying a text summary.

### 5.8 Bottom nav

- Four items: Home, Sales, Products, Reports. Icons 32 px above 14 px labels, each item at least 72 px tall and a quarter of the width.
- Active item: `--amber-600` 4 px top indicator and `--brown-900` bold label. Only Home is built in v1. The other three open a "Coming soon" screen with the logo.

### 5.9 Icons

One consistent outline set with a 2 px stroke and rounded caps, for example Lucide. All icons need a text label or an `aria-label`.

## 6. States

| State | Behavior |
|-------|----------|
| Loading | Skeleton cards in `--cream-200` with a slow shimmer. The logo shows at 96 px on first load only. |
| Empty (no sales in period) | Cards show 0. The chart area shows the wheat icon at 64 px and "No sales yet today". |
| Error | Inline card with `alert-triangle` icon, plain message, and a 64 px "Try again" button. Last good data stays visible below it. |
| Offline | Sticky banner "Offline, showing data from 14:05". Refresh and Export are disabled. |
| Stale | If data is older than 5 minutes, the header subtitle shows "Updated 8 min ago" in `--amber-600`. [TBD: confirm refresh interval] |

## 7. Data

Source of truth is [TBD] (POS export, CSV, spreadsheet, or API). The dashboard reads one normalized shape:

```json
{
  "sale": {
    "id": "string",
    "timestamp": "2026-11-02T08:14:00+02:00",
    "status": "completed | refunded | void",
    "total": 31.5,
    "items": [
      { "sku": "string", "name": "Sourdough loaf", "category": "bread", "qty": 2, "unitPrice": 9.0 }
    ]
  }
}
```

Rules:

- Only `status = completed` counts. Refunds are subtracted in the period they happened [TBD: confirm].
- Timestamps are stored in UTC and shown in the shop's time zone.
- Money is stored as integer minor units to avoid rounding drift. Currency and tax handling (amounts incl. or excl. VAT) are configuration [TBD].
- Aggregation happens on the server or in one pure function, so every card shows numbers that add up to the same total.

Sample numbers in section 4 are placeholders for layout only and are not real sales data.

## 8. Accessibility

- Touch targets at least 56 x 56 CSS px with at least 8 px between neighbours.
- Contrast AA everywhere (section 3.3). Focus ring is 3 px `--blue-600` with 2 px offset.
- Color is never the only signal: deltas have arrows and signs, selected states have borders.
- Charts have a text summary and a "View as table" toggle.
- `prefers-reduced-motion`: no shimmer, no bar growth animation.
- Use CSS logical properties (`margin-inline-start`, etc.) so a right-to-left language can be added without a redesign.
- Semantic landmarks: `header`, `main`, `nav`. Period switch is a `role="tablist"`.

## 9. Performance

- First render under 2.5 s (LCP) on a mid-range phone over 4G.
- Initial JS under 150 KB gzipped. Logo served as SVG or a 2x WebP with explicit width and height to prevent layout shift.
- Aggregates are cached on the device for offline view.

## 10. Acceptance criteria

1. At 320, 360, 390, 430, 768 and 1280 px wide there is no horizontal scrollbar.
2. Every interactive element measures at least 56 x 56 CSS px (checked by script over all `button, a, [role=tab]`). Primary buttons are at least 64 px tall.
3. Icons inside buttons are 32 px and KPI icons 40 px, and every icon has a visible label or an `aria-label`.
4. The logo appears in the header at 48 px or larger, and on the loading and empty states at 96 px.
5. Only the tokens in sections 3.2 appear as colors in the stylesheet. Any other hex value fails review.
6. Switching Today, Week and Month updates all four KPIs, the chart and Top Sellers within 300 ms from cached data, and the selection survives a reload.
7. Revenue KPI equals the sum of the chart bars and the sum of category revenue, to the minor unit, for the same period and filter.
8. Delta chip shows an arrow and signed percent in all three states (up, down, flat), and the percent is correct to one decimal against a fixture.
9. Contrast is at least 4.5:1 for text under 24 px and 3:1 for large text and icons, verified with a checker for every pair in 3.3.
10. Empty, error, offline and loading states each render without layout shift and each has a screenshot in the test suite.
11. Lighthouse mobile scores: Performance 85 or higher, Accessibility 95 or higher.
12. Each test states what it protects and what wrong result it rejects, and what a green run does not prove (for example, "fixture data, not live POS").

## 11. Open questions

1. Where do sales come from: POS export, CSV, spreadsheet, API, manual entry?
2. Currency, VAT included or not, and shop opening hours for the hourly chart?
3. Is a clean logo file (SVG or 1024 px transparent PNG) available?
4. Languages: English only, or Hebrew too (right-to-left)?
5. Who uses it: owner only, or counter staff too (affects whether a login is needed)?
6. Stack: static HTML + JS, React, or something else? [TBD]
7. Comparison rule for the deltas (section 5.3), and the refresh interval.

## 12. Out of scope (v1)

- Creating, editing or refunding sales. This is a read-only dashboard.
- Inventory, stock alerts, recipes, staff scheduling.
- Detail screens behind each card, and the Sales, Products and Reports tabs.
- Multi-store views and user accounts.
- Dark mode.

## 13. Files

| File | Purpose |
|------|---------|
| `spec.md` | This document. |
| `assets/logo.png` | Supplied logo (needs a clean replacement, see 3.1). |
| `assets/logo-circle.png` | Supplied logo cropped to a transparent circle. Removes the checkerboard and the corner icon, but resolution is still about 580 px. |
| `index.html`, `styles.css`, `app.js`, `data.js` | v1 implementation with demo data. |
