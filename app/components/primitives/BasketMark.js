import { Box } from '@mui/material';
import { basketIconFor } from '../../config/icons.js';

export default function BasketMark({ name, color, rest = false, size = 14 }) {
  const Icon = basketIconFor(name, rest);
  if (!Icon) {
    return <Box sx={{ width: 9, height: 9, borderRadius: 0.5, bgcolor: color, flexShrink: 0 }} />;
  }
  return <Icon sx={{ fontSize: size, color, flexShrink: 0, display: 'block' }} />;
}
