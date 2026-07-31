/* ------------------------------------------------------------------ */
/* Shared data — all JSON imports and derived structures live here.   */
/* Components import what they need; page.js gets the rest as props.  */
/* ------------------------------------------------------------------ */

import commodityShareData from '../../data/india_trade_commodity_group_shares.json';
import yearlySummaryData from '../../data/india_trade_yearly_raw.json';
import hs4ExportData from '../../data/india_trade_hs4_world_export_5fy.json';
import hs4ImportData from '../../data/india_trade_hs4_world_import_5fy.json';
import countrySlimData from '../../data/india_trade_country_slim.json';
import partnerProductsData from '../../data/india_trade_partner_top_products.json';

import groupLabels from '../../data/labels/group-labels.json';
import hs4Labels from '../../data/labels/hs4-labels.json';
import countryLabels from '../../data/labels/country-labels.json';

/* ------------------------------------------------------------------ */
/* Palette                                                            */
/* ------------------------------------------------------------------ */
export const COMMODITY_PALETTE = [
  '#4f756d',
  '#46698f',
  '#9a5868',
  '#756783',
  '#537888',
  '#657080',
  '#886b82',
  '#a86435',
  '#5f7b58',
  '#818b55',
  '#69859a',
  '#a98545',
  '#78678b',
  '#5f817b',
  '#a45159',
  '#926b46',
  '#887746',
  '#80667c',
  '#55737d',
  '#6f6980',
  '#696969',
  '#795f76',
];
export const REST_COLOR = '#d7d8d5';

// Fallback sequential palette for composition charts when a segment has no assigned color.
export const CAT = [
  '#46698f',
  '#69859a',
  '#4f756d',
  '#5f7b58',
  '#818b55',
  '#a98545',
  '#a86435',
  '#a45159',
];

/* ------------------------------------------------------------------ */
/* FTSPCC yearly data                                                  */
/* ------------------------------------------------------------------ */
export const rows = yearlySummaryData.summary;

/* ------------------------------------------------------------------ */
/* Commodity composition                                              */
/* ------------------------------------------------------------------ */
const summaryYears = new Set(rows.map((row) => row.financial_year));
const commodityExportRows = commodityShareData.export_rows.filter((row) =>
  summaryYears.has(row.financial_year),
);
const commodityImportRows = commodityShareData.import_rows.filter((row) =>
  summaryYears.has(row.financial_year),
);
export const mixYears = commodityExportRows.map((row) => row.financial_year);

export function cleanGroupName(raw) {
  if (groupLabels[raw]) return groupLabels[raw];
  const s = String(raw).toLowerCase().replace(/\s+/g, ' ').trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Other';
}

export function buildCommodityComposition(rowsInput, topN) {
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
  return { items, years, topShare, latestYear, groupCount: groups.length };
}

export const INDUSTRY_TOP = 10;
export const exportComp = buildCommodityComposition(commodityExportRows, INDUSTRY_TOP);
export const importComp = buildCommodityComposition(commodityImportRows, INDUSTRY_TOP);

// One color per commodity basket, shared across the export and import charts so the same
// basket reads as the same color in both. Export baskets are colored first (in rank order),
// then any import-only baskets pick up the next unused palette slots.
export const basketColorMap = {};
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

/* ------------------------------------------------------------------ */
/* HS-4 five-year product movers                                       */
/* ------------------------------------------------------------------ */
// The HS-4 export/import files carry one row per product line with USD values for each of the
// last five fiscal years. Movers are ranked by ABSOLUTE change in annual USD value — that
// surfaces the shifts that actually moved the trade balance, rather than large-percent swings
// off a near-zero base.
export const HS4_YEARS = ['2021-22', '2022-23', '2023-24', '2024-25', '2025-26'];

export function cleanHsDesc(code, raw) {
  if (hs4Labels[code]) return hs4Labels[code];
  const s = String(raw).toLowerCase().replace(/\s+/g, ' ').trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : `HS ${code}`;
}

export function prepHs4Items(rowsInput) {
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

export const HS4_ITEMS = {
  Exports: prepHs4Items(hs4ExportData),
  Imports: prepHs4Items(hs4ImportData),
};

// Slice each product line to the [i0, i1] fiscal-year window and derive the change stats the
// mover rows render. Shared by the fixed movers cards (full window) and the explorer.
export function windowHs4(items, i0, i1) {
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

export function buildMovers(list) {
  const gainers = [...list].sort((a, b) => b.abs - a.abs).slice(0, 6);
  const decliners = [...list].sort((a, b) => a.abs - b.abs).slice(0, 6);
  return { gainers, decliners };
}

export const HS4_FULL = {
  Exports: windowHs4(HS4_ITEMS.Exports, 0, HS4_YEARS.length - 1),
  Imports: windowHs4(HS4_ITEMS.Imports, 0, HS4_YEARS.length - 1),
};
export const EXPORT_BY_CODE = new Map(HS4_FULL.Exports.map((it) => [it.code, it]));
export const IMPORT_BY_CODE = new Map(HS4_FULL.Imports.map((it) => [it.code, it]));
export const exportMovers = buildMovers(HS4_FULL.Exports);
export const importMovers = buildMovers(HS4_FULL.Imports);

/* ------------------------------------------------------------------ */
/* Partner / country data                                             */
/* ------------------------------------------------------------------ */
export function cleanCountryName(raw) {
  if (countryLabels[raw]) return countryLabels[raw];
  const s = String(raw).toLowerCase().replace(/\s+/g, ' ').trim();
  return s ? s.replace(/\b\w/g, (ch) => ch.toUpperCase()) : String(raw);
}

export const COUNTRY_YEARS = countrySlimData.years;
export const COUNTRY_LAST = COUNTRY_YEARS.length - 1;
export const COUNTRY_TOTALS = countrySlimData.totals;
export const PARTNERS = countrySlimData.countries.map((c) => ({
  key: c.name,
  name: cleanCountryName(c.name),
  exp: c.exp,
  imp: c.imp,
  total: c.exp.map((v, i) => v + c.imp[i]),
}));
export const PARTNER_BY_KEY = new Map(PARTNERS.map((p) => [p.key, p]));

const partnerMetricSeries = (p, metric) => (metric === 'total' ? p.total : p[metric]);
export const PARTNER_TOP_N = 15;
export const PARTNER_COLOR = {};
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

export function buildPartnerComposition(metric) {
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

export const PARTNER_COMPS = {
  total: buildPartnerComposition('total'),
  exp: buildPartnerComposition('exp'),
  imp: buildPartnerComposition('imp'),
};

export const PARTNER_PRODUCTS = new Map(
  (partnerProductsData.partners ?? []).map((p) => [p.country, p]),
);
export const PARTNER_PRODUCTS_FY = partnerProductsData.fiscal_year;

/* ------------------------------------------------------------------ */
/* Dashboard-level metadata                                           */
/* ------------------------------------------------------------------ */
export const latestSummary = rows[rows.length - 1];
export const latestFyLabel = `FY${latestSummary.financial_year.slice(2, 4)}–${latestSummary.financial_year.slice(-2)}`;
export const latestIsYtd = latestSummary.data_status === 'year_to_date';
export const latestIsProvisional = countrySlimData.source_update_note
  ?.toLowerCase()
  .includes('provisional');
export const latestStatusNote = latestIsYtd ? 'YTD' : latestIsProvisional ? 'provisional' : '';
