'use client';

import { Box, Container, Stack, Typography } from '@mui/material';
import { C, layout } from './theme.js';

import { exportComp, importComp, exportMovers, importMovers } from './lib/transforms.js';

import Masthead from './components/layout/Masthead.js';
import Footer from './components/layout/Footer.js';

import TradeTrendChart from './components/charts/TradeTrendChart.js';
import CompositionDonut from './components/charts/CompositionDonut.js';
import CompositionChart from './components/charts/CompositionChart.js';
import PartnerButterfly from './components/charts/PartnerButterfly.js';
import PartnerTrendCard from './components/charts/PartnerTrendCard.js';
import PartnerShareCard from './components/charts/PartnerShareCard.js';
import MoversCard from './components/charts/MoversCard.js';

import ValueChainSection from './components/sections/ValueChainSection.js';
import ProductDiscovery from './components/sections/ProductDiscovery.js';
import ProductStageSection from './components/sections/ProductStageSection.js';
import PetroleumBriefPromo from './components/sections/PetroleumBriefPromo.js';

function SectionIntro({ eyebrow, title, description, color = C.purple }) {
  return (
    <Box sx={{ mb: layout.sectionIntroGap, maxWidth: 760 }}>
      <Typography variant="overline" sx={{ color }}>
        {eyebrow}
      </Typography>
      <Typography component="h2" variant="h4" sx={{ mt: 0.25 }}>
        {title}
      </Typography>
      <Typography sx={{ mt: 0.6, color: 'text.secondary', fontSize: 13.5, lineHeight: 1.6 }}>
        {description}
      </Typography>
    </Box>
  );
}

function Dashboard() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Masthead />
      <Container maxWidth="xl" sx={{ py: layout.pageY }}>
        <Stack spacing={layout.sectionGap}>
          <Box component="section" id="trends" data-section>
            <TradeTrendChart />
          </Box>

          <Stack component="section" aria-label="Featured data briefs" spacing={layout.contentGap}>
            <PetroleumBriefPromo />
          </Stack>

          <Box component="section" id="basket-mix" data-section>
            <SectionIntro
              eyebrow="Commodity mix"
              title="What India trades"
              description="See the latest export and import baskets, then follow how their industry mix has changed over time."
              color={C.blue}
            />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: layout.contentGap,
                mb: layout.contentGap,
              }}
            >
              <CompositionDonut sideLabel="Exports" tone="primary" comp={exportComp} />
              <CompositionDonut sideLabel="Imports" tone="warning" comp={importComp} />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: layout.contentGap }}>
              <CompositionChart
                title="Historical exports by industry"
                sideLabel="Exports"
                tone="primary"
                comp={exportComp}
              />
              <CompositionChart
                title="Historical imports by industry"
                sideLabel="Imports"
                tone="warning"
                comp={importComp}
              />
            </Box>
          </Box>

          <Box component="section" id="partners" data-section>
            <SectionIntro
              eyebrow="Trading partners"
              title="Who India trades with"
              description="Compare the largest bilateral relationships, their balances, and how partner shares have shifted."
              color={C.teal}
            />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                gap: layout.contentGap,
                mb: layout.contentGap,
              }}
            >
              <PartnerButterfly />
              <PartnerTrendCard />
            </Box>
            <PartnerShareCard />
          </Box>

          <Box component="section" id="item-trends" data-section>
            <SectionIntro
              eyebrow="Product shifts"
              title="Where trade is moving"
              description="Find the HS-4 product lines driving the largest gains and declines in India’s trade basket."
              color={C.orange}
            />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: layout.contentGap,
              }}
            >
              <MoversCard sideLabel="Exports" tone="primary" movers={exportMovers} />
              <MoversCard sideLabel="Imports" tone="warning" movers={importMovers} />
            </Box>
          </Box>

          <Box component="section" id="product-discovery" data-section>
            <ProductStageSection />
          </Box>

          <Box component="section" id="buildability-atlas" data-section>
            <ProductDiscovery preview />
          </Box>

          <Box component="section" id="value-chains" data-section>
            <ValueChainSection />
          </Box>
        </Stack>
      </Container>
      <Footer />
    </Box>
  );
}

export default Dashboard;
