import fs from 'fs';
import path from 'path';

const uiPath = path.join(process.cwd(), 'app/components/products/OpportunityEvidenceCard.js');
let content = fs.readFileSync(uiPath, 'utf8');

const partnerRegex = /\{\/\* 5: Partner concentration \*\/\}[\s\S]*?\{\/\* 6: Domestic capacity\/production \*\/\}/;

const partnerReplacement = `{/* 5: Partner concentration */}
      {selected.productPartnerExposure ? (
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(C.blue, 0.04), border: \`1px solid \${alpha(C.blue, 0.16)}\` }}>
          <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Product Top Partners
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Top import origins
            </Typography>
            <Stack spacing={0.5} sx={{ mt: 0.75 }}>
              {[
                { name: selected.productPartnerExposure.topPartner, share: selected.productPartnerExposure.topPartnerSharePct },
                { name: selected.productPartnerExposure.secondPartner, share: selected.productPartnerExposure.secondPartnerSharePct },
                { name: selected.productPartnerExposure.thirdPartner, share: selected.productPartnerExposure.thirdPartnerSharePct },
              ].filter(p => p.name).map((p) => (
                <Box key={p.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: 11.5, fontWeight: 600 }}>{p.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 60, height: 5, borderRadius: 99, bgcolor: alpha(C.blue, 0.12), overflow: 'hidden' }}>
                      <Box sx={{ width: \`\${Math.min(p.share, 100)}%\`, height: '100%', bgcolor: C.blue, borderRadius: 99 }} />
                    </Box>
                    <Typography sx={{ ...mono, fontSize: 10.5, fontWeight: 800, color: C.blue, minWidth: 30, textAlign: 'right' }}>
                      {p.share.toFixed(0)}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
          <Typography sx={{ mt: 1, fontSize: 10, color: 'text.secondary', lineHeight: 1.5 }}>
            {selected.productPartnerExposure.evidenceNote}
          </Typography>
        </Box>
      ) : selected.chapterPartnerExposure ? (
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(C.blue, 0.04), border: \`1px solid \${alpha(C.blue, 0.16)}\` }}>
          <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Chapter {selected.chapterPartnerExposure.grain.replace("HS-", "")} Top Partners
          </Typography>
          {selected.chapterPartnerExposure.imports.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography sx={{ fontSize: 10, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Top import origins
              </Typography>
              <Stack spacing={0.5} sx={{ mt: 0.75 }}>
                {selected.chapterPartnerExposure.imports.slice(0, 3).map((p) => (
                  <Box key={p.country} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: 11.5, fontWeight: 600 }}>{titleCase(p.country.toLowerCase())}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 60, height: 5, borderRadius: 99, bgcolor: alpha(C.blue, 0.12), overflow: 'hidden' }}>
                        <Box sx={{ width: \`\${Math.min(p.sharePct, 100)}%\`, height: '100%', bgcolor: C.blue, borderRadius: 99 }} />
                      </Box>
                      <Typography sx={{ ...mono, fontSize: 10.5, fontWeight: 800, color: C.blue, minWidth: 30, textAlign: 'right' }}>
                        {p.sharePct.toFixed(0)}%
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
          <Typography sx={{ mt: 1, fontSize: 10, color: 'text.secondary', lineHeight: 1.5 }}>
            {selected.chapterPartnerExposure.imports[0]?.evidenceNote}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(C.blue, 0.02), border: \`1px dashed \${alpha(C.blue, 0.15)}\` }}>
          <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: alpha(C.blue, 0.5), textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Partner concentration
          </Typography>
          <Typography sx={{ mt: 0.25, fontSize: 11.5, color: 'text.secondary' }}>Evidence unavailable.</Typography>
        </Box>
      )}

      {/* 6: Domestic capacity/production */}`;

content = content.replace(partnerRegex, partnerReplacement);

const priceRegex = /\{\/\* 4: Price-vs-volume movement \*\/\}[\s\S]*?\{\/\* 5: Partner concentration \*\/\}/;

const priceReplacement = `{/* 4: Price-vs-volume movement */}
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
      )}

      {/* 5: Partner concentration */}`;

content = content.replace(priceRegex, priceReplacement);

fs.writeFileSync(uiPath, content);
console.log('Updated OpportunityEvidenceCard.js');
