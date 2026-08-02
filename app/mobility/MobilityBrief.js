'use client';

import Link from 'next/link';
import { ArrowBack, DirectionsBike, DirectionsCar, FactCheck, PrecisionManufacturing } from '@mui/icons-material';
import { Box, Button, Chip, Container, Divider, Paper, Stack, Typography } from '@mui/material';
import mobility from '../../data/india_mobility_brand_evidence.json';
import phones from '../../data/india_phone_brand_evidence.json';
import Footer from '../components/layout/Footer.js';
import Masthead from '../components/layout/Masthead.js';
import cardSx from '../components/primitives/cardSx.js';
import { C, mono } from '../theme.js';

const linkSx = { color: C.blueDeep, fontWeight: 700, fontSize: 12, textDecorationColor: 'rgba(51,79,112,.35)' };
const lakh = (units) => `${(units / 100000).toFixed(1)}L`;

function BrandTable({ title, icon: Icon, rows, accent }) {
  const scaleMax = Math.max(...rows.map((row) => row.share));
  return <Paper component="section" aria-label={`${title} retail market-share chart`} sx={{ ...cardSx, p: 0, overflow: 'hidden' }}>
    <Box sx={{ p: { xs: 2, md: 2.5 }, display: 'flex', alignItems: 'center', gap: 1.25, bgcolor: '#f7f4ed', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'grid', placeItems: 'center', width: 34, height: 34, borderRadius: 1, bgcolor: accent, color: '#fff' }}><Icon fontSize="small" /></Box>
      <Box><Typography variant="h5">{title}</Typography><Typography sx={{ color: 'text.secondary', fontSize: 11.5 }}>FY2024–25 retail registrations</Typography></Box>
    </Box>
    {rows.map((row, index) => <Box key={row.brand} sx={{ px: { xs: 2, md: 2.5 }, py: 1.25, borderBottom: index < rows.length - 1 ? '1px solid' : 0, borderColor: 'divider' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1.25fr .65fr .7fr', gap: 1, alignItems: 'center' }}>
        <Typography sx={{ fontSize: 14, fontWeight: 800 }}>{row.brand}</Typography>
        <Typography sx={{ ...mono, color: accent, fontWeight: 800, fontSize: 17 }}>{row.share}%</Typography>
        <Typography sx={{ ...mono, color: 'text.secondary', fontSize: 12, textAlign: 'right' }}>{lakh(row.units)} retail</Typography>
      </Box>
      <Box aria-hidden="true" sx={{ mt: .7, height: 5, overflow: 'hidden', borderRadius: 99, bgcolor: '#e8e5dd' }}><Box sx={{ width: `${(row.share / scaleMax) * 100}%`, height: '100%', borderRadius: 99, bgcolor: accent }} /></Box>
    </Box>)}
  </Paper>;
}

function PhoneChart() {
  const rows = phones.brands;
  const scaleMax = Math.max(...rows.map((row) => row.share));
  return <Paper component="section" aria-label="Phone brand shipment-share chart" sx={{ ...cardSx, p: 0, overflow: 'hidden' }}>
    <Box sx={{ p: { xs: 2, md: 2.5 }, display: 'flex', alignItems: 'center', gap: 1.25, bgcolor: '#f7f4ed', borderBottom: '1px solid', borderColor: 'divider' }}><Box sx={{ display: 'grid', placeItems: 'center', width: 34, height: 34, borderRadius: 1, bgcolor: C.purple, color: '#fff' }}><FactCheck fontSize="small" /></Box><Box><Typography variant="h5">Smartphones</Typography><Typography sx={{ color: 'text.secondary', fontSize: 11.5 }}>Q1 2025 shipment share</Typography></Box></Box>
    {rows.map((row, index) => <Box key={row.brand} sx={{ px: { xs: 2, md: 2.5 }, py: 1.25, borderBottom: index < rows.length - 1 ? '1px solid' : 0, borderColor: 'divider' }}><Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'center' }}><Box><Typography sx={{ fontSize: 14, fontWeight: 800 }}>{row.brand}</Typography>{row.scopeNote && <Typography sx={{ color: 'text.secondary', fontSize: 10.5 }}>{row.scopeNote}</Typography>}</Box><Typography sx={{ ...mono, color: C.purple, fontWeight: 800, fontSize: 17 }}>{row.share}%</Typography></Box><Box aria-hidden="true" sx={{ mt: .7, height: 5, overflow: 'hidden', borderRadius: 99, bgcolor: '#e8e5dd' }}><Box sx={{ width: `${(row.share / scaleMax) * 100}%`, height: '100%', borderRadius: 99, bgcolor: C.purple }} /></Box></Box>)}
  </Paper>;
}

