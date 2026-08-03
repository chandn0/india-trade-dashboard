'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowBack,
  Checkroom,
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
  apparel: { label: 'Apparel', icon: Checkroom, color: C.orange },
};

const economicsByCompany = new Map(
  economics.rows.map((row) => [`${row.category}-${row.company}`, row]),
);

const phoneRows = phones.brands.map((row) => ({
  ...economicsByCompany.get(`phones-${row.brand}`),
  category: 'phones',
  company: row.brand,
  scopeNote: row.scopeNote,
  sales: `${row.share}% shipment share`,
  salesPeriod: phones.marketSnapshot.period,
  salesSource: phones.marketSnapshot.source,
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
  salesSource: mobility.sources.retail,
}));

const additionalRows = [
  {
    category: 'phones',
    company: 'Apple',
    scopeNote: 'Additional popular brand · comparable India revenue not separately disclosed',
    sales: '29% YoY shipment growth',
    salesPeriod: 'Q1 2025 · India smartphones',
    salesSource: {
      label: 'IDC India smartphone tracker',
      url: 'https://www.gadgets360.com/mobiles/news/india-smartphone-shipments-q1-2025-vivo-samsung-oppo-realme-apple-xiaomi-yoy-growth-idc-report-8395200',
    },
    revenueCr: null,
    revenueScope: 'Apple does not disclose India iPhone revenue separately',
    madeShare: 'Not disclosed',
    importedShare: 'Not disclosed',
    originMethod: 'Supplier-footprint evidence',
    originNote: 'Apple documents a growing Indian supplier network, but not the origin mix of iPhones sold in India.',
    originSource: {
      label: 'Apple India supply chain',
      url: 'https://www.apple.com/in/newsroom/2026/02/apple-launches-new-education-hub-for-supplier-employees-in-india/',
    },
  },
  {
    category: 'phones',
    company: 'Motorola',
    scopeNote: 'Additional popular brand · comparable India revenue not separately disclosed',
    sales: '59% YoY shipment growth',
    salesPeriod: 'Q1 2025 · India smartphones',
    salesSource: {
      label: 'Counterpoint India smartphone tracker',
      url: 'https://telecom.economictimes.indiatimes.com/amp/news/devices/indias-smartphone-shipments-fall-in-1q25-xiaomis-share-drops-to-13-coumterpoint/120782159',
    },
    revenueCr: null,
    revenueScope: 'Motorola India handset revenue is not separately disclosed here',
    madeShare: 'India-made models',
    importedShare: 'Model-dependent',
    originMethod: 'Product disclosure',
    originNote: 'Motorola identifies India and Padget Electronics as the origin and manufacturer for current high-volume models.',
    originSource: {
      label: 'Motorola India product disclosure',
      url: 'https://www.motorola.in/smartphones-motorola-edge-50-ultra/p',
    },
  },
  {
    category: 'phones',
    company: 'Nothing',
    scopeNote: 'Additional popular brand · comparable India revenue not separately disclosed',
    sales: '156% YoY shipment growth',
    salesPeriod: 'Q1 2025 · India smartphones',
    salesSource: {
      label: 'Counterpoint India smartphone tracker',
      url: 'https://telecom.economictimes.indiatimes.com/amp/news/devices/indias-smartphone-shipments-fall-in-1q25-xiaomis-share-drops-to-13-coumterpoint/120782159',
    },
    revenueCr: null,
    revenueScope: 'Nothing India handset revenue is not separately disclosed here',
    madeShare: '100%',
    importedShare: '0%',
    originMethod: 'Company claim · 2026',
    originNote: 'Nothing says every phone sold in India is made in India.',
    originSource: {
      label: 'Nothing community announcement',
      url: 'https://nothing.community/d/51017-momentum-starts-somewhere-ours-started-here-india',
    },
  },
  {
    category: 'bikes',
    company: 'Ola Electric',
    scopeNote: 'Electric two-wheelers',
    sales: '3.4 lakh retail',
    salesPeriod: 'FY2024–25',
    salesSource: mobility.sources.retail,
    revenueCr: null,
    revenueScope: 'Comparable brand-level FY25 revenue not added to this view',
    madeShare: 'India production',
    importedShare: 'Not reported',
    originMethod: 'Company manufacturing disclosure',
    originNote: 'Ola Electric manufactures its scooters at the Futurefactory in Tamil Nadu.',
    originSource: {
      label: 'Ola Electric business overview',
      url: 'https://www.olaelectric.com/our-business',
    },
  },
  {
    category: 'bikes',
    company: 'Ather',
    scopeNote: 'Electric two-wheelers',
    sales: '1.3 lakh retail',
    salesPeriod: 'FY2024–25',
    salesSource: mobility.sources.retail,
    revenueCr: null,
    revenueScope: 'Comparable brand-level FY25 revenue not added to this view',
    madeShare: 'India production',
    importedShare: 'Not reported',
    originMethod: 'Company manufacturing disclosure',
    originNote: 'Ather manufactures electric scooters and batteries at its Hosur facilities in Tamil Nadu.',
    originSource: {
      label: 'Ather Energy annual report',
      url: 'https://media.atherenergy.com/AGM-and-Annual-Report-FY-2024-25.pdf',
    },
  },
  {
    category: 'cars',
    company: 'Honda Cars',
    scopeNote: 'Additional popular passenger-vehicle brand',
    sales: '0.6 lakh retail',
    salesPeriod: 'FY2024–25',
    salesSource: mobility.sources.retail,
    revenueCr: null,
    revenueScope: 'Comparable brand-level FY25 revenue not added to this view',
    madeShare: 'India-built range',
    importedShare: 'Not separately reported',
    originMethod: 'Company manufacturing disclosure',
    originNote: 'Honda Cars India operates its vehicle and engine manufacturing facility at Tapukara, Rajasthan.',
    originSource: {
      label: 'Honda Cars India operations',
      url: 'https://www.hondacarindia.com/company/india-operations',
    },
  },
  {
    category: 'cars',
    company: 'MG Motor',
    scopeNote: 'Additional popular passenger-vehicle brand',
    sales: '0.6 lakh retail',
    salesPeriod: 'FY2024–25',
    salesSource: mobility.sources.retail,
    revenueCr: null,
    revenueScope: 'Comparable brand-level FY25 revenue not added to this view',
    madeShare: 'Mostly India-built',
    importedShare: 'Limited model mix',
    originMethod: 'Company manufacturing disclosure',
    originNote: 'JSW MG Motor manufactures and assembles its India range at Halol, Gujarat.',
    originSource: {
      label: 'JSW MG Motor India operations',
      url: 'https://corp.mgmotor.co.in/about-us',
    },
  },
  {
    category: 'cars',
    company: 'Renault',
    scopeNote: 'Additional popular passenger-vehicle brand',
    sales: '0.4 lakh retail',
    salesPeriod: 'FY2024–25',
    salesSource: mobility.sources.retail,
    revenueCr: null,
    revenueScope: 'Comparable brand-level FY25 revenue not added to this view',
    madeShare: 'India-built range',
    importedShare: 'No regular CBU mix',
    originMethod: 'Company manufacturing disclosure',
    originNote: 'Renault builds the Kwid, Triber and Kiger at its Chennai plant for India and export markets.',
    originSource: {
      label: 'Renault Group Chennai plant',
      url: 'https://www.renaultgroup.com/en/group/locations/chennai-plant/',
    },
  },
];

