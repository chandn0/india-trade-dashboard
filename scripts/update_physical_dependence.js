import fs from 'fs';
import path from 'path';

const cardPath = path.join(process.cwd(), 'app/components/products/OpportunityEvidenceCard.js');
let cardContent = fs.readFileSync(cardPath, 'utf8');

const target = `{/* 4: Price-vs-volume movement */}
      {selected.quantityUnitValue ? (
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(C.purple, 0.04), border: \`1px solid \${alpha(C.purple, 0.16)}\` }}>
          <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: C.purple, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Price vs volume dynamics
          </Typography>
          {selected.quantityUnitValue.imports && selected.quantityUnitValue.imports.length > 0 ? (
            <Box sx={{ mt: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <Box>
                <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>Physical quantity</Typography>
                <Typography sx={{ ...mono, fontSize: 14, fontWeight: 800 }}>
                  {(selected.quantityUnitValue.imports[0].quantity / 1e6).toFixed(2)}M {selected.quantityUnitValue.imports[0].quantityUnit.replace('_', ' ')}
                </Typography>
                <Typography sx={{ fontSize: 10, fontWeight: 700, color: selected.quantityUnitValue.imports[0].quantityChangePct > 0 ? C.red : '#15803d' }}>
                  {selected.quantityUnitValue.imports[0].quantityChangePct > 0 ? '+' : ''}{selected.quantityUnitValue.imports[0].quantityChangePct}% YoY
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>Unit value</Typography>
                <Typography sx={{ ...mono, fontSize: 14, fontWeight: 800 }}>
                  \${selected.quantityUnitValue.imports[0].unitValueUsd}
                </Typography>
                <Typography sx={{ fontSize: 10, fontWeight: 700, color: selected.quantityUnitValue.imports[0].unitValueChangePct > 0 ? C.red : '#15803d' }}>
                  {selected.quantityUnitValue.imports[0].unitValueChangePct > 0 ? '+' : ''}{selected.quantityUnitValue.imports[0].unitValueChangePct}% YoY
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography sx={{ mt: 0.5, fontSize: 11.5, color: 'text.secondary' }}>Import quantity data unavailable.</Typography>
          )}
        </Box>
      ) : (
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(C.purple, 0.02), border: \`1px dashed \${alpha(C.purple, 0.15)}\` }}>
          <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: alpha(C.purple, 0.5), textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Price vs volume dynamics
          </Typography>
          <Typography sx={{ mt: 0.25, fontSize: 11.5, color: 'text.secondary' }}>Evidence unavailable.</Typography>
        </Box>
      )}`;

const replacement = `{/* 4: Physical Dependence Dashboard */}
      {selected.quantityUnitValue ? (
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(C.purple, 0.04), border: \`1px solid \${alpha(C.purple, 0.16)}\` }}>
          <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: C.purple, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Physical Dependence Dashboard
          </Typography>
          <Typography sx={{ fontSize: 10, color: 'text.secondary', mb: 1.5 }}>
            Separating physical volume demand from unit price shocks.
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
            {selected.quantityUnitValue.imports && (
              <Box sx={{ p: 1.5, bgcolor: '#fff', borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
                <Typography sx={{ fontSize: 10, fontWeight: 800, color: C.orange, mb: 1, textTransform: 'uppercase' }}>Imports</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                  <Box>
                    <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>Physical quantity</Typography>
                    <Typography sx={{ ...mono, fontSize: 14, fontWeight: 800 }}>
                      {(selected.quantityUnitValue.imports.quantity / 1e6).toFixed(2)}M {selected.quantityUnitValue.imports.quantityUnit.replace('_', ' ')}
                    </Typography>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: selected.quantityUnitValue.imports.quantityChangePct > 0 ? C.red : '#15803d' }}>
                      {selected.quantityUnitValue.imports.quantityChangePct > 0 ? '+' : ''}{selected.quantityUnitValue.imports.quantityChangePct}% YoY
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>Unit value</Typography>
                    <Typography sx={{ ...mono, fontSize: 14, fontWeight: 800 }}>
                      \${selected.quantityUnitValue.imports.unitValueUsd}
                    </Typography>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: selected.quantityUnitValue.imports.unitValueChangePct > 0 ? C.red : '#15803d' }}>
                      {selected.quantityUnitValue.imports.unitValueChangePct > 0 ? '+' : ''}{selected.quantityUnitValue.imports.unitValueChangePct}% YoY
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {selected.quantityUnitValue.exports && (
              <Box sx={{ p: 1.5, bgcolor: '#fff', borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
                <Typography sx={{ fontSize: 10, fontWeight: 800, color: C.blue, mb: 1, textTransform: 'uppercase' }}>Exports</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                  <Box>
                    <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>Physical quantity</Typography>
                    <Typography sx={{ ...mono, fontSize: 14, fontWeight: 800 }}>
                      {(selected.quantityUnitValue.exports.quantity / 1e6).toFixed(2)}M {selected.quantityUnitValue.exports.quantityUnit.replace('_', ' ')}
                    </Typography>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: selected.quantityUnitValue.exports.quantityChangePct > 0 ? '#15803d' : C.red }}>
                      {selected.quantityUnitValue.exports.quantityChangePct > 0 ? '+' : ''}{selected.quantityUnitValue.exports.quantityChangePct}% YoY
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>Unit value</Typography>
                    <Typography sx={{ ...mono, fontSize: 14, fontWeight: 800 }}>
                      \${selected.quantityUnitValue.exports.unitValueUsd}
                    </Typography>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: selected.quantityUnitValue.exports.unitValueChangePct > 0 ? '#15803d' : C.red }}>
                      {selected.quantityUnitValue.exports.unitValueChangePct > 0 ? '+' : ''}{selected.quantityUnitValue.exports.unitValueChangePct}% YoY
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(C.purple, 0.02), border: \`1px dashed \${alpha(C.purple, 0.15)}\` }}>
          <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: alpha(C.purple, 0.5), textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Physical Dependence Dashboard
          </Typography>
          <Typography sx={{ mt: 0.25, fontSize: 11.5, color: 'text.secondary' }}>Evidence unavailable.</Typography>
        </Box>
      )}`;

cardContent = cardContent.replace(target, replacement);

fs.writeFileSync(cardPath, cardContent);
console.log('Updated physical dependence dashboard in OpportunityEvidenceCard.js');
