'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowBack,
  ArrowForward,
  Construction,
  DirectionsCar,
  Factory,
  Flight,
  Home,
  LocalGasStation,
  LocalShipping,
  Science,
  TwoWheeler,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import crudeCountryData from '../../data/india_petroleum_crude_country_mix.json';
import importData from '../../data/india_trade_hs4_world_import_5fy.json';
import exportData from '../../data/india_trade_hs4_world_export_5fy.json';
import Footer from '../components/layout/Footer.js';
import Masthead from '../components/layout/Masthead.js';
import cardSx from '../components/primitives/cardSx.js';
import { C, fontDisplay, mono } from '../theme.js';

const YEARS = ['2021-22', '2022-23', '2023-24', '2024-25', '2025-26'];
const latestYear = YEARS.at(-1);
const latestTotalImports = 774.97819;
const latestConsumptionTotal = 241.6;

const COUNTRY_NAMES = {
  'SAUDI ARAB': 'Saudi Arabia',
  'U ARAB EMTS': 'United Arab Emirates',
  'U S A': 'United States',
  IRAQ: 'Iraq',
  RUSSIA: 'Russia',
  NIGERIA: 'Nigeria',
  KUWAIT: 'Kuwait',
  ANGOLA: 'Angola',
  BRAZIL: 'Brazil',
};

const importLines = [
  { code: '2709', label: 'Crude oil', color: '#374151' },
  { code: '2711', label: 'Petroleum gas, including LNG & LPG', color: '#5b6f77' },
  { code: '2710', label: 'Refined petroleum products', color: '#7b6f65' },
  { code: '2713', label: 'Petroleum coke, bitumen & residues', color: '#8b7b5f' },
  { code: '2712', label: 'Petroleum jelly, waxes & related products', color: '#9b9588' },
];

const consumption = [
  { label: 'Diesel', value: 94.7, use: 'Freight, buses, farming and industry' },
  { label: 'Petrol', value: 42.6, use: 'Two-wheelers, cars and utility vehicles' },
  { label: 'LPG', value: 33.2, use: 'Homes, commercial kitchens and industry' },
  { label: 'Pet coke', value: 18.4, use: 'Cement and energy-intensive industry' },
  { label: 'Naphtha', value: 11.7, use: 'Petrochemicals and fertiliser feedstock' },
  {
    label: 'Remaining',
    value: 23.1,
    use: 'Derived remainder: fuel oil, lubes, LDO, kerosene and others',
  },
  { label: 'Aviation fuel', value: 9.2, use: 'Passenger and cargo aviation' },
  { label: 'Bitumen', value: 8.7, use: 'Roads and construction' },
].map((item) => ({
  ...item,
  share: (item.value / latestConsumptionTotal) * 100,
}));

const petrolFacts = [
  { value: '42.6 MMT', label: 'Petrol consumed', note: 'FY2025–26' },
  { value: '17.6%', label: 'Share of petroleum use', note: 'by mass' },
  { value: '+6.5%', label: 'Annual consumption growth', note: 'from 40.0 MMT' },
  { value: '20%', label: 'Ethanol blending', note: 'FY2025–26' },
];

const vehicleMix = [
  { label: 'Two-wheelers', value: 58, color: C.blue, icon: TwoWheeler },
  { label: 'Cars', value: 31, color: C.teal, icon: DirectionsCar },
  { label: 'Utility vehicles', value: 10, color: C.orange, icon: LocalShipping },
  { label: 'Three-wheelers', value: 1, color: C.purple, icon: LocalGasStation },
];

const uses = [
  { name: 'Road transport', detail: 'Petrol and diesel', icon: DirectionsCar },
  { name: 'Aviation', detail: 'ATF / jet fuel', icon: Flight },
  { name: 'Homes & kitchens', detail: 'LPG', icon: Home },
  { name: 'Petrochemicals', detail: 'Naphtha and LPG feedstocks', icon: Science },
  { name: 'Industry', detail: 'Diesel, fuel oil and petcoke', icon: Factory },
  { name: 'Road building', detail: 'Bitumen', icon: Construction },
];

function valueFor(rows, code, year = latestYear) {
  const row = rows.find((item) => item.HSCODE === code);
  return Number(row?.[`VAL_USD_${year}`] || 0) / 1000;
}

const petroleumImports = importLines.map((item) => ({
  ...item,
  value: valueFor(importData, item.code),
}));
const petroleumImportTotal = petroleumImports.reduce((sum, item) => sum + item.value, 0);
const crudeImports = petroleumImports[0].value;
const refinedExports = valueFor(exportData, '2710');

const supplierColors = [C.orange, C.blueDeep, C.teal, C.purple, '#7b6f65'];

