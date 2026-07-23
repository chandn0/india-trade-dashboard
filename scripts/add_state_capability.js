import fs from 'fs';
import path from 'path';

const buildPath = path.join(process.cwd(), 'scripts/build_product_stage_mix.js');
let buildContent = fs.readFileSync(buildPath, 'utf8');

const targetImport = `const quantityRows = parseCsv(`;
const replacementImport = `const stateCapabilityRows = parseCsv(
  fs.readFileSync(path.join(root, 'data/enrichment/state_capability.csv'), 'utf8'),
);
const stateCapabilityByCode = new Map();
for (const row of stateCapabilityRows) {
  const hs = row.hscode.padStart(4, '0');
  if (!stateCapabilityByCode.has(hs)) stateCapabilityByCode.set(hs, []);
  stateCapabilityByCode.get(hs).push({
    state: row.state,
    observedProductionUsdMn: row.observed_production_usd_mn ? Number(row.observed_production_usd_mn) : 0,
    announcedCapacityUsdMn: row.announced_capacity_usd_mn ? Number(row.announced_capacity_usd_mn) : 0,
    employment: row.employment ? Number(row.employment) : 0,
    investmentUsdMn: row.investment_usd_mn ? Number(row.investment_usd_mn) : 0,
    sourceUrl: row.source_url,
  });
}

const quantityRows = parseCsv(`;

buildContent = buildContent.replace(targetImport, replacementImport);

const targetMap = `quantityUnitValue: quantityByCode.has(hscode)`;
const replacementMap = `stateCapability: stateCapabilityByCode.get(hscode) ?? null,
    quantityUnitValue: quantityByCode.has(hscode)`;

buildContent = buildContent.replace(targetMap, replacementMap);

fs.writeFileSync(buildPath, buildContent);
console.log('Added stateCapability logic to build_product_stage_mix.js');
