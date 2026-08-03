import Link from 'next/link';
import { ArrowForward, LocalGasStation } from '@mui/icons-material';
import { Box, Button, Paper, Typography } from '@mui/material';
import { C, layout } from '../../theme.js';
import cardSx from '../primitives/cardSx.js';

export default function PetroleumBriefPromo() {
  return (
    <Paper component="aside" sx={{ ...cardSx, p: layout.cardPadding, bgcolor: '#e9e4d9' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: layout.cardPadding,
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
          <LocalGasStation fontSize="small" />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="overline" sx={{ color: C.orange }}>
            New data brief
          </Typography>
          <Typography variant="h5" sx={{ mt: 0.2 }}>
            India’s petroleum import bill, explained
          </Typography>
          <Typography
            sx={{ mt: 0.5, maxWidth: 720, color: 'text.secondary', fontSize: 13, lineHeight: 1.6 }}
          >
            See where crude comes from, how supplier shares changed, what refineries produce, and
            which vehicles use petrol.
          </Typography>
        </Box>
        <Button
          component={Link}
          href="/petroleum"
          variant="contained"
          endIcon={<ArrowForward />}
          sx={{ flexShrink: 0, bgcolor: C.ink, '&:hover': { bgcolor: C.inkSoft } }}
        >
          Read the brief
        </Button>
      </Box>
    </Paper>
  );
}
