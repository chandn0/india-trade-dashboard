/**
 * Shared fiscal-year configuration for all fetch/build scripts.
 *
 * Override via environment variables before running any script:
 *   TRADE_YEAR_START=2012 TRADE_YEAR_END=2026 node scripts/fetch_ftspcc_yearly.js
 *
 * Fiscal year convention used here: a fiscal year is identified by its *start*
 * calendar year.  FY2024-25 → fiscalStart=2024.  The year-end label used in data
 * files (e.g. "2024-25") is produced by fiscalYearLabel().
 */

// Earliest year for which FTSPCC monthly data is available.
const DEFAULT_YEAR_START = 2010;

// Current fiscal year start.  Update this each April when a new FY begins.
// Scripts that default to YEAR_END will use this value unless overridden.
const CURRENT_FY_START = 2025; // FY2025-26

export const YEAR_START = process.env.TRADE_YEAR_START
  ? parseInt(process.env.TRADE_YEAR_START, 10)
  : DEFAULT_YEAR_START;

export const YEAR_END = process.env.TRADE_YEAR_END
  ? parseInt(process.env.TRADE_YEAR_END, 10)
  : CURRENT_FY_START;

/** Returns the label string for a fiscal year, e.g. fiscalYearLabel(2024) → "2024-25". */
export function fiscalYearLabel(fiscalStart) {
  const end = (fiscalStart + 1).toString().slice(-2);
  return `${fiscalStart}-${end}`;
}

/** An array of fiscal-start years from YEAR_START to YEAR_END (inclusive). */
export const FISCAL_YEARS = Array.from(
  { length: YEAR_END - YEAR_START + 1 },
  (_, i) => YEAR_START + i,
);
