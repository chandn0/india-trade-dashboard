import fs from 'fs';
import path from 'path';

const pcdPath = path.join(process.cwd(), 'app/components/products/ProductCompositionDashboard.js');
let content = fs.readFileSync(pcdPath, 'utf8');

// 4. Update ProductExplorer table headers
const thTarget = `<TableCell
                      align="right"
                      sx={{ fontSize: 11.5, fontWeight: 800, color: 'text.secondary', whiteSpace: 'nowrap' }}
                    >
                      Value (USD mn)
                    </TableCell>`;
const thReplacement = `<TableCell
                      align="right"
                      sx={{ fontSize: 11.5, fontWeight: 800, color: 'text.secondary', whiteSpace: 'nowrap' }}
                    >
                      Deficit Contrib.
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontSize: 11.5, fontWeight: 800, color: 'text.secondary', whiteSpace: 'nowrap' }}
                    >
                      Value (USD mn)
                    </TableCell>`;
content = content.replace(thTarget, thReplacement);

// 5. Update ProductExplorer table cells
const tdTarget = `<TableCell
                      align="right"
                      sx={{ ...mono, fontSize: 11.5, fontWeight: 800, whiteSpace: 'nowrap' }}
                    >
                      {moneyB(product[valueKey])}
                    </TableCell>`;
const tdReplacement = `<TableCell align="right" sx={{ ...mono, fontWeight: 600, fontSize: 11, color: 'text.secondary' }}>
                        {product.contributionToDeficitChangePct ? product.contributionToDeficitChangePct.toFixed(2) + '%' : '0%'}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ ...mono, fontSize: 11.5, fontWeight: 800, whiteSpace: 'nowrap' }}
                      >
                        {moneyB(product[valueKey])}
                        {product.isMirror && (
                          <Tooltip title="High simultaneous import & export (re-export/processing pattern)">
                            <Chip size="small" label="Mirror" sx={{ ml: 1, height: 16, fontSize: 9, bgcolor: alpha(C.purple, 0.1), color: C.purple }} />
                          </Tooltip>
                        )}
                      </TableCell>`;
content = content.replace(tdTarget, tdReplacement);

fs.writeFileSync(pcdPath, content);
console.log('Updated table cells in ProductCompositionDashboard.js');
