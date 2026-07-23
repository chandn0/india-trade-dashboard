import fs from 'fs';
import path from 'path';

// 1. Fix domestic supply
const domCsvPath = 'data/enrichment/product_domestic_supply.csv';
let domCsv = fs.readFileSync(domCsvPath, 'utf8');

// replace header
domCsv = domCsv.replace(
  /"hscode","fiscal_year","domestic_production","production_unit","apparent_consumption","import_dependence_pct","capacity","capacity_utilisation_pct","evidence_note","source_url","source_date"/,
  '"hscode","fiscal_year","domestic_production","production_unit","apparent_consumption","localisable_share_pct","replacement_imported_input_pct","capacity","capacity_utilisation_pct","production_scope","derivation_method","source_document_section","evidence_note","source_url","source_date"'
);

// We need to parse and rewrite lines. Let's do it simply by adding 3 empty cols before evidence note.
// "capacity_utilisation_pct" is before "evidence_note".
// old: ...,"capacity_utilisation_pct","evidence_note",...
// new: ...,"capacity_utilisation_pct","production_scope","derivation_method","source_document_section","evidence_note",...
// Also split import_dependence_pct into localisable_share_pct and replacement_imported_input_pct.
const domLines = domCsv.split('\n');
const newDomLines = domLines.map((line, i) => {
  if (i === 0 || !line.trim()) return line;
  
  // parse csv line safely
  let fields = [];
  let current = '';
  let inQuotes = false;
  for (let c = 0; c < line.length; c++) {
    if (line[c] === '"') inQuotes = !inQuotes;
    else if (line[c] === ',' && !inQuotes) { fields.push(current); current = ''; }
    else current += line[c];
  }
  fields.push(current);

  // Field mapping:
  // 0: hscode
  // 1: fiscal_year
  // 2: domestic_production
  // 3: production_unit
  // 4: apparent_consumption
  // 5: import_dependence_pct
  // 6: capacity
  // 7: capacity_utilisation_pct
  // 8: evidence_note
  // 9: source_url
  // 10: source_date

  let [hs, fy, dom_prod, prod_unit, app_cons, imp_dep, cap, cap_util, ev, src_url, src_date] = fields;
  
  let loc_share = '';
  let rep_input = '';
  let prod_scope = '""';
  let der_method = '""';
  let src_doc = '""';

  // Fix values according to plan
  if (hs === '"8542"') {
    dom_prod = '""'; // clear unreproducible number
    cap = '""';
    loc_share = '"5"'; // highly structural
    rep_input = '"80"';
  } else if (hs === '"8541"') {
    dom_prod = '""';
    cap = '""';
    loc_share = '"40"';
    rep_input = '"60"';
  } else {
    // default migration for others
    if (imp_dep !== '""' && imp_dep !== '') {
      const dep = Number(imp_dep.replace(/"/g, ''));
      loc_share = `"${Math.max(0, 100 - dep)}"`;
      rep_input = `"${dep}"`;
    } else {
      loc_share = '""';
      rep_input = '""';
    }
  }

  // Combine new line
  return [hs, fy, dom_prod, prod_unit, app_cons, loc_share, rep_input, cap, cap_util, prod_scope, der_method, src_doc, ev, src_url, src_date].join(',');
});

fs.writeFileSync(domCsvPath, newDomLines.join('\n'));

// 2. Fix policy
const polCsvPath = 'data/enrichment/product_policy.csv';
let polCsv = fs.readFileSync(polCsvPath, 'utf8');

// header: "hscode","effective_from","basic_customs_duty_pct","effective_tariff_pct",...
polCsv = polCsv.replace(
  /"hscode","effective_from","basic_customs_duty_pct"/,
  '"hscode","effective_from","applicable_hs6","bcd_range","basic_customs_duty_pct"'
);

const polLines = polCsv.split('\n');
const newPolLines = polLines.map((line, i) => {
  if (i === 0 || !line.trim()) return line;
  
  let fields = [];
  let current = '';
  let inQuotes = false;
  for (let c = 0; c < line.length; c++) {
    if (line[c] === '"') inQuotes = !inQuotes;
    else if (line[c] === ',' && !inQuotes) { fields.push(current); current = ''; }
    else current += line[c];
  }
  fields.push(current);

  // 0: hscode
  // 1: effective_from
  // 2: bcd ...
  
  let applicable = '""';
  let range = '""';
  
  if (fields[0] === '"8541"') {
    applicable = '"8541.42 (Solar Cells), 8541.43 (PV Modules)"';
    range = '"0% - 25%"';
  }

  fields.splice(2, 0, applicable, range);
  return fields.join(',');
});

fs.writeFileSync(polCsvPath, newPolLines.join('\n'));
console.log('CSVs migrated.');
