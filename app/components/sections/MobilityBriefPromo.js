import Link from 'next/link';
import { ArrowForward, DirectionsBike } from '@mui/icons-material';
import { Box, Button, Paper, Typography } from '@mui/material';
import { C } from '../../theme.js';
import cardSx from '../primitives/cardSx.js';

export default function MobilityBriefPromo() {
  return (
    <Paper component="aside" sx={{ ...cardSx, p: { xs: 2.25, md: 3 }, bgcolor: '#e9e4d9' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            flexShrink: 0,
            borderRadius: 1.25,
            display: 'grid',
            placeItems: 'center',
            bgcolor: C.ink,
            color: '#fff',
          }}
        >
          <DirectionsBike fontSize="small" />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="overline" sx={{ color: C.orange }}>
            New consumer brands index
          </Typography>
          <Typography variant="h5" sx={{ mt: 0.2 }}>
            India’s brands: phones, bikes and cars
          </Typography>
          <Typography
            sx={{ mt: 0.5, maxWidth: 720, color: 'text.secondary', fontSize: 13, lineHeight: 1.6 }}
          >
            The names people buy most, with a clear line between market share and local value
            addition.
          </Typography>
        </Box>
        <Button
          component={Link}
          href="/brands"
          variant="contained"
          endIcon={<ArrowForward />}
          sx={{ flexShrink: 0, bgcolor: C.ink, '&:hover': { bgcolor: C.inkSoft } }}
        >
          Explore brands
        </Button>
      </Box>
    </Paper>
  );
}
