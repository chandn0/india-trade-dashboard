'use client';

import * as React from 'react';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { C, mono } from '../../theme.js';
import { moneyB, moneySignB, pct, clamp } from '../../lib/format.js';
import { useMeasuredWidth } from '../../lib/responsive.js';
import { buildTradeGeo } from '../../lib/chartGeometry.js';
import { latestFyLabel, latestIsProvisional, rows } from '../../lib/transforms.js';
import TipRow from '../primitives/TipRow.js';
import cardSx from '../primitives/cardSx.js';

export default function TradeTrendChart() {
  const [hover, setHover] = React.useState(null);
  const [show, setShow] = React.useState({ exports: true, imports: true, gap: true });
  const wrapRef = React.useRef(null);
  const measuredWidth = useMeasuredWidth(wrapRef, 1080);
  const geo = React.useMemo(() => buildTradeGeo(rows, measuredWidth), [measuredWidth]);

  const onMove = (e) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const vbX = ((e.clientX - rect.left) / rect.width) * geo.width;
    setHover(clamp(Math.round((vbX - geo.pad.left) / geo.xStep), 0, rows.length - 1));
  };

  const p = hover != null ? geo.points[hover] : null;
  const tipLeft = p ? (p.x / geo.width) * 100 : 0;
  const flip = tipLeft > 60;
  const toggle = (k) => setShow((s) => ({ ...s, [k]: !s[k] }));
  const gapOn = show.gap && show.exports && show.imports;

  const legend = [
    { k: 'exports', label: 'Exports', color: C.blue },
    { k: 'imports', label: 'Imports', color: C.orange },
    { k: 'gap', label: 'Deficit gap', color: C.red },
  ];

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
          <Stack
            direction="row"
            spacing={0.75}
            useFlexGap
            sx={{ alignItems: 'center', flexWrap: 'wrap' }}
          >
            <Typography component="h2" variant="subtitle1" sx={{ fontWeight: 800 }}>
              Exports vs imports · US$ billion
            </Typography>
            {latestIsProvisional ? (
              <Chip
                size="small"
                label={`${latestFyLabel} provisional`}
                sx={{ bgcolor: alpha(C.orange, 0.1), color: C.orange, fontWeight: 800 }}
              />
            ) : null}
          </Stack>
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
                        borderRadius: l.k === 'gap' ? 0.5 : 999,
                        bgcolor: l.color,
                        ml: '6px !important',
                      }}
                    />
                  }
                  label={l.label}
                  sx={{
                    minHeight: 32,
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
          sx={{
            borderLeft: '3px solid',
            borderColor: alpha(C.orange, 0.65),
            bgcolor: alpha(C.orange, 0.055),
            borderRadius: 1,
            px: 1.25,
            py: 0.8,
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.55 }}>
            <Box component="span" sx={{ color: 'text.primary', fontWeight: 800 }}>
              FY2020–21 · pandemic disruption.
            </Box>{' '}
            Trade flows contracted sharply before the recovery that followed in FY2021–22.
          </Typography>
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
            aria-label="Exports and imports trend"
            sx={{ width: '100%', height: 'auto', display: 'block' }}
          >
            <defs>
              <linearGradient id="deficitGap" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={C.red} stopOpacity="0.18" />
                <stop offset="100%" stopColor={C.orange} stopOpacity="0.06" />
              </linearGradient>
            </defs>
            <text
              x={4}
              y={20}
              textAnchor="start"
              fill="#64748b"
              fontSize="11"
              fontWeight="700"
              fontFamily="IBM Plex Mono, monospace"
            >
              US$ bn
            </text>
            {geo.yTicks.map((t, i) => (
              <g key={i}>
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
                  {Math.round(t.v / 1000)}
                </text>
              </g>
            ))}
            {gapOn ? <path d={geo.gapPath} fill="url(#deficitGap)" /> : null}
            {show.exports ? (
              <path
                d={geo.exportPath}
                fill="none"
                stroke={C.blue}
                strokeWidth="3.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}
            {show.imports ? (
              <path
                d={geo.importPath}
                fill="none"
                stroke={C.orange}
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

            {geo.points.map((pt) => (
              <React.Fragment key={pt.d.financial_year}>
                {/* Resting dots are hidden on compact — 16 white-ringed dots on a ~300px line read
                    as a dotted stroke. The hovered year still gets its marker. */}
                {show.exports && (!geo.compact || hover === pt.i) ? (
                  <circle
                    cx={pt.x}
                    cy={pt.ye}
                    r={hover === pt.i ? 5.5 : 3.5}
                    fill={C.blue}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                ) : null}
                {show.imports && (!geo.compact || hover === pt.i) ? (
                  <circle
                    cx={pt.x}
                    cy={pt.yi}
                    r={hover === pt.i ? 5.5 : 3.5}
                    fill={C.orange}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                ) : null}
                {(() => {
                  const n = geo.points.length;
                  if (pt.i !== n - 1 && (n - 1 - pt.i) % geo.xLabelStep !== 0) return null;
                  const last = pt.i === n - 1;
                  return (
                    <text
                      x={pt.x}
                      y={geo.height - 18}
                      textAnchor={pt.i === 0 ? 'start' : last ? 'end' : 'middle'}
                      fill={last ? C.purple : '#64748b'}
                      fontSize="11"
                      fontWeight={last ? 800 : 500}
                      fontFamily="IBM Plex Mono, monospace"
                    >
                      {`${pt.d.financial_year.slice(2, 4)}–${pt.d.financial_year.slice(-2)}`}
                    </text>
                  );
                })()}
              </React.Fragment>
            ))}
          </Box>

          {p ? (
            <Box
              sx={{
                position: 'absolute',
                left: geo.compact ? 'auto' : `${tipLeft}%`,
                right: geo.compact ? 4 : 'auto',
                top: 8,
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
                minWidth: 178,
                boxShadow: '0 10px 30px -8px rgba(8,15,30,0.55)',
                zIndex: 3,
              }}
            >
              <Typography sx={{ ...mono, fontWeight: 700, fontSize: 12, color: '#fff', mb: 0.75 }}>
                {p.d.financial_year}
                {p.d.data_status === 'year_to_date' ? '  · YTD' : ''}
              </Typography>
              <TipRow
                color={C.blue}
                label="Exports"
                value={moneyB(p.d.export_usd_mn)}
                sub={p.d.export_yoy_pct == null ? '' : `${pct.format(p.d.export_yoy_pct)}%`}
              />
              <TipRow
                color={C.orange}
                label="Imports"
                value={moneyB(p.d.import_usd_mn)}
                sub={p.d.import_yoy_pct == null ? '' : `${pct.format(p.d.import_yoy_pct)}%`}
              />
              <Box sx={{ height: '1px', bgcolor: 'rgba(255,255,255,0.12)', my: 0.75 }} />
              <TipRow
                color={C.red}
                label="Deficit"
                value={moneySignB(p.d.trade_balance_usd_mn)}
                sub=""
              />
            </Box>
          ) : null}
        </Box>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          The shaded band is the trade deficit — the gap between imports and exports. Hover or tap
          any year for figures; click a legend chip to toggle a series.
          {latestIsProvisional ? ` ${latestFyLabel} figures may be revised.` : ''}
        </Typography>
      </Stack>
    </Paper>
  );
}
