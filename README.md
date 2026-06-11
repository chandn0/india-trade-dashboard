# India Trade Monitor

A Next.js dashboard for India's merchandise trade — year-wise totals, basket-level
composition, partner shares, and item-level (HS4) movers — built on official
Government of India data.

The data files in [`data/`](data) are pulled from public endpoints (FTSPCC, TIA,
RBI / FBIL) by the scripts in [`scripts/`](scripts) and committed into the repo,
so the production build is fully static (no runtime API calls).

## Stack

- Next.js 16 (App Router) with React 19
- MUI 9 (Material UI) for layout and components
- Charts are hand-rolled SVG inside React components (no chart library)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Refresh the data

Each script writes one or more JSON / CSV files into `data/`.

```bash
# yearly fiscal-year totals (FTSPCC)
node scripts/fetch_ftspcc_yearly.js
node scripts/build_ftspcc_yearly.js

# country-wise distribution (also exposed as an npm script)
npm run fetch:country-distribution

# annual commodity-group basket shares (FTPA)
node scripts/fetch_ftpa_group_shares.js

# HS4 item-level five-year trends (TIA)
node scripts/fetch_eidb_partner_products.js

# INR / USD reference rate
node scripts/fetch_fbil_reference_rates.js
python  scripts/fetch_rbi_exchange_rate.py

# build the slim country file consumed by the partner charts
node scripts/build_country_slim.js
```

See [`data/sources.md`](data/sources.md) for source URLs and notes on the fiscal-year
convention.

## Deploy

The app builds to a standard Next.js production bundle. Vercel (the project that
ships Next.js) is the most direct path:

1. Push the repo to GitHub.
2. Import it in Vercel — no configuration needed.
3. Set the environment variable `NEXT_PUBLIC_SITE_URL` to your final public URL
   (e.g. `https://indiatrade.example.com`). This drives `metadataBase`,
   `sitemap.xml`, and `robots.txt`.
4. Deploy.

Netlify and Cloudflare Pages also support Next.js out of the box if you'd
rather not use Vercel.

### Refreshing data on a schedule

The fetch scripts are not wired to CI. If you want the dashboard to update
automatically (instead of being a snapshot frozen at build time), add a
GitHub Action that runs the relevant scripts on a cron, commits the updated
files in `data/`, and lets the deployment redeploy on the new commit.

## Project layout

```
app/                Next.js App Router entry (layout, page, theme, metadata)
data/               Committed snapshots used by the dashboard
docs/               Background notes (not served by the app)
scripts/            Data-fetch / data-build scripts
```

## License

Code is released under the MIT License (add a `LICENSE` file if you intend to
publish on GitHub). Trade data is published by the Government of India; see
[`data/sources.md`](data/sources.md) for attribution.
