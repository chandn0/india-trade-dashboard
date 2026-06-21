'use client';

import * as React from 'react';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { C, mono } from '../../theme.js';
import { moneyB, moneyShortB, nf2, clamp } from '../../lib/format.js';
import { useMeasuredWidth } from '../../lib/responsive.js';
import { buildRupeeDeficitGeo } from '../../lib/chartGeometry.js';
import { rupeeDeficitRows } from '../../lib/transforms.js';
import TipRow from '../primitives/TipRow.js';
import cardSx from '../primitives/cardSx.js';

export default function RupeeDeficitChart() {
  const [hover, setHover] = React.useState(null);
  const [show, setShow] = React.useState({ rupee: true, deficit: true });
  const wrapRef = React.useRef(null);
  const measuredWidth = useMeasuredWidth(wrapRef, 1080);
  const geo = React.useMemo(
    () => buildRupeeDeficitGeo(rupeeDeficitRows, measuredWidth),
    [measuredWidth],
  );

  const onMove = (e) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const vbX = ((e.clientX - rect.left) / rect.width) * geo.width;
    setHover(
      clamp(Math.round((vbX - geo.pad.left) / geo.xStep), 0, rupeeDeficitRows.length - 1),
    );
  };

  const p = hover != null ? geo.points[hover] : null;
  const tipLeft = p ? (p.x / geo.width) * 100 : 0;
  const flip = tipLeft > 60;

  const legend = [
    { k: 'rupee', label: 'INR per USD', color: C.purple },
    { k: 'deficit', label: 'Cumulative deficit', color: C.red },
  ];

  const toggle = (k) => setShow((s) => ({ ...s, [k]: !s[k] }));

  return (
    <Paper sx={{ ...cardSx }}>
      <Stack spacing={1.5}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            Rupee value vs cumulative export deficit
          </Typography>
          <Stack direction="row" spacing={0.75}>
            {legend.map((l) => {
              const on = show[l.k];
              return (
                <Chip
                  key={l.k}
                  size="small"
                  onClick={() => toggle(l.k)}
                  icon={
                    <Box
                      sx={{
                        width: 9,
                        height: 9,
                        borderRadius: 999,
                        bgcolor: l.color,
                        ml: '6px !important',
                      }}
                    />
                  }
                  label={l.label}
                  sx={{
                    cursor: 'pointer',
                    fontWeight: 700,
                    bgcolor: on ? alpha(l.color, 0.1) : 'transparent',
                    color: on ? l.color : 'text.disabled',
                    border: '1px solid',
                    borderColor: on ? alpha(l.color, 0.25) : 'divider',
                    textDecoration: on ? 'none' : 'line-through',
                  }}
                />
              );
            })}
          </Stack>
        </Box>

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
            viewBox={`0 0 ${geo.width} ${geo.height}`}
            role="img"
            aria-label="Rupee value and cumulative export deficit"
            sx={{ width: '100%', height: 'auto', display: 'block' }}
          >
            {geo.leftTicks.map((t, i) => (
              <g key={`l-${i}`}>
                <line
                  x1={geo.pad.left}
                  x2={geo.width - geo.pad.right}
                  y1={t.y}
                  y2={t.y}
                  stroke={C.grid}
                  strokeWidth="1"
                />
                <text
                  x={geo.pad.left - 10}
                  y={t.y + 4}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="11"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {geo.compact ? Math.round(t.v) : nf2.format(t.v)}
                </text>
              </g>
            ))}
            {geo.rightTicks.map((t, i) => (
              <text
                key={`r-${i}`}
                x={geo.width - geo.pad.right + 10}
                y={t.y + 4}
                textAnchor="start"
                fill="#94a3b8"
                fontSize="11"
                fontFamily="IBM Plex Mono, monospace"
              >
                {geo.compact ? moneyShortB(t.v) : moneyB(t.v)}
              </text>
            ))}
            <text
              x={4}
              y={20}
              textAnchor="start"
              fill="#64748b"
              fontSize="11"
              fontWeight="700"
              fontFamily="IBM Plex Mono, monospace"
            >
              INR/USD
            </text>
            <text
              x={geo.width - 4}
              y={20}
              textAnchor="end"
              fill="#64748b"
              fontSize="11"
              fontWeight="700"
              fontFamily="IBM Plex Mono, monospace"
            >
              Cumulative deficit
            </text>
            {show.deficit ? (
              <path
                d={geo.deficitPath}
                fill="none"
                stroke={C.red}
                strokeWidth="3.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}
            {show.rupee ? (
              <path
                d={geo.fxPath}
                fill="none"
                stroke={C.purple}
                strokeWidth="3.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}

            {hover != null ? (
              <line
                x1={p.x}
                x2={p.x}
                y1={geo.pad.top}
                y2={geo.height - geo.pad.bottom}
                stroke="#0c1730"
                strokeOpacity="0.18"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            ) : null}

            {geo.points.map((pt) => {
              const n = geo.points.length;
              const showLabel = pt.i === n - 1 || (n - 1 - pt.i) % geo.xLabelStep === 0;
              return (
                <React.Fragment key={pt.d.financial_year}>
                  {show.rupee && (!geo.compact || hover === pt.i) ? (
                    <circle
                      cx={pt.x}
                      cy={pt.yf}
                      r={hover === pt.i ? 5.5 : 3.5}
                      fill={C.purple}
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  ) : null}
                  {show.deficit && (!geo.compact || hover === pt.i) ? (
                    <circle
                      cx={pt.x}
                      cy={pt.yd}
                      r={hover === pt.i ? 5.5 : 3.5}
                      fill={C.red}
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  ) : null}
                  {showLabel ? (
                    <text
                      x={pt.x}
                      y={geo.height - 18}
                      textAnchor={pt.i === 0 ? 'start' : pt.i === n - 1 ? 'end' : 'middle'}
                      fill={pt.i === n - 1 ? C.purple : '#64748b'}
                      fontSize="11"
                      fontWeight={pt.i === n - 1 ? 800 : 500}
                      fontFamily="IBM Plex Mono, monospace"
                    >
                      {`${pt.d.financial_year.slice(2, 4)}–${pt.d.financial_year.slice(-2)}`}
                    </text>
                  ) : null}
                </React.Fragment>
              );
            })}
          </Box>

          {p ? (
            <Box
              sx={{
                position: 'absolute',
                left: geo.compact ? 'auto' : `${tipLeft}%`,
                right: geo.compact ? 4 : 'auto',
                top: geo.compact ? 30 : 8,
                transform: geo.compact
                  ? 'none'
                  : flip
                    ? 'translateX(calc(-100% - 14px))'
                    : 'translateX(14px)',
                pointerEvents: 'none',
                bgcolor: C.ink,
                color: '#e7ecf5',
                borderRadius: 2,
                p: 1.25,
                minWidth: 188,
                boxShadow: '0 10px 30px -8px rgba(8,15,30,0.55)',
                zIndex: 3,
              }}
            >
              <Typography sx={{ ...mono, fontWeight: 700, fontSize: 12, color: '#fff', mb: 0.75 }}>
                {p.d.financial_year}
              </Typography>
              <TipRow
                color={C.purple}
                label="INR / USD"
                value={`₹${nf2.format(p.d.exchange_rate_inr_per_usd)}`}
                sub=""
              />
              <TipRow
                color={C.red}
                label="Annual deficit"
                value={moneyB(p.d.annual_deficit_usd_mn)}
                sub=""
              />
              <Box sx={{ height: '1px', bgcolor: 'rgba(255,255,255,0.12)', my: 0.75 }} />
              <TipRow
                color={C.red}
                label="Cumulative"
                value={moneyB(p.d.cumulative_deficit_usd_mn)}
                sub=""
              />
            </Box>
          ) : null}
        </Box>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          RBI Table 139 provides the financial-year annual average INR per USD; the deficit line is
          the cumulative annual trade deficit. Both lines start from the same point on the left so
          you can see how the rupee and the deficit move together — each keeps its own axis, so
          they&apos;re free to diverge over time.
        </Typography>
      </Stack>
    </Paper>
  );
}
