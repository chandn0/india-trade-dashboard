import fs from 'fs';
import path from 'path';

const domPath = path.join(process.cwd(), 'data/enrichment/product_domestic_supply.csv');
let content = fs.readFileSync(domPath, 'utf8');

const parseCsvRow = (text) => {
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
      rows.push(row);
      row = [];
      field = '';
    } else field += char;
  }
  if (field || row.length) rows.push([...row, field]);
  return rows;
};

const rows = parseCsvRow(content);

// Indexes:
// 0: hscode
// 5: localisable_share_pct
// 6: replacement_imported_input_pct
// 9: production_scope
// 10: derivation_method
// 11: source_document_section

const updatedRows = rows.map(row => {
  if (row.length < 15) return row;
  const hscode = row[0];
  
  if (hscode === '8471') {
    row[5] = '15';
    row[6] = '85';
  }
  
  if (['8517', '8507', '8542', '8541', '8471'].includes(hscode)) {
    row[9] = 'Finished assembly only';
    row[10] = 'Analyst assumption based on evidence note';
    row[11] = 'PLI Scheme Guidelines';
  }
  return row;
});

const domCsv = updatedRows.map(row => row.map(cell => {
  if (cell && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))) {
    return '"' + cell.replace(/"/g, '""') + '"';
  }
  return cell;
}).join(',')).join('\n');

fs.writeFileSync(domPath, domCsv);
console.log('Supply CSV updated.');
