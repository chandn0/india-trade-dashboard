'use client';

import Link from 'next/link';
import { ArrowBack, Factory, PhoneIphone, Public, Storefront, Verified } from '@mui/icons-material';
import { Box, Button, Chip, Container, Divider, Paper, Stack, Typography } from '@mui/material';
import phoneData from '../../data/india_phone_brand_evidence.json';
import Footer from '../components/layout/Footer.js';
import Masthead from '../components/layout/Masthead.js';
import cardSx from '../components/primitives/cardSx.js';
import { C, layout, mono } from '../theme.js';

function SourceLink({ source }) {
  return source ? (
    <Box
      component="a"
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        color: C.blueDeep,
        fontWeight: 700,
        fontSize: 12,
        textDecorationColor: 'rgba(51,79,112,.35)',
      }}
    >
      {source.label} ↗
    </Box>
  ) : null;
}

function SectionHeading({ eyebrow, title, body }) {
  return (
    <Box sx={{ maxWidth: 800, mb: { xs: 2.5, md: 3 } }}>
      <Typography variant="overline" sx={{ color: C.orange }}>
        {eyebrow}
      </Typography>
      <Typography component="h2" variant="h4" sx={{ mt: 0.25 }}>
        {title}
      </Typography>
      <Typography sx={{ mt: 0.7, color: 'text.secondary', lineHeight: 1.7, fontSize: 14 }}>
        {body}
      </Typography>
    </Box>
  );
}

