import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { C, mono } from '../../theme.js';
import { moneySignB, fyTick } from '../../lib/format.js';
import { PARTNERS, COUNTRY_YEARS } from '../../lib/transforms.js';
import cardSx from '../primitives/cardSx.js';

export default function PartnerTrendCard() {
  const years = COUNTRY_YEARS.slice(-5);
  const firstYearIndex = COUNTRY_YEARS.length - years.length;
  const top = PARTNERS.slice(0, 12).map((partner) => ({
    ...partner,
    balances: years.map((_, offset) => {
      const index = firstYearIndex + offset;
      return partner.exp[index] - partner.imp[index];
    }),
  }));

  return (
    <Paper sx={{ ...cardSx }}>
      <Stack spacing={1.25}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="h6">Five-year partner balances</Typography>
          <Chip
            size="small"
            label="Deficit / surplus · US$ bn"
            sx={{ bgcolor: alpha(C.purple, 0.1), color: C.purple, fontWeight: 800 }}
          />
        </Box>

        <Box sx={{ overflowX: 'auto', pb: 0.5 }}>
          <Box sx={{ minWidth: 510 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '112px repeat(5, 1fr)',
                gap: 0.75,
                mb: 0.5,
              }}
            >
              <Box />
              {years.map((year, index) => (
                <Typography
                  key={year}
                  sx={{
                    ...mono,
                    textAlign: 'right',
                    fontSize: 10,
                    fontWeight: index === years.length - 1 ? 800 : 600,
                    color: index === years.length - 1 ? C.purple : 'text.secondary',
                  }}
                >
                  {`FY${fyTick(year)}`}
                </Typography>
              ))}
            </Box>
            {top.map((partner) => (
              <Box
                key={partner.key}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '112px repeat(5, 1fr)',
                  gap: 0.75,
                  alignItems: 'center',
                  minHeight: 31,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography
                  sx={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {partner.name}
                </Typography>
                {partner.balances.map((balance, index) => (
                  <Box
                    key={years[index]}
                    sx={{
                      py: 0.45,
                      px: 0.35,
                      borderRadius: 1,
                      textAlign: 'right',
                      bgcolor: alpha(
                        balance >= 0 ? C.teal : C.red,
                        index === years.length - 1 ? 0.13 : 0.055,
                      ),
                    }}
                  >
                    <Typography
                      sx={{
                        ...mono,
                        fontSize: 10.5,
                        fontWeight: index === years.length - 1 ? 800 : 600,
                        color: balance >= 0 ? C.teal : C.red,
                      }}
                    >
                      {moneySignB(balance)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Each cell is exports minus imports for that partner. Red values are trade deficits; green
          values are surpluses. The latest fiscal year is emphasized.
        </Typography>
      </Stack>
    </Paper>
  );
}
