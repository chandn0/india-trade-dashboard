'use client';

import * as React from 'react';
import { Box, Chip, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { C, mono } from '../../theme.js';
import { moneyB, moneySignB, fyTick } from '../../lib/format.js';
import {
  PARTNERS,
  COUNTRY_LAST,
  COUNTRY_TOTALS,
  COUNTRY_YEARS,
  PARTNER_PRODUCTS,
  PARTNER_PRODUCTS_FY,
} from '../../lib/transforms.js';
import { hs2Label } from '../../config/icons.js';
import PartnerProductIcons from '../primitives/PartnerProductIcons.js';
import cardSx from '../primitives/cardSx.js';

export default function PartnerButterfly() {
  const top = PARTNERS.slice(0, 12);
  const maxVal = Math.max(...top.map((p) => Math.max(p.exp[COUNTRY_LAST], p.imp[COUNTRY_LAST])));
  const grandTotal = COUNTRY_TOTALS.exp[COUNTRY_LAST] + COUNTRY_TOTALS.imp[COUNTRY_LAST];
  const topShare = (top.reduce((sum, p) => sum + p.total[COUNTRY_LAST], 0) / grandTotal) * 100;

  return (
    <Paper sx={{ ...cardSx, minWidth: 0 }}>
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
          <Typography variant="h6">Top trading partners</Typography>
          <Chip
            size="small"
            label={`Top 12 = ${topShare.toFixed(1)}% of FY${fyTick(COUNTRY_YEARS[COUNTRY_LAST])} trade`}
            sx={{
              bgcolor: alpha(C.teal, 0.1),
              color: C.teal,
              fontWeight: 800,
              maxWidth: '100%',
              '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: { xs: 78, sm: 104 }, flexShrink: 0 }} />
          <Box sx={{ flex: 1, display: 'flex', minWidth: 0 }}>
            <Typography
              sx={{
                flex: 1,
                textAlign: 'right',
                pr: 1,
                fontSize: 11,
                fontWeight: 800,
                color: C.orange,
              }}
            >
              Imports
            </Typography>
            <Typography sx={{ flex: 1, pl: 1, fontSize: 11, fontWeight: 800, color: C.blue }}>
              Exports
            </Typography>
          </Box>
          <Typography
            sx={{
              width: { xs: 70, sm: 84 },
              flexShrink: 0,
              textAlign: 'right',
              fontSize: 11,
              fontWeight: 800,
              color: 'text.secondary',
            }}
          >
            Balance
          </Typography>
        </Box>

        {top.map((p) => {
          const exp = p.exp[COUNTRY_LAST];
          const imp = p.imp[COUNTRY_LAST];
          const bal = exp - imp;
          const products = PARTNER_PRODUCTS.get(p.key);
          const topExp = products?.exports?.top_chapters?.slice(0, 3) ?? [];
          const topImp = products?.imports?.top_chapters?.slice(0, 3) ?? [];
          const tip = (
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.25 }}>{p.name}</Typography>
              <Typography sx={{ fontSize: 11.5 }}>
                {`Exports ${moneyB(exp)}`}
                {topExp.length ? ` — ${topExp.map(hs2Label).join(' · ')}` : ''}
              </Typography>
              <Typography sx={{ fontSize: 11.5 }}>
                {`Imports ${moneyB(imp)}`}
                {topImp.length ? ` — ${topImp.map(hs2Label).join(' · ')}` : ''}
              </Typography>
            </Box>
          );
          return (
            <Tooltip
              key={p.key}
              title={tip}
              arrow
              placement="top"
              enterTouchDelay={0}
              leaveTouchDelay={2500}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  py: 0.4,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  cursor: 'default',
                }}
              >
                <Typography
                  sx={{
                    width: { xs: 78, sm: 104 },
                    flexShrink: 0,
                    fontSize: 12.5,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {p.name}
                </Typography>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                      <Box
                        sx={{
                          height: 13,
                          width: `${(imp / maxVal) * 100}%`,
                          minWidth: imp > 0 ? '2px' : 0,
                          bgcolor: alpha(C.orange, 0.85),
                          borderRadius: '4px 0 0 4px',
                        }}
                      />
                    </Box>
                    <Box sx={{ width: '1px', alignSelf: 'stretch', bgcolor: '#c4cedd' }} />
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          height: 13,
                          width: `${(exp / maxVal) * 100}%`,
                          minWidth: exp > 0 ? '2px' : 0,
                          bgcolor: alpha(C.blue, 0.85),
                          borderRadius: '0 4px 4px 0',
                        }}
                      />
                    </Box>
                  </Box>
                  {topExp.length || topImp.length ? (
                    <Box sx={{ display: 'flex', mt: 0.25 }}>
                      <Box sx={{ flex: 1, pr: 0.75 }}>
                        <PartnerProductIcons chapters={topImp} color={C.orange} align="right" />
                      </Box>
                      <Box sx={{ width: '1px' }} />
                      <Box sx={{ flex: 1, pl: 0.75 }}>
                        <PartnerProductIcons chapters={topExp} color={C.blue} align="left" />
                      </Box>
                    </Box>
                  ) : null}
                </Box>
                <Typography
                  sx={{
                    ...mono,
                    width: { xs: 70, sm: 84 },
                    flexShrink: 0,
                    textAlign: 'right',
                    fontSize: 11.5,
                    fontWeight: 800,
                    color: bal >= 0 ? C.teal : C.red,
                  }}
                >
                  {moneySignB(bal)}
                </Typography>
              </Box>
            </Tooltip>
          );
        })}

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {`Top 12 partners by total trade in FY${fyTick(COUNTRY_YEARS[COUNTRY_LAST])}. Bars share one scale; the balance column is exports minus imports. The small icons are each partner's top three traded product chapters (FY${PARTNER_PRODUCTS_FY ? fyTick(PARTNER_PRODUCTS_FY) : ''}, EIDB) — hover or tap a row to name them.`}
        </Typography>
      </Stack>
    </Paper>
  );
}
