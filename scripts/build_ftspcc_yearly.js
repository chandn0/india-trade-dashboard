import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT_DIR = path.resolve('.');
const OUT_DIR = path.join(ROOT_DIR, 'data');
const MONTHLY_CSV = path.join(OUT_DIR, 'india_trade_monthly_totals.csv');

function round2(value) {
  return Number(value.toFixed(2));
}

function buildAnnualSummary(monthlyRows) {
  const byFiscalYear = new Map();
  for (const row of monthlyRows) {
    // Monthly rows are cumulative year-to-date totals, so the fiscal year-end row
    // (March) is the full-year figure. `month` is the calendar month number and the
    // fiscal months run 4..12 then 1..3, so the highest month is December, not the
    // year-end — pick March (month === 3) explicitly rather than the max month.
    if (row.month === 3) {
      byFiscalYear.set(row.financial_year, row);
    }
  }

  const fiscalYears = [...byFiscalYear.keys()].sort((a, b) => Number(a.slice(0, 4)) - Number(b.slice(0, 4)));
  const summary = fiscalYears.map((financialYear, idx) => {
    const current = byFiscalYear.get(financialYear);
    const previous = idx > 0 ? byFiscalYear.get(fiscalYears[idx - 1]) : null;
    const exportYoy = previous ? ((current.export_usd_mn - previous.export_usd_mn) / previous.export_usd_mn) * 100 : null;
    const importYoy = previous ? ((current.import_usd_mn - previous.import_usd_mn) / previous.import_usd_mn) * 100 : null;
    return {
      financial_year: financialYear,
      export_usd_mn: round2(current.export_usd_mn),
      import_usd_mn: round2(current.import_usd_mn),
      trade_balance_usd_mn: round2(current.trade_balance_usd_mn),
      export_yoy_pct: exportYoy == null ? null : round2(exportYoy),
      import_yoy_pct: importYoy == null ? null : round2(importYoy),
      data_status: 'annual',
      source_export: 'https://tradestat.commerce.gov.in/ftspcc/ttrade_country_wise',
      source_import: 'https://tradestat.commerce.gov.in/ftspcc/ttrade_country_wise',
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

function parseMonthlyCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const rows = [];
  for (const line of lines.slice(1)) {
    if (!line.trim()) continue;
    const [financial_year, calendar_year, month, month_name, export_usd_mn, import_usd_mn] = line.split(',');
    const exportValue = Number(export_usd_mn);
    const importValue = Number(import_usd_mn);
    rows.push({
      financial_year,
      calendar_year: Number(calendar_year),
      month: Number(month),
      month_name,
      export_usd_mn: exportValue,
      import_usd_mn: importValue,
      trade_balance_usd_mn: exportValue - importValue,
      source_url: 'https://tradestat.commerce.gov.in/ftspcc/ttrade_country_wise',
    });
  }
  return rows;
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const monthlyCsv = await fs.readFile(MONTHLY_CSV, 'utf8');
  const monthlyRows = parseMonthlyCsv(monthlyCsv);
  const annual = buildAnnualSummary(monthlyRows);
  const sourceUpdateNote = 'FTSPCC monthly country-wise total trade page reported data available from January 2010 to Apr 2026; annual values were taken from the March cumulative row for each fiscal year. Report dated 08 Jun 2026.';
  const payload = {
    source_update_note: sourceUpdateNote,
    monthly_rows: monthlyRows,
    ...annual,
  };

  const csvRows = [
    ['financial_year', 'export_usd_mn', 'import_usd_mn', 'trade_balance_usd_mn', 'export_yoy_pct', 'import_yoy_pct', 'data_status'].join(','),
    ...annual.summary.map((row) => [
      row.financial_year,
      row.export_usd_mn,
      row.import_usd_mn,
      row.trade_balance_usd_mn,
      row.export_yoy_pct ?? '',
      row.import_yoy_pct ?? '',
      row.data_status,
    ].join(',')),
  ];

  await fs.writeFile(path.join(OUT_DIR, 'india_trade_yearly_raw.json'), `${JSON.stringify(payload, null, 2)}\n`);
  await fs.writeFile(path.join(OUT_DIR, 'india_trade_yearly_summary.csv'), `${csvRows.join('\n')}\n`);
  await fs.writeFile(path.join(OUT_DIR, 'sources.md'), `Official sources used\n\n- FTSPCC country-wise total trade page: https://tradestat.commerce.gov.in/ftspcc/ttrade_country_wise\n- TRADESTAT landing page: https://tradestat.commerce.gov.in/\n- TIA public dashboard home page: https://trade-analytics.commerce.gov.in/public\n- TIA public data extraction endpoint: https://trade-analytics.commerce.gov.in/public/de/dgcisdata\n\nNotes\n- The FTSPCC monthly total-trade page exposes data from January 2010 to Apr 2026 and reports cumulative year-to-date values for each selected month.\n- Annual fiscal-year totals are taken from the March cumulative row for each fiscal year.\n- The stored yearly series therefore begins at 2010-2011, which is the first fully reconstructable fiscal year from the public monthly data.\n- Values are in US $ Million.\n- The top export and import basket shares shown in the dashboard are taken from the official FTPA annual commodity-group summary reports stored in this workspace.\n- The five-year item-level import/export trends in the dashboard are from the TIA public data extraction endpoint using HS4, World, Financial Year, and the years 2021-22 through 2025-26.\n- The 100% share charts normalize the top commodity groups plus Other within each year so the composition can be compared year by year on a percentage basis.\n`);

  console.log(`Wrote ${annual.summary.length} fiscal years and ${monthlyRows.length} monthly rows.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
