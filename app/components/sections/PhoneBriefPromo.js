import Link from 'next/link';
import { ArrowForward, Storefront } from '@mui/icons-material';
import { Box, Button, Paper, Typography } from '@mui/material';
import { C } from '../../theme.js';
import cardSx from '../primitives/cardSx.js';

export default function PhoneBriefPromo() {
  return <Paper component="aside" sx={{ ...cardSx, p: { xs: 2.25, md: 3 }, bgcolor: '#e7ece9' }}>
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 2, sm: 3 } }}>
      <Box sx={{ width: 42, height: 42, flexShrink: 0, borderRadius: 1.25, display: 'grid', placeItems: 'center', bgcolor: C.ink, color: '#fff' }}><Storefront fontSize="small" /></Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="overline" sx={{ color: C.teal }}>Consumer brands hub</Typography>
        <Typography variant="h5" sx={{ mt: .2 }}>India&apos;s phones, bikes and cars — in one place</Typography>
        <Typography sx={{ mt: .5, maxWidth: 720, color: 'text.secondary', fontSize: 13, lineHeight: 1.6 }}>Market share, India manufacturing evidence and value-chain limits — clearly separated, across three categories.</Typography>
      </Box>
      <Button component={Link} href="/brands" variant="contained" endIcon={<ArrowForward />} sx={{ flexShrink: 0, bgcolor: C.ink, '&:hover': { bgcolor: C.inkSoft } }}>Explore brands</Button>
    </Box>
  </Paper>;
}
