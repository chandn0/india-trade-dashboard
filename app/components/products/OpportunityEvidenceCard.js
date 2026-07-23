import * as React from 'react';
import { Box, Chip, Stack, Typography, Button } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { BuildRounded, EditOutlined, DatasetRounded } from '@mui/icons-material';
import { C, mono } from '../../theme.js';
import { moneyB } from '../../lib/format.js';
import Sparkline from '../charts/Sparkline.js';
import { calculateScenarioRange } from '../../lib/productLogic.js';

// Capitalize first letter of each word
const titleCase = (str) =>
  str
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

// Component to render stage chips, copied from Dashboard
function StageChip({ stage }) {
  const stageColors = {
    'raw material': '#a16207',
    'intermediate input': C.purple,
    'finished product': C.blue,
    'capital good': C.teal,
    'energy input': C.orange,
    'agricultural commodity': '#15803d',
    'consumption asset': '#be185d',
  };
  return (
    <Chip
      size="small"
      label={titleCase(stage)}
      sx={{
        height: 22,
        fontWeight: 700,
        color: stageColors[stage] || '#000',
        bgcolor: alpha(stageColors[stage] || '#000', 0.1),
        border: `1px solid ${alpha(stageColors[stage] || '#000', 0.2)}`,
      }}
    />
  );
}

