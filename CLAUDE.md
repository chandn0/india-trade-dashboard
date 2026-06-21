# India Trade Monitor — Architecture Guide

This file helps contributors (human and AI) orient quickly. Read it once before
touching any code.

## File Layout

```
app/
  page.js                    ← composition root, ~100 lines; imports and renders everything
  theme.js                   ← MUI theme + color palette (C), typography (mono), toneColor()
  lib/
    transforms.js            ← ALL data prep: imports JSON, exports computed data structures
    format.js                ← number formatters (moneyB, nf2, pct, fyTick, …)
    responsive.js            ← COMPACT_BELOW = 560, useMeasuredWidth()
    chartGeometry.js         ← buildTradeGeo(), buildRupeeDeficitGeo() — SVG scale/tick math
    chartInteraction.js      ← tipPosition() hover-tooltip helper
  config/
    icons.js                 ← BASKET_ICON, HS2_ICON, basketIconFor(), hs2Label()
    valueChains.js           ← VALUE_CHAINS, CHAIN_COLOR, CHAIN_FLOWS
  components/
    charts/                  ← one file per chart (TradeTrendChart, CompositionChart, …)
    primitives/              ← shared sub-components (TipRow, BasketMark, ToggleChips, …)
    sections/                ← interactive multi-chart sections (MoverExplorer, ValueChainSection)
    layout/                  ← Masthead, Footer
data/
  *.json                     ← source data files (do not edit manually)
  labels/
    group-labels.json        ← commodity group display names (safe for non-coders to edit)
    hs4-labels.json          ← HS-4 product display names
    hs2-labels.json          ← HS-2 chapter display names
    country-labels.json      ← trading-partner display names
scripts/
  fetch_*.js / fetch_*.sh    ← data fetch scripts (Node or bash)
  build_*.js                 ← data build/transform scripts
```

## Data Flow

```
data/*.json  →  app/lib/transforms.js  →  component props or direct import
                      ↑
              data/labels/*.json       (label maps, imported by transforms.js)
```

`transforms.js` is the single source of truth for all non-visual data. Charts
either receive computed data as props from `page.js`, or import named exports
from `transforms.js` directly when they need interactive access.

**Never import raw JSON data files inside a chart component.** Import from
`transforms.js` instead — that keeps data prep in one place.

## How to Add a New Chart

1. **Create the component file** in `app/components/charts/MyChart.js`.

   Minimal template:
   ```js
   'use client'; // only if the component uses hooks or event handlers

   import * as React from 'react';
   import { Box, Paper, Typography } from '@mui/material';
   import { C, mono } from '../../theme.js';
   import { moneyB } from '../../lib/format.js';
   import { rows } from '../../lib/transforms.js'; // import data you need
   import cardSx from '../primitives/cardSx.js';

   export default function MyChart() {
     return (
       <Paper sx={cardSx}>
         <Typography variant="h6">My Chart</Typography>
         {/* render using rows */}
       </Paper>
     );
   }
   ```

2. **Import and place it in `app/page.js`**:
   ```js
   import MyChart from './components/charts/MyChart.js';
   // ...inside Dashboard:
   <Box component="section" id="my-chart" data-section>
     <MyChart />
   </Box>
   ```

3. **Run checks**:
   ```bash
   npm run lint && npm run format:check && npm run build
   ```

4. **PR checklist**: build passes + screenshot of the chart at desktop and
   ≤560 px mobile width.

## How to Edit a Label

Chart display names (commodity groups, countries, HS codes) live in
`data/labels/*.json` — these are plain JSON files anyone can edit without
knowing JavaScript.

Example: to rename `"CHINA P RP"` → `"China (PRC)"`, open
`data/labels/country-labels.json` and change the value for that key.

## Key Patterns

**SVG charts** — all charts are handcrafted SVG; no chart library is used.
Every chart component owns its own geometry math. The `viewBox` equals the
measured pixel width so that CSS `width: 100% / height: auto` renders crisp
without scaling artifacts.

**Responsive breakpoint** — `COMPACT_BELOW = 560` (from `lib/responsive.js`).
Below this pixel width the chart uses a more compact layout: bigger aspect ratio,
fewer axis labels, no resting dots.

**`useMeasuredWidth`** — ResizeObserver hook that returns the container's CSS
pixel width. Every chart that adjusts its SVG viewBox uses this.

**Hover tooltips** — each chart maintains a `hover` state index and places an
absolutely-positioned `Box` tooltip. `tipLeft > 60` flips the tooltip left to
avoid edge clipping.

**`'use client'`** — only on components that use React hooks or event handlers.
Pure display components (TipRow, BasketMark, Sparkline, ChainStat) don't need it.

## Color Palette

```js
import { C } from './theme.js';
// C.blue    exports   C.orange  imports   C.teal  positive/success
// C.red     deficit   C.purple  accent    C.slate secondary
// C.ink     dark bg   C.grid    grid lines
```

## Running Locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run format:check
npm run build
```

Python data scripts (optional):
```bash
pip install -r scripts/requirements.txt
# then any script in package.json, e.g.:
npm run fetch:monthly
```
