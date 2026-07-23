import fs from 'fs';
import path from 'path';

const root = process.cwd();

// 1. Truncate product_partner_exposure.csv
const partnerPath = path.join(root, 'data/enrichment/product_partner_exposure.csv');
const partnerLines = fs.readFileSync(partnerPath, 'utf8').split('\n');
// Keep header + 1511, 1507, 1512 (first 4 lines)
fs.writeFileSync(partnerPath, partnerLines.slice(0, 4).join('\n') + '\n');
console.log('Truncated product_partner_exposure.csv');

// 2. Truncate product_quantity_unit_value.csv
const qtyPath = path.join(root, 'data/enrichment/product_quantity_unit_value.csv');
const qtyLines = fs.readFileSync(qtyPath, 'utf8').split('\n');
// Keep first 9 lines (header + 8 lines)
fs.writeFileSync(qtyPath, qtyLines.slice(0, 10).join('\n') + '\n');
console.log('Truncated product_quantity_unit_value.csv');

// 3, 4, 6. Update product_domestic_supply.csv
const supplyPath = path.join(root, 'data/enrichment/product_domestic_supply.csv');
let supplyCsv = fs.readFileSync(supplyPath, 'utf8');

// For 1511, 1507, 1512: update localisable_share_pct to 43.7, replacement_imported_input_pct to 56.3
supplyCsv = supplyCsv.replace(/1511,2024-25,300000,metric_tonnes,9400000,3\.2,96\.8/g, '1511,2024-25,300000,metric_tonnes,9400000,43.7,56.3');
supplyCsv = supplyCsv.replace(/1507,2024-25,1800000,metric_tonnes,5400000,33\.4,66\.6/g, '1507,2024-25,1800000,metric_tonnes,5400000,43.7,56.3');
supplyCsv = supplyCsv.replace(/1512,2024-25,300000,metric_tonnes,3200000,9\.4,90\.6/g, '1512,2024-25,300000,metric_tonnes,3200000,43.7,56.3');

// Update 1511 evidence note
const old1511Note = `"Domestic oil palm cultivation is highly constrained by water requirements. The National Mission on Edible Oils - Oil Palm (NMEO-OP) targets 1M ha expansion, primarily in North East and Andaman, but gestation is 4-5 years and ecological concerns persist. Absolute substitution capped structurally."`;
const new1511Note = `"Domestic oil palm cultivation is highly constrained. The NMEO-OP targets a total production of 2.8 million MT by 2029-30 (an increase of ~2.42 million MT from the 2024-25 baseline of 0.38 million MT). Absolute substitution capped structurally."`;
supplyCsv = supplyCsv.replace(old1511Note, new1511Note);
// Also update the derivation_method to reflect the fix
supplyCsv = supplyCsv.replace(/"Analyst assumption based on NMEO-OP target \(max \+2\.8M MT = ~30% cap\)"/g, `"Analyst assumption based on NMEO-OP total target"`);

// Update 8507 evidence note
const old8507Note = `"ACC battery PLI approved for 50 GWh by 2028. Operational capacity approx 5-8 GWh by FY25. Dominant domestic players: Amara Raja, Exide (lead-acid near-100% domestic); lithium-ion cell manufacturing nascent. Import dependence for Li-ion cells approaches 95%."`;
const new8507Note = `"ACC battery PLI awarded for 40 GWh. Currently only 1 GWh installed by Ola (in pilot production). Domestic demand continues to be met largely through imports."`;
supplyCsv = supplyCsv.replace(old8507Note, new8507Note);

fs.writeFileSync(supplyPath, supplyCsv);
console.log('Updated product_domestic_supply.csv');

// 5. Update product_policy.csv
const policyPath = path.join(root, 'data/enrichment/product_policy.csv');
let policyLines = fs.readFileSync(policyPath, 'utf8').split('\n');
policyLines = policyLines.map(line => {
  if (line.startsWith('1511') || line.startsWith('1507') || line.startsWith('1512')) {
    const parts = line.split(',');
    // parts[2] is measure_type, parts[3] is effective_date
    parts[2] = 'Tariff Adjustment (BCD reduced to 10%)';
    parts[3] = '2025-06-01';
    return parts.join(',');
  }
  return line;
});
fs.writeFileSync(policyPath, policyLines.join('\n'));
console.log('Updated product_policy.csv');

// 7. Truncate state_capability.csv
const statePath = path.join(root, 'data/enrichment/state_capability.csv');
const stateLines = fs.readFileSync(statePath, 'utf8').split('\n');
fs.writeFileSync(statePath, stateLines[0] + '\n');
console.log('Truncated state_capability.csv');

