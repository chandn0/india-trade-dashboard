import fs from 'node:fs/promises';
import path from 'node:path';

const ENDPOINT = 'https://tradestat.commerce.gov.in/ftspcc/import_commodity_wise_all_countries';
const OUTPUT = path.resolve('data/india_petroleum_crude_country_mix.json');
const YEARS = [2022, 2023, 2024, 2025, 2026];

function cleanCell(value) {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function parseNumber(value) {
  const cleaned = value.replace(/,/g, '').trim();
  if (!cleaned || cleaned === '-') return 0;
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : 0;
}

function parseRows(html, reportType) {
  const body = html.match(/<tbody>([\s\S]*?)<\/tbody>/i)?.[1];
  if (!body) throw new Error('Country table was not found in the TradeStat response.');

  const rows = [...body.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)]
    .map((rowMatch) =>
      [...rowMatch[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((cell) => cleanCell(cell[1])),
    )
    .filter((cells) => cells[1]);

  if (reportType === 'quantity') {
    return rows
      .filter((cells) => cells.length >= 8)
      .map((cells) => ({ country: cells[1], quantityTons: parseNumber(cells[6]) }))
      .filter((row) => row.quantityTons > 0);
  }

  return rows
    .filter((cells) => cells.length >= 12)
    .map((cells) => ({
      country: cells[1],
      valueUsdMillion: parseNumber(cells[9]),
      sharePct: parseNumber(cells[10]),
    }))
    .filter((row) => row.valueUsdMillion > 0);
}

async function fetchReport(year, reportType) {
  const formResponse = await fetch(ENDPOINT);
  if (!formResponse.ok) throw new Error(`TradeStat form request failed: ${formResponse.status}`);

  const formHtml = await formResponse.text();
  const token = formHtml.match(/name="_token" value="([^"]+)"/)?.[1];
  const cookie = formResponse.headers.get('set-cookie')?.split(';')[0];
  if (!token || !cookie) throw new Error('TradeStat session token or cookie was not found.');

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      cookie,
    },
    body: new URLSearchParams({
      _token: token,
      MonthAci: '3',
      YearAci: String(year),
      PCommodityAci: 'S5',
      ReportValAci: reportType === 'quantity' ? '3' : '2',
    }),
  });

  if (!response.ok) throw new Error(`TradeStat data request failed: ${response.status}`);
  return parseRows(await response.text(), reportType);
}

const series = [];
for (const year of YEARS) {
  const [valueRows, quantityRows] = await Promise.all([
    fetchReport(year, 'value'),
    fetchReport(year, 'quantity'),
  ]);
  const quantities = new Map(quantityRows.map((item) => [item.country, item.quantityTons]));
  const totalQuantityTons = quantityRows.reduce((sum, item) => sum + item.quantityTons, 0);
  const countries = valueRows
    .map((item) => {
      const quantityTons = quantities.get(item.country) || 0;
      return {
        ...item,
        quantityTons,
        quantitySharePct: totalQuantityTons ? (quantityTons / totalQuantityTons) * 100 : 0,
        unitValueUsdPerTon: quantityTons ? (item.valueUsdMillion * 1_000_000) / quantityTons : 0,
      };
    })
    .sort((a, b) => b.valueUsdMillion - a.valueUsdMillion);
  const totalUsdMillion = countries.reduce((sum, item) => sum + item.valueUsdMillion, 0);
  series.push({
    fiscalYear: `FY${String(year - 1).slice(-2)}-${String(year).slice(-2)}`,
    yearEnding: year,
    provisional: year === Math.max(...YEARS),
    totalUsdMillion: Number(totalUsdMillion.toFixed(2)),
    totalQuantityTons: Math.round(totalQuantityTons),
    countries,
  });
}

const output = {
  title: 'India petroleum crude imports by source country',
  commodity: { code: 'S5', label: 'PETROLEUM: CRUDE' },
  units: { value: 'US$ million', quantity: 'tonnes', unitValue: 'US$ per tonne' },
  source: ENDPOINT,
  retrievedAt: new Date().toISOString(),
  note: 'March selections report full April–March fiscal-year values. Value shares are supplied by TradeStat; quantity shares and unit values are derived. The latest year is provisional.',
  series,
};

await fs.writeFile(OUTPUT, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote ${OUTPUT}`);
