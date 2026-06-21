'use client';

import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { C, mono } from '../../theme.js';
import { moneyB, moneySignB, clamp, ratioLabel, fyTick } from '../../lib/format.js';
import { COMPACT_BELOW, useMeasuredWidth } from '../../lib/responsive.js';
import { HS4_YEARS } from '../../lib/transforms.js';
import TipRow from '../primitives/TipRow.js';

export default function ChainFlowChart({ inSeries, outSeries }) {
  const wrapRef = React.useRef(null);
  const width = useMeasuredWidth(wrapRef, 1080);
  const compact = width < COMPACT_BELOW;
  const height = Math.round(width * (compact ? 0.62 : 0.32));
  const pad = compact
    ? { top: 28, right: 14, bottom: 40, left: 44 }
    : { top: 30, right: 24, bottom: 46, left: 52 };
  const n = HS4_YEARS.length;
  const cw = width - pad.left - pad.right;
  const ch = height - pad.top - pad.bottom;
  const maxVal = (Math.max(...inSeries, ...outSeries) || 1) * 1.12;
  const x = (i) => pad.left + (i / (n - 1)) * cw;
  const y = (v) => pad.top + ch - (v / maxVal) * ch;
  const linePath = (s) =>
    s.map((v, i) => `${i ? 'L' : 'M'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');

  const [hover, setHover] = React.useState(null);
  const onMove = (e) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const vbX = ((e.clientX - rect.left) / rect.width) * width;
    setHover(clamp(Math.round((vbX - pad.left) / (cw / (n - 1))), 0, n - 1));
  };
  const tipLeft = hover != null ? (x(hover) / width) * 100 : 0;
  const flip = tipLeft > 60;
  const coverage =
    hover != null && inSeries[hover] > 0 ? outSeries[hover] / inSeries[hover] : null;

  return (
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
        aria-label="Imported inputs versus exported outputs"
        sx={{ width: '100%', height: 'auto', display: 'block' }}
      >
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
        {[0, 1, 2, 3, 4].map((i) => {
          const v = maxVal * (1 - i / 4);
          return (
            <g key={i}>
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
                fontSize="11"
                fontFamily="IBM Plex Mono, monospace"
              >
                {Math.round(v / 1000)}
              </text>
            </g>
          );
        })}
        <path
          d={linePath(inSeries)}
          fill="none"
          stroke={C.orange}
          strokeWidth="3.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={linePath(outSeries)}
          fill="none"
          stroke={C.blue}
          strokeWidth="3.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {hover != null ? (
          <line
            x1={x(hover)}
            x2={x(hover)}
            y1={pad.top}
            y2={height - pad.bottom}
            stroke="#0c1730"
            strokeOpacity="0.18"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        ) : null}
        {HS4_YEARS.map((yr, i) => (
          <React.Fragment key={yr}>
            <circle
              cx={x(i)}
              cy={y(inSeries[i])}
              r={hover === i ? 5.5 : 3.5}
              fill={C.orange}
              stroke="#fff"
              strokeWidth="2"
            />
            <circle
              cx={x(i)}
              cy={y(outSeries[i])}
              r={hover === i ? 5.5 : 3.5}
              fill={C.blue}
              stroke="#fff"
              strokeWidth="2"
            />
            <text
              x={x(i)}
              y={height - 16}
              textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}
              fill={i === n - 1 ? C.purple : '#64748b'}
              fontSize="11"
              fontWeight={i === n - 1 ? 800 : 500}
              fontFamily="IBM Plex Mono, monospace"
            >
              {fyTick(yr)}
            </text>
          </React.Fragment>
        ))}
      </Box>

      {hover != null ? (
        <Box
          sx={{
            position: 'absolute',
            left: compact ? 'auto' : `${tipLeft}%`,
            right: compact ? 4 : 'auto',
            top: 8,
            transform: compact
              ? 'none'
              : flip
                ? 'translateX(calc(-100% - 14px))'
                : 'translateX(14px)',
            pointerEvents: 'none',
            bgcolor: C.ink,
            color: '#e7ecf5',
            borderRadius: 2,
            p: 1.25,
            minWidth: 196,
            boxShadow: '0 10px 30px -8px rgba(8,15,30,0.55)',
            zIndex: 3,
          }}
        >
          <Typography sx={{ ...mono, fontWeight: 700, fontSize: 12, color: '#fff', mb: 0.75 }}>
            {`FY${HS4_YEARS[hover]}`}
          </Typography>
          <TipRow
            color={C.orange}
            label="Imported inputs"
            value={moneyB(inSeries[hover])}
            sub=""
          />
          <TipRow
            color={C.blue}
            label="Exported outputs"
            value={moneyB(outSeries[hover])}
            sub=""
          />
          <Box sx={{ height: '1px', bgcolor: 'rgba(255,255,255,0.12)', my: 0.75 }} />
          <TipRow
            color={outSeries[hover] - inSeries[hover] >= 0 ? C.teal : C.red}
            label="Gap (out − in)"
            value={moneySignB(outSeries[hover] - inSeries[hover])}
            sub=""
          />
          <TipRow
            color={C.teal}
            label="Coverage"
            value={coverage == null ? '—' : ratioLabel(coverage)}
            sub=""
          />
        </Box>
      ) : null}
    </Box>
  );
}
