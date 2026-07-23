import fs from 'fs';
import path from 'path';

const pcdPath = path.join(process.cwd(), 'app/components/products/ProductCompositionDashboard.js');
let content = fs.readFileSync(pcdPath, 'utf8');

const oldStageComparisonMatch = content.match(/function StageComparison\(\) \{[\s\S]*?return \([\s\S]*?\}\);\s*\}/);
if (!oldStageComparisonMatch) {
  console.log("StageComparison not found!");
  process.exit(1);
}
const oldStageComparison = oldStageComparisonMatch[0];

const newStageComparison = `function StageComparison() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const rows = stageOrder.map((stage) => {
    const importStage = imports.stages.find((item) => item.stage === stage);
    const exportStage = exports.stages.find((item) => item.stage === stage);
    const balance = stageData.stageBalances.find((item) => item.stage === stage);
    return {
      stage,
      importValue: importStage?.valueUsdMn ?? 0,
      exportValue: exportStage?.valueUsdMn ?? 0,
      importShare: importStage?.sharePct ?? 0,
      exportShare: exportStage?.sharePct ?? 0,
      importChangePct: balance?.importChangePct ?? 0,
      exportChangePct: balance?.exportChangePct ?? 0,
      netBalanceUsdMn: balance?.netBalanceUsdMn ?? 0,
    };
  });
  const maxValue = Math.max(...rows.flatMap((row) => [row.importValue, row.exportValue]));

  return (
    <Paper sx={{ ...cardSx, p: 0, overflow: 'hidden' }}>
      <Box sx={{ p: { xs: 2, md: 2.5 }, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="overline" sx={{ color: C.purple }}>Stage comparison</Typography>
          <Typography variant="h5">Where imports and exports sit in the value chain</Typography>
          <Typography sx={{ mt: 0.5, fontSize: 12.5, color: 'text.secondary' }}>Values and 5-year change for every available HS-4 line.</Typography>
        </Box>
        <CompareArrowsRounded sx={{ color: C.purple, fontSize: 30 }} />
      </Box>
      <Box sx={{ p: { xs: 2, md: 2.5 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '130px 1fr 92px 1fr 92px 120px', gap: 1, alignItems: 'center', mb: 1 }}>
          <Typography sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>Stage</Typography>
          <Typography sx={{ fontSize: 10, fontWeight: 800, color: C.orange, textTransform: 'uppercase' }}>Imports (5yr chg)</Typography>
          <Box />
          <Typography sx={{ fontSize: 10, fontWeight: 800, color: C.blue, textTransform: 'uppercase' }}>Exports (5yr chg)</Typography>
          <Box />
          <Typography sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', textAlign: 'right' }}>Net Balance</Typography>
        </Box>
        {rows.map((row) => {
          const coverage = row.importValue ? (row.exportValue / row.importValue) * 100 : null;
          return (
            <Box key={row.stage} sx={{ display: 'grid', gridTemplateColumns: '130px 1fr 92px 1fr 92px 120px', gap: 1, alignItems: 'center', py: 1.15, borderTop: '1px solid', borderColor: 'divider' }}>
              <Box>
                <Typography sx={{ fontSize: 11.5, fontWeight: 800, color: stageColors[row.stage] }}>{titleCase(row.stage)}</Typography>
                {coverage !== null && <Typography sx={{ ...mono, mt: 0.2, fontSize: 9.5, color: 'text.secondary' }}>{coverage.toFixed(0)}% export/import</Typography>}
              </Box>
              <Box sx={{ height: 9, borderRadius: 99, bgcolor: alpha(C.orange, 0.08), overflow: 'hidden' }}>
                <Box sx={{ width: \`\${(row.importValue / maxValue) * 100}%\`, height: '100%', bgcolor: C.orange, borderRadius: 99 }} />
              </Box>
              <Typography sx={{ ...mono, textAlign: 'right', fontSize: 11.5, fontWeight: 800 }}>
                {moneyB(row.importValue)}
                <Box component="span" sx={{ display: 'block', fontFamily: 'inherit', fontSize: 9, fontWeight: 500, color: row.importChangePct > 0 ? C.orange : 'text.secondary' }}>
                  {row.importChangePct > 0 ? '+' : ''}{row.importChangePct.toFixed(1)}%
                </Box>
              </Typography>
              <Box sx={{ height: 9, borderRadius: 99, bgcolor: alpha(C.blue, 0.08), overflow: 'hidden' }}>
                <Box sx={{ width: \`\${(row.exportValue / maxValue) * 100}%\`, height: '100%', bgcolor: C.blue, borderRadius: 99 }} />
              </Box>
              <Typography sx={{ ...mono, textAlign: 'right', fontSize: 11.5, fontWeight: 800 }}>
                {moneyB(row.exportValue)}
                <Box component="span" sx={{ display: 'block', fontFamily: 'inherit', fontSize: 9, fontWeight: 500, color: row.exportChangePct > 0 ? C.blue : 'text.secondary' }}>
                  {row.exportChangePct > 0 ? '+' : ''}{row.exportChangePct.toFixed(1)}%
                </Box>
              </Typography>
              <Typography sx={{ ...mono, textAlign: 'right', fontSize: 11.5, fontWeight: 800, color: row.netBalanceUsdMn < 0 ? C.orange : C.blue }}>
                {row.netBalanceUsdMn < 0 ? '−' : '+'}{moneyB(Math.abs(row.netBalanceUsdMn))}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}`;

