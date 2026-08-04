import Link from 'next/link';
import {
  ArrowForward,
  Diamond,
  LocalGasStation,
  Memory,
  Science,
  Settings,
} from '@mui/icons-material';
import { Box, Button, Paper, Typography } from '@mui/material';
import { C } from '../../theme.js';
import cardSx from '../primitives/cardSx.js';

const briefs = [
  {
    href: '/petroleum',
    title: 'Crude oil and energy',
    text: 'Suppliers, refineries, distribution and domestic use.',
    icon: LocalGasStation,
    color: C.ink,
  },
  {
    href: '/electronics',
    title: 'Electronics',
    text: 'Chips, phones, computers and component dependence.',
    icon: Memory,
    color: C.blueDeep,
  },
  {
    href: '/gems-jewellery',
    title: 'Gems, gold and jewellery',
    text: 'Gold demand, diamond processing and jewellery exports.',
    icon: Diamond,
    color: '#7a4b2d',
  },
  {
    href: '/chemicals',
    title: 'Chemicals and pharma',
    text: 'Fertilisers, industrial inputs and medicine exports.',
    icon: Science,
    color: C.teal,
  },
  {
    href: '/machinery',
    title: 'Machinery and equipment',
    text: 'Computers, turbines and industrial production equipment.',
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
        {briefs.map(({ href, title, text, icon: Icon, color }) => (
          <Paper
            key={href}
            component="article"
            sx={{
              ...cardSx,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              minHeight: 190,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 1,
                bgcolor: color,
                color: '#fff',
              }}
            >
              <Icon fontSize="small" />
            </Box>
            <Typography component="h3" variant="h6" sx={{ mt: 1.25 }}>
              {title}
            </Typography>
            <Typography
              sx={{ mt: 0.4, mb: 1.4, color: 'text.secondary', fontSize: 12.5, lineHeight: 1.55 }}
            >
              {text}
            </Typography>
            <Button
              component={Link}
              href={href}
              size="small"
              endIcon={<ArrowForward />}
              sx={{ mt: 'auto', color }}
            >
              Open brief
            </Button>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
