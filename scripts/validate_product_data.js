import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const checks = [];
const tolerance = 0.02;

function check(condition, message) {
  if (condition) checks.push(message);
  else failures.push(message);
}

function near(left, right, allowed = tolerance) {
  return Number.isFinite(left) && Number.isFinite(right) && Math.abs(left - right) <= allowed;
}

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
      } else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field.replace(/\r$/, ''));
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = '';
    } else field += char;
  }
  if (field || row.length) rows.push([...row, field]);
  const [headers, ...body] = rows;
  return body.map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])),
  );
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function validateUnique(rows, keyFor, label) {
  const seen = new Set();
  const duplicates = new Set();
  for (const row of rows) {
    const key = keyFor(row);
    if (seen.has(key)) duplicates.add(key);
    seen.add(key);
  }
  check(duplicates.size === 0, `${label} has unique rows at its declared grain`);
  if (duplicates.size)
    failures.push(`${label} duplicate keys: ${[...duplicates].slice(0, 5).join(', ')}`);
}

const data = readJson('data/product_stage_mix.json');
const summary = readJson('data/product_stage_summary.json');
const discovery = readJson('data/product_discovery.json');
const products = data.products;
const allowedStages = new Set([
  'raw material',
  'intermediate input',
  'finished product',
  'capital good',
  'energy input',
  'agricultural commodity',
  'consumption asset',
]);

check(Array.isArray(products) && products.length > 0, 'Full product index is non-empty');
check(
  products.length === data.metadata.totalUniqueHs4Products,
  'Metadata product count matches the product index',
);
validateUnique(products, (product) => product.hscode, 'Full product index');

for (const product of products) {
  check(/^\d{4}$/.test(product.hscode), `HS ${product.hscode} uses four-digit formatting`);
  check(
    allowedStages.has(product.productionStage),
    `HS ${product.hscode} has an allowed production stage`,
  );
  check(Boolean(product.attributionReason), `HS ${product.hscode} has an attribution rationale`);
  check(Boolean(product.classificationMethod), `HS ${product.hscode} has a classification method`);
  check(
    Number.isInteger(product.confidence) && product.confidence >= 1 && product.confidence <= 5,
    `HS ${product.hscode} confidence is 1–5`,
  );
  check(
    ['manually-assigned', 'needs review', 'mixed-use'].includes(product.reviewStatus),
    `HS ${product.hscode} has a valid review status`,
  );
  if (product.classificationMethod === 'curated HS-4') {
    check(Boolean(product.reviewer), `Curated HS ${product.hscode} has a reviewer`);
    check(
      /^\d{4}-\d{2}-\d{2}$/.test(product.reviewDate),
      `Curated HS ${product.hscode} has an ISO review date`,
    );
    check(
      Boolean(product.dominantUseRationale),
      `Curated HS ${product.hscode} has a dominant-use rationale`,
    );
    check(
      typeof product.mixedUseFlag === 'boolean',
      `Curated HS ${product.hscode} has a boolean mixed-use flag`,
    );
    check(
      typeof product.evidenceNote === 'string' && product.evidenceNote.trim().length > 0,
      `Curated HS ${product.hscode} has a non-empty evidence note string`,
    );
  }
  for (const [flow, history] of [
    ['imports', product.importHistory],
    ['exports', product.exportHistory],
  ]) {
    check(
      Array.isArray(history) && history.length === data.metadata.years.length,
      `HS ${product.hscode} has ${data.metadata.years.length} ${flow} observations`,
    );
    check(
      history.every((value) => Number.isFinite(value) && value >= 0),
      `HS ${product.hscode} ${flow} observations are finite and non-negative`,
    );
  }
  check(
    near(product.latestImportUsdMn, product.importHistory.at(-1)),
    `HS ${product.hscode} latest import matches history`,
  );
  check(
    near(product.latestExportUsdMn, product.exportHistory.at(-1)),
    `HS ${product.hscode} latest export matches history`,
  );
  check(
    near(product.netBalanceUsdMn, product.latestExportUsdMn - product.latestImportUsdMn),
    `HS ${product.hscode} net sign is exports minus imports`,
  );
}

for (const flow of data.flows) {
  const valueKey = flow.flow === 'Imports' ? 'latestImportUsdMn' : 'latestExportUsdMn';
  const targetCoveragePct = flow.flow === 'Imports' ? 85.0 : 80.0;
  const productTotal = products.reduce((sum, product) => sum + product[valueKey], 0);
  const stageTotal = flow.stages.reduce((sum, stage) => sum + stage.valueUsdMn, 0);
  const topTotal = flow.products.reduce((sum, product) => sum + product.valueUsdMn, 0);
  check(near(flow.totalUsdMn, productTotal), `${flow.flow} full total reconciles to products`);
  check(near(flow.totalUsdMn, stageTotal), `${flow.flow} stage total reconciles to products`);
  check(near(flow.topBasketUsdMn, topTotal), `${flow.flow} top-basket total reconciles`);
  check(
    flow.products.length === data.metadata.topProductsPerFlow,
    `${flow.flow} preview contains the configured top product count`,
  );
  check(
    near(flow.coveragePct, (flow.topBasketUsdMn / flow.totalUsdMn) * 100, 0.0001),
    `${flow.flow} top-basket coverage is correct`,
  );
  check(
    flow.curatedCoveragePct >= targetCoveragePct,
    `${flow.flow} curated value coverage (${flow.curatedCoveragePct.toFixed(2)}%) meets target (>=${targetCoveragePct}%)`,
  );
}

