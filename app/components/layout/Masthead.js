'use client';

import Link from 'next/link';
import { Box, Chip, Container, Typography } from '@mui/material';
import { ArrowBackRounded, LaunchRounded } from '@mui/icons-material';
import { C } from '../../theme.js';
import { latestFyLabel } from '../../lib/transforms.js';

export default function Masthead({
  pageTitle,
  backHref,
  backLabel,
  fyLabel = latestFyLabel,
  showFyBadge = true,
}) {
  const displayTitle = pageTitle || backLabel;

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        bgcolor: C.ink,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #1f293d',
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, md: 1.5 },
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.25 }, minWidth: 0 }}>
          <Typography
            component={Link}
            href="/"
            sx={{
              color: '#fff',
              fontSize: { xs: 16, sm: 18, md: 19 },
              fontWeight: 800,
              lineHeight: 1,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              letterSpacing: '-0.015em',
              flexShrink: 0,
              '&:hover': { opacity: 0.9 },
              '&:focus-visible': { outline: '2px solid #93c5fd', outlineOffset: 3 },
            }}
          >
            India Trade Monitor
          </Typography>

          {displayTitle && (
            <>
              <Typography
                component="span"
                sx={{
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: 14,
                  userSelect: 'none',
                }}
              >
                /
              </Typography>

              <Typography
                component={backHref ? Link : 'span'}
                href={backHref || undefined}
                noWrap
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: { xs: 13, sm: 14 },
                  fontWeight: 700,
                  color: 'rgba(231,236,245,0.9)',
                  textDecoration: 'none',
                  minWidth: 0,
                  '&:hover': backHref ? { color: '#fff', textDecoration: 'underline' } : undefined,
                  '&:focus-visible': backHref
                    ? { outline: '2px solid #93c5fd', outlineOffset: 3 }
                    : undefined,
                }}
              >
                {backHref && <ArrowBackRounded sx={{ fontSize: 14, flexShrink: 0 }} />}
                <Box
                  component="span"
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {displayTitle}
                </Box>
              </Typography>
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, flexShrink: 0 }}>
          {showFyBadge && fyLabel && (
            <Chip
              size="small"
              label={fyLabel}
              sx={{
                height: 24,
                fontSize: 11,
                fontWeight: 700,
                color: '#93c5fd',
                bgcolor: 'rgba(59,130,246,0.12)',
                border: '1px solid rgba(147,197,253,0.25)',
                display: { xs: 'none', sm: 'inline-flex' },
              }}
            />
          )}

          <Typography
            component="a"
            href="https://github.com/chandn0/india-trade-dashboard"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository (opens in new tab)"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              fontSize: 12,
              fontWeight: 700,
              color: 'rgba(231,236,245,0.85)',
              textDecoration: 'none',
              '&:hover': { color: '#fff', textDecoration: 'underline' },
              '&:focus-visible': { outline: '2px solid #93c5fd', outlineOffset: 3 },
            }}
          >
            GitHub
            <LaunchRounded sx={{ fontSize: 13 }} />
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
