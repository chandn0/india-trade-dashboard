import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const years = ['2021-22', '2022-23', '2023-24', '2024-25', '2025-26'];
const latestYear = years.at(-1);
const topN = 40;

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field.replace(/\r$/, ''));
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = '';
    } else field += char;
  }
  if (field || row.length) rows.push([...row, field]);
  const [headers, ...body] = rows;
  return body.map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])),
  );
}

const manualRows = parseCsv(
  fs.readFileSync(path.join(root, 'data/product_stage_classification.csv'), 'utf8'),
);
const manualByCode = new Map(manualRows.map((row) => [row.hscode.padStart(4, '0'), row]));
const hs2Labels = JSON.parse(
  fs.readFileSync(path.join(root, 'data/labels/hs2-labels.json'), 'utf8'),
);
const buildabilityData = JSON.parse(
  fs.readFileSync(path.join(root, 'data/product_discovery.json'), 'utf8'),
);
const buildabilityByCode = new Map(
  buildabilityData.products.map((product) => [product.hscode, product]),
);
const partnerData = JSON.parse(
  fs.readFileSync(path.join(root, 'data/india_trade_partner_top_products.json'), 'utf8'),
);
const enrichmentContracts = {
  quantityUnitValue: 'data/enrichment/product_quantity_unit_value.csv',
  productPartnerExposure: 'data/enrichment/product_partner_exposure.csv',
  domesticSupply: 'data/enrichment/product_domestic_supply.csv',
  policy: 'data/enrichment/product_policy.csv',
  stateCapability: 'data/enrichment/state_product_capability.csv',
};
const enrichmentAvailability = Object.fromEntries(
  Object.entries(enrichmentContracts).map(([key, relativePath]) => {
    const rows = parseCsv(fs.readFileSync(path.join(root, relativePath), 'utf8'));
    return [key, { rowCount: rows.length, available: rows.length > 0, path: relativePath }];
  }),
);

// Parse enrichment CSVs into per-product lookup maps

const supplyRows = parseCsv(
  fs.readFileSync(path.join(root, 'data/enrichment/product_domestic_supply.csv'), 'utf8'),
);
const supplyByCode = new Map(
  supplyRows.map((row) => [
    row.hscode.padStart(4, '0'),
    {
      fiscalYear: row.fiscal_year,
      observedProduction: row.observed_production !== '' ? Number(row.observed_production) : null,
      installedCapacity: row.installed_capacity !== '' ? Number(row.installed_capacity) : null,
      announcedCapacity: row.announced_capacity !== '' ? Number(row.announced_capacity) : null,
      pliLinkedProduction:
        row.pli_linked_production !== '' ? Number(row.pli_linked_production) : null,
      domesticDemandCoveragePct:
        row.domestic_demand_coverage_pct !== '' ? Number(row.domestic_demand_coverage_pct) : null,
      analystLocalisableSharePct:
        row.analyst_localisable_share_pct !== '' ? Number(row.analyst_localisable_share_pct) : null,
      unit: row.unit || '',
      evidenceNote: row.evidence_note,
      sourceUrl: row.source_url,
      sourceDate: row.source_date,
    },
  ]),
);

const policyRows = parseCsv(
  fs.readFileSync(path.join(root, 'data/enrichment/product_policy.csv'), 'utf8'),
);
const policyByCode = new Map(
  policyRows.map((row) => [
    row.hscode.padStart(4, '0'),
    {
      exactAffectedScope: row.exact_affected_scope || '',
      measureType: row.measure_type || '',
      effectiveDate: row.effective_date || '',
      expiryReviewDate: row.expiry_review_date || '',
      primarySource: row.primary_source || '',
      lastVerificationDate: row.last_verification_date || '',
      status: (() => {
        if (!row.expiry_review_date) return row.status || '';
        const expiry = new Date(row.expiry_review_date);
        const now = new Date(new Date().toISOString().split('T')[0]); // Current build date
        return expiry < now ? 'Expired' : 'Active';
      })(),
    },
  ]),
);

