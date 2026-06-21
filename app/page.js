'use client';

import * as React from 'react';
import {
  Box,
  Chip,
  Container,
  InputAdornment,
  Paper,
  Slider,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import SearchRounded from '@mui/icons-material/SearchRounded';
import OilBarrelRounded from '@mui/icons-material/OilBarrelRounded';
import ScienceRounded from '@mui/icons-material/ScienceRounded';
import MemoryRounded from '@mui/icons-material/MemoryRounded';
import AgricultureRounded from '@mui/icons-material/AgricultureRounded';
import CheckroomRounded from '@mui/icons-material/CheckroomRounded';
import DiamondRounded from '@mui/icons-material/DiamondRounded';
import DirectionsCarRounded from '@mui/icons-material/DirectionsCarRounded';
import TerrainRounded from '@mui/icons-material/TerrainRounded';
import PrecisionManufacturingRounded from '@mui/icons-material/PrecisionManufacturingRounded';
import ViewInArRounded from '@mui/icons-material/ViewInArRounded';
import OpacityRounded from '@mui/icons-material/OpacityRounded';
import MoreHorizRounded from '@mui/icons-material/MoreHorizRounded';
import TrendingUpRounded from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRounded from '@mui/icons-material/TrendingDownRounded';
import FlightRounded from '@mui/icons-material/FlightRounded';
import DirectionsBoatRounded from '@mui/icons-material/DirectionsBoatRounded';
import MedicationRounded from '@mui/icons-material/MedicationRounded';
import CategoryRounded from '@mui/icons-material/CategoryRounded';

import { C, mono, toneColor } from './theme';
import commodityShareData from '../data/india_trade_commodity_group_shares.json';
import exchangeRateData from '../data/india_trade_inr_usd_fy.json';
import yearlySummaryData from '../data/india_trade_yearly_raw.json';
import hs4ExportData from '../data/india_trade_hs4_world_export_5fy.json';
import hs4ImportData from '../data/india_trade_hs4_world_import_5fy.json';
import countrySlimData from '../data/india_trade_country_slim.json';
import partnerProductsData from '../data/india_trade_partner_top_products.json';

/* ------------------------------------------------------------------ */
/* Formatters                                                         */
/* ------------------------------------------------------------------ */
const nf2 = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const pct = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  signDisplay: 'always',
});
const moneyB = (n) => `$${nf2.format(n / 1000)}B`;
// Short form for cramped axes (phones): whole billions, or one-decimal trillions.
const moneyShortB = (n) => {
  const b = n / 1000;
  return Math.abs(b) >= 1000 ? `$${(b / 1000).toFixed(1)}T` : `$${Math.round(b)}B`;
};
const moneySignB = (n) => `${n < 0 ? '-' : '+'}$${nf2.format(Math.abs(n) / 1000)}B`;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/* ------------------------------------------------------------------ */
/* Responsive chart sizing                                            */
/* ------------------------------------------------------------------ */
// Charts size their SVG viewBox to the measured container width (1 viewBox unit = 1 CSS px),
// so axis text and strokes render at true pixel sizes on every screen instead of scaling down
// with a fixed-width viewBox. Below COMPACT_BELOW the geometry switches to a phone layout:
// taller aspect, tighter padding, fewer axis labels, shorter tick formats.
const COMPACT_BELOW = 560;
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;
function useMeasuredWidth(ref, fallback) {
  const [width, setWidth] = React.useState(fallback);
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => {
      const w = Math.round(el.getBoundingClientRect().width);
      if (w > 0) setWidth(w);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return width;
}

/* ------------------------------------------------------------------ */
/* Data prep                                                          */
/* ------------------------------------------------------------------ */
const exchangeRows = exchangeRateData.rows;
const exchangeByYear = Object.fromEntries(exchangeRows.map((row) => [row.financial_year, row]));

// Headline year-wise totals come from the corrected FTSPCC yearly summary (built by
// scripts/build_ftspcc_yearly.js, which takes the March fiscal year-end cumulative row).
// This is the authoritative total-trade series and matches the downloadable summary CSV;
// trade_balance and YoY % are already computed there.
const rows = yearlySummaryData.summary;

// The summary series starts at FY2010-11 (the monthly source does not reach FY2009-10), so
// trim the commodity-group rows that drive the composition charts to that same fiscal-year
// window. Every chart on the dashboard then shares one x-axis.
const summaryYears = new Set(rows.map((row) => row.financial_year));
const commodityExportRows = commodityShareData.export_rows.filter((row) =>
  summaryYears.has(row.financial_year),
);
const commodityImportRows = commodityShareData.import_rows.filter((row) =>
  summaryYears.has(row.financial_year),
);
const mixYears = commodityExportRows.map((row) => row.financial_year);

const rupeeDeficitRows = (() => {
  let cumulative = 0;
  return rows
    .filter((row) => exchangeByYear[row.financial_year])
    .map((row) => {
      const exchange = exchangeByYear[row.financial_year];
      const annualDeficit = Math.max(0, row.import_usd_mn - row.export_usd_mn);
      cumulative += annualDeficit;
      return {
        financial_year: row.financial_year,
        exchange_rate_inr_per_usd: Number(exchange.inr_per_usd_avg ?? 0),
        annual_deficit_usd_mn: annualDeficit,
        cumulative_deficit_usd_mn: cumulative,
        export_usd_mn: row.export_usd_mn,
        import_usd_mn: row.import_usd_mn,
      };
    });
})();

const COMMODITY_PALETTE = [
  '#0d9488',
  '#2563eb',
  '#db2777',
  '#7c3aed',
  '#0891b2',
  '#475569',
  '#d946ef',
  '#ea580c',
  '#16a34a',
  '#65a30d',
  '#0ea5e9',
  '#f59e0b',
  '#9333ea',
  '#14b8a6',
  '#f43f5e',
  '#b45309',
  '#a16207',
  '#c026d3',
  '#0e7490',
  '#6d28d9',
  '#525252',
  '#a21caf',
];
const REST_COLOR = '#cbd5e1';

// Clean display names for the official (ALL-CAPS, sometimes long/typo'd) group strings.
const GROUP_LABEL = {
  'PETROLEUM CRUDE & PRODUCTS': 'Petroleum',
  'CHEMICALS & RELATED PRODUCTS': 'Chemicals',
  MACHINERY: 'Machinery',
  'ELECTORONICS ITEMS': 'Electronics',
  'AGRI & ALLIED PRODUCTS': 'Agriculture',
  'TEXTILES & ALLIED PRODUCTS': 'Textiles & apparel',
  'BASE METALS': 'Base metals',
  'TRANSPORT EQUIPMENTS': 'Transport equipment',
  'GEMS & JEWELLERY': 'Gems & jewellery',
  'PLASTIC & RUBBER ARTICLES': 'Plastics & rubber',
  'MARINE PRODUCTS': 'Marine products',
  'ORES & MINERALS': 'Ores & minerals',
  'LEATHER & LEATHER MANUFACTURES': 'Leather',
  'PAPER & RELATED PRODUCTS': 'Paper',
  'OPTICAL, MEDICAL & SURGICAL INSTRUMENTS': 'Instruments',
  'ARTICLES OF STONE, PLASTER, CEMENT, ASBESTOS, MICA OR SIMILAR MATERIALS; CERAMIC PRODUCTS; GLASS AND GLASSWARE':
    'Stone, ceramics & glass',
  PLANTATION: 'Plantation',
  'SPORTS GOODS': 'Sports goods',
  'OFFICE EQUIPMENTS': 'Office equipment',
  'PROJECT GOODS': 'Project goods',
  OTHERS: 'Other groups',
};
function cleanGroupName(raw) {
  if (GROUP_LABEL[raw]) return GROUP_LABEL[raw];
  const s = String(raw).toLowerCase().replace(/\s+/g, ' ').trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Other';
}

// One icon per basket, tinted with the basket's color in legends and hover readouts — a
// redundant shape channel on top of color, so baskets stay distinguishable when hues sit
// close together or for color-blind readers. Unmapped baskets fall back to a plain swatch.
const BASKET_ICON = {
  Petroleum: OilBarrelRounded,
  Chemicals: ScienceRounded,
  Electronics: MemoryRounded,
  Agriculture: AgricultureRounded,
  'Textiles & apparel': CheckroomRounded,
  'Gems & jewellery': DiamondRounded,
  'Transport equipment': DirectionsCarRounded,
  'Ores & minerals': TerrainRounded,
  Machinery: PrecisionManufacturingRounded,
  'Base metals': ViewInArRounded,
  'Plastics & rubber': OpacityRounded,
};
const REST_ICON = MoreHorizRounded;
const basketIconFor = (name, rest) => (rest ? REST_ICON : BASKET_ICON[name]) || null;

// White or ink, whichever contrasts better — for icons sitting on a filled slice/band.
const iconInk = (hex) => {
  const c = String(hex).replace('#', '');
  if (c.length < 6) return '#fff';
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? C.ink : '#fff';
};

function BasketMark({ name, color, rest = false, size = 14 }) {
  const Icon = basketIconFor(name, rest);
  if (!Icon) {
    return <Box sx={{ width: 9, height: 9, borderRadius: 0.5, bgcolor: color, flexShrink: 0 }} />;
  }
  return <Icon sx={{ fontSize: size, color, flexShrink: 0, display: 'block' }} />;
}

function buildCommodityComposition(rowsInput, topN) {
  const byGroup = {};
  rowsInput.forEach((row) => {
    const year = row.financial_year;
    row.groups.forEach((group) => {
      if (!byGroup[group.name]) {
        byGroup[group.name] = {
          values: Object.fromEntries(mixYears.map((y) => [y, 0])),
          shares: Object.fromEntries(mixYears.map((y) => [y, 0])),
        };
      }
      byGroup[group.name].values[year] = Number(group.current_usd_mn ?? 0);
      byGroup[group.name].shares[year] = Number(group.share_pct ?? 0);
    });
  });

  const groups = Object.entries(byGroup)
    .map(([name, g]) => ({
      key: name,
      name: cleanGroupName(name),
      values: g.values,
      shares: g.shares,
      latest: g.shares[mixYears[mixYears.length - 1]] ?? 0,
    }))
    .sort((a, b) => b.latest - a.latest);
  const items = groups.slice(0, topN);
  const years = mixYears.map((year) => {
    const sourceRow = rowsInput.find((row) => row.financial_year === year);
    const total = Number(sourceRow?.total_usd_mn ?? 0);
    let used = 0;
    const segs = items.map((it) => {
      const value = it.values[year] || 0;
      const share = it.shares[year] || 0;
      used += share;
      return {
        key: it.key,
        name: it.name,
        label: `${share.toFixed(1)}% of total`,
        value,
        share,
        color: REST_COLOR,
      };
    });
    const restShare = Math.max(0, 100 - used);
    return {
      year,
      total,
      segs,
      rest: { name: 'Other commodity groups', share: restShare, value: (total * restShare) / 100 },
    };
  });
  const latestYear = years[years.length - 1];
  const topShare = latestYear.segs.reduce((s, x) => s + x.share, 0);
  // Colors are assigned later (see basketColorMap) so the same basket is the same color
  // across the export and import charts, rather than being colored by per-chart rank.
  return { items, years, topShare, latestYear, groupCount: groups.length };
}

const INDUSTRY_TOP = 10;
const exportComp = buildCommodityComposition(commodityExportRows, INDUSTRY_TOP);
const importComp = buildCommodityComposition(commodityImportRows, INDUSTRY_TOP);

// One color per commodity basket, shared across the export and import charts so the same
// basket reads as the same color in both. Export baskets are colored first (in rank order),
// then any import-only baskets pick up the next unused palette slots.
const basketColorMap = {};
let nextBasketColor = 0;
[...exportComp.items, ...importComp.items].forEach((it) => {
  if (!(it.key in basketColorMap)) {
    basketColorMap[it.key] = COMMODITY_PALETTE[nextBasketColor % COMMODITY_PALETTE.length];
    nextBasketColor += 1;
  }
});
[exportComp, importComp].forEach((comp) => {
  comp.colorMap = basketColorMap;
  comp.items.forEach((it) => {
    it.color = basketColorMap[it.key] || REST_COLOR;
  });
  comp.years.forEach((yr) => {
    yr.segs.forEach((seg) => {
      seg.color = basketColorMap[seg.key] || REST_COLOR;
    });
  });
});
const CAT = [
  '#2563eb',
  '#0ea5e9',
  '#14b8a6',
  '#22c55e',
  '#84cc16',
  '#eab308',
  '#f97316',
  '#ef4444',
];

/* ------------------------------------------------------------------ */
/* Item-level (HS-4) five-year movers                                 */
/* ------------------------------------------------------------------ */
// The HS-4 export/import files carry one row per product line with USD values for each of the last
// five fiscal years. The source also ships a grand-total row with no HS code/description; it's
// dropped here (the `HSCODE != null` guard) so it can't swamp the rankings. Movers are ranked by
// ABSOLUTE change in annual USD value FY2021-22 -> FY2025-26 — that surfaces the shifts that
// actually moved the trade balance, rather than large-percent swings off a near-zero base.
const HS4_YEARS = ['2021-22', '2022-23', '2023-24', '2024-25', '2025-26'];

// Clean, recognizable names for the (abbreviated, ALL-CAPS) official HS-4 descriptions, for the
// product lines that surface as movers. Anything unmapped falls back to a title-cased description.
const HS4_LABEL = {
  8517: 'Phones & telecom gear',
  3004: 'Medicaments (pharma)',
  8703: 'Cars & passenger vehicles',
  8411: 'Jet engines & turbines',
  7113: 'Jewellery',
  1006: 'Rice',
  2710: 'Refined petroleum',
  7102: 'Diamonds',
  7208: 'Flat-rolled steel',
  7601: 'Unwrought aluminium',
  2902: 'Cyclic hydrocarbons',
  1701: 'Sugar',
  7108: 'Gold',
  8542: 'Integrated circuits (chips)',
  2709: 'Crude petroleum',
  7106: 'Silver',
  8802: 'Aircraft',
  8541: 'Semiconductor devices',
  8529: 'TV & radio parts',
  3102: 'Nitrogen fertilisers',
  7103: 'Precious stones',
  2701: 'Coal',
  8524: 'Display modules',
  8507: 'Batteries (accumulators)',
  8534: 'Printed circuit boards',
  8525: 'Cameras & transmission gear',
  8504: 'Transformers & power converters',
  2933: 'Heterocyclic compounds (APIs)',
  2934: 'Nucleic acids & compounds',
  2941: 'Antibiotics',
  5201: 'Raw cotton',
  5205: 'Cotton yarn',
  6109: 'T-shirts & knitwear',
  7204: 'Steel scrap',
  7210: 'Coated flat-rolled steel',
};
function cleanHsDesc(code, raw) {
  if (HS4_LABEL[code]) return HS4_LABEL[code];
  const s = String(raw).toLowerCase().replace(/\s+/g, ' ').trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : `HS ${code}`;
}
function prepHs4Items(rowsInput) {
  return rowsInput
    .filter((row) => row.HSCODE != null && row.HSDESC != null)
    .map((row) => {
      const code = String(row.HSCODE);
      return {
        code,
        name: cleanHsDesc(code, row.HSDESC),
        series: HS4_YEARS.map((y) => Number(row[`VAL_USD_${y}`] ?? 0)),
      };
    });
}
const HS4_ITEMS = { Exports: prepHs4Items(hs4ExportData), Imports: prepHs4Items(hs4ImportData) };

// Slice each product line to the [i0, i1] fiscal-year window and derive the change stats the
// mover rows render. Ranks are positions by value in the window's END year, so "rank #N" always
// describes the basket the window finishes in. Shared by the fixed movers cards (full window)
// and the explorer (user-chosen window).
function windowHs4(items, i0, i1) {
  const list = items.map((it) => {
    const series = it.series.slice(i0, i1 + 1);
    const base = series[0];
    const last = series[series.length - 1];
    return {
      code: it.code,
      name: it.name,
      series,
      base,
      last,
      abs: last - base,
      pct: base > 0 ? ((last - base) / base) * 100 : null,
    };
  });
  const rank = new Map(
    [...list].sort((a, b) => b.last - a.last).map((item, index) => [item.code, index + 1]),
  );
  list.forEach((item) => {
    item.latestRank = rank.get(item.code) ?? null;
  });
  return list;
}

// Every HS-4 line enriched over the full five-year window, plus by-code lookups used to
// assemble the import→export value-chain pairings.
const HS4_FULL = {
  Exports: windowHs4(HS4_ITEMS.Exports, 0, HS4_YEARS.length - 1),
  Imports: windowHs4(HS4_ITEMS.Imports, 0, HS4_YEARS.length - 1),
};
const EXPORT_BY_CODE = new Map(HS4_FULL.Exports.map((it) => [it.code, it]));
const IMPORT_BY_CODE = new Map(HS4_FULL.Imports.map((it) => [it.code, it]));

function buildMovers(list) {
  const gainers = [...list].sort((a, b) => b.abs - a.abs).slice(0, 6);
  const decliners = [...list].sort((a, b) => a.abs - b.abs).slice(0, 6);
  return { gainers, decliners };
}
const exportMovers = buildMovers(HS4_FULL.Exports);
const importMovers = buildMovers(HS4_FULL.Imports);

/* ------------------------------------------------------------------ */
/* Chart geometry                                                     */
/* ------------------------------------------------------------------ */
function buildTradeGeo(data, width) {
  const compact = width < COMPACT_BELOW;
  const height = Math.round(width * (compact ? 0.78 : 0.4));
  const pad = compact
    ? { top: 32, right: 14, bottom: 42, left: 44 }
    : { top: 30, right: 24, bottom: 52, left: 52 };
  const cw = width - pad.left - pad.right;
  const ch = height - pad.top - pad.bottom;
  const n = data.length;
  const xStep = cw / Math.max(n - 1, 1);
  const maxVal = Math.max(...data.map((d) => Math.max(d.export_usd_mn, d.import_usd_mn))) * 1.08;
  const x = (i) => pad.left + i * xStep;
  const y = (v) => pad.top + ch - (v / maxVal) * ch;
  const points = data.map((d, i) => ({
    i,
    d,
    x: x(i),
    ye: y(d.export_usd_mn),
    yi: y(d.import_usd_mn),
  }));
  const exportPath = points
    .map((p, i) => `${i ? 'L' : 'M'} ${p.x.toFixed(1)} ${p.ye.toFixed(1)}`)
    .join(' ');
  const importPath = points
    .map((p, i) => `${i ? 'L' : 'M'} ${p.x.toFixed(1)} ${p.yi.toFixed(1)}`)
    .join(' ');
  const upper = points.map((p) => `${p.x.toFixed(1)} ${p.yi.toFixed(1)}`);
  const lower = points
    .slice()
    .reverse()
    .map((p) => `${p.x.toFixed(1)} ${p.ye.toFixed(1)}`);
  const gapPath = `M ${upper.join(' L ')} L ${lower.join(' L ')} Z`;
  const yTicks = [];
  for (let i = 0; i <= 5; i += 1) {
    const v = maxVal * (1 - i / 5);
    yTicks.push({ v, y: y(v) });
  }
  const xLabelStep = Math.max(1, Math.ceil((n - 1) / (compact ? 4 : 8)));
  return {
    width,
    height,
    pad,
    xStep,
    maxVal,
    x,
    y,
    points,
    exportPath,
    importPath,
    gapPath,
    yTicks,
    compact,
    xLabelStep,
  };
}

function buildRupeeDeficitGeo(data, width) {
  const compact = width < COMPACT_BELOW;
  const height = Math.round(width * (compact ? 0.85 : 0.4));
  const pad = compact
    ? { top: 30, right: 56, bottom: 42, left: 42 }
    : { top: 30, right: 80, bottom: 52, left: 56 };
  const cw = width - pad.left - pad.right;
  const ch = height - pad.top - pad.bottom;
  const n = data.length;
  const xStep = cw / Math.max(n - 1, 1);
  const fxVals = data.map((d) => d.exchange_rate_inr_per_usd);
  const defVals = data.map((d) => d.cumulative_deficit_usd_mn);
  const fx0 = fxVals[0];
  const def0 = defVals[0];
  const fxMaxV = Math.max(...fxVals);
  const fxMinV = Math.min(...fxVals);
  const defMaxV = Math.max(...defVals);

  // Anchor both axes so the two lines BEGIN at the same height on the left. The rupee axis no
  // longer starts at 0 (which left the rupee line floating mid-chart); instead its base is set so
  // the first year lines up with where the cumulative-deficit line starts. Each axis keeps its own
  // real units and its own top headroom, so the lines are free to diverge by the end rather than
  // being forced to meet there.
  const defMin = 0;
  const defMax = defMaxV * 1.06;
  const startFrac = (def0 - defMin) / (defMax - defMin); // the deficit line's natural starting height
  const fxMax = fxMaxV * 1.18; // extra top room so the rupee line ends well below the deficit line
  const fxFloor = fxMinV - (fxMaxV - fxMinV) * 0.04; // never let the lowest rupee value touch the axis floor
  const fxMin = Math.min((fx0 - startFrac * fxMax) / (1 - startFrac), fxFloor);

  const x = (i) => pad.left + i * xStep;
  const yFx = (v) => pad.top + ch - ((v - fxMin) / (fxMax - fxMin)) * ch;
  const yDef = (v) => pad.top + ch - ((v - defMin) / (defMax - defMin)) * ch;
  const points = data.map((d, i) => ({
    i,
    d,
    x: x(i),
    yf: yFx(d.exchange_rate_inr_per_usd),
    yd: yDef(d.cumulative_deficit_usd_mn),
  }));
  const fxPath = points
    .map((p, i) => `${i ? 'L' : 'M'} ${p.x.toFixed(1)} ${p.yf.toFixed(1)}`)
    .join(' ');
  const deficitPath = points
    .map((p, i) => `${i ? 'L' : 'M'} ${p.x.toFixed(1)} ${p.yd.toFixed(1)}`)
    .join(' ');
  const leftTicks = [];
  const rightTicks = [];
  for (let i = 0; i <= 5; i += 1) {
    const fx = fxMin + (fxMax - fxMin) * (1 - i / 5);
    const def = defMin + (defMax - defMin) * (1 - i / 5);
    leftTicks.push({ v: fx, y: yFx(fx) });
    rightTicks.push({ v: def, y: yDef(def) });
  }
  const xLabelStep = Math.max(1, Math.ceil((n - 1) / (compact ? 4 : 8)));
  return {
    width,
    height,
    pad,
    xStep,
    fxMin,
    fxMax,
    defMin,
    defMax,
    x,
    yFx,
    yDef,
    points,
    fxPath,
    deficitPath,
    leftTicks,
    rightTicks,
    compact,
    xLabelStep,
  };
}

/* ------------------------------------------------------------------ */
/* Small building blocks                                              */
/* ------------------------------------------------------------------ */
const cardSx = {
  p: { xs: 2, md: 2.25 },
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 3,
  boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -18px rgba(15,23,42,0.25)',
};

/* ------------------------------------------------------------------ */
/* Interactive trade-trend chart (exports / imports + deficit gap)    */
/* ------------------------------------------------------------------ */
function TradeTrendChart() {
  const [hover, setHover] = React.useState(null);
  const [show, setShow] = React.useState({ exports: true, imports: true, gap: true });
  const wrapRef = React.useRef(null);
  const measuredWidth = useMeasuredWidth(wrapRef, 1080);
  const geo = React.useMemo(() => buildTradeGeo(rows, measuredWidth), [measuredWidth]);

  const onMove = (e) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const vbX = ((e.clientX - rect.left) / rect.width) * geo.width;
    setHover(clamp(Math.round((vbX - geo.pad.left) / geo.xStep), 0, rows.length - 1));
  };

  const p = hover != null ? geo.points[hover] : null;
  const tipLeft = p ? (p.x / geo.width) * 100 : 0;
  const flip = tipLeft > 60;
  const toggle = (k) => setShow((s) => ({ ...s, [k]: !s[k] }));
  const gapOn = show.gap && show.exports && show.imports;

  const legend = [
    { k: 'exports', label: 'Exports', color: C.blue },
    { k: 'imports', label: 'Imports', color: C.orange },
    { k: 'gap', label: 'Deficit gap', color: C.red },
  ];

  return (
    <Paper sx={{ ...cardSx }}>
      <Stack spacing={1.5}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            Exports vs imports · US$ billion
          </Typography>
          <Stack direction="row" spacing={0.75}>
            {legend.map((l) => {
              const on = show[l.k];
              return (
                <Chip
                  key={l.k}
                  size="small"
                  onClick={() => toggle(l.k)}
                  icon={
                    <Box
                      sx={{
                        width: 9,
                        height: 9,
                        borderRadius: l.k === 'gap' ? 0.5 : 999,
                        bgcolor: l.color,
                        ml: '6px !important',
                      }}
                    />
                  }
                  label={l.label}
                  sx={{
                    cursor: 'pointer',
                    fontWeight: 700,
                    bgcolor: on ? alpha(l.color, 0.1) : 'transparent',
                    color: on ? l.color : 'text.disabled',
                    border: '1px solid',
                    borderColor: on ? alpha(l.color, 0.25) : 'divider',
                    textDecoration: on ? 'none' : 'line-through',
                  }}
                />
              );
            })}
          </Stack>
        </Box>

        <Box
          ref={wrapRef}
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
          onTouchStart={(e) => onMove(e.touches[0])}
          onTouchMove={(e) => onMove(e.touches[0])}
          sx={{ position: 'relative', width: '100%', cursor: 'crosshair', touchAction: 'pan-y' }}
        >
          <Box
            component="svg"
            viewBox={`0 0 ${geo.width} ${geo.height}`}
            role="img"
            aria-label="Exports and imports trend"
            sx={{ width: '100%', height: 'auto', display: 'block' }}
          >
            <defs>
              <linearGradient id="deficitGap" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={C.red} stopOpacity="0.18" />
                <stop offset="100%" stopColor={C.orange} stopOpacity="0.06" />
              </linearGradient>
            </defs>
            <text
              x={4}
              y={20}
              textAnchor="start"
              fill="#64748b"
              fontSize="11"
              fontWeight="700"
              fontFamily="IBM Plex Mono, monospace"
            >
              US$ bn
            </text>
            {geo.yTicks.map((t, i) => (
              <g key={i}>
                <line
                  x1={geo.pad.left}
                  x2={geo.width - geo.pad.right}
                  y1={t.y}
                  y2={t.y}
                  stroke={C.grid}
                  strokeWidth="1"
                />
                <text
                  x={geo.pad.left - 10}
                  y={t.y + 4}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="11"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {Math.round(t.v / 1000)}
                </text>
              </g>
            ))}
            {gapOn ? <path d={geo.gapPath} fill="url(#deficitGap)" /> : null}
            {show.exports ? (
              <path
                d={geo.exportPath}
                fill="none"
                stroke={C.blue}
                strokeWidth="3.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}
            {show.imports ? (
              <path
                d={geo.importPath}
                fill="none"
                stroke={C.orange}
                strokeWidth="3.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}

            {hover != null ? (
              <line
                x1={p.x}
                x2={p.x}
                y1={geo.pad.top}
                y2={geo.height - geo.pad.bottom}
                stroke="#0c1730"
                strokeOpacity="0.18"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            ) : null}

            {geo.points.map((pt) => (
              <React.Fragment key={pt.d.financial_year}>
                {/* Resting dots are hidden on compact — 16 white-ringed dots on a ~300px line read
                    as a dotted stroke. The hovered year still gets its marker. */}
                {show.exports && (!geo.compact || hover === pt.i) ? (
                  <circle
                    cx={pt.x}
                    cy={pt.ye}
                    r={hover === pt.i ? 5.5 : 3.5}
                    fill={C.blue}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                ) : null}
                {show.imports && (!geo.compact || hover === pt.i) ? (
                  <circle
                    cx={pt.x}
                    cy={pt.yi}
                    r={hover === pt.i ? 5.5 : 3.5}
                    fill={C.orange}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                ) : null}
                {(() => {
                  const n = geo.points.length;
                  if (pt.i !== n - 1 && (n - 1 - pt.i) % geo.xLabelStep !== 0) return null;
                  const last = pt.i === n - 1;
                  return (
                    <text
                      x={pt.x}
                      y={geo.height - 18}
                      textAnchor={pt.i === 0 ? 'start' : last ? 'end' : 'middle'}
                      fill={last ? C.purple : '#64748b'}
                      fontSize="11"
                      fontWeight={last ? 800 : 500}
                      fontFamily="IBM Plex Mono, monospace"
                    >
                      {`${pt.d.financial_year.slice(2, 4)}–${pt.d.financial_year.slice(-2)}`}
                    </text>
                  );
                })()}
              </React.Fragment>
            ))}
          </Box>

          {p ? (
            <Box
              sx={{
                position: 'absolute',
                left: geo.compact ? 'auto' : `${tipLeft}%`,
                right: geo.compact ? 4 : 'auto',
                top: 8,
                transform: geo.compact
                  ? 'none'
                  : flip
                    ? 'translateX(calc(-100% - 14px))'
                    : 'translateX(14px)',
                pointerEvents: 'none',
                bgcolor: C.ink,
                color: '#e7ecf5',
                borderRadius: 2,
                p: 1.25,
                minWidth: 178,
                boxShadow: '0 10px 30px -8px rgba(8,15,30,0.55)',
                zIndex: 3,
              }}
            >
              <Typography sx={{ ...mono, fontWeight: 700, fontSize: 12, color: '#fff', mb: 0.75 }}>
                {p.d.financial_year}
                {p.d.data_status === 'year_to_date' ? '  · YTD' : ''}
              </Typography>
              <TipRow
                color={C.blue}
                label="Exports"
                value={moneyB(p.d.export_usd_mn)}
                sub={p.d.export_yoy_pct == null ? '' : `${pct.format(p.d.export_yoy_pct)}%`}
              />
              <TipRow
                color={C.orange}
                label="Imports"
                value={moneyB(p.d.import_usd_mn)}
                sub={p.d.import_yoy_pct == null ? '' : `${pct.format(p.d.import_yoy_pct)}%`}
              />
              <Box sx={{ height: '1px', bgcolor: 'rgba(255,255,255,0.12)', my: 0.75 }} />
              <TipRow
                color={C.red}
                label="Deficit"
                value={moneySignB(p.d.trade_balance_usd_mn)}
                sub=""
              />
            </Box>
          ) : null}
        </Box>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          The shaded band is the trade deficit — the gap between imports and exports. Hover or tap
          any year for figures; click a legend chip to toggle a series.
        </Typography>
      </Stack>
    </Paper>
  );
}

function RupeeDeficitChart() {
  const [hover, setHover] = React.useState(null);
  const [show, setShow] = React.useState({ rupee: true, deficit: true });
  const wrapRef = React.useRef(null);
  const measuredWidth = useMeasuredWidth(wrapRef, 1080);
  const geo = React.useMemo(
    () => buildRupeeDeficitGeo(rupeeDeficitRows, measuredWidth),
    [measuredWidth],
  );

  const onMove = (e) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const vbX = ((e.clientX - rect.left) / rect.width) * geo.width;
    setHover(clamp(Math.round((vbX - geo.pad.left) / geo.xStep), 0, rupeeDeficitRows.length - 1));
  };

  const p = hover != null ? geo.points[hover] : null;
  const tipLeft = p ? (p.x / geo.width) * 100 : 0;
  const flip = tipLeft > 60;

  const legend = [
    { k: 'rupee', label: 'INR per USD', color: C.purple },
    { k: 'deficit', label: 'Cumulative deficit', color: C.red },
  ];

  const toggle = (k) => setShow((s) => ({ ...s, [k]: !s[k] }));

  return (
    <Paper sx={{ ...cardSx }}>
      <Stack spacing={1.5}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            Rupee value vs cumulative export deficit
          </Typography>
          <Stack direction="row" spacing={0.75}>
            {legend.map((l) => {
              const on = show[l.k];
              return (
                <Chip
                  key={l.k}
                  size="small"
                  onClick={() => toggle(l.k)}
                  icon={
                    <Box
                      sx={{
                        width: 9,
                        height: 9,
                        borderRadius: 999,
                        bgcolor: l.color,
                        ml: '6px !important',
                      }}
                    />
                  }
                  label={l.label}
                  sx={{
                    cursor: 'pointer',
                    fontWeight: 700,
                    bgcolor: on ? alpha(l.color, 0.1) : 'transparent',
                    color: on ? l.color : 'text.disabled',
                    border: '1px solid',
                    borderColor: on ? alpha(l.color, 0.25) : 'divider',
                    textDecoration: on ? 'none' : 'line-through',
                  }}
                />
              );
            })}
          </Stack>
        </Box>

        <Box
          ref={wrapRef}
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
          onTouchStart={(e) => onMove(e.touches[0])}
          onTouchMove={(e) => onMove(e.touches[0])}
          sx={{ position: 'relative', width: '100%', cursor: 'crosshair', touchAction: 'pan-y' }}
        >
          <Box
            component="svg"
            viewBox={`0 0 ${geo.width} ${geo.height}`}
            role="img"
            aria-label="Rupee value and cumulative export deficit"
            sx={{ width: '100%', height: 'auto', display: 'block' }}
          >
            {geo.leftTicks.map((t, i) => (
              <g key={`l-${i}`}>
                <line
                  x1={geo.pad.left}
                  x2={geo.width - geo.pad.right}
                  y1={t.y}
                  y2={t.y}
                  stroke={C.grid}
                  strokeWidth="1"
                />
                <text
                  x={geo.pad.left - 10}
                  y={t.y + 4}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="11"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {geo.compact ? Math.round(t.v) : nf2.format(t.v)}
                </text>
              </g>
            ))}
            {geo.rightTicks.map((t, i) => (
              <text
                key={`r-${i}`}
                x={geo.width - geo.pad.right + 10}
                y={t.y + 4}
                textAnchor="start"
                fill="#94a3b8"
                fontSize="11"
                fontFamily="IBM Plex Mono, monospace"
              >
                {geo.compact ? moneyShortB(t.v) : moneyB(t.v)}
              </text>
            ))}
            <text
              x={4}
              y={20}
              textAnchor="start"
              fill="#64748b"
              fontSize="11"
              fontWeight="700"
              fontFamily="IBM Plex Mono, monospace"
            >
              INR/USD
            </text>
            <text
              x={geo.width - 4}
              y={20}
              textAnchor="end"
              fill="#64748b"
              fontSize="11"
              fontWeight="700"
              fontFamily="IBM Plex Mono, monospace"
            >
              Cumulative deficit
            </text>
            {show.deficit ? (
              <path
                d={geo.deficitPath}
                fill="none"
                stroke={C.red}
                strokeWidth="3.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}
            {show.rupee ? (
              <path
                d={geo.fxPath}
                fill="none"
                stroke={C.purple}
                strokeWidth="3.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}

            {hover != null ? (
              <line
                x1={p.x}
                x2={p.x}
                y1={geo.pad.top}
                y2={geo.height - geo.pad.bottom}
                stroke="#0c1730"
                strokeOpacity="0.18"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            ) : null}

            {geo.points.map((pt) => {
              const n = geo.points.length;
              const showLabel = pt.i === n - 1 || (n - 1 - pt.i) % geo.xLabelStep === 0;
              return (
                <React.Fragment key={pt.d.financial_year}>
                  {show.rupee && (!geo.compact || hover === pt.i) ? (
                    <circle
                      cx={pt.x}
                      cy={pt.yf}
                      r={hover === pt.i ? 5.5 : 3.5}
                      fill={C.purple}
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  ) : null}
                  {show.deficit && (!geo.compact || hover === pt.i) ? (
                    <circle
                      cx={pt.x}
                      cy={pt.yd}
                      r={hover === pt.i ? 5.5 : 3.5}
                      fill={C.red}
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  ) : null}
                  {showLabel ? (
                    <text
                      x={pt.x}
                      y={geo.height - 18}
                      textAnchor={pt.i === 0 ? 'start' : pt.i === n - 1 ? 'end' : 'middle'}
                      fill={pt.i === n - 1 ? C.purple : '#64748b'}
                      fontSize="11"
                      fontWeight={pt.i === n - 1 ? 800 : 500}
                      fontFamily="IBM Plex Mono, monospace"
                    >
                      {`${pt.d.financial_year.slice(2, 4)}–${pt.d.financial_year.slice(-2)}`}
                    </text>
                  ) : null}
                </React.Fragment>
              );
            })}
          </Box>

          {p ? (
            <Box
              sx={{
                position: 'absolute',
                left: geo.compact ? 'auto' : `${tipLeft}%`,
                right: geo.compact ? 4 : 'auto',
                top: geo.compact ? 30 : 8,
                transform: geo.compact
                  ? 'none'
                  : flip
                    ? 'translateX(calc(-100% - 14px))'
                    : 'translateX(14px)',
                pointerEvents: 'none',
                bgcolor: C.ink,
                color: '#e7ecf5',
                borderRadius: 2,
                p: 1.25,
                minWidth: 188,
                boxShadow: '0 10px 30px -8px rgba(8,15,30,0.55)',
                zIndex: 3,
              }}
            >
              <Typography sx={{ ...mono, fontWeight: 700, fontSize: 12, color: '#fff', mb: 0.75 }}>
                {p.d.financial_year}
              </Typography>
              <TipRow
                color={C.purple}
                label="INR / USD"
                value={`₹${nf2.format(p.d.exchange_rate_inr_per_usd)}`}
                sub=""
              />
              <TipRow
                color={C.red}
                label="Annual deficit"
                value={moneyB(p.d.annual_deficit_usd_mn)}
                sub=""
              />
              <Box sx={{ height: '1px', bgcolor: 'rgba(255,255,255,0.12)', my: 0.75 }} />
              <TipRow
                color={C.red}
                label="Cumulative"
                value={moneyB(p.d.cumulative_deficit_usd_mn)}
                sub=""
              />
            </Box>
          ) : null}
        </Box>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          RBI Table 139 provides the financial-year annual average INR per USD; the deficit line is
          the cumulative annual trade deficit. Both lines start from the same point on the left so
          you can see how the rupee and the deficit move together — each keeps its own axis, so
          they&apos;re free to diverge over time.
        </Typography>
      </Stack>
    </Paper>
  );
}

function TipRow({ color, label, value, sub }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, py: 0.15 }}>
      <Box sx={{ width: 8, height: 8, borderRadius: 999, bgcolor: color, flexShrink: 0 }} />
      <Typography sx={{ fontSize: 11.5, color: 'rgba(231,236,245,0.8)', flex: 1 }}>
        {label}
      </Typography>
      <Typography sx={{ ...mono, fontSize: 12, fontWeight: 700, color: '#fff' }}>
        {value}
      </Typography>
      {sub ? (
        <Typography
          sx={{
            ...mono,
            fontSize: 10.5,
            color: 'rgba(231,236,245,0.6)',
            minWidth: 44,
            textAlign: 'right',
          }}
        >
          {sub}
        </Typography>
      ) : null}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Latest-year basket split (donut)                                   */
/* ------------------------------------------------------------------ */
function CompositionDonut({ sideLabel, tone, comp }) {
  const accent = toneColor(tone);
  const [hover, setHover] = React.useState(null);

  const rest = comp.latestYear.rest;
  const slices = [
    ...comp.latestYear.segs.map((s) => ({
      key: s.key,
      name: s.name,
      share: s.share,
      value: s.value,
      color: s.color,
    })),
    {
      key: 'rest',
      name: 'Rest of basket',
      share: rest.share,
      value: rest.value,
      color: REST_COLOR,
    },
  ];
  const total = comp.latestYear.total;
  const year = comp.latestYear.year;
  const yearLabel = year.length > 7 ? `${year.slice(2, 4)}–${year.slice(-2)}` : year;

  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = 122;
  const rInner = 76;
  const polar = (r, deg) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  const arcPath = (a0, a1, ro, ri) => {
    const large = a1 - a0 > 180 ? 1 : 0;
    const o0 = polar(ro, a0);
    const o1 = polar(ro, a1);
    const i1 = polar(ri, a1);
    const i0 = polar(ri, a0);
    return `M ${o0.x.toFixed(2)} ${o0.y.toFixed(2)} A ${ro} ${ro} 0 ${large} 1 ${o1.x.toFixed(2)} ${o1.y.toFixed(2)} L ${i1.x.toFixed(2)} ${i1.y.toFixed(2)} A ${ri} ${ri} 0 ${large} 0 ${i0.x.toFixed(2)} ${i0.y.toFixed(2)} Z`;
  };

  let acc = 0;
  const arcs = slices.map((s) => {
    const a0 = (acc / 100) * 360;
    acc += s.share;
    const a1 = (acc / 100) * 360;
    return { ...s, a0, a1 };
  });
  const hv = hover != null ? arcs[hover] : null;

  return (
    <Paper sx={{ ...cardSx, borderColor: alpha(accent, 0.2) }}>
      <Stack spacing={1.25}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}
        >
          <Typography variant="h6">{`Latest ${sideLabel.toLowerCase()} by industry`}</Typography>
          <Chip
            size="small"
            label={yearLabel}
            sx={{ bgcolor: alpha(accent, 0.1), color: accent, fontWeight: 800 }}
          />
        </Box>

        <Box sx={{ position: 'relative', width: '100%', maxWidth: 300, mx: 'auto' }}>
          <Box
            component="svg"
            viewBox={`0 0 ${size} ${size}`}
            role="img"
            aria-label={`${sideLabel} by industry, ${year}`}
            sx={{ width: '100%', height: 'auto', display: 'block' }}
            onMouseLeave={() => setHover(null)}
          >
            {arcs.map((a, i) => (
              <path
                key={a.key}
                d={arcPath(a.a0, a.a1, rOuter, rInner)}
                fill={a.color}
                fillOpacity={hover != null && hover !== i ? 0.32 : 0.92}
                stroke="#fff"
                strokeWidth="1.5"
                onMouseEnter={() => setHover(i)}
                style={{ cursor: 'pointer', transition: 'fill-opacity 120ms' }}
              />
            ))}
          </Box>

          {arcs.map((a, i) => {
            if (a.share < 4 || !basketIconFor(a.name, a.key === 'rest')) return null;
            const p = polar((rInner + rOuter) / 2, (a.a0 + a.a1) / 2);
            return (
              <Box
                key={`ic-${a.key}`}
                sx={{
                  position: 'absolute',
                  left: `${(p.x / size) * 100}%`,
                  top: `${(p.y / size) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                  opacity: hover != null && hover !== i ? 0.3 : 1,
                  transition: 'opacity 120ms',
                }}
              >
                <BasketMark
                  name={a.name}
                  color={iconInk(a.color)}
                  rest={a.key === 'rest'}
                  size={14}
                />
              </Box>
            );
          })}

          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              pointerEvents: 'none',
              textAlign: 'center',
              px: '22%',
            }}
          >
            {hv ? (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5,
                    mb: 0.25,
                  }}
                >
                  <BasketMark name={hv.name} color={hv.color} rest={hv.key === 'rest'} size={16} />
                  <Typography sx={{ fontSize: 12, fontWeight: 700, lineHeight: 1.1 }}>
                    {hv.name}
                  </Typography>
                </Box>
                <Typography
                  sx={{ ...mono, fontSize: 18, fontWeight: 800, color: hv.color, lineHeight: 1.1 }}
                >{`${hv.share.toFixed(1)}%`}</Typography>
                <Typography sx={{ ...mono, fontSize: 11, color: 'text.secondary' }}>
                  {moneyB(hv.value)}
                </Typography>
              </Box>
            ) : (
              <Box>
                <Typography
                  sx={{ ...mono, fontSize: 22, fontWeight: 800, color: C.ink, lineHeight: 1.05 }}
                >
                  {moneyB(total)}
                </Typography>
                <Typography
                  variant="overline"
                  sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.4 }}
                >
                  Total
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.6, flexWrap: 'wrap' }}>
          {slices.map((s) => (
            <Box
              key={s.key}
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 0.5 }}
            >
              <BasketMark name={s.name} color={s.color} rest={s.key === 'rest'} />
              <Typography sx={{ fontSize: 11, fontWeight: 700 }}>{s.name}</Typography>
              <Typography
                sx={{ ...mono, fontSize: 11, color: 'text.secondary' }}
              >{`${s.share.toFixed(1)}%`}</Typography>
            </Box>
          ))}
        </Box>

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {`Share of total ${sideLabel.toLowerCase()} by commodity basket in ${year}; slices sum to 100%.`}
        </Typography>
      </Stack>
    </Paper>
  );
}

function CompositionChart({
  title,
  sideLabel,
  tone,
  comp,
  groupNoun = 'official commodity groups',
  controls = null,
}) {
  const accent = toneColor(tone);
  const [hover, setHover] = React.useState(null);
  const wrapRef = React.useRef(null);

  const width = useMeasuredWidth(wrapRef, 1080);
  const compact = width < COMPACT_BELOW;
  // Rendered at width:100%/height:auto, so on-screen height = containerWidth * (height/width).
  // Phones get a taller aspect so the stacked bands stay thick enough to read.
  const height = Math.round(width * (compact ? 0.9 : 0.42));
  const pad = compact
    ? { top: 20, right: 12, bottom: 42, left: 42 }
    : { top: 24, right: 22, bottom: 48, left: 52 };
  const cw = width - pad.left - pad.right;
  const ch = height - pad.top - pad.bottom;
  const n = comp.years.length;
  const x = (i) => pad.left + (n <= 1 ? cw / 2 : (i / (n - 1)) * cw);
  const y = (v) => pad.top + ch - (v / 100) * ch;

  const order = comp.items.map((it, j) => ({
    key: it.key,
    name: comp.latestYear.segs[j].name,
    color: comp.latestYear.segs[j].color || CAT[j % CAT.length],
    j,
    isRest: false,
  }));
  order.push({ key: 'rest', name: 'Rest of basket', color: REST_COLOR, j: -1, isRest: true });

  const shareAt = (b, i) => (b.isRest ? comp.years[i].rest.share : comp.years[i].segs[b.j].share);
  const valueAt = (b, i) => (b.isRest ? comp.years[i].rest.value : comp.years[i].segs[b.j].value);

  const bands = order.map(() => ({ top: [], bottom: [] }));
  for (let i = 0; i < n; i += 1) {
    let acc = 0;
    order.forEach((b, bi) => {
      const sh = shareAt(b, i);
      bands[bi].bottom.push(acc);
      bands[bi].top.push(acc + sh);
      acc += sh;
    });
  }
  const pt = (v, i) => `${x(i).toFixed(1)} ${y(v).toFixed(1)}`;
  const areaPath = (bi) => {
    const top = bands[bi].top.map((v, i) => pt(v, i));
    const bot = bands[bi].bottom.map((v, i) => pt(v, i)).reverse();
    return `M ${top.join(' L ')} L ${bot.join(' L ')} Z`;
  };
  const edgePath = (bi) => `M ${bands[bi].top.map((v, i) => pt(v, i)).join(' L ')}`;

  const onMove = (e) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const vbX = ((e.clientX - rect.left) / rect.width) * width;
    const yr = clamp(Math.round((vbX - pad.left) / (cw / Math.max(n - 1, 1))), 0, n - 1);
    setHover((h) => ({ band: h ? h.band : 0, year: yr }));
  };

  const hb = hover ? order[hover.band] : null;
  const hy = hover ? hover.year : 0;
  const tipLeft = hover ? (x(hy) / width) * 100 : 0;
  const tipTop = hb
    ? (y((bands[hover.band].top[hy] + bands[hover.band].bottom[hy]) / 2) / height) * 100
    : 0;
  const flip = tipLeft > 58;

  return (
    <Paper sx={{ ...cardSx, borderColor: alpha(accent, 0.2) }}>
      <Stack spacing={1.25}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <Box>
            <Typography variant="h6">{title}</Typography>
          </Box>
          <Chip
            size="small"
            label={`Top ${comp.items.length} = ${comp.topShare.toFixed(1)}%`}
            sx={{ bgcolor: alpha(accent, 0.1), color: accent, fontWeight: 800 }}
          />
        </Box>

        {controls}

        <Box
          ref={wrapRef}
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
          onTouchStart={(e) => onMove(e.touches[0])}
          onTouchMove={(e) => onMove(e.touches[0])}
          sx={{ position: 'relative', width: '100%', cursor: 'crosshair', touchAction: 'pan-y' }}
        >
          <Box
            component="svg"
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={`${title} composition`}
            sx={{ width: '100%', height: 'auto', display: 'block' }}
          >
            {[0, 25, 50, 75, 100].map((v) => (
              <g key={v}>
                <line
                  x1={pad.left}
                  x2={width - pad.right}
                  y1={y(v)}
                  y2={y(v)}
                  stroke={C.grid}
                  strokeWidth="1"
                />
                <text
                  x={pad.left - 10}
                  y={y(v) + 4}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="10.5"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {`${v}%`}
                </text>
              </g>
            ))}
            {order.map((b, bi) => (
              <path
                key={b.key}
                d={areaPath(bi)}
                fill={b.color}
                fillOpacity={hover && hover.band !== bi ? 0.4 : 0.92}
                stroke="#fff"
                strokeWidth="1"
                onMouseEnter={() => setHover((h) => ({ band: bi, year: h ? h.year : n - 1 }))}
                style={{ cursor: 'pointer' }}
              />
            ))}
            {hover ? (
              <g>
                <line
                  x1={x(hy)}
                  x2={x(hy)}
                  y1={pad.top}
                  y2={pad.top + ch}
                  stroke="#0c1730"
                  strokeOpacity="0.22"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <path d={edgePath(hover.band)} fill="none" stroke="#fff" strokeWidth="2.5" />
                <circle
                  cx={x(hy)}
                  cy={y(bands[hover.band].top[hy])}
                  r="4"
                  fill="#fff"
                  stroke={hb.color}
                  strokeWidth="2.5"
                />
              </g>
            ) : null}
            {comp.years.map((yr, i) => {
              const labelStep = Math.max(1, Math.ceil((n - 1) / (compact ? 3 : 5)));
              if (i !== n - 1 && (n - 1 - i) % labelStep !== 0) return null;
              const lbl =
                yr.year.length > 7 ? `${yr.year.slice(2, 4)}–${yr.year.slice(-2)}` : yr.year;
              return (
                <text
                  key={yr.year}
                  x={x(i)}
                  y={height - 18}
                  textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}
                  fill={i === n - 1 ? C.purple : '#64748b'}
                  fontSize="11"
                  fontWeight={i === n - 1 ? 800 : 600}
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {lbl}
                </text>
              );
            })}
          </Box>

          {order.map((b, bi) => {
            // The icon is an HTML overlay in fixed CSS px; only place it when the band's
            // latest-year thickness (also px, since viewBox == container px) can contain it,
            // so icons never stack on top of each other on narrow screens.
            const latestShare = bands[bi].top[n - 1] - bands[bi].bottom[n - 1];
            const bandPx = (latestShare / 100) * ch;
            const iconSize = compact ? 11 : 15;
            if (bandPx < iconSize + 5 || !basketIconFor(b.name, b.isRest)) return null;
            const yMid = y((bands[bi].top[n - 1] + bands[bi].bottom[n - 1]) / 2);
            return (
              <Box
                key={`ic-${b.key}`}
                sx={{
                  position: 'absolute',
                  left: `${clamp((x(n - 1) / width) * 100, 5, 96)}%`,
                  top: `${(yMid / height) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                  opacity: hover && hover.band !== bi ? 0.35 : 1,
                  transition: 'opacity 120ms',
                }}
              >
                <BasketMark
                  name={b.name}
                  color={iconInk(b.color)}
                  rest={b.isRest}
                  size={iconSize}
                />
              </Box>
            );
          })}

          {hb ? (
            <Box
              sx={{
                position: 'absolute',
                left: compact ? 'auto' : `${tipLeft}%`,
                right: compact ? 4 : 'auto',
                top: compact ? 4 : `${tipTop}%`,
                transform: compact
                  ? 'none'
                  : flip
                    ? 'translate(calc(-100% - 14px), -50%)'
                    : 'translate(14px, -50%)',
                pointerEvents: 'none',
                bgcolor: C.ink,
                color: '#fff',
                borderRadius: 2,
                p: 1.1,
                width: 190,
                boxShadow: '0 10px 30px -8px rgba(8,15,30,0.55)',
                zIndex: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                <BasketMark name={hb.name} color={hb.color} rest={hb.isRest} size={15} />
                <Typography sx={{ fontWeight: 700, fontSize: 12.5 }}>{hb.name}</Typography>
                <Typography
                  sx={{ ...mono, fontSize: 11, color: 'rgba(231,236,245,0.7)', ml: 'auto' }}
                >
                  {comp.years[hy].year}
                </Typography>
              </Box>
              <Typography sx={{ ...mono, fontSize: 12.5, fontWeight: 700 }}>
                {shareAt(hb, hy).toFixed(1)}% · {moneyB(valueAt(hb, hy))}
              </Typography>
            </Box>
          ) : null}
        </Box>

        <Box sx={{ display: 'flex', gap: 0.6, flexWrap: 'wrap' }}>
          {comp.latestYear.segs.map((seg, si) => (
            <Box
              key={seg.key}
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 0.5 }}
            >
              <BasketMark name={seg.name} color={seg.color || CAT[si % CAT.length]} />
              <Typography sx={{ fontSize: 11, fontWeight: 700 }}>{seg.name}</Typography>
              <Typography sx={{ ...mono, fontSize: 11, color: 'text.secondary' }}>
                {seg.share.toFixed(1)}%
              </Typography>
            </Box>
          ))}
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 0.5 }}>
            <BasketMark color={REST_COLOR} rest />
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary' }}>
              Rest {comp.latestYear.rest.share.toFixed(1)}%
            </Typography>
          </Box>
        </Box>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {sideLabel} across {comp.groupCount} {groupNoun}; the top {comp.items.length} are shown as
          continuous bands and each year sums to 100%.
        </Typography>
      </Stack>
    </Paper>
  );
}

/* ------------------------------------------------------------------ */
/* Item-level movers panel                                            */
/* ------------------------------------------------------------------ */
function Sparkline({ series, color, w = 72, h = 26 }) {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const padY = 3;
  const n = series.length;
  const x = (i) => (n <= 1 ? w / 2 : (i / (n - 1)) * w);
  const y = (v) => padY + (h - 2 * padY) * (1 - (v - min) / span);
  const d = series
    .map((v, i) => `${i ? 'L' : 'M'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`)
    .join(' ');
  return (
    <Box
      component="svg"
      viewBox={`0 0 ${w} ${h}`}
      sx={{ width: w, height: h, flexShrink: 0, display: 'block', overflow: 'visible' }}
      aria-hidden
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={x(n - 1)} cy={y(series[n - 1])} r="2.4" fill={color} />
    </Box>
  );
}

const pctLabel = (pct) => (pct == null ? 'new' : `${pct >= 0 ? '+' : ''}${Math.round(pct)}%`);

function MoverRow({ item, color, years = HS4_YEARS, rankFy = '26' }) {
  const tip = (
    <Box>
      {years.map((y, i) => (
        <Box key={y} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5 }}>
          <span>{`FY${y}`}</span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{moneyB(item.series[i])}</span>
        </Box>
      ))}
    </Box>
  );
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        py: 0.65,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          sx={{
            fontSize: 12.5,
            fontWeight: 700,
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.name}
        </Typography>
        {/* Two nowrap halves in a wrapping flex row: on narrow screens the value range drops to
            its own line cleanly instead of leaving a dangling separator at the line break. */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 0.75 }}>
          <Typography
            component="span"
            sx={{ ...mono, fontSize: 10.5, color: 'text.secondary', whiteSpace: 'nowrap' }}
          >
            {`HS ${item.code} · FY${rankFy} rank #${item.latestRank ?? '—'}`}
          </Typography>
          <Typography
            component="span"
            sx={{ ...mono, fontSize: 10.5, color: 'text.secondary', whiteSpace: 'nowrap' }}
          >
            {`${moneyB(item.base)} → ${moneyB(item.last)}`}
          </Typography>
        </Box>
      </Box>
      <Tooltip title={tip} arrow placement="top" enterTouchDelay={0} leaveTouchDelay={2500}>
        <Box sx={{ cursor: 'help' }}>
          <Sparkline series={item.series} color={color} />
        </Box>
      </Tooltip>
      <Box sx={{ textAlign: 'right', minWidth: 82 }}>
        <Typography sx={{ ...mono, fontSize: 12.5, fontWeight: 800, color, lineHeight: 1.2 }}>
          {moneySignB(item.abs)}
        </Typography>
        <Typography sx={{ ...mono, fontSize: 10.5, color: 'text.secondary' }}>
          {pctLabel(item.pct)}
        </Typography>
      </Box>
    </Box>
  );
}

function MoversGroup({ title, items, positive, years, rankFy }) {
  const color = positive ? C.teal : C.red;
  const Icon = positive ? TrendingUpRounded : TrendingDownRounded;
  return (
    // minWidth 0 lets this shrink below its content as a grid/flex item, so long raw HS-4
    // descriptions ellipsize inside MoverRow instead of blowing the column out past the card.
    <Box sx={{ minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.25 }}>
        <Icon sx={{ fontSize: 16, color }} />
        <Typography variant="overline" sx={{ color, letterSpacing: '0.08em' }}>
          {title}
        </Typography>
      </Box>
      {items.map((it) => (
        <MoverRow key={it.code} item={it} color={color} years={years} rankFy={rankFy} />
      ))}
    </Box>
  );
}

function MoversCard({ sideLabel, tone, movers }) {
  const accent = toneColor(tone);
  return (
    <Paper sx={{ ...cardSx, borderColor: alpha(accent, 0.2) }}>
      <Stack spacing={1.5}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}
        >
          <Typography variant="h6">{`${sideLabel}: biggest movers`}</Typography>
          <Chip
            size="small"
            label="FY21–22 → FY25–26"
            sx={{ bgcolor: alpha(accent, 0.1), color: accent, fontWeight: 800 }}
          />
        </Box>
        <MoversGroup title="Fastest growing" items={movers.gainers} positive />
        <MoversGroup title="Biggest decline" items={movers.decliners} positive={false} />
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {`Ranked by change in annual ${sideLabel.toLowerCase()} value (US$) from FY2021-22 to FY2025-26, across HS-4 product lines. Each row also shows the item's FY2025-26 position in the latest basket. Hover or tap a sparkline for the year-by-year path.`}
        </Typography>
      </Stack>
    </Paper>
  );
}

