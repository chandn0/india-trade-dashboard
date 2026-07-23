import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), '..');

const OUT_FILE = path.join(root, 'data/enrichment/product_partner_exposure.csv');

// Load 5-year trade data to identify top 100 deficit products
const importRows = JSON.parse(
  fs.readFileSync(path.join(root, 'data/india_trade_hs4_world_import_5fy.json'), 'utf8'),
).filter((r) => r.HSCODE && r.HSDESC);
const exportRows = JSON.parse(
  fs.readFileSync(path.join(root, 'data/india_trade_hs4_world_export_5fy.json'), 'utf8'),
).filter((r) => r.HSCODE && r.HSDESC);

const importsByCode = new Map(importRows.map((row) => [String(row.HSCODE).padStart(4, '0'), row]));
const exportsByCode = new Map(exportRows.map((row) => [String(row.HSCODE).padStart(4, '0'), row]));
const codes = [...new Set([...importsByCode.keys(), ...exportsByCode.keys()])].sort();

const latestYearKey = 'VAL_USD_2025';

const productStats = codes.map((hscode) => {
  const imp = importsByCode.get(hscode) ? Number(importsByCode.get(hscode)[latestYearKey]) || 0 : 0;
  const exp = exportsByCode.get(hscode) ? Number(exportsByCode.get(hscode)[latestYearKey]) || 0 : 0;
  const deficit = imp - exp;
  return { hscode, imp, exp, deficit };
});

// Calculate total net deficit of all products
const totalDeficit = productStats.reduce((sum, p) => (p.deficit > 0 ? sum + p.deficit : sum), 0);

// Sort by deficit
const topDeficit = [...productStats].sort((a, b) => b.deficit - a.deficit);

let cumulativeDeficit = 0;
const targetHscodes = new Set();
for (const p of topDeficit) {
  if (p.deficit > 0) {
    cumulativeDeficit += p.deficit;
    targetHscodes.add(p.hscode);
    if (cumulativeDeficit / totalDeficit >= 0.7) {
      break;
    }
  }
}

// Add top 100 exports as well
const topExport = [...productStats].sort((a, b) => b.exp - a.exp).slice(0, 100);
topExport.forEach((p) => targetHscodes.add(p.hscode));

// Load partner mapping data
const partnerData = JSON.parse(
  fs.readFileSync(path.join(root, 'data/india_trade_partner_top_products.json'), 'utf8'),
);

const fiscalYear = partnerData.fiscal_year; // e.g. "2025-2026"
const formattedFy = fiscalYear.slice(0, 5) + fiscalYear.slice(7);

// Preserve existing manual pilot rows if any
let existingRows = [];
try {
  const content = fs.readFileSync(OUT_FILE, 'utf8');
  existingRows = content.split('\n').filter((r) => r.trim());
} catch (e) {
  existingRows = [
    'hscode,flow,fiscal_year,grain,top_partner,top_partner_share_pct,second_partner,second_partner_share_pct,third_partner,third_partner_share_pct,exposure_note,source_url,source_date',
  ];
}
const existingHeader = existingRows[0];
const existingData = existingRows.slice(1);

const manualHscodes = new Set();
existingData.forEach((row) => {
  const match = row.match(/^"?(\d{4})"?/);
  if (match) manualHscodes.add(match[1]);
});

const newCsvRows = [];

for (const hscode of targetHscodes) {
  if (manualHscodes.has(hscode)) continue;

  const hs2 = hscode.slice(0, 2);

  // Find all partners importing/exporting this hs2
  const hs2Imports = [];
  const hs2Exports = [];

  for (const partner of partnerData.partners) {
    const country = partner.country;

    if (partner.imports && partner.imports.top_chapters) {
      const impChapter = partner.imports.top_chapters.find((c) => c.hs2 === hs2);
      if (impChapter) {
        hs2Imports.push({ country, val: impChapter.value_usd_mn });
      }
    }

    if (partner.exports && partner.exports.top_chapters) {
      const expChapter = partner.exports.top_chapters.find((c) => c.hs2 === hs2);
      if (expChapter) {
        hs2Exports.push({ country, val: expChapter.value_usd_mn });
      }
    }
  }

  // Helper to format top 3
  const formatTop3 = (arr, flowStr) => {
    if (arr.length === 0) return null;
    arr.sort((a, b) => b.val - a.val);
    const total = arr.reduce((sum, p) => sum + p.val, 0);
    const top = arr[0] || { country: '', val: 0 };
    const second = arr[1] || { country: '', val: 0 };
    const third = arr[2] || { country: '', val: 0 };

    const p1 = top.val > 0 ? ((top.val / total) * 100).toFixed(1) : '';
    const p2 = second.val > 0 ? ((second.val / total) * 100).toFixed(1) : '';
    const p3 = third.val > 0 ? ((third.val / total) * 100).toFixed(1) : '';

    const note = `Chapter ${hs2} proxy data. Calculated from top 10 chapters of 12 major partners.`;
    return `"${hscode}","${flowStr}","${formattedFy}","chapter_proxy","${top.country}","${p1}","${second.country}","${p2}","${third.country}","${p3}","${note}","${partnerData.source_urls[flowStr === 'import' ? 'imports' : 'exports']}","2026-06-10"`;
  };

  const impRow = formatTop3(hs2Imports, 'import');
  const expRow = formatTop3(hs2Exports, 'export');

  if (impRow) newCsvRows.push(impRow);
  if (expRow) newCsvRows.push(expRow);
}

const finalRows = [existingHeader, ...existingData, ...newCsvRows];
fs.writeFileSync(OUT_FILE, finalRows.join('\n') + '\n');

console.log(
  `Generated partner data for top products (>= 70% deficit & top 100 exports). CSV now has ${finalRows.length - 1} rows.`,
);