const productPartnerRows = parseCsv(
  fs.readFileSync(path.join(root, 'data/enrichment/product_partner_exposure.csv'), 'utf8'),
);
const productPartnerByCode = new Map();
for (const row of productPartnerRows) {
  const hs = row.hscode.padStart(4, '0');
  if (!productPartnerByCode.has(hs)) {
    productPartnerByCode.set(hs, { imports: null, exports: null });
  }
  const flow = row.flow === 'export' ? 'exports' : 'imports';
  productPartnerByCode.get(hs)[flow] = {
    grain: row.grain || '',
    topPartner: row.top_partner,
    topPartnerSharePct: row.top_partner_share_pct ? Number(row.top_partner_share_pct) : null,
    secondPartner: row.second_partner,
    secondPartnerSharePct: row.second_partner_share_pct
      ? Number(row.second_partner_share_pct)
      : null,
    thirdPartner: row.third_partner,
    thirdPartnerSharePct: row.third_partner_share_pct ? Number(row.third_partner_share_pct) : null,
    evidenceNote: row.exposure_note,
    sourceUrl: row.source_url,
    sourceDate: row.source_date,
  };
}

const stateCapabilityRows = parseCsv(
  fs.readFileSync(path.join(root, 'data/enrichment/state_capability.csv'), 'utf8'),
);
const stateCapabilityByCode = new Map();
for (const row of stateCapabilityRows) {
  const hs = row.hscode.padStart(4, '0');
  if (!stateCapabilityByCode.has(hs)) stateCapabilityByCode.set(hs, []);
  stateCapabilityByCode.get(hs).push({
    state: row.state,
    observedProductionUsdMn: row.observed_production_usd_mn
      ? Number(row.observed_production_usd_mn)
      : 0,
    announcedCapacityUsdMn: row.announced_capacity_usd_mn
      ? Number(row.announced_capacity_usd_mn)
      : 0,
    employment: row.employment ? Number(row.employment) : 0,
    investmentUsdMn: row.investment_usd_mn ? Number(row.investment_usd_mn) : 0,
    sourceUrl: row.source_url,
  });
}

const quantityRows = parseCsv(
  fs.readFileSync(path.join(root, 'data/enrichment/product_quantity_unit_value.csv'), 'utf8'),
);
const quantityByCode = new Map();
for (const row of quantityRows) {
  const hs = row.hscode.padStart(4, '0');
  if (!quantityByCode.has(hs)) quantityByCode.set(hs, []);

  let quantityEffectUsd = null;
  let priceEffectUsd = null;
  let residualEffectUsd = null;

  if (row.base_value_usd && row.current_value_usd && row.base_quantity && row.current_quantity) {
    const v0 = Number(row.base_value_usd);
    const vt = Number(row.current_value_usd);
    const q0 = Number(row.base_quantity);
    const qt = Number(row.current_quantity);
    const p0 = v0 / q0;
    const pt = vt / qt;

    if (
      row.decomposition_method &&
      row.decomposition_method.includes('LMDI') &&
      vt !== v0 &&
      qt !== q0 &&
      pt !== p0
    ) {
      const L = (vt - v0) / Math.log(vt / v0);
      quantityEffectUsd = L * Math.log(qt / q0);
      priceEffectUsd = L * Math.log(pt / p0);
      residualEffectUsd = 0;
    } else {
      quantityEffectUsd = p0 * (qt - q0);
      priceEffectUsd = q0 * (pt - p0);
      residualEffectUsd = (pt - p0) * (qt - q0);
    }
  }

  quantityByCode.get(hs).push({
    flow: row.flow,
    baseYear: row.base_year,
    baseValueUsd: row.base_value_usd !== '' ? Number(row.base_value_usd) : null,
    baseQuantity: row.base_quantity !== '' ? Number(row.base_quantity) : null,
    currentYear: row.current_year,
    currentValueUsd: row.current_value_usd !== '' ? Number(row.current_value_usd) : null,
    currentQuantity: row.current_quantity !== '' ? Number(row.current_quantity) : null,
    quantityUnit: row.quantity_unit,
    decompositionMethod: row.decomposition_method,
    quantityEffectUsd,
    priceEffectUsd,
    residualEffectUsd,
    unitValueUsd:
      row.current_value_usd && row.current_quantity
        ? Number(row.current_value_usd) / Number(row.current_quantity)
        : null,
    sourceUrl: row.source_url,
    sourceDate: row.source_date,
  });
}