/* ------------------------------------------------------------------ */
/* Build-your-own movers explorer                                     */
/* ------------------------------------------------------------------ */
const fyTick = (y) => `${y.slice(2, 4)}–${y.slice(-2)}`; // '2021-22' -> '21–22'

// Lines below this start-of-window value are left out of the % ranking, where a near-zero base
// turns into a four-digit percentage and crowds out every economically meaningful move.
const PCT_FLOOR_USD_MN = 500;

function ToggleChips({ options, value, onChange, colorFor }) {
  return (
    <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
      {options.map(([key, label]) => {
        const on = value === key;
        const c = colorFor(key);
        return (
          <Chip
            key={key}
            size="small"
            label={label}
            onClick={() => onChange(key)}
            sx={{
              cursor: 'pointer',
              fontWeight: 700,
              bgcolor: on ? alpha(c, 0.12) : 'transparent',
              color: on ? c : 'text.secondary',
              border: '1px solid',
              borderColor: on ? alpha(c, 0.3) : 'divider',
            }}
          />
        );
      })}
    </Stack>
  );
}

function MoverExplorer() {
  const [side, setSide] = React.useState('Exports');
  const [range, setRange] = React.useState([0, HS4_YEARS.length - 1]);
  const [rankBy, setRankBy] = React.useState('abs');
  const [topN, setTopN] = React.useState(6);
  const [query, setQuery] = React.useState('');

  const accent = side === 'Exports' ? C.blue : C.orange;
  const [i0, i1] = range;
  const windowYears = HS4_YEARS.slice(i0, i1 + 1);
  const rankFy = HS4_YEARS[i1].slice(-2);

  const handleRange = (_, value, activeThumb) => {
    if (!Array.isArray(value)) return;
    if (value[1] - value[0] < 1) {
      // Keep at least one year of movement in the window; nudge the other thumb along.
      const lastIdx = HS4_YEARS.length - 1;
      if (activeThumb === 0) {
        const lo = Math.min(value[0], lastIdx - 1);
        setRange([lo, lo + 1]);
      } else {
        const hi = Math.max(value[1], 1);
        setRange([hi - 1, hi]);
      }
      return;
    }
    setRange(value);
  };

  const computed = React.useMemo(() => windowHs4(HS4_ITEMS[side], i0, i1), [side, i0, i1]);

  const ranked = React.useMemo(() => {
    if (rankBy === 'abs') {
      const byAbs = [...computed].sort((a, b) => b.abs - a.abs);
      return { gainers: byAbs.slice(0, topN), decliners: byAbs.slice(-topN).reverse() };
    }
    const byPct = computed
      .filter((item) => item.base >= PCT_FLOOR_USD_MN)
      .sort((a, b) => b.pct - a.pct);
    return { gainers: byPct.slice(0, topN), decliners: byPct.slice(-topN).reverse() };
  }, [computed, rankBy, topN]);

  const q = query.trim().toLowerCase();
  const matches = q
    ? computed
        .filter((item) => item.name.toLowerCase().includes(q) || item.code.startsWith(q))
        .sort((a, b) => b.last - a.last)
        .slice(0, topN)
    : null;

  const windowLabel = `FY${fyTick(HS4_YEARS[i0])} → FY${fyTick(HS4_YEARS[i1])}`;

  return (
    <Paper sx={{ ...cardSx, borderColor: alpha(accent, 0.2) }}>
      <Stack spacing={1.5}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="h6">Explore export &amp; import product lines</Typography>
          <Chip
            size="small"
            label={windowLabel}
            sx={{ bgcolor: alpha(accent, 0.1), color: accent, fontWeight: 800 }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, rowGap: 1 }}>
          <ToggleChips
            options={[
              ['Exports', 'Exports'],
              ['Imports', 'Imports'],
            ]}
            value={side}
            onChange={setSide}
            colorFor={(k) => (k === 'Exports' ? C.blue : C.orange)}
          />
          <Box sx={{ flex: 1, minWidth: 230, maxWidth: 400, px: 2 }}>
            <Slider
              size="small"
              value={range}
              onChange={handleRange}
              min={0}
              max={HS4_YEARS.length - 1}
              step={1}
              marks={HS4_YEARS.map((y, i) => ({ value: i, label: fyTick(y) }))}
              disableSwap
              getAriaLabel={(idx) =>
                idx === 0 ? 'Window start fiscal year' : 'Window end fiscal year'
              }
              sx={{
                color: accent,
                '& .MuiSlider-markLabel': {
                  fontFamily: mono.fontFamily,
                  fontSize: 10,
                  color: 'text.secondary',
                },
              }}
            />
          </Box>
          <ToggleChips
            options={[
              ['abs', 'US$ change'],
              ['pct', '% change'],
            ]}
            value={rankBy}
            onChange={setRankBy}
            colorFor={() => accent}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 170 }}>
            <Typography
              sx={{
                ...mono,
                fontSize: 11,
                fontWeight: 700,
                color: 'text.secondary',
                whiteSpace: 'nowrap',
              }}
            >
              {`Top ${topN}`}
            </Typography>
            <Slider
              size="small"
              value={topN}
              onChange={(_, value) => setTopN(value)}
              min={3}
              max={50}
              step={1}
              valueLabelDisplay="auto"
              aria-label="Lines to show per list"
              sx={{ color: accent, width: 150 }}
            />
          </Box>
          <TextField
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a product or HS code"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded sx={{ fontSize: 17, color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              minWidth: 210,
              flexGrow: { xs: 1, sm: 0 },
              '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'background.paper' },
              '& input': { fontSize: 13 },
            }}
          />
        </Box>

        {matches ? (
          <Box>
            <Typography variant="overline" sx={{ color: accent, letterSpacing: '0.08em' }}>
              {matches.length ? `Matches · largest ${side.toLowerCase()} first` : 'No matches'}
            </Typography>
            {matches.map((item) => (
              <MoverRow
                key={item.code}
                item={item}
                color={item.abs < 0 ? C.red : C.teal}
                years={windowYears}
                rankFy={rankFy}
              />
            ))}
            {!matches.length ? (
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'block', pt: 1 }}
              >
                {`Nothing matches “${query.trim()}” — try a shorter word or a 4-digit HS code.`}
              </Typography>
            ) : null}
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <MoversGroup
              title="Fastest growing"
              items={ranked.gainers}
              positive
              years={windowYears}
              rankFy={rankFy}
            />
            <MoversGroup
              title="Biggest decline"
              items={ranked.decliners}
              positive={false}
              years={windowYears}
              rankFy={rankFy}
            />
          </Box>
        )}

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {`Pick exports or imports, drag the fiscal-year window, and rank HS-4 product lines by US$ or percent change across it — or search any line to see its own path. The Top-N slider sets how many lines each list shows. The % ranking skips lines under ${moneyB(PCT_FLOOR_USD_MN)} at the window start so tiny bases don't dominate. Hover or tap a sparkline for year-by-year values.`}
        </Typography>
      </Stack>
    </Paper>
  );
}

