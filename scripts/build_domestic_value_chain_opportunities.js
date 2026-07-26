import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

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

const stageData = JSON.parse(
  fs.readFileSync(path.join(root, 'data/product_stage_mix.json'), 'utf8'),
);
const links = parseCsv(
  fs.readFileSync(path.join(root, 'data/enrichment/domestic_value_chain_links.csv'), 'utf8'),
);
const productsByCode = new Map(stageData.products.map((product) => [product.hscode, product]));
const linksByFinishedCode = new Map();

for (const row of links) {
  const finishedCode = row.finished_hscode.padStart(4, '0');
  const inputCode = row.input_hscode.padStart(4, '0');
  const finished = productsByCode.get(finishedCode);
  const input = productsByCode.get(inputCode);
  if (!finished || !input)
    throw new Error(`Unknown value-chain link ${finishedCode} → ${inputCode}`);
  const link = {
    inputHscode: inputCode,
    inputDescription: input.description,
    inputStage: input.productionStage,
    inputRole: row.input_role,
    linkBasis: row.link_basis,
    domesticAvailability: row.domestic_availability,
    domesticEvidenceHscode: row.domestic_evidence_hscode.padStart(4, '0'),
    conversionGap: row.conversion_gap,
    timeHorizon: row.time_horizon,
    evidenceGrade: row.evidence_grade,
    sourceUrl: row.source_url,
    sourceDate: row.source_date,
    notes: row.notes,
    inputImportUsdMn: input.latestImportUsdMn,
    inputExportUsdMn: input.latestExportUsdMn,
    inputNetBalanceUsdMn: input.netBalanceUsdMn,
    domesticSupply: input.domesticSupply,
  };
  if (!linksByFinishedCode.has(finishedCode)) linksByFinishedCode.set(finishedCode, []);
  linksByFinishedCode.get(finishedCode).push(link);
}

const endProductStages = new Set(['finished product', 'capital good', 'consumption asset']);
const products = stageData.products
  .filter((product) => endProductStages.has(product.productionStage))
  .map((product) => {
    const productLinks = linksByFinishedCode.get(product.hscode) ?? [];
    const availability = productLinks.map((link) => link.domesticAvailability);
    const hasNonUnknown = productLinks.some((link) => link.domesticAvailability !== 'unknown');

    let evidenceStatus = 'insufficient evidence';
    if (hasNonUnknown) {
      if (availability.includes('not_available')) evidenceStatus = 'structural input gap';
      else if (availability.every((status) => status === 'available'))
        evidenceStatus = 'inputs evidenced';
      else evidenceStatus = 'component ecosystem emerging';
    }

    let strategicFrame = 'map critical inputs before assessment';
    if (hasNonUnknown) {
      strategicFrame =
        product.netBalanceUsdMn >= 0
          ? 'export platform — localise inputs'
          : 'finished-product localisation + component build-out';
    }

    return {
      hscode: product.hscode,
      description: product.description,
      sector: product.sector,
      productionStage: product.productionStage,
      mixedUseFlag: product.mixedUseFlag,
      latestImportUsdMn: product.latestImportUsdMn,
      latestExportUsdMn: product.latestExportUsdMn,
      netBalanceUsdMn: product.netBalanceUsdMn,
      evidenceStatus,
      strategicFrame,
      monetaryImpactStatus: 'suppressed — missing sourced input and substitution shares',
      links: productLinks,
    };
  })
  .sort((a, b) => b.latestImportUsdMn - a.latestImportUsdMn);

function getGeneratedAt(stageData, links) {
  if (process.env.SOURCE_DATE_EPOCH) {
    return new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000).toISOString();
  }
  if (stageData?.metadata?.generatedAt) {
    return stageData.metadata.generatedAt;
  }
  const dates = [];
  for (const link of links) {
    if (link.source_date && /^\d{4}-\d{2}-\d{2}$/.test(link.source_date)) {
      dates.push(link.source_date);
    }
  }
  for (const product of stageData?.products || []) {
    if (
      product.domesticSupply?.sourceDate &&
      /^\d{4}-\d{2}-\d{2}$/.test(product.domesticSupply.sourceDate)
    ) {
      dates.push(product.domesticSupply.sourceDate);
    }
  }
  if (dates.length > 0) {
    dates.sort();
    const latestDate = dates[dates.length - 1];
    return new Date(`${latestDate}T00:00:00.000Z`).toISOString();
  }
  return '2026-01-01T00:00:00.000Z';
}

const mapped = products.filter((product) => product.links.length);
const output = {
  metadata: {
    fiscalYear: stageData.metadata.fiscalYear,
    units: 'USD million',
    generatedAt: getGeneratedAt(stageData, links),
    methodology:
      'Directional HS-4 value-chain screen. Component balances are not allocated to finished products and are not added to end-product trade, preventing double counting. Monetary impact is suppressed until sourced input and substitution shares exist.',
    endProductStages: [...endProductStages],
    totalEndProductLines: products.length,
    mappedEndProductLines: mapped.length,
    sources: [
      'data/product_stage_mix.json',
      'data/enrichment/domestic_value_chain_links.csv',
      'data/enrichment/product_domestic_supply.csv',
    ],
  },
  summary: {
    totalEndProductImportUsdMn: products.reduce(
      (sum, product) => sum + product.latestImportUsdMn,
      0,
    ),
    totalEndProductExportUsdMn: products.reduce(
      (sum, product) => sum + product.latestExportUsdMn,
      0,
    ),
    mappedImportUsdMn: mapped.reduce((sum, product) => sum + product.latestImportUsdMn, 0),
    mappedNetBalanceUsdMn: mapped.reduce((sum, product) => sum + product.netBalanceUsdMn, 0),
  },
  products,
};

const outputPath = path.join(root, 'data/domestic_value_chain_opportunities.json');
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(
  `Wrote ${products.length} end-product lines; ${mapped.length} have curated input maps.`,
);
