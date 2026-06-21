import { Box, Typography } from '@mui/material';
import { mono } from '../../theme.js';

export default function TipRow({ color, label, value, sub }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, py: 0.15 }}>
      <Box sx={{ width: 8, height: 8, borderRadius: 999, bgcolor: color, flexShrink: 0 }} />
      <Typography sx={{ fontSize: 11.5, color: 'rgba(231,236,245,0.8)', flex: 1 }}>
        {label}
      </Typography>
      <Typography sx={{ ...mono, fontSize: 12, fontWeight: 700, color: '#fff' }}>
        {value}
      </Typography>
      {sub ? (
        <Typography
          sx={{
            ...mono,
            fontSize: 10.5,
            color: 'rgba(231,236,245,0.6)',
            minWidth: 44,
            textAlign: 'right',
          }}
        >
          {sub}
        </Typography>
      ) : null}
    </Box>
  );
}
