'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  ArrowBackRounded,
  ArrowForwardRounded,
  CompareArrowsRounded,
  DatasetRounded,
  InfoOutlined,
  SearchRounded,
} from '@mui/icons-material';

import stageData from '../../../data/product_stage_summary.json';
import Footer from '../layout/Footer.js';
import { C, mono } from '../../theme.js';
import { moneyB } from '../../lib/format.js';
import { filterAndSortProducts } from '../../lib/productLogic.js';
import cardSx from '../primitives/cardSx.js';
import Sparkline from '../charts/Sparkline.js';
import { OpportunityEvidenceCard } from './OpportunityEvidenceCard.js';
import ProductToolSuite from './ProductToolSuite.js';
import { useProductStageData } from './useProductStageData.js';

const stageColors = {
  'raw material': '#a16207',
  'intermediate input': C.purple,
  'finished product': C.blue,
  'capital good': C.teal,
  'energy input': C.orange,
  'agricultural commodity': '#15803d',
  'consumption asset': '#be185d',
};

const stageOrder = [
  'raw material',
  'energy input',
  'agricultural commodity',
  'intermediate input',
  'capital good',
  'finished product',
  'consumption asset',
];

const titleCase = (value) => value.replace(/\b\w/g, (letter) => letter.toUpperCase());
const imports = stageData.flows.find((flow) => flow.flow === 'Imports');
const exports = stageData.flows.find((flow) => flow.flow === 'Exports');

function Metric({ label, value, note, color = '#fff' }) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: 10.5,
          fontWeight: 800,
          color: 'rgba(226,232,240,0.56)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ ...mono, mt: 0.35, fontSize: { xs: 18, md: 22 }, fontWeight: 800, color }}>
        {value}
      </Typography>
      {note ? (
        <Typography sx={{ mt: 0.25, fontSize: 10.5, color: 'rgba(226,232,240,0.55)' }}>
          {note}
        </Typography>
      ) : null}
    </Box>
  );
}

function StageChip({ stage, compact = false }) {
  const color = stageColors[stage];
  return (
    <Chip
      size="small"
      label={titleCase(stage)}
      sx={{
        height: compact ? 20 : 22,
        color,
        bgcolor: alpha(color, 0.1),
        border: `1px solid ${alpha(color, 0.15)}`,
      }}
    />
  );
}

