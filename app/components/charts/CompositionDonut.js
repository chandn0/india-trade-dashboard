'use client';

import * as React from 'react';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { C, mono, toneColor } from '../../theme.js';
import { moneyB } from '../../lib/format.js';
import { REST_COLOR } from '../../lib/transforms.js';
import { basketIconFor, iconInk } from '../../config/icons.js';
import BasketMark from '../primitives/BasketMark.js';
import cardSx from '../primitives/cardSx.js';

export default function CompositionDonut({ sideLabel, tone, comp }) {
  const accent = toneColor(tone);
  const [hover, setHover] = React.useState(null);

  const rest = comp.latestYear.rest;
  const slices = [
    ...comp.latestYear.segs.map((s) => ({
      key: s.key,
      name: s.name,
      share: s.share,
      value: s.value,
      color: s.color,
    })),
    {
      key: 'rest',
      name: 'Rest of basket',
      share: rest.share,
      value: rest.value,
      color: REST_COLOR,
    },
  ];
  const total = comp.latestYear.total;
  const year = comp.latestYear.year;
  const yearLabel = year.length > 7 ? `${year.slice(2, 4)}–${year.slice(-2)}` : year;

  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = 122;
  const rInner = 76;
  const polar = (r, deg) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  const arcPath = (a0, a1, ro, ri) => {
    const large = a1 - a0 > 180 ? 1 : 0;
    const o0 = polar(ro, a0);
    const o1 = polar(ro, a1);
    const i1 = polar(ri, a1);
    const i0 = polar(ri, a0);
    return `M ${o0.x.toFixed(2)} ${o0.y.toFixed(2)} A ${ro} ${ro} 0 ${large} 1 ${o1.x.toFixed(2)} ${o1.y.toFixed(2)} L ${i1.x.toFixed(2)} ${i1.y.toFixed(2)} A ${ri} ${ri} 0 ${large} 0 ${i0.x.toFixed(2)} ${i0.y.toFixed(2)} Z`;
  };

  let acc = 0;
  const arcs = slices.map((s) => {
    const a0 = (acc / 100) * 360;
    acc += s.share;
    const a1 = (acc / 100) * 360;
    return { ...s, a0, a1 };
  });
  const hv = hover != null ? arcs[hover] : null;

  return (
    <Paper sx={cardSx}>
      <Stack spacing={1.25}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}
        >
          <Typography variant="h6">{`Latest ${sideLabel.toLowerCase()} by industry`}</Typography>
          <Chip
            size="small"
            label={yearLabel}
            sx={{ bgcolor: alpha(accent, 0.1), color: accent, fontWeight: 800 }}
          />
        </Box>

        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ position: 'relative', width: 'min(100%, 300px)', flex: '0 1 300px' }}>
            <Box
              component="svg"
              viewBox={`0 0 ${size} ${size}`}
              role="img"
              aria-label={`${sideLabel} by industry, ${year}`}
              sx={{ width: '100%', height: 'auto', display: 'block' }}
              onMouseLeave={() => setHover(null)}
            >
              {arcs.map((a, i) => (
                <path
                  key={a.key}
                  d={arcPath(a.a0, a.a1, rOuter, rInner)}
                  fill={a.color}
                  fillOpacity={hover != null && hover !== i ? 0.32 : 0.92}
                  stroke="#fff"
                  strokeWidth="1.5"
                  onMouseEnter={() => setHover(i)}
                  style={{ cursor: 'pointer', transition: 'fill-opacity 120ms' }}
                />
              ))}
            </Box>

            {arcs.map((a, i) => {
              if (a.share < 4 || !basketIconFor(a.name, a.key === 'rest')) return null;
              const p = polar((rInner + rOuter) / 2, (a.a0 + a.a1) / 2);
              return (
                <Box
                  key={`ic-${a.key}`}
                  sx={{
                    position: 'absolute',
                    left: `${(p.x / size) * 100}%`,
                    top: `${(p.y / size) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    opacity: hover != null && hover !== i ? 0.3 : 1,
                    transition: 'opacity 120ms',
                  }}
                >
                  <BasketMark
                    name={a.name}
                    color={iconInk(a.color)}
                    rest={a.key === 'rest'}
                    size={14}
                  />
                </Box>
              );
            })}

            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
                pointerEvents: 'none',
                textAlign: 'center',
                px: '22%',
              }}
            >
              {hv ? (
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 0.5,
                      mb: 0.25,
                    }}
                  >
                    <BasketMark
                      name={hv.name}
                      color={hv.color}
                      rest={hv.key === 'rest'}
                      size={16}
                    />
                    <Typography sx={{ fontSize: 12, fontWeight: 700, lineHeight: 1.1 }}>
                      {hv.name}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      ...mono,
                      fontSize: 18,
                      fontWeight: 800,
                      color: hv.color,
                      lineHeight: 1.1,
                    }}
                  >{`${hv.share.toFixed(1)}%`}</Typography>
                  <Typography sx={{ ...mono, fontSize: 11, color: 'text.secondary' }}>
                    {moneyB(hv.value)}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography
                    sx={{ ...mono, fontSize: 22, fontWeight: 800, color: C.ink, lineHeight: 1.05 }}
                  >
                    {moneyB(total)}
                  </Typography>
                  <Typography
                    variant="overline"
                    sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.4 }}
                  >
                    Total
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.6, flexWrap: 'wrap' }}>
          {slices.map((s) => (
            <Box
              key={s.key}
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 0.5 }}
            >
              <BasketMark name={s.name} color={s.color} rest={s.key === 'rest'} />
              <Typography sx={{ fontSize: 11, fontWeight: 700 }}>{s.name}</Typography>
              <Typography
                sx={{ ...mono, fontSize: 11, color: 'text.secondary' }}
              >{`${s.share.toFixed(1)}%`}</Typography>
            </Box>
          ))}
        </Box>

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {`Share of total ${sideLabel.toLowerCase()} by commodity basket in ${year}; slices sum to 100%.`}
        </Typography>
      </Stack>
    </Paper>
  );
}
