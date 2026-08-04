import { Box, Tooltip, Typography } from '@mui/material';
import { mono } from '../../theme.js';
import { moneyB, moneySignB } from '../../lib/format.js';
import { HS4_YEARS } from '../../lib/transforms.js';
import Sparkline from './Sparkline.js';

const pctLabel = (pct) => (pct == null ? 'new' : `${pct >= 0 ? '+' : ''}${Math.round(pct)}%`);

export default function MoverRow({
  item,
  color,
  years = HS4_YEARS,
  rankFy = '26',
  showTrend = true,
}) {
  const tip = (
    <Box>
      {years.map((y, i) => (
        <Box key={y} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5 }}>
          <span>{`FY${y}`}</span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{moneyB(item.series[i])}</span>
        </Box>
      ))}
    </Box>
  );
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        py: 0.65,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          sx={{
            fontSize: 12.5,
            fontWeight: 700,
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.name}
        </Typography>
        {/* Two nowrap halves in a wrapping flex row: on narrow screens the value range drops to
            its own line cleanly instead of leaving a dangling separator at the line break. */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 0.75 }}>
          <Typography
            component="span"
            sx={{ ...mono, fontSize: 10.5, color: 'text.secondary', whiteSpace: 'nowrap' }}
          >
            {`HS ${item.code} · FY${rankFy} rank #${item.latestRank ?? '—'}`}
          </Typography>
          <Typography
            component="span"
            sx={{ ...mono, fontSize: 10.5, color: 'text.secondary', whiteSpace: 'nowrap' }}
          >
            {`${moneyB(item.base)} → ${moneyB(item.last)}`}
          </Typography>
        </Box>
      </Box>
      {showTrend ? (
        <Tooltip title={tip} arrow placement="top" enterTouchDelay={0} leaveTouchDelay={2500}>
          <Box sx={{ cursor: 'help' }}>
            <Sparkline series={item.series} color={color} />
          </Box>
        </Tooltip>
      ) : null}
      <Box sx={{ textAlign: 'right', minWidth: 82 }}>
        <Typography sx={{ ...mono, fontSize: 12.5, fontWeight: 800, color, lineHeight: 1.2 }}>
          {showTrend ? moneySignB(item.abs) : moneyB(item.last)}
        </Typography>
        {showTrend ? (
          <Typography sx={{ ...mono, fontSize: 10.5, color: 'text.secondary' }}>
            {pctLabel(item.pct)}
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
}