const ruleReason = {
  'raw material': 'HS chapter rule: primary or recovered material used as downstream feedstock.',
  'intermediate input':
    'HS chapter rule: processed material, part or component incorporated into further production.',
  'finished product':
    'HS chapter rule: product is predominantly ready for final use or consumption.',
  'capital good':
    'HS chapter rule: durable machinery, equipment or transport asset used productively.',
  'energy input': 'HS chapter rule: fuel or energy feedstock used by households or industry.',
  'agricultural commodity': 'HS chapter rule: primary or lightly processed agricultural commodity.',
  'consumption asset':
    'HS chapter rule: precious-metal product substantially held for savings or consumption demand.',
};

function ruleStage(hscode, description) {
  const hs2 = Number(hscode.slice(0, 2));
  const desc = description.toUpperCase();
  if (/\b(PARTS?|PRTS|ACCESSORIES)\b/.test(desc) && hs2 >= 84 && hs2 <= 90) {
    return 'intermediate input';
  }
  if (hs2 === 27) return 'energy input';
  if ([1, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].includes(hs2)) {
    return 'agricultural commodity';
  }
  if ([2, 3, 4, 16, 18, 19, 20, 21, 22, 23, 24].includes(hs2)) return 'finished product';
  if (hs2 === 17) return 'agricultural commodity';
  if ([25, 26, 41].includes(hs2)) return 'raw material';
  if ([28, 29, 31, 32, 34, 35, 36, 37, 38, 39, 40].includes(hs2)) {
    return 'intermediate input';
  }
  if ([30, 33, 42, 43, 49].includes(hs2)) return 'finished product';
  if (hs2 >= 44 && hs2 <= 60) return 'intermediate input';
  if (hs2 >= 61 && hs2 <= 70) return 'finished product';
  if (hs2 === 71) return 'raw material';
  if (hs2 >= 72 && hs2 <= 83) return 'intermediate input';
  if (hs2 === 84) return 'capital good';
  if (hs2 === 85) return 'intermediate input';
  if ([86, 88, 89, 90, 98].includes(hs2)) return 'capital good';
  if (hs2 === 87) return 'finished product';
  if (hs2 >= 91 && hs2 <= 97) return 'finished product';
  return 'finished product';
}

function sectorFor(hscode) {
  const hs2Code = hscode.slice(0, 2);
  if (hs2Labels[hs2Code]) return hs2Labels[hs2Code];
  const hs2 = Number(hs2Code);
  if (hs2 <= 15) return 'Agriculture & food';
  if (hs2 <= 24) return 'Processed food & beverages';
  if (hs2 <= 27) return 'Minerals & energy';
  if (hs2 <= 38) return 'Chemicals';
  if (hs2 <= 40) return 'Plastics & rubber';
  if (hs2 <= 49) return 'Wood, leather & paper';
  if (hs2 <= 63) return 'Textiles & apparel';
  if (hs2 <= 67) return 'Consumer manufactures';
  if (hs2 <= 71) return 'Stone, glass & precious materials';
  if (hs2 <= 83) return 'Base metals';
  if (hs2 <= 85) return 'Machinery & electronics';
  if (hs2 <= 89) return 'Transport equipment';
  if (hs2 <= 92) return 'Instruments';
  return 'Other manufactures';
}

