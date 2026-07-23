import fs from 'fs';
import path from 'path';

const valPath = path.join(process.cwd(), 'scripts/validate_product_data.js');
let valContent = fs.readFileSync(valPath, 'utf8');

// 1. Update unique keys definition
const targetUnique = `['data/enrichment/product_policy.csv', (row) => \`\${row.hscode}|\${row.effective_from}\`],`;
const replacementUnique = `['data/enrichment/product_policy.csv', (row) => \`\${row.hscode}|\${row.exact_affected_scope}\`],`;
valContent = valContent.replace(targetUnique, replacementUnique);

// 2. Update policy checks
const targetPolicyCheck = `const policyEnrichmentRows = parseCsv(
  fs.readFileSync(path.join(root, 'data/enrichment/product_policy.csv'), 'utf8'),
);
for (const row of policyEnrichmentRows) {
  const colCount = Object.keys(row).length;
  check(colCount === 14, \`product_policy.csv row HS \${row.hscode} has incorrect column count: \${colCount} != 14\`);
  check(
    Boolean(row.source_url?.trim()) && row.source_url.startsWith('http'),
    \`product_policy.csv row HS \${row.hscode} has invalid source_url\`,
  );
  check(
    /^\\d{4}-\\d{2}-\\d{2}$/.test(row.source_date),
    \`product_policy.csv row HS \${row.hscode} has invalid ISO source_date\`,
  );
  check(
    Boolean(row.evidence_note?.trim()),
    \`product_policy.csv row HS \${row.hscode} is missing evidence_note\`,
  );
}`;

const replacementPolicyCheck = `const policyEnrichmentRows = parseCsv(
  fs.readFileSync(path.join(root, 'data/enrichment/product_policy.csv'), 'utf8'),
);
for (const row of policyEnrichmentRows) {
  const colCount = Object.keys(row).length;
  check(colCount === 8, \`product_policy.csv row HS \${row.hscode} has incorrect column count: \${colCount} != 8\`);
  check(
    Boolean(row.primary_source?.trim()) && row.primary_source.startsWith('http'),
    \`product_policy.csv row HS \${row.hscode} has invalid primary_source\`,
  );
  check(
    /^\\d{4}-\\d{2}-\\d{2}$/.test(row.last_verification_date),
    \`product_policy.csv row HS \${row.hscode} has invalid ISO last_verification_date\`,
  );
  check(
    Boolean(row.measure_type?.trim()),
    \`product_policy.csv row HS \${row.hscode} is missing measure_type\`,
  );
}`;

valContent = valContent.replace(targetPolicyCheck, replacementPolicyCheck);

fs.writeFileSync(valPath, valContent);
console.log('Updated validation script for policy schema.');

// 3. Remove duplicates from product_quantity_unit_value.csv
const qtyPath = path.join(process.cwd(), 'data/enrichment/product_quantity_unit_value.csv');
let qtyCsv = fs.readFileSync(qtyPath, 'utf8').split('\n');
const header = qtyCsv[0];
const seen = new Set();
const deduplicated = [header];
for (let i = 1; i < qtyCsv.length; i++) {
  const line = qtyCsv[i].trim();
  if (!line) continue;
  const parts = line.split(',');
  const key = `${parts[0]}|${parts[1]}|${parts[2]}`; // hscode|flow|fiscal_year
  if (!seen.has(key)) {
    seen.add(key);
    deduplicated.push(line);
  }
}
fs.writeFileSync(qtyPath, deduplicated.join('\n') + '\n');
console.log(`Deduplicated product_quantity_unit_value.csv. Removed ${qtyCsv.length - deduplicated.length - 1} duplicates.`);
