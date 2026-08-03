'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowBack,
  DirectionsBike,
  DirectionsCar,
  FactCheck,
  PhoneIphone,
  Verified,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import mobility from '../../data/india_mobility_brand_evidence.json';
import phones from '../../data/india_phone_brand_evidence.json';
import economics from '../../data/india_consumer_brand_economics.json';
import Footer from '../components/layout/Footer.js';
import Masthead from '../components/layout/Masthead.js';
import cardSx from '../components/primitives/cardSx.js';
import ToggleChips from '../components/primitives/ToggleChips.js';
import { C, layout } from '../theme.js';

const categories = {
  phones: { label: 'Smartphones', icon: PhoneIphone, color: C.purple },
  bikes: { label: 'Two-wheelers', icon: DirectionsBike, color: C.teal },
  cars: { label: 'Cars', icon: DirectionsCar, color: C.blue },
};

const economicsByCompany = new Map(
  economics.rows.map((row) => [`${row.category}-${row.company}`, row]),
);

const formatRevenue = (value) => {
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} lakh cr`;
  return `₹${Math.round(value).toLocaleString('en-IN')} cr`;
};

const phoneRows = phones.brands.map((row) => ({
  ...economicsByCompany.get(`phones-${row.brand}`),
  category: 'phones',
  company: row.brand,
  scopeNote: row.scopeNote,
  sales: `${row.share}% shipment share`,
  salesPeriod: phones.marketSnapshot.period,
}));

const vehicleRows = [
  ...mobility.twoWheelers.map((row) => ({ ...row, category: 'bikes' })),
  ...mobility.cars.map((row) => ({ ...row, category: 'cars' })),
].map((row) => ({
  ...economicsByCompany.get(`${row.category}-${row.brand}`),
  category: row.category,
  company: row.brand,
  sales: `${(row.units / 100000).toFixed(1)} lakh retail`,
  salesPeriod: 'FY2024–25',
}));

const allRows = [...phoneRows, ...vehicleRows];
const sourceLinkSx = {
  color: C.blueDeep,
  fontWeight: 700,
  fontSize: 12,
  textDecoration: 'underline',
  textDecorationColor: 'rgba(51,79,112,.3)',
  textUnderlineOffset: 3,
};

function DetailCell({ value, note, tone }) {
  return (
    <Box sx={{ minWidth: 150 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 800, color: tone || 'text.primary' }}>
        {value}
      </Typography>
      {note && (
        <Typography sx={{ mt: 0.3, color: 'text.secondary', fontSize: 11.25, lineHeight: 1.45 }}>
          {note}
        </Typography>
      )}
    </Box>
  );
}

function BrandsTable() {
  const [category, setCategory] = useState('all');
  const rows = useMemo(
    () => (category === 'all' ? allRows : allRows.filter((row) => row.category === category)),
    [category],
  );

  return (
    <Paper component="section" aria-label="Consumer brands sales and origin table" sx={{ ...cardSx, p: 0, overflow: 'hidden' }}>
      <Box
        sx={{
          p: layout.cardPadding,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 1.5,
          bgcolor: '#f7f4ed',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box>
          <Typography variant="h5">Company sales and product origin</Typography>
          <Typography sx={{ mt: 0.35, color: 'text.secondary', fontSize: 12.5 }}>
            One table, designed to expand as more product categories are added.
          </Typography>
        </Box>
        <ToggleChips
          options={[
            ['all', 'All categories'],
            ['phones', 'Smartphones'],
            ['bikes', 'Two-wheelers'],
            ['cars', 'Cars'],
          ]}
          value={category}
          onChange={setCategory}
          colorFor={(key) => (key === 'all' ? C.ink : categories[key].color)}
        />
      </Box>

      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 1080 }} aria-label="India company sales revenue and manufacturing origin">
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>India sales</TableCell>
              <TableCell>FY25 revenue</TableCell>
              <TableCell>Made in India</TableCell>
              <TableCell>Imported</TableCell>
              <TableCell>Source</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const meta = categories[row.category];
              const Icon = meta.icon;
              return (
                <TableRow key={`${row.category}-${row.company}`} hover>
                  <TableCell>
                    <Typography sx={{ fontSize: 14, fontWeight: 800 }}>{row.company}</Typography>
                    {row.scopeNote && (
                      <Typography sx={{ mt: 0.2, color: 'text.secondary', fontSize: 10.75 }}>
                        {row.scopeNote}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      icon={<Icon />}
                      label={meta.label}
                      sx={{ bgcolor: `${meta.color}14`, color: meta.color, '& .MuiChip-icon': { color: meta.color } }}
                    />
                  </TableCell>
                  <TableCell>
                    <DetailCell value={row.sales} note={row.salesPeriod} tone={meta.color} />
                  </TableCell>
                  <TableCell>
                    <DetailCell
                      value={formatRevenue(row.revenueCr)}
                      note={row.revenueScope}
                    />
                  </TableCell>
                  <TableCell>
                    <DetailCell
                      value={row.madeShare}
                      note={`${row.originMethod} · ${row.originNote}`}
                      tone={C.teal}
                    />
                  </TableCell>
                  <TableCell>
                    <DetailCell value={row.importedShare} note="Finished-unit share; components excluded" tone={C.orange} />
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.7} sx={{ minWidth: 150 }}>
                      <Box component="a" href={row.revenueSource.url} target="_blank" rel="noopener noreferrer" sx={sourceLinkSx}>
                        Revenue ↗
                      </Box>
                      <Box component="a" href={row.originSource.url} target="_blank" rel="noopener noreferrer" sx={sourceLinkSx}>
                        Origin method ↗
                      </Box>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default function MobilityBrief() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Masthead />
      <Box sx={{ bgcolor: C.ink, color: '#fff' }}>
        <Container maxWidth="xl" sx={{ py: layout.heroY }}>
          <Button component={Link} href="/" startIcon={<ArrowBack />} sx={{ mb: 2.5, color: 'rgba(255,255,255,.78)' }}>
            All trade data
          </Button>
          <Typography variant="overline" sx={{ color: '#e7b48c' }}>India’s consumer brands</Typography>
          <Typography
            component="h1"
            sx={{
              mt: 0.4,
              maxWidth: 980,
              fontFamily: 'var(--font-display)',
              fontSize: { xs: '2.45rem', md: '4.1rem' },
              lineHeight: 1.02,
              letterSpacing: '-.035em',
            }}
          >
            The brands India buys. What is actually made here?
          </Typography>
          <Typography sx={{ mt: 2, maxWidth: 780, color: 'rgba(255,255,255,.73)', fontSize: { xs: 15, md: 17 }, lineHeight: 1.65 }}>
            Company sales, India manufacturing and imports in one growing table—starting with smartphones, two-wheelers and cars.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: layout.pageY }}>
        <Stack spacing={layout.sectionGap}>
          <Box>
            <Typography variant="overline" sx={{ color: C.orange }}>One comparable view</Typography>
            <Typography component="h2" variant="h4" sx={{ mt: 0.25 }}>
              Sales and sourcing, without false precision
            </Typography>
            <Typography sx={{ mt: 0.8, maxWidth: 900, color: 'text.secondary', fontSize: 14, lineHeight: 1.7 }}>
              FY25 company or automotive-segment revenue sits beside India sales and the estimated origin of finished units. Every percentage is labelled as a company claim, a sector-backed estimate or a model-sales calculation.
            </Typography>
          </Box>

          <BrandsTable />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: layout.contentGap,
            }}
          >
            <Paper sx={{ ...cardSx, bgcolor: '#e7ece9' }}>
              <Verified sx={{ color: C.teal, mb: 0.8 }} />
              <Typography variant="h5">A useful sector benchmark</Typography>
              <Typography sx={{ mt: 0.8, color: 'text.secondary', fontSize: 13.5, lineHeight: 1.7 }}>
                The Government of India estimates that 99.2% of phones sold in India are made locally. Brand-specific company claims take priority; the sector figure is only used to bound clearly marked estimates.
              </Typography>
              <Box component="a" href={phones.sectorFacts[0].source.url} target="_blank" rel="noopener noreferrer" sx={{ ...sourceLinkSx, display: 'inline-block', mt: 1 }}>
                {phones.sectorFacts[0].source.label} ↗
              </Box>
            </Paper>
            <Paper sx={{ ...cardSx, bgcolor: '#e9e4d9' }}>
              <FactCheck sx={{ color: C.orange, mb: 0.8 }} />
              <Typography variant="h5">What “Made in India” means here</Typography>
              <Typography sx={{ mt: 0.8, color: 'text.secondary', fontSize: 13.5, lineHeight: 1.7 }}>
                It measures where the finished phone or vehicle was manufactured or assembled. It does not claim that the same percentage of chips, batteries, engines or other component value is Indian.
              </Typography>
            </Paper>
          </Box>
        </Stack>
      </Container>
      <Footer />
    </Box>
  );
}
