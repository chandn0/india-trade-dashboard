'use client';

import * as React from 'react';
import {
  Box,
  Button,
  Chip,
  Collapse,
  FormControl,
  InputAdornment,
  InputLabel,
  LinearProgress,
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
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  ArrowForwardRounded,
  ExpandMoreRounded,
  FilterAltOffRounded,
  InfoOutlined,
  SearchRounded,
} from '@mui/icons-material';

import atlas from '../../../data/product_discovery.json';
import { C, mono } from '../../theme.js';
import { moneyB } from '../../lib/format.js';
import cardSx from '../primitives/cardSx.js';

const categoryColors = {
  buildable: C.blue,
  'partly buildable': C.purple,
  growable: '#5f7b58',
  recoverable: C.teal,
  substitutable: C.purple,
  'structurally imported': C.slate,
};

const titleCase = (value) =>
  value.replace(/\b\w/g, (letter) => letter.toUpperCase()).replace(/And/g, 'and');
const unique = (key) => [...new Set(atlas.products.map((item) => item[key]))].sort();
const categories = unique('buildabilityCategory');
const importTypes = unique('importType');
const horizons = unique('timeHorizon');
const sectors = unique('sector');
const countries = [
  ...new Set(atlas.products.flatMap((item) => item.countryExposure.map((row) => row.country))),
].sort();

const initialFilters = {
  category: '',
  importType: '',
  horizon: '',
  sector: '',
  country: '',
  minImport: '',
  minDeficit: '',
};

function Metric({ label, value, tone = '#fff', note }) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: 10.5,
          fontWeight: 800,
          color: 'rgba(226,232,240,0.55)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        {label}
        {note ? (
          <Tooltip title={note} arrow>
            <InfoOutlined sx={{ ml: 0.5, fontSize: 12, verticalAlign: '-2px' }} />
          </Tooltip>
        ) : null}
      </Typography>
      <Typography sx={{ ...mono, mt: 0.3, fontSize: 17, fontWeight: 800, color: tone }}>
        {value}
      </Typography>
    </Box>
  );
}

