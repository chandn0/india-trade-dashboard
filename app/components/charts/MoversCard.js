'use client';

import * as React from 'react';
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { toneColor } from '../../theme.js';
import cardSx from '../primitives/cardSx.js';
import MoversGroup from './MoversGroup.js';

export default function MoversCard({ sideLabel, tone, movers }) {
  const accent = toneColor(tone);
  const [expanded, setExpanded] = React.useState(false);
  const visibleCount = expanded ? 10 : 6;
  return (
    <Paper sx={cardSx}>
      <Stack spacing={1.5}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}
        >
          <Typography variant="h6">{`${sideLabel}: biggest movers`}</Typography>
          <Chip
            size="small"
            label="FY21–22 → FY25–26"
            sx={{ bgcolor: alpha(accent, 0.1), color: accent, fontWeight: 800 }}
          />
        </Box>
        <MoversGroup
          title="Fastest growing"
          items={movers.gainers.slice(0, visibleCount)}
          positive
        />
        <MoversGroup
          title="Biggest decline"
          items={movers.decliners.slice(0, visibleCount)}
          positive={false}
        />
        <Button
          size="small"
          variant="text"
          onClick={() => setExpanded((value) => !value)}
          sx={{ alignSelf: 'flex-start', px: 0.5, color: accent, fontWeight: 800 }}
        >
          {expanded ? 'Show fewer product lines' : 'Show 10 product lines in each group'}
        </Button>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {`Ranked by change in annual ${sideLabel.toLowerCase()} value (US$) from FY2021-22 to FY2025-26, across HS-4 product lines. Each row also shows the item's FY2025-26 position in the latest basket. Hover or tap a sparkline for the year-by-year path.`}
        </Typography>
      </Stack>
    </Paper>
  );
}
