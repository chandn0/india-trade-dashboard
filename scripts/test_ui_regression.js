import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

import {
  filterAndSortProducts as baseFilter,
  calculateScenario,
  canAddComparisonProduct,
  addComparisonProduct,
  canRemoveComparisonProduct,
  removeComparisonProduct,
} from '../app/lib/productLogic.js';

// Load core datasets
const stageMix = JSON.parse(
  fs.readFileSync(path.join(root, 'data/product_stage_mix.json'), 'utf8'),
);
const stageSummary = JSON.parse(
  fs.readFileSync(path.join(root, 'data/product_stage_summary.json'), 'utf8'),
);
const baselineSummary = JSON.parse(
  fs.readFileSync(path.join(root, 'tests/fixtures/baseline_totals.json'), 'utf8'),
);

// Helper function wrapping ProductExplorer filter logic
function filterAndSortProducts(flowProducts, opts) {
  return baseFilter(flowProducts, opts).visibleProducts;
}

describe('S05 Suite 1: Search and Hierarchical Filters (ProductExplorer)', () => {
  const importProducts = stageMix.products.filter((p) => p.latestImportUsdMn > 0);

  it('filters accurately by production stage', () => {
    const rawMaterials = filterAndSortProducts(importProducts, {
      stage: 'raw material',
      limit: 'all',
    });
    assert.ok(rawMaterials.length > 0, 'Should find raw material products');
    for (const p of rawMaterials) {
      assert.equal(p.productionStage, 'raw material');
    }
  });

  it('filters accurately by sector and HS-2 chapter', () => {
    const sectors = [...new Set(importProducts.map((p) => p.sector))];
    const targetSector = sectors[0];
    const sectorProducts = filterAndSortProducts(importProducts, {
      sector: targetSector,
      limit: 'all',
    });
    assert.ok(sectorProducts.length > 0);
    for (const p of sectorProducts) {
      assert.equal(p.sector, targetSector);
    }

    const targetHs2 = sectorProducts[0].hs2;
    const hs2Products = filterAndSortProducts(importProducts, {
      sector: targetSector,
      hs2: targetHs2,
      limit: 'all',
    });
    assert.ok(hs2Products.length > 0);
    for (const p of hs2Products) {
      assert.equal(p.sector, targetSector);
      assert.equal(p.hs2, targetHs2);
    }
  });

  it('filters accurately by review status', () => {
    for (const status of ['reviewed', 'mixed-use', 'needs review']) {
      const results = filterAndSortProducts(importProducts, { reviewStatus: status, limit: 'all' });
      assert.ok(Array.isArray(results));
      for (const p of results) {
        assert.equal(p.reviewStatus, status);
      }
    }
  });

  it('performs case-insensitive text search matching hscode, description, or attributionRationale', () => {
    const codeMatch = filterAndSortProducts(importProducts, { query: '8542', limit: 'all' });
    assert.ok(
      codeMatch.some((p) => p.hscode === '8542'),
      'Should find HS 8542 by exact code',
    );

    const descMatch = filterAndSortProducts(importProducts, { query: 'cotton', limit: 'all' });
    assert.ok(descMatch.length > 0);
    for (const p of descMatch) {
      const match =
        p.hscode.includes('cotton') ||
        p.description.toLowerCase().includes('cotton') ||
        p.attributionReason.toLowerCase().includes('cotton');
      assert.ok(match, `Product HS ${p.hscode} should match search query 'cotton'`);
    }
  });
});

describe('S05 Suite 2: Import/Export Flow Switching (ProductExplorer)', () => {
  it('switches between import and export value keys, ranks, and positive-flow subsets', () => {
    const importActive = stageMix.products.filter((p) => p.latestImportUsdMn > 0);
    const exportActive = stageMix.products.filter((p) => p.latestExportUsdMn > 0);

    assert.notEqual(importActive.length, 0);
    assert.notEqual(exportActive.length, 0);

    const importSorted = filterAndSortProducts(importActive, {
      flowName: 'Imports',
      sortBy: 'value',
      limit: 10,
    });
    const exportSorted = filterAndSortProducts(exportActive, {
      flowName: 'Exports',
      sortBy: 'value',
      limit: 10,
    });

    // Verify ordering is strict descending for respective flow values
    for (let i = 0; i < importSorted.length - 1; i += 1) {
      assert.ok(importSorted[i].latestImportUsdMn >= importSorted[i + 1].latestImportUsdMn);
    }
    for (let i = 0; i < exportSorted.length - 1; i += 1) {
      assert.ok(exportSorted[i].latestExportUsdMn >= exportSorted[i + 1].latestExportUsdMn);
    }
  });
});

