import fs from 'fs';
import path from 'path';

const root = process.cwd();

// 1. Fix edible-oil dependencies in product_domestic_supply.csv
const supplyPath = path.join(root, 'data/enrichment/product_domestic_supply.csv');
let supplyCsv = fs.readFileSync(supplyPath, 'utf8');

supplyCsv = supplyCsv.replace(/1511,2024-25,300000,metric_tonnes,9400000,43\.7,56\.3/g, '1511,2024-25,300000,metric_tonnes,9400000,3.2,96.8');
supplyCsv = supplyCsv.replace(/1507,2024-25,1800000,metric_tonnes,5400000,43\.7,56\.3/g, '1507,2024-25,1800000,metric_tonnes,5400000,33.3,66.7');
supplyCsv = supplyCsv.replace(/1512,2024-25,300000,metric_tonnes,3200000,43\.7,56\.3/g, '1512,2024-25,300000,metric_tonnes,3200000,9.4,90.6');

fs.writeFileSync(supplyPath, supplyCsv);
console.log('Fixed dependencies in product_domestic_supply.csv');

// 2. Truncate product_quantity_unit_value.csv to remove HS 2614
const qtyPath = path.join(root, 'data/enrichment/product_quantity_unit_value.csv');
const qtyLines = fs.readFileSync(qtyPath, 'utf8').split('\n');
// Keep only 9 lines (header + 8 lines)
fs.writeFileSync(qtyPath, qtyLines.slice(0, 9).join('\n') + '\n');
console.log('Removed synthetic row from product_quantity_unit_value.csv');

// 6. Add "Chapter 15 proxy data." to edible oils exposure_note in product_partner_exposure.csv
const partnerPath = path.join(root, 'data/enrichment/product_partner_exposure.csv');
const partnerLines = fs.readFileSync(partnerPath, 'utf8').split('\n');
for (let i = 1; i < partnerLines.length; i++) {
  if (partnerLines[i].startsWith('1511') || partnerLines[i].startsWith('1507') || partnerLines[i].startsWith('1512')) {
    const parts = partnerLines[i].split(',');
    // Note is at index 7
    if (parts[7] && !parts[7].startsWith('Chapter 15 proxy data.')) {
      parts[7] = 'Chapter 15 proxy data. ' + parts[7];
      partnerLines[i] = parts.join(',');
    }
  }
}
fs.writeFileSync(partnerPath, partnerLines.join('\n'));
console.log('Added proxy warnings to product_partner_exposure.csv');
