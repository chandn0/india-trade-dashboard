import fs from 'fs';
import path from 'path';

const buildPath = path.join(process.cwd(), 'scripts/build_product_stage_mix.js');
let buildContent = fs.readFileSync(buildPath, 'utf8');

const targetLogic = `products.forEach(p => {
  const pDefChange = (p.latestImportUsdMn - p.importHistory[0]) - (p.latestExportUsdMn - p.exportHistory[0]);
  p.contributionToDeficitChangePct = totalDeficitChange !== 0 ? (pDefChange / totalDeficitChange) * 100 : 0;
  p.isMirror = p.latestImportUsdMn > 50 && p.latestExportUsdMn > 50 && (p.latestExportUsdMn / p.latestImportUsdMn) > 0.5 && (p.latestExportUsdMn / p.latestImportUsdMn) < 2.0;
  p.fiveYearNetBalanceChangeUsdMn = -pDefChange; // If deficit grows, net balance change is negative
});`;

const replacementLogic = `products.forEach(p => {
  const pDefChange = (p.latestImportUsdMn - p.importHistory[0]) - (p.latestExportUsdMn - p.exportHistory[0]);
  p.contributionToDeficitChangePct = totalDeficitChange !== 0 ? (pDefChange / totalDeficitChange) * 100 : 0;
  p.isMirror = p.latestImportUsdMn > 50 && p.latestExportUsdMn > 50 && (p.latestExportUsdMn / p.latestImportUsdMn) > 0.5 && (p.latestExportUsdMn / p.latestImportUsdMn) < 2.0;
  p.fiveYearNetBalanceChangeUsdMn = -pDefChange; // If deficit grows, net balance change is negative
  
  // Wave 4: Partner Risk Flag
  let isPartnerRisk = false;
  if (p.productPartnerExposure && p.productPartnerExposure.length > 0) {
    const topPartner = p.productPartnerExposure[0]; // Already sorted descending by share in parseData
    if (topPartner.sharePct > 50) { // High concentration
      const isGeopoliticalRisk = ['China', 'Russia'].includes(topPartner.partnerName);
      const isLowSubstitutability = p.domesticSupply && p.domesticSupply.localisableSharePct < 30;
      if (isGeopoliticalRisk && isLowSubstitutability) {
        isPartnerRisk = true;
      }
    }
  }
  p.partnerRiskFlag = isPartnerRisk;
});`;

buildContent = buildContent.replace(targetLogic, replacementLogic);

// Also need to expose this flag to the subset that's fed into the JSON payload.
// Let's look for `buildFlow` and add `partnerRiskFlag: product.partnerRiskFlag`
const flowTarget = `evidenceNote: product.evidenceNote,
  }));`;

const flowReplacement = `evidenceNote: product.evidenceNote,
    partnerRiskFlag: product.partnerRiskFlag,
  }));`;

buildContent = buildContent.replace(flowTarget, flowReplacement);

fs.writeFileSync(buildPath, buildContent);
console.log('Added partnerRiskFlag to build_product_stage_mix.js');
