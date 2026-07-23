'use client';

import * as React from 'react';
import { Box, Chip, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { SearchRounded } from '@mui/icons-material';
import { C, mono } from '../../theme.js';
import { moneyB, moneySignB, clamp, fyTick } from '../../lib/format.js';
import { useMeasuredWidth } from '../../lib/responsive.js';
import { buildTradeGeo } from '../../lib/chartGeometry.js';
import { PARTNERS, PARTNER_BY_KEY, COUNTRY_YEARS, COUNTRY_LAST } from '../../lib/transforms.js';
import TipRow from '../primitives/TipRow.js';
import ToggleChips from '../primitives/ToggleChips.js';
import cardSx from '../primitives/cardSx.js';

export default function PartnerTrendCard() {
  const [partnerKey, setPartnerKey] = React.useState('CHINA P RP');
  const [query, setQuery] = React.useState('');
  const partner = PARTNER_BY_KEY.get(partnerKey) ?? PARTNERS[0];

  const data = React.useMemo(
    () =>
      COUNTRY_YEARS.map((year, i) => ({
        financial_year: year,
        export_usd_mn: partner.exp[i],
        import_usd_mn: partner.imp[i],
      })),
    [partner],
  );
  const wrapRef = React.useRef(null);
  const measuredWidth = useMeasuredWidth(wrapRef, 1080);
  const geo = React.useMemo(() => buildTradeGeo(data, measuredWidth), [data, measuredWidth]);
  const [hover, setHover] = React.useState(null);

  const onMove = (e) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const vbX = ((e.clientX - rect.left) / rect.width) * geo.width;
    setHover(clamp(Math.round((vbX - geo.pad.left) / geo.xStep), 0, data.length - 1));
  };
  const p = hover != null ? geo.points[hover] : null;
  const tipLeft = p ? (p.x / geo.width) * 100 : 0;
  const flip = tipLeft > 60;

  const topChips = PARTNERS.slice(0, 8);
  const chips = topChips.some((t) => t.key === partnerKey) ? topChips : [...topChips, partner];
  const q = query.trim().toLowerCase();
  const matches = q ? PARTNERS.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 6) : [];
  const latestBal = partner.exp[COUNTRY_LAST] - partner.imp[COUNTRY_LAST];

  return (
    <Paper sx={{ ...cardSx }}>
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
          <Typography variant="h6">{`Partner trend: ${partner.name}`}</Typography>
          <Chip
            size="small"
            label={`FY${fyTick(COUNTRY_YEARS[COUNTRY_LAST])} balance ${moneySignB(latestBal)}`}
            sx={{
              bgcolor: alpha(latestBal >= 0 ? C.teal : C.red, 0.1),
              color: latestBal >= 0 ? C.teal : C.red,
              fontWeight: 800,
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <ToggleChips
            options={chips.map((c) => [c.key, c.name])}
            value={partnerKey}
            onChange={(k) => {
              setPartnerKey(k);
              setQuery('');
            }}
            colorFor={() => C.blue}
          />
          <TextField
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a country"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded sx={{ fontSize: 17, color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              minWidth: 170,
              flexGrow: { xs: 1, sm: 0 },
              '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'background.paper' },
              '& input': { fontSize: 13 },
            }}
          />
        </Box>
        {matches.length ? (
          <ToggleChips
            options={matches.map((c) => [c.key, c.name])}
            value={partnerKey}
            onChange={(k) => {
              setPartnerKey(k);
              setQuery('');
            }}
            colorFor={() => C.purple}
          />
        ) : null}

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
            aria-label={`Exports and imports with ${partner.name}`}
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
            <path
              d={geo.exportPath}
              fill="none"
              stroke={C.blue}
              strokeWidth="3.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={geo.importPath}
              fill="none"
              stroke={C.orange}
              strokeWidth="3.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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
                {(geo.xStep >= 40 && !geo.compact) || hover === pt.i ? (
                  <circle
                    cx={pt.x}
                    cy={pt.ye}
                    r={hover === pt.i ? 5.5 : 3.5}
                    fill={C.blue}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                ) : null}
                {(geo.xStep >= 40 && !geo.compact) || hover === pt.i ? (
                  <circle
                    cx={pt.x}
                    cy={pt.yi}
                    r={hover === pt.i ? 5.5 : 3.5}
                    fill={C.orange}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                ) : null}
                {pt.i === data.length - 1 || (data.length - 1 - pt.i) % geo.xLabelStep === 0 ? (
                  <text
                    x={pt.x}
                    y={geo.height - 18}
                    textAnchor={pt.i === 0 ? 'start' : pt.i === data.length - 1 ? 'end' : 'middle'}
                    fill={pt.i === data.length - 1 ? C.purple : '#64748b'}
                    fontSize="11"
                    fontWeight={pt.i === data.length - 1 ? 800 : 500}
                    fontFamily="IBM Plex Mono, monospace"
                  >
                    {fyTick(pt.d.financial_year)}
                  </text>
                ) : null}
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
                minWidth: 180,
                boxShadow: '0 10px 30px -8px rgba(8,15,30,0.55)',
                zIndex: 3,
              }}
            >
              <Typography sx={{ ...mono, fontWeight: 700, fontSize: 12, color: '#fff', mb: 0.75 }}>
                {p.d.financial_year}
              </Typography>
              <TipRow color={C.blue} label="Exports" value={moneyB(p.d.export_usd_mn)} sub="" />
              <TipRow color={C.orange} label="Imports" value={moneyB(p.d.import_usd_mn)} sub="" />
              <Box sx={{ height: '1px', bgcolor: 'rgba(255,255,255,0.12)', my: 0.75 }} />
              <TipRow
                color={p.d.export_usd_mn - p.d.import_usd_mn >= 0 ? C.teal : C.red}
                label="Balance"
                value={moneySignB(p.d.export_usd_mn - p.d.import_usd_mn)}
                sub=""
              />
            </Box>
          ) : null}
        </Box>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {`India's exports to and imports from ${partner.name}, FY${fyTick(COUNTRY_YEARS[0])} → FY${fyTick(COUNTRY_YEARS[COUNTRY_LAST])}. Pick a partner chip or search any of ${PARTNERS.length} countries; hover or tap for year figures.`}
        </Typography>
      </Stack>
    </Paper>
  );
}
