import fs from 'node:fs/promises';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const BASE_URL = 'https://tradestat.commerce.gov.in/ftspcc/ttrade_country_wise';
const OUT_DIR = path.resolve('data');
const YEAR_START = 2010;
const YEAR_END = 2025;

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

function fiscalYearLabel(startYear) {
  return `${startYear}-${startYear + 1}`;
}

function rowFiscalYear(calendarYear, month) {
  return month >= 4 ? calendarYear : calendarYear - 1;
}

function monthLabel(month) {
  return [
    null,
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ][month];
}

function extractToken(html) {
  const match = html.match(/name="_token" value="([^"]+)"/);
  if (!match) throw new Error('Could not find CSRF token on FTSPCC page');
  return match[1];
}

function extractFooterTotals(html) {
  const footMatch = html.match(/<tfoot>[\s\S]*?<tr>([\s\S]*?)<\/tr>[\s\S]*?<\/tfoot>/i);
  if (!footMatch) throw new Error('Could not find table footer in FTSPCC response');
  const cellMatches = [...footMatch[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)];
  const cells = cellMatches.map((match) => stripTags(match[1]));
  if (cells.length < 12) throw new Error(`Unexpected footer cell count: ${cells.length}`);
  return cells;
}

async function initSession() {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ftspcc-'));
  const cookieFile = path.join(tempDir, 'cookies.txt');
  const pageFile = path.join(tempDir, 'page.html');
  execFileSync('curl', ['-L', '--silent', '-c', cookieFile, BASE_URL, '-o', pageFile], {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
  const html = await fs.readFile(pageFile, 'utf8');
  return {
    token: extractToken(html),
    cookieFile,
  };
}

function fetchMonthlyTotal({ token, cookieFile, calendarYear, month }) {
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
        MonthCwTt: String(month),
        YearCwTt: String(calendarYear),
        countryCwTt: 'all',
        ValuesCwTt: '0',
      }).toString(),
    ],
    {
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024,
    },
  );
  let cells;
  try {
    cells = extractFooterTotals(html);
  } catch (error) {
    throw new Error(
      `FTSPCC footer parse failed for ${calendarYear}-${String(month).padStart(2, '0')}: ${html.slice(0, 300)}`,
      { cause: error },
    );
  }
  const exportValue = parseNumber(cells[6]);
  const importValue = parseNumber(cells[7]);
  if (exportValue == null || importValue == null) {
    throw new Error(`Could not parse totals for ${calendarYear}-${String(month).padStart(2, '0')}`);
  }
  const fiscalStart = rowFiscalYear(calendarYear, month);
  return {
    financial_year: fiscalYearLabel(fiscalStart),
    calendar_year: calendarYear,
    month,
    month_name: monthLabel(month),
    export_usd_mn: exportValue,
    import_usd_mn: importValue,
    trade_balance_usd_mn: exportValue - importValue,
    source_url: BASE_URL,
  };
}

function round2(value) {
  return Number(value.toFixed(2));
}

