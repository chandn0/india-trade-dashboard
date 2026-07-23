import { Box, Chip, Container, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { C } from '../../theme.js';
import { latestFyLabel, latestStatusNote } from '../../lib/transforms.js';

const NAV_SECTIONS = [
  ['Rupee & deficit', '/#rupee-deficit'],
  ['Trade trends', '/#trends'],
  ['Industry mix', '/#basket-mix'],
  ['Partners', '/#partners'],
  ['Biggest movers', '/#item-trends'],
  ['Explorer', '/#explorer'],
  ['Product stages', '/products'],
  ['Buildability atlas', '/#buildability-atlas'],
  ['Value chains', '/#value-chains'],
];

export default function Masthead() {
  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        bgcolor: C.ink,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Container
        maxWidth="xl"
        sx={{ py: 1.25, display: 'flex', alignItems: 'center', gap: { xs: 1.25, md: 2 } }}
      >
        <Box sx={{ mr: 'auto', minWidth: 0 }}>
          <Typography
            variant="h6"
            component="h1"
            sx={{
              color: '#fff',
              lineHeight: 1.15,
              fontSize: { xs: 17, md: 20 },
              whiteSpace: 'nowrap',
            }}
          >
            India Trade Monitor
          </Typography>
          <Typography
            sx={{
              color: 'rgba(231,236,245,0.6)',
              fontSize: 11.5,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Exports, imports and the trade balance, from official Government of India data
          </Typography>
        </Box>
        <Box
          component="nav"
          sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5, mr: 1, flexShrink: 0 }}
        >
          {NAV_SECTIONS.map(([label, href]) => (
            <Typography
              key={href}
              component="a"
              href={href}
              sx={{
                fontSize: 12.5,
                fontWeight: 600,
                color: 'rgba(231,236,245,0.72)',
                '&:hover': { color: '#fff' },
              }}
            >
              {label}
            </Typography>
          ))}
        </Box>
        <Chip
          size="small"
          label={`Data through ${latestFyLabel}${latestStatusNote ? ` · ${latestStatusNote}` : ''}`}
          sx={{ bgcolor: alpha(C.purple, 0.32), color: '#d9cbff', fontWeight: 700, flexShrink: 0 }}
        />
      </Container>
    </Box>
  );
}
