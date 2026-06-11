import fs from 'node:fs/promises';
import path from 'node:path';

const OUT_JSON = path.resolve('data', 'india_trade_inr_usd_fy.json');
const OUT_CSV = path.resolve('data', 'india_trade_inr_usd_fy.csv');
const SOURCE_URL = 'https://www.fbil.org.in/wasdm/refrates/fetchfiltered';
const START_DATE = '2024-04-01';
const END_DATE = '2026-03-31';
const USD_LABEL = 'INR / 1 USD';

function parseDate(value) {
  return new Date(`${value}T00:00:00Z`);
}

function financialYearForDate(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const fyStart = month >= 4 ? year : year - 1;
  return `${fyStart}-${fyStart + 1}`;
}

function formatNumber(value) {
  return Number(value.toFixed(6));
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      accept: 'application/json, text/plain, */*',
    },
  });
  if (!response.ok) {
    throw new Error(`FBIL request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function main() {
  const url = `${SOURCE_URL}?${new URLSearchParams({
    fromDate: START_DATE,
    toDate: END_DATE,
    authenticated: 'false',
  })}`;
  const rows = await fetchJson(url);

  const usdRows = rows
    .filter((row) => row.subProdName === USD_LABEL)
    .map((row) => ({
      date: String(row.processRunDate).slice(0, 10),
      rate: Number(row.rate),
    }))
    .filter((row) => Number.isFinite(row.rate));

  const byFy = new Map();
  for (const row of usdRows) {
    const fy = financialYearForDate(parseDate(row.date));
    if (!byFy.has(fy)) byFy.set(fy, []);
    byFy.get(fy).push(row);
  }

  const historical = JSON.parse(await fs.readFile(OUT_JSON, 'utf8'));
  const existingRows = historical.rows.filter((row) => row.financial_year < '2024-2025');

  const newRows = [...byFy.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([financial_year, samples]) => {
      const ordered = [...samples].sort((a, b) => a.date.localeCompare(b.date));
      const avg = ordered.reduce((sum, row) => sum + row.rate, 0) / ordered.length;
      const end = ordered[ordered.length - 1]?.rate ?? null;
      return {
        financial_year,
        inr_per_usd_avg: formatNumber(avg),
        inr_per_usd_end: end == null ? null : formatNumber(end),
      };
    });

  const mergedRows = [...existingRows, ...newRows];
  const payload = {
    source_url: SOURCE_URL,
    source_note: 'RBI Table 139 covers financial years through 2023-2024; FBIL daily reference rates are used to extend the series through 2025-2026.',
    rows: mergedRows,
    sources: {
      table_139_url: 'https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/139T_13092024245FFE1BB8CB45C3A51183FB6ADA6DC8.XLSX',
      fbil_reference_rates_url: SOURCE_URL,
      fbil_base_url: 'https://www.fbil.org.in/wasdm',
    },
  };

  await fs.writeFile(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`);
  await fs.writeFile(
    OUT_CSV,
    [
      'financial_year,inr_per_usd_avg,inr_per_usd_end',
      ...mergedRows.map((row) => `${row.financial_year},${row.inr_per_usd_avg ?? ''},${row.inr_per_usd_end ?? ''}`),
    ].join('\n') + '\n',
  );

  console.log(`Wrote ${mergedRows.length} exchange-rate years to ${OUT_JSON}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
