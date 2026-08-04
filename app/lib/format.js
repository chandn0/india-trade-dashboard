export const nf2 = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});
export const pct = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  signDisplay: 'always',
});

export const moneyB = (n) => {
  if (n == null || isNaN(n)) return 'N/A';
  if (n === 0) return '$0.00B';
  const absN = Math.abs(n);
  const sign = n < 0 ? '−' : '';
  if (absN < 10) {
    return `${sign}$${absN.toFixed(2)}M`;
  }
  return `${sign}$${nf2.format(absN / 1000)}B`;
};
export const moneyShortB = (n) => {
  const b = n / 1000;
  const sign = b < 0 ? '−' : '';
  const absB = Math.abs(b);
  return absB >= 1000 ? `${sign}$${(absB / 1000).toFixed(1)}T` : `${sign}$${Math.round(absB)}B`;
};
export const moneySignB = (n) => `${n < 0 ? '−' : '+'}$${nf2.format(Math.abs(n) / 1000)}B`;
export const pctFmt = (n) => pct.format(n);
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export const fyTick = (y) => `${y.slice(2, 4)}–${y.slice(-2)}`;
export const ratioLabel = (r) =>
  !Number.isFinite(r) ? '—' : r >= 1 ? `${r.toFixed(1)}×` : `${Math.round(r * 100)}%`;
