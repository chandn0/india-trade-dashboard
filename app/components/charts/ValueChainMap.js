'use client';

import * as React from 'react';
import { Box } from '@mui/material';
import { C } from '../../theme.js';
import { moneyB, moneyShortB, ratioLabel, fyTick } from '../../lib/format.js';
import { COMPACT_BELOW, useMeasuredWidth } from '../../lib/responsive.js';
import { HS4_YEARS } from '../../lib/transforms.js';
import { CHAIN_FLOWS, CHAIN_COLOR } from '../../config/valueChains.js';

export default function ValueChainMap({ value, onChange }) {
  const wrapRef = React.useRef(null);
  const width = useMeasuredWidth(wrapRef, 1080);
  const compact = width < COMPACT_BELOW;
  const [hoverKey, setHoverKey] = React.useState(null);

  const gutterL = compact ? 122 : 190;
  const gutterR = compact ? 78 : 158;
  const barW = 10;
  const headerH = 30;
  const gap = 14;
  const minH = 13;
  const totalIn = CHAIN_FLOWS.reduce((sum, c) => sum + c.inVal, 0) || 1;
  const k = (compact ? 250 : 300) / totalIn;

  let yL = headerH;
  let yR = headerH;
  const flowRows = CHAIN_FLOWS.map((c) => {
    const hIn = Math.max(c.inVal * k, minH);
    const hOut = Math.max(c.outVal * k, minH);
    const row = { ...c, hIn, hOut, yIn: yL, yOut: yR };
    yL += hIn + gap;
    yR += hOut + gap;
    return row;
  });
  const height = Math.max(yL, yR) - gap + 8;
  const xL = gutterL + barW;
  const xR = width - gutterR - barW;
  const mx = (xL + xR) / 2;
  const money = compact ? moneyShortB : moneyB;
  const lastFy = fyTick(HS4_YEARS[HS4_YEARS.length - 1]);

  return (
    <Box ref={wrapRef} sx={{ width: '100%' }}>
      <Box
        component="svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Map of import-to-export value chains"
        sx={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <text
          x={compact ? 0 : gutterL}
          y={13}
          textAnchor="start"
          fill={C.orange}
          fontSize="11"
          fontWeight="800"
        >
          {compact ? `Inputs · FY${lastFy}` : `Imported inputs · FY${lastFy}`}
        </text>
        <text
          x={compact ? width : width - gutterR}
          y={13}
          textAnchor="end"
          fill={C.blue}
          fontSize="11"
          fontWeight="800"
        >
          {compact ? 'Outputs' : 'Exported outputs'}
        </text>
        {flowRows.map((c) => {
          const color = CHAIN_COLOR[c.key] ?? C.slate;
          const selected = value === c.key;
          const active = selected || hoverKey === c.key;
          const dimmed = hoverKey != null && hoverKey !== c.key;
          const cyIn = c.yIn + c.hIn / 2;
          const cyOut = c.yOut + c.hOut / 2;
          const ribbon = [
            `M ${xL} ${c.yIn}`,
            `C ${mx} ${c.yIn}, ${mx} ${c.yOut}, ${xR} ${c.yOut}`,
            `L ${xR} ${c.yOut + c.hOut}`,
            `C ${mx} ${c.yOut + c.hOut}, ${mx} ${c.yIn + c.hIn}, ${xL} ${c.yIn + c.hIn}`,
            'Z',
          ].join(' ');
          const coverage = c.inVal > 0 ? c.outVal / c.inVal : null;
          return (
            <g
              key={c.key}
              onClick={() => onChange(c.key)}
              onMouseEnter={() => setHoverKey(c.key)}
              onMouseLeave={() => setHoverKey(null)}
              style={{ cursor: 'pointer' }}
              opacity={dimmed ? 0.38 : 1}
            >
              <title>{`${c.name}: ${moneyB(c.inVal)} imported inputs → ${moneyB(c.outVal)} exported outputs. Click to inspect.`}</title>
              <path
                d={ribbon}
                fill={color}
                fillOpacity={active ? 0.4 : 0.22}
                stroke={selected ? color : 'none'}
                strokeWidth="1.5"
              />
              <rect x={gutterL} y={c.yIn} width={barW} height={c.hIn} rx="2" fill={color} />
              <rect x={xR} y={c.yOut} width={barW} height={c.hOut} rx="2" fill={color} />
              <text
                x={gutterL - 8}
                y={cyIn - 1}
                textAnchor="end"
                fill={color}
                fontSize={compact ? 10.5 : 11.5}
                fontWeight="700"
              >
                {c.name}
              </text>
              <text
                x={gutterL - 8}
                y={cyIn + 11}
                textAnchor="end"
                fill="#64748b"
                fontSize="10"
                fontFamily="IBM Plex Mono, monospace"
              >
                {`${money(c.inVal)} in`}
              </text>
              <text
                x={width - gutterR + 8}
                y={compact ? cyOut + 3 : cyOut - 1}
                textAnchor="start"
                fill={color}
                fontSize="10.5"
                fontWeight="700"
                fontFamily="IBM Plex Mono, monospace"
              >
                {`${money(c.outVal)} out`}
              </text>
              {!compact ? (
                <text
                  x={width - gutterR + 8}
                  y={cyOut + 11}
                  textAnchor="start"
                  fill="#64748b"
                  fontSize="10"
                >
                  {`coverage ${ratioLabel(coverage)}`}
                </text>
              ) : null}
            </g>
          );
        })}
      </Box>
    </Box>
  );
}
