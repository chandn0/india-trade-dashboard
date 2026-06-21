import { Box, Typography } from '@mui/material';
import { C, mono } from '../../theme.js';

export default function ChainStat({ label, value, sub, color = C.ink }) {
  return (
    <Box sx={{ flex: '1 1 140px', minWidth: 130 }}>
      <Typography
        variant="overline"
        sx={{ color: 'text.secondary', letterSpacing: '0.08em', display: 'block', lineHeight: 1.9 }}
      >
        {label}
      </Typography>
      <Typography sx={{ ...mono, fontSize: 19, fontWeight: 800, color, lineHeight: 1.15 }}>
        {value}
      </Typography>
      <Typography sx={{ ...mono, fontSize: 10.5, color: 'text.secondary' }}>{sub}</Typography>
    </Box>
  );
}
