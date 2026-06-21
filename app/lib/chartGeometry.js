import { COMPACT_BELOW } from './responsive.js';

export function buildTradeGeo(data, width) {
  const compact = width < COMPACT_BELOW;
  const height = Math.round(width * (compact ? 0.78 : 0.4));
  const pad = compact
    ? { top: 32, right: 14, bottom: 42, left: 44 }
    : { top: 30, right: 24, bottom: 52, left: 52 };
  const cw = width - pad.left - pad.right;
  const ch = height - pad.top - pad.bottom;
  const n = data.length;
  const xStep = cw / Math.max(n - 1, 1);
  const maxVal = Math.max(...data.map((d) => Math.max(d.export_usd_mn, d.import_usd_mn))) * 1.08;
  const x = (i) => pad.left + i * xStep;
  const y = (v) => pad.top + ch - (v / maxVal) * ch;
  const points = data.map((d, i) => ({
    i,
    d,
    x: x(i),
    ye: y(d.export_usd_mn),
    yi: y(d.import_usd_mn),
  }));
  const exportPath = points
    .map((p, i) => `${i ? 'L' : 'M'} ${p.x.toFixed(1)} ${p.ye.toFixed(1)}`)
    .join(' ');
  const importPath = points
    .map((p, i) => `${i ? 'L' : 'M'} ${p.x.toFixed(1)} ${p.yi.toFixed(1)}`)
    .join(' ');
  const upper = points.map((p) => `${p.x.toFixed(1)} ${p.yi.toFixed(1)}`);
  const lower = points
    .slice()
    .reverse()
    .map((p) => `${p.x.toFixed(1)} ${p.ye.toFixed(1)}`);
  const gapPath = `M ${upper.join(' L ')} L ${lower.join(' L ')} Z`;
  const yTicks = [];
  for (let i = 0; i <= 5; i += 1) {
    const v = maxVal * (1 - i / 5);
    yTicks.push({ v, y: y(v) });
  }
  const xLabelStep = Math.max(1, Math.ceil((n - 1) / (compact ? 4 : 8)));
  return {
    width,
    height,
    pad,
    xStep,
    maxVal,
    x,
    y,
    points,
    exportPath,
    importPath,
    gapPath,
    yTicks,
    compact,
    xLabelStep,
  };
}

export function buildRupeeDeficitGeo(data, width) {
  const compact = width < COMPACT_BELOW;
  const height = Math.round(width * (compact ? 0.85 : 0.4));
  const pad = compact
    ? { top: 30, right: 56, bottom: 42, left: 42 }
    : { top: 30, right: 80, bottom: 52, left: 56 };
  const cw = width - pad.left - pad.right;
  const ch = height - pad.top - pad.bottom;
  const n = data.length;
  const xStep = cw / Math.max(n - 1, 1);
  const fxVals = data.map((d) => d.exchange_rate_inr_per_usd);
  const defVals = data.map((d) => d.cumulative_deficit_usd_mn);
  const fx0 = fxVals[0];
  const def0 = defVals[0];
  const fxMaxV = Math.max(...fxVals);
  const fxMinV = Math.min(...fxVals);
  const defMaxV = Math.max(...defVals);

  // Anchor both axes so the two lines BEGIN at the same height on the left. The rupee axis no
  // longer starts at 0 (which left the rupee line floating mid-chart); instead its base is set so
  // the first year lines up with where the cumulative-deficit line starts. Each axis keeps its own
  // real units and its own top headroom, so the lines are free to diverge by the end rather than
  // being forced to meet there.
  const defMin = 0;
  const defMax = defMaxV * 1.06;
  const startFrac = (def0 - defMin) / (defMax - defMin);
  const fxMax = fxMaxV * 1.18;
  const fxFloor = fxMinV - (fxMaxV - fxMinV) * 0.04;
  const fxMin = Math.min((fx0 - startFrac * fxMax) / (1 - startFrac), fxFloor);

  const x = (i) => pad.left + i * xStep;
  const yFx = (v) => pad.top + ch - ((v - fxMin) / (fxMax - fxMin)) * ch;
  const yDef = (v) => pad.top + ch - ((v - defMin) / (defMax - defMin)) * ch;
  const points = data.map((d, i) => ({
    i,
    d,
    x: x(i),
    yf: yFx(d.exchange_rate_inr_per_usd),
    yd: yDef(d.cumulative_deficit_usd_mn),
  }));
  const fxPath = points
    .map((p, i) => `${i ? 'L' : 'M'} ${p.x.toFixed(1)} ${p.yf.toFixed(1)}`)
    .join(' ');
  const deficitPath = points
    .map((p, i) => `${i ? 'L' : 'M'} ${p.x.toFixed(1)} ${p.yd.toFixed(1)}`)
    .join(' ');
  const leftTicks = [];
  const rightTicks = [];
  for (let i = 0; i <= 5; i += 1) {
    const fx = fxMin + (fxMax - fxMin) * (1 - i / 5);
    const def = defMin + (defMax - defMin) * (1 - i / 5);
    leftTicks.push({ v: fx, y: yFx(fx) });
    rightTicks.push({ v: def, y: yDef(def) });
  }
  const xLabelStep = Math.max(1, Math.ceil((n - 1) / (compact ? 4 : 8)));
  return {
    width,
    height,
    pad,
    xStep,
    fxMin,
    fxMax,
    defMin,
    defMax,
    x,
    yFx,
    yDef,
    points,
    fxPath,
    deficitPath,
    leftTicks,
    rightTicks,
    compact,
    xLabelStep,
  };
}
