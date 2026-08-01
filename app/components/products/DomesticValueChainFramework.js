'use client';

import * as React from 'react';
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  AccountTreeRounded,
  ArrowForwardRounded,
  FactoryRounded,
  Inventory2Rounded,
  SearchRounded,
  VerifiedRounded,
  WarningAmberRounded,
} from '@mui/icons-material';

import valueChainData from '../../../data/domestic_value_chain_opportunities.json';
import { C, mono } from '../../theme.js';
import { moneyB } from '../../lib/format.js';
import cardSx from '../primitives/cardSx.js';

const availabilityColor = {
  available: '#5f7b58',
  emerging: '#b45309',
  limited: '#be185d',
  not_available: '#b91c1c',
  unknown: '#64748b',
};

const shortDescription = (value) =>
  value
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\s+/g, ' ');

function SummaryMetric({ label, value, note, color }) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'rgba(226,232,240,0.58)',
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ ...mono, mt: 0.35, fontSize: 22, fontWeight: 800, color }}>
        {value}
      </Typography>
      <Typography sx={{ mt: 0.25, fontSize: 10.5, color: 'rgba(226,232,240,0.55)' }}>
        {note}
      </Typography>
    </Box>
  );
}

function ChainNode({ eyebrow, title, note, color, icon, sourceUrl, sourceLabel }) {
  return (
    <Box
      sx={{
        minWidth: 0,
        p: 1.5,
        borderRadius: 2,
        border: `1px solid ${alpha(color, 0.2)}`,
        bgcolor: alpha(color, 0.06),
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color }}>
        {icon}
        <Typography
          sx={{
            fontSize: 9.5,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {eyebrow}
        </Typography>
      </Box>
      <Typography sx={{ mt: 0.65, fontSize: 12, fontWeight: 800, lineHeight: 1.35 }}>
        {title}
      </Typography>
      {note ? (
        <Typography sx={{ mt: 0.45, fontSize: 10.5, lineHeight: 1.45, color: 'text.secondary' }}>
          {note}
        </Typography>
      ) : null}
      {sourceUrl ? (
        <Box
          component="a"
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={sourceLabel ?? `Open cited source (opens in new tab)`}
          sx={{
            mt: 'auto',
            pt: 0.75,
            fontSize: 10.5,
            fontWeight: 700,
            color,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.35,
            textDecoration: 'underline',
            textUnderlineOffset: '2px',
            '&:hover': { textDecoration: 'none' },
          }}
        >
          <span>Open cited source ↗</span>
        </Box>
      ) : null}
    </Box>
  );
}

export default function DomesticValueChainFramework() {
  const mappedProducts = valueChainData.products.filter((product) => product.links.length);
  const initial =
    mappedProducts.find((product) => product.netBalanceUsdMn < 0) ?? mappedProducts[0] ?? null;
  const [selectedCode, setSelectedCode] = React.useState(initial?.hscode ?? '');
  const [scope, setScope] = React.useState('mapped');
  const [query, setQuery] = React.useState('');
  const [sector, setSector] = React.useState('all');

  const sectors = React.useMemo(
    () => [...new Set(valueChainData.products.map((product) => product.sector))].sort(),
    [],
  );
  const candidates = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    return valueChainData.products
      .filter((product) => scope === 'all' || product.links.length)
      .filter((product) => sector === 'all' || product.sector === sector)
      .filter(
        (product) =>
          !needle ||
          product.hscode.includes(needle) ||
          product.description.toLowerCase().includes(needle),
      )
      .sort((a, b) => {
        if (a.links.length !== b.links.length) return b.links.length - a.links.length;
        return b.latestImportUsdMn - a.latestImportUsdMn;
      });
  }, [query, scope, sector]);

  const selected =
    candidates.find((product) => product.hscode === selectedCode) ?? candidates[0] ?? null;
  const activeCode = selected?.hscode ?? '';
  const endProductDeficit = selected ? Math.max(0, -selected.netBalanceUsdMn) : 0;

  return (
    <Paper sx={{ ...cardSx, p: 0, overflow: 'hidden' }}>
      <Box
        sx={{
          p: { xs: 2.25, md: 3 },
          color: '#fff',
          background: 'linear-gradient(120deg, #182235 0%, #2a3547 100%)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="overline" sx={{ color: '#a5b4fc' }}>
              Domestic value-chain opportunity framework · Research preview
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.3, maxWidth: 850 }}>
              Where final-product imports meet Indian input capability
            </Typography>
            <Typography
              sx={{ mt: 0.8, maxWidth: 860, fontSize: 12.5, lineHeight: 1.65, color: '#cbd5e1' }}
            >
              Trace an imported end product to the components India has, the manufacturing step
              still missing, and the observed net trade position. Unmapped lines stay visible as
              research gaps.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip
              label="Research preview"
              size="small"
              sx={{ color: '#c7d2fe', bgcolor: alpha('#6366f1', 0.25), fontWeight: 700 }}
            />
            <Chip
              icon={<VerifiedRounded />}
              label="No unsupported impact estimates"
              sx={{ color: '#ccfbf1', bgcolor: alpha('#14b8a6', 0.2) }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            mt: 2.6,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(4,1fr)' },
            gap: 2,
          }}
        >
          <SummaryMetric
            label="End-product universe"
            value={valueChainData.metadata.totalEndProductLines.toLocaleString()}
            note="Finished, capital and consumption products"
            color="#c7d2fe"
          />
          <SummaryMetric
            label="Gross imports"
            value={moneyB(valueChainData.summary.totalEndProductImportUsdMn)}
            note="Never treated as achievable impact"
            color="#d0a37d"
          />
          <SummaryMetric
            label="Input-mapped"
            value={`${valueChainData.metadata.mappedEndProductLines}`}
            note={`${mappedProducts.reduce((sum, product) => sum + product.links.length, 0)} curated research links`}
            color="#9db7b1"
          />
          <SummaryMetric
            label="Research backlog"
            value={(
              valueChainData.metadata.totalEndProductLines -
              valueChainData.metadata.mappedEndProductLines
            ).toLocaleString()}
            note="Requires product-to-input evidence"
            color="#d49a9f"
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '390px minmax(0,1fr)' },
          minHeight: 610,
        }}
      >
        <Box sx={{ p: 2, borderRight: { lg: '1px solid' }, borderColor: 'divider' }}>
          <Stack direction={{ xs: 'column', sm: 'row', lg: 'column' }} spacing={1.2}>
            <TextField
              size="small"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search HS code or product"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRounded fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <FormControl size="small">
                <InputLabel>Coverage</InputLabel>
                <Select
                  value={scope}
                  label="Coverage"
                  onChange={(event) => setScope(event.target.value)}
                >
                  <MenuItem value="mapped">Mapped chains</MenuItem>
                  <MenuItem value="all">
                    All {valueChainData.metadata.totalEndProductLines} lines
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small">
                <InputLabel>Sector</InputLabel>
                <Select
                  value={sector}
                  label="Sector"
                  onChange={(event) => setSector(event.target.value)}
                >
                  <MenuItem value="all">All sectors</MenuItem>
                  {sectors.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Stack>
          <Typography sx={{ mt: 1.5, mb: 0.75, fontSize: 10.5, color: 'text.secondary' }}>
            {candidates.length.toLocaleString()} products · ordered by mapped evidence, then imports
          </Typography>
          <Stack spacing={0.8} sx={{ maxHeight: 455, overflowY: 'auto', pr: 0.5 }}>
            {candidates.map((product) => {
              const active = product.hscode === activeCode;
              return (
                <Button
                  key={product.hscode}
                  aria-label={`Select HS ${product.hscode}`}
                  onClick={() => setSelectedCode(product.hscode)}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    p: 1.2,
                    color: 'text.primary',
                    border: '1px solid',
                    borderColor: active ? alpha(C.purple, 0.5) : 'divider',
                    bgcolor: active ? alpha(C.purple, 0.07) : '#fff',
                    '&:hover': { bgcolor: alpha(C.purple, 0.06) },
                  }}
                >
                  <Box sx={{ minWidth: 0, width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Typography
                        sx={{ ...mono, fontSize: 11.5, fontWeight: 800, color: C.purple }}
                      >
                        HS {product.hscode}
                      </Typography>
                      {product.links.length ? (
                        <Chip
                          size="small"
                          label={`${product.links.length} links`}
                          sx={{ ml: 'auto', height: 18, fontSize: 9 }}
                        />
                      ) : (
                        <Chip
                          size="small"
                          label="evidence needed"
                          sx={{ ml: 'auto', height: 18, fontSize: 9, color: '#64748b' }}
                        />
                      )}
                    </Box>
                    <Typography
                      noWrap
                      sx={{ mt: 0.4, fontSize: 11, fontWeight: 700, textTransform: 'none' }}
                    >
                      {shortDescription(product.description)}
                    </Typography>
                    <Typography sx={{ ...mono, mt: 0.35, fontSize: 9.5, color: 'text.secondary' }}>
                      Imports {moneyB(product.latestImportUsdMn)} ·{' '}
                      {product.netBalanceUsdMn >= 0 ? 'surplus' : 'deficit'}{' '}
                      {moneyB(Math.abs(product.netBalanceUsdMn))}
                    </Typography>
                  </Box>
                </Button>
              );
            })}
          </Stack>
        </Box>

        <Box sx={{ p: { xs: 2, md: 2.5 }, bgcolor: '#f8fafc' }}>
          {selected ? (
            <>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  justifyContent: 'space-between',
                  gap: 1.5,
                }}
              >
                <Box>
                  <Typography sx={{ ...mono, fontSize: 11, fontWeight: 800, color: C.purple }}>
                    HS {selected.hscode} · {selected.productionStage}
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 0.35 }}>
                    {shortDescription(selected.description)}
                  </Typography>
                  <Typography sx={{ mt: 0.6, fontSize: 12, color: 'text.secondary' }}>
                    {selected.strategicFrame}
                    {selected.mixedUseFlag ? ' · mixed-use HS heading' : ''}
                  </Typography>
                </Box>
                <Chip
                  icon={selected.links.length ? <AccountTreeRounded /> : <WarningAmberRounded />}
                  label={selected.evidenceStatus}
                  sx={{
                    alignSelf: 'flex-start',
                    color: selected.links.length ? '#92400e' : '#475569',
                    bgcolor: selected.links.length ? '#fef3c7' : '#e2e8f0',
                  }}
                />
              </Box>

              <Box
                sx={{
                  mt: 2,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(4,1fr)' },
                  gap: 1,
                }}
              >
                {[
                  ['Imports', moneyB(selected.latestImportUsdMn), C.orange],
                  ['Export offset', moneyB(selected.latestExportUsdMn), C.blue],
                  [
                    'Net balance',
                    `${selected.netBalanceUsdMn >= 0 ? '+' : '−'}${moneyB(Math.abs(selected.netBalanceUsdMn))}`,
                    selected.netBalanceUsdMn >= 0 ? '#5f7b58' : C.red,
                  ],
                  ['Deficit base', moneyB(endProductDeficit), C.purple],
                ].map(([label, value, color]) => (
                  <Box
                    key={label}
                    sx={{
                      p: 1.3,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      bgcolor: '#fff',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 9.5,
                        fontWeight: 800,
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                      }}
                    >
                      {label}
                    </Typography>
                    <Typography sx={{ ...mono, mt: 0.35, fontSize: 16, fontWeight: 800, color }}>
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {selected.links.length ? (
                <Stack spacing={1.4} sx={{ mt: 2 }}>
                  {selected.links.map((link) => {
                    const color = availabilityColor[link.domesticAvailability];
                    return (
                      <Box key={`${selected.hscode}-${link.inputHscode}-${link.inputRole}`}>
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                              xs: '1fr',
                              md: 'minmax(0,0.9fr) 24px minmax(0,0.9fr) 24px minmax(0,1.2fr)',
                            },
                            gap: 0.8,
                            alignItems: 'stretch',
                          }}
                        >
                          <ChainNode
                            eyebrow="Imported end product"
                            title={`HS ${selected.hscode}`}
                            note={moneyB(selected.latestImportUsdMn)}
                            color={C.orange}
                            icon={<Inventory2Rounded sx={{ fontSize: 16 }} />}
                          />
                          <ArrowForwardRounded
                            sx={{
                              display: { xs: 'none', md: 'block' },
                              alignSelf: 'center',
                              color: '#94a3b8',
                            }}
                          />
                          <ChainNode
                            eyebrow={link.inputRole}
                            title={`HS ${link.inputHscode} · ${shortDescription(link.inputDescription)}`}
                            note={`${moneyB(link.inputImportUsdMn)} imports · ${moneyB(Math.max(0, -link.inputNetBalanceUsdMn))} deficit`}
                            color={C.purple}
                            icon={<AccountTreeRounded sx={{ fontSize: 16 }} />}
                          />
                          <ArrowForwardRounded
                            sx={{
                              display: { xs: 'none', md: 'block' },
                              alignSelf: 'center',
                              color: '#94a3b8',
                            }}
                          />
                          <ChainNode
                            eyebrow={`India: ${link.domesticAvailability} · ${link.evidenceGrade}`}
                            title={link.conversionGap}
                            note={`${link.timeHorizon} · source checked ${link.sourceDate}`}
                            color={color}
                            icon={<FactoryRounded sx={{ fontSize: 16 }} />}
                            sourceUrl={link.sourceUrl}
                            sourceLabel={`Open cited source for HS ${selected.hscode} to HS ${link.inputHscode} research link (opens in new tab)`}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              ) : (
                <Box
                  sx={{
                    mt: 2,
                    p: 2.5,
                    border: '1px dashed',
                    borderColor: '#94a3b8',
                    borderRadius: 2,
                    bgcolor: '#fff',
                  }}
                >
                  <Typography sx={{ fontWeight: 800 }}>Input map not yet researched</Typography>
                  <Typography
                    sx={{ mt: 0.6, fontSize: 12, lineHeight: 1.6, color: 'text.secondary' }}
                  >
                    Next evidence needed: critical material/component HS codes, Indian production or
                    capacity, the missing conversion step, and a source date. Until then this line
                    is not labelled buildable.
                  </Typography>
                </Box>
              )}

              <Box
                sx={{
                  mt: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: alpha('#0f766e', 0.07),
                  border: `1px solid ${alpha('#0f766e', 0.16)}`,
                }}
              >
                <Typography sx={{ fontSize: 11.5, fontWeight: 800, color: '#0f766e' }}>
                  Why no monetary localisation number?
                </Typography>
                <Typography
                  sx={{ mt: 0.35, fontSize: 11, lineHeight: 1.55, color: 'text.secondary' }}
                >
                  Component deficits are shown separately and never added to finished-product
                  imports. A net-impact range unlocks only after sourced product scope, replacement
                  share, and imported-input shares are available.
                </Typography>
              </Box>
            </>
          ) : (
            <Typography color="text.secondary">No products match the current filters.</Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
