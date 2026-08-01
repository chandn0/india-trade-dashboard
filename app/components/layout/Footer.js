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
    <Box
      component="footer"
      sx={{ borderTop: '1px solid', borderColor: 'divider', py: 3.5, bgcolor: '#eeece5' }}
    >
      <Container maxWidth="xl">
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Box
            sx={{
              p: { xs: 2, md: 2.25 },
              borderRadius: 2.5,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: { xs: 1.5, md: 2.5 },
            }}
          >
            <Box sx={{ minWidth: 0, maxWidth: 720 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                Open-source trade analytics &amp; value-chain initiative
              </Typography>
              <Typography sx={{ mt: 0.3, fontSize: 12, color: 'text.secondary', lineHeight: 1.5 }}>
                Contributions welcome for data pipelines, HS-4 value chain links, UI enhancements,
                and research validation.
              </Typography>
            </Box>
            <Stack
              direction="row"
              spacing={1.5}
              useFlexGap
              sx={{
                flexWrap: 'wrap',
                flexShrink: 0,
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
              }}
            >
              <Box
                component="a"
                href="https://github.com/chandn0/india-trade-dashboard"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository (opens in new tab)"
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#0f172a',
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px',
                  '&:hover': { color: 'text.secondary' },
                }}
              >
                GitHub Repository ↗
              </Box>
              <Box
                component="a"
                href="https://github.com/chandn0/india-trade-dashboard/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contribution Guide (opens in new tab)"
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#0f172a',
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px',
                  '&:hover': { color: 'text.secondary' },
                }}
              >
                Contribute ↗
              </Box>
              <Box
                component="a"
                href="https://github.com/chandn0/india-trade-dashboard/issues"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Report Issues on GitHub (opens in new tab)"
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#0f172a',
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px',
                  '&:hover': { color: 'text.secondary' },
                }}
              >
                Report Issues ↗
              </Box>
            </Stack>
          </Box>

          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.6, maxWidth: 1180 }}
          >
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
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.6, maxWidth: 1180 }}
          >
            Values in current US$; fiscal years run April–March.
            {latestIsYtd
              ? ` ${latestFyLabel} is year-to-date.`
              : latestIsProvisional
                ? ` ${latestFyLabel} is provisional.`
                : ''}{' '}
            Independent open-source dashboard; not affiliated with the Government of India.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
