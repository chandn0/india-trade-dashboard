import { Box, Container, Stack, Typography } from '@mui/material';
import { latestFyLabel, latestIsYtd, latestIsProvisional } from '../../lib/transforms.js';

export default function Footer() {
  const linkSx = {
    color: 'text.primary',
    textDecoration: 'underline',
    textDecorationColor: 'rgba(0,0,0,0.25)',
    '&:hover': { textDecorationColor: 'currentColor' },
  };
  return (
    <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', py: 3 }}>
      <Container maxWidth="xl">
        <Stack spacing={1.25} sx={{ maxWidth: 880 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            Sources: Ministry of Commerce &amp; Industry,{' '}
            <Box
              component="a"
              href="https://tradestat.commerce.gov.in/ftspcc/ttrade_country_wise"
              target="_blank"
              rel="noopener noreferrer"
              sx={linkSx}
            >
              Foreign Trade Statistics (FTSPCC monthly releases)
            </Box>{' '}
            for trade values;{' '}
            <Box
              component="a"
              href="https://trade-analytics.commerce.gov.in/public"
              target="_blank"
              rel="noopener noreferrer"
              sx={linkSx}
            >
              TIA public extraction endpoint
            </Box>{' '}
            for HS4 item-level trends;{' '}
            <Box
              component="a"
              href="https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=Handbook+of+Statistics+on+Indian+Economy"
              target="_blank"
              rel="noopener noreferrer"
              sx={linkSx}
            >
              RBI Handbook of Statistics, Table 139
            </Box>{' '}
            for annual-average INR/USD.
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            Values in current US$; fiscal years run April–March.
            {latestIsYtd
              ? ` ${latestFyLabel} is year-to-date.`
              : latestIsProvisional
                ? ` ${latestFyLabel} is provisional.`
                : ''}{' '}
            Independent dashboard; not affiliated with the Government of India.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