function classificationFor(hscode, description) {
  const manual = manualByCode.get(hscode);
  if (manual) {
    if (
      !manual.production_stage ||
      !manual.attribution_reason ||
      !manual.reviewer ||
      !manual.review_date ||
      !manual.confidence ||
      !manual.dominant_use_rationale ||
      !manual.mixed_use_flag ||
      !manual.evidence_note
    ) {
      throw new Error(
        `Curated HS-4 row ${hscode} is missing required fields in product_stage_classification.csv. All 9 columns must be explicitly supplied.`,
      );
    }
    const isMixed = manual.mixed_use_flag === 'true';
    return {
      productionStage: manual.production_stage,
      attributionReason: manual.attribution_reason,
      classificationMethod: 'curated HS-4',
      confidence: Number(manual.confidence),
      reviewStatus: isMixed ? 'mixed-use' : 'manually-assigned',
      reviewer: manual.reviewer,
      reviewDate: manual.review_date,
      dominantUseRationale: manual.dominant_use_rationale,
      mixedUseFlag: isMixed,
      evidenceNote: manual.evidence_note,
    };
  }
  const productionStage = ruleStage(hscode, description);
  return {
    productionStage,
    attributionReason: ruleReason[productionStage],
    classificationMethod: 'HS-2 dominant-use rule',
    confidence: 2,
    reviewStatus: 'needs review',
    reviewer: 'Automated Rule',
    reviewDate: '2026-07-22',
    dominantUseRationale: ruleReason[productionStage],
    mixedUseFlag: false,
    evidenceNote: '',
  };
}

function readFlow(filename) {
  return JSON.parse(fs.readFileSync(path.join(root, 'data', filename), 'utf8')).filter(
    (row) => row.HSCODE && row.HSDESC,
  );
}

const importRows = readFlow('india_trade_hs4_world_import_5fy.json');
const exportRows = readFlow('india_trade_hs4_world_export_5fy.json');
const importsByCode = new Map(importRows.map((row) => [String(row.HSCODE).padStart(4, '0'), row]));
const exportsByCode = new Map(exportRows.map((row) => [String(row.HSCODE).padStart(4, '0'), row]));
const codes = [...new Set([...importsByCode.keys(), ...exportsByCode.keys()])].sort();

function chapterExposureFor(hs2, side) {
  // First sum the chapter total across all partners
  let totalChapterValue = 0;
  for (const partner of partnerData.partners) {
    const chapter = partner[side]?.top_chapters?.find((item) => item.hs2 === hs2);
    if (chapter) {
      totalChapterValue += chapter.value_usd_mn;
    }
  }

  if (totalChapterValue === 0) return null;

  const exposures = partnerData.partners
    .map((partner) => {
      const chapter = partner[side]?.top_chapters?.find((item) => item.hs2 === hs2);
      if (chapter) {
        return {
          country: partner.country,
          valueUsdMn: chapter.value_usd_mn,
          sharePct: Number(((chapter.value_usd_mn / totalChapterValue) * 100).toFixed(1)),
        };
      }
      return null;
    })
    .filter(Boolean)
    .sort((a, b) => b.valueUsdMn - a.valueUsdMn)
    .slice(0, 5);

  if (exposures.length === 0) return null;
  return exposures;
}

