import { Box, Typography } from '@mui/material';
import TrendingUpRounded from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRounded from '@mui/icons-material/TrendingDownRounded';
import { C } from '../../theme.js';
import MoverRow from './MoverRow.js';

export default function MoversGroup({ title, items, positive, years, rankFy }) {
  const color = positive ? C.teal : C.red;
  const Icon = positive ? TrendingUpRounded : TrendingDownRounded;
  return (
    // minWidth 0 lets this shrink below its content as a grid/flex item, so long raw HS-4
    // descriptions ellipsize inside MoverRow instead of blowing the column out past the card.
    <Box sx={{ minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.25 }}>
        <Icon sx={{ fontSize: 16, color }} />
        <Typography variant="overline" sx={{ color, letterSpacing: '0.08em' }}>
          {title}
        </Typography>
      </Box>
      {items.map((it) => (
        <MoverRow key={it.code} item={it} color={color} years={years} rankFy={rankFy} />
      ))}
    </Box>
  );
}
