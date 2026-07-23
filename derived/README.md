# Derived product-discovery inputs

These files are committed snapshots from the adjacent `india-trade-deficit`
research repository. They are inputs to the Buildability Atlas and retain their
original column names so that refreshes remain reviewable.

- `top_deficit_products.csv`: FY 2025-26 HS-4 imports, exports, net balance, and
  deficit share.
- `hs4_import_dependence_index.csv`: import growth, export coverage, and the
  research repository's dependence score.
- `hs4_export_momentum_index.csv`: export growth and momentum reference data.
- `partner_product_deficit.csv`: partner exposure at HS-2 level. This is used
  only as a broad exposure indicator and is not presented as HS-4 sourcing.
- `opportunity_scores.csv`: brief-level research scores retained for future
  cross-linking. It is not currently used to score individual HS-4 products.

Run `npm run build:product-discovery` after refreshing these snapshots or
editing `data/import_product_classification.csv`.

## Gross-versus-net method

For each classified product:

1. `net deficit = imports - exports`
2. `realistic net impact range = net deficit × curated scenario range`
3. `opportunity score = high-case net impact × category tractability ×
confidence`, normalized to 100 across the classified set

The scenario range is a transparent prioritization assumption, not a forecast.
It deliberately avoids treating every dollar of imports as removable. The
classification CSV is the auditable source for categories, reasons, levers,
constraints, confidence, and scenario ranges; the UI contains none of those
judgments.
