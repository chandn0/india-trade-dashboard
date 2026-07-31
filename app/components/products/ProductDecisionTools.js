'use client';

import * as React from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  AddRounded,
  CalculateRounded,
  CompareArrowsRounded,
  InsightsRounded,
} from '@mui/icons-material';

import { C, mono } from '../../theme.js';
import { moneyB } from '../../lib/format.js';
import {
  calculateScenario,
  calculateScenarioRange,
  canAddComparisonProduct,
  addComparisonProduct,
  canRemoveComparisonProduct,
  removeComparisonProduct,
} from '../../lib/productLogic.js';
import cardSx from '../primitives/cardSx.js';

const titleCase = (value) => value.replace(/\b\w/g, (letter) => letter.toUpperCase());

function compactName(product) {
  return titleCase(product.description.toLowerCase());
}

function SignalList({ title, tone, products: rows, valueFor, note }) {
  return (
    <Paper sx={{ ...cardSx, height: '100%' }}>
      <Typography variant="overline" sx={{ color: tone }}>
        {title}
      </Typography>
      <Typography sx={{ mb: 1.25, fontSize: 10.5, color: 'text.secondary' }}>{note}</Typography>
      <Stack spacing={1}>
        {rows.map((product, index) => (
          <Box
            key={product.hscode}
            sx={{
              display: 'grid',
              gridTemplateColumns: '20px 1fr auto',
              gap: 0.75,
              alignItems: 'start',
            }}
          >
            <Typography sx={{ ...mono, fontSize: 10, color: 'text.secondary' }}>
              {index + 1}
            </Typography>
            <Box>
              <Typography sx={{ fontSize: 11.5, fontWeight: 750, lineHeight: 1.3 }}>
                {compactName(product)}
              </Typography>
              <Typography sx={{ ...mono, mt: 0.2, fontSize: 9.5, color: 'text.secondary' }}>
                HS {product.hscode} · {titleCase(product.productionStage)}
              </Typography>
            </Box>
            <Typography
              sx={{ ...mono, fontSize: 11, fontWeight: 800, color: tone, whiteSpace: 'nowrap' }}
            >
              {valueFor(product)}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

export function ProductSignals({ products }) {
  const deficit = [...products].sort((a, b) => a.netBalanceUsdMn - b.netBalanceUsdMn).slice(0, 5);
  const finishedImportGrowth = products
    .filter(
      (product) =>
        product.productionStage === 'finished product' && product.importHistory[0] >= 250,
    )
    .sort(
      (a, b) =>
        b.importHistory.at(-1) - b.importHistory[0] - (a.importHistory.at(-1) - a.importHistory[0]),
    )
    .slice(0, 5);
  const upgrading = products
    .filter((product) =>
      ['raw material', 'agricultural commodity'].includes(product.productionStage),
    )
    .sort((a, b) => b.latestExportUsdMn - a.latestExportUsdMn)
    .slice(0, 5);
  const coverage = products
    .filter((product) => product.latestImportUsdMn >= 100 && product.exportCoveragePct > 100)
    .sort((a, b) => b.netBalanceUsdMn - a.netBalanceUsdMn)
    .slice(0, 5);

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1.5 }}>
        <InsightsRounded sx={{ color: C.purple }} />
        <Box>
          <Typography variant="overline" sx={{ color: C.purple }}>
            Automatic signals
          </Typography>
          <Typography variant="h5">What deserves attention now</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', xl: 'repeat(4,1fr)' },
          gap: 2,
        }}
      >
        <SignalList
          title="Largest net gaps"
          tone={C.red}
          products={deficit}
          valueFor={(product) => `−${moneyB(Math.abs(product.netBalanceUsdMn))}`}
          note="Imports minus exports at the same HS-4 line"
        />
        <SignalList
          title="Finished imports rising"
          tone={C.orange}
          products={finishedImportGrowth}
          valueFor={(product) =>
            `+${moneyB(product.importHistory.at(-1) - product.importHistory[0])}`
          }
          note="Largest absolute five-year increases"
        />
        <SignalList
          title="Primary export strengths"
          tone="#5f7b58"
          products={upgrading}
          valueFor={(product) => moneyB(product.latestExportUsdMn)}
          note="Candidates for downstream value-add analysis"
        />
        <SignalList
          title="Export-covered imports"
          tone={C.teal}
          products={coverage}
          valueFor={(product) => `+${moneyB(product.netBalanceUsdMn)}`}
          note="Products with imports but a net HS-4 surplus"
        />
      </Box>
    </Box>
  );
}