describe('S05 Suite 3: Top-20 / 50 / 100 / All Slice and Sort Controls', () => {
  const active = stageMix.products.filter((p) => p.latestImportUsdMn > 0);

  it('respects exact limit slicing bounds', () => {
    for (const lim of [20, 50, 100]) {
      const sliced = filterAndSortProducts(active, { limit: lim });
      assert.equal(sliced.length, Math.min(lim, active.length));
    }
    const allSliced = filterAndSortProducts(active, { limit: 'all' });
    assert.equal(allSliced.length, active.length);
  });

  it('sorts correctly across all 4 modes (value, stage, code, net)', () => {
    const byCode = filterAndSortProducts(active, { sortBy: 'code', limit: 'all' });
    for (let i = 0; i < byCode.length - 1; i += 1) {
      assert.ok(byCode[i].hscode.localeCompare(byCode[i + 1].hscode) <= 0);
    }

    const byStage = filterAndSortProducts(active, { sortBy: 'stage', limit: 'all' });
    for (let i = 0; i < byStage.length - 1; i += 1) {
      const stageCmp = byStage[i].productionStage.localeCompare(byStage[i + 1].productionStage);
      assert.ok(
        stageCmp <= 0 ||
          (stageCmp === 0 && byStage[i].latestImportUsdMn >= byStage[i + 1].latestImportUsdMn),
      );
    }

    const byNet = filterAndSortProducts(active, { sortBy: 'net', limit: 'all' });
    for (let i = 0; i < byNet.length - 1; i += 1) {
      assert.ok(Math.abs(byNet[i].netBalanceUsdMn) >= Math.abs(byNet[i + 1].netBalanceUsdMn));
    }
  });
});

describe('S05 Suite 4: Comparison Add/Remove State (ProductComparison)', () => {
  it('enforces maximum 5 products cap and unique addition rules', () => {
    let selectedCodes = ['2709', '8542', '8507'];

    // Can add a valid 4th product
    assert.equal(canAddComparisonProduct(selectedCodes, '8517'), true);
    selectedCodes = addComparisonProduct(selectedCodes, '8517');
    assert.equal(selectedCodes.length, 4);

    // Can add a valid 5th product
    assert.equal(canAddComparisonProduct(selectedCodes, '8471'), true);
    selectedCodes = addComparisonProduct(selectedCodes, '8471');
    assert.equal(selectedCodes.length, 5);

    // Cannot add a 6th product
    assert.equal(canAddComparisonProduct(selectedCodes, '8703'), false);
    selectedCodes = addComparisonProduct(selectedCodes, '8703');
    assert.equal(selectedCodes.length, 5);

    // Cannot add an existing product
    assert.equal(canAddComparisonProduct(selectedCodes, '8542'), false);
    selectedCodes = addComparisonProduct(selectedCodes, '8542');
    assert.equal(selectedCodes.length, 5);

    // Can remove a product when > 2
    assert.equal(canRemoveComparisonProduct(selectedCodes), true);
    selectedCodes = removeComparisonProduct(selectedCodes, '8542');
    assert.equal(selectedCodes.length, 4);
    assert.equal(selectedCodes.includes('8542'), false);

    // Can remove down to 2
    selectedCodes = removeComparisonProduct(selectedCodes, '8471');
    selectedCodes = removeComparisonProduct(selectedCodes, '8517');
    assert.equal(selectedCodes.length, 2);

    // Cannot remove below 2
    assert.equal(canRemoveComparisonProduct(selectedCodes), false);
    selectedCodes = removeComparisonProduct(selectedCodes, '2709');
    assert.equal(selectedCodes.length, 2);
  });
});

