import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const referenceRoot = path.resolve(root, '../india-trade-deficit');

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field.replace(/\r$/, ''));
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  const [headers, ...values] = rows;
  return values.map((valuesRow) =>
    Object.fromEntries(headers.map((header, index) => [header, valuesRow[index] ?? ''])),
  );
}

function readCsv(relativePath) {
  const localPath = path.join(root, relativePath);
  const referencePath = path.join(referenceRoot, relativePath);
  const sourcePath = fs.existsSync(localPath) ? localPath : referencePath;
  if (!fs.existsSync(sourcePath)) {
    throw new Error(
      `Missing ${relativePath}. Add a local snapshot or place india-trade-deficit beside this repo.`,
    );
  }
  return { rows: parseCsv(fs.readFileSync(sourcePath, 'utf8')), sourcePath };
}

const classification = readCsv('data/import_product_classification.csv');
const deficit = readCsv('derived/top_deficit_products.csv');
const dependence = readCsv('derived/hs4_import_dependence_index.csv');
const partner = readCsv('derived/partner_product_deficit.csv');

const deficitByCode = new Map(deficit.rows.map((row) => [row.hscode.padStart(4, '0'), row]));
const dependenceByCode = new Map(dependence.rows.map((row) => [row.hscode.padStart(4, '0'), row]));

const partnerByHs2 = new Map();
for (const row of partner.rows) {
  const hs2 = row.hs2.padStart(2, '0');
  const importValue = Number(row.import_usd_mn) || 0;
  if (!partnerByHs2.has(hs2)) partnerByHs2.set(hs2, []);
  partnerByHs2.get(hs2).push({ country: row.country, importUsdMn: importValue });
}
for (const rows of partnerByHs2.values()) rows.sort((a, b) => b.importUsdMn - a.importUsdMn);

const categoryWeight = {
  buildable: 1,
  'partly buildable': 0.78,
  growable: 0.68,
  recoverable: 0.88,
  substitutable: 0.58,
  'structurally imported': 0.25,
};

const products = classification.rows.map((row) => {
  const hscode = row.hscode.padStart(4, '0');
  const trade = deficitByCode.get(hscode);
  if (!trade) throw new Error(`No trade row found for classified HS ${hscode}`);
  const dependenceRow = dependenceByCode.get(hscode);
  const importUsdMn = Number(trade.import_usd_mn);
  const exportUsdMn = Number(trade.export_usd_mn);
  const netDeficitUsdMn = Math.max(0, importUsdMn - exportUsdMn);
  const lowPct = Number(row.realistic_reduction_low_pct);
  const highPct = Number(row.realistic_reduction_high_pct);
  const confidence = Number(row.confidence);
  const tractability = categoryWeight[row.buildability_category] ?? 0.5;

  return {
    hscode,
    description: trade.hsdesc.replace(/\s+/g, ' ').trim(),
    sector: row.sector,
    importType: row.import_type,
    importReason: row.import_reason,
    buildabilityCategory: row.buildability_category,
    bestLever: row.best_lever,
    timeHorizon: row.time_horizon,
    technologyComplexity: row.technology_complexity,
    inputDependency: row.input_dependency,
    domesticCapacityProxy: row.domestic_capacity_proxy,
    confidence,
    notes: row.notes,
    importUsdMn,
    exportUsdMn,
    netDeficitUsdMn,
    exportCoveragePct: dependenceRow
      ? Number(dependenceRow.export_coverage_pct)
      : importUsdMn
        ? (exportUsdMn / importUsdMn) * 100
        : 0,
    dependenceScore: dependenceRow ? Number(dependenceRow.dependence_score) : null,
    realisticReductionLowPct: lowPct,
    realisticReductionHighPct: highPct,
    realisticNetImpactLowUsdMn: netDeficitUsdMn * (lowPct / 100),
    realisticNetImpactHighUsdMn: netDeficitUsdMn * (highPct / 100),
    opportunityScores: {
      netDeficitRelevance: netDeficitUsdMn,
      technicallyAddressableShare: highPct,
      implementationFeasibility: tractability,
      timeAdjustedImpact: netDeficitUsdMn * (highPct / 100) * tractability * (confidence / 5),
    },
    countryExposure: (partnerByHs2.get(hscode.slice(0, 2)) ?? []).slice(0, 3),
  };
});

const maxScore = Math.max(
  ...products.map((product) =>
    product.opportunityScores ? product.opportunityScores.timeAdjustedImpact : 0,
  ),
);
for (const product of products) {
  product.opportunityScore = product.opportunityScores
    ? Math.round((product.opportunityScores.timeAdjustedImpact / maxScore) * 100)
    : null;
}
products.sort((a, b) => b.netDeficitUsdMn - a.netDeficitUsdMn);

const output = {
  metadata: {
    fiscalYear: '2025-2026',
    units: 'USD million',
    generatedAt: new Date().toISOString(),
    methodology:
      'Trade values are joined by HS-4. Net deficit equals imports minus exports. Realistic impact applies the curated scenario range to net deficit, not gross imports. Opportunity score combines high-case net impact, category tractability and confidence, normalized to 100.',
    sources: [
      'data/import_product_classification.csv',
      'derived/top_deficit_products.csv',
      'derived/hs4_import_dependence_index.csv',
      'derived/partner_product_deficit.csv',
    ],
  },
  products,
};

const outputPath = path.join(root, 'data/product_discovery.json');
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote ${products.length} classified products to ${path.relative(root, outputPath)}`);
