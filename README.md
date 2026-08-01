# India Trade Monitor

India Trade Monitor is a public trade dashboard and research repo for
understanding India's merchandise exports, imports, partners, product baskets,
and long-run trade balance.

The project matters because India's trade data is public but scattered. This repo
turns official public-source data into a reusable dataset, an explorable
dashboard, and a report that contributors can inspect, challenge, and improve.

The most useful contributors right now are builders: people who can improve data
pipelines, reconcile methods, sharpen dashboard UX, or make the public report
clearer. Bigger ideas should be evaluated with the
[Idea Evaluation Handbook](docs/idea-evaluation-handbook.md) so contributors can
compare impact, effort, evidence, and owner fit. Start with
[CONTRIBUTING.md](CONTRIBUTING.md), [ROADMAP.md](ROADMAP.md), or the
[open issues](https://github.com/chandn0/india-trade-dashboard/issues).

## Why Contribute

This repo is strongest when the code and the report improve together. Useful
builder work includes:

- making the data refresh flow more reproducible
- tightening source notes and reconciliation logic
- improving chart readability and mobile behavior
- adding caveats where public readers could over-interpret the data
- turning raw trade movements into clearer public explanations

Ideas are welcome, but they should land as GitHub Issues so they can become
actionable work. Strong ideas should include a suggested rank, a first owner, and
a smallest useful implementation.

## Current Priority Tracks

- `Data pipelines`: make fetch/build scripts easier to run, verify, and automate.
- `Methodology and source reconciliation`: document source differences, caveats,
  and provisional-series assumptions.
- `Dashboard UX`: improve chart clarity, mobile ergonomics, performance, and
  citation-friendly views.
- `Public report and interpretation`: improve the written narrative, public
  caveats, and topic-specific analysis.

## How To Contribute

- `Pick an issue`: choose a labeled issue, comment that you want to take it, and
  open a focused pull request.
- `Propose an idea via issue`: use the report idea, data/method, bug, or feature
  template and include the problem, value, evidence, and suggested next step.
- `Open a small PR`: keep changes scoped, explain why they improve the dashboard
  or report, and include evidence for UI, data, or methodology changes.

## What A Good Contribution Looks Like

- Code: refactor one data build script so failures are easier to diagnose.
- Data: add a source note explaining why two official totals differ.
- Frontend: improve one chart annotation or mobile layout issue.
- Methodology: document a provisional-data caveat without changing the series
  silently.
- Report: add a concise comparison that helps readers understand a trade trend.

## Start Here

- Read [CONTRIBUTING.md](CONTRIBUTING.md) for contribution paths and PR norms.
- Read [ROADMAP.md](ROADMAP.md) for the current workstreams and starter ideas.
- Use the [Idea Evaluation Handbook](docs/idea-evaluation-handbook.md) to score
  and rank substantial ideas before implementation.
- Browse [open issues](https://github.com/chandn0/india-trade-dashboard/issues)
  for work labeled `good first issue`, `help wanted`, `data-pipeline`,
  `methodology`, `frontend`, or `report`.

## What Is In The Repo

- `app/`: Next.js App Router dashboard UI built with MUI
- `data/`: committed data snapshots used by the production build
- `scripts/`: fetch/build scripts for FTSPCC, FTPA, TIA, RBI, and FBIL data
- `docs/`: report-style notes based on the stored data

## What The Dashboard Covers

- year-wise merchandise export, import, and trade-balance totals
- commodity-group composition over time
- partner-country trade shares
- HS4 item-level movers across the latest five-year window
- a domestic value-chain research preview linking selected imported end products
  to potentially relevant Indian inputs and missing conversion steps
- interpretive notes in [`docs/india-trade-trends.md`](docs/india-trade-trends.md)
  and [`docs/why-inr-has-weakened.md`](docs/why-inr-has-weakened.md)

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Refresh The Data

Each script writes one or more JSON or CSV files into `data/`.

```bash
# yearly fiscal-year totals (FTSPCC)
node scripts/fetch_ftspcc_yearly.js
node scripts/build_ftspcc_yearly.js

# country-wise distribution
npm run fetch:country-distribution

# annual commodity-group basket shares (FTPA)
node scripts/fetch_ftpa_group_shares.js

# HS4 item-level five-year trends (TIA)
node scripts/fetch_eidb_partner_products.js

# INR / USD reference rate
node scripts/fetch_fbil_reference_rates.js
python scripts/fetch_rbi_exchange_rate.py

# build the slim country file consumed by the partner charts
node scripts/build_country_slim.js
```

The monthly FTSPCC refresh stages and validates a complete CSV before atomically
replacing the committed snapshot, so a failed upstream request preserves the
last known-good file.

Before refreshing committed data, follow the [data refresh checklist](docs/data-refresh-checklist.md).

Source notes live in [`data/sources.md`](data/sources.md).

## Domestic Value-Chain Research Preview

The product workspace includes a directional HS-4 value-chain screen. Its
curated links identify research hypotheses between an imported end product, a
potentially relevant input, observed Indian capability, and a missing conversion
step.

- `E1` means the relationship is directional and the available source evidence
  is partial. It is not a feasibility finding.
- HS-4 headings are broad trade categories, not bills of materials.
- Component imports are not allocated to finished products or added to
  finished-product deficits.
- Monetary localisation estimates remain suppressed until addressable product
  scope, replacement share, and imported-input share are sourced.

Source contracts and methodology are documented in
[`data/enrichment/README.md`](data/enrichment/README.md) and
[`docs/domestic-value-chain-opportunity-framework.md`](docs/domestic-value-chain-opportunity-framework.md).

Rebuild and validate the preview with:

```bash
npm run build:product-stage-mix
npm run build:value-chains
npm test
```

## Public Deployment

The app builds as a standard Next.js production bundle and can be deployed on
Vercel, Netlify, or Cloudflare Pages.

1. Push the repo to GitHub.
2. Import it into your hosting platform.
3. Set `NEXT_PUBLIC_SITE_URL` to your custom domain (e.g., `https://example.com`). If unset on Vercel, the app automatically falls back to `VERCEL_PROJECT_PRODUCTION_URL` or `VERCEL_URL`.
4. Deploy.

That environment variable (or automatic Vercel fallback) drives `metadataBase`, `sitemap.xml`, and
`robots.txt`.

## License

Code in this repo is released under the MIT License. See
[`LICENSE`](LICENSE).

Trade data remains subject to its original public-source terms and attribution.
See [`data/sources.md`](data/sources.md).
