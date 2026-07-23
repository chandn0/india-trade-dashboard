import fs from 'fs';
import path from 'path';

const buildPath = path.join(process.cwd(), 'scripts/build_product_stage_mix.js');
let buildContent = fs.readFileSync(buildPath, 'utf8');

const targetBalances = `const stageBalances = [...new Set(products.map((product) => product.productionStage))]
  .map((stage) => {
    const stageProducts = products.filter((product) => product.productionStage === stage);
    const importUsdMn = stageProducts.reduce((sum, product) => sum + product.latestImportUsdMn, 0);
    const exportUsdMn = stageProducts.reduce((sum, product) => sum + product.latestExportUsdMn, 0);
    return {
      stage,
      importUsdMn,
      exportUsdMn,
      netBalanceUsdMn: exportUsdMn - importUsdMn,
      exportCoveragePct: importUsdMn ? (exportUsdMn / importUsdMn) * 100 : null,
    };
  })
  .sort((a, b) => a.netBalanceUsdMn - b.netBalanceUsdMn);`;

const replacementBalances = `const stageBalances = [...new Set(products.map((product) => product.productionStage))]
  .map((stage) => {
    const stageProducts = products.filter((product) => product.productionStage === stage);
    const importUsdMn = stageProducts.reduce((sum, product) => sum + product.latestImportUsdMn, 0);
    const exportUsdMn = stageProducts.reduce((sum, product) => sum + product.latestExportUsdMn, 0);
    const firstImportUsdMn = stageProducts.reduce((sum, product) => sum + product.importHistory[0], 0);
    const firstExportUsdMn = stageProducts.reduce((sum, product) => sum + product.exportHistory[0], 0);
    return {
      stage,
      importUsdMn,
      exportUsdMn,
      firstImportUsdMn,
      firstExportUsdMn,
      importChangePct: firstImportUsdMn ? ((importUsdMn - firstImportUsdMn) / firstImportUsdMn) * 100 : 0,
      exportChangePct: firstExportUsdMn ? ((exportUsdMn - firstExportUsdMn) / firstExportUsdMn) * 100 : 0,
      netBalanceUsdMn: exportUsdMn - importUsdMn,
      exportCoveragePct: importUsdMn ? (exportUsdMn / importUsdMn) * 100 : null,
    };
  })
  .sort((a, b) => a.netBalanceUsdMn - b.netBalanceUsdMn);`;

buildContent = buildContent.replace(targetBalances, replacementBalances);

fs.writeFileSync(buildPath, buildContent);
console.log('Updated stageBalances in build_product_stage_mix.js');
