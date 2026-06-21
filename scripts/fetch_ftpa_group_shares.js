import fs from 'node:fs/promises';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { FISCAL_YEARS } from './fiscal-config.js';

const OUT_DIR = path.resolve('data');
const YEARS = FISCAL_YEARS;
const MONTH = 3; // March gives the completed fiscal year summary.

const SOURCES = [
  {
    side: 'export',
    url: 'https://tradestat.commerce.gov.in/ftpa/export_commodity_group_new',
    label: 'exports',
    fieldPrefix: '',
  },
  {
    side: 'import',
    url: 'https://tradestat.commerce.gov.in/ftpa/import_commodity_group_new',
    label: 'imports',
    fieldPrefix: 'I',
  },
];

function decodeHtml(text) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function stripTags(text) {
  return decodeHtml(
    text
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

function parseNumber(text) {
  const cleaned = stripTags(text).replace(/,/g, '').trim();
  if (!cleaned) return null;
  const value = Number(cleaned.replace(/[^0-9.-]/g, ''));
  return Number.isFinite(value) ? value : null;
}

function extractToken(html) {
  const match = html.match(/name="_token" value="([^"]+)"/);
  if (!match) throw new Error('Could not find CSRF token on FTPA page');
  return match[1];
}

function extractTableRows(html) {
  const tableMatch = html.match(/<table[\s\S]*?<\/table>/i);
  if (!tableMatch) throw new Error('Could not find table in FTPA response');
  return [...tableMatch[0].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map((match) =>
    [...match[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cell) => stripTags(cell[1])),
  );
}

function round2(value) {
  return Number(value.toFixed(2));
}

function parseSummaryHtml(html, year) {
  if (/Page Expired/i.test(html)) {
    throw new Error(`FTPA session expired for ${year}`);
  }
  const rows = extractTableRows(html);
  const dataRows = rows.filter((cells) => {
    if (cells.length < 4) return false;
    const first = String(cells[0] || '').trim();
    if (!first) return false;
    if (/^Report Dated:/i.test(first)) return false;
    if (/^Commodity$/i.test(first)) return false;
    if (/^Values in/i.test(first)) return false;
    return /^(?:\d+\s+)?[A-Z]/.test(first) || /^Total$/i.test(first);
  });

  const groups = dataRows.map((cells) => {
    const first = String(cells[0]).trim();
    const name = first.replace(/^\d+\s+/, '');
    const [prev, curr, growth, share] = cells.slice(1);
    return {
      name,
      previous_usd_mn: parseNumber(prev),
      current_usd_mn: parseNumber(curr),
      growth_pct: parseNumber(growth),
      share_pct: parseNumber(share),
    };
  });

  const total = groups.find((row) => row.name === 'Total') || null;
  const commodityGroups = groups.filter((row) => row.name !== 'Total');

  return {
    financial_year: `${year - 1}-${year}`,
    report_year: year,
    report_month: 'March',
    total_usd_mn: total?.current_usd_mn ?? null,
    total_growth_pct: total?.growth_pct ?? null,
    groups: commodityGroups,
  };
}

async function initSession(url) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ftpa-'));
  const cookieFile = path.join(tempDir, 'cookies.txt');
  const pageFile = path.join(tempDir, 'page.html');
  execFileSync('curl', ['-L', '--silent', '-c', cookieFile, url, '-o', pageFile], {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
  const html = await fs.readFile(pageFile, 'utf8');
  return { token: extractToken(html), cookieFile };
}

function fetchSummary({ url, token, cookieFile, year, fieldPrefix }) {
  const html = execFileSync(
    'curl',
    [
      '-L',
      '--silent',
      '-b',
      cookieFile,
      '-c',
      cookieFile,
      '-X',
      'POST',
      url,
      '-d',
      new URLSearchParams({
        _token: token,
        [`${fieldPrefix}ReportType`]: '1',
        [`${fieldPrefix}Month`]: String(MONTH),
        [`${fieldPrefix}Year`]: String(year),
        [`${fieldPrefix}Report`]: '2',
      }).toString(),
    ],
    {
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024,
    },
  );
  return parseSummaryHtml(html, year);
}

function toCsv(rows) {
  return [
    [
      'financial_year',
      'report_year',
      'group_name',
      'previous_usd_mn',
      'current_usd_mn',
      'growth_pct',
      'share_pct',
      'report_month',
    ].join(','),
    ...rows.flatMap((yearRow) =>
      yearRow.groups.map((group) =>
        [
          yearRow.financial_year,
          yearRow.report_year,
          group.name,
          group.previous_usd_mn ?? '',
          group.current_usd_mn ?? '',
          group.growth_pct ?? '',
          group.share_pct ?? '',
          yearRow.report_month,
        ].join(','),
      ),
    ),
  ].join('\n');
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const exportRows = [];
  const importRows = [];

  for (const year of YEARS) {
    process.stdout.write(`Fetching export summary ${year} ...\r`);
    const exportSession = await initSession(SOURCES[0].url);
    exportRows.push(
      fetchSummary({
        url: SOURCES[0].url,
        token: exportSession.token,
        cookieFile: exportSession.cookieFile,
        year,
        fieldPrefix: SOURCES[0].fieldPrefix,
      }),
    );
  }
  process.stdout.write('\n');

  for (const year of YEARS) {
    process.stdout.write(`Fetching import summary ${year} ...\r`);
    const importSession = await initSession(SOURCES[1].url);
    importRows.push(
      fetchSummary({
        url: SOURCES[1].url,
        token: importSession.token,
        cookieFile: importSession.cookieFile,
        year,
        fieldPrefix: SOURCES[1].fieldPrefix,
      }),
    );
  }
  process.stdout.write('\n');

  const payload = {
    source_update_note:
      'FTPA annual commodity-group summary reports fetched from the official Government of India trade portal on 08 Jun 2026. March selections were used to capture completed fiscal years.',
    export_rows: exportRows,
    import_rows: importRows,
    sources: SOURCES,
  };

  await fs.writeFile(
    path.join(OUT_DIR, 'india_trade_commodity_group_shares.json'),
    `${JSON.stringify(payload, null, 2)}\n`,
  );
  await fs.writeFile(
    path.join(OUT_DIR, 'india_trade_commodity_group_shares_export.csv'),
    `${toCsv(exportRows)}\n`,
  );
  await fs.writeFile(
    path.join(OUT_DIR, 'india_trade_commodity_group_shares_import.csv'),
    `${toCsv(importRows)}\n`,
  );
  await fs.writeFile(
    path.join(OUT_DIR, 'sources.md'),
    `Official sources used\n\n- FTPA export commodity-group summary: ${SOURCES[0].url}\n- FTPA import commodity-group summary: ${SOURCES[1].url}\n- FTSPCC country-wise total trade page: https://tradestat.commerce.gov.in/ftspcc/ttrade_country_wise\n- TRADESTAT landing page: https://tradestat.commerce.gov.in/\n- TIA public dashboard home page: https://trade-analytics.commerce.gov.in/public\n- TIA public data extraction endpoint: https://trade-analytics.commerce.gov.in/public/de/dgcisdata\n\nNotes\n- The FTPA annual commodity-group summary reports expose fiscal-year data back to 2009-2010 in this stored slice.\n- March selections were used so each record captures a completed fiscal year summary.\n- The stored yearly series therefore begins at 2009-2010 for the export and import basket share charts.\n- Values are in US $ Million.\n- The annual total-trade series begins at 2010-2011 from the FTSPCC monthly totals page.\n- The five-year item-level import/export trends in the dashboard are from the TIA public data extraction endpoint using HS4, World, Financial Year, and the years 2021-22 through 2025-26.\n- The 100% share charts normalize the top commodity groups plus Other within each year so the composition can be compared year by year on a percentage basis.\n`,
  );

  console.log(`Wrote ${exportRows.length} export years and ${importRows.length} import years.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
