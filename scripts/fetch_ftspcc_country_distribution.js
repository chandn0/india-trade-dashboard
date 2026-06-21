import fs from 'node:fs/promises';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const BASE_URL = 'https://tradestat.commerce.gov.in/ftspcc/ttrade_country_wise';
const OUT_DIR = path.resolve('data');
const FIRST_FULL_FISCAL_YEAR_END = 2011;

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

function parseTradeNumber(text) {
  const cleaned = stripTags(text).replace(/,/g, '').trim();
  if (!cleaned || cleaned === '-') return 0;
  const value = Number(cleaned.replace(/[^0-9.-]/g, ''));
  return Number.isFinite(value) ? value : 0;
}

function parseGrowthNumber(text) {
  const cleaned = stripTags(text).replace(/,/g, '').trim();
  if (!cleaned || cleaned === '-') return null;
  const value = Number(cleaned.replace(/[^0-9.-]/g, ''));
  return Number.isFinite(value) ? value : null;
}

function round2(value) {
  return Number(value.toFixed(2));
}

function fiscalYearLabel(endYear) {
  return `${endYear - 1}-${endYear}`;
}

function extractToken(html) {
  const match = html.match(/name="_token" value="([^"]+)"/);
  if (!match) throw new Error('Could not find CSRF token on FTSPCC page');
  return match[1];
}

function extractAvailableYears(html) {
  const yearSelectMatch = html.match(/<select[^>]*name="YearCwTt"[^>]*>([\s\S]*?)<\/select>/i);
  if (!yearSelectMatch) throw new Error('Could not find year selector on FTSPCC page');
  const years = [...yearSelectMatch[1].matchAll(/<option value="(\d{4})"/g)].map((match) =>
    Number(match[1]),
  );
  return years
    .filter((year) => Number.isFinite(year) && year >= FIRST_FULL_FISCAL_YEAR_END)
    .sort((a, b) => a - b);
}

