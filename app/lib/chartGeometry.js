import { COMPACT_BELOW } from './responsive.js';

export function buildTradeGeo(data, width) {
  const compact = width < COMPACT_BELOW;
  const height = Math.round(width * (compact ? 0.78 : 0.33));
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
