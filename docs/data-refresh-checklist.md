# Data refresh checklist

Use this checklist before updating committed data snapshots. It keeps a source
refresh reviewable and makes it clear which outputs should change together.

## 1. Start clean

1. Update `main` and confirm the working tree has no unrelated changes.
2. Record the source date and any known TradeStat or TIA availability caveat.
3. Run the refresh from the repository root. A failed fetch must not be worked
   around by editing generated data by hand.

## 2. Refresh the standard dashboard data

Run:

```bash
npm run refresh:all
```

This runs the supported fetches in dependency order and stops at the first
failure. Expect these groups of files to change:

| Step                                   | Expected outputs                                                                                                                                                              |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FTSPCC monthly totals and yearly build | `data/india_trade_monthly_totals.csv`, `data/india_trade_yearly_raw.json`, `data/india_trade_yearly_summary.csv`, `data/sources.md`                                           |
| Country distribution and slim build    | `data/india_trade_country_distribution.json`, `data/india_trade_country_distribution_latest.csv`, `data/india_trade_country_totals.csv`, `data/india_trade_country_slim.json` |
| FTPA commodity shares                  | `data/india_trade_commodity_group_shares.json` and its CSV mirrors                                                                                                            |
| TIA partner/product extraction         | HS-4 import/export snapshots and `data/india_trade_partner_top_products.json`                                                                                                 |
| FBIL exchange rates                    | `data/india_trade_inr_usd_fy.json` and `data/india_trade_inr_usd_fy.csv`                                                                                                      |

Some sources may not publish a new row. In that case, only their provenance
date or no files may change; do not manufacture a change.

## 3. Refresh optional, separately maintained datasets

Run these only when their source has changed or the related page is being
updated:

```bash
npm run fetch:petroleum-country-mix
npm run build:product-discovery
npm run build:product-stage-mix
npm run build:value-chains
```

Review the corresponding generated files, source notes, and any reader-facing
copy that names the latest fiscal year.

## 4. Review the diff

Check that:

- fiscal years remain April–March and FTSPCC annual totals use March cumulative rows;
- the latest year retains its correct provisional or year-to-date status;
- values, shares, and ranks change plausibly relative to the prior snapshot;
- no unrelated generated file changed; and
- source URLs and update dates are present where the pipeline writes them.

## 5. Validate before opening a pull request

Run:

```bash
npm run validate:products
npm run validate:value-chains
npm run test
npm run lint
npm run build
```

In the pull request, summarize the source date, changed series, material data
movements, and any known reconciliation or provisional-data caveat.
