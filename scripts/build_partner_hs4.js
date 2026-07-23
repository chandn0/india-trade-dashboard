import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), '..');

const OUT_FILE = path.join(root, 'data/enrichment/product_partner_hs4.csv');
const OLD_FILE_PATH = path.join(root, 'data/enrichment/product_partner_hs4.csv');

let existingRows = [];
try {
  const content = fs.readFileSync(OLD_FILE_PATH, 'utf8');
  existingRows = content.split('\n').filter(r => r.trim());
} catch (e) {
  existingRows = ['hscode,hs2_grain,country,flow,fiscal_year,value_usd_mn,share_pct,evidence_note,source_url,source_date'];
}
const existingHeader = existingRows[0];
const existingData = existingRows.slice(1);

// Build a Set of already-covered HS codes from existing rows
const coveredHscodes = new Set();
existingData.forEach(row => {
  const match = row.match(/^"?(\d{4})"?/);
  if (match) coveredHscodes.add(match[1]);
});

// Load the 5-year trade data to identify top 100 deficit and export products
const importRows = JSON.parse(fs.readFileSync(path.join(root, 'data/india_trade_hs4_world_import_5fy.json'), 'utf8'))
  .filter(r => r.HSCODE && r.HSDESC);
const exportRows = JSON.parse(fs.readFileSync(path.join(root, 'data/india_trade_hs4_world_export_5fy.json'), 'utf8'))
  .filter(r => r.HSCODE && r.HSDESC);

const importsByCode = new Map(importRows.map((row) => [String(row.HSCODE).padStart(4, '0'), row]));
const exportsByCode = new Map(exportRows.map((row) => [String(row.HSCODE).padStart(4, '0'), row]));
const codes = [...new Set([...importsByCode.keys(), ...exportsByCode.keys()])].sort();

// Find the latest year column
const latestYear = '2025'; 
const latestYearKey = `VAL_USD_${latestYear}`;

const productStats = codes.map(hscode => {
  const imp = importsByCode.get(hscode) ? Number(importsByCode.get(hscode)[latestYearKey]) || 0 : 0;
  const exp = exportsByCode.get(hscode) ? Number(exportsByCode.get(hscode)[latestYearKey]) || 0 : 0;
  const deficit = imp - exp;
  return { hscode, imp, exp, deficit };
});

// Top 100 deficit
const topDeficit = [...productStats].sort((a, b) => b.deficit - a.deficit).slice(0, 100);
// Top 100 export
const topExport = [...productStats].sort((a, b) => b.exp - a.exp).slice(0, 100);

const targetHscodes = new Set([...topDeficit.map(p => p.hscode), ...topExport.map(p => p.hscode)]);

// Load partner mapping data
const partnerData = JSON.parse(fs.readFileSync(path.join(root, 'data/india_trade_partner_top_products.json'), 'utf8'));

const fiscalYear = partnerData.fiscal_year; // e.g. "2025-2026"
const formattedFy = fiscalYear.slice(0, 5) + fiscalYear.slice(7);

const newCsvRows = [];

for (const hscode of targetHscodes) {
  if (coveredHscodes.has(hscode)) continue; // Skip if manually curated

  const hs2 = hscode.slice(0, 2);
  const hs2Grain = `HS-${hs2}`;

  // Find partner distribution for this HS2
  for (const partner of partnerData.partners) {
    const country = partner.country;
    
    // Check imports
    if (partner.imports && partner.imports.top_chapters) {
      const impChapter = partner.imports.top_chapters.find(c => c.hs2 === hs2);
      if (impChapter) {
        // sharePct is calculated against total_usd_mn of imports from that partner
        const sharePct = (impChapter.value_usd_mn / partner.imports.total_usd_mn) * 100;
        newCsvRows.push(`"${hscode}","${hs2Grain}","${country}","import","${formattedFy}","${impChapter.value_usd_mn}","${sharePct.toFixed(1)}","HS-2 chapter ${hs2} grain; HS-4 specific partner breakdown not separately published by EIDB.","https://eidb.dgft.gov.in/","2026-06-10"`);
      }
    }

    // Check exports
    if (partner.exports && partner.exports.top_chapters) {
      const expChapter = partner.exports.top_chapters.find(c => c.hs2 === hs2);
      if (expChapter) {
        const sharePct = (expChapter.value_usd_mn / partner.exports.total_usd_mn) * 100;
        newCsvRows.push(`"${hscode}","${hs2Grain}","${country}","export","${formattedFy}","${expChapter.value_usd_mn}","${sharePct.toFixed(1)}","HS-2 chapter ${hs2} grain; HS-4 specific partner breakdown not separately published by EIDB.","https://eidb.dgft.gov.in/","2026-06-10"`);
      }
    }
  }
}

const finalRows = [existingHeader, ...existingData, ...newCsvRows];
fs.writeFileSync(OUT_FILE, finalRows.join('\n') + '\n');

console.log(`Generated partner data for top products. CSV now has ${finalRows.length - 1} rows.`);
