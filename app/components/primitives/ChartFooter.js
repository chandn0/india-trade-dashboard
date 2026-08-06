import { Box, Typography } from '@mui/material';
import { SITE_DOMAIN, SITE_ORIGIN } from '../../lib/siteBrand.js';

export default function ChartFooter({ children }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'flex-end' },
        justifyContent: 'space-between',
        gap: 0.75,
      }}
    >
      <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.55 }}>
        {children}
      </Typography>
      <Typography
        component="a"
        href={SITE_ORIGIN}
        aria-label={`Visit ${SITE_DOMAIN}`}
        sx={{
          color: 'text.secondary',
          fontSize: 10.5,
          fontWeight: 800,
          lineHeight: 1.4,
          letterSpacing: '0.04em',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          '&:hover': { color: 'text.primary', textDecoration: 'underline' },
          '&:focus-visible': { outline: '2px solid #46698f', outlineOffset: 2 },
        }}
      >
        {SITE_DOMAIN}
      </Typography>
    </Box>
  );
}
