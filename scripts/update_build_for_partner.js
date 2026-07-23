import fs from 'fs';
import path from 'path';

const buildPath = path.join(process.cwd(), 'scripts/build_product_stage_mix.js');
let content = fs.readFileSync(buildPath, 'utf8');

if (!content.includes('productPartnerExposure: \'data/enrichment/product_partner_exposure.csv\'')) {
  // 1. Add to enrichmentContracts
  content = content.replace(
    'quantityUnitValue: \'data/enrichment/product_quantity_unit_value.csv\',',
    'quantityUnitValue: \'data/enrichment/product_quantity_unit_value.csv\',\n  productPartnerExposure: \'data/enrichment/product_partner_exposure.csv\','
  );

  // 2. Parse the CSV
  const parseLogic = `
const productPartnerRows = parseCsv(
  fs.readFileSync(path.join(root, 'data/enrichment/product_partner_exposure.csv'), 'utf8'),
);
const productPartnerByCode = new Map(
  productPartnerRows.map((row) => [
    row.hscode.padStart(4, '0'),
    {
      topPartner: row.top_partner,
      topPartnerSharePct: row.top_partner_share_pct ? Number(row.top_partner_share_pct) : null,
      secondPartner: row.second_partner,
      secondPartnerSharePct: row.second_partner_share_pct ? Number(row.second_partner_share_pct) : null,
      thirdPartner: row.third_partner,
      thirdPartnerSharePct: row.third_partner_share_pct ? Number(row.third_partner_share_pct) : null,
      evidenceNote: row.exposure_note,
      sourceUrl: row.source_url,
      sourceDate: row.source_date,
    }
  ])
);
`;
  content = content.replace('const quantityRows = parseCsv(', parseLogic + '\nconst quantityRows = parseCsv(');

  // 3. Add to product object mapping
  content = content.replace(
    '    chapterPartnerExposure: chapterExposureFor(hscode.slice(0, 2), \'imports\') || chapterExposureFor(hscode.slice(0, 2), \'exports\')',
    '    productPartnerExposure: productPartnerByCode.get(hscode) ?? null,\n    chapterPartnerExposure: chapterExposureFor(hscode.slice(0, 2), \'imports\') || chapterExposureFor(hscode.slice(0, 2), \'exports\')'
  );

  fs.writeFileSync(buildPath, content);
  console.log('Updated build_product_stage_mix.js');
} else {
  console.log('Already updated');
}