export function OpportunityEvidenceCard({ selected, flowName, rankKey, historyKey, stageData }) {
  const accent = flowName === 'Imports' ? C.orange : C.blue;
  const partnerExposure =
    flowName === 'Imports'
      ? selected.partnerExposureUsdMn
      : selected.exportPartnerExposureUsdMn || [];
      
  // Calculate baseline scenario range using evidence defaults if available
  const substitution = selected.domesticSupply?.localisableSharePct != null 
    ? selected.domesticSupply.localisableSharePct 
    : 20;
  const importedInputShare = selected.domesticSupply?.replacementImportedInputPct != null 
    ? selected.domesticSupply.replacementImportedInputPct 
    : 35;
  const exportGrowth = 15;
  const realisation = 70;

  const { base, conservative, optimistic } = calculateScenarioRange(selected, {
    substitution,
    exportGrowth,
    importedInputShare,
    realisation,
  });

  return (
    <Stack spacing={2.5} sx={{ position: { lg: 'sticky' }, top: { lg: 92 } }}>
      <Box sx={{ pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography sx={{ ...mono, fontSize: 11, fontWeight: 800, color: accent }}>
              HS {selected.hscode} · {flowName} rank #{selected[rankKey]}
            </Typography>
            <Typography variant="h5" sx={{ mt: 0.5, lineHeight: 1.2 }}>
              {titleCase(selected.description.toLowerCase())}
            </Typography>
          </Box>
        </Box>

        {/* 0. Score / Ranking Explanation */}
        <Box sx={{ mt: 1.5, p: 1.25, borderRadius: 1.5, bgcolor: alpha(accent, 0.04), border: `1px solid ${alpha(accent, 0.15)}` }}>
           <Typography sx={{ fontSize: 10, fontWeight: 700, color: accent, textTransform: 'uppercase' }}>Why this ranks #{selected[rankKey]}</Typography>
           <Typography sx={{ mt: 0.5, fontSize: 11.5, color: 'text.secondary', lineHeight: 1.4 }}>
             Ranked primarily by gross {flowName.toLowerCase()} value ({moneyB(flowName === 'Imports' ? selected.latestImportUsdMn : selected.latestExportUsdMn)}).
             Tractability is influenced by its stage ({selected.productionStage}) and review status ({selected.reviewStatus}).
           </Typography>
        </Box>

        <Box sx={{ mt: 1.5, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <StageChip stage={selected.productionStage} />
          {selected.partnerRiskFlag && (
            <Chip
              size="small"
              label="Partner Risk"
              sx={{
                height: 22,
                fontWeight: 700,
                color: '#b91c1c',
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}
            />
          )}
          <Chip
            size="small"
            label={
              selected.reviewStatus === 'needs review'
                ? 'Rule-mapped (Needs review)'
                : `Status: ${titleCase(selected.reviewStatus)}`
            }
            sx={{
              height: 22,
              fontWeight: 700,
              color:
                selected.reviewStatus === 'reviewed'
                  ? '#15803d'
                  : selected.reviewStatus === 'mixed-use'
                    ? C.purple
                    : '#b45309',
              bgcolor:
                selected.reviewStatus === 'reviewed'
                  ? alpha('#15803d', 0.1)
                  : selected.reviewStatus === 'mixed-use'
                    ? alpha(C.purple, 0.1)
                    : alpha('#b45309', 0.1),
              border: `1px solid ${
                selected.reviewStatus === 'reviewed'
                  ? alpha('#15803d', 0.2)
                  : selected.reviewStatus === 'mixed-use'
                    ? alpha(C.purple, 0.2)
                    : alpha('#b45309', 0.2)
              }`,
            }}
          />
          <Chip size="small" variant="outlined" label={selected.sector} sx={{ height: 22 }} />
        </Box>
      </Box>

      {/* 1, 2, 3: Gross imports, Export offset, Net deficit */}
      <Box>
        <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Trade Balance & Trend
        </Typography>
        <Box sx={{ mt: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#fff', border: '1px solid', borderColor: 'divider' }}>
            <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Gross Imports</Typography>
            <Typography sx={{ ...mono, mt: 0.25, fontSize: 18, fontWeight: 800, color: C.orange }}>
              {moneyB(selected.latestImportUsdMn)}
            </Typography>
          </Box>
          <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#fff', border: '1px solid', borderColor: 'divider' }}>
            <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Gross Exports</Typography>
            <Typography sx={{ ...mono, mt: 0.25, fontSize: 18, fontWeight: 800, color: C.blue }}>
              {moneyB(selected.latestExportUsdMn)}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 2, bgcolor: alpha(C.ink, 0.03), display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Net Deficit</Typography>
            <Typography sx={{ ...mono, mt: 0.25, fontSize: 18, fontWeight: 800 }}>
              {selected.netBalanceUsdMn < 0 ? '−' : '+'}{moneyB(Math.abs(selected.netBalanceUsdMn))}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: 10, color: 'text.secondary', mb: 0.5 }}>5-year path</Typography>
            <Sparkline series={selected[historyKey]} color={accent} w={100} h={28} />
          </Box>
        </Box>
      </Box>

      {/* 8: Realistic net-impact range */}
      <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(C.teal, 0.08), border: `1px solid ${alpha(C.teal, 0.2)}` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: C.teal, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Illustrative Analyst Scenario
            </Typography>
            <Typography sx={{ mt: 0.5, fontSize: 11.5, color: 'text.secondary' }}>
              Assuming {substitution}% import sub. & {importedInputShare}% imported inputs.
              {selected.domesticSupply?.derivationMethod && ` (${selected.domesticSupply.derivationMethod})`}
            </Typography>
            <Typography sx={{ ...mono, mt: 0.5, fontSize: 22, fontWeight: 800, color: C.teal }}>
              {moneyB(base.netImpact)}
            </Typography>
            <Typography sx={{ mt: 0.25, fontSize: 10.5, color: 'text.secondary' }}>
              Variance range: {moneyB(conservative.netImpact)} to {moneyB(optimistic.netImpact)}
            </Typography>
          </Box>
          <Button
            size="small"
            variant="outlined"
            href="#scenario"
            color="inherit"
            startIcon={<EditOutlined />}
            sx={{ fontSize: 10, bgcolor: '#fff' }}
          >
            Tweak Scenario
          </Button>
        </Box>
      </Box>

      {/* 4: Physical Dependence Dashboard */}
      {selected.quantityUnitValue ? (
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(C.purple, 0.04), border: `1px solid ${alpha(C.purple, 0.16)}` }}>
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
                      {selected.quantityUnitValue.imports.quantity != null ? (selected.quantityUnitValue.imports.quantity / 1e6).toFixed(2) + 'M ' + (selected.quantityUnitValue.imports.quantityUnit || '').replace('_', ' ') : 'N/A'}
                    </Typography>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: selected.quantityUnitValue.imports.quantityChangePct > 0 ? C.red : '#15803d' }}>
                      {selected.quantityUnitValue.imports.quantityChangePct > 0 ? '+' : ''}{selected.quantityUnitValue.imports.quantityChangePct}% YoY
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>Unit value</Typography>
                    <Typography sx={{ ...mono, fontSize: 14, fontWeight: 800 }}>
                      ${selected.quantityUnitValue.imports.unitValueUsd}
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
                      {selected.quantityUnitValue.exports.quantity != null ? (selected.quantityUnitValue.exports.quantity / 1e6).toFixed(2) + 'M ' + (selected.quantityUnitValue.exports.quantityUnit || '').replace('_', ' ') : 'N/A'}
                    </Typography>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: selected.quantityUnitValue.exports.quantityChangePct > 0 ? '#15803d' : C.red }}>
                      {selected.quantityUnitValue.exports.quantityChangePct > 0 ? '+' : ''}{selected.quantityUnitValue.exports.quantityChangePct}% YoY
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>Unit value</Typography>
                    <Typography sx={{ ...mono, fontSize: 14, fontWeight: 800 }}>
                      ${selected.quantityUnitValue.exports.unitValueUsd}
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
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(C.purple, 0.02), border: `1px dashed ${alpha(C.purple, 0.15)}` }}>
          <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: alpha(C.purple, 0.5), textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Physical Dependence Dashboard
          </Typography>
          <Typography sx={{ mt: 0.25, fontSize: 11.5, color: 'text.secondary' }}>Evidence unavailable.</Typography>
        </Box>
      )}

      {/* 5: Partner concentration */}
      {selected.productPartnerExposure ? (
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(C.blue, 0.04), border: `1px solid ${alpha(C.blue, 0.16)}` }}>
          <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {selected.productPartnerExposure.grain === 'chapter_proxy' ? 'Chapter Proxy Top Partners' : 'Product Top Partners'}
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
                      <Box sx={{ width: `${Math.min(p.share, 100)}%`, height: '100%', bgcolor: C.blue, borderRadius: 99 }} />
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
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(C.blue, 0.04), border: `1px solid ${alpha(C.blue, 0.16)}` }}>
          <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Chapter {selected.chapterPartnerExposure.grain.replace("HS-", "")} Top Partners (Proxy)
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
                        <Box sx={{ width: `${Math.min(p.sharePct, 100)}%`, height: '100%', bgcolor: C.blue, borderRadius: 99 }} />
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
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(C.blue, 0.02), border: `1px dashed ${alpha(C.blue, 0.15)}` }}>
          <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: alpha(C.blue, 0.5), textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Partner concentration
          </Typography>
          <Typography sx={{ mt: 0.25, fontSize: 11.5, color: 'text.secondary' }}>Evidence unavailable.</Typography>
        </Box>
      )}

      {/* Evidence Completeness Indicators */}
      <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid', borderColor: 'divider' }}>
        <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Evidence Completeness
        </Typography>
        <Box sx={{ mt: 1.5, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             <Typography sx={{ fontSize: 14 }}>{selected.quantityUnitValue ? '🟢' : '🔴'}</Typography>
             <Typography sx={{ fontSize: 11, fontWeight: 600 }}>Trade/Price</Typography>
           </Box>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             <Typography sx={{ fontSize: 14 }}>{selected.productPartnerExposure || selected.chapterPartnerExposure ? '🟢' : '🔴'}</Typography>
             <Typography sx={{ fontSize: 11, fontWeight: 600 }}>Partner</Typography>
           </Box>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             <Typography sx={{ fontSize: 14 }}>{selected.domesticSupply ? '🟢' : '🔴'}</Typography>
             <Typography sx={{ fontSize: 11, fontWeight: 600 }}>Domestic Supply</Typography>
           </Box>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             <Typography sx={{ fontSize: 14 }}>{selected.policyOverlay ? '🟢' : '🔴'}</Typography>
             <Typography sx={{ fontSize: 11, fontWeight: 600 }}>Policy</Typography>
           </Box>
        </Box>
      </Box>

      {/* 5.5: State Capability */
      selected.stateCapability && selected.stateCapability.length > 0 && (
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(C.teal, 0.04), border: `1px solid ${alpha(C.teal, 0.2)}` }}>
          <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: C.teal, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            State Capability
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {selected.stateCapability.map((state, idx) => (
              <Box key={idx} sx={{ p: 1, bgcolor: '#fff', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                <Typography sx={{ fontSize: 11, fontWeight: 800 }}>{state.state}</Typography>
                <Box sx={{ mt: 0.5, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                  <Box>
                    <Typography sx={{ fontSize: 9, color: 'text.secondary' }}>Observed Production</Typography>
                    <Typography sx={{ ...mono, fontSize: 11.5, fontWeight: 600 }}>{moneyB(state.observedProductionUsdMn)}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 9, color: 'text.secondary' }}>Announced Capacity</Typography>
                    <Typography sx={{ ...mono, fontSize: 11.5, fontWeight: 600 }}>{moneyB(state.announcedCapacityUsdMn)}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 9, color: 'text.secondary' }}>Investment</Typography>
                    <Typography sx={{ ...mono, fontSize: 11.5, fontWeight: 600 }}>{moneyB(state.investmentUsdMn)}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 9, color: 'text.secondary' }}>Employment</Typography>
                    <Typography sx={{ ...mono, fontSize: 11.5, fontWeight: 600 }}>{state.employment.toLocaleString()}</Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* 6: Domestic capacity/production */}
      {selected.domesticSupply ? (
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(C.orange, 0.04), border: `1px solid ${alpha(C.orange, 0.2)}` }}>
          <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: C.orange, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Domestic capacity
          </Typography>
          <Box sx={{ mt: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            {selected.domesticSupply.domesticProduction !== null ? (
              <Box>
                <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>Production {selected.domesticSupply.productionScope && `(${selected.domesticSupply.productionScope})`}</Typography>
                <Typography sx={{ ...mono, fontSize: 14, fontWeight: 800 }}>
                  {moneyB(selected.domesticSupply.domesticProduction)}
                </Typography>
              </Box>
            ) : (
              <Box>
                <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>Production</Typography>
                <Typography sx={{ ...mono, fontSize: 12, fontWeight: 600 }}>Evidence unavailable</Typography>
              </Box>
            )}
            {selected.domesticSupply.localisableSharePct !== null && (
              <Box>
                <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>Localisable Share</Typography>
                <Typography sx={{ ...mono, fontSize: 14, fontWeight: 800, color: C.teal }}>
                  {selected.domesticSupply.localisableSharePct}%
                </Typography>
              </Box>
            )}
          </Box>
          <Typography sx={{ mt: 1, fontSize: 10.5, lineHeight: 1.55, color: 'text.secondary' }}>
            {selected.domesticSupply.evidenceNote}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(C.orange, 0.02), border: `1px dashed ${alpha(C.orange, 0.15)}` }}>
          <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: alpha(C.orange, 0.5), textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Domestic capacity
          </Typography>
          <Typography sx={{ mt: 0.25, fontSize: 11.5, color: 'text.secondary' }}>Evidence unavailable.</Typography>
        </Box>
      )}

      {/* 7: Buildability and Policy (Constraints) */}
      {selected.buildability || selected.policyOverlay ? (
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(C.ink, 0.03), border: `1px solid ${alpha(C.ink, 0.12)}` }}>
          <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: C.ink, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Buildability & Constraints
          </Typography>
          {selected.buildability && (
            <Typography sx={{ mt: 0.75, fontSize: 12.5 }}>
              <strong>{titleCase(selected.buildability.category)}</strong> · {titleCase(selected.buildability.lever)}
            </Typography>
          )}
          {selected.policyOverlay && (
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
          )}
        </Box>
      ) : (
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(C.ink, 0.02), border: `1px dashed ${alpha(C.ink, 0.12)}` }}>
          <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: alpha(C.ink, 0.35), textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Buildability & Constraints
          </Typography>
          <Typography sx={{ mt: 0.25, fontSize: 11.5, color: 'text.secondary' }}>Evidence unavailable.</Typography>
        </Box>
      )}

      {/* 9: Confidence / Missing Evidence summary */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <DatasetRounded sx={{ color: 'text.disabled', fontSize: 20 }} />
        <Typography sx={{ fontSize: 10.5, color: 'text.secondary', lineHeight: 1.55 }}>
          <strong>Classification confidence {selected.confidence}/5.</strong>
          {!selected.quantityUnitValue || !selected.chapterPartnerExposure || !selected.domesticSupply || !selected.buildability ? (
            <span> Some structured evidence is missing. Reviewer notes: {selected.attributionReason}</span>
          ) : (
            <span> Full structured evidence available.</span>
          )}
        </Typography>
      </Box>

    </Stack>
  );
}