describe('S05 Suite 5: Scenario Arithmetic and Slider Boundaries (ScenarioModeller)', () => {
  it('calculates net impact accurately across standard and boundary slider inputs', () => {
    const p = stageMix.products.find((prod) => prod.hscode === '8542');
    const pZeroEx = stageMix.products.find((prod) => prod.hscode === '0103'); // Zero Export
    const pZeroIm = stageMix.products.find((prod) => prod.hscode === '0201'); // Zero Import

    // At 0% across all sliders
    const zeroRes = calculateScenario(p, {
      substitution: 0,
      exportGrowth: 0,
      importedInputShare: 0,
      realisation: 0,
    });
    assert.equal(zeroRes.grossMovement, 0);
    assert.equal(zeroRes.netImpact, 0);

    // At 0% realisation, net impact must be exactly 0 regardless of gross movements
    const zeroReal = calculateScenario(p, {
      substitution: 100,
      exportGrowth: 100,
      importedInputShare: 50,
      realisation: 0,
    });
    assert.ok(zeroReal.grossMovement > 0);
    assert.equal(zeroReal.netImpact, 0);

    // At 100% substitution, 100% export growth, 0% imported input requirement, 100% realisation
    const fullRes = calculateScenario(p, {
      substitution: 100,
      exportGrowth: 100,
      importedInputShare: 0,
      realisation: 100,
    });
    assert.equal(fullRes.importReduction, p.latestImportUsdMn);
    assert.equal(fullRes.exportGain, p.latestExportUsdMn);
    assert.equal(fullRes.replacementInputCost, 0);
    assert.equal(fullRes.exportInputCost, 0);
    assert.equal(fullRes.netImpact, p.latestImportUsdMn + p.latestExportUsdMn);

    // At 100% imported input requirement, net impact must be 0 (all gains consumed by foreign inputs)
    const fullInput = calculateScenario(p, {
      substitution: 50,
      exportGrowth: 50,
      importedInputShare: 100,
      realisation: 100,
    });
    assert.ok(
      Math.abs(fullInput.netImpact) < 1e-9,
      `Expected ~0 net impact when input share is 100%, got ${fullInput.netImpact}`,
    );

    // Realistic Default Outputs (Pinned for HS 8542)
    const realisticRes = calculateScenario(p, {
      substitution: 20,
      exportGrowth: 15,
      importedInputShare: 35,
      realisation: 70,
    });
    assert.ok(Math.abs(realisticRes.grossMovement - 6106.5275) < 1e-3);
    assert.ok(Math.abs(realisticRes.netImpact - 2778.47) < 1e-3);

    // Realistic Default Outputs (Zero Export Product - HS 0103)
    const zeroExRes = calculateScenario(pZeroEx, {
      substitution: 20,
      exportGrowth: 15,
      importedInputShare: 35,
      realisation: 70,
    });
    assert.ok(Math.abs(zeroExRes.grossMovement - 0.07965) < 1e-3);
    assert.ok(Math.abs(zeroExRes.netImpact - 0.03624) < 1e-3);
    assert.equal(zeroExRes.exportGain, 0);

    // Realistic Default Outputs (Zero Import Product - HS 0201)
    const zeroImRes = calculateScenario(pZeroIm, {
      substitution: 20,
      exportGrowth: 15,
      importedInputShare: 35,
      realisation: 70,
    });
    assert.ok(Math.abs(zeroImRes.grossMovement - 21.233) < 1e-3);
    assert.ok(Math.abs(zeroImRes.netImpact - 9.661) < 1e-3);
    assert.equal(zeroImRes.importReduction, 0);
  });
});

describe('S05 Suite 6: Zero-Import and Zero-Export Products Handling', () => {
  it('handles zero-import lines safely with exportCoveragePct === null or 0', () => {
    const zeroImports = stageMix.products.filter((p) => p.latestImportUsdMn === 0);
    assert.ok(zeroImports.length >= 0);
    for (const p of zeroImports) {
      assert.equal(
        p.exportCoveragePct,
        p.latestExportUsdMn > 0 ? null : 0,
        `Product HS ${p.hscode} with 0 imports should have correct coverage percentage logic`,
      );
    }
  });

  it('handles zero-export lines safely with exportCoveragePct === 0 or null if both 0', () => {
    const zeroExports = stageMix.products.filter(
      (p) => p.latestExportUsdMn === 0 && p.latestImportUsdMn > 0,
    );
    for (const p of zeroExports) {
      assert.equal(
        p.exportCoveragePct,
        0,
        `Product HS ${p.hscode} with 0 exports and positive imports should have 0% coverage`,
      );
      assert.ok(
        p.netBalanceUsdMn < 0,
        `Product HS ${p.hscode} with only imports must have negative net balance`,
      );
    }
  });
});