const apparelRows = [
  {
    category: 'apparel',
    company: 'Zudio',
    scopeNote: 'Value-fashion retail brand owned by Trent',
    sales: '765 stores',
    salesPeriod: '31 March 2025',
    salesSource: {
      label: 'Trent FY25 annual report',
      url: 'https://docs.trent-tata.com/Seventy_Third_Annual_Report_FY_2024-25.pdf',
    },
    revenueCr: null,
    revenueScope: 'Trent does not publish separate audited Zudio revenue',
    madeShare: 'Not disclosed',
    importedShare: 'Not disclosed',
    originMethod: 'Brand-level sourcing gap',
    originNote: 'The retailer reports its store network, but not a country-of-origin split for garments sold.',
    originSource: {
      label: 'Trent FY25 annual report',
      url: 'https://docs.trent-tata.com/Seventy_Third_Annual_Report_FY_2024-25.pdf',
    },
  },
  {
    category: 'apparel',
    company: 'Westside',
    scopeNote: 'Fashion and lifestyle retail brand owned by Trent',
    sales: '248 stores',
    salesPeriod: '31 March 2025',
    salesSource: {
      label: 'Trent FY25 annual report',
      url: 'https://docs.trent-tata.com/Seventy_Third_Annual_Report_FY_2024-25.pdf',
    },
    revenueCr: null,
    revenueScope: 'Trent does not publish separate audited Westside revenue',
    madeShare: 'Not disclosed',
    importedShare: 'Not disclosed',
    originMethod: 'Brand-level sourcing gap',
    originNote: 'The retailer does not publish an India-made versus imported garment share.',
    originSource: {
      label: 'Trent FY25 annual report',
      url: 'https://docs.trent-tata.com/Seventy_Third_Annual_Report_FY_2024-25.pdf',
    },
  },
  {
    category: 'apparel',
    company: 'Pantaloons',
    scopeNote: 'Large-format fashion retailer owned by Aditya Birla Fashion',
    sales: '405 stores',
    salesPeriod: '31 March 2025',
    salesSource: {
      label: 'ABFRL FY25 annual report',
      url: 'https://www.cms.adityabirla.com/uploads/ABFRL_Integrated_Annual_Report_FY_24_25_3c814ee239.pdf',
    },
    revenueCr: null,
    revenueScope: 'Comparable brand-level FY25 revenue is not presented in this view',
    madeShare: 'Not disclosed',
    importedShare: 'Not disclosed',
    originMethod: 'Brand-level sourcing gap',
    originNote: 'Pantaloons reports retail scale but not a finished-garment origin percentage.',
    originSource: {
      label: 'ABFRL FY25 annual report',
      url: 'https://www.cms.adityabirla.com/uploads/ABFRL_Integrated_Annual_Report_FY_24_25_3c814ee239.pdf',
    },
  },
  {
    category: 'apparel',
    company: 'Zara',
    scopeNote: 'Operated in India by Inditex Trent Retail',
    sales: '22 stores',
    salesPeriod: 'FY2024–25 · 13 cities',
    salesSource: {
      label: 'Trent FY25 disclosure',
      url: 'https://www.business-standard.com/amp/companies/news/zara-s-india-fy25-sales-flat-at-2-782-06-cr-profit-up-23-to-299-47-cr-125061200024_1.html',
    },
    revenueCr: 2782.06,
    revenueScope: 'Inditex Trent Retail revenue from operations · FY25',
    revenueSource: {
      label: 'Trent FY25 disclosure',
      url: 'https://www.business-standard.com/amp/companies/news/zara-s-india-fy25-sales-flat-at-2-782-06-cr-profit-up-23-to-299-47-cr-125061200024_1.html',
    },
    madeShare: 'Not disclosed',
    importedShare: 'Not disclosed',
    originMethod: 'India-specific sourcing gap',
    originNote: 'Public India filings report sales and stores, not garment origin by value or units.',
    originSource: {
      label: 'Trent FY25 disclosure',
      url: 'https://www.business-standard.com/amp/companies/news/zara-s-india-fy25-sales-flat-at-2-782-06-cr-profit-up-23-to-299-47-cr-125061200024_1.html',
    },
  },
  {
    category: 'apparel',
    company: 'H&M',
    scopeNote: 'Global fashion retailer with a large India network',
    sales: '₹3,595 cr revenue',
    salesPeriod: 'FY2024–25 · India operations',
    salesSource: {
      label: 'India fashion-retail comparison',
      url: 'https://www.business-standard.com/industry/news/h-m-s-revenue-gap-widens-in-fy25-uniqlo-emerges-as-breakout-story-126012201235_1.html',
    },
    revenueCr: null,
    revenueScope: 'Comparable audited India revenue is not included in this dataset',
    madeShare: 'Not disclosed',
    importedShare: 'Not disclosed',
    originMethod: 'India-specific sourcing gap',
    originNote: 'H&M publishes global supplier information, not an origin split for garments sold in India.',
    originSource: {
      label: 'H&M supplier transparency',
      url: 'https://hmgroup.com/sustainability/leading-the-change/transparency/supply-chain/',
    },
  },
  {
    category: 'apparel',
    company: 'Uniqlo',
    scopeNote: 'Global casualwear retailer expanding in India',
    sales: '₹1,176 cr revenue',
    salesPeriod: 'FY2024–25 · India operations',
    salesSource: {
      label: 'India fashion-retail comparison',
      url: 'https://www.business-standard.com/industry/news/h-m-s-revenue-gap-widens-in-fy25-uniqlo-emerges-as-breakout-story-126012201235_1.html',
    },
    revenueCr: null,
    revenueScope: 'Comparable audited India revenue is not included in this dataset',
    madeShare: 'Not disclosed',
    importedShare: 'Not disclosed',
    originMethod: 'India-specific sourcing gap',
    originNote: 'Fast Retailing publishes production-partner lists, not the origin mix of India retail sales.',
    originSource: {
      label: 'Fast Retailing production partners',
      url: 'https://www.fastretailing.com/eng/sustainability/labor/list.html',
    },
  },
];

