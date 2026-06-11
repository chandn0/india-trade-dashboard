// Builds data/india_trade_country_slim.json from india_trade_country_distribution.json.
// The raw distribution file is ~2.7MB (per-row previous-year duplicates, 3.7k rows); the
// dashboard only needs one aligned export/import series per country plus the yearly totals,
// which lands around 150KB. Re-run after refreshing the distribution file:
//   node scripts/build_country_slim.js
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = JSON.parse(readFileSync(join(root, 'data', 'india_trade_country_distribution.json'), 'utf8'));

const years = [...new Set(src.rows.map((r) => r.fiscal_year))].sort();
const yearIndex = new Map(years.map((y, i) => [y, i]));

const byCountry = new Map();
for (const row of src.rows) {
  const name = row.country;
  if (!byCountry.has(name)) {
    byCountry.set(name, { name, exp: years.map(() => 0), imp: years.map(() => 0) });
  }
  const entry = byCountry.get(name);
  const i = yearIndex.get(row.fiscal_year);
  entry.exp[i] = Math.round((row.export_usd_mn ?? 0) * 100) / 100;
  entry.imp[i] = Math.round((row.import_usd_mn ?? 0) * 100) / 100;
}

const last = years.length - 1;
const countries = [...byCountry.values()].sort(
  (a, b) => (b.exp[last] + b.imp[last]) - (a.exp[last] + a.imp[last]),
);

const totalsByYear = new Map(src.yearly_totals.map((t) => [t.fiscal_year, t]));
const totals = {
  exp: years.map((y) => Math.round((totalsByYear.get(y)?.export_usd_mn ?? 0) * 100) / 100),
  imp: years.map((y) => Math.round((totalsByYear.get(y)?.import_usd_mn ?? 0) * 100) / 100),
};

const out = {
  source_update_note: src.source_update_note,
  source_url: src.source_url,
  years,
  totals,
  countries,
};

const dest = join(root, 'data', 'india_trade_country_slim.json');
writeFileSync(dest, JSON.stringify(out));
console.log(`wrote ${dest}: ${years.length} years, ${countries.length} countries`);
