import fs from 'fs';
import path from 'path';

const policyPath = path.join(process.cwd(), 'data/enrichment/product_policy.csv');
let content = fs.readFileSync(policyPath, 'utf8');

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
// 2: applicable_hs6
// 3: bcd_range
// 4: basic_customs_duty_pct
// 5: effective_tariff_pct

const updatedRows = rows.map(row => {
  if (row.length < 14) return row;
  const hscode = row[0];
  
  if (hscode === '8517') {
    row[2] = '8517.13 (Smartphones), 8517.70 (Parts)';
    row[3] = '0% - 20%';
    row[4] = '';
    row[5] = '';
  } else if (hscode === '8471') {
    row[2] = '8471.30 (Laptops), 8471.41 (Subassemblies)';
    row[3] = '0% - 20%';
    row[4] = '';
    row[5] = '';
  } else if (hscode === '8507') {
    row[2] = '8507.20 (Lead-acid), 8507.60 (Li-ion)';
    row[3] = 'lower rates - 15%';
    row[4] = '';
    row[5] = '';
  }
  return row;
});

const policyCsv = updatedRows.map(row => row.map(cell => {
  if (cell && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))) {
    return '"' + cell.replace(/"/g, '""') + '"';
  }
  return cell;
}).join(',')).join('\n');

fs.writeFileSync(policyPath, policyCsv);
console.log('Policy CSV updated.');
