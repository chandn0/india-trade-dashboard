import { Box } from '@mui/material';
import { basketIconFor } from '../../config/icons.js';

import * as React from 'react';

export default function BasketMark({ name, color, rest = false, size = 14 }) {
  const iconType = basketIconFor(name, rest);
  if (!iconType) {
    return <Box sx={{ width: 9, height: 9, borderRadius: 0.5, bgcolor: color, flexShrink: 0 }} />;
  }
  return React.createElement(iconType, {
    sx: { fontSize: size, color, flexShrink: 0, display: 'block' },
  });
}