describe('S05 Suite 7: Desktop and Mobile Layout Data Contracts', () => {
  it('enforces COMPACT_BELOW breakpoint and checks chart geometry math', async () => {
    const { COMPACT_BELOW } = await import('../app/lib/responsive.js');
    const { buildTradeGeo } = await import('../app/lib/chartGeometry.js');

    assert.equal(COMPACT_BELOW, 560, 'COMPACT_BELOW breakpoint must remain strictly at 560px');

    const sampleTradeData = [
      { financial_year: '2021-22', export_usd_mn: 400000, import_usd_mn: 600000 },
      { financial_year: '2022-23', export_usd_mn: 450000, import_usd_mn: 700000 },
    ];

    // Check desktop (>560) vs mobile (<560)
    const desktopGeo = buildTradeGeo(sampleTradeData, 800);
    assert.equal(desktopGeo.compact, false);
    assert.ok(desktopGeo.exportPath.includes('M ') && desktopGeo.importPath.includes('M '));
    assert.ok(!desktopGeo.exportPath.includes('NaN'));

    const mobileGeo = buildTradeGeo(sampleTradeData, 375);
    assert.equal(mobileGeo.compact, true);
    assert.ok(mobileGeo.exportPath.includes('M ') && mobileGeo.importPath.includes('M '));
    assert.ok(!mobileGeo.exportPath.includes('NaN'));
  });
});

describe('S05 Suite 8: Main-Dashboard Summary vs Dedicated-Page Totals Reconciliation', () => {
  it('reconciles product_stage_summary.json exact totals against the static baseline_totals.json fixture', () => {
    for (const flowName of ['Imports', 'Exports']) {
      const summaryFlow = stageSummary.flows.find((f) => f.flow === flowName);
      const baselineFlow = baselineSummary.flows.find((f) => f.flow === flowName);
      const mixFlow = stageMix.flows.find((f) => f.flow === flowName);

      assert.ok(summaryFlow, `Missing ${flowName} in summary flows`);
      assert.ok(baselineFlow, `Missing ${flowName} in baseline flows`);
      assert.ok(mixFlow, `Missing ${flowName} in mix flows`);

      // Total USD Mn exact match between summary, baseline, and mix
      assert.ok(
        Math.abs(summaryFlow.totalUsdMn - baselineFlow.totalUsdMn) < 1e-4,
        `Total USD Mn drifted from approved baseline for ${flowName}`,
      );
      assert.ok(
        Math.abs(summaryFlow.totalUsdMn - mixFlow.totalUsdMn) < 1e-4,
        `Total USD Mn mismatch between summary and mix for ${flowName}`,
      );
      assert.equal(
        summaryFlow.productCount,
        baselineFlow.productCount,
        `Product count drifted from approved baseline for ${flowName}`,
      );
      assert.equal(
        summaryFlow.productCount,
        mixFlow.productCount,
        `Product count mismatch for ${flowName}`,
      );

      // Check stage array entries match baseline strictly
      for (const stageInfo of summaryFlow.stages) {
        const baselineStage = baselineFlow.stages.find((s) => s.stage === stageInfo.stage);
        assert.ok(baselineStage, `Stage ${stageInfo.stage} missing in baseline flow ${flowName}`);
        assert.equal(
          stageInfo.productCount,
          baselineStage.productCount,
          `Stage ${stageInfo.stage} product count drifted from baseline in ${flowName}`,
        );
        assert.ok(
          Math.abs(stageInfo.valueUsdMn - baselineStage.valueUsdMn) < 1e-4,
          `Stage ${stageInfo.stage} value drifted from baseline in ${flowName}`,
        );

        const mixStage = mixFlow.stages.find((s) => s.stage === stageInfo.stage);
        assert.ok(mixStage, `Stage ${stageInfo.stage} missing in mix flow ${flowName}`);
        assert.equal(
          stageInfo.productCount,
          mixStage.productCount,
          `Stage ${stageInfo.stage} product count mismatch in ${flowName}`,
        );
        assert.ok(
          Math.abs(stageInfo.valueUsdMn - mixStage.valueUsdMn) < 1e-4,
          `Stage ${stageInfo.stage} value mismatch in ${flowName}`,
        );
      }

      // Verify that summing individual product rows in stageMix.products equals the reported totalUsdMn precisely
      const valueKey = flowName === 'Imports' ? 'latestImportUsdMn' : 'latestExportUsdMn';
      const aggregatedTotal = stageMix.products
        .filter((p) => p[valueKey] > 0)
        .reduce((sum, p) => sum + p[valueKey], 0);

      assert.ok(
        Math.abs(aggregatedTotal - mixFlow.totalUsdMn) < 1e-4,
        `Sum of individual product lines (${aggregatedTotal}) does not match reported total (${mixFlow.totalUsdMn}) for ${flowName}`,
      );
    }

    // Verify enrichment availability against baseline (catches accidental CSV truncation or deletion)
    const baselineEnrich = baselineSummary.enrichmentAvailability;
    const summaryEnrich = stageSummary.metadata?.enrichmentAvailability;
    if (baselineEnrich && summaryEnrich) {
      for (const key of Object.keys(baselineEnrich)) {
        if (key === 'partnerHs4') continue; // Deprecated in S06 remediation
        if (baselineEnrich[key].rowCount > 0) {
          assert.ok(
            summaryEnrich[key]?.rowCount >= baselineEnrich[key].rowCount,
            `Enrichment contract '${key}' row count dropped from baseline ${baselineEnrich[key].rowCount} to ${summaryEnrich[key]?.rowCount}`,
          );
        }
      }
    }
  });
});

