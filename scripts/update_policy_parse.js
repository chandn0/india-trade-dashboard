import fs from 'fs';
import path from 'path';

const buildPath = path.join(process.cwd(), 'scripts/build_product_stage_mix.js');
let buildContent = fs.readFileSync(buildPath, 'utf8');

const targetParse = `const policyByCode = new Map(
  policyRows.map((row) => [
    row.hscode.padStart(4, '0'),
    {
      effectiveFrom: row.effective_from,
      applicableHs6: row.applicable_hs6 || '',
      bcdRange: row.bcd_range || '',
      bcdPct: row.basic_customs_duty_pct !== '' ? Number(row.basic_customs_duty_pct) : null,
      effectiveTariffPct: row.effective_tariff_pct !== '' ? Number(row.effective_tariff_pct) : null,
      ftaPreference: row.fta_preference,
      pliCoverage: row.pli_coverage,
      qcoCoverage: row.qco_coverage,
      tradeRemedy: row.trade_remedy,
      restrictionStatus: row.restriction_status,
      igstPct: row.igst_pct !== '' ? Number(row.igst_pct) : null,
      exportDutyPct: row.export_duty_pct !== '' ? Number(row.export_duty_pct) : null,
      nontariffMeasure: row.nontariff_measure,
      evidenceNote: row.evidence_note,
      sourceUrl: row.source_url,
      sourceDate: row.source_date,
    },
  ]),
);`;

const replacementParse = `const policyByCode = new Map(
  policyRows.map((row) => [
    row.hscode.padStart(4, '0'),
    {
      exactAffectedScope: row.exact_affected_scope || '',
      measureType: row.measure_type || '',
      effectiveDate: row.effective_date || '',
      expiryReviewDate: row.expiry_review_date || '',
      primarySource: row.primary_source || '',
      lastVerificationDate: row.last_verification_date || '',
      status: row.status || '',
    },
  ]),
);`;

buildContent = buildContent.replace(targetParse, replacementParse);
fs.writeFileSync(buildPath, buildContent);
console.log('Updated policy parse logic in build script.');
