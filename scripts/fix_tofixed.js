import fs from 'fs';
import path from 'path';

const cardPath = path.join(process.cwd(), 'app/components/products/OpportunityEvidenceCard.js');
let cardContent = fs.readFileSync(cardPath, 'utf8');

const target1 = `{(selected.quantityUnitValue.exports.quantity / 1e6).toFixed(2)}M {selected.quantityUnitValue.exports.quantityUnit.replace('_', ' ')}`;
const replacement1 = `{selected.quantityUnitValue.exports.quantity != null ? (selected.quantityUnitValue.exports.quantity / 1e6).toFixed(2) + 'M ' + (selected.quantityUnitValue.exports.quantityUnit || '').replace('_', ' ') : 'N/A'}`;

const target2 = `{(selected.quantityUnitValue.imports.quantity / 1e6).toFixed(2)}M {selected.quantityUnitValue.imports.quantityUnit.replace('_', ' ')}`;
const replacement2 = `{selected.quantityUnitValue.imports.quantity != null ? (selected.quantityUnitValue.imports.quantity / 1e6).toFixed(2) + 'M ' + (selected.quantityUnitValue.imports.quantityUnit || '').replace('_', ' ') : 'N/A'}`;

cardContent = cardContent.replace(target1, replacement1);
cardContent = cardContent.replace(target2, replacement2);

fs.writeFileSync(cardPath, cardContent);
console.log('Fixed toFixed rendering issue in OpportunityEvidenceCard.js');