function extractRows(html, selectedYear) {
  const tbodyMatch = html.match(/<tbody>([\s\S]*?)<\/tbody>/i);
  if (!tbodyMatch) throw new Error(`Could not find country table body for ${selectedYear}`);
  const currentFiscalYear = fiscalYearLabel(selectedYear);
  const previousFiscalYear = fiscalYearLabel(selectedYear - 1);

  return [...tbodyMatch[1].matchAll(/<tr>([\s\S]*?)<\/tr>/gi)].map((rowMatch) => {
    const cells = [...rowMatch[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(
      (cell) => cell[1],
    );
    if (cells.length < 12) {
      throw new Error(
        `Unexpected country row cell count (${cells.length}) for ${currentFiscalYear}`,
      );
    }

    return {
      fiscal_year: currentFiscalYear,
      previous_fiscal_year: previousFiscalYear,
      country: stripTags(cells[1]),
      previous_export_usd_mn: parseTradeNumber(cells[2]),
      previous_import_usd_mn: parseTradeNumber(cells[3]),
      previous_total_trade_usd_mn: parseTradeNumber(cells[4]),
      previous_trade_balance_usd_mn: parseTradeNumber(cells[5]),
      export_usd_mn: parseTradeNumber(cells[6]),
      import_usd_mn: parseTradeNumber(cells[7]),
      total_trade_usd_mn: parseTradeNumber(cells[8]),
      trade_balance_usd_mn: parseTradeNumber(cells[9]),
      export_yoy_pct: parseGrowthNumber(cells[10]),
      import_yoy_pct: parseGrowthNumber(cells[11]),
    };
  });
}

function sumTotalsFromRows(rows, selectedYear) {
  const previousExport = rows.reduce((sum, row) => sum + row.previous_export_usd_mn, 0);
  const previousImport = rows.reduce((sum, row) => sum + row.previous_import_usd_mn, 0);
  const currentExport = rows.reduce((sum, row) => sum + row.export_usd_mn, 0);
  const currentImport = rows.reduce((sum, row) => sum + row.import_usd_mn, 0);

  return {
    fiscal_year: fiscalYearLabel(selectedYear),
    previous_fiscal_year: fiscalYearLabel(selectedYear - 1),
    previous_export_usd_mn: round2(previousExport),
    previous_import_usd_mn: round2(previousImport),
    previous_total_trade_usd_mn: round2(previousExport + previousImport),
    previous_trade_balance_usd_mn: round2(previousExport - previousImport),
    export_usd_mn: round2(currentExport),
    import_usd_mn: round2(currentImport),
    total_trade_usd_mn: round2(currentExport + currentImport),
    trade_balance_usd_mn: round2(currentExport - currentImport),
    export_yoy_pct: previousExport
      ? round2(((currentExport - previousExport) / previousExport) * 100)
      : null,
    import_yoy_pct: previousImport
      ? round2(((currentImport - previousImport) / previousImport) * 100)
      : null,
  };
}

async function initSession() {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ftspcc-country-'));
  const cookieFile = path.join(tempDir, 'cookies.txt');
  const pageFile = path.join(tempDir, 'page.html');
  execFileSync('curl', ['-L', '--silent', '-c', cookieFile, BASE_URL, '-o', pageFile], {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
  const html = await fs.readFile(pageFile, 'utf8');
  return {
    html,
    token: extractToken(html),
    availableYears: extractAvailableYears(html),
    cookieFile,
  };
}

function fetchCountryTable({ token, cookieFile, year }) {
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
      BASE_URL,
      '-d',
      new URLSearchParams({
        _token: token,
        MonthCwTt: '3',
        YearCwTt: String(year),
        countryCwTt: 'all',
        ValuesCwTt: '0',
      }).toString(),
    ],
    {
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024,
    },
  );

  const rows = extractRows(html, year);

  return {
    html,
    nextToken: extractToken(html),
    rows,
    totals: sumTotalsFromRows(rows, year),
  };
}

function addSharesAndRanks(rowsByYear, totalsByYear, latestFiscalYear) {
  const enriched = [];

  for (const [fiscalYear, yearRows] of rowsByYear.entries()) {
    const totals = totalsByYear.get(fiscalYear);
    const exportRanking = [...yearRows].sort((a, b) => b.export_usd_mn - a.export_usd_mn);
    const importRanking = [...yearRows].sort((a, b) => b.import_usd_mn - a.import_usd_mn);
    const totalTradeRanking = [...yearRows].sort(
      (a, b) => b.total_trade_usd_mn - a.total_trade_usd_mn,
    );

    const exportRanks = new Map(exportRanking.map((row, idx) => [row.country, idx + 1]));
    const importRanks = new Map(importRanking.map((row, idx) => [row.country, idx + 1]));
    const totalTradeRanks = new Map(totalTradeRanking.map((row, idx) => [row.country, idx + 1]));

    for (const row of yearRows) {
      enriched.push({
        ...row,
        export_share_pct: totals.export_usd_mn
          ? round2((row.export_usd_mn / totals.export_usd_mn) * 100)
          : 0,
        import_share_pct: totals.import_usd_mn
          ? round2((row.import_usd_mn / totals.import_usd_mn) * 100)
          : 0,
        total_trade_share_pct: totals.total_trade_usd_mn
          ? round2((row.total_trade_usd_mn / totals.total_trade_usd_mn) * 100)
          : 0,
        export_rank: exportRanks.get(row.country),
        import_rank: importRanks.get(row.country),
        total_trade_rank: totalTradeRanks.get(row.country),
        data_status: row.fiscal_year === latestFiscalYear ? 'provisional' : 'annual',
      });
    }
  }

  return enriched.sort((a, b) => {
    if (a.fiscal_year !== b.fiscal_year) return a.fiscal_year.localeCompare(b.fiscal_year);
    return a.total_trade_rank - b.total_trade_rank;
  });
}

function csvEscape(value) {
  if (value == null) return '';
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const { html, token, availableYears, cookieFile } = await initSession();
  const yearsToFetch = availableYears.filter((year) => year >= FIRST_FULL_FISCAL_YEAR_END);
  const latestYear = yearsToFetch.at(-1);
  const latestFiscalYear = fiscalYearLabel(latestYear);
  const fetchedAt = new Date().toISOString().slice(0, 10);
  let currentToken = token;

  const rowsByYear = new Map();
  const totalsByYear = new Map();

  for (const year of yearsToFetch) {
    process.stdout.write(`Fetching country distribution for FY ${fiscalYearLabel(year)}...\r`);
    const { rows, totals, nextToken } = fetchCountryTable({
      token: currentToken,
      cookieFile,
      year,
    });
    rowsByYear.set(fiscalYearLabel(year), rows);
    totalsByYear.set(fiscalYearLabel(year), totals);
    currentToken = nextToken;
  }
  process.stdout.write('\n');

  const rows = addSharesAndRanks(rowsByYear, totalsByYear, latestFiscalYear);
  const latestRows = rows.filter((row) => row.fiscal_year === latestFiscalYear);
  const totals = [...totalsByYear.values()].sort((a, b) =>
    a.fiscal_year.localeCompare(b.fiscal_year),
  );

  const payload = {
    source_update_note: `FTSPCC country-wise total trade page fetched on ${fetchedAt}. Each fiscal year uses the March cumulative table for that year-end; FY ${latestFiscalYear} is marked provisional because it is the latest reported year on the source page.`,
    source_url: BASE_URL,
    first_full_fiscal_year: fiscalYearLabel(FIRST_FULL_FISCAL_YEAR_END),
    latest_fiscal_year: latestFiscalYear,
    available_year_options: extractAvailableYears(html),
    yearly_totals: totals,
    rows,
    latest_rows: latestRows,
  };

  const headers = [
    'fiscal_year',
    'country',
    'export_usd_mn',
    'import_usd_mn',
    'total_trade_usd_mn',
    'trade_balance_usd_mn',
    'export_share_pct',
    'import_share_pct',
    'total_trade_share_pct',
    'export_rank',
    'import_rank',
    'total_trade_rank',
    'previous_fiscal_year',
    'previous_export_usd_mn',
    'previous_import_usd_mn',
    'previous_total_trade_usd_mn',
    'previous_trade_balance_usd_mn',
    'export_yoy_pct',
    'import_yoy_pct',
    'data_status',
  ];

  const csvRows = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(',')),
  ];

  const latestCsvRows = [
    headers.join(','),
    ...latestRows.map((row) => headers.map((header) => csvEscape(row[header])).join(',')),
  ];

  const totalsHeaders = [
    'fiscal_year',
    'export_usd_mn',
    'import_usd_mn',
    'total_trade_usd_mn',
    'trade_balance_usd_mn',
    'export_yoy_pct',
    'import_yoy_pct',
    'previous_fiscal_year',
    'previous_export_usd_mn',
    'previous_import_usd_mn',
    'previous_total_trade_usd_mn',
    'previous_trade_balance_usd_mn',
  ];

  const totalsCsvRows = [
    totalsHeaders.join(','),
    ...totals.map((row) => totalsHeaders.map((header) => csvEscape(row[header])).join(',')),
  ];

  await fs.writeFile(
    path.join(OUT_DIR, 'india_trade_country_distribution.json'),
    `${JSON.stringify(payload, null, 2)}\n`,
  );
  await fs.writeFile(
    path.join(OUT_DIR, 'india_trade_country_distribution.csv'),
    `${csvRows.join('\n')}\n`,
  );
  await fs.writeFile(
    path.join(OUT_DIR, 'india_trade_country_distribution_latest.csv'),
    `${latestCsvRows.join('\n')}\n`,
  );
  await fs.writeFile(
    path.join(OUT_DIR, 'india_trade_country_totals.csv'),
    `${totalsCsvRows.join('\n')}\n`,
  );

  console.log(`Wrote ${rows.length} country-year rows across ${totals.length} fiscal years.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
