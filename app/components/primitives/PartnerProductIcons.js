import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { hs2Icon, hs2Label } from '../../config/icons.js';

export default function PartnerProductIcons({ chapters, color, align }) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 0.5,
        justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
        minHeight: 14,
      }}
    >
      {chapters.map((ch) => {
        const Icon = hs2Icon(ch.hs2);
        return (
          <Icon
            key={ch.hs2}
            sx={{ fontSize: 13, color: alpha(color, 0.9) }}
            titleAccess={hs2Label(ch)}
          />
        );
      })}
    </Box>
  );
}
