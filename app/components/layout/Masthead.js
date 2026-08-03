import { Box, Container, Typography } from '@mui/material';
import { C } from '../../theme.js';

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
        <Box sx={{ mr: 'auto', minWidth: 0, flexShrink: 0 }}>
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
        </Box>
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1.5,
            flexShrink: 0,
          }}
        >
          <Typography
            component="a"
            href="https://github.com/chandn0/india-trade-dashboard"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository (opens in new tab)"
            sx={{
              fontSize: 12,
              fontWeight: 700,
              color: 'rgba(231,236,245,0.85)',
              textDecoration: 'none',
              '&:hover': { color: '#fff', textDecoration: 'underline' },
              '&:focus-visible': { outline: '2px solid #93c5fd', outlineOffset: 3 },
            }}
          >
            GitHub ↗
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
