import { Box, Chip, Container, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { C } from '../../theme.js';
import { latestFyLabel, latestStatusNote } from '../../lib/transforms.js';

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
          <Typography
            component="a"
            href="https://github.com/chandn0/india-trade-dashboard/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contribute to India Trade Dashboard on GitHub (opens in new tab)"
            sx={{
              fontSize: 12,
              fontWeight: 700,
              color: '#5eead4',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
              '&:focus-visible': { outline: '2px solid #5eead4', outlineOffset: 3 },
            }}
          >
            Contribute ↗
          </Typography>
        </Box>
        <Chip
          size="small"
          label={
            <>
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                {latestFyLabel}
              </Box>
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                {`Data through ${latestFyLabel}${latestStatusNote ? ` · ${latestStatusNote}` : ''}`}
              </Box>
            </>
          }
          sx={{
            display: 'flex',
            bgcolor: alpha(C.purple, 0.32),
            color: '#d9cbff',
            fontWeight: 700,
            flexShrink: 0,
          }}
        />
      </Container>
    </Box>
  );
}