content = content.replace(oldStageComparison, newStageComparison);

const newComponents = `

function SectorStageHeatmap() {
  const sectors = [...new Set(imports.products.map(p => p.sector))].sort();
  const stages = ['raw material', 'intermediate input', 'finished product'];
  
  const heatmapData = sectors.map(sector => {
    const row = { sector };
    stages.forEach(stage => {
      const stageProducts = imports.products.filter(p => p.sector === sector && p.productionStage === stage);
      row[\`\${stage}_import\`] = stageProducts.reduce((sum, p) => sum + p.latestImportUsdMn, 0);
      
      const exportStageProducts = exports.products.filter(p => p.sector === sector && p.productionStage === stage);
      row[\`\${stage}_export\`] = exportStageProducts.reduce((sum, p) => sum + p.latestExportUsdMn, 0);
    });
    return row;
  });

  return (
    <Paper sx={{ ...cardSx, p: 2.5, mt: 3, mb: 3 }}>
      <Typography variant="h6">Sector × Product-Stage Heatmap</Typography>
      <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 2 }}>
        Identifies sectors that import upstream inputs but export finished goods.
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: 11, fontWeight: 800 }}>Sector</TableCell>
              {stages.map(stage => (
                <TableCell key={stage} align="right" sx={{ fontSize: 11, fontWeight: 800 }}>{titleCase(stage)} (Imp/Exp)</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {heatmapData.map(row => (
              <TableRow key={row.sector}>
                <TableCell sx={{ fontSize: 11.5, fontWeight: 600 }}>{row.sector}</TableCell>
                {stages.map(stage => {
                  const imp = row[\`\${stage}_import\`];
                  const exp = row[\`\${stage}_export\`];
                  const depRatio = imp / (imp + exp + 1);
                  const color = \`rgba(249, 115, 22, \${depRatio * 0.4})\`;
                  return (
                    <TableCell key={stage} align="right" sx={{ ...mono, fontSize: 11, bgcolor: color }}>
                      <Box component="span" sx={{ color: C.orange }}>{moneyB(imp)}</Box> / <Box component="span" sx={{ color: C.blue }}>{moneyB(exp)}</Box>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

function ValueChainFlow({ activeFlowData }) {
  return (
    <Paper sx={{ ...cardSx, p: 2.5, mt: 3, mb: 3 }}>
      <Typography variant="h6">Value-Chain Position</Typography>
      <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 2 }}>
        Raw material → Intermediate → Component → Finished good → Export
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: alpha(C.ink, 0.03), p: 2, borderRadius: 2 }}>
        {['raw material', 'intermediate input', 'finished product'].map((stage, idx) => {
          const value = activeFlowData.filter(p => p.productionStage === stage).reduce((sum, p) => sum + (p.latestImportUsdMn || 0), 0);
          return (
            <React.Fragment key={stage}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: 11, fontWeight: 800, color: stageColors[stage], textTransform: 'uppercase' }}>{titleCase(stage)}</Typography>
                <Typography sx={{ ...mono, fontSize: 16, fontWeight: 700, mt: 0.5 }}>{moneyB(value)}</Typography>
              </Box>
              {idx < 2 && <ArrowForwardRounded sx={{ color: 'text.secondary' }} />}
            </React.Fragment>
          );
        })}
      </Box>
    </Paper>
  );
}

function TaxonomyBreadcrumbs({ sector, hs2, onClearSector, onClearHs2 }) {
  if (!sector && !hs2) return null;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      <Typography sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600 }}>Taxonomy Drill-down:</Typography>
      {sector && (
        <Chip label={sector} size="small" onDelete={onClearSector} sx={{ height: 24, fontSize: 11, fontWeight: 600 }} />
      )}
      {hs2 && (
        <>
          <ArrowForwardRounded sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Chip label={\`Chapter \${hs2}\`} size="small" onDelete={onClearHs2} sx={{ height: 24, fontSize: 11, fontWeight: 600 }} />
        </>
      )}
    </Box>
  );
}

function CohortComparison() {
  const buildable = imports.products.filter(p => p.buildability?.category === 'buildable').reduce((sum, p) => sum + p.latestImportUsdMn, 0);
  const structural = imports.products.filter(p => p.buildability?.category === 'structural').reduce((sum, p) => sum + p.latestImportUsdMn, 0);
  
  return (
    <Paper sx={{ ...cardSx, p: 2.5, mt: 3, mb: 3 }}>
      <Typography variant="h6">Cohort Comparisons</Typography>
      <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 2 }}>
        Comparing macroeconomic aggregates.
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Box sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
           <Typography sx={{ fontSize: 11, fontWeight: 800, color: C.teal, textTransform: 'uppercase' }}>Buildable Interventions</Typography>
           <Typography sx={{ ...mono, fontSize: 24, fontWeight: 800, mt: 0.5 }}>{moneyB(buildable)}</Typography>
        </Box>
        <Box sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
           <Typography sx={{ fontSize: 11, fontWeight: 800, color: C.orange, textTransform: 'uppercase' }}>Structural Limits</Typography>
           <Typography sx={{ ...mono, fontSize: 24, fontWeight: 800, mt: 0.5 }}>{moneyB(structural)}</Typography>
        </Box>
      </Box>
    </Paper>
  );
}
`;

