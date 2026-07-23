import fs from 'fs';
import path from 'path';

const root = process.cwd();

// --- 1. build_product_stage_mix.js ---
const buildMixPath = path.join(root, 'scripts/build_product_stage_mix.js');
let buildMix = fs.readFileSync(buildMixPath, 'utf8');

// Replace Supply parsing
buildMix = buildMix.replace(
  /fiscalYear: row\.fiscal_year,[\s\S]*?sourceDate: row\.source_date,/m,
  `fiscalYear: row.fiscal_year,
      observedProduction: row.observed_production ? Number(row.observed_production) : null,
      installedCapacity: row.installed_capacity ? Number(row.installed_capacity) : null,
      announcedCapacity: row.announced_capacity ? Number(row.announced_capacity) : null,
      pliLinkedProduction: row.pli_linked_production ? Number(row.pli_linked_production) : null,
      domesticDemandCoveragePct: row.domestic_demand_coverage_pct ? Number(row.domestic_demand_coverage_pct) : null,
      analystLocalisableSharePct: row.analyst_localisable_share_pct ? Number(row.analyst_localisable_share_pct) : null,
      unit: row.unit || '',
      evidenceNote: row.evidence_note,
      sourceUrl: row.source_url,
      sourceDate: row.source_date,`
);

// Replace Policy parsing (Dynamic status)
buildMix = buildMix.replace(
  /status: row\.status \|\| '',/m,
  `status: (() => {
        if (!row.expiry_review_date) return row.status || '';
        const expiry = new Date(row.expiry_review_date);
        const now = new Date('2026-07-23'); // Dashboard date
        return expiry < now ? 'Expired' : 'Active';
      })(),`
);

// Replace Partner parsing
buildMix = buildMix.replace(
  /topPartner: row\.top_partner,[\s\S]*?sourceDate: row\.source_date,/m,
  `flow: row.flow || '',
      fiscalYear: row.fiscal_year || '',
      grain: row.grain || '',
      topPartner: row.top_partner,
      topPartnerSharePct: row.top_partner_share_pct ? Number(row.top_partner_share_pct) : null,
      secondPartner: row.second_partner,
      secondPartnerSharePct: row.second_partner_share_pct ? Number(row.second_partner_share_pct) : null,
      thirdPartner: row.third_partner,
      thirdPartnerSharePct: row.third_partner_share_pct ? Number(row.third_partner_share_pct) : null,
      evidenceNote: row.exposure_note,
      sourceUrl: row.source_url,
      sourceDate: row.source_date,`
);

// Replace Quantity parsing
buildMix = buildMix.replace(
  /fiscalYear: row\.fiscal_year,[\s\S]*?sourceDate: row\.source_date,/m,
  `baseYear: row.base_year,
    baseValueUsd: row.base_value_usd !== '' ? Number(row.base_value_usd) : null,
    baseQuantity: row.base_quantity !== '' ? Number(row.base_quantity) : null,
    currentYear: row.current_year,
    currentValueUsd: row.current_value_usd !== '' ? Number(row.current_value_usd) : null,
    currentQuantity: row.current_quantity !== '' ? Number(row.current_quantity) : null,
    quantityUnit: row.quantity_unit,
    decompositionMethod: row.decomposition_method,
    sourceUrl: row.source_url,
    sourceDate: row.source_date,`
);

// Partner risk flag fix for supply field changes
buildMix = buildMix.replace(
  /const isLowSubstitutability = p\.domesticSupply && p\.domesticSupply\.localisableSharePct < 30;/m,
  `const isLowSubstitutability = p.domesticSupply && p.domesticSupply.analystLocalisableSharePct < 30;`
);

fs.writeFileSync(buildMixPath, buildMix);


// --- 2. validate_product_data.js ---
const validatePath = path.join(root, 'scripts/validate_product_data.js');
let validate = fs.readFileSync(validatePath, 'utf8');

validate = validate.replace(
  /const colCount = Object\.keys\(row\)\.length;\n\s+check\(colCount === 15, `product_domestic_supply\.csv row HS \$\{row\.hscode\} has incorrect column count: \$\{colCount\} != 15`\);/,
  `const colCount = Object.keys(row).length;\n  check(colCount === 13, \`product_domestic_supply.csv row HS \$\{row.hscode\} has incorrect column count: \$\{colCount\} != 13\`);`
);

validate = validate.replace(
  /if \(row\.domestic_production && row\.apparent_consumption && row\.localisable_share_pct\) \{[\s\S]*?\}\n/m,
  `` // We removed domestic_production, apparent_consumption, etc.
);

validate = validate.replace(
  /for \(const row of quantityEnrichmentRows\) \{[\s\S]*?\}\n/m,
  `for (const row of quantityEnrichmentRows) {
  if (row.current_quantity && row.unit_value_usd) {
    const q = Number(row.current_quantity);
    const uv = Number(row.unit_value_usd);
    const val = Number(row.current_value_usd);
    // Removed strict check here as LMDI rows do not have unit_value_usd anymore
  }
}\n`
);

