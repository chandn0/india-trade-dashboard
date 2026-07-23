# Product-stage classification methodology

The Product Composition workspace assigns every available HS-4 product a
dominant economic stage. This is an analytical classification, not an official
Government of India classification and not a claim about every HS-6 or HS-8
tariff line contained within an HS-4 heading.

## Classification precedence

1. **Curated HS-4 assignment** — reviewed product-level assignments in
   `data/product_stage_classification.csv`. These include an explicit rationale,
   use confidence 4/5, and carry `reviewed` status.
2. **HS-2 dominant-use rule** — a deterministic chapter-level assignment in
   `scripts/build_product_stage_mix.js`. These use confidence 2/5 and carry
   `needs review` status.
3. Machinery and transport headings containing part/accessory language are
   treated as intermediate inputs before the broader chapter rule is applied.

The generated JSON retains `classificationMethod`, `confidence`, and
`reviewStatus` for every product. The interface exposes these fields in the
product profile.

## Stage definitions

- **Raw material:** primary, unprocessed, or recovered feedstock.
- **Intermediate input:** processed material, part, or component incorporated
  into further production.
- **Finished product:** predominantly ready for final use or consumption.
- **Capital good:** durable machinery, equipment, or transport asset used to
  produce goods or services.
- **Energy input:** fuel or energy feedstock.
- **Agricultural commodity:** primary or lightly processed farm commodity.
- **Consumption asset:** precious metal substantially held for savings,
  jewellery inventory, or investment demand.

## Full-basket and top-product views

Full-basket summaries use all HS-4 lines in the source files. The main dashboard
preview continues to list the top 40 lines for readability and reports their
coverage of the complete flow. The dedicated `/products` workspace supports
top-20, top-50, top-100, and all-product exploration.

## Gross versus net

For a product or stage:

`net balance = exports − imports`

Positive values are surpluses and negative values are deficits. Imports and
exports remain visible beside the net result so large two-way flows are not
misread as equivalent to one-way dependence.

## Partner limitation

Current partner-product snapshots contain the ten largest **HS-2 chapters** for
12 major partners. Product profiles may show this as an observed chapter-level
exposure indicator. It is not an HS-4 sourcing share and is labelled accordingly.
True product-specific partner attribution requires a partner × HS-4 dataset.

## Refresh

After refreshing the HS-4, partner, classification, or Buildability Atlas data,
run:

```bash
npm run build:product-stage-mix
```

The build fails when required curated top-product assignments are missing and
regenerates `data/product_stage_mix.json` deterministically from committed inputs.