function buildAnnualSummary(monthlyRows) {
  const byFiscalYear = new Map();
  for (const row of monthlyRows) {
    // Each fetched row is the page's footer total for the selected month, which is a
    // cumulative year-to-date figure — so the fiscal year-end row (March) already is the
    // full-year total. Do NOT sum the months: that multiplies the cumulative values.
    // `month` is the calendar month number (fiscal months run 4..12 then 1..3), so the
    // year-end is March (month === 3), not the highest month number (December).
    if (row.month === 3) {
      byFiscalYear.set(row.financial_year, row);
    }
  }

  const fiscalYears = [...byFiscalYear.keys()].sort(
    (a, b) => Number(a.slice(0, 4)) - Number(b.slice(0, 4)),
  );
  const summary = fiscalYears.map((financialYear, idx) => {
    const current = byFiscalYear.get(financialYear);
    const previous = idx > 0 ? byFiscalYear.get(fiscalYears[idx - 1]) : null;
    const exportYoy = previous
      ? ((current.export_usd_mn - previous.export_usd_mn) / previous.export_usd_mn) * 100
      : null;
    const importYoy = previous
      ? ((current.import_usd_mn - previous.import_usd_mn) / previous.import_usd_mn) * 100
      : null;
    return {
      financial_year: financialYear,
      export_usd_mn: round2(current.export_usd_mn),
      import_usd_mn: round2(current.import_usd_mn),
      trade_balance_usd_mn: round2(current.trade_balance_usd_mn),
      export_yoy_pct: exportYoy == null ? null : round2(exportYoy),
      import_yoy_pct: importYoy == null ? null : round2(importYoy),
      data_status: 'annual',
      source_export: BASE_URL,
      source_import: BASE_URL,
    };
  });

  const exportSeries = summary.slice(1).map((row, idx) => ({
    selectedYear: row.financial_year,
    previousYearValue: summary[idx].export_usd_mn,
    currentYearValue: row.export_usd_mn,
    growthPercent: row.export_yoy_pct,
  }));

  const importSeries = summary.slice(1).map((row, idx) => ({
    selectedYear: row.financial_year,
    previousYearValue: summary[idx].import_usd_mn,
    currentYearValue: row.import_usd_mn,
    growthPercent: row.import_yoy_pct,
  }));

  return { summary, exportSeries, importSeries };
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const { token, cookieFile } = await initSession();

  const monthlyRows = [];
  for (let fiscalStart = YEAR_START; fiscalStart <= YEAR_END; fiscalStart += 1) {
    const calendarYears = [
      ...Array.from({ length: 9 }, (_, i) => ({ year: fiscalStart, month: i + 4 })),
      ...Array.from({ length: 3 }, (_, i) => ({ year: fiscalStart + 1, month: i + 1 })),
    ];
    for (const { year, month } of calendarYears) {
      process.stdout.write(`Fetching ${year}-${String(month).padStart(2, '0')} ...\r`);
      monthlyRows.push(fetchMonthlyTotal({ token, cookieFile, calendarYear: year, month }));
    }
  }
  process.stdout.write('\n');

  const annual = buildAnnualSummary(monthlyRows);
  const sourceUpdateNote = `FTSPCC monthly country-wise total trade page reported data available from January 2010 to Apr 2026; annual values were taken from the March cumulative row for each fiscal year. Report dated 08 Jun 2026.`;
  const payload = {
    source_update_note: sourceUpdateNote,
    monthly_rows: monthlyRows,
    ...annual,
  };

  const csvRows = [
    [
      'financial_year',
      'export_usd_mn',
      'import_usd_mn',
      'trade_balance_usd_mn',
      'export_yoy_pct',
      'import_yoy_pct',
      'data_status',
    ].join(','),
    ...annual.summary.map((row) =>
      [
        row.financial_year,
        row.export_usd_mn,
        row.import_usd_mn,
        row.trade_balance_usd_mn,
        row.export_yoy_pct ?? '',
        row.import_yoy_pct ?? '',
        row.data_status,
      ].join(','),
    ),
  ];

  await fs.writeFile(
    path.join(OUT_DIR, 'india_trade_yearly_raw.json'),
    `${JSON.stringify(payload, null, 2)}\n`,
  );
  await fs.writeFile(
    path.join(OUT_DIR, 'india_trade_yearly_summary.csv'),
    `${csvRows.join('\n')}\n`,
  );
  await fs.writeFile(
    path.join(OUT_DIR, 'india_trade_monthly_totals.json'),
    `${JSON.stringify(monthlyRows, null, 2)}\n`,
  );
  await fs.writeFile(
    path.join(OUT_DIR, 'sources.md'),
    `Official sources used\n\n- FTSPCC country-wise total trade page: ${BASE_URL}\n- TRADESTAT landing page: https://tradestat.commerce.gov.in/\n- TIA public dashboard home page: https://trade-analytics.commerce.gov.in/public\n- TIA public data extraction endpoint: https://trade-analytics.commerce.gov.in/public/de/dgcisdata\n\nNotes\n- The FTSPCC monthly total-trade page exposes data from January 2010 to Apr 2026.\n- Annual fiscal-year totals are taken from the March cumulative row for each fiscal year (the monthly total rows are cumulative year-to-date values, so March is the full-year figure).\n- The stored yearly series therefore begins at 2010-2011, which is the first fully reconstructable fiscal year from the public monthly data.\n- Values are in US $ Million.\n- The top export and import basket shares shown in the dashboard are taken from the official FTPA annual commodity-group summary reports stored in this workspace.\n- The five-year item-level import/export trends in the dashboard are from the TIA public data extraction endpoint using HS4, World, Financial Year, and the years 2021-22 through 2025-26.\n- The 100% share charts normalize the top commodity groups plus Other within each year so the composition can be compared year by year on a percentage basis.\n`,
  );

  console.log(
    `Wrote ${annual.summary.length} fiscal years and ${monthlyRows.length} monthly rows.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
