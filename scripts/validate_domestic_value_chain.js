import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(
  fs.readFileSync(path.join(root, 'data/domestic_value_chain_opportunities.json'), 'utf8'),
);
const stageData = JSON.parse(
  fs.readFileSync(path.join(root, 'data/product_stage_mix.json'), 'utf8'),
);
const productCodes = new Set(stageData.products.map((product) => product.hscode));
const allowedAvailability = new Set([
  'available',
  'emerging',
  'limited',
  'not_available',
  'unknown',
]);
const machineryHsCodes = new Set(['8414', '8421', '8428', '8477', '8480', '8482']);
const qualitativeInputs = new Set([
  '8501',
  '7208',
  '8482',
  '8481',
  '7326',
  '8413',
  '8537',
  '8483',
  '7218',
  '8480',
  '8466',
]);
const failures = [];
const keys = new Set();

function check(condition, message) {
  if (!condition) failures.push(message);
}

check(
  data.products.length === data.metadata.totalEndProductLines,
  'End-product count matches metadata',
);
check(
  data.products.filter((product) => product.links.length).length ===
    data.metadata.mappedEndProductLines,
  'Mapped end-product count matches metadata',
);
check(
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(data.metadata.generatedAt),
  'Metadata generatedAt is a valid ISO timestamp',
);

const industrialMachineryLinksCount = data.products
  .filter((p) => machineryHsCodes.has(p.hscode))
  .reduce((sum, p) => sum + p.links.length, 0);
check(
  industrialMachineryLinksCount === 21,
  `Expected 21 industrial machinery links, found ${industrialMachineryLinksCount}`,
);

for (const product of data.products) {
  check(productCodes.has(product.hscode), `End product ${product.hscode} exists in stage data`);
  check(
    ['finished product', 'capital good', 'consumption asset'].includes(product.productionStage),
    `End product ${product.hscode} is in the declared end-product scope`,
  );
  check(
    product.monetaryImpactStatus.startsWith('suppressed'),
    `End product ${product.hscode} does not claim unsupported monetary impact`,
  );

  if (product.links.length) {
    check(
      product.evidenceStatus === 'insufficient evidence',
      `Mapped product ${product.hscode} must maintain evidenceStatus 'insufficient evidence'`,
    );
    check(
      product.strategicFrame === 'map critical inputs before assessment',
      `Mapped product ${product.hscode} must maintain strategicFrame 'map critical inputs before assessment'`,
    );
  }

  for (const link of product.links) {
    const key = `${product.hscode}|${link.inputHscode}|${link.inputRole}`;
    check(!keys.has(key), `Value-chain link ${key} is unique`);
    keys.add(key);
    check(productCodes.has(link.inputHscode), `Input ${link.inputHscode} exists in stage data`);
    check(
      allowedAvailability.has(link.domesticAvailability),
      `Link ${key} has a controlled domestic-availability status`,
    );
    check(link.evidenceGrade === 'E1', `Link ${key} must have evidenceGrade E1`);
    check(
      link.domesticAvailability === 'unknown',
      `Link ${key} must have domesticAvailability unknown`,
    );
    check(link.timeHorizon === 'not assessed', `Link ${key} must have timeHorizon not assessed`);
    check(/^https?:\/\//.test(link.sourceUrl), `Link ${key} has a source URL`);
    check(/^\d{4}-\d{2}-\d{2}$/.test(link.sourceDate), `Link ${key} has an ISO source date`);
    check(Boolean(link.conversionGap), `Link ${key} identifies the missing conversion step`);
    check(
      link.domesticSupply && link.domesticSupply.sourceUrl,
      `Link ${key} joins product-level domestic-supply evidence`,
    );
    if (qualitativeInputs.has(link.inputHscode)) {
      check(
        link.domesticSupply && link.domesticSupply.analystLocalisableSharePct === null,
        `Industrial input ${link.inputHscode} in link ${key} must have null analystLocalisableSharePct`,
      );
    }
  }
}

check(keys.size === 25, `Expected 25 curated links, found ${keys.size}`);

if (failures.length) {
  console.error(`Value-chain validation failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Value-chain validation passed: ${data.products.length} end-product lines, ${keys.size} curated links.`,
);