const imports = data.flows.find((flow) => flow.flow === 'Imports');
const exports = data.flows.find((flow) => flow.flow === 'Exports');
const stageNet = data.stageBalances.reduce((sum, stage) => sum + stage.netBalanceUsdMn, 0);
check(
  near(stageNet, exports.totalUsdMn - imports.totalUsdMn),
  'Stage balances reconcile to the full merchandise balance',
);

check(
  JSON.stringify(summary.metadata) === JSON.stringify(data.metadata),
  'Summary and full datasets share identical metadata',
);
check(!Object.hasOwn(summary, 'products'), 'Summary dataset omits the full product index');
check(
  JSON.stringify(summary.flows) === JSON.stringify(data.flows),
  'Summary and full datasets share identical flow summaries',
);

for (const product of discovery.products) {
  check(
    near(product.netDeficitUsdMn, Math.max(0, product.importUsdMn - product.exportUsdMn)),
    `Buildability HS ${product.hscode} net deficit is imports minus exports`,
  );
  check(
    product.realisticNetImpactLowUsdMn <= product.realisticNetImpactHighUsdMn,
    `Buildability HS ${product.hscode} scenario range is ordered`,
  );
  check(
    product.realisticNetImpactHighUsdMn <= product.netDeficitUsdMn + tolerance,
    `Buildability HS ${product.hscode} high scenario does not exceed net deficit`,
  );
}

const scenarioFixture = {
  imports: 1000,
  exports: 200,
  substitutionPct: 20,
  exportGrowthPct: 10,
  importedInputPct: 25,
  realisationPct: 50,
};
const fixtureImportReduction = scenarioFixture.imports * (scenarioFixture.substitutionPct / 100);
const fixtureExportGain = scenarioFixture.exports * (scenarioFixture.exportGrowthPct / 100);
const fixtureImportedInputs =
  (fixtureImportReduction + fixtureExportGain) * (scenarioFixture.importedInputPct / 100);
const fixtureNet =
  (fixtureImportReduction + fixtureExportGain - fixtureImportedInputs) *
  (scenarioFixture.realisationPct / 100);
check(near(fixtureNet, 82.5), 'Scenario fixture produces the expected gross-to-net result');

const contractSpecs = [
  [
    'data/enrichment/product_quantity_unit_value.csv',
    (row) => `${row.hscode}|${row.flow}|${row.fiscal_year}`,
  ],
  ['data/enrichment/product_domestic_supply.csv', (row) => `${row.hscode}|${row.fiscal_year}`],
  ['data/enrichment/product_policy.csv', (row) => `${row.hscode}|${row.exact_affected_scope}`],
  [
    'data/enrichment/state_product_capability.csv',
    (row) => `${row.state}|${row.hscode}|${row.fiscal_year}`,
  ],
];

