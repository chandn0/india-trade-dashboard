'use client';

import * as React from 'react';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { C, mono, toneColor } from '../../theme.js';
import { moneyB, clamp } from '../../lib/format.js';
import { COMPACT_BELOW, useMeasuredWidth } from '../../lib/responsive.js';
import { REST_COLOR, CAT } from '../../lib/transforms.js';
import { basketIconFor, iconInk } from '../../config/icons.js';
import BasketMark from '../primitives/BasketMark.js';
import cardSx from '../primitives/cardSx.js';
import ChartFooter from '../primitives/ChartFooter.js';

export default function CompositionChart({
  title,
  sideLabel,
  tone,
  comp,
  groupNoun = 'official commodity groups',
  controls = null,
  mobileLegendLimit = null,
}) {
  const accent = toneColor(tone);
  const [hover, setHover] = React.useState(null);
  const wrapRef = React.useRef(null);

  const width = useMeasuredWidth(wrapRef, 1080);
  const compact = width < COMPACT_BELOW;
  // Rendered at width:100%/height:auto, so on-screen height = containerWidth * (height/width).
  // Phones get a taller aspect so the stacked bands stay thick enough to read.
  const height = Math.round(width * (compact ? 0.86 : 0.34));
  const pad = compact
    ? { top: 20, right: 12, bottom: 42, left: 42 }
    : { top: 24, right: 22, bottom: 48, left: 52 };
  const cw = width - pad.left - pad.right;
  const ch = height - pad.top - pad.bottom;
  const n = comp.years.length;
  const x = (i) => pad.left + (n <= 1 ? cw / 2 : (i / (n - 1)) * cw);
  const y = (v) => pad.top + ch - (v / 100) * ch;

  const order = comp.items.map((it, j) => ({
    key: it.key,
    name: comp.latestYear.segs[j].name,
    color: comp.latestYear.segs[j].color || CAT[j % CAT.length],
    j,
    isRest: false,
  }));
  order.push({ key: 'rest', name: 'Rest of basket', color: REST_COLOR, j: -1, isRest: true });

  const shareAt = (b, i) => (b.isRest ? comp.years[i].rest.share : comp.years[i].segs[b.j].share);
  const valueAt = (b, i) => (b.isRest ? comp.years[i].rest.value : comp.years[i].segs[b.j].value);

  const bands = order.map(() => ({ top: [], bottom: [] }));
  for (let i = 0; i < n; i += 1) {
    let acc = 0;
    order.forEach((b, bi) => {
      const sh = shareAt(b, i);
      bands[bi].bottom.push(acc);
      bands[bi].top.push(acc + sh);
      acc += sh;
    });
  }
  const pt = (v, i) => `${x(i).toFixed(1)} ${y(v).toFixed(1)}`;
  const areaPath = (bi) => {
    const top = bands[bi].top.map((v, i) => pt(v, i));
    const bot = bands[bi].bottom.map((v, i) => pt(v, i)).reverse();
    return `M ${top.join(' L ')} L ${bot.join(' L ')} Z`;
  };
  const edgePath = (bi) => `M ${bands[bi].top.map((v, i) => pt(v, i)).join(' L ')}`;

  const onMove = (e) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const vbX = ((e.clientX - rect.left) / rect.width) * width;
    const yr = clamp(Math.round((vbX - pad.left) / (cw / Math.max(n - 1, 1))), 0, n - 1);
    setHover((h) => ({ band: h ? h.band : 0, year: yr }));
  };

  const hb = hover ? order[hover.band] : null;
  const hy = hover ? hover.year : 0;
  const tipLeft = hover ? (x(hy) / width) * 100 : 0;
  const tipTop = hb
    ? (y((bands[hover.band].top[hy] + bands[hover.band].bottom[hy]) / 2) / height) * 100
    : 0;
  const flip = tipLeft > 58;
  const mobileLegendIsTrimmed = compact && mobileLegendLimit != null;
  const legendSegs = mobileLegendIsTrimmed
    ? comp.latestYear.segs.slice(0, mobileLegendLimit)
    : comp.latestYear.segs;
  const hiddenLegendCount = comp.latestYear.segs.length - legendSegs.length;

  return (
    <Paper sx={cardSx}>
      <Stack spacing={1.25}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <Box>
            <Typography variant="h6">{title}</Typography>
          </Box>
          <Chip
            size="small"
            label={`Top ${comp.items.length} = ${comp.topShare.toFixed(1)}%`}
            sx={{ bgcolor: alpha(accent, 0.1), color: accent, fontWeight: 800 }}
          />
        </Box>

        {controls}

        <Box
          ref={wrapRef}
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
          onTouchStart={(e) => onMove(e.touches[0])}
          onTouchMove={(e) => onMove(e.touches[0])}
          sx={{ position: 'relative', width: '100%', cursor: 'crosshair', touchAction: 'pan-y' }}
        >
          <Box
            component="svg"
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={`${title} composition`}
            sx={{ width: '100%', height: 'auto', display: 'block' }}
          >
            {[0, 25, 50, 75, 100].map((v) => (
              <g key={v}>
                <line
                  x1={pad.left}
                  x2={width - pad.right}
                  y1={y(v)}
                  y2={y(v)}
                  stroke={C.grid}
                  strokeWidth="1"
                />
                <text
                  x={pad.left - 10}
                  y={y(v) + 4}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="10.5"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {`${v}%`}
                </text>
              </g>
            ))}
            {order.map((b, bi) => (
              <path
                key={b.key}
                d={areaPath(bi)}
                fill={b.color}
                fillOpacity={hover && hover.band !== bi ? 0.4 : 0.92}
                stroke="#fff"
                strokeWidth="1"
                onMouseEnter={() => setHover((h) => ({ band: bi, year: h ? h.year : n - 1 }))}
                style={{ cursor: 'pointer' }}
              />
            ))}
            {hover ? (
              <g>
                <line
                  x1={x(hy)}
                  x2={x(hy)}
                  y1={pad.top}
                  y2={pad.top + ch}
                  stroke="#0c1730"
                  strokeOpacity="0.22"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <path d={edgePath(hover.band)} fill="none" stroke="#fff" strokeWidth="2.5" />
                <circle
                  cx={x(hy)}
                  cy={y(bands[hover.band].top[hy])}
                  r="4"
                  fill="#fff"
                  stroke={hb.color}
                  strokeWidth="2.5"
                />
              </g>
            ) : null}
            {comp.years.map((yr, i) => {
              const labelStep = Math.max(1, Math.ceil((n - 1) / (compact ? 3 : 5)));
              if (i !== n - 1 && (n - 1 - i) % labelStep !== 0) return null;
              const lbl =
                yr.year.length > 7 ? `${yr.year.slice(2, 4)}–${yr.year.slice(-2)}` : yr.year;
              return (
                <text
                  key={yr.year}
                  x={x(i)}
                  y={height - 18}
                  textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}
                  fill={i === n - 1 ? C.purple : '#64748b'}
                  fontSize="11"
                  fontWeight={i === n - 1 ? 800 : 600}
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {lbl}
                </text>
              );
            })}
          </Box>

          {order.map((b, bi) => {
            // The icon is an HTML overlay in fixed CSS px; only place it when the band's
            // latest-year thickness (also px, since viewBox == container px) can contain it,
            // so icons never stack on top of each other on narrow screens.
            const latestShare = bands[bi].top[n - 1] - bands[bi].bottom[n - 1];
            const bandPx = (latestShare / 100) * ch;
            const iconSize = compact ? 11 : 15;
            if (bandPx < iconSize + 5 || !basketIconFor(b.name, b.isRest)) return null;
            const yMid = y((bands[bi].top[n - 1] + bands[bi].bottom[n - 1]) / 2);
            return (
              <Box
                key={`ic-${b.key}`}
                sx={{
                  position: 'absolute',
                  left: `${clamp((x(n - 1) / width) * 100, 5, 96)}%`,
                  top: `${(yMid / height) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                  opacity: hover && hover.band !== bi ? 0.35 : 1,
                  transition: 'opacity 120ms',
                }}
              >
                <BasketMark
                  name={b.name}
                  color={iconInk(b.color)}
                  rest={b.isRest}
                  size={iconSize}
                />
              </Box>
            );
          })}

          {hb ? (
            <Box
              sx={{
                position: 'absolute',
                left: compact ? 'auto' : `${tipLeft}%`,
                right: compact ? 4 : 'auto',
                top: compact ? 4 : `${tipTop}%`,
                transform: compact
                  ? 'none'
                  : flip
                    ? 'translate(calc(-100% - 14px), -50%)'
                    : 'translate(14px, -50%)',
                pointerEvents: 'none',
                bgcolor: C.ink,
                color: '#fff',
                borderRadius: 2,
                p: 1.1,
                width: 190,
                boxShadow: '0 10px 30px -8px rgba(8,15,30,0.55)',
                zIndex: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                <BasketMark name={hb.name} color={hb.color} rest={hb.isRest} size={15} />
                <Typography sx={{ fontWeight: 700, fontSize: 12.5 }}>{hb.name}</Typography>
                <Typography
                  sx={{ ...mono, fontSize: 11, color: 'rgba(231,236,245,0.7)', ml: 'auto' }}
                >
                  {comp.years[hy].year}
                </Typography>
              </Box>
              <Typography sx={{ ...mono, fontSize: 12.5, fontWeight: 700 }}>
                {shareAt(hb, hy).toFixed(1)}% · {moneyB(valueAt(hb, hy))}
              </Typography>
            </Box>
          ) : null}
        </Box>

        <Box sx={{ display: 'flex', gap: 0.6, flexWrap: 'wrap' }}>
          {legendSegs.map((seg, si) => (
            <Box
              key={seg.key}
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 0.5 }}
            >
              <BasketMark name={seg.name} color={seg.color || CAT[si % CAT.length]} />
              <Typography sx={{ fontSize: 11, fontWeight: 700 }}>{seg.name}</Typography>
              <Typography sx={{ ...mono, fontSize: 11, color: 'text.secondary' }}>
                {seg.share.toFixed(1)}%
              </Typography>
            </Box>
          ))}
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 0.5 }}>
            <BasketMark color={REST_COLOR} rest />
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary' }}>
              Rest {comp.latestYear.rest.share.toFixed(1)}%
            </Typography>
          </Box>
          {hiddenLegendCount > 0 ? (
            <Typography
              sx={{ alignSelf: 'center', fontSize: 11, color: 'text.secondary', px: 0.5 }}
            >
              + {hiddenLegendCount} more {groupNoun} · tap a band for detail
            </Typography>
          ) : null}
        </Box>
        <ChartFooter>
          {sideLabel} across {comp.groupCount} {groupNoun}; the top {comp.items.length} are shown as
          continuous bands and each year sums to 100%.
        </ChartFooter>
      </Stack>
    </Paper>
  );
}
