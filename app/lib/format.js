export const nf2 = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
export const pct = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  signDisplay: 'always',
});

export const moneyB = (n) => `$${nf2.format(n / 1000)}B`;
export const moneyShortB = (n) => {
  const b = n / 1000;
  return Math.abs(b) >= 1000 ? `$${(b / 1000).toFixed(1)}T` : `$${Math.round(b)}B`;
};
export const moneySignB = (n) => `${n < 0 ? '-' : '+'}$${nf2.format(Math.abs(n) / 1000)}B`;
export const pctFmt = (n) => pct.format(n);
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export const fyTick = (y) => `${y.slice(2, 4)}–${y.slice(-2)}`;
export const ratioLabel = (r) =>
  !Number.isFinite(r) ? '—' : r >= 1 ? `${r.toFixed(1)}×` : `${Math.round(r * 100)}%`;