describe('S05 Suite 11: Public-Readiness Evidence Safety Controls', () => {
  it('enforces null analystLocalisableSharePct for unassessed electronics and industrial preview products', () => {
    const previewCodes = [
      '8517',
      '8507',
      '8542',
      '8541',
      '8471',
      '8414',
      '8421',
      '8428',
      '8477',
      '8480',
      '8482',
    ];
    for (const code of previewCodes) {
      const prod = stageMix.products.find((p) => p.hscode === code);
      assert.ok(prod, `Product HS ${code} must exist in stageMix`);
      assert.equal(
        prod.domesticSupply?.analystLocalisableSharePct ?? null,
        null,
        `HS ${code} must have null analystLocalisableSharePct`,
      );
    }
  });
});

describe('S05 Suite 12: Deployment Site URL Resolution Controls', () => {
  it('resolves site URL correctly across explicit production URL, Vercel hostnames, and local fallbacks', async () => {
    const { getSiteUrl } = await import('../app/lib/siteUrl.js');

    // Explicit NEXT_PUBLIC_SITE_URL takes top priority
    assert.equal(
      getSiteUrl({ NEXT_PUBLIC_SITE_URL: 'https://custom-trade-domain.com/' }),
      'https://custom-trade-domain.com',
    );
    assert.equal(
      getSiteUrl({
        NEXT_PUBLIC_SITE_URL: 'https://custom-trade-domain.com',
        VERCEL_PROJECT_PRODUCTION_URL: 'my-app.vercel.app',
      }),
      'https://custom-trade-domain.com',
    );

    // VERCEL_PROJECT_PRODUCTION_URL or VERCEL_URL fallback with https normalization
    assert.equal(
      getSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'india-trade-dashboard.vercel.app' }),
      'https://india-trade-dashboard.vercel.app',
    );
    assert.equal(
      getSiteUrl({ VERCEL_URL: 'india-trade-dashboard-preview.vercel.app/' }),
      'https://india-trade-dashboard-preview.vercel.app',
    );

    // Local development fallback
    assert.equal(getSiteUrl({}), 'http://localhost:3000');
    assert.equal(getSiteUrl({ NEXT_PUBLIC_SITE_URL: '' }), 'http://localhost:3000');
  });
});
