import fs from 'fs';
import path from 'path';

const qtyPath = path.join(process.cwd(), 'data/enrichment/product_quantity_unit_value.csv');
let qtyCsv = fs.readFileSync(qtyPath, 'utf8').split('\n');
const header = qtyCsv[0];
const seen = new Set();
const deduplicated = [header];
for (let i = 1; i < qtyCsv.length; i++) {
  const line = qtyCsv[i].trim();
  if (!line) continue;
  const parts = line.split(',');
  const hscode = parts[0].replace(/"/g, '');
  const flow = parts[1].replace(/"/g, '');
  const fiscalYear = parts[2].replace(/"/g, '');
  const key = `${hscode}|${flow}|${fiscalYear}`;
  if (!seen.has(key)) {
    seen.add(key);
    deduplicated.push(line);
  }
}
fs.writeFileSync(qtyPath, deduplicated.join('\n') + '\n');
console.log(`Deduplicated product_quantity_unit_value.csv. Removed ${qtyCsv.length - deduplicated.length - 1} duplicates.`);