const products = codes.map((hscode) => {
  const importRow = importsByCode.get(hscode);
  const exportRow = exportsByCode.get(hscode);
  const description = (importRow?.HSDESC ?? exportRow?.HSDESC).replace(/\s+/g, ' ').trim();
  const classified = classificationFor(hscode, description);
  const importHistory = years.map((year) => Number(importRow?.[`VAL_USD_${year}`]) || 0);
  const exportHistory = years.map((year) => Number(exportRow?.[`VAL_USD_${year}`]) || 0);
  const latestImportUsdMn = importHistory.at(-1);
  const latestExportUsdMn = exportHistory.at(-1);
  const buildability = buildabilityByCode.get(hscode);
  return {
    hscode,
    hs2: hscode.slice(0, 2),
    description,
    sector: sectorFor(hscode),
    ...classified,
    importHistory,
    exportHistory,
    latestImportUsdMn,
    latestExportUsdMn,
    netBalanceUsdMn: latestExportUsdMn - latestImportUsdMn,
    exportCoveragePct: latestImportUsdMn
      ? (latestExportUsdMn / latestImportUsdMn) * 100
      : latestExportUsdMn
        ? null
        : 0,
    partnerExposure: {
      imports: chapterExposureFor(hscode.slice(0, 2), 'imports'),
      exports: chapterExposureFor(hscode.slice(0, 2), 'exports'),
    },
    buildability: buildability
      ? {
          category: buildability.buildabilityCategory,
          lever: buildability.bestLever,
          timeHorizon: buildability.timeHorizon,
          confidence: buildability.confidence,
          realisticNetImpactLowUsdMn: buildability.realisticNetImpactLowUsdMn,
          realisticNetImpactHighUsdMn: buildability.realisticNetImpactHighUsdMn,
        }
      : null,
    productPartnerExposure: productPartnerByCode.get(hscode) ?? null,
    chapterPartnerExposure:
      chapterExposureFor(hscode.slice(0, 2), 'imports') ||
      chapterExposureFor(hscode.slice(0, 2), 'exports')
        ? {
            grain: `HS-${hscode.slice(0, 2)}`,
            imports: chapterExposureFor(hscode.slice(0, 2), 'imports') || [],
            exports: chapterExposureFor(hscode.slice(0, 2), 'exports') || [],
            evidenceNote: `Chapter ${hscode.slice(0, 2)} grain; HS-4 specific partner breakdown not separately published by EIDB.`,
          }
        : null,
    domesticSupply: supplyByCode.get(hscode) ?? null,
    policyOverlay: policyByCode.get(hscode) ?? null,
    stateCapability: stateCapabilityByCode.get(hscode) ?? null,
    quantityUnitValue: quantityByCode.has(hscode)
      ? {
          imports:
            quantityByCode
              .get(hscode)
              .filter((r) => r.flow === 'import')
              .map(
                ({
                  baseYear,
                  baseValueUsd,
                  baseQuantity,
                  currentYear,
                  currentValueUsd,
                  currentQuantity,
                  quantityUnit,
                  unitValueUsd,
                  decompositionMethod,
                  quantityEffectUsd,
                  priceEffectUsd,
                  residualEffectUsd,
                  sourceUrl,
                  sourceDate,
                }) => ({
                  baseYear,
                  baseValueUsd,
                  baseQuantity,
                  currentYear,
                  currentValueUsd,
                  currentQuantity,
                  quantityUnit,
                  unitValueUsd,
                  decompositionMethod,
                  quantityEffectUsd,
                  priceEffectUsd,
                  residualEffectUsd,
                  sourceUrl,
                  sourceDate,
                }),
              )[0] ?? null,
          exports:
            quantityByCode
              .get(hscode)
              .filter((r) => r.flow === 'export')
              .map(
                ({
                  baseYear,
                  baseValueUsd,
                  baseQuantity,
                  currentYear,
                  currentValueUsd,
                  currentQuantity,
                  quantityUnit,
                  unitValueUsd,
                  decompositionMethod,
                  quantityEffectUsd,
                  priceEffectUsd,
                  residualEffectUsd,
                  sourceUrl,
                  sourceDate,
                }) => ({
                  baseYear,
                  baseValueUsd,
                  baseQuantity,
                  currentYear,
                  currentValueUsd,
                  currentQuantity,
                  quantityUnit,
                  unitValueUsd,
                  decompositionMethod,
                  quantityEffectUsd,
                  priceEffectUsd,
                  residualEffectUsd,
                  sourceUrl,
                  sourceDate,
                }),
              )[0] ?? null,
        }
      : null,
  };
});

const totalDeficitChange = products.reduce(
  (sum, p) =>
    sum + (p.latestImportUsdMn - p.importHistory[0] - (p.latestExportUsdMn - p.exportHistory[0])),
  0,
);
products.forEach((p) => {
  const pDefChange =
    p.latestImportUsdMn - p.importHistory[0] - (p.latestExportUsdMn - p.exportHistory[0]);
  p.contributionToDeficitChangePct =
    totalDeficitChange !== 0 ? (pDefChange / totalDeficitChange) * 100 : 0;
  p.isMirror =
    p.latestImportUsdMn > 50 &&
    p.latestExportUsdMn > 50 &&
    p.latestExportUsdMn / p.latestImportUsdMn > 0.5 &&
    p.latestExportUsdMn / p.latestImportUsdMn < 2.0;
  p.fiveYearNetBalanceChangeUsdMn = -pDefChange; // If deficit grows, net balance change is negative

  // Wave 4: Partner Risk Flag
  let isPartnerRisk = false;
  if (
    p.productPartnerExposure?.imports &&
    p.productPartnerExposure.imports.topPartnerSharePct > 50
  ) {
    const isGeopoliticalRisk = ['China', 'Russia'].includes(
      p.productPartnerExposure.imports.topPartner,
    );
    const isLowSubstitutability =
      p.domesticSupply && p.domesticSupply.analystLocalisableSharePct < 30;
    if (isGeopoliticalRisk && isLowSubstitutability) {
      isPartnerRisk = true;
    }
  }
  p.partnerRiskFlag = isPartnerRisk;
});