content = content.replace('function StageComparison() {', newComponents + '\nfunction StageComparison() {');

const renderTarget = `        <Stack spacing={{ xs: 2, md: 3 }}>
          <StageComparison />
          <MixCard flow={imports} />`;

const renderReplacement = `        <Stack spacing={{ xs: 2, md: 3 }}>
          <StageComparison />
          <SectorStageHeatmap />
          <ValueChainFlow activeFlowData={imports.products} />
          <CohortComparison />
          <MixCard flow={imports} />`;

content = content.replace(renderTarget, renderReplacement);

const thTarget = `<TableCell align="right" sx={{ color: 'text.secondary' }}>
                        Value (USD mn)
                      </TableCell>`;
const thReplacement = `<TableCell align="right" sx={{ color: 'text.secondary' }}>
                        Deficit Contrib.
                      </TableCell>
                      <TableCell align="right" sx={{ color: 'text.secondary' }}>
                        Value (USD mn)
                      </TableCell>`;
content = content.replace(thTarget, thReplacement);

const tdTarget = `<TableCell align="right" sx={{ ...mono, fontWeight: 800, color: accent }}>
                        {moneyB(product[valueKey])}
                      </TableCell>`;
const tdReplacement = `<TableCell align="right" sx={{ ...mono, fontWeight: 600, fontSize: 11, color: 'text.secondary' }}>
                        {product.contributionToDeficitChangePct ? product.contributionToDeficitChangePct.toFixed(2) + '%' : '0%'}
                      </TableCell>
                      <TableCell align="right" sx={{ ...mono, fontWeight: 800, color: accent }}>
                        {moneyB(product[valueKey])}
                        {product.isMirror && <Tooltip title="High simultaneous import & export (re-export/processing pattern)"><Chip size="small" label="Mirror" sx={{ ml: 1, height: 16, fontSize: 9, bgcolor: alpha(C.purple, 0.1), color: C.purple }} /></Tooltip>}
                      </TableCell>`;
content = content.replace(tdTarget, tdReplacement);

const breadcrumbTarget = `      <Box sx={{ mt: 2, mb: { xs: 2, md: 3 } }}>
        <TextField`;
const breadcrumbReplacement = `      <Box sx={{ mt: 2, mb: { xs: 2, md: 3 } }}>
        <TaxonomyBreadcrumbs sector={sector} hs2={hs2} onClearSector={() => setSector('')} onClearHs2={() => setHs2('')} />
        <TextField`;

content = content.replace(breadcrumbTarget, breadcrumbReplacement);

fs.writeFileSync(pcdPath, content);
console.log('Successfully injected Wave 3 components into ProductCompositionDashboard.js');