/* ------------------------------------------------------------------ */
/* Import → export value chains                                       */
/* ------------------------------------------------------------------ */
// Curated pairings of imported inputs and the exported outputs they feed. Matched by product
// family — NOT an official input–output table — so they are directional illustrations: imported
// inputs also serve domestic demand, and exports also draw on domestic inputs.
const VALUE_CHAINS = [
  {
    key: 'petroleum',
    name: 'Petroleum refining',
    inputs: ['2709'],
    outputs: ['2710'],
    story:
      'Imported crude is refined into diesel, petrol and jet fuel; part of the output is shipped back out, the rest fuels the domestic economy.',
    players: ['Reliance Industries', 'Indian Oil', 'BPCL', 'HPCL', 'Nayara Energy'],
  },
  {
    key: 'gems',
    name: 'Gems & jewellery',
    inputs: ['7108', '7102', '7106', '7103'],
    outputs: ['7113', '7102', '7103'],
    story:
      'Gold, silver, rough diamonds and stones come in; cut diamonds and finished jewellery go out. Diamonds appear on both sides — rough in, polished out — while most gold stays as domestic jewellery demand.',
    players: ['Kiran Gems', 'Shree Ramkrishna Exports', 'Rajesh Exports', 'Titan', 'Malabar Gold'],
  },
  {
    key: 'electronics',
    name: 'Phones & electronics',
    inputs: ['8542', '8541', '8524', '8507', '8534', '8525', '8504', '8529'],
    outputs: ['8517'],
    story:
      'Chips, display modules, batteries, circuit boards, camera modules and chargers come in; assembled phones and telecom gear go out — the clearest picture of assembly-led export growth.',
    players: [
      'Foxconn India',
      'Tata Electronics',
      'Samsung India',
      'Dixon Technologies',
      'Pegatron India',
    ],
  },
  {
    key: 'pharma',
    name: 'Pharmaceuticals',
    inputs: ['2933', '2934', '2941'],
    outputs: ['3004'],
    story:
      'Bulk drug intermediates and antibiotics come in; finished medicines go out at several times the input value — the deepest value-addition of any chain here.',
    players: ['Sun Pharma', "Dr. Reddy's", 'Cipla', 'Aurobindo Pharma', 'Lupin'],
  },
  {
    key: 'textiles',
    name: 'Cotton & textiles',
    inputs: ['5201'],
    outputs: ['5205', '6109'],
    story:
      'Raw cotton comes in (a recent reversal — India long exported it); spun yarn and knitwear go out.',
    players: ['Vardhman Textiles', 'Welspun', 'Trident', 'Arvind', 'Shahi Exports'],
  },
  {
    key: 'steel',
    name: 'Coal & steel',
    inputs: ['2701', '7204'],
    outputs: ['7208', '7210'],
    story:
      'Coking coal and scrap feed the mills, but most of the steel stays home — exports cover only a sliver of the input bill.',
    players: ['JSW Steel', 'Tata Steel', 'SAIL', 'ArcelorMittal Nippon', 'Jindal Steel'],
  },
];

