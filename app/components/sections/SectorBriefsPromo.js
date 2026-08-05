import Link from 'next/link';
import {
  ArrowForward,
  Diamond,
  LocalGasStation,
  Memory,
  Science,
  Settings,
} from '@mui/icons-material';
import { Box, Paper, Typography } from '@mui/material';
import { C } from '../../theme.js';
import cardSx from '../primitives/cardSx.js';

const briefs = [
  {
    href: '/petroleum',
    title: 'Crude oil and energy',
    icon: LocalGasStation,
    color: C.ink,
  },
  {
    href: '/electronics',
    title: 'Electronics',
    icon: Memory,
    color: C.blueDeep,
  },
  {
    href: '/gems-jewellery',
    title: 'Gems, gold and jewellery',
    icon: Diamond,
    color: '#7a4b2d',
  },
  {
    href: '/chemicals',
    title: 'Chemicals and pharma',
    icon: Science,
    color: C.teal,
  },
  {
    href: '/machinery',
    title: 'Machinery and equipment',
    icon: Settings,
    color: C.purple,
  },
];

export default function SectorBriefsPromo() {
  return (
    <Box>
      <Typography variant="overline" sx={{ color: C.orange }}>
        Sector data briefs
      </Typography>
      <Typography component="h2" variant="h5" sx={{ mt: 0.2, mb: 1.4 }}>
        High-value import systems, unpacked
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(5, 1fr)',
          },
          gap: 1.25,
        }}
      >
        {briefs.map(({ href, title, icon: Icon, color }) => (
          <Paper
            key={href}
            component={Link}
            href={href}
            aria-label={`Open ${title} brief`}
            sx={{
              ...cardSx,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1.1,
              minHeight: 72,
              color: 'text.primary',
              textDecoration: 'none',
              transition: 'border-color 150ms ease, transform 150ms ease',
              '&:hover': {
                borderColor: color,
                transform: 'translateY(-1px)',
              },
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 1,
                bgcolor: color,
                color: '#fff',
                flexShrink: 0,
              }}
            >
              <Icon fontSize="small" />
            </Box>
            <Typography component="h3" variant="subtitle2" sx={{ lineHeight: 1.25 }}>
              {title}
            </Typography>
            <ArrowForward sx={{ ml: 'auto', color, fontSize: 18, flexShrink: 0 }} />
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