for (const [key, valueKey] of [
  ['importRank', 'latestImportUsdMn'],
  ['exportRank', 'latestExportUsdMn'],
]) {
  [...products]
    .filter((product) => product[valueKey] > 0)
    .sort((a, b) => b[valueKey] - a[valueKey])
    .forEach((product, index) => {
      product[key] = index + 1;
    });
}

function aggregateStages(rows, valueFor) {
  const total = rows.reduce((sum, product) => sum + valueFor(product), 0);
  const grouped = new Map();
  for (const product of rows) {
    const value = valueFor(product);
    const current = grouped.get(product.productionStage) ?? { valueUsdMn: 0, productCount: 0 };
    current.valueUsdMn += value;
    if (value > 0) current.productCount += 1;
    grouped.set(product.productionStage, current);
  }
  return [...grouped.entries()]
    .map(([stage, values]) => ({
      stage,
      ...values,
      sharePct: total ? (values.valueUsdMn / total) * 100 : 0,
    }))
    .filter((stage) => stage.valueUsdMn > 0)
    .sort((a, b) => b.valueUsdMn - a.valueUsdMn);
}

function concentration(sortedRows, valueKey) {
  const total = sortedRows.reduce((sum, row) => sum + row[valueKey], 0);
  const topShares = Object.fromEntries(
    [10, 25, 50, 100].map((count) => [
      count,
      (sortedRows.slice(0, count).reduce((sum, row) => sum + row[valueKey], 0) / total) * 100,
    ]),
  );
  const productsToReach = {};
  for (const threshold of [50, 75, 90]) {
    let running = 0;
    let count = 0;
    while (count < sortedRows.length && running / total < threshold / 100) {
      running += sortedRows[count][valueKey];
      count += 1;
    }
    productsToReach[threshold] = count;
  }
  const hhi = sortedRows.reduce((sum, row) => sum + (row[valueKey] / total) ** 2, 0) * 10000;
  return { topShares, productsToReach, hhi };
}

function buildFlow(flow, valueKey) {
  const active = products
    .filter((product) => product[valueKey] > 0)
    .sort((a, b) => b[valueKey] - a[valueKey]);
  const totalUsdMn = active.reduce((sum, product) => sum + product[valueKey], 0);
  const topProducts = active.slice(0, topN).map((product) => ({
    hscode: product.hscode,
    description: product.description,
    valueUsdMn: product[valueKey],
    productionStage: product.productionStage,
    attributionReason: product.attributionReason,
    classificationMethod: product.classificationMethod,
    confidence: product.confidence,
    sector: product.sector,
    reviewStatus: product.reviewStatus,
    reviewer: product.reviewer,
    reviewDate: product.reviewDate,
    dominantUseRationale: product.dominantUseRationale,
    mixedUseFlag: product.mixedUseFlag,
    evidenceNote: product.evidenceNote,
    partnerRiskFlag: product.partnerRiskFlag,
  }));
  const topBasketUsdMn = topProducts.reduce((sum, product) => sum + product.valueUsdMn, 0);

  const curatedProducts = active.filter((p) => p.classificationMethod === 'curated HS-4');
  const curatedUsdMn = curatedProducts.reduce((sum, p) => sum + p[valueKey], 0);
  const curatedCoveragePct = (curatedUsdMn / totalUsdMn) * 100;

  return {
    flow,
    totalUsdMn,
    productCount: active.length,
    topBasketUsdMn,
    classifiedUsdMn: topBasketUsdMn,
    curatedUsdMn,
    curatedCount: curatedProducts.length,
    curatedCoveragePct,
    coveragePct: (topBasketUsdMn / totalUsdMn) * 100,
    stages: aggregateStages(active, (product) => product[valueKey]),
    topStages: aggregateStages(topProducts, (product) => product.valueUsdMn),
    concentration: concentration(active, valueKey),
    products: topProducts,
  };
}