const ratioLabel = (r) =>
  !Number.isFinite(r) ? '—' : r >= 1 ? `${r.toFixed(1)}×` : `${Math.round(r * 100)}%`;

// One categorical colour per chain, shared by the map ribbons, the selector chips and the
// detail header so the same chain reads as the same thing everywhere.
const CHAIN_COLOR = {
  petroleum: '#475569',
  gems: '#8b5cf6',
  electronics: '#2563eb',
  pharma: '#0d9488',
  textiles: '#db2777',
  steel: '#b45309',
};

// Latest-year totals per chain for the overview map, ordered by input size so both stacks share
// one order and the ribbons never cross.
const CHAIN_FLOWS = (() => {
  const last = HS4_YEARS.length - 1;
  return VALUE_CHAINS.map((chain) => ({
    key: chain.key,
    name: chain.name,
    inVal: chain.inputs.reduce(
      (sum, code) => sum + (IMPORT_BY_CODE.get(code)?.series[last] ?? 0),
      0,
    ),
    outVal: chain.outputs.reduce(
      (sum, code) => sum + (EXPORT_BY_CODE.get(code)?.series[last] ?? 0),
      0,
    ),
  })).sort((a, b) => b.inVal - a.inVal);
})();

// All six chains in one picture: imported inputs stacked on the left, exported outputs on the
// right, one ribbon per chain with end-widths proportional to value. A ribbon that narrows means
// most of the input value stays in the domestic economy; one that widens means value is added at
// home before export. Clicking a ribbon drives the detail view below.
function ValueChainMap({ value, onChange }) {
  const wrapRef = React.useRef(null);
  const width = useMeasuredWidth(wrapRef, 1080);
  const compact = width < COMPACT_BELOW;
  const [hoverKey, setHoverKey] = React.useState(null);

  const gutterL = compact ? 122 : 190;
  const gutterR = compact ? 78 : 158;
  const barW = 10;
  const headerH = 30;
  const gap = 14;
  const minH = 13;
  const totalIn = CHAIN_FLOWS.reduce((sum, c) => sum + c.inVal, 0) || 1;
  const k = (compact ? 250 : 300) / totalIn;

  let yL = headerH;
  let yR = headerH;
  const flowRows = CHAIN_FLOWS.map((c) => {
    const hIn = Math.max(c.inVal * k, minH);
    const hOut = Math.max(c.outVal * k, minH);
    const row = { ...c, hIn, hOut, yIn: yL, yOut: yR };
    yL += hIn + gap;
    yR += hOut + gap;
    return row;
  });
  const height = Math.max(yL, yR) - gap + 8;
  const xL = gutterL + barW;
  const xR = width - gutterR - barW;
  const mx = (xL + xR) / 2;
  const money = compact ? moneyShortB : moneyB;
  const lastFy = fyTick(HS4_YEARS[HS4_YEARS.length - 1]);

  return (
    <Box ref={wrapRef} sx={{ width: '100%' }}>
      <Box
        component="svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Map of import-to-export value chains"
        sx={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <text
          x={compact ? 0 : gutterL}
          y={13}
          textAnchor="start"
          fill={C.orange}
          fontSize="11"
          fontWeight="800"
        >
          {compact ? `Inputs · FY${lastFy}` : `Imported inputs · FY${lastFy}`}
        </text>
        <text
          x={compact ? width : width - gutterR}
          y={13}
          textAnchor="end"
          fill={C.blue}
          fontSize="11"
          fontWeight="800"
        >
          {compact ? 'Outputs' : 'Exported outputs'}
        </text>
        {flowRows.map((c) => {
          const color = CHAIN_COLOR[c.key] ?? C.slate;
          const selected = value === c.key;
          const active = selected || hoverKey === c.key;
          const dimmed = hoverKey != null && hoverKey !== c.key;
          const cyIn = c.yIn + c.hIn / 2;
          const cyOut = c.yOut + c.hOut / 2;
          const ribbon = [
            `M ${xL} ${c.yIn}`,
            `C ${mx} ${c.yIn}, ${mx} ${c.yOut}, ${xR} ${c.yOut}`,
            `L ${xR} ${c.yOut + c.hOut}`,
            `C ${mx} ${c.yOut + c.hOut}, ${mx} ${c.yIn + c.hIn}, ${xL} ${c.yIn + c.hIn}`,
            'Z',
          ].join(' ');
          const coverage = c.inVal > 0 ? c.outVal / c.inVal : null;
          return (
            <g
              key={c.key}
              onClick={() => onChange(c.key)}
              onMouseEnter={() => setHoverKey(c.key)}
              onMouseLeave={() => setHoverKey(null)}
              style={{ cursor: 'pointer' }}
              opacity={dimmed ? 0.38 : 1}
            >
              <title>{`${c.name}: ${moneyB(c.inVal)} imported inputs → ${moneyB(c.outVal)} exported outputs. Click to inspect.`}</title>
              <path
                d={ribbon}
                fill={color}
                fillOpacity={active ? 0.4 : 0.22}
                stroke={selected ? color : 'none'}
                strokeWidth="1.5"
              />
              <rect x={gutterL} y={c.yIn} width={barW} height={c.hIn} rx="2" fill={color} />
              <rect x={xR} y={c.yOut} width={barW} height={c.hOut} rx="2" fill={color} />
              <text
                x={gutterL - 8}
                y={cyIn - 1}
                textAnchor="end"
                fill={color}
                fontSize={compact ? 10.5 : 11.5}
                fontWeight="700"
              >
                {c.name}
              </text>
              <text
                x={gutterL - 8}
                y={cyIn + 11}
                textAnchor="end"
                fill="#64748b"
                fontSize="10"
                fontFamily="IBM Plex Mono, monospace"
              >
                {`${money(c.inVal)} in`}
              </text>
              <text
                x={width - gutterR + 8}
                y={compact ? cyOut + 3 : cyOut - 1}
                textAnchor="start"
                fill={color}
                fontSize="10.5"
                fontWeight="700"
                fontFamily="IBM Plex Mono, monospace"
              >
                {`${money(c.outVal)} out`}
              </text>
              {!compact ? (
                <text
                  x={width - gutterR + 8}
                  y={cyOut + 11}
                  textAnchor="start"
                  fill="#64748b"
                  fontSize="10"
                >
                  {`coverage ${ratioLabel(coverage)}`}
                </text>
              ) : null}
            </g>
          );
        })}
      </Box>
    </Box>
  );
}

function ChainFlowChart({ inSeries, outSeries }) {
  const wrapRef = React.useRef(null);
  const width = useMeasuredWidth(wrapRef, 1080);
  const compact = width < COMPACT_BELOW;
  const height = Math.round(width * (compact ? 0.62 : 0.32));
  const pad = compact
    ? { top: 28, right: 14, bottom: 40, left: 44 }
    : { top: 30, right: 24, bottom: 46, left: 52 };
  const n = HS4_YEARS.length;
  const cw = width - pad.left - pad.right;
  const ch = height - pad.top - pad.bottom;
  const maxVal = (Math.max(...inSeries, ...outSeries) || 1) * 1.12;
  const x = (i) => pad.left + (i / (n - 1)) * cw;
  const y = (v) => pad.top + ch - (v / maxVal) * ch;
  const linePath = (s) =>
    s.map((v, i) => `${i ? 'L' : 'M'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');

  const [hover, setHover] = React.useState(null);
  const onMove = (e) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const vbX = ((e.clientX - rect.left) / rect.width) * width;
    setHover(clamp(Math.round((vbX - pad.left) / (cw / (n - 1))), 0, n - 1));
  };
  const tipLeft = hover != null ? (x(hover) / width) * 100 : 0;
  const flip = tipLeft > 60;
  const coverage = hover != null && inSeries[hover] > 0 ? outSeries[hover] / inSeries[hover] : null;

  return (
    <Box
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={() => setHover(null)}
      onTouchStart={(e) => onMove(e.touches[0])}
      onTouchMove={(e) => onMove(e.touches[0])}
      sx={{ position: 'relative', width: '100%', cursor: 'crosshair', touchAction: 'pan-y' }}
    >
      <Box
        component="svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Imported inputs versus exported outputs"
        sx={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <text
          x={4}
          y={20}
          textAnchor="start"
          fill="#64748b"
          fontSize="11"
          fontWeight="700"
          fontFamily="IBM Plex Mono, monospace"
        >
          US$ bn
        </text>
        {[0, 1, 2, 3, 4].map((i) => {
          const v = maxVal * (1 - i / 4);
          return (
            <g key={i}>
              <line
                x1={pad.left}
                x2={width - pad.right}
                y1={y(v)}
                y2={y(v)}
                stroke={C.grid}
                strokeWidth="1"
              />
              <text
                x={pad.left - 10}
                y={y(v) + 4}
                textAnchor="end"
                fill="#94a3b8"
                fontSize="11"
                fontFamily="IBM Plex Mono, monospace"
              >
                {Math.round(v / 1000)}
              </text>
            </g>
          );
        })}
        <path
          d={linePath(inSeries)}
          fill="none"
          stroke={C.orange}
          strokeWidth="3.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={linePath(outSeries)}
          fill="none"
          stroke={C.blue}
          strokeWidth="3.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {hover != null ? (
          <line
            x1={x(hover)}
            x2={x(hover)}
            y1={pad.top}
            y2={height - pad.bottom}
            stroke="#0c1730"
            strokeOpacity="0.18"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        ) : null}
        {HS4_YEARS.map((yr, i) => (
          <React.Fragment key={yr}>
            <circle
              cx={x(i)}
              cy={y(inSeries[i])}
              r={hover === i ? 5.5 : 3.5}
              fill={C.orange}
              stroke="#fff"
              strokeWidth="2"
            />
            <circle
              cx={x(i)}
              cy={y(outSeries[i])}
              r={hover === i ? 5.5 : 3.5}
              fill={C.blue}
              stroke="#fff"
              strokeWidth="2"
            />
            <text
              x={x(i)}
              y={height - 16}
              textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}
              fill={i === n - 1 ? C.purple : '#64748b'}
              fontSize="11"
              fontWeight={i === n - 1 ? 800 : 500}
              fontFamily="IBM Plex Mono, monospace"
            >
              {fyTick(yr)}
            </text>
          </React.Fragment>
        ))}
      </Box>

      {hover != null ? (
        <Box
          sx={{
            position: 'absolute',
            left: compact ? 'auto' : `${tipLeft}%`,
            right: compact ? 4 : 'auto',
            top: 8,
            transform: compact
              ? 'none'
              : flip
                ? 'translateX(calc(-100% - 14px))'
                : 'translateX(14px)',
            pointerEvents: 'none',
            bgcolor: C.ink,
            color: '#e7ecf5',
            borderRadius: 2,
            p: 1.25,
            minWidth: 196,
            boxShadow: '0 10px 30px -8px rgba(8,15,30,0.55)',
            zIndex: 3,
          }}
        >
          <Typography sx={{ ...mono, fontWeight: 700, fontSize: 12, color: '#fff', mb: 0.75 }}>
            {`FY${HS4_YEARS[hover]}`}
          </Typography>
          <TipRow color={C.orange} label="Imported inputs" value={moneyB(inSeries[hover])} sub="" />
          <TipRow color={C.blue} label="Exported outputs" value={moneyB(outSeries[hover])} sub="" />
          <Box sx={{ height: '1px', bgcolor: 'rgba(255,255,255,0.12)', my: 0.75 }} />
          <TipRow
            color={outSeries[hover] - inSeries[hover] >= 0 ? C.teal : C.red}
            label="Gap (out − in)"
            value={moneySignB(outSeries[hover] - inSeries[hover])}
            sub=""
          />
          <TipRow
            color={C.teal}
            label="Coverage"
            value={coverage == null ? '—' : ratioLabel(coverage)}
            sub=""
          />
        </Box>
      ) : null}
    </Box>
  );
}

function ChainStat({ label, value, sub, color = C.ink }) {
  return (
    <Box sx={{ flex: '1 1 140px', minWidth: 130 }}>
      <Typography
        variant="overline"
        sx={{ color: 'text.secondary', letterSpacing: '0.08em', display: 'block', lineHeight: 1.9 }}
      >
        {label}
      </Typography>
      <Typography sx={{ ...mono, fontSize: 19, fontWeight: 800, color, lineHeight: 1.15 }}>
        {value}
      </Typography>
      <Typography sx={{ ...mono, fontSize: 10.5, color: 'text.secondary' }}>{sub}</Typography>
    </Box>
  );
}

function ValueChainSection() {
  const [chainKey, setChainKey] = React.useState('petroleum');
  const chain = VALUE_CHAINS.find((c) => c.key === chainKey);
  const inputItems = chain.inputs.map((code) => IMPORT_BY_CODE.get(code)).filter(Boolean);
  const outputItems = chain.outputs.map((code) => EXPORT_BY_CODE.get(code)).filter(Boolean);
  const inSeries = HS4_YEARS.map((_, i) => inputItems.reduce((sum, it) => sum + it.series[i], 0));
  const outSeries = HS4_YEARS.map((_, i) => outputItems.reduce((sum, it) => sum + it.series[i], 0));
  const last = HS4_YEARS.length - 1;
  const covLast = inSeries[last] > 0 ? outSeries[last] / inSeries[last] : null;
  const covFirst = inSeries[0] > 0 ? outSeries[0] / inSeries[0] : null;

  // The same products often move the other way too (refined fuel and phones are also imported;
  // APIs are also exported). Surfacing those keeps the picture honest. Codes listed on both
  // sides of the chain (e.g. diamonds) are already two-way by construction and are skipped.
  const counterFlows = [
    ...chain.inputs
      .filter((code) => !chain.outputs.includes(code))
      .map((code) => EXPORT_BY_CODE.get(code))
      .filter((it) => it && it.last >= 500)
      .map((it) => ({ it, dir: 'export' })),
    ...chain.outputs
      .filter((code) => !chain.inputs.includes(code))
      .map((code) => IMPORT_BY_CODE.get(code))
      .filter((it) => it && it.last >= 500)
      .map((it) => ({ it, dir: 'import' })),
  ].sort((a, b) => b.it.last - a.it.last);

  // Trade balance of the chain's full product set — every listed code, both directions,
  // counter-flows included. This is the chain's net contribution to India's trade balance.
  const chainCodes = [...new Set([...chain.inputs, ...chain.outputs])];
  const chainNet = HS4_YEARS.map((_, i) =>
    chainCodes.reduce(
      (sum, code) =>
        sum +
        (EXPORT_BY_CODE.get(code)?.series[i] ?? 0) -
        (IMPORT_BY_CODE.get(code)?.series[i] ?? 0),
      0,
    ),
  );

  return (
    <Paper sx={{ ...cardSx, borderColor: alpha(C.teal, 0.2) }}>
      <Stack spacing={1.5}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="h6">How imports feed exports</Typography>
          <Chip
            size="small"
            label={`FY${fyTick(HS4_YEARS[0])} → FY${fyTick(HS4_YEARS[last])}`}
            sx={{ bgcolor: alpha(C.teal, 0.1), color: C.teal, fontWeight: 800 }}
          />
        </Box>

        <ValueChainMap value={chainKey} onChange={setChainKey} />

        <ToggleChips
          options={VALUE_CHAINS.map((c) => [c.key, c.name])}
          value={chainKey}
          onChange={setChainKey}
          colorFor={(key) => CHAIN_COLOR[key] ?? C.teal}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 1.5,
            flexWrap: 'wrap',
          }}
        >
          <Typography
            sx={{ fontSize: 12.5, color: 'text.secondary', flex: '1 1 320px', minWidth: 0 }}
          >
            {chain.story}
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
            {[
              [C.orange, 'Imported inputs'],
              [C.blue, 'Exported outputs'],
            ].map(([color, label]) => (
              <Box key={label} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 9, height: 9, borderRadius: 999, bgcolor: color }} />
                <Typography sx={{ fontSize: 11, fontWeight: 700, color }}>{label}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        {chain.players?.length ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
            <Typography
              variant="overline"
              sx={{ color: 'text.secondary', letterSpacing: '0.08em', lineHeight: 1.6 }}
            >
              Key players
            </Typography>
            {chain.players.map((name) => (
              <Chip
                key={name}
                size="small"
                label={name}
                sx={{
                  fontWeight: 600,
                  fontSize: 11,
                  bgcolor: 'transparent',
                  color: CHAIN_COLOR[chain.key] ?? C.slate,
                  border: '1px solid',
                  borderColor: alpha(CHAIN_COLOR[chain.key] ?? C.slate, 0.3),
                }}
              />
            ))}
          </Box>
        ) : null}

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start', py: 0.25 }}>
          <ChainStat
            label="Imported inputs"
            value={moneyB(inSeries[last])}
            sub={`FY${fyTick(HS4_YEARS[0])}: ${moneyB(inSeries[0])}`}
            color={C.orange}
          />
          <ChainStat
            label="Exported outputs"
            value={moneyB(outSeries[last])}
            sub={`FY${fyTick(HS4_YEARS[0])}: ${moneyB(outSeries[0])}`}
            color={C.blue}
          />
          <ChainStat
            label="Coverage out÷in"
            value={ratioLabel(covLast)}
            sub={`FY${fyTick(HS4_YEARS[0])}: ${ratioLabel(covFirst)}`}
          />
          <ChainStat
            label="Chain trade balance"
            value={moneySignB(chainNet[last])}
            sub={`FY${fyTick(HS4_YEARS[0])}: ${moneySignB(chainNet[0])}`}
            color={chainNet[last] >= 0 ? C.teal : C.red}
          />
        </Box>

        <ChainFlowChart inSeries={inSeries} outSeries={outSeries} />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: counterFlows.length ? '1fr 1fr 1fr' : '1fr 1fr' },
            gap: 2,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="overline" sx={{ color: C.orange, letterSpacing: '0.08em' }}>
              Imported inputs
            </Typography>
            {inputItems.map((it) => (
              <MoverRow key={`in-${it.code}`} item={it} color={C.orange} />
            ))}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="overline" sx={{ color: C.blue, letterSpacing: '0.08em' }}>
              Exported outputs
            </Typography>
            {outputItems.map((it) => (
              <MoverRow key={`out-${it.code}`} item={it} color={C.blue} />
            ))}
          </Box>
          {counterFlows.length ? (
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="overline" sx={{ color: C.slate, letterSpacing: '0.08em' }}>
                Counter-flows
              </Typography>
              {counterFlows.map(({ it, dir }) => (
                <MoverRow
                  key={`cf-${dir}-${it.code}`}
                  item={it}
                  color={dir === 'import' ? C.orange : C.blue}
                />
              ))}
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'block', pt: 0.5 }}
              >
                The same products moving the other way — orange rows are imports of this
                chain&apos;s outputs, blue rows are exports of its inputs. Both count in the chain
                trade balance.
              </Typography>
            </Box>
          ) : null}
        </Box>

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          The map shows all six chains at once — ribbon widths are proportional to value, so a
          ribbon that narrows left-to-right means most of the input value stays in the domestic
          economy, and one that widens means value is added at home before export. Coverage compares
          exported outputs with imported inputs; the chain trade balance counts every flow of these
          product lines in both directions, counter-flows included. Pairings are matched by product
          family — not an official input–output table — so treat both as directional signals rather
          than measured value-added: imported inputs also serve domestic demand (most gold and coal
          never leave), and exports also draw on domestic inputs. Key players are well-known firms
          in each chain from public reporting — company-level detail is not part of the official
          trade data. Gross trade values from FY2021-22 to FY2025-26. Hover or tap the chart for
          year-by-year figures.
        </Typography>
      </Stack>
    </Paper>
  );
}

/* ------------------------------------------------------------------ */
/* Trading partners (country-wise distribution)                       */
/* ------------------------------------------------------------------ */
// Clean display names for the official ALL-CAPS country strings; anything unmapped is title-cased.
const COUNTRY_LABEL = {
  'CHINA P RP': 'China',
  'U S A': 'United States',
  'U ARAB EMTS': 'UAE',
  RUSSIA: 'Russia',
  'SAUDI ARAB': 'Saudi Arabia',
  SINGAPORE: 'Singapore',
  'HONG KONG': 'Hong Kong',
  GERMANY: 'Germany',
  IRAQ: 'Iraq',
  JAPAN: 'Japan',
  'KOREA RP': 'South Korea',
  SWITZERLAND: 'Switzerland',
  'U K': 'United Kingdom',
  INDONESIA: 'Indonesia',
  NETHERLAND: 'Netherlands',
  THAILAND: 'Thailand',
  AUSTRALIA: 'Australia',
  MALAYSIA: 'Malaysia',
  'VIETNAM SOC REP': 'Vietnam',
  'SOUTH AFRICA': 'South Africa',
  FRANCE: 'France',
  BRAZIL: 'Brazil',
  ITALY: 'Italy',
  QATAR: 'Qatar',
  BELGIUM: 'Belgium',
  'BANGLADESH PR': 'Bangladesh',
  OMAN: 'Oman',
  TAIWAN: 'Taiwan',
  PERU: 'Peru',
  KUWAIT: 'Kuwait',
  NEPAL: 'Nepal',
  SPAIN: 'Spain',
  NIGERIA: 'Nigeria',
  'TANZANIA REP': 'Tanzania',
  GHANA: 'Ghana',
  CANADA: 'Canada',
  MEXICO: 'Mexico',
  'SRI LANKA DSR': 'Sri Lanka',
  IRELAND: 'Ireland',
  TURKEY: 'Turkey',
  'EGYPT A RP': 'Egypt',
};
function cleanCountryName(raw) {
  if (COUNTRY_LABEL[raw]) return COUNTRY_LABEL[raw];
  const s = String(raw).toLowerCase().replace(/\s+/g, ' ').trim();
  return s ? s.replace(/\b\w/g, (ch) => ch.toUpperCase()) : String(raw);
}

const COUNTRY_YEARS = countrySlimData.years; // '2010-2011' … '2025-2026'
const COUNTRY_LAST = COUNTRY_YEARS.length - 1;
const COUNTRY_TOTALS = countrySlimData.totals; // { exp: [...], imp: [...] } aligned to COUNTRY_YEARS
// Already sorted by latest total trade (descending) by scripts/build_country_slim.js.
const PARTNERS = countrySlimData.countries.map((c) => ({
  key: c.name,
  name: cleanCountryName(c.name),
  exp: c.exp,
  imp: c.imp,
  total: c.exp.map((v, i) => v + c.imp[i]),
}));
const PARTNER_BY_KEY = new Map(PARTNERS.map((p) => [p.key, p]));

// One color per partner, shared across the share chart's three metrics so a country keeps its
// color when toggling exports/imports/total. Assigned by total-trade rank.
const partnerMetricSeries = (p, metric) => (metric === 'total' ? p.total : p[metric]);
// 15 keeps the "Rest" band from dominating while the color union across the three metric
// views (total/exports/imports) still fits the 22-color palette without repeats.
const PARTNER_TOP_N = 15;
const PARTNER_COLOR = {};
{
  let slot = 0;
  ['total', 'exp', 'imp'].forEach((metric) => {
    [...PARTNERS]
      .sort(
        (a, b) =>
          partnerMetricSeries(b, metric)[COUNTRY_LAST] -
          partnerMetricSeries(a, metric)[COUNTRY_LAST],
      )
      .slice(0, PARTNER_TOP_N)
      .forEach((p) => {
        if (!(p.key in PARTNER_COLOR)) {
          PARTNER_COLOR[p.key] = COMMODITY_PALETTE[slot % COMMODITY_PALETTE.length];
          slot += 1;
        }
      });
  });
}

function buildPartnerComposition(metric) {
  const totalAt = (i) =>
    metric === 'exp'
      ? COUNTRY_TOTALS.exp[i]
      : metric === 'imp'
        ? COUNTRY_TOTALS.imp[i]
        : COUNTRY_TOTALS.exp[i] + COUNTRY_TOTALS.imp[i];
  const ranked = [...PARTNERS]
    .sort(
      (a, b) =>
        partnerMetricSeries(b, metric)[COUNTRY_LAST] - partnerMetricSeries(a, metric)[COUNTRY_LAST],
    )
    .slice(0, PARTNER_TOP_N);
  const years = COUNTRY_YEARS.map((year, i) => {
    const total = totalAt(i);
    let used = 0;
    const segs = ranked.map((p) => {
      const value = partnerMetricSeries(p, metric)[i];
      const share = total > 0 ? (value / total) * 100 : 0;
      used += share;
      return { key: p.key, name: p.name, value, share, color: PARTNER_COLOR[p.key] || REST_COLOR };
    });
    const restShare = Math.max(0, 100 - used);
    return {
      year,
      total,
      segs,
      rest: { name: 'Other partners', share: restShare, value: (total * restShare) / 100 },
    };
  });
  const latestYear = years[years.length - 1];
  return {
    items: ranked.map((p, j) => ({ key: p.key, name: p.name, color: latestYear.segs[j].color })),
    years,
    latestYear,
    topShare: latestYear.segs.reduce((sum, seg) => sum + seg.share, 0),
    groupCount: PARTNERS.filter((p) => partnerMetricSeries(p, metric)[COUNTRY_LAST] > 0).length,
    colorMap: PARTNER_COLOR,
  };
}
const PARTNER_COMPS = {
  total: buildPartnerComposition('total'),
  exp: buildPartnerComposition('exp'),
  imp: buildPartnerComposition('imp'),
};

// Short labels for HS-2 chapters surfacing in partners' top-product lists; unmapped chapters
// fall back to a sentence-cased official description.
const HS2_LABEL = {
  '02': 'Meat',
  '03': 'Seafood',
  '04': 'Dairy & honey',
  '07': 'Vegetables',
  '08': 'Fruits & nuts',
  '09': 'Coffee, tea & spices',
  10: 'Cereals',
  12: 'Oil seeds',
  15: 'Vegetable oils & fats',
  17: 'Sugar',
  19: 'Cereal preparations',
  21: 'Misc food',
  23: 'Animal feed',
  24: 'Tobacco',
  25: 'Stone & cement',
  26: 'Ores',
  27: 'Mineral fuels',
  28: 'Inorganic chemicals',
  29: 'Organic chemicals',
  30: 'Pharmaceuticals',
  31: 'Fertilisers',
  32: 'Dyes & pigments',
  33: 'Cosmetics & essential oils',
  38: 'Misc chemicals',
  39: 'Plastics',
  40: 'Rubber',
  41: 'Hides & leather',
  44: 'Wood',
  48: 'Paper',
  52: 'Cotton',
  54: 'Synthetic filaments',
  55: 'Synthetic fibres',
  61: 'Knit apparel',
  62: 'Woven apparel',
  63: 'Textile articles',
  64: 'Footwear',
  68: 'Stone articles',
  69: 'Ceramics',
  70: 'Glass',
  71: 'Gems & precious metals',
  72: 'Iron & steel',
  73: 'Steel articles',
  74: 'Copper',
  75: 'Nickel',
  76: 'Aluminium',
  79: 'Zinc',
  82: 'Tools & cutlery',
  84: 'Machinery',
  85: 'Electronics',
  86: 'Railway',
  87: 'Vehicles',
  88: 'Aircraft',
  89: 'Ships & boats',
  90: 'Instruments',
  94: 'Furniture',
  95: 'Toys & sports',
  98: 'Project goods',
  99: 'Unclassified',
};
const HS2_ICON = {
  27: OilBarrelRounded,
  71: DiamondRounded,
  84: PrecisionManufacturingRounded,
  85: MemoryRounded,
  30: MedicationRounded,
  87: DirectionsCarRounded,
  88: FlightRounded,
  89: DirectionsBoatRounded,
  25: TerrainRounded,
  26: TerrainRounded,
};
[28, 29, 31, 32, 33, 38, 90].forEach((ch) => {
  HS2_ICON[ch] = ScienceRounded;
});
[39, 40].forEach((ch) => {
  HS2_ICON[ch] = OpacityRounded;
});
[72, 73, 74, 75, 76, 78, 79, 80, 81, 82, 83].forEach((ch) => {
  HS2_ICON[ch] = ViewInArRounded;
});
[2, 3, 4, 7, 8, 9, 10, 11, 12, 15, 16, 17, 19, 20, 21, 23, 24].forEach((ch) => {
  HS2_ICON[ch] = AgricultureRounded;
});
[41, 42, 43].forEach((ch) => {
  HS2_ICON[ch] = CheckroomRounded;
}); // leather & travel goods
for (let ch = 50; ch <= 67; ch += 1) HS2_ICON[ch] = CheckroomRounded; // textiles, apparel, footwear
const hs2Icon = (hs2) => HS2_ICON[Number(hs2)] || CategoryRounded;
const hs2Label = (chapter) => {
  if (HS2_LABEL[chapter.hs2]) return HS2_LABEL[chapter.hs2];
  const s = String(chapter.desc || '')
    .toLowerCase()
    .split(/[;,.]/)[0]
    .trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : `HS ${chapter.hs2}`;
};

const PARTNER_PRODUCTS = new Map((partnerProductsData.partners ?? []).map((p) => [p.country, p]));
const PARTNER_PRODUCTS_FY = partnerProductsData.fiscal_year;

function PartnerProductIcons({ chapters, color, align }) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 0.5,
        justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
        minHeight: 14,
      }}
    >
      {chapters.map((ch) => {
        const Icon = hs2Icon(ch.hs2);
        return (
          <Icon
            key={ch.hs2}
            sx={{ fontSize: 13, color: alpha(color, 0.9) }}
            titleAccess={hs2Label(ch)}
          />
        );
      })}
    </Box>
  );
}

function PartnerButterfly() {
  const top = PARTNERS.slice(0, 12);
  const maxVal = Math.max(...top.map((p) => Math.max(p.exp[COUNTRY_LAST], p.imp[COUNTRY_LAST])));
  const grandTotal = COUNTRY_TOTALS.exp[COUNTRY_LAST] + COUNTRY_TOTALS.imp[COUNTRY_LAST];
  const topShare = (top.reduce((sum, p) => sum + p.total[COUNTRY_LAST], 0) / grandTotal) * 100;

  return (
    <Paper sx={{ ...cardSx }}>
      <Stack spacing={1.25}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="h6">Top trading partners</Typography>
          <Chip
            size="small"
            label={`Top 12 = ${topShare.toFixed(1)}% of FY${fyTick(COUNTRY_YEARS[COUNTRY_LAST])} trade`}
            sx={{ bgcolor: alpha(C.teal, 0.1), color: C.teal, fontWeight: 800 }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: { xs: 78, sm: 104 }, flexShrink: 0 }} />
          <Box sx={{ flex: 1, display: 'flex', minWidth: 0 }}>
            <Typography
              sx={{
                flex: 1,
                textAlign: 'right',
                pr: 1,
                fontSize: 11,
                fontWeight: 800,
                color: C.orange,
              }}
            >
              Imports
            </Typography>
            <Typography sx={{ flex: 1, pl: 1, fontSize: 11, fontWeight: 800, color: C.blue }}>
              Exports
            </Typography>
          </Box>
          <Typography
            sx={{
              width: { xs: 70, sm: 84 },
              flexShrink: 0,
              textAlign: 'right',
              fontSize: 11,
              fontWeight: 800,
              color: 'text.secondary',
            }}
          >
            Balance
          </Typography>
        </Box>

        {top.map((p) => {
          const exp = p.exp[COUNTRY_LAST];
          const imp = p.imp[COUNTRY_LAST];
          const bal = exp - imp;
          const products = PARTNER_PRODUCTS.get(p.key);
          const topExp = products?.exports?.top_chapters?.slice(0, 3) ?? [];
          const topImp = products?.imports?.top_chapters?.slice(0, 3) ?? [];
          const tip = (
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.25 }}>{p.name}</Typography>
              <Typography sx={{ fontSize: 11.5 }}>
                {`Exports ${moneyB(exp)}`}
                {topExp.length ? ` — ${topExp.map(hs2Label).join(' · ')}` : ''}
              </Typography>
              <Typography sx={{ fontSize: 11.5 }}>
                {`Imports ${moneyB(imp)}`}
                {topImp.length ? ` — ${topImp.map(hs2Label).join(' · ')}` : ''}
              </Typography>
            </Box>
          );
          return (
            <Tooltip
              key={p.key}
              title={tip}
              arrow
              placement="top"
              enterTouchDelay={0}
              leaveTouchDelay={2500}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  py: 0.4,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  cursor: 'default',
                }}
              >
                <Typography
                  sx={{
                    width: { xs: 78, sm: 104 },
                    flexShrink: 0,
                    fontSize: 12.5,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {p.name}
                </Typography>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                      <Box
                        sx={{
                          height: 13,
                          width: `${(imp / maxVal) * 100}%`,
                          minWidth: imp > 0 ? '2px' : 0,
                          bgcolor: alpha(C.orange, 0.85),
                          borderRadius: '4px 0 0 4px',
                        }}
                      />
                    </Box>
                    <Box sx={{ width: '1px', alignSelf: 'stretch', bgcolor: '#c4cedd' }} />
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          height: 13,
                          width: `${(exp / maxVal) * 100}%`,
                          minWidth: exp > 0 ? '2px' : 0,
                          bgcolor: alpha(C.blue, 0.85),
                          borderRadius: '0 4px 4px 0',
                        }}
                      />
                    </Box>
                  </Box>
                  {topExp.length || topImp.length ? (
                    <Box sx={{ display: 'flex', mt: 0.25 }}>
                      <Box sx={{ flex: 1, pr: 0.75 }}>
                        <PartnerProductIcons chapters={topImp} color={C.orange} align="right" />
                      </Box>
                      <Box sx={{ width: '1px' }} />
                      <Box sx={{ flex: 1, pl: 0.75 }}>
                        <PartnerProductIcons chapters={topExp} color={C.blue} align="left" />
                      </Box>
                    </Box>
                  ) : null}
                </Box>
                <Typography
                  sx={{
                    ...mono,
                    width: { xs: 70, sm: 84 },
                    flexShrink: 0,
                    textAlign: 'right',
                    fontSize: 11.5,
                    fontWeight: 800,
                    color: bal >= 0 ? C.teal : C.red,
                  }}
                >
                  {moneySignB(bal)}
                </Typography>
              </Box>
            </Tooltip>
          );
        })}

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {`Top 12 partners by total trade in FY${fyTick(COUNTRY_YEARS[COUNTRY_LAST])}. Bars share one scale; the balance column is exports minus imports. The small icons are each partner's top three traded product chapters (FY${PARTNER_PRODUCTS_FY ? fyTick(PARTNER_PRODUCTS_FY) : ''}, EIDB) — hover or tap a row to name them.`}
        </Typography>
      </Stack>
    </Paper>
  );
}

function PartnerTrendCard() {
  const [partnerKey, setPartnerKey] = React.useState('CHINA P RP');
  const [query, setQuery] = React.useState('');
  const partner = PARTNER_BY_KEY.get(partnerKey) ?? PARTNERS[0];

  const data = React.useMemo(
    () =>
      COUNTRY_YEARS.map((year, i) => ({
        financial_year: year,
        export_usd_mn: partner.exp[i],
        import_usd_mn: partner.imp[i],
      })),
    [partner],
  );
  const wrapRef = React.useRef(null);
  const measuredWidth = useMeasuredWidth(wrapRef, 1080);
  const geo = React.useMemo(() => buildTradeGeo(data, measuredWidth), [data, measuredWidth]);
  const [hover, setHover] = React.useState(null);

  const onMove = (e) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const vbX = ((e.clientX - rect.left) / rect.width) * geo.width;
    setHover(clamp(Math.round((vbX - geo.pad.left) / geo.xStep), 0, data.length - 1));
  };
  const p = hover != null ? geo.points[hover] : null;
  const tipLeft = p ? (p.x / geo.width) * 100 : 0;
  const flip = tipLeft > 60;

  const topChips = PARTNERS.slice(0, 8);
  const chips = topChips.some((t) => t.key === partnerKey) ? topChips : [...topChips, partner];
  const q = query.trim().toLowerCase();
  const matches = q ? PARTNERS.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 6) : [];
  const latestBal = partner.exp[COUNTRY_LAST] - partner.imp[COUNTRY_LAST];

  return (
    <Paper sx={{ ...cardSx }}>
      <Stack spacing={1.25}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="h6">{`Partner trend: ${partner.name}`}</Typography>
          <Chip
            size="small"
            label={`FY${fyTick(COUNTRY_YEARS[COUNTRY_LAST])} balance ${moneySignB(latestBal)}`}
            sx={{
              bgcolor: alpha(latestBal >= 0 ? C.teal : C.red, 0.1),
              color: latestBal >= 0 ? C.teal : C.red,
              fontWeight: 800,
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <ToggleChips
            options={chips.map((c) => [c.key, c.name])}
            value={partnerKey}
            onChange={(k) => {
              setPartnerKey(k);
              setQuery('');
            }}
            colorFor={() => C.blue}
          />
          <TextField
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a country"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded sx={{ fontSize: 17, color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              minWidth: 170,
              flexGrow: { xs: 1, sm: 0 },
              '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'background.paper' },
              '& input': { fontSize: 13 },
            }}
          />
        </Box>
        {matches.length ? (
          <ToggleChips
            options={matches.map((c) => [c.key, c.name])}
            value={partnerKey}
            onChange={(k) => {
              setPartnerKey(k);
              setQuery('');
            }}
            colorFor={() => C.purple}
          />
        ) : null}

        <Box
          ref={wrapRef}
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
          onTouchStart={(e) => onMove(e.touches[0])}
          onTouchMove={(e) => onMove(e.touches[0])}
          sx={{ position: 'relative', width: '100%', cursor: 'crosshair', touchAction: 'pan-y' }}
        >
          <Box
            component="svg"
            viewBox={`0 0 ${geo.width} ${geo.height}`}
            role="img"
            aria-label={`Exports and imports with ${partner.name}`}
            sx={{ width: '100%', height: 'auto', display: 'block' }}
          >
            <text
              x={4}
              y={20}
              textAnchor="start"
              fill="#64748b"
              fontSize="11"
              fontWeight="700"
              fontFamily="IBM Plex Mono, monospace"
            >
              US$ bn
            </text>
            {geo.yTicks.map((t, i) => (
              <g key={i}>
                <line
                  x1={geo.pad.left}
                  x2={geo.width - geo.pad.right}
                  y1={t.y}
                  y2={t.y}
                  stroke={C.grid}
                  strokeWidth="1"
                />
                <text
                  x={geo.pad.left - 10}
                  y={t.y + 4}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="11"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {Math.round(t.v / 1000)}
                </text>
              </g>
            ))}
            <path
              d={geo.exportPath}
              fill="none"
              stroke={C.blue}
              strokeWidth="3.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={geo.importPath}
              fill="none"
              stroke={C.orange}
              strokeWidth="3.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {hover != null ? (
              <line
                x1={p.x}
                x2={p.x}
                y1={geo.pad.top}
                y2={geo.height - geo.pad.bottom}
                stroke="#0c1730"
                strokeOpacity="0.18"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            ) : null}
            {geo.points.map((pt) => (
              <React.Fragment key={pt.d.financial_year}>
                {/* Resting dots only when points have breathing room; tight spacing reads as a
                    dotted stroke. The hovered year always gets its marker. */}
                {(geo.xStep >= 40 && !geo.compact) || hover === pt.i ? (
                  <circle
                    cx={pt.x}
                    cy={pt.ye}
                    r={hover === pt.i ? 5.5 : 3.5}
                    fill={C.blue}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                ) : null}
                {(geo.xStep >= 40 && !geo.compact) || hover === pt.i ? (
                  <circle
                    cx={pt.x}
                    cy={pt.yi}
                    r={hover === pt.i ? 5.5 : 3.5}
                    fill={C.orange}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                ) : null}
                {pt.i === data.length - 1 || (data.length - 1 - pt.i) % geo.xLabelStep === 0 ? (
                  <text
                    x={pt.x}
                    y={geo.height - 18}
                    textAnchor={pt.i === 0 ? 'start' : pt.i === data.length - 1 ? 'end' : 'middle'}
                    fill={pt.i === data.length - 1 ? C.purple : '#64748b'}
                    fontSize="11"
                    fontWeight={pt.i === data.length - 1 ? 800 : 500}
                    fontFamily="IBM Plex Mono, monospace"
                  >
                    {fyTick(pt.d.financial_year)}
                  </text>
                ) : null}
              </React.Fragment>
            ))}
          </Box>

          {p ? (
            <Box
              sx={{
                position: 'absolute',
                left: geo.compact ? 'auto' : `${tipLeft}%`,
                right: geo.compact ? 4 : 'auto',
                top: 8,
                transform: geo.compact
                  ? 'none'
                  : flip
                    ? 'translateX(calc(-100% - 14px))'
                    : 'translateX(14px)',
                pointerEvents: 'none',
                bgcolor: C.ink,
                color: '#e7ecf5',
                borderRadius: 2,
                p: 1.25,
                minWidth: 180,
                boxShadow: '0 10px 30px -8px rgba(8,15,30,0.55)',
                zIndex: 3,
              }}
            >
              <Typography sx={{ ...mono, fontWeight: 700, fontSize: 12, color: '#fff', mb: 0.75 }}>
                {p.d.financial_year}
              </Typography>
              <TipRow color={C.blue} label="Exports" value={moneyB(p.d.export_usd_mn)} sub="" />
              <TipRow color={C.orange} label="Imports" value={moneyB(p.d.import_usd_mn)} sub="" />
              <Box sx={{ height: '1px', bgcolor: 'rgba(255,255,255,0.12)', my: 0.75 }} />
              <TipRow
                color={p.d.export_usd_mn - p.d.import_usd_mn >= 0 ? C.teal : C.red}
                label="Balance"
                value={moneySignB(p.d.export_usd_mn - p.d.import_usd_mn)}
                sub=""
              />
            </Box>
          ) : null}
        </Box>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {`India's exports to and imports from ${partner.name}, FY${fyTick(COUNTRY_YEARS[0])} → FY${fyTick(COUNTRY_YEARS[COUNTRY_LAST])}. Pick a partner chip or search any of ${PARTNERS.length} countries; hover or tap for year figures.`}
        </Typography>
      </Stack>
    </Paper>
  );
}