function FilterSelect({ label, value, options, onChange, format = titleCase }) {
  return (
    <FormControl size="small" sx={{ minWidth: 150, flex: '1 1 150px' }}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} onChange={(event) => onChange(event.target.value)}>
        <MenuItem value="">All</MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {format(option)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function ProductDetail({ product }) {
  const details = [
    ['Import rationale', product.importReason],
    ['Best lever', titleCase(product.bestLever)],
    ['Domestic capacity proxy', product.domesticCapacityProxy],
    ['Technology complexity', titleCase(product.technologyComplexity)],
    ['Input dependency', titleCase(product.inputDependency)],
    ['Time horizon', product.timeHorizon],
  ];

  return (
    <Box
      sx={{
        p: { xs: 2, md: 2.5 },
        bgcolor: '#f8fafc',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}
      >
        {details.map(([label, value]) => (
          <Box key={label}>
            <Typography
              sx={{
                fontSize: 10.5,
                fontWeight: 800,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {label}
            </Typography>
            <Typography sx={{ mt: 0.4, fontSize: 13, lineHeight: 1.5 }}>{value}</Typography>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          mt: 2,
          p: 1.5,
          borderRadius: 2,
          bgcolor: alpha(C.orange, 0.07),
          border: `1px solid ${alpha(C.orange, 0.16)}`,
        }}
      >
        <Typography sx={{ fontSize: 12.5, lineHeight: 1.55 }}>
          <strong>Reality check:</strong> {product.notes}
        </Typography>
      </Box>
      <Box sx={{ mt: 2, display: 'flex', gap: 0.75, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography
          sx={{
            mr: 0.5,
            fontSize: 11,
            fontWeight: 800,
            color: 'text.secondary',
            textTransform: 'uppercase',
          }}
        >
          HS-2 partner exposure
        </Typography>
        {product.countryExposure.length ? (
          product.countryExposure.map((row) => (
            <Chip
              key={row.country}
              size="small"
              variant="outlined"
              label={`${titleCase(row.country.toLowerCase())} · ${moneyB(row.importUsdMn)}`}
            />
          ))
        ) : (
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Not available</Typography>
        )}
      </Box>
      <Typography sx={{ mt: 1, fontSize: 10.5, color: 'text.secondary' }}>
        Partner figures are broader HS-2 exposure indicators, not product-specific HS-4 sourcing
        shares.
      </Typography>
    </Box>
  );
}

function ProductDiscoveryPreview() {
  const topFive = [...atlas.products]
    .sort((a, b) => b.realisticNetImpactHighUsdMn - a.realisticNetImpactHighUsdMn)
    .slice(0, 5);

  return (
    <Paper sx={{ ...cardSx, overflow: 'hidden', p: 0 }}>
      <Box
        sx={{
          p: { xs: 2.25, md: 3 },
          color: '#fff',
          background: `linear-gradient(120deg, ${C.ink} 0%, #253249 100%)`,
        }}
      >
        <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.62)' }}>
          Top five buildability opportunities
        </Typography>
        <Box
          sx={{
            mt: 0.5,
            display: 'flex',
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
          }}
        >
          <Box sx={{ maxWidth: 760 }}>
            <Typography component="h2" variant="h4">
              From import bill to realistic domestic opportunity
            </Typography>
            <Typography
              sx={{ mt: 1, color: 'rgba(236,244,255,0.73)', fontSize: 14, lineHeight: 1.65 }}
            >
              A concise ranking of the largest directional opportunities after export offsets and
              realistic reduction ranges are considered.
            </Typography>
          </Box>
          <Button
            component="a"
            href="/opportunities"
            variant="contained"
            endIcon={<ArrowForwardRounded />}
            sx={{
              flexShrink: 0,
              bgcolor: '#fff',
              color: C.ink,
              fontWeight: 800,
              '&:hover': { bgcolor: '#e7ecf5' },
            }}
          >
            Explore the full atlas
          </Button>
        </Box>
      </Box>

      <Box sx={{ p: { xs: 1.5, md: 2.5 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(5, 1fr)',
            },
            gap: 1.25,
          }}
        >
          {topFive.map((product, index) => {
            const categoryColor = categoryColors[product.buildabilityCategory] ?? C.slate;
            return (
              <Box
                key={product.hscode}
                sx={{
                  p: 1.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: alpha(categoryColor, 0.035),
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                  <Typography sx={{ ...mono, fontSize: 11, fontWeight: 800, color: C.blue }}>
                    {`#${index + 1} · HS ${product.hscode}`}
                  </Typography>
                  <Typography sx={{ ...mono, fontSize: 11, fontWeight: 800, color: C.teal }}>
                    {`${product.opportunityScore}/100`}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    mt: 0.75,
                    minHeight: { md: 48 },
                    fontSize: 12.5,
                    fontWeight: 750,
                    lineHeight: 1.3,
                  }}
                >
                  {titleCase(product.description.toLowerCase())}
                </Typography>
                <Typography
                  sx={{
                    mt: 1.25,
                    fontSize: 10,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Realistic net impact
                </Typography>
                <Typography sx={{ ...mono, mt: 0.2, fontSize: 13, fontWeight: 800, color: C.teal }}>
                  {moneyB(product.realisticNetImpactLowUsdMn)}–
                  {moneyB(product.realisticNetImpactHighUsdMn)}
                </Typography>
                <Typography sx={{ ...mono, mt: 0.75, fontSize: 10.5, color: C.red }}>
                  {`${moneyB(product.netDeficitUsdMn)} net deficit`}
                </Typography>
                <Chip
                  size="small"
                  label={titleCase(product.buildabilityCategory)}
                  sx={{
                    mt: 1.25,
                    maxWidth: '100%',
                    color: categoryColor,
                    bgcolor: alpha(categoryColor, 0.1),
                  }}
                />
              </Box>
            );
          })}
        </Box>
        <Typography sx={{ mt: 1.5, fontSize: 11.5, color: 'text.secondary', lineHeight: 1.55 }}>
          Ranked by the high end of the curated realistic net-impact range. These are directional
          scenarios, not forecasts; the full atlas includes all filters, assumptions, and product
          detail.
        </Typography>
      </Box>
    </Paper>
  );
}

function ProductDiscoveryWorkspace() {
  const [query, setQuery] = React.useState('');
  const [filters, setFilters] = React.useState(initialFilters);
  const [sortBy, setSortBy] = React.useState('impact');
  const [openCode, setOpenCode] = React.useState(atlas.products[0]?.hscode ?? '');

  const setFilter = (key) => (value) => setFilters((current) => ({ ...current, [key]: value }));
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const filtered = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const rows = atlas.products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.hscode.includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery) ||
        product.importReason.toLowerCase().includes(normalizedQuery);
      return (
        matchesQuery &&
        (!filters.category || product.buildabilityCategory === filters.category) &&
        (!filters.importType || product.importType === filters.importType) &&
        (!filters.horizon || product.timeHorizon === filters.horizon) &&
        (!filters.sector || product.sector === filters.sector) &&
        (!filters.country ||
          product.countryExposure.some((row) => row.country === filters.country)) &&
        product.importUsdMn >= filters.minImport &&
        product.netDeficitUsdMn >= filters.minDeficit
      );
    });
    return rows.sort((a, b) => {
      if (sortBy === 'import') return b.importUsdMn - a.importUsdMn;
      if (sortBy === 'deficit') return b.netDeficitUsdMn - a.netDeficitUsdMn;
      if (sortBy === 'score') return b.opportunityScore - a.opportunityScore;
      return b.realisticNetImpactHighUsdMn - a.realisticNetImpactHighUsdMn;
    });
  }, [filters, query, sortBy]);

  const totals = filtered.reduce(
    (sum, product) => ({
      imports: sum.imports + product.importUsdMn,
      exports: sum.exports + product.exportUsdMn,
      deficit: sum.deficit + product.netDeficitUsdMn,
      low: sum.low + product.realisticNetImpactLowUsdMn,
      high: sum.high + product.realisticNetImpactHighUsdMn,
    }),
    { imports: 0, exports: 0, deficit: 0, low: 0, high: 0 },
  );

  return (
    <Stack spacing={2}>
      <Paper sx={{ ...cardSx, overflow: 'hidden', p: 0 }}>
        <Box
          sx={{
            p: { xs: 2.25, md: 3 },
            color: '#fff',
            background: `linear-gradient(120deg, ${C.ink} 0%, #253249 100%)`,
          }}
        >
          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.62)' }}>
            Product discovery · Buildability atlas
          </Typography>
          <Typography component="h2" variant="h4" sx={{ mt: 0.5, maxWidth: 820 }}>
            From import bill to realistic domestic opportunity
          </Typography>
          <Typography
            sx={{
              mt: 1,
              maxWidth: 780,
              color: 'rgba(236,244,255,0.73)',
              fontSize: 14,
              lineHeight: 1.65,
            }}
          >
            See why India imports each major product, what kind of intervention fits, and how much
            of the <strong>net</strong> deficit may realistically move. Productive and structurally
            imported lines are not treated as fully removable.
          </Typography>
          <Box
            sx={{
              mt: 2.5,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(5, minmax(120px, 1fr))' },
              gap: 2,
            }}
          >
            <Metric label="Products shown" value={filtered.length} />
            <Metric label="Gross imports" value={moneyB(totals.imports)} />
            <Metric label="Export offset" value={moneyB(totals.exports)} tone="#9fb4ca" />
            <Metric label="Net deficit" value={moneyB(totals.deficit)} tone="#d49a9f" />
            <Metric
              label="Realistic net range"
              value={`${moneyB(totals.low)}–${moneyB(totals.high)}`}
              tone="#9db7b1"
              note="Sum of curated product-level scenario ranges applied to net deficit. These are directional scenarios, not forecasts."
            />
          </Box>
        </Box>

        <Box sx={{ p: { xs: 2, md: 2.5 }, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search product, reason or HS code"
              sx={{ minWidth: { xs: '100%', md: 280 }, flex: '2 1 280px' }}
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
            <FilterSelect
              label="Buildability"
              value={filters.category}
              options={categories}
              onChange={setFilter('category')}
            />
            <FilterSelect
              label="Import type"
              value={filters.importType}
              options={importTypes}
              onChange={setFilter('importType')}
            />
            <FilterSelect
              label="Horizon"
              value={filters.horizon}
              options={horizons}
              onChange={setFilter('horizon')}
              format={(value) => value}
            />
            <FilterSelect
              label="Sector"
              value={filters.sector}
              options={sectors}
              onChange={setFilter('sector')}
              format={(value) => value}
            />
            <FilterSelect
              label="Country exposure"
              value={filters.country}
              options={countries}
              onChange={setFilter('country')}
              format={(value) => titleCase(value.toLowerCase())}
            />
            <FilterSelect
              label="Min import"
              value={filters.minImport}
              options={[1000, 5000, 10000, 25000, 50000]}
              onChange={setFilter('minImport')}
              format={(value) => moneyB(value)}
            />
            <FilterSelect
              label="Min net deficit"
              value={filters.minDeficit}
              options={[1000, 5000, 10000, 25000, 50000]}
              onChange={setFilter('minDeficit')}
              format={(value) => moneyB(value)}
            />
            <FilterSelect
              label="Rank by"
              value={sortBy}
              options={['impact', 'deficit', 'import', 'score']}
              onChange={setSortBy}
              format={(value) =>
                ({
                  impact: 'Realistic impact',
                  deficit: 'Net deficit',
                  import: 'Import value',
                  score: 'Opportunity score',
                })[value]
              }
            />
            <Button
              size="small"
              variant="text"
              startIcon={<FilterAltOffRounded />}
              disabled={!activeFilterCount && !query}
              onClick={() => {
                setFilters(initialFilters);
                setQuery('');
              }}
            >
              Clear
            </Button>
          </Box>
          <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip size="small" label={`FY ${atlas.metadata.fiscalYear}`} />
            <Chip
              size="small"
              variant="outlined"
              label="State capability · data join planned"
              sx={{ borderStyle: 'dashed', color: 'text.secondary' }}
            />
            <Typography sx={{ ml: { md: 'auto' }, fontSize: 11, color: 'text.secondary' }}>
              {filtered.length} of {atlas.products.length} classified lines
            </Typography>
          </Box>
        </Box>

        <TableContainer>
          <Table size="small" sx={{ minWidth: 980 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '29%' }}>Product</TableCell>
                <TableCell align="right">Import</TableCell>
                <TableCell align="right">Export offset</TableCell>
                <TableCell align="right">Net deficit</TableCell>
                <TableCell sx={{ width: 160 }}>Realistic net impact</TableCell>
                <TableCell>Buildability</TableCell>
                <TableCell sx={{ width: 125 }}>Opportunity</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((product) => {
                const isOpen = openCode === product.hscode;
                const categoryColor = categoryColors[product.buildabilityCategory] ?? C.slate;
                return (
                  <React.Fragment key={product.hscode}>
                    <TableRow
                      hover
                      onClick={() => setOpenCode(isOpen ? '' : product.hscode)}
                      sx={{ cursor: 'pointer', '& > td': { borderBottom: isOpen ? 0 : undefined } }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1.2 }}>
                          <Typography
                            component="span"
                            sx={{ ...mono, fontSize: 12, fontWeight: 800, color: C.blue }}
                          >
                            {product.hscode}
                          </Typography>
                          <Box>
                            <Typography sx={{ fontSize: 12.5, fontWeight: 750, lineHeight: 1.35 }}>
                              {titleCase(product.description.toLowerCase())}
                            </Typography>
                            <Typography sx={{ mt: 0.35, fontSize: 10.5, color: 'text.secondary' }}>
                              {product.sector} · {titleCase(product.importType)}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ ...mono, fontWeight: 700 }}>
                        {moneyB(product.importUsdMn)}
                      </TableCell>
                      <TableCell align="right" sx={{ ...mono, color: C.blue }}>
                        {moneyB(product.exportUsdMn)}
                      </TableCell>
                      <TableCell align="right" sx={{ ...mono, fontWeight: 800, color: C.red }}>
                        {moneyB(product.netDeficitUsdMn)}
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{ ...mono, fontSize: 11.5, fontWeight: 800, color: C.teal }}
                        >
                          {moneyB(product.realisticNetImpactLowUsdMn)}–
                          {moneyB(product.realisticNetImpactHighUsdMn)}
                        </Typography>
                        <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>
                          {product.realisticReductionLowPct}–{product.realisticReductionHighPct}%
                          scenario
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={titleCase(product.buildabilityCategory)}
                          sx={{ color: categoryColor, bgcolor: alpha(categoryColor, 0.1) }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={product.opportunityScore}
                            sx={{
                              flex: 1,
                              height: 6,
                              borderRadius: 9,
                              bgcolor: alpha(C.teal, 0.1),
                              '& .MuiLinearProgress-bar': { bgcolor: C.teal },
                            }}
                          />
                          <Typography sx={{ ...mono, width: 24, fontSize: 11, fontWeight: 800 }}>
                            {product.opportunityScore}
                          </Typography>
                        </Box>
                        <Typography sx={{ mt: 0.4, fontSize: 9.5, color: 'text.secondary' }}>
                          Confidence {product.confidence}/5
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <ExpandMoreRounded
                          sx={{
                            fontSize: 20,
                            transform: isOpen ? 'rotate(180deg)' : 'none',
                            transition: 'transform 160ms',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        sx={{
                          p: 0,
                          borderBottom: isOpen ? '1px solid' : 0,
                          borderColor: 'divider',
                        }}
                      >
                        <Collapse in={isOpen} timeout="auto" unmountOnExit>
                          <ProductDetail product={product} />
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
              {!filtered.length ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No products match these filters.</Typography>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper sx={{ ...cardSx, bgcolor: alpha(C.blue, 0.035) }}>
        <Typography variant="subtitle1">Reading the atlas</Typography>
        <Typography sx={{ mt: 0.75, fontSize: 12.5, lineHeight: 1.65, color: 'text.secondary' }}>
          Net deficit = imports minus the export offset. The realistic range is a transparent
          scenario applied to that net figure; it is not a forecast or the full import bill. The
          normalized opportunity score combines high-case net impact, buildability tractability and
          confidence. All classifications and scenario assumptions live in the CSV data layer and
          can be reviewed independently of this interface.
        </Typography>
      </Paper>
    </Stack>
  );
}

export default function ProductDiscovery({ preview = false }) {
  return preview ? <ProductDiscoveryPreview /> : <ProductDiscoveryWorkspace />;
}
