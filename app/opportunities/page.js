import { Box, Container } from '@mui/material';
import ProductDiscovery from '../components/sections/ProductDiscovery.js';
import Masthead from '../components/layout/Masthead.js';
import Footer from '../components/layout/Footer.js';

export const metadata = {
  title: 'Buildability Opportunities | India Trade Monitor',
  description:
    "Explore India's major import lines by net deficit, buildability, and realistic impact range.",
};

export default function OpportunitiesPage() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Masthead pageTitle="Buildability Atlas" backHref="/" />
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        <ProductDiscovery />
      </Container>
      <Footer />
    </Box>
  );
}