function PartnerShareCard() {
  const [metric, setMetric] = React.useState('total');
  const META = {
    total: { side: 'Total trade', tone: 'success' },
    exp: { side: 'Exports', tone: 'primary' },
    imp: { side: 'Imports', tone: 'warning' },
  };
  return (
    <CompositionChart
      title="Partner share of trade over time"
      sideLabel={META[metric].side}
      tone={META[metric].tone}
      comp={PARTNER_COMPS[metric]}
      groupNoun="partner countries"
      controls={
        <ToggleChips
          options={[
            ['total', 'Total trade'],
            ['exp', 'Exports'],
            ['imp', 'Imports'],
          ]}
          value={metric}
          onChange={setMetric}
          colorFor={(k) => toneColor(META[k].tone)}
        />
      }
    />
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                          */
/* ------------------------------------------------------------------ */
const NAV_SECTIONS = [
  ['Rupee & deficit', '#rupee-deficit'],
  ['Trade trends', '#trends'],
  ['Industry mix', '#basket-mix'],
  ['Partners', '#partners'],
  ['Biggest movers', '#item-trends'],
  ['Explorer', '#explorer'],
  ['Value chains', '#value-chains'],
];
const latestSummary = rows[rows.length - 1];
const latestFyLabel = `FY${latestSummary.financial_year.slice(2, 4)}–${latestSummary.financial_year.slice(-2)}`;
const latestIsYtd = latestSummary.data_status === 'year_to_date';
const latestIsProvisional = countrySlimData.source_update_note
  ?.toLowerCase()
  .includes('provisional');
const latestStatusNote = latestIsYtd ? 'YTD' : latestIsProvisional ? 'provisional' : '';

function Masthead() {
  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        bgcolor: C.ink,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Container
        maxWidth="xl"
        sx={{ py: 1.25, display: 'flex', alignItems: 'center', gap: { xs: 1.25, md: 2 } }}
      >
        <Box sx={{ mr: 'auto', minWidth: 0 }}>
          <Typography
            variant="h6"
            component="h1"
            sx={{
              color: '#fff',
              lineHeight: 1.15,
              fontSize: { xs: 17, md: 20 },
              whiteSpace: 'nowrap',
            }}
          >
            India Trade Monitor
          </Typography>
          <Typography
            sx={{
              color: 'rgba(231,236,245,0.6)',
              fontSize: 11.5,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Exports, imports and the trade balance, from official Government of India data
          </Typography>
        </Box>
        <Box
          component="nav"
          sx={{ display: { xs: 'none', md: 'flex' }, gap: 2.25, mr: 1, flexShrink: 0 }}
        >
          {NAV_SECTIONS.map(([label, href]) => (
            <Typography
              key={href}
              component="a"
              href={href}
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: 'rgba(231,236,245,0.72)',
                '&:hover': { color: '#fff' },
              }}
            >
              {label}
            </Typography>
          ))}
        </Box>
        <Chip
          size="small"
          label={`Data through ${latestFyLabel}${latestStatusNote ? ` · ${latestStatusNote}` : ''}`}
          sx={{ bgcolor: alpha(C.purple, 0.32), color: '#d9cbff', fontWeight: 700, flexShrink: 0 }}
        />
      </Container>
    </Box>
  );
}

function Footer() {
  const linkSx = {
    color: 'text.primary',
    textDecoration: 'underline',
    textDecorationColor: 'rgba(0,0,0,0.25)',
    '&:hover': { textDecorationColor: 'currentColor' },
  };
  return (
    <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', py: 3 }}>
      <Container maxWidth="xl">
        <Stack spacing={1.25} sx={{ maxWidth: 880 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            Sources: Ministry of Commerce &amp; Industry,{' '}
            <Box
              component="a"
              href="https://tradestat.commerce.gov.in/ftspcc/ttrade_country_wise"
              target="_blank"
              rel="noopener noreferrer"
              sx={linkSx}
            >
              Foreign Trade Statistics (FTSPCC monthly releases)
            </Box>{' '}
            for trade values;{' '}
            <Box
              component="a"
              href="https://trade-analytics.commerce.gov.in/public"
              target="_blank"
              rel="noopener noreferrer"
              sx={linkSx}
            >
              TIA public extraction endpoint
            </Box>{' '}
            for HS4 item-level trends;{' '}
            <Box
              component="a"
              href="https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=Handbook+of+Statistics+on+Indian+Economy"
              target="_blank"
              rel="noopener noreferrer"
              sx={linkSx}
            >
              RBI Handbook of Statistics, Table 139
            </Box>{' '}
            for annual-average INR/USD.
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            Values in current US$; fiscal years run April–March.
            {latestIsYtd
              ? ` ${latestFyLabel} is year-to-date.`
              : latestIsProvisional
                ? ` ${latestFyLabel} is provisional.`
                : ''}{' '}
            Independent dashboard; not affiliated with the Government of India.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

function Dashboard() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Masthead />
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
        <Stack spacing={{ xs: 4, md: 5 }}>
          {/* MACRO CONTEXT -------------------------------------------- */}
          <Box component="section" id="rupee-deficit" data-section>
            <RupeeDeficitChart />
          </Box>

          {/* TRENDS ------------------------------------------------------ */}
          <Box component="section" id="trends" data-section>
            <TradeTrendChart />
          </Box>

          {/* COMPOSITION ------------------------------------------------- */}
          <Box component="section" id="basket-mix" data-section>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2,
                mb: 2,
              }}
            >
              <CompositionDonut sideLabel="Exports" tone="primary" comp={exportComp} />
              <CompositionDonut sideLabel="Imports" tone="warning" comp={importComp} />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
              <CompositionChart
                title="Historical exports by industry"
                sideLabel="Exports"
                tone="primary"
                comp={exportComp}
              />
              <CompositionChart
                title="Historical imports by industry"
                sideLabel="Imports"
                tone="warning"
                comp={importComp}
              />
            </Box>
          </Box>

          {/* TRADING PARTNERS ------------------------------------------- */}
          <Box component="section" id="partners" data-section>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                gap: 2,
                mb: 2,
              }}
            >
              <PartnerButterfly />
              <PartnerTrendCard />
            </Box>
            <PartnerShareCard />
          </Box>

          {/* ITEM-LEVEL TRENDS (TOP MOVERS) ----------------------------- */}
          <Box component="section" id="item-trends" data-section>
            <Box
              sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}
            >
              <MoversCard sideLabel="Exports" tone="primary" movers={exportMovers} />
              <MoversCard sideLabel="Imports" tone="warning" movers={importMovers} />
            </Box>
          </Box>

          {/* BUILD-YOUR-OWN EXPLORER ------------------------------------ */}
          <Box component="section" id="explorer" data-section>
            <MoverExplorer />
          </Box>

          {/* IMPORT → EXPORT VALUE CHAINS ------------------------------- */}
          <Box component="section" id="value-chains" data-section>
            <ValueChainSection />
          </Box>
        </Stack>
      </Container>
      <Footer />
    </Box>
  );
}

export default Dashboard;