// Update policy validation to check expiry_review_date
validate = validate.replace(
  /check\(\n\s+colCount === 8, `product_policy\.csv row HS \$\{row\.hscode\} has incorrect column count: \$\{colCount\} != 8`\n\s+\);/m,
  `check(colCount === 8, \`product_policy.csv row HS \$\{row.hscode\} has incorrect column count: \$\{colCount\} != 8\`);
  if (row.expiry_review_date) {
    check(
      /^\\d{4}-\\d{2}-\\d{2}$/.test(row.expiry_review_date),
      \`product_policy.csv row HS \$\{row.hscode\} has invalid ISO expiry_review_date\`
    );
  }`
);

fs.writeFileSync(validatePath, validate);


// --- 3. ProductCompositionDashboard.js ---
const dashboardPath = path.join(root, 'app/components/products/ProductCompositionDashboard.js');
let dashboard = fs.readFileSync(dashboardPath, 'utf8');

// Add Contribution header
dashboard = dashboard.replace(
  /<TableCell>HS-4 product<\/TableCell>\n\s+<TableCell align="right">Value<\/TableCell>/m,
  `<TableCell>HS-4 product</TableCell>
                <TableCell align="right">Contribution</TableCell>
                <TableCell align="right">Value</TableCell>`
);

fs.writeFileSync(dashboardPath, dashboard);


// --- 4. OpportunityEvidenceCard.js ---
const cardPath = path.join(root, 'app/components/products/OpportunityEvidenceCard.js');
let card = fs.readFileSync(cardPath, 'utf8');

// Update Supply render
card = card.replace(
  /selected\.domesticSupply\.localisableSharePct \?\?\s+0/g,
  `selected.domesticSupply.analystLocalisableSharePct ?? 0`
);

card = card.replace(
  /const hasSupply = !!selected\.domesticSupply;/m,
  `const hasSupply = !!selected.domesticSupply;
  const isGenericScenario = !hasSupply;`
);

card = card.replace(
  /<Typography sx=\{\{ mb: 2, fontSize: 13, fontWeight: 700 \}\}>\n\s+Illustrative Analyst Scenario\n\s+<\/Typography>/m,
  `<Typography sx={{ mb: 2, fontSize: 13, fontWeight: 700 }}>
            Illustrative Analyst Scenario
          </Typography>
          {isGenericScenario && (
            <Alert severity="warning" sx={{ mb: 2, '& .MuiAlert-message': { fontSize: 11.5, p: 0.5 } }}>
              This scenario uses generic baseline assumptions because product-specific evidence is unavailable.
            </Alert>
          )}`
);

card = card.replace(
  /Chapter \{selected\.chapterPartnerExposure\.grain\.replace\("HS-", ""\)\} Top Partners/g,
  `Chapter {selected.chapterPartnerExposure.grain.replace("HS-", "")} Top Partners (Proxy)`
);
card = card.replace(
  />\n\s+Product Top Partners\n\s+<\/Typography>/g,
  `>
            {selected.productPartnerExposure.grain === 'chapter_proxy' ? 'Chapter Proxy Top Partners' : 'Product Top Partners'}
          </Typography>`
);

// Net Deficit to Net Balance
card = card.replace(
  />\n\s+Net Deficit\n\s+<\/Typography>/g,
  `>
          Net Balance ({selected.fiveYearNetBalanceChangeUsdMn > 0 ? 'Surplus' : 'Deficit'})
        </Typography>`
);
// Flow neutral disclosure
card = card.replace(
  /<Typography sx=\{\{ mt: 1, fontSize: 10, color: 'text\.secondary' \}\}>\n\s+Dominant-use methodology applies a single primary stage based on end-use distribution\. Mixed-use goods default to their highest value-add stage\.\n\s+<\/Typography>/m,
  `<Typography sx={{ mt: 1, fontSize: 10, color: 'text.secondary' }}>
            Dominant-use methodology applies a single primary stage based on end-use distribution. Stage attribution is heading-level and flow-neutral.
          </Typography>`
);


fs.writeFileSync(cardPath, card);

// --- 5. build_product_discovery.js (Opportunity Scoring) ---
const discPath = path.join(root, 'scripts/build_product_discovery.js');
let disc = fs.readFileSync(discPath, 'utf8');

disc = disc.replace(
  /const opportunityScore =/m,
  `const netDeficitRelevance = Math.max(0, netDeficitUsdMn) / 1000;
      const technicallyAddressableShare = subPct / 100;
      const implementationFeasibility = weight;
      const timeAdjustedImpact = (Math.max(0, netDeficitUsdMn) * technicallyAddressableShare) * weight;
      const opportunityScore =`
);

fs.writeFileSync(discPath, disc);

console.log('Applied Phase 2 string replacements.');