function ScenarioSlider({ label, value, onChange, help, max = 100 }) {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
        <Typography sx={{ fontSize: 11.5, fontWeight: 750 }}>{label}</Typography>
        <Typography sx={{ ...mono, fontSize: 11, fontWeight: 800 }}>{value}%</Typography>
      </Box>
      <Slider
        size="small"
        min={0}
        max={max}
        value={value}
        onChange={(_, next) => onChange(next)}
        aria-label={label}
        sx={{ mt: 0.25 }}
      />
      <Typography sx={{ mt: -0.5, fontSize: 9.5, color: 'text.secondary' }}>{help}</Typography>
    </Box>
  );
}

export function ScenarioModeller({ products }) {
  const byCode = React.useMemo(
    () => new Map(products.map((product) => [product.hscode, product])),
    [products],
  );
  const productOptions = React.useMemo(
    () =>
      [...products].sort(
        (a, b) =>
          Math.max(b.latestImportUsdMn, b.latestExportUsdMn) -
          Math.max(a.latestImportUsdMn, a.latestExportUsdMn),
      ),
    [products],
  );
  const [hscode, setHscode] = React.useState('8542');
  const [substitution, setSubstitution] = React.useState(20);
  const [exportGrowth, setExportGrowth] = React.useState(15);
  const [importedInputShare, setImportedInputShare] = React.useState(35);
  const [exportImportedInputShare, setExportImportedInputShare] = React.useState(35);
  const [realisation, setRealisation] = React.useState(70);
  const [hasUserInputs, setHasUserInputs] = React.useState(false);

  // Hydrate from URL on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      // eslint-disable-next-line
      if (params.has('hs')) setHscode(params.get('hs'));
      if (params.has('sub')) setSubstitution(Number(params.get('sub')));
      if (params.has('exp')) setExportGrowth(Number(params.get('exp')));
      if (params.has('inp')) setImportedInputShare(Number(params.get('inp')));
      if (params.has('einp')) setExportImportedInputShare(Number(params.get('einp')));
      if (params.has('real')) setRealisation(Number(params.get('real')));
      if (['sub', 'exp', 'inp', 'einp', 'real'].some((key) => params.has(key))) {
        setHasUserInputs(true);
      }
    }
  }, []);

  // Update URL on state change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      params.set('hs', hscode);
      params.set('sub', substitution);
      params.set('exp', exportGrowth);
      params.set('inp', importedInputShare);
      params.set('einp', exportImportedInputShare);
      params.set('real', realisation);
      window.history.replaceState(null, '', `?${params.toString()}`);
    }
  }, [
    hscode,
    substitution,
    exportGrowth,
    importedInputShare,
    exportImportedInputShare,
    realisation,
  ]);

  const product = byCode.get(hscode) ?? productOptions[0];
  const hasSourcedScenario = product.domesticSupply?.analystLocalisableSharePct != null;
  const scenarioReady = hasSourcedScenario || hasUserInputs;

  // Auto-default when product changes
  const handleProductChange = (newHs) => {
    setHscode(newHs);
    setHasUserInputs(false);
    const p = byCode.get(newHs) ?? productOptions[0];

    if (p.domesticSupply?.analystLocalisableSharePct != null) {
      setSubstitution(p.domesticSupply.analystLocalisableSharePct);
    } else {
      setSubstitution(20);
    }

    setImportedInputShare(35);
  };

  const { base, conservative, optimistic, mostInfluentialAssumption, breakEvenInputShare } =
    calculateScenarioRange(product, {
      substitution,
      exportGrowth,
      importedInputShare,
      exportImportedInputShare,
      realisation,
    });

  const maxSub =
    product.domesticSupply?.analystLocalisableSharePct != null &&
    product.domesticSupply.evidenceNote?.includes('structurally')
      ? product.domesticSupply.analystLocalisableSharePct
      : 100;

  const hasAuditFields = product.domesticSupply?.derivationMethod;

  const handleExport = () => {
    const data = {
      product: { hscode: product.hscode, name: product.description },
      assumptions: {
        substitution,
        exportGrowth,
        importedInputShare,
        exportImportedInputShare,
        realisation,
      },
      impact: {
        base: base.netImpact,
        conservative: conservative.netImpact,
        optimistic: optimistic.netImpact,
      },
      url: window.location.href,
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scenario_${product.hscode}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Paper sx={{ ...cardSx, p: 0, overflow: 'hidden' }} id="scenario">
      <Box
        sx={{
          p: { xs: 2, md: 2.5 },
          color: '#fff',
          background: `linear-gradient(120deg, ${C.ink}, #253249)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalculateRounded sx={{ color: '#9db7b1' }} />
            <Box>
              <Typography variant="overline" sx={{ color: '#9db7b1' }}>
                Scenario laboratory
              </Typography>
              <Typography variant="h5">Translate gross ambition into net impact</Typography>
            </Box>
          </Box>
          <Typography
            sx={{ mt: 0.75, maxWidth: 720, fontSize: 12.5, color: 'rgba(255,255,255,0.68)' }}
          >
            A transparent sensitivity model—not a forecast. Imported inputs and execution
            realisation are deducted from gross import substitution and export growth.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
          onClick={handleExport}
          disabled={!scenarioReady}
        >
          Export Scenario
        </Button>
      </Box>

      {!scenarioReady && (
        <Box
          sx={{
            p: 1.5,
            bgcolor: alpha(C.orange, 0.1),
            borderBottom: `1px solid ${alpha(C.orange, 0.2)}`,
          }}
        >
          <Typography sx={{ fontSize: 11.5, color: C.orange, fontWeight: 600 }}>
            ⚠️ Monetary output is unavailable for HS {product.hscode}. Adjust the assumptions below
            to run an explicit user scenario.
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          p: { xs: 2, md: 2.5 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '0.9fr 1.1fr' },
          gap: 3,
        }}
      >
        <Stack spacing={2}>
          <Autocomplete
            options={productOptions.slice(0, 300)}
            value={product}
            onChange={(_, next) => next && handleProductChange(next.hscode)}
            getOptionLabel={(option) => `HS ${option.hscode} · ${compactName(option)}`}
            isOptionEqualToValue={(option, value) => option.hscode === value.hscode}
            renderInput={(params) => (
              <TextField {...params} size="small" label="Product scenario" />
            )}
          />
          <ScenarioSlider
            label="Domestic import substitution"
            value={substitution}
            onChange={(value) => {
              setSubstitution(value);
              setHasUserInputs(true);
            }}
            max={maxSub}
            help={
              maxSub < 100
                ? `Structurally capped at ${maxSub}% by evidence constraints`
                : 'Share of the current import line replaced'
            }
          />
          <ScenarioSlider
            label="Additional export growth"
            value={exportGrowth}
            onChange={(value) => {
              setExportGrowth(value);
              setHasUserInputs(true);
            }}
            help="Increment over the current export value"
          />
          <ScenarioSlider
            label="Imported-input requirement (Domestic)"
            value={importedInputShare}
            onChange={(value) => {
              setImportedInputShare(value);
              setHasUserInputs(true);
            }}
            help={
              importedInputShare === 35
                ? 'Standard baseline assumption (35%)'
                : 'Foreign inputs needed for replacement production'
            }
          />
          <ScenarioSlider
            label="Imported-input requirement (Export)"
            value={exportImportedInputShare}
            onChange={(value) => {
              setExportImportedInputShare(value);
              setHasUserInputs(true);
            }}
            help="Foreign inputs needed for new exports"
          />
          <ScenarioSlider
            label="Execution realisation"
            value={realisation}
            onChange={(value) => {
              setRealisation(value);
              setHasUserInputs(true);
            }}
            help="Share of the modelled technical effect achieved (Base case)"
          />
        </Stack>
        <Box>
          <Typography
            sx={{
              fontSize: 10.5,
              fontWeight: 800,
              color: 'text.secondary',
              textTransform: 'uppercase',
            }}
          >
            {hasUserInputs
              ? 'User-entered exploratory scenario'
              : hasSourcedScenario
                ? 'Sourced scenario result'
                : 'Scenario result'}{' '}
            · HS {product.hscode}
          </Typography>
          <Typography variant="h6" sx={{ mt: 0.4 }}>
            {compactName(product)}
          </Typography>
          <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
            {[
              ['Current imports', moneyB(product.latestImportUsdMn), C.orange],
              ['Current exports', moneyB(product.latestExportUsdMn), C.blue],
              ...(scenarioReady ? [['Gross movement', moneyB(base.grossMovement), C.purple]] : []),
            ].map(([label, value, color]) => (
              <Box
                key={label}
                sx={{
                  p: 1.4,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: alpha(color, 0.045),
                }}
              >
                <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>{label}</Typography>
                <Typography sx={{ ...mono, mt: 0.25, fontSize: 18, fontWeight: 800, color }}>
                  {value}
                </Typography>
              </Box>
            ))}
            {scenarioReady ? (
              <Box
                sx={{
                  p: 1.4,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: C.teal,
                  bgcolor: alpha(C.teal, 0.08),
                }}
              >
                <Typography sx={{ fontSize: 10, color: C.teal, fontWeight: 700 }}>
                  Realistic net impact
                </Typography>
                <Typography
                  sx={{ ...mono, mt: 0.25, fontSize: 18, fontWeight: 800, color: C.teal }}
                >
                  {moneyB(base.netImpact)}
                </Typography>
                <Typography sx={{ mt: 0.5, fontSize: 9.5, color: 'text.secondary' }}>
                  Range: {moneyB(conservative.netImpact)} (conservative) to{' '}
                  {moneyB(optimistic.netImpact)} (optimistic)
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  p: 1.4,
                  borderRadius: 2,
                  border: '1px dashed',
                  borderColor: C.orange,
                  bgcolor: alpha(C.orange, 0.08),
                }}
              >
                <Typography sx={{ fontSize: 10, color: C.orange, fontWeight: 700 }}>
                  Monetary impact suppressed
                </Typography>
                <Typography sx={{ mt: 0.25, fontSize: 11, color: 'text.secondary' }}>
                  Scenario relies solely on generic defaults. Enter actual product evidence to
                  generate economic estimates.
                </Typography>
              </Box>
            )}
          </Box>

          {scenarioReady && (
            <>
              <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha(C.blue, 0.04),
                    border: `1px solid ${alpha(C.blue, 0.1)}`,
                  }}
                >
                  <Typography sx={{ fontSize: 10, color: 'text.secondary', fontWeight: 600 }}>
                    Most Influential Assumption
                  </Typography>
                  <Typography sx={{ mt: 0.25, fontSize: 12, fontWeight: 700, color: C.blue }}>
                    {mostInfluentialAssumption}
                  </Typography>
                  <Typography sx={{ mt: 0.25, fontSize: 10, color: 'text.secondary' }}>
                    Drives highest variance in net impact.
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha(C.red, 0.04),
                    border: `1px solid ${alpha(C.red, 0.1)}`,
                  }}
                >
                  <Typography sx={{ fontSize: 10, color: 'text.secondary', fontWeight: 600 }}>
                    Break-Even Bound
                  </Typography>
                  <Typography sx={{ mt: 0.25, fontSize: 12, fontWeight: 700, color: C.red }}>
                    {breakEvenInputShare}% Imported Inputs
                  </Typography>
                  <Typography sx={{ mt: 0.25, fontSize: 10, color: 'text.secondary' }}>
                    If inputs exceed this, net impact turns negative.
                  </Typography>
                </Box>
              </Box>

              {!hasAuditFields && (
                <Box
                  sx={{
                    mt: 2,
                    p: 1.25,
                    borderRadius: 1.5,
                    bgcolor: alpha(C.red, 0.05),
                    border: `1px solid ${alpha(C.red, 0.2)}`,
                  }}
                >
                  <Typography sx={{ fontSize: 10.5, color: C.red, fontWeight: 600 }}>
                    ⚠️ Low-Confidence Inputs: Results depend on assumptions without a recorded
                    derivation method.
                  </Typography>
                </Box>
              )}

              <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: '#f8fafc' }}>
                <Typography sx={{ fontSize: 11.5, lineHeight: 1.65 }}>
                  <strong>Bridge:</strong> {moneyB(base.importReduction)} import reduction +{' '}
                  {moneyB(base.exportGain)} export gain −{' '}
                  {moneyB(base.replacementInputCost + base.exportInputCost)} imported inputs, then ×{' '}
                  {realisation}% realisation (±15% variance).
                </Typography>
              </Box>
            </>
          )}
          <Typography sx={{ mt: 1.25, fontSize: 10.5, color: 'text.secondary', lineHeight: 1.55 }}>
            Model Version 2.0 (Sensitivity Analysis). Excludes capital cost and GE effects.
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export function ProductComparison({ products }) {
  const byCode = React.useMemo(
    () => new Map(products.map((product) => [product.hscode, product])),
    [products],
  );
  const productOptions = React.useMemo(
    () =>
      [...products].sort(
        (a, b) =>
          Math.max(b.latestImportUsdMn, b.latestExportUsdMn) -
          Math.max(a.latestImportUsdMn, a.latestExportUsdMn),
      ),
    [products],
  );
  const [selectedCodes, setSelectedCodes] = React.useState(['2709', '8542', '8507']);
  const [candidate, setCandidate] = React.useState(null);
  const selected = selectedCodes.map((code) => byCode.get(code)).filter(Boolean);

  return (
    <Paper sx={{ ...cardSx, p: 0, overflow: 'hidden' }}>
      <Box sx={{ p: { xs: 2, md: 2.5 }, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CompareArrowsRounded sx={{ color: C.blue }} />
          <Box>
            <Typography variant="overline" sx={{ color: C.blue }}>
              Comparison workspace
            </Typography>
            <Typography variant="h5">Compare products side by side</Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 1.5, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <Autocomplete
            options={productOptions.slice(0, 400)}
            value={candidate}
            onChange={(_, next) => setCandidate(next)}
            getOptionLabel={(option) => `HS ${option.hscode} · ${compactName(option)}`}
            isOptionEqualToValue={(option, value) => option.hscode === value.hscode}
            renderInput={(params) => (
              <TextField {...params} size="small" placeholder="Find a product to compare" />
            )}
            sx={{ minWidth: 300, flex: '1 1 360px' }}
          />
          <Button
            variant="contained"
            startIcon={<AddRounded />}
            disabled={!canAddComparisonProduct(selectedCodes, candidate?.hscode)}
            onClick={() => {
              setSelectedCodes((current) => addComparisonProduct(current, candidate?.hscode));
              setCandidate(null);
            }}
          >
            Add
          </Button>
          <Typography sx={{ fontSize: 10.5, color: 'text.secondary' }}>
            {selectedCodes.length}/5 products
          </Typography>
        </Box>
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Metric</TableCell>
              {selected.map((product) => (
                <TableCell key={product.hscode} sx={{ minWidth: 180 }}>
                  <Typography sx={{ ...mono, fontSize: 10.5, color: C.blue }}>
                    HS {product.hscode}
                  </Typography>
                  <Typography sx={{ mt: 0.25, fontSize: 11.5, fontWeight: 750, lineHeight: 1.25 }}>
                    {compactName(product)}
                  </Typography>
                  {canRemoveComparisonProduct(selectedCodes) ? (
                    <Button
                      size="small"
                      color="inherit"
                      onClick={() =>
                        setSelectedCodes((current) =>
                          removeComparisonProduct(current, product.hscode),
                        )
                      }
                      sx={{ mt: 0.3, p: 0, minWidth: 0, fontSize: 9 }}
                    >
                      Remove
                    </Button>
                  ) : null}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              ['Production stage', (product) => titleCase(product.productionStage)],
              ['Imports', (product) => moneyB(product.latestImportUsdMn)],
              ['Exports', (product) => moneyB(product.latestExportUsdMn)],
              [
                'Net balance',
                (product) =>
                  `${product.netBalanceUsdMn >= 0 ? '+' : '−'}${moneyB(Math.abs(product.netBalanceUsdMn))}`,
              ],
              [
                'Export coverage',
                (product) =>
                  product.exportCoveragePct === null
                    ? 'Export only'
                    : `${product.exportCoveragePct.toFixed(1)}%`,
              ],
              [
                'Five-year import change',
                (product) =>
                  `${product.importHistory.at(-1) - product.importHistory[0] >= 0 ? '+' : '−'}${moneyB(Math.abs(product.importHistory.at(-1) - product.importHistory[0]))}`,
              ],
              [
                'Buildability',
                (product) =>
                  product.buildability
                    ? product.domesticSupply?.analystLocalisableSharePct != null
                      ? `${titleCase(product.buildability.category)} · ${titleCase(product.buildability.timeHorizon)}`
                      : `${titleCase(product.buildability.category)} (Rule-based screen)`
                    : 'Not yet assessed',
              ],
              [
                'Classification',
                (product) => `${product.classificationMethod} · ${product.confidence}/5`,
              ],
            ].map(([label, valueFor]) => (
              <TableRow key={label}>
                <TableCell sx={{ fontWeight: 800 }}>{label}</TableCell>
                {selected.map((product) => (
                  <TableCell key={product.hscode} sx={{ ...mono, fontSize: 11.5 }}>
                    {valueFor(product)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export function EvidenceReadiness({ metadata }) {
  const external = metadata.enrichmentAvailability;
  const rows = [
    [
      'Five-year HS-4 trade values',
      true,
      `${metadata.totalUniqueHs4Products.toLocaleString()} products`,
    ],
    [
      'Production-stage attribution',
      true,
      `${metadata.classificationSummary['curated HS-4']} curated; remaining lines rule-mapped`,
    ],
    ['Major-partner HS-2 exposure', true, '12 partners; chapter-level indicator only'],
    ['Partner × HS-4 sourcing', false, 'Data unavailable at HS-4 granularity'],
    [
      'Physical quantity and unit value',
      external.quantityUnitValue.available,
      external.quantityUnitValue.path,
    ],
    [
      'Domestic production and capacity',
      external.domesticSupply.available,
      external.domesticSupply.path,
    ],
    ['Tariff and policy overlays', external.policy.available, external.policy.path],
    [
      'State × product capability',
      external.stateCapability.available,
      external.stateCapability.path,
    ],
  ];
  return (
    <Paper sx={{ ...cardSx }}>
      <Typography variant="overline" sx={{ color: C.slate }}>
        Evidence coverage
      </Typography>
      <Typography variant="h5">What the page knows—and what it does not</Typography>
      <Typography sx={{ mt: 0.6, fontSize: 12.5, color: 'text.secondary' }}>
        Unavailable dimensions have committed data contracts but are not estimated.
      </Typography>
      <Box
        sx={{ mt: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1 }}
      >
        {rows.map(([label, available, note]) => (
          <Box
            key={label}
            sx={{
              p: 1.25,
              display: 'flex',
              gap: 1,
              alignItems: 'flex-start',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: available ? alpha(C.teal, 0.035) : '#f8fafc',
            }}
          >
            <Chip
              size="small"
              label={available ? 'Available' : 'Awaiting data'}
              sx={{
                flexShrink: 0,
                color: available ? C.teal : C.slate,
                bgcolor: available ? alpha(C.teal, 0.1) : alpha(C.slate, 0.1),
              }}
            />
            <Box>
              <Typography sx={{ fontSize: 11.5, fontWeight: 800 }}>{label}</Typography>
              <Typography
                sx={{ mt: 0.2, fontSize: 9.5, color: 'text.secondary', wordBreak: 'break-word' }}
              >
                {note}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