export default function MobilityBrief() {
  return <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
    <Masthead />
    <Box sx={{ bgcolor: C.ink, color: '#fff' }}><Container maxWidth="xl" sx={{ pt: { xs: 4, md: 6 }, pb: { xs: 3.5, md: 5 } }}>
      <Button component={Link} href="/" startIcon={<ArrowBack />} sx={{ mb: 2.5, color: 'rgba(255,255,255,.78)' }}>All trade data</Button>
      <Typography variant="overline" sx={{ color: '#e7b48c' }}>India’s consumer brands</Typography>
      <Typography component="h1" sx={{ mt: .4, maxWidth: 980, fontFamily: 'var(--font-display)', fontSize: { xs: '2.45rem', md: '4.1rem' }, lineHeight: 1.02, letterSpacing: '-.035em' }}>The brands India buys. What is actually made here?</Typography>
      <Typography sx={{ mt: 2, maxWidth: 760, color: 'rgba(255,255,255,.73)', fontSize: { xs: 15, md: 17 }, lineHeight: 1.65 }}>A growing consumer-brand index: phones, two-wheelers and cars, with market share separated from the much harder question of model-level domestic value addition.</Typography>
    </Container></Box>
    <Container maxWidth="xl" sx={{ py: { xs: 3.5, md: 5 } }}><Stack spacing={{ xs: 4.5, md: 6 }}>
      <Box component="section"><Typography variant="overline" sx={{ color: C.teal }}>A country on two wheels</Typography><Typography component="p" sx={{ mt: .5, mb: 2.25, maxWidth: 920, fontSize: { xs: 17, md: 20 }, lineHeight: 1.5, fontWeight: 700 }}>India sold 2.17 crore two-wheelers and 46.43 lakh passenger vehicles in FY2025–26. Two-wheelers are nearly five times the category by sales.</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4,1fr)' }, gap: 1.5 }}>{[
          ['2.17 cr', 'two-wheelers sold', 'FY2025–26'], ['46.43L', 'passenger vehicles sold', 'FY2025–26'], ['51.8L', 'two-wheelers exported', 'FY2025–26'], ['9.05L', 'passenger vehicles exported', 'FY2025–26']
        ].map(([value,label,note]) => <Paper key={label} sx={{ ...cardSx, p: { xs: 1.75, md: 2.25 } }}><Typography sx={{ ...mono, fontWeight: 800, fontSize: { xs: 21, md: 26 } }}>{value}</Typography><Typography sx={{ mt: .45, fontWeight: 800, fontSize: 12.5 }}>{label}</Typography><Typography sx={{ mt: .45, color: 'text.secondary', fontSize: 11.5 }}>{note}</Typography></Paper>)}</Box>
        <Box sx={{ mt: 1 }}><Box component="a" href={mobility.sources.sales.url} target="_blank" rel="noopener noreferrer" sx={linkSx}>{mobility.sources.sales.label} ↗</Box></Box>
      </Box>
      <Box component="section"><Typography variant="overline" sx={{ color: C.orange }}>The brands people choose</Typography><Typography component="h2" variant="h4" sx={{ mt: .25, mb: .7 }}>Three categories. One honest comparison.</Typography><Typography sx={{ mb: 2.5, maxWidth: 850, color: 'text.secondary', fontSize: 14, lineHeight: 1.65 }}>Phone share is Q1 2025 shipment data. Vehicle charts are FADA FY2024–25 retail registrations. Their periods and measures differ, so they should not be added together or read as one consumer-spending ranking.</Typography><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' }, gap: 2 }}><PhoneChart /><BrandTable title="Two-wheelers" icon={DirectionsBike} rows={mobility.twoWheelers} accent={C.teal} /><BrandTable title="Passenger vehicles" icon={DirectionsCar} rows={mobility.cars} accent={C.blue} /></Box><Box sx={{ mt: 1, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}><Box component="a" href={phones.marketSnapshot.source.url} target="_blank" rel="noopener noreferrer" sx={linkSx}>{phones.marketSnapshot.source.label} ↗</Box><Box component="a" href={mobility.sources.retail.url} target="_blank" rel="noopener noreferrer" sx={linkSx}>{mobility.sources.retail.label} ↗</Box></Box></Box>
      <Box component="section" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.15fr .85fr' }, gap: 2 }}><Paper sx={{ ...cardSx, bgcolor: '#e9e4d9' }}><PrecisionManufacturing sx={{ color: C.orange, mb: .8 }} /><Typography variant="h5">A brand is not a localisation score.</Typography><Typography sx={{ mt: 1, color: 'text.secondary', fontSize: 14, lineHeight: 1.7 }}>A local factory proves that some production happens in India. It does not establish the domestic content of every model. Engines, gearboxes, batteries, motors, power electronics and chips have different supply chains.</Typography></Paper><Paper sx={{ ...cardSx, bgcolor: C.ink, color: '#fff' }}><FactCheck sx={{ color: '#e7b48c', mb: .8 }} /><Typography variant="h5">What we can verify next</Typography><Divider sx={{ my: 1.2, borderColor: 'rgba(255,255,255,.16)' }} /><Typography sx={{ color: 'rgba(255,255,255,.75)', fontSize: 13.5, lineHeight: 1.7 }}>The PLI-Auto scheme requires at least 50% domestic value addition only for eligible advanced-auto products and certified variants. We will add that evidence model by model—not assign it to an entire brand.</Typography><Box component="a" href={mobility.sources.localisation.url} target="_blank" rel="noopener noreferrer" sx={{ ...linkSx, display: 'inline-block', mt: 1.15, color: '#e7b48c' }}>{mobility.sources.localisation.label} ↗</Box></Paper></Box>
    </Stack></Container><Footer />
  </Box>;
}
