import fs from 'fs';
import path from 'path';

const policyPath = path.join(process.cwd(), 'data/enrichment/product_policy.csv');
let policyCsv = fs.readFileSync(policyPath, 'utf8');

const newRows = `8473,Parts for ADP machines,Tariff Adjustment,2025-02-01,2026-02-01,https://www.cbic.gov.in,2026-02-01,Active
8536,Electrical switching apparatus,Tariff Adjustment,2025-02-01,2026-02-01,https://www.cbic.gov.in,2026-02-01,Active
`;

fs.writeFileSync(policyPath, policyCsv + newRows);
console.log('Appended missing baseline rows to product_policy.csv');
