import fs from 'fs';
import path from 'path';

const buildPath = path.join(process.cwd(), 'scripts/build_product_stage_mix.js');
let buildContent = fs.readFileSync(buildPath, 'utf8');

const insertion = `
const totalDeficitChange = products.reduce((sum, p) => sum + ((p.latestImportUsdMn - p.importHistory[0]) - (p.latestExportUsdMn - p.exportHistory[0])), 0);
products.forEach(p => {
  const pDefChange = (p.latestImportUsdMn - p.importHistory[0]) - (p.latestExportUsdMn - p.exportHistory[0]);
  p.contributionToDeficitChangePct = totalDeficitChange !== 0 ? (pDefChange / totalDeficitChange) * 100 : 0;
  p.isMirror = p.latestImportUsdMn > 50 && p.latestExportUsdMn > 50 && (p.latestExportUsdMn / p.latestImportUsdMn) > 0.5 && (p.latestExportUsdMn / p.latestImportUsdMn) < 2.0;
  p.fiveYearNetBalanceChangeUsdMn = -pDefChange; // If deficit grows, net balance change is negative
});
`;

buildContent = buildContent.replace('for (const [key, valueKey] of [', insertion + '\nfor (const [key, valueKey] of [');

fs.writeFileSync(buildPath, buildContent);
console.log('Updated build_product_stage_mix.js with Mirror and Contribution metrics.');
