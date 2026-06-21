import { Box } from '@mui/material';

export default function Sparkline({ series, color, w = 72, h = 26 }) {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const padY = 3;
  const n = series.length;
  const x = (i) => (n <= 1 ? w / 2 : (i / (n - 1)) * w);
  const y = (v) => padY + (h - 2 * padY) * (1 - (v - min) / span);
  const d = series
    .map((v, i) => `${i ? 'L' : 'M'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`)
    .join(' ');
  return (
    <Box
      component="svg"
      viewBox={`0 0 ${w} ${h}`}
      sx={{ width: w, height: h, flexShrink: 0, display: 'block', overflow: 'visible' }}
      aria-hidden
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={x(n - 1)} cy={y(series[n - 1])} r="2.4" fill={color} />
    </Box>
  );
}
