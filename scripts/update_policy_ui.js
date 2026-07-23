import fs from 'fs';
import path from 'path';

const cardPath = path.join(process.cwd(), 'app/components/products/OpportunityEvidenceCard.js');
let cardContent = fs.readFileSync(cardPath, 'utf8');

const targetUI = `{selected.policyOverlay && (
            <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {selected.policyOverlay.bcdRange ? (
                <Chip size="small" label={\`BCD \${selected.policyOverlay.bcdRange}\`} variant="outlined" />
              ) : selected.policyOverlay.bcdPct !== null ? (
                <Chip size="small" label={\`BCD \${selected.policyOverlay.bcdPct}%\`} variant="outlined" />
              ) : null}
              {selected.policyOverlay.applicableHs6 && (
                <Typography sx={{ fontSize: 10, color: 'text.secondary', alignSelf: 'center', ml: 0.5 }}>
                  (Applies to {selected.policyOverlay.applicableHs6})
                </Typography>
              )}
              {selected.policyOverlay.pliCoverage && selected.policyOverlay.pliCoverage !== 'No' && (
                <Chip size="small" label="PLI covered" sx={{ bgcolor: alpha('#15803d', 0.08), color: '#15803d', borderColor: alpha('#15803d', 0.25) }} variant="outlined" />
              )}
              {selected.policyOverlay.restrictionStatus && selected.policyOverlay.restrictionStatus !== 'Unrestricted' && (
                <Chip size="small" label={selected.policyOverlay.restrictionStatus} sx={{ bgcolor: alpha(C.red, 0.08), color: C.red, borderColor: alpha(C.red, 0.25) }} variant="outlined" />
              )}
            </Box>
          )}`;

const replacementUI = `{selected.policyOverlay && (
            <Box sx={{ mt: 1.5, p: 1.5, bgcolor: '#fff', borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
              <Typography sx={{ fontSize: 10, fontWeight: 800, color: C.purple, mb: 1, textTransform: 'uppercase' }}>Active Policy Overlay</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                {selected.policyOverlay.measureType && (
                  <Chip size="small" label={selected.policyOverlay.measureType} sx={{ bgcolor: alpha(C.purple, 0.08), color: C.purple, borderColor: alpha(C.purple, 0.25) }} variant="outlined" />
                )}
                {selected.policyOverlay.status && (
                  <Chip size="small" label={selected.policyOverlay.status} sx={{ bgcolor: alpha('#15803d', 0.08), color: '#15803d', borderColor: alpha('#15803d', 0.25) }} variant="outlined" />
                )}
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                <Box>
                  <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>Affected Scope</Typography>
                  <Typography sx={{ fontSize: 11.5, fontWeight: 600 }}>{selected.policyOverlay.exactAffectedScope || 'All'}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>Effective Date</Typography>
                  <Typography sx={{ fontSize: 11.5, fontWeight: 600 }}>{selected.policyOverlay.effectiveDate || 'Unknown'}</Typography>
                </Box>
              </Box>
            </Box>
          )}`;

cardContent = cardContent.replace(targetUI, replacementUI);

fs.writeFileSync(cardPath, cardContent);
console.log('Updated policy overlay UI in OpportunityEvidenceCard.js');