for (const [relativePath, keyFor] of contractSpecs) {
  const rows = parseCsv(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  validateUnique(rows, keyFor, relativePath);
  for (const row of rows)
    check(/^\d{4}$/.test(row.hscode), `${relativePath} row has a four-digit HS code`);
}

const classificationRows = parseCsv(
  fs.readFileSync(path.join(root, 'data/product_stage_classification.csv'), 'utf8'),
);
validateUnique(classificationRows, (row) => row.hscode, 'data/product_stage_classification.csv');
for (const row of classificationRows) {
  check(/^\d{4}$/.test(row.hscode), `Classification CSV row has a four-digit HS code`);
  check(
    allowedStages.has(row.production_stage),
    `Classification CSV HS ${row.hscode} has an allowed stage`,
  );
  check(
    Boolean(row.attribution_reason?.trim()),
    `Classification CSV HS ${row.hscode} has an attribution reason`,
  );
  check(Boolean(row.reviewer?.trim()), `Classification CSV HS ${row.hscode} has a reviewer`);
  check(
    /^\d{4}-\d{2}-\d{2}$/.test(row.review_date),
    `Classification CSV HS ${row.hscode} has an ISO review date`,
  );
  check(
    ['1', '2', '3', '4', '5'].includes(row.confidence),
    `Classification CSV HS ${row.hscode} has confidence 1-5`,
  );
  check(
    Boolean(row.dominant_use_rationale?.trim()),
    `Classification CSV HS ${row.hscode} has a dominant-use rationale`,
  );
  check(
    ['true', 'false'].includes(row.mixed_use_flag),
    `Classification CSV HS ${row.hscode} has mixed_use_flag true/false`,
  );
  check(
    Boolean(row.evidence_note?.trim()),
    `Classification CSV HS ${row.hscode} has an evidence note string`,
  );
}

// Removed product_partner_hs4.csv validation

const supplyEnrichmentRows = parseCsv(
  fs.readFileSync(path.join(root, 'data/enrichment/product_domestic_supply.csv'), 'utf8'),
);
for (const row of supplyEnrichmentRows) {
  const colCount = Object.keys(row).length;
  check(
    colCount === 13,
    `product_domestic_supply.csv row HS ${row.hscode} has incorrect column count: ${colCount} != 13`,
  );
  check(
    Boolean(row.source_url?.trim()) && row.source_url.startsWith('http'),
    `product_domestic_supply.csv row HS ${row.hscode} has invalid source_url`,
  );
  check(
    /^\d{4}-\d{2}-\d{2}$/.test(row.source_date),
    `product_domestic_supply.csv row HS ${row.hscode} has invalid ISO source_date`,
  );
  check(
    Boolean(row.evidence_note?.trim()),
    `product_domestic_supply.csv row HS ${row.hscode} is missing evidence_note`,
  );
}

const policyEnrichmentRows = parseCsv(
  fs.readFileSync(path.join(root, 'data/enrichment/product_policy.csv'), 'utf8'),
);
for (const row of policyEnrichmentRows) {
  const colCount = Object.keys(row).length;
  check(
    colCount === 8,
    `product_policy.csv row HS ${row.hscode} has incorrect column count: ${colCount} != 8`,
  );
  check(
    Boolean(row.primary_source?.trim()) && row.primary_source.startsWith('http'),
    `product_policy.csv row HS ${row.hscode} has invalid primary_source`,
  );
  check(
    /^\d{4}-\d{2}-\d{2}$/.test(row.last_verification_date),
    `product_policy.csv row HS ${row.hscode} has invalid ISO last_verification_date`,
  );
  check(
    Boolean(row.measure_type?.trim()),
    `product_policy.csv row HS ${row.hscode} is missing measure_type`,
  );
}

const quantityEnrichmentRows = parseCsv(
  fs.readFileSync(path.join(root, 'data/enrichment/product_quantity_unit_value.csv'), 'utf8'),
);
for (const row of quantityEnrichmentRows) {
  if (row.current_quantity && row.current_value_usd) {
    const q = Number(row.current_quantity);
    const v = Number(row.current_value_usd);
    check(
      q > 0,
      `product_quantity_unit_value.csv row HS ${row.hscode} has invalid current_quantity`,
    );
    check(
      v > 0,
      `product_quantity_unit_value.csv row HS ${row.hscode} has invalid current_value_usd`,
    );
    check(
      row.base_year,
      `product_quantity_unit_value.csv row HS ${row.hscode} is missing base_year`,
    );
  }
}

// Additional Generated Data Checks
for (const p of discovery.products) {
  if (p.opportunityScore !== undefined) {
    check(
      p.opportunityScore !== null && Number.isFinite(p.opportunityScore),
      `Opportunity score for ${p.hscode} is null or infinite`,
    );
  }
}

for (const p of products) {
  for (const flow of ['imports', 'exports']) {
    if (p.productPartnerExposure?.[flow]) {
      const exp = p.productPartnerExposure[flow];
      const totalShare =
        (exp.topPartnerSharePct || 0) +
        (exp.secondPartnerSharePct || 0) +
        (exp.thirdPartnerSharePct || 0);
      check(totalShare <= 100, `HS ${p.hscode} ${flow} partner share exceeds 100%`);
    }
  }
  if (p.policyOverlay) {
    if (p.policyOverlay.expiryReviewDate) {
      check(
        !isNaN(new Date(p.policyOverlay.expiryReviewDate).getTime()),
        `HS ${p.hscode} has invalid policy expiry date`,
      );
    }
  }
  if (p.quantityUnitValue?.imports) {
    const qty = p.quantityUnitValue.imports;
    if (qty.quantityEffectUsd !== null && qty.priceEffectUsd !== null) {
      const deltaV = qty.currentValueUsd - qty.baseValueUsd;
      const sumEffects = qty.quantityEffectUsd + qty.priceEffectUsd + qty.residualEffectUsd;
      check(
        near(deltaV, sumEffects),
        `HS ${p.hscode} import quantity decomposition does not sum to deltaV`,
      );
    }
  }
}

const clearedPreviewCodes = new Set([
  '8517',
  '8507',
  '8542',
  '8541',
  '8471',
  '8414',
  '8421',
  '8428',
  '8477',
  '8480',
  '8482',
]);
for (const p of products) {
  if (clearedPreviewCodes.has(p.hscode)) {
    check(
      p.domesticSupply?.analystLocalisableSharePct == null,
      `Preview product HS ${p.hscode} must have null analystLocalisableSharePct`,
    );
  }
}

if (failures.length) {
  console.error(`Product-data validation failed with ${failures.length} issue(s):`);
  for (const failure of [...new Set(failures)]) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Product-data validation passed (${checks.length.toLocaleString()} assertions, ${products.length.toLocaleString()} products).`,
);