const allRows = [...phoneRows, ...vehicleRows, ...additionalRows, ...apparelRows];
const sourceLinkSx = {
  color: C.blueDeep,
  fontWeight: 700,
  fontSize: 11,
  textDecoration: 'underline',
  textDecorationColor: 'rgba(51,79,112,.3)',
  textUnderlineOffset: 3,
};

function productionSummary(row) {
  if (row.madeShare === 'Not disclosed') return 'Not disclosed';
  if (row.originMethod?.includes('Sector-backed estimate')) return 'Mostly local · sector estimate';
  if (row.originMethod?.includes('Model-sales estimate')) return 'Mostly local · model estimate';
  if (row.originMethod?.includes('Portfolio estimate')) return 'Locally produced range';
  if (row.originMethod?.includes('Company claim')) return 'Local production · company claim';
  if (row.originMethod?.includes('Supplier-footprint')) return 'Origin mix not disclosed';
  if (row.originMethod?.includes('Product disclosure')) return 'India-made models documented';
  if (row.originMethod?.includes('manufacturing disclosure')) return 'India production documented';
  return row.madeShare;
}

function DetailCell({ value, note, tone }) {
  return (
    <Box sx={{ minWidth: 115 }}>
      <Typography sx={{ fontSize: 12.5, fontWeight: 800, color: tone || 'text.primary' }}>
        {value}
      </Typography>
      {note && (
        <Typography sx={{ mt: 0.15, color: 'text.secondary', fontSize: 10.25, lineHeight: 1.35 }}>
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
    <Paper
      component="section"
      aria-label="Consumer brands scale and production table"
      sx={{ ...cardSx, p: 0, overflow: 'hidden' }}
    >
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
          <Typography variant="h5">Brand scale and production evidence</Typography>
          <Typography sx={{ mt: 0.35, color: 'text.secondary', fontSize: 12.5 }}>
            {allRows.length} brands · only the most comparable public measure for each category.
          </Typography>
        </Box>
        <ToggleChips
          options={[
            ['all', 'All categories'],
            ['phones', 'Smartphones'],
            ['bikes', 'Two-wheelers'],
            ['cars', 'Cars'],
            ['apparel', 'Apparel'],
          ]}
          value={category}
          onChange={setCategory}
          colorFor={(key) => (key === 'all' ? C.ink : categories[key].color)}
        />
      </Box>

      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table
          size="small"
          sx={{
            minWidth: 700,
            '& .MuiTableCell-root': { px: 1.25, py: 0.85 },
          }}
          aria-label="India brand scale and production evidence"
        >
          <TableHead>
            <TableRow>
              <TableCell>Brand</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>India scale</TableCell>
              <TableCell>India production</TableCell>
              <TableCell>Evidence</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const meta = categories[row.category];
              const Icon = meta.icon;
              return (
                <TableRow key={`${row.category}-${row.company}`} hover>
                  <TableCell>
                    <Typography sx={{ fontSize: 13.5, fontWeight: 800 }}>{row.company}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      icon={<Icon />}
                      label={meta.label}
                      sx={{
                        height: 23,
                        bgcolor: `${meta.color}14`,
                        color: meta.color,
                        fontSize: 10.5,
                        '& .MuiChip-icon': { color: meta.color, fontSize: 15 },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <DetailCell value={row.sales} note={row.salesPeriod} tone={meta.color} />
                  </TableCell>
                  <TableCell>
                    <DetailCell
                      value={productionSummary(row)}
                      tone={C.teal}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} sx={{ minWidth: 90 }}>
                      {row.salesSource && (
                        <Box component="a" href={row.salesSource.url} target="_blank" rel="noopener noreferrer" sx={sourceLinkSx}>
                          Scale ↗
                        </Box>
                      )}
                      {row.originSource && (
                        <Box component="a" href={row.originSource.url} target="_blank" rel="noopener noreferrer" sx={sourceLinkSx}>
                          Origin ↗
                        </Box>
                      )}
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
            A compact, source-linked view of market scale and India production across smartphones, two-wheelers, cars and apparel.
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
              Scale means shipment share for phones, registered retail for vehicles, and stores or India revenue for apparel. Production is shown as an evidence status—not a precise percentage where public data cannot support one.
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
                It identifies documented final assembly or manufacturing in India. It does not claim that chips, batteries, engines, fabrics or other component value is Indian.
              </Typography>
            </Paper>
          </Box>
        </Stack>
      </Container>
      <Footer />
    </Box>
  );
}
