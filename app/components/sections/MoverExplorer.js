'use client';

import * as React from 'react';
import {
  Box,
  Chip,
  InputAdornment,
  Paper,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { SearchRounded } from '@mui/icons-material';
import { C, mono } from '../../theme.js';
import { moneyB, fyTick } from '../../lib/format.js';
import { HS4_YEARS, HS4_ITEMS, windowHs4 } from '../../lib/transforms.js';
import ToggleChips from '../primitives/ToggleChips.js';
import MoverRow from '../charts/MoverRow.js';
import MoversGroup from '../charts/MoversGroup.js';
import cardSx from '../primitives/cardSx.js';

const PCT_FLOOR_USD_MN = 500;

export default function MoverExplorer() {
  const [side, setSide] = React.useState('Exports');
  const [range, setRange] = React.useState([0, HS4_YEARS.length - 1]);
  const [rankBy, setRankBy] = React.useState('abs');
  const [topN, setTopN] = React.useState(6);
  const [query, setQuery] = React.useState('');

  const accent = side === 'Exports' ? C.blue : C.orange;
  const [i0, i1] = range;
  const windowYears = HS4_YEARS.slice(i0, i1 + 1);
  const rankFy = HS4_YEARS[i1].slice(-2);

  const handleRange = (_, value, activeThumb) => {
    if (!Array.isArray(value)) return;
    if (value[1] - value[0] < 1) {
      const lastIdx = HS4_YEARS.length - 1;
      if (activeThumb === 0) {
        const lo = Math.min(value[0], lastIdx - 1);
        setRange([lo, lo + 1]);
      } else {
        const hi = Math.max(value[1], 1);
        setRange([hi - 1, hi]);
      }
      return;
    }
    setRange(value);
  };

  const computed = React.useMemo(() => windowHs4(HS4_ITEMS[side], i0, i1), [side, i0, i1]);

  const ranked = React.useMemo(() => {
    if (rankBy === 'abs') {
      const byAbs = [...computed].sort((a, b) => b.abs - a.abs);
      return { gainers: byAbs.slice(0, topN), decliners: byAbs.slice(-topN).reverse() };
    }
    const byPct = computed
      .filter((item) => item.base >= PCT_FLOOR_USD_MN)
      .sort((a, b) => b.pct - a.pct);
    return { gainers: byPct.slice(0, topN), decliners: byPct.slice(-topN).reverse() };
  }, [computed, rankBy, topN]);

  const q = query.trim().toLowerCase();
  const matches = q
    ? computed
        .filter((item) => item.name.toLowerCase().includes(q) || item.code.startsWith(q))
        .sort((a, b) => b.last - a.last)
        .slice(0, topN)
    : null;

  const windowLabel = `FY${fyTick(HS4_YEARS[i0])} → FY${fyTick(HS4_YEARS[i1])}`;

  return (
    <Paper sx={cardSx}>
      <Stack spacing={1.5}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Typography component="h3" variant="h6">
            Explore export &amp; import product lines
          </Typography>
          <Chip
            size="small"
            label={windowLabel}
            sx={{ bgcolor: alpha(accent, 0.1), color: accent, fontWeight: 800 }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, rowGap: 1 }}>
          <ToggleChips
            options={[
              ['Exports', 'Exports'],
              ['Imports', 'Imports'],
            ]}
            value={side}
            onChange={setSide}
            colorFor={(k) => (k === 'Exports' ? C.blue : C.orange)}
          />
          <Box sx={{ flex: 1, minWidth: 230, maxWidth: 400, px: 2 }}>
            <Slider
              size="small"
              value={range}
              onChange={handleRange}
              min={0}
              max={HS4_YEARS.length - 1}
              step={1}
              marks={HS4_YEARS.map((y, i) => ({ value: i, label: fyTick(y) }))}
              disableSwap
              getAriaLabel={(idx) =>
                idx === 0 ? 'Window start fiscal year' : 'Window end fiscal year'
              }
              sx={{
                color: accent,
                '& .MuiSlider-markLabel': {
                  fontFamily: mono.fontFamily,
                  fontSize: 10,
                  color: 'text.secondary',
                },
              }}
            />
          </Box>
          <ToggleChips
            options={[
              ['abs', 'US$ change'],
              ['pct', '% change'],
            ]}
            value={rankBy}
            onChange={setRankBy}
            colorFor={() => accent}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 170 }}>
            <Typography
              sx={{
                ...mono,
                fontSize: 11,
                fontWeight: 700,
                color: 'text.secondary',
                whiteSpace: 'nowrap',
              }}
            >
              {`Top ${topN}`}
            </Typography>
            <Slider
              size="small"
              value={topN}
              onChange={(_, value) => setTopN(value)}
              min={3}
              max={50}
              step={1}
              valueLabelDisplay="auto"
              aria-label="Lines to show per list"
              sx={{ color: accent, width: 150 }}
            />
          </Box>
          <TextField
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a product or HS code"
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
              minWidth: 210,
              flexGrow: { xs: 1, sm: 0 },
              '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'background.paper' },
              '& input': { fontSize: 13 },
            }}
          />
        </Box>

        {matches ? (
          <Box>
            <Typography variant="overline" sx={{ color: accent, letterSpacing: '0.08em' }}>
              {matches.length ? `Matches · largest ${side.toLowerCase()} first` : 'No matches'}
            </Typography>
            {matches.map((item) => (
              <MoverRow
                key={item.code}
                item={item}
                color={item.abs < 0 ? C.red : C.teal}
                years={windowYears}
                rankFy={rankFy}
              />
            ))}
            {!matches.length ? (
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'block', pt: 1 }}
              >
                {`Nothing matches "${query.trim()}" — try a shorter word or a 4-digit HS code.`}
              </Typography>
            ) : null}
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <MoversGroup
              title="Fastest growing"
              items={ranked.gainers}
              positive
              years={windowYears}
              rankFy={rankFy}
            />
            <MoversGroup
              title="Biggest decline"
              items={ranked.decliners}
              positive={false}
              years={windowYears}
              rankFy={rankFy}
            />
          </Box>
        )}

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {`Pick exports or imports, drag the fiscal-year window, and rank HS-4 product lines by US$ or percent change across it — or search any line to see its own path. The Top-N slider sets how many lines each list shows. The % ranking skips lines under ${moneyB(PCT_FLOOR_USD_MN)} at the window start so tiny bases don't dominate. Hover or tap a sparkline for year-by-year values.`}
        </Typography>
      </Stack>
    </Paper>
  );
}
