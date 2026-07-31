'use client';

import { Chip, Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';

export default function ToggleChips({ options, value, onChange, colorFor }) {
  return (
    <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
      {options.map(([key, label]) => {
        const on = value === key;
        const c = colorFor(key);
        return (
          <Chip
            key={key}
            size="small"
            label={label}
            onClick={() => onChange(key)}
            sx={{
              minHeight: 32,
              cursor: 'pointer',
              fontWeight: 700,
              bgcolor: on ? alpha(c, 0.12) : 'transparent',
              color: on ? c : 'text.secondary',
              border: '1px solid',
              borderColor: on ? alpha(c, 0.3) : 'divider',
            }}
          />
        );
      })}
    </Stack>
  );
}
