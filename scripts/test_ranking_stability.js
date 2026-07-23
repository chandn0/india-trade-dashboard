import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), '..');

const stageMix = JSON.parse(
  fs.readFileSync(path.join(root, 'data/product_stage_mix.json'), 'utf8'),
);

describe('S17 Suite: Ranking Stability Tests', () => {
  it('should maintain stable top 10 net deficit rankings', () => {
    const importActive = stageMix.products.filter((p) => p.latestImportUsdMn > 0);
    // Sort by absolute net balance descending
    const sorted = [...importActive].sort(
      (a, b) => Math.abs(b.netBalanceUsdMn) - Math.abs(a.netBalanceUsdMn),
    );

    const top10Codes = sorted.slice(0, 10).map((p) => p.hscode);

    const expectedHeavyweights = [
      '2709',
      '7108',
      '2710',
      '8542',
      '2701',
      '2711',
      '3004',
      '8802',
      '8471',
      '8517',
    ];

    for (const hw of expectedHeavyweights) {
      assert.ok(top10Codes.includes(hw), `Ranking stability failure: ${hw} fell out of top 10`);
    }
  });

  it('should rank products deterministically by trade value', () => {
    const sortedByImport = [...stageMix.products].sort(
      (a, b) => b.latestImportUsdMn - a.latestImportUsdMn,
    );
    assert.equal(sortedByImport[0].hscode, '2709', 'Crude oil must be the top import');

    const sortedByExport = [...stageMix.products].sort(
      (a, b) => b.latestExportUsdMn - a.latestExportUsdMn,
    );
    assert.equal(sortedByExport[0].hscode, '2710', 'Refined petroleum must be the top export');
  });
});
