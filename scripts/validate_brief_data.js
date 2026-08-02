import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const checks = [];

function check(condition, message) {
  if (condition) checks.push(message);
  else failures.push(message);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

/** Returns true when a value is a finite number in [0, 100]. */
function isShare(value) {
  return Number.isFinite(value) && value >= 0 && value <= 100;
}

/** Returns true when a string is non-empty after trimming. */
function nonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/** Returns true when a URL string starts with https://. */
function isHttpsUrl(value) {
  return typeof value === 'string' && value.startsWith('https://');
}

// ---------------------------------------------------------------------------
// 1. india_phone_brand_evidence.json
// ---------------------------------------------------------------------------

const phone = readJson('data/india_phone_brand_evidence.json');

// Top-level structure
check(phone !== null && typeof phone === 'object', 'phone: root is an object');
check(
  phone.marketSnapshot !== null && typeof phone.marketSnapshot === 'object',
  'phone: marketSnapshot is present',
);
check(Array.isArray(phone.brands) && phone.brands.length > 0, 'phone: brands array is non-empty');
check(
  Array.isArray(phone.sectorFacts) && phone.sectorFacts.length > 0,
  'phone: sectorFacts array is non-empty',
);

// marketSnapshot
const ms = phone.marketSnapshot;
check(nonEmpty(ms?.period), 'phone: marketSnapshot.period is non-empty');
check(nonEmpty(ms?.measure), 'phone: marketSnapshot.measure is non-empty');
check(ms?.source !== null && typeof ms?.source === 'object', 'phone: marketSnapshot.source exists');
check(nonEmpty(ms?.source?.label), 'phone: marketSnapshot.source.label is non-empty');
check(isHttpsUrl(ms?.source?.url), 'phone: marketSnapshot.source.url is an HTTPS URL');

// brands
const brandNames = new Set();
for (const b of phone.brands) {
  check(nonEmpty(b.brand), `phone brand "${b.brand}": brand name is non-empty`);
  check(!brandNames.has(b.brand), `phone brand "${b.brand}": name is unique`);
  brandNames.add(b.brand);

  check(isShare(b.share), `phone brand "${b.brand}": share is a finite 0–100 number`);
  check(nonEmpty(b.manufacturing), `phone brand "${b.brand}": manufacturing text is non-empty`);
  check(nonEmpty(b.evidence), `phone brand "${b.brand}": evidence text is non-empty`);

  // source is optional for "Research needed" records – only validate when present
  if (b.source !== undefined) {
    check(
      b.source !== null && typeof b.source === 'object',
      `phone brand "${b.brand}": source is an object when present`,
    );
    check(nonEmpty(b.source.label), `phone brand "${b.brand}": source.label is non-empty`);
    check(isHttpsUrl(b.source.url), `phone brand "${b.brand}": source.url is an HTTPS URL`);
  }
}

// sectorFacts
for (const fact of phone.sectorFacts) {
  check(nonEmpty(fact.value), `phone sectorFact "${fact.label}": value is non-empty`);
  check(nonEmpty(fact.label), `phone sectorFact "${fact.label}": label is non-empty`);
  check(nonEmpty(fact.note), `phone sectorFact "${fact.label}": note is non-empty`);
  if (fact.source !== undefined) {
    check(nonEmpty(fact.source.label), `phone sectorFact "${fact.label}": source.label is non-empty`);
    check(isHttpsUrl(fact.source.url), `phone sectorFact "${fact.label}": source.url is an HTTPS URL`);
  }
}

// ---------------------------------------------------------------------------
// 2. india_mobility_brand_evidence.json
// ---------------------------------------------------------------------------

const mobility = readJson('data/india_mobility_brand_evidence.json');

// Top-level structure
check(mobility !== null && typeof mobility === 'object', 'mobility: root is an object');
check(
  mobility.sources !== null && typeof mobility.sources === 'object',
  'mobility: sources object is present',
);
check(
  Array.isArray(mobility.twoWheelers) && mobility.twoWheelers.length > 0,
  'mobility: twoWheelers array is non-empty',
);
check(
  Array.isArray(mobility.cars) && mobility.cars.length > 0,
  'mobility: cars array is non-empty',
);

// sources – each named source must have a non-empty label and HTTPS URL
for (const [key, src] of Object.entries(mobility.sources)) {
  check(
    src !== null && typeof src === 'object',
    `mobility: sources.${key} is an object`,
  );
  check(nonEmpty(src.label), `mobility: sources.${key}.label is non-empty`);
  check(isHttpsUrl(src.url), `mobility: sources.${key}.url is an HTTPS URL`);
}

// helper to validate a mobility segment (twoWheelers or cars)
function validateMobilitySegment(segment, segmentName) {
  const segBrands = new Set();
  for (const item of segment) {
    check(nonEmpty(item.brand), `mobility ${segmentName} "${item.brand}": brand name is non-empty`);
    check(
      !segBrands.has(item.brand),
      `mobility ${segmentName} "${item.brand}": name is unique within segment`,
    );
    segBrands.add(item.brand);

    check(
      isShare(item.share),
      `mobility ${segmentName} "${item.brand}": share is a finite 0–100 number`,
    );

    // Retail units must be non-negative finite numbers when present
    check(
      Number.isFinite(item.units) && item.units >= 0,
      `mobility ${segmentName} "${item.brand}": units is a non-negative finite number`,
    );
  }
}

validateMobilitySegment(mobility.twoWheelers, 'twoWheelers');
validateMobilitySegment(mobility.cars, 'cars');

// ---------------------------------------------------------------------------
// 3. india_petroleum_crude_country_mix.json
// ---------------------------------------------------------------------------

const petro = readJson('data/india_petroleum_crude_country_mix.json');

// Top-level structure
check(petro !== null && typeof petro === 'object', 'petro: root is an object');
check(nonEmpty(petro.title), 'petro: title is non-empty');
check(
  petro.commodity !== null && typeof petro.commodity === 'object',
  'petro: commodity object is present',
);
check(nonEmpty(petro.commodity?.code), 'petro: commodity.code is non-empty');
check(nonEmpty(petro.commodity?.label), 'petro: commodity.label is non-empty');
check(
  petro.units !== null && typeof petro.units === 'object',
  'petro: units object is present',
);
check(nonEmpty(petro.units?.value), 'petro: units.value label is non-empty');
check(nonEmpty(petro.units?.quantity), 'petro: units.quantity label is non-empty');
check(isHttpsUrl(petro.source), 'petro: source is an HTTPS URL');
check(nonEmpty(petro.note), 'petro: note is non-empty');
check(Array.isArray(petro.series) && petro.series.length > 0, 'petro: series array is non-empty');

// series entries
for (const entry of petro.series) {
  const fy = entry.fiscalYear;
  check(nonEmpty(fy), `petro series "${fy}": fiscalYear is non-empty`);
  check(
    Number.isFinite(entry.yearEnding) && Number.isInteger(entry.yearEnding),
    `petro series "${fy}": yearEnding is an integer`,
  );
  check(
    typeof entry.provisional === 'boolean',
    `petro series "${fy}": provisional is a boolean`,
  );
  check(
    Number.isFinite(entry.totalUsdMillion) && entry.totalUsdMillion > 0,
    `petro series "${fy}": totalUsdMillion is positive finite`,
  );
  check(
    Array.isArray(entry.countries) && entry.countries.length > 0,
    `petro series "${fy}": countries array is non-empty`,
  );

  const countryNames = new Set();
  for (const c of entry.countries) {
    check(
      nonEmpty(c.country),
      `petro series "${fy}" country "${c.country}": country name is non-empty`,
    );
    check(
      !countryNames.has(c.country),
      `petro series "${fy}" country "${c.country}": name is unique within series`,
    );
    countryNames.add(c.country);

    check(
      isShare(c.sharePct),
      `petro series "${fy}" country "${c.country}": sharePct is a finite 0–100 number`,
    );
    check(
      Number.isFinite(c.valueUsdMillion) && c.valueUsdMillion >= 0,
      `petro series "${fy}" country "${c.country}": valueUsdMillion is non-negative finite`,
    );
  }
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

if (failures.length) {
  console.error(`Brief-data validation failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(
  `Brief-data validation passed (${checks.length} assertions across phone, mobility, and petroleum datasets).`,
);
