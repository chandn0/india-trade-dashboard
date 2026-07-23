'use client';

import { Box, Container, Stack } from '@mui/material';

import { exportComp, importComp, exportMovers, importMovers } from './lib/transforms.js';

import Masthead from './components/layout/Masthead.js';
import Footer from './components/layout/Footer.js';

import TradeTrendChart from './components/charts/TradeTrendChart.js';
import RupeeDeficitChart from './components/charts/RupeeDeficitChart.js';
import CompositionDonut from './components/charts/CompositionDonut.js';
import CompositionChart from './components/charts/CompositionChart.js';
import PartnerButterfly from './components/charts/PartnerButterfly.js';
import PartnerTrendCard from './components/charts/PartnerTrendCard.js';
import PartnerShareCard from './components/charts/PartnerShareCard.js';
import MoversCard from './components/charts/MoversCard.js';

import MoverExplorer from './components/sections/MoverExplorer.js';
import ValueChainSection from './components/sections/ValueChainSection.js';
import ProductDiscovery from './components/sections/ProductDiscovery.js';
import ProductStageSection from './components/sections/ProductStageSection.js';

function Dashboard() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Masthead />
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
        <Stack spacing={{ xs: 4, md: 5 }}>
          <Box component="section" id="rupee-deficit" data-section>
            <RupeeDeficitChart />
          </Box>

          <Box component="section" id="trends" data-section>
            <TradeTrendChart />
          </Box>

          <Box component="section" id="basket-mix" data-section>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2,
                mb: 2,
              }}
            >
              <CompositionDonut sideLabel="Exports" tone="primary" comp={exportComp} />
              <CompositionDonut sideLabel="Imports" tone="warning" comp={importComp} />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
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
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                gap: 2,
                mb: 2,
              }}
            >
              <PartnerButterfly />
              <PartnerTrendCard />
            </Box>
            <PartnerShareCard />
          </Box>

          <Box component="section" id="item-trends" data-section>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2,
              }}
            >
              <MoversCard sideLabel="Exports" tone="primary" movers={exportMovers} />
              <MoversCard sideLabel="Imports" tone="warning" movers={importMovers} />
            </Box>
          </Box>

          <Box component="section" id="explorer" data-section>
            <MoverExplorer />
          </Box>

          <Box component="section" id="product-discovery" data-section>
            <ProductStageSection />
          </Box>

          <Box component="section" id="buildability-atlas" data-section>
            <ProductDiscovery />
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