function formatUsd(value, digits = 1) {
  return `$${value.toFixed(digits)}bn`;
}

function Stat({ value, label, note }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ ...mono, color: '#fff', fontSize: { xs: 23, md: 28 }, fontWeight: 700 }}>
        {value}
      </Typography>
      <Typography
        sx={{ mt: 0.35, color: 'rgba(255,255,255,0.78)', fontSize: 12.5, fontWeight: 700 }}
      >
        {label}
      </Typography>
      <Typography sx={{ mt: 0.2, color: 'rgba(255,255,255,0.5)', fontSize: 11.5 }}>
        {note}
      </Typography>
    </Box>
  );
}

function SectionHeading({ eyebrow, title, body }) {
  return (
    <Box sx={{ maxWidth: 760, mb: { xs: 2.5, md: 3 } }}>
      <Typography variant="overline" sx={{ color: C.orange }}>
        {eyebrow}
      </Typography>
      <Typography component="h2" variant="h4" sx={{ mt: 0.3 }}>
        {title}
      </Typography>
      {body && (
        <Typography sx={{ mt: 0.8, color: 'text.secondary', fontSize: 14, lineHeight: 1.7 }}>
          {body}
        </Typography>
      )}
    </Box>
  );
}

function SupplierTrendChart({ metric, countryCodes }) {
  const shareKey = metric === 'value' ? 'sharePct' : 'quantitySharePct';
  const width = 720;
  const height = 270;
  const margin = { top: 18, right: 18, bottom: 38, left: 42 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const x = (index) => margin.left + (index / (crudeCountryData.series.length - 1)) * innerWidth;
  const y = (share) => margin.top + innerHeight - (Math.min(40, share) / 40) * innerHeight;

  return (
    <Box>
      <Box
        component="svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Five-year crude supplier ${metric} share trend`}
        sx={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {[0, 10, 20, 30, 40].map((tick) => (
          <g key={tick}>
            <line
              x1={margin.left}
              x2={width - margin.right}
              y1={y(tick)}
              y2={y(tick)}
              stroke="#dedbd3"
              strokeWidth="1"
            />
            <text
              x={margin.left - 9}
              y={y(tick) + 4}
              textAnchor="end"
              fill="#7a8290"
              fontSize="11"
              fontFamily="IBM Plex Mono, monospace"
            >
              {tick}%
            </text>
          </g>
        ))}
        {countryCodes.map((country, countryIndex) => {
          const points = crudeCountryData.series.map((year, index) => {
            const row = year.countries.find((item) => item.country === country);
            return [x(index), y(row?.[shareKey] || 0)];
          });
          const path = points
            .map(([px, py], index) => `${index ? 'L' : 'M'} ${px} ${py}`)
            .join(' ');
          return (
            <g key={country}>
              <path
                d={path}
                fill="none"
                stroke={supplierColors[countryIndex]}
                strokeWidth={country === 'RUSSIA' ? 3.5 : 2.25}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map(([px, py], index) => (
                <circle
                  key={`${country}-${index}`}
                  cx={px}
                  cy={py}
                  r={country === 'RUSSIA' ? 4 : 3}
                  fill="#fffdf9"
                  stroke={supplierColors[countryIndex]}
                  strokeWidth="2"
                />
              ))}
            </g>
          );
        })}
        {crudeCountryData.series.map((year, index) => (
          <text
            key={year.fiscalYear}
            x={x(index)}
            y={height - 12}
            textAnchor="middle"
            fill="#687283"
            fontSize="11"
            fontFamily="IBM Plex Mono, monospace"
          >
            {year.fiscalYear.replace('FY', 'FY')}
          </text>
        ))}
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 0.5 }}>
        {countryCodes.map((country, index) => (
          <Box key={country} sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
            <Box sx={{ width: 13, height: 3, borderRadius: 99, bgcolor: supplierColors[index] }} />
            <Typography sx={{ fontSize: 11.5, fontWeight: 700 }}>
              {COUNTRY_NAMES[country] || country}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function CountryShift() {
  const [metric, setMetric] = useState('value');
  const shareKey = metric === 'value' ? 'sharePct' : 'quantitySharePct';
  const rankKey = metric === 'value' ? 'valueUsdMillion' : 'quantityTons';
  const latest = crudeCountryData.series.at(-1);
  const start = crudeCountryData.series[0];
  const countryRows = useMemo(() => {
    const startCountries = new Map(start.countries.map((item) => [item.country, item]));
    return [...latest.countries]
      .sort((a, b) => b[rankKey] - a[rankKey])
      .slice(0, 7)
      .map((item) => ({
        ...item,
        label: COUNTRY_NAMES[item.country] || item.country,
        startShare: startCountries.get(item.country)?.[shareKey] || 0,
        change: item[shareKey] - (startCountries.get(item.country)?.[shareKey] || 0),
      }));
  }, [latest.countries, rankKey, shareKey, start.countries]);
  const countryCodes = countryRows.slice(0, 5).map((item) => item.country);
  const concentration = crudeCountryData.series.map((year) => ({
    fiscalYear: year.fiscalYear,
    share: [...year.countries]
      .sort((a, b) => b[rankKey] - a[rankKey])
      .slice(0, 3)
      .reduce((sum, item) => sum + item[shareKey], 0),
  }));
  const peakConcentration = concentration.reduce((peak, item) =>
    item.share > peak.share ? item : peak,
  );
  const latestTop3 = concentration.at(-1).share;
  const latestTotal =
    metric === 'value'
      ? formatUsd(latest.totalUsdMillion / 1000)
      : `${(latest.totalQuantityTons / 1_000_000).toFixed(1)} MMT`;
  const latestUnitValue = (latest.totalUsdMillion * 1_000_000) / latest.totalQuantityTons;

  return (
    <Paper sx={{ ...cardSx, overflow: 'hidden' }}>
      <Box
        sx={{
          mb: 2.5,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 800 }}>Share of crude imports</Typography>
          <Typography sx={{ mt: 0.2, fontSize: 11.5, color: 'text.secondary' }}>
            Switch between customs value and physical tonnes
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={metric}
          exclusive
          size="small"
          aria-label="Supplier share metric"
          onChange={(_, next) => next && setMetric(next)}
          sx={{ '& .MuiToggleButton-root': { px: 1.6, py: 0.55, fontSize: 11.5, fontWeight: 800 } }}
        >
          <ToggleButton value="value">Value share</ToggleButton>
          <ToggleButton value="volume">Volume share</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <SupplierTrendChart metric={metric} countryCodes={countryCodes} />
      <Divider sx={{ my: 2.5 }} />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.5fr) minmax(260px, .75fr)' },
          gap: { xs: 3, lg: 5 },
        }}
      >
        <Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'minmax(105px, 1fr) 58px 58px 62px',
              gap: 1,
              pb: 1,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: 10 }}>
              Supplier
            </Typography>
            <Typography
              variant="overline"
              sx={{ color: 'text.secondary', fontSize: 10, textAlign: 'right' }}
            >
              FY22
            </Typography>
            <Typography
              variant="overline"
              sx={{ color: 'text.secondary', fontSize: 10, textAlign: 'right' }}
            >
              FY26
            </Typography>
            <Typography
              variant="overline"
              sx={{ color: 'text.secondary', fontSize: 10, textAlign: 'right' }}
            >
              Change
            </Typography>
          </Box>
          {countryRows.map((row) => (
            <Box
              key={row.country}
              sx={{
                display: 'grid',
                gridTemplateColumns: 'minmax(105px, 1fr) 58px 58px 62px',
                gap: 1,
                py: 1.25,
                alignItems: 'center',
                borderBottom: '1px solid',
                borderColor: '#ece9e1',
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 800 }}>{row.label}</Typography>
                <Box
                  sx={{
                    mt: 0.6,
                    height: 4,
                    bgcolor: '#e7e3da',
                    borderRadius: 99,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${Math.min(100, row[shareKey] * 2.5)}%`,
                      bgcolor: row.country === 'RUSSIA' ? C.orange : C.blueDeep,
                    }}
                  />
                </Box>
              </Box>
              <Typography
                sx={{ ...mono, fontSize: 12, textAlign: 'right', color: 'text.secondary' }}
              >
                {row.startShare.toFixed(1)}%
              </Typography>
              <Typography sx={{ ...mono, fontSize: 12.5, textAlign: 'right', fontWeight: 700 }}>
                {row[shareKey].toFixed(1)}%
              </Typography>
              <Typography
                sx={{
                  ...mono,
                  fontSize: 12,
                  textAlign: 'right',
                  color: row.change > 0 ? C.teal : C.red,
                }}
              >
                {row.change > 0 ? '+' : ''}
                {row.change.toFixed(1)}pp
              </Typography>
            </Box>
          ))}
        </Box>
        <Box
          sx={{ p: { xs: 2, md: 2.5 }, bgcolor: '#f1eee6', borderRadius: 1.5, alignSelf: 'start' }}
        >
          <Typography variant="overline" sx={{ color: C.orange }}>
            What changed
          </Typography>
          <Typography variant="h5" sx={{ mt: 0.5 }}>
            Russia went from 9th to 1st—but its share has eased from the peak.
          </Typography>
          <Typography sx={{ mt: 1.2, color: 'text.secondary', fontSize: 13.5, lineHeight: 1.7 }}>
            Russia reached {metric === 'value' ? '35.2%' : '35.8%'} in FY2024–25, then moved to{' '}
            {countryRows.find((item) => item.country === 'RUSSIA')?.[shareKey].toFixed(1)}% in the
            latest year. Iraq and Saudi Arabia remain major suppliers.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3,1fr)' },
              gap: 1.5,
            }}
          >
            <Box>
              <Typography sx={{ ...mono, fontSize: 19, fontWeight: 700 }}>{latestTotal}</Typography>
              <Typography sx={{ fontSize: 10.8, color: 'text.secondary' }}>latest total</Typography>
            </Box>
            <Box>
              <Typography sx={{ ...mono, fontSize: 19, fontWeight: 700 }}>
                {latestTop3.toFixed(1)}%
              </Typography>
              <Typography sx={{ fontSize: 10.8, color: 'text.secondary' }}>
                top-three share
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ ...mono, fontSize: 19, fontWeight: 700 }}>
                ${latestUnitValue.toFixed(0)}/t
              </Typography>
              <Typography sx={{ fontSize: 10.8, color: 'text.secondary' }}>
                average customs value
              </Typography>
            </Box>
          </Box>
          <Typography sx={{ mt: 0.5, color: 'text.secondary', fontSize: 12.5, lineHeight: 1.6 }}>
            Top-three concentration peaked at {peakConcentration.share.toFixed(1)}% in{' '}
            {peakConcentration.fiscalYear}. Value and volume shares differ because crude grades and
            prices differ by supplier.
          </Typography>
          <Typography sx={{ mt: 1, color: 'text.secondary', fontSize: 12.5, lineHeight: 1.6 }}>
            In FY2025–26 customs volume rose 6.3%, while value fell 5.8%. The average unit value
            dropped about 11.4%, showing why the bill can fall even when imported tonnes rise.
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

function ImportMix() {
  const max = Math.max(...petroleumImports.map((item) => item.value));
  return (
    <Paper sx={cardSx}>
      <Stack spacing={1.75}>
        {petroleumImports.map((item) => (
          <Box key={item.code}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 800 }}>{item.label}</Typography>
                <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>
                  HS {item.code}
                </Typography>
              </Box>
              <Typography sx={{ ...mono, flexShrink: 0, fontSize: 13, fontWeight: 700 }}>
                {formatUsd(item.value)}
              </Typography>
            </Box>
            <Box
              sx={{ mt: 0.7, height: 8, bgcolor: '#e9e5dc', borderRadius: 99, overflow: 'hidden' }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: `${Math.max(1, (item.value / max) * 100)}%`,
                  bgcolor: item.color,
                  borderRadius: 99,
                }}
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

function DefinitionNote() {
  return (
    <Paper sx={{ ...cardSx, mt: 2, bgcolor: '#f7f4ed' }}>
      <Typography variant="overline" sx={{ color: C.teal }}>
        Why two official totals can differ
      </Typography>
      <Box
        sx={{
          mt: 1,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 2, md: 4 },
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 800 }}>Customs trade lens</Typography>
          <Typography sx={{ ...mono, mt: 0.5, fontSize: 17, fontWeight: 700 }}>
            $134.7bn · 259.8 MMT
          </Typography>
          <Typography sx={{ mt: 0.55, color: 'text.secondary', fontSize: 12.2, lineHeight: 1.6 }}>
            TradeStat’s HS 2709 declarations. This is the consistent source for supplier shares and
            merchandise-trade comparisons on this page.
          </Typography>
        </Box>
        <Box
          sx={{ borderLeft: { md: '1px solid' }, borderColor: { md: 'divider' }, pl: { md: 4 } }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 800 }}>Energy-sector lens</Typography>
          <Typography sx={{ ...mono, mt: 0.5, fontSize: 17, fontWeight: 700 }}>
            $121.8bn · 245.3 MMT
          </Typography>
          <Typography sx={{ mt: 0.55, color: 'text.secondary', fontSize: 12.2, lineHeight: 1.6 }}>
            PPAC’s crude-import series. It is used for refinery, consumption and dependency
            indicators. Coverage, timing and valuation differ, so the two series should not be
            silently combined.
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

function RefineryFlow() {
  const systemScale = [
    { value: '28.0 MMT', label: 'Domestic crude production' },
    { value: '245.3 MMT', label: 'Crude imported' },
    { value: '272.1 MMT', label: 'Crude processed' },
    { value: '284.9 MMT', label: 'Petroleum products produced' },
    { value: '61.5 MMT', label: 'Petroleum products exported' },
  ];
  return (
    <Paper sx={{ ...cardSx, bgcolor: '#f7f4ed' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'minmax(170px,.7fr) 40px minmax(180px,.8fr) 40px 1.7fr',
          },
          gap: 1.5,
          alignItems: 'center',
        }}
      >
        <Box sx={{ p: 2, bgcolor: C.ink, color: '#fff', borderRadius: 1.5 }}>
          <LocalShipping sx={{ fontSize: 25, color: '#c8d2dc' }} />
          <Typography variant="h6" sx={{ mt: 1 }}>
            Imported crude
          </Typography>
          <Typography sx={{ mt: 0.5, color: 'rgba(255,255,255,.62)', fontSize: 12.5 }}>
            A raw input, not pump-ready petrol
          </Typography>
        </Box>
        <ArrowForward
          sx={{
            color: 'text.secondary',
            justifySelf: 'center',
            transform: { xs: 'rotate(90deg)', md: 'none' },
          }}
        />
        <Box sx={{ p: 2, bgcolor: '#e7e1d6', border: '1px solid #d3cdc1', borderRadius: 1.5 }}>
          <Factory sx={{ fontSize: 25, color: C.orange }} />
          <Typography variant="h6" sx={{ mt: 1 }}>
            Indian refineries
          </Typography>
          <Typography sx={{ mt: 0.5, color: 'text.secondary', fontSize: 12.5 }}>
            Separate and convert crude into many products
          </Typography>
        </Box>
        <ArrowForward
          sx={{
            color: 'text.secondary',
            justifySelf: 'center',
            transform: { xs: 'rotate(90deg)', md: 'none' },
          }}
        />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3,1fr)' },
            gap: 1,
          }}
        >
          {uses.map(({ name, detail, icon: Icon }) => (
            <Box
              key={name}
              sx={{
                p: 1.3,
                minHeight: 92,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1.25,
              }}
            >
              <Icon sx={{ fontSize: 19, color: C.blueDeep }} />
              <Typography sx={{ mt: 0.5, fontSize: 12, fontWeight: 800 }}>{name}</Typography>
              <Typography
                sx={{ mt: 0.2, fontSize: 10.8, color: 'text.secondary', lineHeight: 1.4 }}
              >
                {detail}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          mt: 2.5,
          pt: 2.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(5,1fr)' },
          gap: 2,
        }}
      >
        {systemScale.map((item) => (
          <Box key={item.label}>
            <Typography sx={{ ...mono, fontSize: 17, fontWeight: 700 }}>{item.value}</Typography>
            <Typography sx={{ mt: 0.3, color: 'text.secondary', fontSize: 10.8, lineHeight: 1.45 }}>
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
      <Typography sx={{ mt: 1.5, color: 'text.secondary', fontSize: 10.8, lineHeight: 1.5 }}>
        FY2025–26 · PPAC. These indicators describe system scale, not a closed mass balance;
        inventories, refinery gains, feedstocks and product categories differ.
      </Typography>
    </Paper>
  );
}

function ConsumptionMix() {
  return (
    <Paper sx={cardSx}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.1fr .9fr' },
          gap: { xs: 3, md: 5 },
        }}
      >
        <Box>
          {consumption.map((item) => (
            <Box
              key={item.label}
              sx={{
                display: 'grid',
                gridTemplateColumns: '92px minmax(0,1fr) 62px',
                gap: 1.25,
                py: 1.15,
                alignItems: 'center',
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 800 }}>{item.label}</Typography>
              <Box>
                <Box sx={{ height: 8, bgcolor: '#e7e3da', borderRadius: 99, overflow: 'hidden' }}>
                  <Box
                    sx={{
                      width: `${item.share * 2.4}%`,
                      maxWidth: '100%',
                      height: '100%',
                      bgcolor:
                        item.label === 'Diesel'
                          ? C.blueDeep
                          : item.label === 'Petrol'
                            ? C.orange
                            : '#7b8079',
                      borderRadius: 99,
                    }}
                  />
                </Box>
                <Typography sx={{ mt: 0.55, fontSize: 11.3, color: 'text.secondary' }}>
                  {item.use}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography sx={{ ...mono, fontSize: 12.5, fontWeight: 700 }}>
                  {item.share.toFixed(1)}%
                </Typography>
                <Typography sx={{ ...mono, fontSize: 10.5, color: 'text.secondary' }}>
                  {item.value} MMT
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box
          sx={{ borderLeft: { md: '1px solid' }, borderColor: { md: 'divider' }, pl: { md: 4 } }}
        >
          <Typography variant="overline" sx={{ color: C.teal }}>
            The important reading
          </Typography>
          <Typography variant="h5" sx={{ mt: 0.4 }}>
            Petrol is only one-sixth of domestic petroleum use.
          </Typography>
          <Typography sx={{ mt: 1, color: 'text.secondary', fontSize: 13.5, lineHeight: 1.7 }}>
            Diesel is more than twice as large as petrol by mass. Petroleum coke and naphtha also
            make industry a major end user, while LPG, aviation fuel and bitumen connect the oil
            system to homes, travel and infrastructure.
          </Typography>
          <Typography sx={{ mt: 1.5, color: 'text.secondary', fontSize: 11.5 }}>
            FY2025–26 · 241.6 MMT total consumption · complete distribution grouped to avoid an
            unexplained remainder
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

function PetrolFacts() {
  return (
    <Paper sx={{ ...cardSx, bgcolor: '#ece7dc' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4,1fr)' },
          gap: { xs: 2, md: 3 },
        }}
      >
        {petrolFacts.map((item, index) => (
          <Box
            key={item.label}
            sx={{
              minWidth: 0,
              pl: { md: index ? 3 : 0 },
              borderLeft: { md: index ? '1px solid #d2cbbf' : 0 },
            }}
          >
            <Typography sx={{ ...mono, fontSize: { xs: 20, md: 24 }, fontWeight: 700 }}>
              {item.value}
            </Typography>
            <Typography sx={{ mt: 0.4, fontSize: 12.5, fontWeight: 800 }}>{item.label}</Typography>
            <Typography sx={{ mt: 0.2, fontSize: 11, color: 'text.secondary' }}>
              {item.note}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

function VehicleUse() {
  return (
    <Paper sx={cardSx}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.25fr .75fr' },
          gap: { xs: 3, lg: 5 },
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            Who used petrol in the 2021 retail-outlet survey
          </Typography>
          <Box
            sx={{ display: 'flex', height: 42, overflow: 'hidden', borderRadius: 1 }}
            aria-label="Petrol sales by vehicle type: two-wheelers 58%, cars 31%, utility vehicles 10%, three-wheelers 1%"
          >
            {vehicleMix.map((item) => (
              <Box
                key={item.label}
                sx={{
                  width: `${item.value}%`,
                  minWidth: item.value === 1 ? 5 : 0,
                  bgcolor: item.color,
                }}
              />
            ))}
          </Box>
          <Box
            sx={{
              mt: 2,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4,1fr)' },
              gap: 1.5,
            }}
          >
            {vehicleMix.map(({ label, value, color, icon: Icon }) => (
              <Box key={label}>
                <Icon sx={{ fontSize: 21, color }} />
                <Typography sx={{ ...mono, mt: 0.45, fontSize: 20, fontWeight: 700 }}>
                  {value}%
                </Typography>
                <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>{label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={{ p: 2, bgcolor: '#f1eee6', borderRadius: 1.5 }}>
          <Typography sx={{ fontSize: 12.5, fontWeight: 800 }}>
            A benchmark, not a live counter
          </Typography>
          <Typography sx={{ mt: 0.6, color: 'text.secondary', fontSize: 12.5, lineHeight: 1.65 }}>
            These shares come from PPAC’s July–September 2021 retail-outlet survey. They describe
            petrol sold by vehicle type; customs data cannot trace imported crude to a specific
            vehicle. The survey also followed pandemic restrictions, so it should not be treated as
            a current vehicle census.
          </Typography>
          <Typography sx={{ mt: 1.25, color: 'text.secondary', fontSize: 12.5, lineHeight: 1.65 }}>
            The same study found 89% of diesel retail sales went to transport; trucks used 69% of
            that transport diesel.
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

function Sources() {
  const linkSx = {
    color: 'text.primary',
    fontWeight: 700,
    textDecoration: 'underline',
    textUnderlineOffset: 3,
    textDecorationColor: '#b8b0a1',
  };
  return (
    <Box component="section" sx={{ pt: 1 }}>
      <Typography variant="h5">Sources &amp; method</Typography>
      <Typography
        sx={{ mt: 1, maxWidth: 880, color: 'text.secondary', fontSize: 12.5, lineHeight: 1.75 }}
      >
        Import values and source-country shares are from the Ministry of Commerce &amp; Industry’s{' '}
        <Box
          component="a"
          href="https://tradestat.commerce.gov.in/ftspcc/import_commodity_wise_all_countries"
          target="_blank"
          rel="noreferrer"
          sx={linkSx}
        >
          TradeStat commodity-wise country table
        </Box>
        . Product consumption, crude import dependence and gross petroleum trade come from the
        Petroleum Planning &amp; Analysis Cell’s{' '}
        <Box
          component="a"
          href="https://ppac.gov.in/download.php?file=rep_studies/1784287517_Snapshot_of_India_Oil_and_Gas_June_2026_A5.pdf"
          target="_blank"
          rel="noreferrer"
          sx={linkSx}
        >
          June 2026 oil and gas snapshot
        </Box>
        . Vehicle-use shares are from PPAC’s{' '}
        <Box
          component="a"
          href="https://ppac.gov.in/download.php?file=whatsnew%2F1715159464_All-India-study-on-sectoral-demand-for-petrol-and-diesel-along-with-2013-study.pdf"
          target="_blank"
          rel="noreferrer"
          sx={linkSx}
        >
          all-India sectoral demand study
        </Box>
        .
      </Typography>
      <Typography
        sx={{ mt: 1, maxWidth: 880, color: 'text.secondary', fontSize: 11.5, lineHeight: 1.65 }}
      >
        Country shares use TradeStat’s principal commodity “Petroleum: crude”. Value shares are
        reported by TradeStat; volume shares and unit values are derived from its tonnes series.
        Product mix uses HS-4 customs lines. PPAC figures describe the energy system and are kept
        separate from customs totals. MMT means million metric tonnes; percentage-point changes may
        differ slightly due to rounding.
      </Typography>
      <Typography sx={{ mt: 1, color: 'text.secondary', fontSize: 11.5 }}>
        Freshness: TradeStat retrieved 1 August 2026 · PPAC energy data through FY2025–26 and June
        2026 · vehicle-use benchmark surveyed July–September 2021.
      </Typography>
    </Box>
  );
}

export default function PetroleumBrief() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Masthead />
      <Box component="main">
        <Box sx={{ bgcolor: C.ink, color: '#fff', borderTop: '1px solid rgba(255,255,255,.06)' }}>
          <Container maxWidth="xl" sx={{ pt: { xs: 3, md: 5 }, pb: { xs: 4, md: 6 } }}>
            <Button
              component={Link}
              href="/"
              startIcon={<ArrowBack />}
              size="small"
              sx={{
                color: 'rgba(255,255,255,.68)',
                px: 0,
                '&:hover': { bgcolor: 'transparent', color: '#fff' },
              }}
            >
              Back to trade monitor
            </Button>
            <Box
              sx={{
                mt: { xs: 3, md: 5 },
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: 'minmax(0,1.3fr) minmax(300px,.7fr)' },
                gap: { xs: 4, lg: 7 },
                alignItems: 'end',
              }}
            >
              <Box>
                <Typography variant="overline" sx={{ color: '#d0a77f' }}>
                  Energy dependency · data brief
                </Typography>
                <Typography
                  component="h1"
                  sx={{
                    mt: 0.8,
                    fontFamily: fontDisplay,
                    fontWeight: 750,
                    fontSize: { xs: '2.5rem', sm: '3.5rem', lg: '4.45rem' },
                    letterSpacing: '-0.035em',
                    lineHeight: 0.98,
                    maxWidth: 830,
                  }}
                >
                  India’s petroleum import bill, explained.
                </Typography>
                <Typography
                  sx={{
                    mt: 2,
                    maxWidth: 720,
                    color: 'rgba(255,255,255,.68)',
                    fontSize: { xs: 15, md: 17 },
                    lineHeight: 1.7,
                  }}
                >
                  Where the crude comes from, how supplier shares changed, what refineries turn it
                  into—and how much really goes into cars and two-wheelers.
                </Typography>
              </Box>
              <Box
                sx={{
                  p: { xs: 2, md: 2.5 },
                  border: '1px solid rgba(255,255,255,.13)',
                  bgcolor: 'rgba(255,255,255,.035)',
                  borderRadius: 1.5,
                }}
              >
                <Typography
                  sx={{
                    color: '#d0a77f',
                    fontSize: 12,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '.08em',
                  }}
                >
                  First, the naming
                </Typography>
                <Typography
                  sx={{
                    mt: 1,
                    fontFamily: fontDisplay,
                    fontSize: 23,
                    lineHeight: 1.25,
                    fontWeight: 650,
                  }}
                >
                  “Petrol imports” is usually shorthand for a much broader oil story.
                </Typography>
                <Typography
                  sx={{ mt: 1, color: 'rgba(255,255,255,.62)', fontSize: 13, lineHeight: 1.65 }}
                >
                  India principally imports crude oil, then refines it into petrol, diesel, aviation
                  fuel, LPG feedstocks, bitumen and other products.
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                mt: { xs: 4, md: 5 },
                pt: { xs: 3, md: 4 },
                borderTop: '1px solid rgba(255,255,255,.12)',
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4,1fr)' },
                gap: { xs: 3, md: 4 },
              }}
            >
              <Stat
                value={formatUsd(crudeImports)}
                label="Crude imports"
                note="FY2025–26 · customs value"
              />
              <Stat
                value={`${((crudeImports / latestTotalImports) * 100).toFixed(1)}%`}
                label="Share of all imports"
                note="FY2025–26 · customs value"
              />
              <Stat value="88.7%" label="Crude import dependence" note="FY2025–26 · PPAC" />
              <Stat
                value={formatUsd(refinedExports)}
                label="Refined-product exports"
                note="FY2025–26 · HS 2710 customs value"
              />
            </Box>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 7 } }}>
          <Stack spacing={{ xs: 5.5, md: 8 }}>
            <Box component="section">
              <SectionHeading
                eyebrow="Supplier shift"
                title="Where India buys its crude"
                body="Follow every year in the five-year transition, then switch between dollar exposure and physical tonnes to separate price effects from sourcing changes."
              />
              <CountryShift />
            </Box>

            <Box component="section">
              <SectionHeading
                eyebrow="Import basket"
                title="Crude dominates—but it is not the entire bill"
                body={`The five main petroleum customs lines total about ${formatUsd(petroleumImportTotal)} in FY2025–26, or ${((petroleumImportTotal / latestTotalImports) * 100).toFixed(1)}% of all merchandise imports.`}
              />
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', lg: 'minmax(0,1.15fr) minmax(280px,.85fr)' },
                  gap: 2,
                }}
              >
                <ImportMix />
                <Paper
                  sx={{
                    ...cardSx,
                    bgcolor: '#ece7dc',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="overline" sx={{ color: C.orange }}>
                      The accounting trap
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ mt: 0.6, fontSize: { xs: '1.75rem', md: '2.15rem' } }}
                    >
                      Imports are inputs. Consumption is the end use.
                    </Typography>
                    <Typography
                      sx={{ mt: 1.2, color: 'text.secondary', fontSize: 13.5, lineHeight: 1.75 }}
                    >
                      A dollar of imported crude can become fuel sold in India, feedstock for
                      industry, or a refined product exported abroad. Those are different questions
                      and need different datasets.
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #d2cbbf' }}>
                    <Typography sx={{ ...mono, fontSize: 27, fontWeight: 700 }}>
                      {formatUsd(refinedExports)}
                    </Typography>
                    <Typography sx={{ mt: 0.35, fontSize: 12, color: 'text.secondary' }}>
                      refined petroleum exports in FY2025–26
                    </Typography>
                  </Box>
                </Paper>
              </Box>
              <DefinitionNote />
            </Box>

            <Box component="section">
              <SectionHeading
                eyebrow="From barrel to use"
                title="One imported input becomes many domestic products"
                body="The refinery sits between the customs record and the final user. That is why crude-import data cannot directly answer which vehicle consumed it."
              />
              <RefineryFlow />
            </Box>

            <Box component="section">
              <SectionHeading
                eyebrow="Domestic demand"
                title="What petroleum is used for in India"
                body="The complete FY2025–26 distribution spans freight, mobility, cooking, aviation, petrochemicals, heavy industry and infrastructure."
              />
              <ConsumptionMix />
            </Box>

            <Box component="section">
              <SectionHeading
                eyebrow="Petrol deep dive"
                title="Petrol demand is growing—but it is still one part of the oil system"
                body="Current consumption and ethanol-blending data provide the scale. A nationwide retail-outlet survey supplies the vehicle split, with an important timing caveat."
              />
              <Stack spacing={2}>
                <PetrolFacts />
                <VehicleUse />
              </Stack>
            </Box>

            <Box component="section">
              <Paper sx={{ ...cardSx, bgcolor: C.inkSoft, color: '#fff', p: { xs: 2.5, md: 4 } }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1.2fr .8fr' },
                    gap: { xs: 3, md: 6 },
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography variant="overline" sx={{ color: '#d0a77f' }}>
                      Bottom line
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 0.5, color: '#fff' }}>
                      India has a crude-dependence problem, not simply a “petrol import” problem.
                    </Typography>
                    <Typography
                      sx={{
                        mt: 1.2,
                        color: 'rgba(255,255,255,.65)',
                        fontSize: 14,
                        lineHeight: 1.75,
                      }}
                    >
                      The exposure is broad: road transport is important, but so are freight,
                      aviation, household LPG, petrochemicals and construction. Refining capacity
                      turns that imported crude into both domestic energy and export revenue.
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Stat value="30.3%" label="Russia’s latest share" note="up from 2.0% in FY22" />
                    <Stat
                      value="58%"
                      label="Petrol used by 2-wheelers"
                      note="2021 survey benchmark"
                    />
                  </Box>
                </Box>
              </Paper>
            </Box>

            <Sources />
            <Box>
              <Button component={Link} href="/" variant="outlined" startIcon={<ArrowBack />}>
                Return to the trade monitor
              </Button>
            </Box>
          </Stack>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