function StageComparison() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const rows = stageOrder.map((stage) => {
    const importStage = imports.stages.find((item) => item.stage === stage);
    const exportStage = exports.stages.find((item) => item.stage === stage);
    return {
      stage,
      importValue: importStage?.valueUsdMn ?? 0,
      exportValue: exportStage?.valueUsdMn ?? 0,
      importShare: importStage?.sharePct ?? 0,
      exportShare: exportStage?.sharePct ?? 0,
    };
  });
  const maxValue = Math.max(...rows.flatMap((row) => [row.importValue, row.exportValue]));

  return (
    <Paper sx={{ ...cardSx, p: 0, overflow: 'hidden' }}>
      <Box
        sx={{
          p: { xs: 2, md: 2.5 },
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
          alignItems: 'flex-start',
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ color: C.purple }}>
            Stage comparison
          </Typography>
          <Typography variant="h5">Where imports and exports sit in the value chain</Typography>
          <Typography sx={{ mt: 0.5, fontSize: 12.5, color: 'text.secondary' }}>
            Values compare every available HS-4 line on each side.
          </Typography>
        </Box>
        <CompareArrowsRounded sx={{ color: C.purple, fontSize: 30 }} />
      </Box>
      <Box sx={{ p: { xs: 2, md: 2.5 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '130px 1fr 92px 1fr 92px',
            gap: 1,
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 800,
              color: 'text.secondary',
              textTransform: 'uppercase',
            }}
          >
            Stage
          </Typography>
          <Typography
            sx={{ fontSize: 10, fontWeight: 800, color: C.orange, textTransform: 'uppercase' }}
          >
            Imports
          </Typography>
          <Box />
          <Typography
            sx={{ fontSize: 10, fontWeight: 800, color: C.blue, textTransform: 'uppercase' }}
          >
            Exports
          </Typography>
          <Box />
        </Box>
        {rows.map((row) => {
          const coverage = row.importValue ? (row.exportValue / row.importValue) * 100 : null;
          return (
            <Box
              key={row.stage}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '105px 1fr 70px', md: '130px 1fr 92px 1fr 92px' },
                gap: 1,
                alignItems: 'center',
                py: 1.15,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box>
                <Typography sx={{ fontSize: 11.5, fontWeight: 800, color: stageColors[row.stage] }}>
                  {titleCase(row.stage)}
                </Typography>
                {coverage !== null ? (
                  <Typography sx={{ ...mono, mt: 0.2, fontSize: 9.5, color: 'text.secondary' }}>
                    {coverage.toFixed(0)}% export/import
                  </Typography>
                ) : null}
              </Box>
              <Box
                sx={{
                  height: 9,
                  borderRadius: 99,
                  bgcolor: alpha(C.orange, 0.08),
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${(row.importValue / maxValue) * 100}%`,
                    height: '100%',
                    bgcolor: C.orange,
                    borderRadius: 99,
                  }}
                />
              </Box>
              <Typography sx={{ ...mono, textAlign: 'right', fontSize: 11.5, fontWeight: 800 }}>
                {moneyB(row.importValue)}
                <Box
                  component="span"
                  sx={{
                    display: 'block',
                    fontFamily: 'inherit',
                    fontSize: 9,
                    fontWeight: 500,
                    color: 'text.secondary',
                  }}
                >
                  {row.importShare.toFixed(1)}%
                </Box>
              </Typography>
              {isMdUp && (
                <Box
                  sx={{
                    height: 9,
                    borderRadius: 99,
                    bgcolor: alpha(C.blue, 0.08),
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: `${(row.exportValue / maxValue) * 100}%`,
                      height: '100%',
                      bgcolor: C.blue,
                      borderRadius: 99,
                    }}
                  />
                </Box>
              )}
              {isMdUp && (
                <Typography
                  sx={{
                    ...mono,
                    textAlign: 'right',
                    fontSize: 11.5,
                    fontWeight: 800,
                  }}
                >
                  {moneyB(row.exportValue)}
                  <Box
                    component="span"
                    sx={{
                      display: 'block',
                      fontFamily: 'inherit',
                      fontSize: 9,
                      fontWeight: 500,
                      color: 'text.secondary',
                    }}
                  >
                    {row.exportShare.toFixed(1)}%
                  </Box>
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}

function MixCard({ flow }) {
  const accent = flow.flow === 'Imports' ? C.orange : C.blue;
  const largest = flow.stages[0];
  return (
    <Paper sx={{ ...cardSx, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
        <Box>
          <Typography variant="overline" sx={{ color: accent }}>
            {flow.flow}
          </Typography>
          <Typography variant="h6">Composition of the complete basket</Typography>
        </Box>
        <Typography sx={{ ...mono, fontSize: 17, fontWeight: 800 }}>
          {moneyB(flow.totalUsdMn)}
        </Typography>
      </Box>
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          height: 22,
          borderRadius: 99,
          overflow: 'hidden',
          bgcolor: '#e2e8f0',
        }}
      >
        {flow.stages.map((stage) => (
          <Tooltip
            key={stage.stage}
            title={`${titleCase(stage.stage)} · ${moneyB(stage.valueUsdMn)} · ${stage.sharePct.toFixed(1)}%`}
            arrow
          >
            <Box
              sx={{
                width: `${stage.sharePct}%`,
                bgcolor: stageColors[stage.stage],
                borderRight: '1px solid rgba(255,255,255,0.6)',
              }}
            />
          </Tooltip>
        ))}
      </Box>
      <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 1 }}>
        {flow.stages.map((stage) => (
          <Box
            key={stage.stage}
            sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha(stageColors[stage.stage], 0.055) }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Box
                sx={{ width: 7, height: 7, borderRadius: 99, bgcolor: stageColors[stage.stage] }}
              />
              <Typography sx={{ fontSize: 10.5, fontWeight: 750 }}>
                {titleCase(stage.stage)}
              </Typography>
            </Box>
            <Typography sx={{ ...mono, mt: 0.5, fontSize: 13, fontWeight: 800 }}>
              {stage.sharePct.toFixed(1)}%{' '}
              <Box
                component="span"
                sx={{ fontFamily: 'inherit', fontSize: 10, color: 'text.secondary' }}
              >
                {moneyB(stage.valueUsdMn)}
              </Box>
            </Typography>
          </Box>
        ))}
      </Box>
      <Typography sx={{ mt: 2, fontSize: 11.5, color: 'text.secondary', lineHeight: 1.5 }}>
        <strong>{titleCase(largest.stage)}</strong> is the largest classified{' '}
        {flow.flow.toLowerCase()} stage at {largest.sharePct.toFixed(1)}%.
      </Typography>
    </Paper>
  );
}

function TrendPanel() {
  return (
    <Paper sx={{ ...cardSx, p: 0, overflow: 'hidden' }}>
      <Box sx={{ p: { xs: 2, md: 2.5 }, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="overline" sx={{ color: C.teal }}>
          Five-year transformation
        </Typography>
        <Typography variant="h5">How the stage mix is changing</Typography>
        <Typography sx={{ mt: 0.5, fontSize: 12.5, color: 'text.secondary' }}>
          Each bar is the complete annual HS-4 basket; segment width is that stage’s share of the
          flow.
        </Typography>
      </Box>
      <Box sx={{ p: { xs: 2, md: 2.5 } }}>
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 2 }}>
          {stageOrder.map((stage) => (
            <Box key={stage} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 7, height: 7, borderRadius: 99, bgcolor: stageColors[stage] }} />
              <Typography sx={{ fontSize: 9.5, color: 'text.secondary' }}>
                {titleCase(stage)}
              </Typography>
            </Box>
          ))}
        </Box>
        {stageData.trends.map((year) => (
          <Box
            key={year.year}
            sx={{
              display: 'grid',
              gridTemplateColumns: '58px 62px 1fr 78px',
              gap: 1,
              alignItems: 'center',
              py: 0.75,
            }}
          >
            <Typography sx={{ ...mono, gridRow: 'span 2', fontSize: 11, fontWeight: 800 }}>
              {year.year}
            </Typography>
            <Typography sx={{ fontSize: 9.5, fontWeight: 800, color: C.orange }}>
              Imports
            </Typography>
            <Box
              sx={{
                display: 'flex',
                height: 11,
                borderRadius: 99,
                overflow: 'hidden',
                bgcolor: '#e2e8f0',
              }}
            >
              {stageOrder.map((stage) => {
                const value = year.importStages.find((item) => item.stage === stage);
                return value ? (
                  <Tooltip
                    key={stage}
                    title={`${titleCase(stage)} · ${value.sharePct.toFixed(1)}%`}
                    arrow
                  >
                    <Box sx={{ width: `${value.sharePct}%`, bgcolor: stageColors[stage] }} />
                  </Tooltip>
                ) : null;
              })}
            </Box>
            <Typography sx={{ ...mono, fontSize: 10.5, textAlign: 'right' }}>
              {moneyB(year.importsTotalUsdMn)}
            </Typography>
            <Typography sx={{ fontSize: 9.5, fontWeight: 800, color: C.blue }}>Exports</Typography>
            <Box
              sx={{
                display: 'flex',
                height: 11,
                borderRadius: 99,
                overflow: 'hidden',
                bgcolor: '#e2e8f0',
              }}
            >
              {stageOrder.map((stage) => {
                const value = year.exportStages.find((item) => item.stage === stage);
                return value ? (
                  <Tooltip
                    key={stage}
                    title={`${titleCase(stage)} · ${value.sharePct.toFixed(1)}%`}
                    arrow
                  >
                    <Box sx={{ width: `${value.sharePct}%`, bgcolor: stageColors[stage] }} />
                  </Tooltip>
                ) : null;
              })}
            </Box>
            <Typography sx={{ ...mono, fontSize: 10.5, textAlign: 'right' }}>
              {moneyB(year.exportsTotalUsdMn)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

function NetBalancePanel() {
  return (
    <Paper sx={{ ...cardSx, p: 0, overflow: 'hidden' }}>
      <Box sx={{ p: { xs: 2, md: 2.5 }, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="overline" sx={{ color: C.red }}>
          Gross versus net
        </Typography>
        <Typography variant="h5">Balance by production stage</Typography>
        <Typography sx={{ mt: 0.5, fontSize: 12.5, color: 'text.secondary' }}>
          Exports offset imports within the same dominant-use stage.
        </Typography>
      </Box>
      <TableContainer>
        <Table size="small" sx={{ tableLayout: { xs: 'fixed', sm: 'auto' } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: { xs: '42%', sm: 'auto' } }}>Stage</TableCell>
              <TableCell align="right" sx={{ width: { xs: '27%', sm: 'auto' } }}>
                Imports
              </TableCell>
              <TableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                Exports
              </TableCell>
              <TableCell align="right" sx={{ width: { xs: '31%', sm: 'auto' } }}>
                Net
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stageData.stageBalances.map((row) => (
              <TableRow key={row.stage}>
                <TableCell>
                  <StageChip stage={row.stage} compact />
                </TableCell>
                <TableCell align="right" sx={{ ...mono, fontSize: 11 }}>
                  {moneyB(row.importUsdMn)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ ...mono, fontSize: 11, display: { xs: 'none', sm: 'table-cell' } }}
                >
                  {moneyB(row.exportUsdMn)}
                </TableCell>
                <TableCell align="right">
                  <Typography
                    sx={{
                      ...mono,
                      fontSize: 11.5,
                      fontWeight: 800,
                      color: row.netBalanceUsdMn >= 0 ? C.teal : C.red,
                    }}
                  >
                    {row.netBalanceUsdMn >= 0 ? '+' : '−'}
                    {moneyB(Math.abs(row.netBalanceUsdMn))}
                  </Typography>
                  <Typography sx={{ ...mono, fontSize: 9, color: 'text.secondary' }}>
                    {row.exportCoveragePct?.toFixed(0) ?? '—'}% covered
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

function ConcentrationPanel() {
  return (
    <Paper sx={{ ...cardSx }}>
      <Typography variant="overline" sx={{ color: C.purple }}>
        Distribution depth
      </Typography>
      <Typography variant="h5">How concentrated is the basket?</Typography>
      <Box
        sx={{ mt: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}
      >
        {[imports, exports].map((flow) => {
          const accent = flow.flow === 'Imports' ? C.orange : C.blue;
          return (
            <Box
              key={flow.flow}
              sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 800, color: accent }}>{flow.flow}</Typography>
                <Typography sx={{ ...mono, fontSize: 11, color: 'text.secondary' }}>
                  HHI {flow.concentration.hhi.toFixed(0)}
                </Typography>
              </Box>
              <Box sx={{ mt: 1.5, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1 }}>
                {[10, 25, 50, 100].map((count) => (
                  <Box key={count}>
                    <Typography sx={{ fontSize: 9.5, color: 'text.secondary' }}>
                      Top {count}
                    </Typography>
                    <Typography sx={{ ...mono, mt: 0.2, fontSize: 14, fontWeight: 800 }}>
                      {flow.concentration.topShares[count].toFixed(1)}%
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Typography sx={{ mt: 1.5, fontSize: 10.5, color: 'text.secondary' }}>
                {flow.concentration.productsToReach[50]} products make up 50%;{' '}
                {flow.concentration.productsToReach[90]} make up 90% of{' '}
                {flow.productCount.toLocaleString()} active lines.
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}

function ProductExplorer({ detailData }) {
  const [flowName, setFlowName] = React.useState('Imports');
  const [stage, setStage] = React.useState('');
  const [sector, setSector] = React.useState('');
  const [hs2, setHs2] = React.useState('');
  const [reviewStatus, setReviewStatus] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState('value');
  const [limit, setLimit] = React.useState(100);
  const [selectedCode, setSelectedCode] = React.useState('');
  const flow = flowName === 'Imports' ? imports : exports;
  const accent = flowName === 'Imports' ? C.orange : C.blue;
  const valueKey = flowName === 'Imports' ? 'latestImportUsdMn' : 'latestExportUsdMn';
  const rankKey = flowName === 'Imports' ? 'importRank' : 'exportRank';
  const historyKey = flowName === 'Imports' ? 'importHistory' : 'exportHistory';
  const exposureKey = flowName.toLowerCase();
  const flowProducts = detailData.products.filter((product) => product[valueKey] > 0);
  const sectors = [...new Set(flowProducts.map((product) => product.sector))].sort();
  const hs2Options = [
    ...new Set(
      flowProducts
        .filter((product) => !sector || product.sector === sector)
        .map((product) => product.hs2),
    ),
  ].sort();

  const handleExportCsv = () => {
    const { products } = filterAndSortProducts(flowProducts, {
      stage,
      sector,
      hs2,
      reviewStatus,
      query,
      sortBy,
      limit: 'all',
      flowName,
    });
    const header =
      'HS Code,Description,Sector,Stage,Value (USD Mn),Net Balance (USD Mn),Review Status,Buildability';
    const rows = products.map(
      (p) =>
        `"${p.hscode}","${p.description.replace(/"/g, '""')}","${p.sector}","${p.productionStage}",${p[valueKey]},${p.netBalanceUsdMn},"${p.reviewStatus}","${p.buildability}"`,
    );
    const csvContent = [header, ...rows].join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `indiandata_${flowName.toLowerCase()}_products.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const { products, visibleProducts } = filterAndSortProducts(flowProducts, {
    stage,
    sector,
    hs2,
    reviewStatus,
    query,
    sortBy,
    limit,
    flowName,
  });

  const selected = products.find((product) => product.hscode === selectedCode) ?? products[0];
  const selectedValue = selected?.[valueKey] ?? 0;
  const partnerExposure = selected?.partnerExposure?.[exposureKey] ?? [];

  return (
    <Paper sx={{ ...cardSx, p: 0, overflow: 'hidden' }}>
      <Box sx={{ p: { xs: 2, md: 2.5 }, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="overline" sx={{ color: accent }}>
              Product attribution explorer
            </Typography>
            <Typography variant="h5">Inspect every classification</Typography>
          </Box>
          <Button variant="outlined" size="small" onClick={handleExportCsv}>
            Export CSV
          </Button>
        </Box>
        <Box sx={{ mt: 1.75, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', gap: 0.5, p: 0.4, bgcolor: '#eef2f7', borderRadius: 2 }}>
            {['Imports', 'Exports'].map((option) => (
              <Button
                key={option}
                size="small"
                variant={flowName === option ? 'contained' : 'text'}
                onClick={() => {
                  setFlowName(option);
                  setSelectedCode('');
                }}
                sx={{
                  bgcolor:
                    flowName === option
                      ? option === 'Imports'
                        ? C.orange
                        : C.blue
                      : 'transparent',
                  '&:hover': {
                    bgcolor:
                      flowName === option
                        ? option === 'Imports'
                          ? C.orange
                          : C.blue
                        : alpha(C.slate, 0.08),
                  },
                }}
              >
                {option}
              </Button>
            ))}
          </Box>
          <TextField
            size="small"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search HS code, product or rationale"
            sx={{ minWidth: 250, flex: '2 1 280px' }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded sx={{ fontSize: 18 }} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <FormControl size="small" sx={{ minWidth: 170, flex: '1 1 170px' }}>
            <InputLabel>Production stage</InputLabel>
            <Select
              label="Production stage"
              value={stage}
              onChange={(event) => {
                setStage(event.target.value);
                setSelectedCode('');
              }}
            >
              <MenuItem value="">All stages</MenuItem>
              {stageOrder.map((item) => (
                <MenuItem key={item} value={item}>
                  {titleCase(item)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 170, flex: '1 1 170px' }}>
            <InputLabel>Sector</InputLabel>
            <Select
              label="Sector"
              value={sector}
              onChange={(event) => {
                setSector(event.target.value);
                setHs2('');
                setSelectedCode('');
              }}
            >
              <MenuItem value="">All sectors</MenuItem>
              {sectors.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 110 }}>
            <InputLabel>HS-2</InputLabel>
            <Select
              label="HS-2"
              value={hs2}
              onChange={(event) => {
                setHs2(event.target.value);
                setSelectedCode('');
              }}
            >
              <MenuItem value="">All chapters</MenuItem>
              {hs2Options.map((item) => (
                <MenuItem key={item} value={item}>
                  HS {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 155, flex: '1 1 155px' }}>
            <InputLabel>Review status</InputLabel>
            <Select
              label="Review status"
              value={reviewStatus}
              onChange={(event) => {
                setReviewStatus(event.target.value);
                setSelectedCode('');
              }}
            >
              <MenuItem value="">All statuses</MenuItem>
              <MenuItem value="reviewed">Reviewed</MenuItem>
              <MenuItem value="mixed-use">Mixed-use</MenuItem>
              <MenuItem value="needs review">Needs review</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              label="Sort by"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <MenuItem value="value">Trade value</MenuItem>
              <MenuItem value="stage">Stage</MenuItem>
              <MenuItem value="code">HS code</MenuItem>
              <MenuItem value="net">Absolute net balance</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Show</InputLabel>
            <Select label="Show" value={limit} onChange={(event) => setLimit(event.target.value)}>
              {[20, 50, 100].map((count) => (
                <MenuItem key={count} value={count}>
                  Top {count}
                </MenuItem>
              ))}
              <MenuItem value="all">All</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Typography sx={{ mt: 1.25, fontSize: 10.5, color: 'text.secondary' }}>
          Showing {visibleProducts.length.toLocaleString()} of {products.length.toLocaleString()}{' '}
          matching products · {flow.productCount.toLocaleString()} HS-4 lines in the full{' '}
          {flowName.toLowerCase()} basket
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0,1.65fr) minmax(300px,0.75fr)' },
        }}
      >
        <TableContainer
          sx={{ maxHeight: 590, borderRight: { lg: '1px solid' }, borderColor: { lg: 'divider' } }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>HS-4 product</TableCell>
                <TableCell align="right">Contribution</TableCell>
                <TableCell align="right">Value</TableCell>
                <TableCell align="right">Basket share</TableCell>
                <TableCell>Stage</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleProducts.map((product) => {
                const active = selected?.hscode === product.hscode;
                return (
                  <TableRow
                    key={product.hscode}
                    hover
                    onClick={() => setSelectedCode(product.hscode)}
                    sx={{ cursor: 'pointer', bgcolor: active ? alpha(accent, 0.055) : undefined }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography sx={{ ...mono, color: accent, fontSize: 11, fontWeight: 800 }}>
                          {product.hscode}
                        </Typography>
                        <Typography sx={{ fontSize: 11.5, fontWeight: 700, lineHeight: 1.35 }}>
                          {titleCase(product.description.toLowerCase())}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ ...mono, fontWeight: 600, fontSize: 11, color: 'text.secondary' }}
                    >
                      {product.contributionToDeficitChangePct
                        ? product.contributionToDeficitChangePct.toFixed(2) + '%'
                        : '0%'}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ ...mono, fontSize: 11.5, fontWeight: 800, whiteSpace: 'nowrap' }}
                    >
                      {moneyB(product[valueKey])}
                      {product.isMirror && (
                        <Tooltip title="High simultaneous import & export (re-export/processing pattern)">
                          <Chip
                            size="small"
                            label="Mirror"
                            sx={{
                              ml: 1,
                              height: 16,
                              fontSize: 9,
                              bgcolor: alpha(C.purple, 0.1),
                              color: C.purple,
                            }}
                          />
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ ...mono, fontSize: 11, color: 'text.secondary' }}
                    >
                      {((product[valueKey] / flow.totalUsdMn) * 100).toFixed(2)}%
                    </TableCell>
                    <TableCell>
                      <StageChip stage={product.productionStage} compact />
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={
                          product.reviewStatus === 'needs review'
                            ? 'Rule-mapped'
                            : titleCase(product.reviewStatus)
                        }
                        sx={{
                          height: 20,
                          fontSize: 10,
                          fontWeight: 700,
                          color:
                            product.reviewStatus === 'reviewed'
                              ? '#15803d'
                              : product.reviewStatus === 'mixed-use'
                                ? C.purple
                                : '#b45309',
                          bgcolor:
                            product.reviewStatus === 'reviewed'
                              ? alpha('#15803d', 0.1)
                              : product.reviewStatus === 'mixed-use'
                                ? alpha(C.purple, 0.1)
                                : alpha('#b45309', 0.1),
                          border: `1px solid ${
                            product.reviewStatus === 'reviewed'
                              ? alpha('#15803d', 0.2)
                              : product.reviewStatus === 'mixed-use'
                                ? alpha(C.purple, 0.2)
                                : alpha('#b45309', 0.2)
                          }`,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ p: { xs: 2, md: 2.5 }, bgcolor: '#f8fafc', minHeight: 300 }}>
          {selected ? (
            <OpportunityEvidenceCard
              selected={selected}
              flowName={flowName}
              rankKey={rankKey}
              historyKey={historyKey}
              stageData={detailData}
            />
          ) : (
            <Typography color="text.secondary">No products match these filters.</Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
}

export default function ProductCompositionDashboard() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const {
    sentinelRef: detailSentinelRef,
    data: detailData,
    error: detailError,
    retry: retryDetails,
  } = useProductStageData();
  const classifiedGap = imports.totalUsdMn - exports.totalUsdMn;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Box
        component="header"
        sx={{ bgcolor: C.ink, color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <Container
          maxWidth="xl"
          sx={{
            py: 1.3,
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, md: 1.5 },
            flexWrap: 'wrap',
          }}
        >
          <Button
            component={Link}
            href="/"
            size="small"
            startIcon={<ArrowBackRounded />}
            sx={{ color: 'rgba(255,255,255,0.75)' }}
          >
            Trade monitor
          </Button>
          <Typography sx={{ fontWeight: 800, fontSize: 13 }}>Product Composition</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, ml: 'auto' }}>
            <Typography
              component="a"
              href="https://github.com/chandn0/india-trade-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository (opens in new tab)"
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
                '&:hover': { color: '#fff', textDecoration: 'underline' },
              }}
            >
              GitHub ↗
            </Typography>
            <Typography
              component="a"
              href="https://github.com/chandn0/india-trade-dashboard/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contribute to India Trade Dashboard on GitHub (opens in new tab)"
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: '#5eead4',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Contribute ↗
            </Typography>
            <Chip
              size="small"
              label={`FY${stageData.metadata.fiscalYear}`}
              sx={{ color: '#d9cbff', bgcolor: alpha(C.purple, 0.32) }}
            />
          </Box>
        </Container>
      </Box>

      <Box
        sx={{
          color: '#fff',
          background: `linear-gradient(125deg, ${C.ink} 0%, #172554 58%, #163b39 130%)`,
        }}
      >
        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
          <Typography variant="overline" sx={{ color: '#7dd3fc' }}>
            India’s trade by production stage
          </Typography>
          <Typography
            variant="h2"
            component="h1"
            sx={{ mt: 0.5, maxWidth: 920, fontSize: { xs: 38, md: 58 }, lineHeight: 1.02 }}
          >
            What India buys, what India sells, and how much value is added
          </Typography>
          <Typography
            sx={{
              mt: 1.5,
              maxWidth: 780,
              color: 'rgba(236,244,255,0.7)',
              fontSize: 14.5,
              lineHeight: 1.7,
            }}
          >
            Separate raw materials from components, productive machinery, and finished products.
            Every classification is explicit, reviewable, and linked back to an HS-4 product line.
          </Typography>
          <Box
            sx={{
              mt: 3.5,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(4,minmax(150px,1fr))' },
              gap: 2.5,
            }}
          >
            <Metric
              label="Total HS-4 imports"
              value={moneyB(imports.totalUsdMn)}
              note={`${imports.productCount.toLocaleString()} active product lines`}
              color="#fdba74"
            />
            <Metric
              label="Total HS-4 exports"
              value={moneyB(exports.totalUsdMn)}
              note={`${exports.productCount.toLocaleString()} active product lines`}
              color="#93c5fd"
            />
            <Metric
              label="Full-basket gap"
              value={`−${moneyB(classifiedGap)}`}
              note="Imports minus exports"
              color="#fda4af"
            />
            <Metric
              label="Attributed HS-4 lines"
              value={stageData.metadata.totalUniqueHs4Products.toLocaleString()}
              note={`${stageData.metadata.classificationSummary['curated HS-4']} curated · ${stageData.metadata.classificationSummary['HS-2 dominant-use rule'].toLocaleString()} rule-mapped`}
              color="#5eead4"
            />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
        <Stack spacing={{ xs: 3, md: 4 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
            <MixCard flow={imports} />
            <MixCard flow={exports} />
          </Box>
          <StageComparison />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', xl: '1.15fr 0.85fr' },
              gap: 2,
            }}
          >
            <TrendPanel />
            <NetBalancePanel />
          </Box>
          <ConcentrationPanel />
          <Box
            ref={detailSentinelRef}
            data-testid="product-detail-sentinel"
            aria-hidden="true"
            sx={{ height: 1 }}
          />
          {!detailData && !detailError ? (
            <Paper sx={{ ...cardSx, textAlign: 'center' }} aria-live="polite">
              <Typography variant="h6">Loading detailed product tools…</Typography>
              <Typography sx={{ mt: 0.5, fontSize: 12.5, color: 'text.secondary' }}>
                The complete HS-4 evidence dataset loads only when this workspace approaches the
                viewport.
              </Typography>
            </Paper>
          ) : null}
          {detailError ? (
            <Paper sx={{ ...cardSx, borderColor: 'error.light' }} role="alert">
              <Typography variant="h6">Detailed product tools could not be loaded</Typography>
              <Typography sx={{ mt: 0.5, fontSize: 12.5, color: 'text.secondary' }}>
                {detailError}
              </Typography>
              <Button size="small" sx={{ mt: 1 }} onClick={retryDetails}>
                Retry
              </Button>
            </Paper>
          ) : null}
          {detailData ? <ProductToolSuite detailData={detailData} /> : null}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2,1fr)', xl: 'repeat(4,1fr)' },
              gap: 2,
            }}
          >
            <Paper sx={cardSx}>
              <DatasetRounded sx={{ color: C.orange }} />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Imports are input-heavy
              </Typography>
              <Typography
                sx={{ mt: 0.75, fontSize: 12.5, lineHeight: 1.6, color: 'text.secondary' }}
              >
                Energy, raw materials and intermediate inputs dominate the classified import basket.
                Import value alone therefore overstates final-consumption dependence.
              </Typography>
            </Paper>
            <Paper sx={cardSx}>
              <ArrowForwardRounded sx={{ color: C.blue }} />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Exports show transformation
              </Typography>
              <Typography
                sx={{ mt: 0.75, fontSize: 12.5, lineHeight: 1.6, color: 'text.secondary' }}
              >
                Finished products and processed energy exports reveal domestic value addition, while
                intermediate exports show India’s role inside global production chains.
              </Typography>
            </Paper>
            <Paper sx={cardSx}>
              <InfoOutlined sx={{ color: C.purple }} />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Stage is not deficit quality
              </Typography>
              <Typography
                sx={{ mt: 0.75, fontSize: 12.5, lineHeight: 1.6, color: 'text.secondary' }}
              >
                A capital-good import may raise future output, while a finished-good export may
                still rely heavily on imported components. Pair this page with the Buildability
                Atlas for net impact.
              </Typography>
            </Paper>
            <Paper sx={{ ...cardSx, borderStyle: 'dashed' }}>
              <DatasetRounded sx={{ color: C.slate }} />
              <Typography variant="h6" sx={{ mt: 1 }}>
                State capability needs a source
              </Typography>
              <Typography
                sx={{ mt: 0.75, fontSize: 12.5, lineHeight: 1.6, color: 'text.secondary' }}
              >
                No state × HS-4 dataset is present in the official snapshots. The model and UI are
                ready for that join, but this page will not infer state strengths from national
                trade totals.
              </Typography>
            </Paper>
          </Box>
          {detailData ? <ProductExplorer detailData={detailData} /> : null}
          <Paper sx={{ ...cardSx, bgcolor: alpha(C.purple, 0.035) }}>
            <Typography variant="subtitle1">Coverage and method</Typography>
            <Typography sx={{ mt: 0.7, fontSize: 12.5, lineHeight: 1.65, color: 'text.secondary' }}>
              {stageData.metadata.methodology} HS-4 headings can contain mixed end uses, so each
              label represents the dominant economic use at this level. The attribution table is an
              analytical layer rather than an official government classification.{' '}
              {stageData.metadata.partnerCoverage}
            </Typography>
            <Button
              component={Link}
              href="/#buildability-atlas"
              size="small"
              endIcon={<ArrowForwardRounded />}
              sx={{ mt: 1.25 }}
            >
              Continue to the Buildability Atlas
            </Button>
          </Paper>
        </Stack>
      </Container>
      <Footer />
    </Box>
  );
}
