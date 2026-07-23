import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), '..');
const OUT_FILE = path.join(root, 'data/enrichment/product_quantity_unit_value.csv');

const targetHscodes = ['2709', '3102', '3105', '7108', '2601'];

const importRows = JSON.parse(
  fs.readFileSync(path.join(root, 'data/india_trade_hs4_world_import_5fy.json'), 'utf8'),
).filter((r) => r.HSCODE && r.HSDESC);

const importsByCode = new Map(importRows.map((row) => [String(row.HSCODE).padStart(4, '0'), row]));

let existingRows = [];
try {
  const content = fs.readFileSync(OUT_FILE, 'utf8');
  existingRows = content.split('\n').filter((r) => r.trim());
} catch (e) {
  existingRows = [
    'hscode,flow,base_year,base_value_usd,base_quantity,current_year,current_value_usd,current_quantity,quantity_unit,decomposition_method,source_url,source_date',
  ];
}

const existingHeader = existingRows[0];
const existingData = existingRows.slice(1);
const covered = new Set(existingData.map((r) => r.split(',')[0]));

const newCsvRows = [];

for (const hs of targetHscodes) {
  if (covered.has(hs)) continue;
  const imp = importsByCode.get(hs);
  if (!imp) continue;

  const baseVal = Number(imp['VAL_USD_2021']) || 0;
  const currentVal = Number(imp['VAL_USD_2025']) || 0;

  // Create row with values but empty quantities
  newCsvRows.push(
    `${hs},import,2020-21,${baseVal * 1000000},,2025-26,${currentVal * 1000000},,unavailable,Logarithmic Mean Divisia Index (LMDI),https://eidb.dgft.gov.in/,2026-06-15`,
  );
}

const finalRows = [existingHeader, ...existingData, ...newCsvRows];
fs.writeFileSync(OUT_FILE, finalRows.join('\n') + '\n');
console.log(`Added ${newCsvRows.length} blank quantity rows. Total rows: ${finalRows.length - 1}`);