const flows = [
  buildFlow('Imports', 'latestImportUsdMn'),
  buildFlow('Exports', 'latestExportUsdMn'),
];

const trends = years.map((year, yearIndex) => {
  const importsTotal = products.reduce((sum, product) => sum + product.importHistory[yearIndex], 0);
  const exportsTotal = products.reduce((sum, product) => sum + product.exportHistory[yearIndex], 0);
  return {
    year,
    importsTotalUsdMn: importsTotal,
    exportsTotalUsdMn: exportsTotal,
    importStages: aggregateStages(products, (product) => product.importHistory[yearIndex]),
    exportStages: aggregateStages(products, (product) => product.exportHistory[yearIndex]),
  };
});

const stageBalances = [...new Set(products.map((product) => product.productionStage))]
  .map((stage) => {
    const stageProducts = products.filter((product) => product.productionStage === stage);
    const importUsdMn = stageProducts.reduce((sum, product) => sum + product.latestImportUsdMn, 0);
    const exportUsdMn = stageProducts.reduce((sum, product) => sum + product.latestExportUsdMn, 0);
    const firstImportUsdMn = stageProducts.reduce(
      (sum, product) => sum + product.importHistory[0],
      0,
    );
    const firstExportUsdMn = stageProducts.reduce(
      (sum, product) => sum + product.exportHistory[0],
      0,
    );
    return {
      stage,
      importUsdMn,
      exportUsdMn,
      firstImportUsdMn,
      firstExportUsdMn,
      importChangePct: firstImportUsdMn
        ? ((importUsdMn - firstImportUsdMn) / firstImportUsdMn) * 100
        : 0,
      exportChangePct: firstExportUsdMn
        ? ((exportUsdMn - firstExportUsdMn) / firstExportUsdMn) * 100
        : 0,
      netBalanceUsdMn: exportUsdMn - importUsdMn,
      exportCoveragePct: importUsdMn ? (exportUsdMn / importUsdMn) * 100 : null,
    };
  })
  .sort((a, b) => a.netBalanceUsdMn - b.netBalanceUsdMn);

const classificationSummary = products.reduce((summary, product) => {
  summary[product.classificationMethod] = (summary[product.classificationMethod] ?? 0) + 1;
  return summary;
}, {});

const output = {
  metadata: {
    fiscalYear: latestYear,
    years,
    topProductsPerFlow: topN,
    totalUniqueHs4Products: products.length,
    classificationSummary,
    enrichmentAvailability,
    partnerCoverage:
      'Partner exposure is an observed HS-2 indicator from the top 10 chapters of 12 major partners, not an HS-4 sourcing share.',
    methodology:
      'All available HS-4 lines are assigned a dominant production stage. Curated HS-4 rows override transparent HS-2 rules. Full-basket summaries use every line; top-40 coverage is retained as a concentration indicator.',
  },
  flows,
  trends,
  stageBalances,
  products,
};

fs.writeFileSync(
  path.join(root, 'data/product_stage_mix.json'),
  `${JSON.stringify(output, null, 2)}\n`,
);
const summaryOutput = { ...output };
delete summaryOutput.products;
fs.writeFileSync(
  path.join(root, 'data/product_stage_summary.json'),
  `${JSON.stringify(summaryOutput, null, 2)}\n`,
);
console.log(
  `Wrote full and summary datasets for ${products.length} unique HS-4 products (${flows.map((flow) => `${flow.productCount} ${flow.flow.toLowerCase()}`).join(', ')})`,
);