export default function PhoneBrandBrief() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Masthead />
      <Box sx={{ bgcolor: C.ink, color: '#fff', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
        <Container maxWidth="xl" sx={{ py: layout.heroY }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, mb: 2.5 }}>
            <Button
              component={Link}
              href="/"
              startIcon={<ArrowBack />}
              sx={{ color: 'rgba(255,255,255,.78)' }}
            >
              All trade data
            </Button>
            <Button
              component={Link}
              href="/brands"
              startIcon={<Storefront />}
              sx={{
                color: 'rgba(255,255,255,.6)',
                border: '1px solid rgba(255,255,255,.22)',
                '&:hover': { bgcolor: 'rgba(255,255,255,.07)' },
              }}
            >
              Consumer brands hub
            </Button>
          </Box>
          <Typography variant="overline" sx={{ color: '#e7b48c' }}>
            India’s consumer brands · first brief
          </Typography>
          <Typography
            component="h1"
            sx={{
              mt: 0.4,
              maxWidth: 900,
              fontFamily: 'var(--font-display)',
              fontSize: { xs: '2.45rem', md: '4.1rem' },
              lineHeight: 1.02,
              letterSpacing: '-.035em',
            }}
          >
            Your next phone may be made here. Its value chain is not yet fully Indian.
          </Typography>
          <Typography
            sx={{
              mt: 2,
              maxWidth: 730,
              color: 'rgba(255,255,255,.73)',
              fontSize: { xs: 15, md: 17 },
              lineHeight: 1.65,
            }}
          >
            A clear look at India’s biggest phone brands: who sells the most, whose India
            manufacturing is documented, and where public data still cannot tell us enough.
          </Typography>
        </Container>
      </Box>
      <Container maxWidth="xl" sx={{ py: layout.pageY }}>
        <Stack spacing={layout.sectionGap}>
          <Box component="section" aria-label="India phone market snapshot">
            <Typography variant="overline" sx={{ color: C.teal }}>
              The important distinction
            </Typography>
            <Typography
              component="p"
              sx={{
                mt: 0.5,
                mb: 2.25,
                maxWidth: 900,
                fontSize: { xs: 17, md: 20 },
                lineHeight: 1.5,
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              “Made in India” can mean final assembly, locally sourced parts, or domestic value
              addition. They are different measures. This page only labels what each source
              supports.
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
                gap: 1.5,
              }}
            >
              {phoneData.sectorFacts.map((fact) => (
                <Paper
                  key={fact.label}
                  sx={{
                    ...cardSx,
                    p: { xs: 1.75, md: 2.25 },
                    bgcolor: fact.value === '18–20%' ? '#f3eadf' : 'background.paper',
                  }}
                >
                  <Typography
                    sx={{ ...mono, color: C.ink, fontSize: { xs: 21, md: 26 }, fontWeight: 800 }}
                  >
                    {fact.value}
                  </Typography>
                  <Typography sx={{ mt: 0.45, fontWeight: 800, fontSize: 12.5, lineHeight: 1.3 }}>
                    {fact.label}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.5,
                      minHeight: 32,
                      color: 'text.secondary',
                      fontSize: 11.5,
                      lineHeight: 1.4,
                    }}
                  >
                    {fact.note}
                  </Typography>
                  <SourceLink source={fact.source} />
                </Paper>
              ))}
            </Box>
          </Box>

          <Box component="section">
            <SectionHeading
              eyebrow="The brands people buy"
              title="Market leaders, with the manufacturing record beside them"
              body={`The figures show India smartphone shipment share in ${phoneData.marketSnapshot.period}. They measure demand, not where each handset or component was made.`}
            />
            <Paper sx={{ ...cardSx, overflow: 'hidden', p: 0 }}>
              <Box
                sx={{
                  display: { xs: 'none', md: 'grid' },
                  gridTemplateColumns: '1.1fr .7fr 2.4fr .8fr',
                  gap: 2,
                  px: 2.5,
                  py: 1.15,
                  bgcolor: '#f7f4ed',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                {['Brand', 'Shipment share', 'India manufacturing evidence', 'Status'].map(
                  (label) => (
                    <Typography
                      key={label}
                      sx={{
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: '.07em',
                        textTransform: 'uppercase',
                        color: 'text.secondary',
                      }}
                    >
                      {label}
                    </Typography>
                  ),
                )}
              </Box>
              {phoneData.brands.map((brand, index) => (
                <Box
                  key={brand.brand}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1.1fr .7fr 2.4fr .8fr' },
                    gap: { xs: 0.8, md: 2 },
                    p: { xs: 2, md: 2.5 },
                    borderBottom: index < phoneData.brands.length - 1 ? '1px solid' : 0,
                    borderColor: 'divider',
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: 16 }}>{brand.brand}</Typography>
                    {brand.scopeNote && (
                      <Typography sx={{ mt: 0.15, color: 'text.secondary', fontSize: 11.5 }}>
                        {brand.scopeNote}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        display: { xs: 'block', md: 'none' },
                        color: 'text.secondary',
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                      }}
                    >
                      Shipment share
                    </Typography>
                    <Typography
                      sx={{ ...mono, mt: 0.15, color: C.blueDeep, fontSize: 19, fontWeight: 800 }}
                    >
                      {brand.share}%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        display: { xs: 'block', md: 'none' },
                        color: 'text.secondary',
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                      }}
                    >
                      India manufacturing evidence
                    </Typography>
                    <Typography
                      sx={{ mt: 0.15, color: 'text.secondary', fontSize: 13, lineHeight: 1.55 }}
                    >
                      {brand.manufacturing}
                    </Typography>
                    {brand.source && (
                      <Box sx={{ mt: 0.45 }}>
                        <SourceLink source={brand.source} />
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ alignSelf: { md: 'center' } }}>
                    <Chip
                      size="small"
                      icon={brand.evidence === 'Research needed' ? <Public /> : <Verified />}
                      label={brand.evidence}
                      sx={{
                        bgcolor: brand.evidence === 'Research needed' ? '#f0eee8' : '#e5efe9',
                        color: brand.evidence === 'Research needed' ? '#5e6470' : '#315e50',
                        '& .MuiChip-icon': { color: 'inherit' },
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Paper>
            <Typography sx={{ mt: 1, color: 'text.secondary', fontSize: 12, lineHeight: 1.55 }}>
              Market-share source: <SourceLink source={phoneData.marketSnapshot.source} />. Company
              disclosures establish a reported India operation; they do not establish a brand-wide
              local-value-add percentage.
            </Typography>
            <Typography sx={{ mt: 1.25, fontSize: 13, color: 'text.secondary' }}>
              Looking for bikes and cars?{' '}
              <Box
                component={Link}
                href="/brands"
                sx={{
                  color: 'text.primary',
                  fontWeight: 700,
                  textDecorationColor: 'rgba(0,0,0,.25)',
                  '&:hover': { color: 'text.primary' },
                }}
              >
                See the full consumer brands hub →
              </Box>
            </Typography>
          </Box>

          <Box
            component="section"
            sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.15fr .85fr' }, gap: 2 }}
          >
            <Paper sx={{ ...cardSx, bgcolor: '#e9e4d9' }}>
              <Factory sx={{ color: C.orange, mb: 0.8 }} />
              <Typography variant="h5">Assembly is the start, not the finish line.</Typography>
              <Typography sx={{ mt: 1, color: 'text.secondary', fontSize: 14, lineHeight: 1.7 }}>
                Government reporting says the industry is expanding beyond final assembly into
                PCBAs, batteries, camera and display modules, and enclosures. It does not publish a
                comparable phone-brand value-add percentage, so this brief does not invent one.
              </Typography>
              <Box sx={{ mt: 1.25 }}>
                <SourceLink
                  source={{
                    label: 'PIB, electronics manufacturing update',
                    url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2230621&lang=2&reg=3',
                  }}
                />
              </Box>
            </Paper>
            <Paper sx={{ ...cardSx, bgcolor: C.ink, color: '#fff' }}>
              <PhoneIphone sx={{ color: '#e7b48c', mb: 0.8 }} />
              <Typography variant="h5">What we will add next</Typography>
              <Divider sx={{ my: 1.2, borderColor: 'rgba(255,255,255,.16)' }} />
              <Typography sx={{ color: 'rgba(255,255,255,.75)', fontSize: 13.5, lineHeight: 1.7 }}>
                Model-level factory evidence, supplier/component mapping, and sourced value-add
                estimates — only where a public source supports them. Then we will apply the same
                template to the everyday products Indians buy most.
              </Typography>
            </Paper>
          </Box>
        </Stack>
      </Container>
      <Footer />
    </Box>
  );
}
