import * as React from 'react';
import { Box, Chip, Stack, Typography, Button, Tooltip } from '@mui/material';
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
    'agricultural commodity': '#5f7b58',
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
  const substitution =
    selected.domesticSupply?.analystLocalisableSharePct != null
      ? selected.domesticSupply.analystLocalisableSharePct
      : 20;
  const importedInputShare = 35;
  const exportGrowth = 15;
  const realisation = 70;
  const hasScenarioEvidence = selected.domesticSupply?.analystLocalisableSharePct != null;

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
        <Box
          sx={{
            mt: 1.5,
            p: 1.25,
            borderRadius: 1.5,
            bgcolor: alpha(accent, 0.04),
            border: `1px solid ${alpha(accent, 0.15)}`,
          }}
        >
          <Typography
            sx={{ fontSize: 10, fontWeight: 700, color: accent, textTransform: 'uppercase' }}
          >
            Evidence behind rank #{selected[rankKey]}
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: 11.5, color: 'text.secondary', lineHeight: 1.4 }}>
            Ranked primarily by gross {flowName.toLowerCase()} value (
            {moneyB(
              flowName === 'Imports' ? selected.latestImportUsdMn : selected.latestExportUsdMn,
            )}
            ). Tractability is influenced by its stage ({selected.productionStage}) and review
            status ({selected.reviewStatus}).
          </Typography>
        </Box>

        <Box sx={{ mt: 1.5, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <Tooltip title="Production stage attributions are heading-level and flow-neutral">
            <Box>
              <StageChip stage={selected.productionStage} />
            </Box>
          </Tooltip>
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
                  ? '#5f7b58'
                  : selected.reviewStatus === 'mixed-use'
                    ? C.purple
                    : '#b45309',
              bgcolor:
                selected.reviewStatus === 'reviewed'
                  ? alpha('#5f7b58', 0.1)
                  : selected.reviewStatus === 'mixed-use'
                    ? alpha(C.purple, 0.1)
                    : alpha('#b45309', 0.1),
              border: `1px solid ${
                selected.reviewStatus === 'reviewed'
                  ? alpha('#5f7b58', 0.2)
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
        <Typography
          sx={{
            fontSize: 10.5,
            fontWeight: 800,
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Trade Balance & Trend
        </Typography>
        <Box sx={{ mt: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: '#fff',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Gross Imports</Typography>
            <Typography sx={{ ...mono, mt: 0.25, fontSize: 18, fontWeight: 800, color: C.orange }}>
              {moneyB(selected.latestImportUsdMn)}
            </Typography>
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: '#fff',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Gross Exports</Typography>
            <Typography sx={{ ...mono, mt: 0.25, fontSize: 18, fontWeight: 800, color: C.blue }}>
              {moneyB(selected.latestExportUsdMn)}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            mt: 1.5,
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(C.ink, 0.03),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
              Net Balance ({selected.netBalanceUsdMn > 0 ? 'Surplus' : 'Deficit'})
            </Typography>
            <Typography sx={{ ...mono, mt: 0.25, fontSize: 18, fontWeight: 800 }}>
              {selected.netBalanceUsdMn < 0 ? '−' : '+'}
              {moneyB(Math.abs(selected.netBalanceUsdMn))}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: 10, color: 'text.secondary', mb: 0.5 }}>
              5-year path
            </Typography>
            <Sparkline series={selected[historyKey]} color={accent} w={100} h={28} />
          </Box>
        </Box>
      </Box>

      {/* 8: Realistic net-impact range */}
      {hasScenarioEvidence ? (
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(C.teal, 0.08),
            border: `1px solid ${alpha(C.teal, 0.2)}`,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography
                sx={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: C.teal,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Illustrative Analyst Scenario
              </Typography>
              <Typography sx={{ mt: 0.5, fontSize: 11.5, color: 'text.secondary' }}>
                Assuming {substitution}% import sub. & {importedInputShare}% imported inputs.
                {selected.domesticSupply?.derivationMethod &&
                  ` (${selected.domesticSupply.derivationMethod})`}
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
      ) : selected.domesticSupply?.analystLocalisableSharePct != null ? (
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(C.orange, 0.06),
            border: `1px dashed ${alpha(C.orange, 0.35)}`,
          }}
        >
          <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: C.orange }}>
            NET-IMPACT MODEL NEEDS ONE MORE INPUT
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: 11.5, color: 'text.secondary' }}>
            The domestic substitution ceiling is sourced, but replacement-production imported
            content is unavailable. Monetary impact is suppressed until that assumption is supplied
            in the scenario laboratory.
          </Typography>
          <Button size="small" href="#scenario" sx={{ mt: 1 }}>
            Open scenario laboratory
          </Button>
        </Box>
      ) : null}

      {/* 4: Physical Dependence Dashboard */}
      {selected.quantityUnitValue ? (
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(C.purple, 0.04),
            border: `1px solid ${alpha(C.purple, 0.16)}`,
          }}
        >
          <Typography
            sx={{
              fontSize: 10.5,
              fontWeight: 800,
              color: C.purple,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Physical Dependence Dashboard
          </Typography>
          <Typography sx={{ fontSize: 10, color: 'text.secondary', mb: 1.5 }}>
            Separating physical volume demand from unit price shocks.
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
            {['imports', 'exports'].map((flow) => {
              if (!selected.quantityUnitValue?.[flow]) return null;
              const f = selected.quantityUnitValue[flow];
              const isExport = flow === 'exports';
              const color = isExport ? C.blue : C.orange;
              const goodColor = isExport ? '#5f7b58' : C.red;
              const formatVal = (v) =>
                v != null ? (v > 0 ? '+' : '') + '$' + (v / 1e6).toFixed(1) + 'M' : 'N/A';

              return (
                <Box
                  key={flow}
                  sx={{
                    p: 1.5,
                    bgcolor: '#fff',
                    borderRadius: 1.5,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 10,
                      fontWeight: 800,
                      color,
                      mb: 1,
                      textTransform: 'uppercase',
                    }}
                  >
                    {flow} ({f.baseYear || 'Base'} to {f.currentYear || 'Current'})
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                    <Box>
                      <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>
                        Physical quantity
                      </Typography>
                      <Typography sx={{ ...mono, fontSize: 14, fontWeight: 800 }}>
                        {f.currentQuantity != null
                          ? (f.currentQuantity / 1e6).toFixed(2) +
                            'M ' +
                            (f.quantityUnit || '').replace('_', ' ')
                          : 'N/A'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>
                        Unit value
                      </Typography>
                      <Typography sx={{ ...mono, fontSize: 14, fontWeight: 800 }}>
                        {f.unitValueUsd != null ? '$' + f.unitValueUsd.toFixed(2) : 'N/A'}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        gridColumn: 'span 2',
                        mt: 0.5,
                        p: 1,
                        bgcolor: alpha(color, 0.04),
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        sx={{ fontSize: 9.5, fontWeight: 700, color: 'text.secondary', mb: 0.5 }}
                      >
                        Decomposition (
                        {f.decompositionMethod?.includes('LMDI') ? 'LMDI' : 'Laspeyres'})
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                        <Typography sx={{ fontSize: 9.5 }}>Quantity effect:</Typography>
                        <Typography
                          sx={{
                            ...mono,
                            fontSize: 9.5,
                            color: f.quantityEffectUsd > 0 ? goodColor : 'text.primary',
                          }}
                        >
                          {formatVal(f.quantityEffectUsd)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                        <Typography sx={{ fontSize: 9.5 }}>Price effect:</Typography>
                        <Typography
                          sx={{
                            ...mono,
                            fontSize: 9.5,
                            color: f.priceEffectUsd > 0 ? goodColor : 'text.primary',
                          }}
                        >
                          {formatVal(f.priceEffectUsd)}
                        </Typography>
                      </Box>
                      {f.residualEffectUsd ? (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ fontSize: 9.5 }}>Residual:</Typography>
                          <Typography sx={{ ...mono, fontSize: 9.5 }}>
                            {formatVal(f.residualEffectUsd)}
                          </Typography>
                        </Box>
                      ) : null}
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(C.purple, 0.02),
            border: `1px dashed ${alpha(C.purple, 0.15)}`,
          }}
        >
          <Typography
            sx={{
              fontSize: 10.5,
              fontWeight: 700,
              color: alpha(C.purple, 0.5),
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Physical Dependence Dashboard
          </Typography>
          <Typography sx={{ mt: 0.25, fontSize: 11.5, color: 'text.secondary' }}>
            Evidence unavailable.
          </Typography>
        </Box>
      )}

      {/* 5: Partner concentration */}
      {selected.productPartnerExposure?.[flowName === 'Imports' ? 'imports' : 'exports'] ? (
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(C.blue, 0.04),
            border: `1px solid ${alpha(C.blue, 0.16)}`,
          }}
        >
          <Typography
            sx={{
              fontSize: 10.5,
              fontWeight: 800,
              color: C.blue,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {selected.productPartnerExposure[flowName === 'Imports' ? 'imports' : 'exports']
              .grain === 'chapter_proxy'
              ? 'Chapter Proxy Top Partners'
              : 'Product Top Partners'}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Top {flowName === 'Imports' ? 'import origins' : 'export destinations'}
            </Typography>
            <Stack spacing={0.5} sx={{ mt: 0.75 }}>
              {[
                {
                  name: selected.productPartnerExposure[
                    flowName === 'Imports' ? 'imports' : 'exports'
                  ].topPartner,
                  share:
                    selected.productPartnerExposure[flowName === 'Imports' ? 'imports' : 'exports']
                      .topPartnerSharePct,
                },
                {
                  name: selected.productPartnerExposure[
                    flowName === 'Imports' ? 'imports' : 'exports'
                  ].secondPartner,
                  share:
                    selected.productPartnerExposure[flowName === 'Imports' ? 'imports' : 'exports']
                      .secondPartnerSharePct,
                },
                {
                  name: selected.productPartnerExposure[
                    flowName === 'Imports' ? 'imports' : 'exports'
                  ].thirdPartner,
                  share:
                    selected.productPartnerExposure[flowName === 'Imports' ? 'imports' : 'exports']
                      .thirdPartnerSharePct,
                },
              ]
                .filter((p) => p.name)
                .map((p) => (
                  <Box
                    key={p.name}
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography sx={{ fontSize: 11.5, fontWeight: 600 }}>{p.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 5,
                          borderRadius: 99,
                          bgcolor: alpha(C.blue, 0.12),
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${Math.min(p.share, 100)}%`,
                            height: '100%',
                            bgcolor: C.blue,
                            borderRadius: 99,
                          }}
                        />
                      </Box>
                      <Typography
                        sx={{
                          ...mono,
                          fontSize: 10.5,
                          fontWeight: 800,
                          color: C.blue,
                          minWidth: 30,
                          textAlign: 'right',
                        }}
                      >
                        {p.share.toFixed(0)}%
                      </Typography>
                    </Box>
                  </Box>
                ))}
            </Stack>
          </Box>
          <Typography sx={{ mt: 1, fontSize: 10, color: 'text.secondary', lineHeight: 1.5 }}>
            {
              selected.productPartnerExposure[flowName === 'Imports' ? 'imports' : 'exports']
                ?.evidenceNote
            }
          </Typography>
        </Box>
      ) : selected.chapterPartnerExposure ? (
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(C.blue, 0.04),
            border: `1px solid ${alpha(C.blue, 0.16)}`,
          }}
        >
          <Typography
            sx={{
              fontSize: 10.5,
              fontWeight: 800,
              color: C.blue,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Chapter {selected.chapterPartnerExposure.grain.replace('HS-', '')} Top Partners (Proxy)
          </Typography>
          {selected.chapterPartnerExposure.imports.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Top import origins
              </Typography>
              <Stack spacing={0.5} sx={{ mt: 0.75 }}>
                {selected.chapterPartnerExposure.imports.slice(0, 3).map((p) => (
                  <Box
                    key={p.country}
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography sx={{ fontSize: 11.5, fontWeight: 600 }}>
                      {titleCase(p.country.toLowerCase())}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 5,
                          borderRadius: 99,
                          bgcolor: alpha(C.blue, 0.12),
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${Math.min(p.sharePct, 100)}%`,
                            height: '100%',
                            bgcolor: C.blue,
                            borderRadius: 99,
                          }}
                        />
                      </Box>
                      <Typography
                        sx={{
                          ...mono,
                          fontSize: 10.5,
                          fontWeight: 800,
                          color: C.blue,
                          minWidth: 30,
                          textAlign: 'right',
                        }}
                      >
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
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(C.blue, 0.02),
            border: `1px dashed ${alpha(C.blue, 0.15)}`,
          }}
        >
          <Typography
            sx={{
              fontSize: 10.5,
              fontWeight: 700,
              color: alpha(C.blue, 0.5),
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Partner concentration
          </Typography>
          <Typography sx={{ mt: 0.25, fontSize: 11.5, color: 'text.secondary' }}>
            Evidence unavailable.
          </Typography>
        </Box>
      )}

      {/* Evidence Completeness Indicators */}
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2,
          bgcolor: '#f8fafc',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography
          sx={{
            fontSize: 10.5,
            fontWeight: 800,
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Evidence Completeness
        </Typography>
        <Box sx={{ mt: 1.5, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: 14 }}>
              {selected.quantityUnitValue ? '🟢' : '🔴'}
            </Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 600 }}>Trade/Price</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: 14 }}>
              {selected.productPartnerExposure?.[flowName === 'Imports' ? 'imports' : 'exports']
                ?.grain === 'hs4'
                ? '🟢'
                : selected.productPartnerExposure?.[
                      flowName === 'Imports' ? 'imports' : 'exports'
                    ] || selected.chapterPartnerExposure
                  ? '🟡'
                  : '🔴'}
            </Typography>
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

      {
        /* 5.5: State Capability */
        selected.stateCapability && selected.stateCapability.length > 0 && (
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: alpha(C.teal, 0.04),
              border: `1px solid ${alpha(C.teal, 0.2)}`,
            }}
          >
            <Typography
              sx={{
                fontSize: 10.5,
                fontWeight: 800,
                color: C.teal,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              State Capability
            </Typography>
            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {selected.stateCapability.map((state, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 1,
                    bgcolor: '#fff',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography sx={{ fontSize: 11, fontWeight: 800 }}>{state.state}</Typography>
                  <Box sx={{ mt: 0.5, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                    <Box>
                      <Typography sx={{ fontSize: 9, color: 'text.secondary' }}>
                        Observed Production
                      </Typography>
                      <Typography sx={{ ...mono, fontSize: 11.5, fontWeight: 600 }}>
                        {moneyB(state.observedProductionUsdMn)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 9, color: 'text.secondary' }}>
                        Announced Capacity
                      </Typography>
                      <Typography sx={{ ...mono, fontSize: 11.5, fontWeight: 600 }}>
                        {moneyB(state.announcedCapacityUsdMn)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 9, color: 'text.secondary' }}>
                        Investment
                      </Typography>
                      <Typography sx={{ ...mono, fontSize: 11.5, fontWeight: 600 }}>
                        {moneyB(state.investmentUsdMn)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 9, color: 'text.secondary' }}>
                        Employment
                      </Typography>
                      <Typography sx={{ ...mono, fontSize: 11.5, fontWeight: 600 }}>
                        {state.employment.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )
      }

      {/* 6: Domestic capacity/production */}
      {selected.domesticSupply ? (
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(C.orange, 0.04),
            border: `1px solid ${alpha(C.orange, 0.2)}`,
          }}
        >
          <Typography
            sx={{
              fontSize: 10.5,
              fontWeight: 800,
              color: C.orange,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Domestic capacity
          </Typography>
          <Box sx={{ mt: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            {selected.domesticSupply.observedProduction !== null ||
            selected.domesticSupply.installedCapacity !== null ||
            selected.domesticSupply.pliLinkedProduction !== null ? (
              <Box>
                <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>
                  Production/Capacity
                </Typography>
                <Typography sx={{ ...mono, fontSize: 14, fontWeight: 800 }}>
                  {selected.domesticSupply.observedProduction !== null
                    ? selected.domesticSupply.observedProduction.toLocaleString()
                    : selected.domesticSupply.installedCapacity !== null
                      ? selected.domesticSupply.installedCapacity.toLocaleString()
                      : selected.domesticSupply.pliLinkedProduction.toLocaleString()}
                  <Typography
                    component="span"
                    sx={{ fontSize: 10, ml: 0.5, color: 'text.secondary' }}
                  >
                    {selected.domesticSupply.unit}
                  </Typography>
                </Typography>
              </Box>
            ) : (
              <Box>
                <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>Production</Typography>
                <Typography sx={{ ...mono, fontSize: 12, fontWeight: 600 }}>
                  Evidence unavailable
                </Typography>
              </Box>
            )}
            {selected.domesticSupply.analystLocalisableSharePct !== null && (
              <Box>
                <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>
                  Localisable Share
                </Typography>
                <Typography sx={{ ...mono, fontSize: 14, fontWeight: 800, color: C.teal }}>
                  {selected.domesticSupply.analystLocalisableSharePct}%
                </Typography>
              </Box>
            )}
          </Box>
          <Typography sx={{ mt: 1, fontSize: 10.5, lineHeight: 1.55, color: 'text.secondary' }}>
            {selected.domesticSupply.evidenceNote}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(C.orange, 0.02),
            border: `1px dashed ${alpha(C.orange, 0.15)}`,
          }}
        >
          <Typography
            sx={{
              fontSize: 10.5,
              fontWeight: 700,
              color: alpha(C.orange, 0.5),
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Domestic capacity
          </Typography>
          <Typography sx={{ mt: 0.25, fontSize: 11.5, color: 'text.secondary' }}>
            Evidence unavailable.
          </Typography>
        </Box>
      )}

      {/* 7: Buildability and Policy (Constraints) */}
      {selected.buildability || selected.policyOverlay ? (
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(C.ink, 0.03),
            border: `1px solid ${alpha(C.ink, 0.12)}`,
          }}
        >
          <Typography
            sx={{
              fontSize: 10.5,
              fontWeight: 800,
              color: C.ink,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Buildability & Constraints
          </Typography>
          {selected.buildability && (
            <Typography sx={{ mt: 0.75, fontSize: 12.5 }}>
              <strong>
                {titleCase(selected.buildability.category)}
                {selected.domesticSupply?.analystLocalisableSharePct == null
                  ? ' (Rule-based screen)'
                  : ''}
              </strong>
              {selected.domesticSupply?.analystLocalisableSharePct != null
                ? ` · ${titleCase(selected.buildability.timeHorizon)}`
                : ''}{' '}
              · {titleCase(selected.buildability.lever)}
            </Typography>
          )}
          {selected.policyOverlay && (
            <Box
              sx={{
                mt: 1.5,
                p: 1.5,
                bgcolor: '#fff',
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: C.purple,
                  mb: 1,
                  textTransform: 'uppercase',
                }}
              >
                Active Policy Overlay
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                {selected.policyOverlay.measureType && (
                  <Chip
                    size="small"
                    label={selected.policyOverlay.measureType}
                    sx={{
                      bgcolor: alpha(C.purple, 0.08),
                      color: C.purple,
                      borderColor: alpha(C.purple, 0.25),
                    }}
                    variant="outlined"
                  />
                )}
                {selected.policyOverlay.status && (
                  <Chip
                    size="small"
                    label={selected.policyOverlay.status}
                    sx={{
                      bgcolor: alpha('#5f7b58', 0.08),
                      color: '#5f7b58',
                      borderColor: alpha('#5f7b58', 0.25),
                    }}
                    variant="outlined"
                  />
                )}
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                <Box>
                  <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>
                    Affected Scope
                  </Typography>
                  <Typography sx={{ fontSize: 11.5, fontWeight: 600 }}>
                    {selected.policyOverlay.exactAffectedScope || 'All'}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>
                    Effective Date
                  </Typography>
                  <Typography sx={{ fontSize: 11.5, fontWeight: 600 }}>
                    {selected.policyOverlay.effectiveDate || 'Unknown'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(C.ink, 0.02),
            border: `1px dashed ${alpha(C.ink, 0.12)}`,
          }}
        >
          <Typography
            sx={{
              fontSize: 10.5,
              fontWeight: 700,
              color: alpha(C.ink, 0.35),
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Buildability & Constraints
          </Typography>
          <Typography sx={{ mt: 0.25, fontSize: 11.5, color: 'text.secondary' }}>
            Evidence unavailable.
          </Typography>
        </Box>
      )}

      {/* 9: Confidence / Missing Evidence summary */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <DatasetRounded sx={{ color: 'text.disabled', fontSize: 20 }} />
        <Typography sx={{ fontSize: 10.5, color: 'text.secondary', lineHeight: 1.55 }}>
          <strong>Classification confidence {selected.confidence}/5.</strong>
          {!selected.quantityUnitValue ||
          !selected.chapterPartnerExposure ||
          !selected.domesticSupply ||
          !selected.buildability ? (
            <span>
              {' '}
              Some structured evidence is missing. Reviewer notes: {selected.attributionReason}
            </span>
          ) : (
            <span> Full structured evidence available.</span>
          )}
        </Typography>
      </Box>
    </Stack>
  );
}
