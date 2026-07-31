'use client';

import * as React from 'react';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { C } from '../../theme.js';
import { moneyB, moneySignB, ratioLabel, fyTick } from '../../lib/format.js';
import { HS4_YEARS, IMPORT_BY_CODE, EXPORT_BY_CODE } from '../../lib/transforms.js';
import { VALUE_CHAINS, CHAIN_COLOR } from '../../config/valueChains.js';
import ValueChainMap from '../charts/ValueChainMap.js';
import ChainFlowChart from '../charts/ChainFlowChart.js';
import ChainStat from '../primitives/ChainStat.js';
import MoverRow from '../charts/MoverRow.js';
import ToggleChips from '../primitives/ToggleChips.js';
import cardSx from '../primitives/cardSx.js';

export default function ValueChainSection() {
  const [chainKey, setChainKey] = React.useState('petroleum');
  const chain = VALUE_CHAINS.find((c) => c.key === chainKey);
  const inputItems = chain.inputs.map((code) => IMPORT_BY_CODE.get(code)).filter(Boolean);
  const outputItems = chain.outputs.map((code) => EXPORT_BY_CODE.get(code)).filter(Boolean);
  const inSeries = HS4_YEARS.map((_, i) => inputItems.reduce((sum, it) => sum + it.series[i], 0));
  const outSeries = HS4_YEARS.map((_, i) => outputItems.reduce((sum, it) => sum + it.series[i], 0));
  const last = HS4_YEARS.length - 1;
  const covLast = inSeries[last] > 0 ? outSeries[last] / inSeries[last] : null;
  const covFirst = inSeries[0] > 0 ? outSeries[0] / inSeries[0] : null;

  const counterFlows = [
    ...chain.inputs
      .filter((code) => !chain.outputs.includes(code))
      .map((code) => EXPORT_BY_CODE.get(code))
      .filter((it) => it && it.last >= 500)
      .map((it) => ({ it, dir: 'export' })),
    ...chain.outputs
      .filter((code) => !chain.inputs.includes(code))
      .map((code) => IMPORT_BY_CODE.get(code))
      .filter((it) => it && it.last >= 500)
      .map((it) => ({ it, dir: 'import' })),
  ].sort((a, b) => b.it.last - a.it.last);

  const chainCodes = [...new Set([...chain.inputs, ...chain.outputs])];
  const chainNet = HS4_YEARS.map((_, i) =>
    chainCodes.reduce(
      (sum, code) =>
        sum +
        (EXPORT_BY_CODE.get(code)?.series[i] ?? 0) -
        (IMPORT_BY_CODE.get(code)?.series[i] ?? 0),
      0,
    ),
  );

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
          <Typography component="h2" variant="h6">
            How imports feed exports
          </Typography>
          <Chip
            size="small"
            label={`FY${fyTick(HS4_YEARS[0])} → FY${fyTick(HS4_YEARS[last])}`}
            sx={{ bgcolor: alpha(C.teal, 0.1), color: C.teal, fontWeight: 800 }}
          />
        </Box>

        <ValueChainMap value={chainKey} onChange={setChainKey} />

        <ToggleChips
          options={VALUE_CHAINS.map((c) => [c.key, c.name])}
          value={chainKey}
          onChange={setChainKey}
          colorFor={(key) => CHAIN_COLOR[key] ?? C.teal}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 1.5,
            flexWrap: 'wrap',
          }}
        >
          <Typography
            sx={{ fontSize: 12.5, color: 'text.secondary', flex: '1 1 320px', minWidth: 0 }}
          >
            {chain.story}
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
            {[
              [C.orange, 'Imported inputs'],
              [C.blue, 'Exported outputs'],
            ].map(([color, label]) => (
              <Box key={label} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 9, height: 9, borderRadius: 999, bgcolor: color }} />
                <Typography sx={{ fontSize: 11, fontWeight: 700, color }}>{label}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        {chain.players?.length ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
            <Typography
              variant="overline"
              sx={{ color: 'text.secondary', letterSpacing: '0.08em', lineHeight: 1.6 }}
            >
              Key players
            </Typography>
            {chain.players.map((name) => (
              <Chip
                key={name}
                size="small"
                label={name}
                sx={{
                  fontWeight: 600,
                  fontSize: 11,
                  bgcolor: 'transparent',
                  color: CHAIN_COLOR[chain.key] ?? C.slate,
                  border: '1px solid',
                  borderColor: alpha(CHAIN_COLOR[chain.key] ?? C.slate, 0.3),
                }}
              />
            ))}
          </Box>
        ) : null}

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start', py: 0.25 }}>
          <ChainStat
            label="Imported inputs"
            value={moneyB(inSeries[last])}
            sub={`FY${fyTick(HS4_YEARS[0])}: ${moneyB(inSeries[0])}`}
            color={C.orange}
          />
          <ChainStat
            label="Exported outputs"
            value={moneyB(outSeries[last])}
            sub={`FY${fyTick(HS4_YEARS[0])}: ${moneyB(outSeries[0])}`}
            color={C.blue}
          />
          <ChainStat
            label="Coverage out÷in"
            value={ratioLabel(covLast)}
            sub={`FY${fyTick(HS4_YEARS[0])}: ${ratioLabel(covFirst)}`}
          />
          <ChainStat
            label="Chain trade balance"
            value={moneySignB(chainNet[last])}
            sub={`FY${fyTick(HS4_YEARS[0])}: ${moneySignB(chainNet[0])}`}
            color={chainNet[last] >= 0 ? C.teal : C.red}
          />
        </Box>

        <ChainFlowChart inSeries={inSeries} outSeries={outSeries} />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: counterFlows.length ? '1fr 1fr 1fr' : '1fr 1fr',
            },
            gap: 2,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="overline" sx={{ color: C.orange, letterSpacing: '0.08em' }}>
              Imported inputs
            </Typography>
            {inputItems.map((it) => (
              <MoverRow key={`in-${it.code}`} item={it} color={C.orange} />
            ))}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="overline" sx={{ color: C.blue, letterSpacing: '0.08em' }}>
              Exported outputs
            </Typography>
            {outputItems.map((it) => (
              <MoverRow key={`out-${it.code}`} item={it} color={C.blue} />
            ))}
          </Box>
          {counterFlows.length ? (
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="overline" sx={{ color: C.slate, letterSpacing: '0.08em' }}>
                Counter-flows
              </Typography>
              {counterFlows.map(({ it, dir }) => (
                <MoverRow
                  key={`cf-${dir}-${it.code}`}
                  item={it}
                  color={dir === 'import' ? C.orange : C.blue}
                />
              ))}
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'block', pt: 0.5 }}
              >
                The same products moving the other way — orange rows are imports of this
                chain&apos;s outputs, blue rows are exports of its inputs. Both count in the chain
                trade balance.
              </Typography>
            </Box>
          ) : null}
        </Box>

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          The map shows all six chains at once — ribbon widths are proportional to value, so a
          ribbon that narrows left-to-right means most of the input value stays in the domestic
          economy, and one that widens means value is added at home before export. Coverage compares
          exported outputs with imported inputs; the chain trade balance counts every flow of these
          product lines in both directions, counter-flows included. Pairings are matched by product
          family — not an official input–output table — so treat both as directional signals rather
          than measured value-added: imported inputs also serve domestic demand (most gold and coal
          never leave), and exports also draw on domestic inputs. Key players are well-known firms
          in each chain from public reporting — company-level detail is not part of the official
          trade data. Gross trade values from FY2021-22 to FY2025-26. Hover or tap the chart for
          year-by-year figures.
        </Typography>
      </Stack>
    </Paper>
  );
}
