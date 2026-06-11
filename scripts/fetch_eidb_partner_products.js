// Fetches the HS-2 commodity mix of India's trade with its top partners from the EIDB
// "country-wise all commodities" pages, for the latest fiscal year:
//   exports: https://tradestat.commerce.gov.in/eidb/country_wise_all_commodities_export
//   imports: https://tradestat.commerce.gov.in/eidb/country_wise_all_commodities_import
// Writes data/india_trade_partner_top_products.json with the top chapters per partner per side.
// Re-run after refreshing the country distribution:
//   node scripts/fetch_eidb_partner_products.js
import fs from 'node:fs/promises';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const SIDES = {
  exports: {
    url: 'https://tradestat.commerce.gov.in/eidb/country_wise_all_commodities_export',
    fields: { year: 'EidbYearcwace', country: 'EidbCntcwace', report: 'EidbReportcwace', level: 'EidbComLevelcwace' },
  },
  imports: {
    url: 'https://tradestat.commerce.gov.in/eidb/country_wise_all_commodities_import',
    fields: { year: 'EidbYearcwaci', country: 'EidbCntcwaci', report: 'EidbReportcwaci', level: 'EidbComLevelcwaci' },
  },
};
const TOP_PARTNERS = 12; // matches the butterfly chart
const TOP_CHAPTERS = 10; // per side, ranked by current-year value
const OUT_FILE = path.resolve('data', 'india_trade_partner_top_products.json');
const COUNTRY_SOURCE = path.resolve('data', 'india_trade_country_distribution.json');

const decode = (t) => t.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const strip = (t) => decode(t.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
const num = (t) => {
  const v = Number(strip(t).replace(/,/g, '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(v) ? v : 0;
};
const token = (html) => {
  const m = html.match(/name="_token" value="([^"]+)"/);
  if (!m) throw new Error('No CSRF token in page');
  return m[1];
};

function curl(args) {
  return execFileSync('curl', ['-L', '--silent', '--max-time', '90', ...args], { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
}

function parseChapterRows(html, label) {
  const tbody = html.match(/<tbody>([\s\S]*?)<\/tbody>/i);
  if (!tbody) throw new Error(`No table body in response for ${label}`);
  return [...tbody[1].matchAll(/<tr>([\s\S]*?)<\/tr>/gi)]
    .map((row) => [...row[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((c) => c[1]))
    .filter((cells) => cells.length >= 5)
    .map((cells) => ({
      hs2: strip(cells[1]),
      desc: strip(cells[2]),
      value_usd_mn: num(cells[4]), // columns: idx, HS code, description, previous FY, current FY, growth %
    }))
    .filter((r) => /^\d{2}$/.test(r.hs2));
}

async function main() {
  const countrySrc = JSON.parse(await fs.readFile(COUNTRY_SOURCE, 'utf8'));
  const targets = [...countrySrc.latest_rows]
    .sort((a, b) => b.total_trade_usd_mn - a.total_trade_usd_mn)
    .slice(0, TOP_PARTNERS)
    .map((r) => r.country);

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'eidb-partner-'));
  const cookieFile = path.join(tempDir, 'cookies.txt');

  const partners = new Map(targets.map((c) => [c, { country: c }]));
  let fiscalYear = null;

  for (const [side, cfg] of Object.entries(SIDES)) {
    // Fresh GET per side: collects the form token, year list and country option codes.
    const page = curl(['-c', cookieFile, '-b', cookieFile, cfg.url]);
    let tok = token(page);
    const yearMatch = page.match(new RegExp(`<select[^>]*name="${cfg.fields.year}"[^>]*>([\\s\\S]*?)</select>`, 'i'));
    const years = [...yearMatch[1].matchAll(/<option value="(\d{4})"[^>]*>\s*([\d-]+)/g)];
    const [latestYearValue, latestYearLabel] = [years[0][1], years[0][2]];
    fiscalYear = latestYearLabel;
    const cntMatch = page.match(new RegExp(`<select[^>]*name="${cfg.fields.country}"[^>]*>([\\s\\S]*?)</select>`, 'i'));
    const countryOptions = new Map(
      [...cntMatch[1].matchAll(/<option value="([^"]*)"[^>]*>\s*([^<]*?)\s*</g)].map((m) => [m[2].trim(), m[1]]),
    );

    for (const country of targets) {
      const optionValue = countryOptions.get(country);
      if (!optionValue) {
        console.warn(`! no EIDB option for ${country} on ${side} page — skipped`);
        continue;
      }
      process.stdout.write(`Fetching ${side} chapters for ${country}...\n`);
      const body = new URLSearchParams({
        _token: tok,
        [cfg.fields.year]: latestYearValue,
        [cfg.fields.country]: optionValue,
        [cfg.fields.report]: '2', // US$ million
        [cfg.fields.level]: '2', // HS-2 chapters
      }).toString();
      const html = curl(['-b', cookieFile, '-c', cookieFile, '-X', 'POST', cfg.url, '-d', body]);
      tok = token(html);
      const chapters = parseChapterRows(html, `${country}/${side}`).sort((a, b) => b.value_usd_mn - a.value_usd_mn);
      const total = chapters.reduce((s, r) => s + r.value_usd_mn, 0);
      partners.get(country)[side] = {
        total_usd_mn: Math.round(total * 100) / 100,
        top_chapters: chapters.slice(0, TOP_CHAPTERS),
      };
    }
  }

  const payload = {
    source_update_note: `EIDB country-wise all-commodities pages fetched on ${new Date().toISOString().slice(0, 10)}; HS-2 chapters for FY ${fiscalYear}, US$ million.`,
    source_urls: Object.fromEntries(Object.entries(SIDES).map(([k, v]) => [k, v.url])),
    fiscal_year: fiscalYear,
    partners: [...partners.values()],
  };
  await fs.writeFile(OUT_FILE, `${JSON.stringify(payload, null, 1)}\n`);
  console.log(`Wrote ${OUT_FILE} (${payload.partners.length} partners, FY ${fiscalYear})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
