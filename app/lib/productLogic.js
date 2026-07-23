export function filterAndSortProducts(
  flowProducts,
  { stage, sector, hs2, reviewStatus, query, sortBy, limit, flowName },
) {
  const valueKey = flowName === 'Imports' ? 'latestImportUsdMn' : 'latestExportUsdMn';
  const normalizedQuery = (query || '').trim().toLowerCase();

  const products = flowProducts
    .filter(
      (product) =>
        (!stage || product.productionStage === stage) &&
        (!sector || product.sector === sector) &&
        (!hs2 || product.hs2 === hs2) &&
        (!reviewStatus || product.reviewStatus === reviewStatus) &&
        (!normalizedQuery ||
          product.hscode.includes(normalizedQuery) ||
          product.description.toLowerCase().includes(normalizedQuery) ||
          product.attributionReason.toLowerCase().includes(normalizedQuery)),
    )
    .sort((a, b) => {
      if (sortBy === 'code') return a.hscode.localeCompare(b.hscode);
      if (sortBy === 'stage') {
        return a.productionStage.localeCompare(b.productionStage) || b[valueKey] - a[valueKey];
      }
      if (sortBy === 'net') {
        return Math.abs(b.netBalanceUsdMn) - Math.abs(a.netBalanceUsdMn);
      }
      return b[valueKey] - a[valueKey];
    });

  const visibleProducts = limit === 'all' ? products : products.slice(0, Number(limit));
  return { products, visibleProducts };
}

export function calculateScenario(
  product,
  { substitution, exportGrowth, importedInputShare, realisation },
) {
  const importReduction = product.latestImportUsdMn * (substitution / 100);
  const replacementInputCost = importReduction * (importedInputShare / 100);
  const exportGain = product.latestExportUsdMn * (exportGrowth / 100);
  const exportInputCost = exportGain * (importedInputShare / 100);
  const grossMovement = importReduction + exportGain;
  const netImpact =
    (importReduction - replacementInputCost + exportGain - exportInputCost) * (realisation / 100);

  return {
    importReduction,
    replacementInputCost,
    exportGain,
    exportInputCost,
    grossMovement,
    netImpact,
  };
}

export function calculateScenarioRange(
  product,
  { substitution, exportGrowth, importedInputShare, realisation },
) {
  const base = calculateScenario(product, { substitution, exportGrowth, importedInputShare, realisation });
  const conservative = calculateScenario(product, { substitution, exportGrowth, importedInputShare, realisation: Math.max(0, realisation - 15) });
  const optimistic = calculateScenario(product, { substitution, exportGrowth, importedInputShare, realisation: Math.min(100, realisation + 15) });
  
  // Calculate sensitivities (+1 point absolute change)
  const dSub = Math.abs(calculateScenario(product, { substitution: substitution + 1, exportGrowth, importedInputShare, realisation }).netImpact - base.netImpact);
  const dExp = Math.abs(calculateScenario(product, { substitution, exportGrowth: exportGrowth + 1, importedInputShare, realisation }).netImpact - base.netImpact);
  const dInp = Math.abs(calculateScenario(product, { substitution, exportGrowth, importedInputShare: importedInputShare + 1, realisation }).netImpact - base.netImpact);
  const dReal = Math.abs(calculateScenario(product, { substitution, exportGrowth, importedInputShare, realisation: realisation + 1 }).netImpact - base.netImpact);

  const sensitivities = [
    { name: 'Substitution limit', value: dSub },
    { name: 'Export growth', value: dExp },
    { name: 'Imported input share', value: dInp },
    { name: 'Execution realisation', value: dReal }
  ];
  
  sensitivities.sort((a, b) => b.value - a.value);
  const mostInfluentialAssumption = sensitivities[0].name;

  return {
    base,
    conservative,
    optimistic,
    mostInfluentialAssumption,
    breakEvenInputShare: 100 // At 100% imported input, the gross movement is fully cancelled out
  };
}

export function canAddComparisonProduct(currentCodes, candidateCode) {
  return Boolean(candidateCode && !currentCodes.includes(candidateCode) && currentCodes.length < 5);
}

export function addComparisonProduct(currentCodes, candidateCode) {
  if (!canAddComparisonProduct(currentCodes, candidateCode)) return currentCodes;
  return [...currentCodes, candidateCode];
}

export function canRemoveComparisonProduct(currentCodes) {
  return currentCodes.length > 2;
}

export function removeComparisonProduct(currentCodes, removeCode) {
  if (!canRemoveComparisonProduct(currentCodes)) return currentCodes;
  return currentCodes.filter(code => code !== removeCode);
}
