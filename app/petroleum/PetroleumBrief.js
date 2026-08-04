'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowBack,
  ArrowForward,
  Construction,
  DirectionsCar,
  ExpandMore,
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
  Slider,
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
import indiaStatePaths from './indiaStatePaths.js';

const YEARS = ['2021-22', '2022-23', '2023-24', '2024-25', '2025-26'];
const latestYear = YEARS.at(-1);
const latestConsumptionTotal = 241.6;
const nationalStateSalesH1Fy25 = 104478.4;

const statePetroleumConsumption = [
  { name: 'Andaman and Nicobar Islands', total: 114.3, perCapita: 282.9 },
  { name: 'Andhra Pradesh', total: 3996.0, perCapita: 74.8 },
  { name: 'Arunachal Pradesh', total: 188.9, perCapita: 119.6 },
  { name: 'Assam', total: 1598.5, perCapita: 44.2 },
  { name: 'Bihar', total: 2920.7, perCapita: 22.6 },
  { name: 'Chandigarh', total: 249.3, perCapita: 199.9 },
  { name: 'Chhattisgarh', total: 2046.2, perCapita: 66.8 },
  {
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    total: 256.4,
    perCapita: 184.8,
  },
  { name: 'Delhi', total: 2352.4, perCapita: 107.5 },
  { name: 'Goa', total: 381.7, perCapita: 240.8 },
  { name: 'Gujarat', total: 12622.0, perCapita: 173.7 },
  { name: 'Haryana', total: 5410.3, perCapita: 176.3 },
  { name: 'Himachal Pradesh', total: 1012.8, perCapita: 134.7 },
  { name: 'Jammu and Kashmir', total: 907.5, perCapita: 66.1 },
  { name: 'Jharkhand', total: 1869.4, perCapita: 46.6 },
  { name: 'Karnataka', total: 7769.2, perCapita: 113.8 },
  { name: 'Kerala', total: 3388.7, perCapita: 94.2 },
  { name: 'Ladakh', total: 159.8, perCapita: 529.0 },
  { name: 'Lakshadweep', total: 11.5, perCapita: 166.4 },
  { name: 'Madhya Pradesh', total: 4413.0, perCapita: 50.2 },
  { name: 'Maharashtra', total: 11067.6, perCapita: 86.7 },
  { name: 'Manipur', total: 120.1, perCapita: 36.8 },
  { name: 'Meghalaya', total: 286.2, perCapita: 84.5 },
  { name: 'Mizoram', total: 100.6, perCapita: 80.4 },
  { name: 'Nagaland', total: 106.5, perCapita: 47.2 },
  { name: 'Odisha', total: 3618.4, perCapita: 77.5 },
  { name: 'Puducherry', total: 439.4, perCapita: 259.3 },
  { name: 'Punjab', total: 3360.4, perCapita: 108.4 },
  { name: 'Rajasthan', total: 5681.0, perCapita: 69.1 },
  { name: 'Sikkim', total: 73.1, perCapita: 104.9 },
  { name: 'Tamil Nadu', total: 7889.8, perCapita: 102.2 },
  { name: 'Telangana', total: 3717.3, perCapita: 97.0 },
  { name: 'Tripura', total: 130.2, perCapita: 31.0 },
  { name: 'Uttar Pradesh', total: 10412.7, perCapita: 43.6 },
  { name: 'Uttarakhand', total: 930.5, perCapita: 78.9 },
  { name: 'West Bengal', total: 4876.1, perCapita: 48.9 },
];

const stateMapNames = {
  'Andaman & Nicobar': 'Andaman and Nicobar Islands',
  'Daman and Diu and Dadra and Nagar Haveli': 'Dadra and Nagar Haveli and Daman and Diu',
  Tamilnadu: 'Tamil Nadu',
  Chhattishgarh: 'Chhattisgarh',
  Telengana: 'Telangana',
};

const stateMapColors = ['#eee7dc', '#dfc7ad', '#c99c75', '#a9673e', '#704025'];

const crudeImportDependence = [
  { year: 'FY17', value: 81.7 },
  { year: 'FY18', value: 82.9 },
  { year: 'FY19', value: 83.7 },
  { year: 'FY20', value: 85.0 },
  { year: 'FY21', value: 84.4 },
  { year: 'FY22', value: 85.5 },
  { year: 'FY23', value: 87.4 },
  { year: 'FY24', value: 87.8 },
  { year: 'FY25', value: 88.2 },
  { year: 'FY26', value: 88.7 },
];

const majorRefineries = [
  { name: 'Reliance · Jamnagar', state: 'Gujarat', capacity: 68.2 },
  { name: 'Nayara · Vadinar', state: 'Gujarat', capacity: 20.0 },
  { name: 'BPCL · Kochi', state: 'Kerala', capacity: 15.5 },
  { name: 'IOC · Panipat', state: 'Haryana', capacity: 15.0 },
  { name: 'IOC · Paradip', state: 'Odisha', capacity: 15.0 },
  { name: 'HPCL · Visakhapatnam', state: 'Andhra Pradesh', capacity: 15.0 },
  { name: 'MRPL · Mangaluru', state: 'Karnataka', capacity: 15.0 },
];

const strategicReserveSites = [
  { name: 'Visakhapatnam', capacity: 1.33 },
  { name: 'Mangaluru', capacity: 1.5 },
  { name: 'Padur', capacity: 2.5 },
];

const stateLabelPositions = {
  'Andaman and Nicobar Islands': [674, 668],
  'Andhra Pradesh': [324, 582],
  'Arunachal Pradesh': [725, 245],
  Assam: [670, 286],
  Bihar: [478, 312],
  Chandigarh: [205, 198],
  Chhattisgarh: [380, 432],
  'Dadra and Nagar Haveli and Daman and Diu': [131, 463],
  Delhi: [265, 237],
  Goa: [160, 594],
  Gujarat: [96, 394],
  Haryana: [225, 216],
  'Himachal Pradesh': [250, 141],
  'Jammu and Kashmir': [185, 93],
  Jharkhand: [476, 367],
  Karnataka: [220, 611],
  Kerala: [227, 727],
  Ladakh: [237, 59],
  Lakshadweep: [136, 786],
  'Madhya Pradesh': [278, 370],
  Maharashtra: [219, 482],
  Manipur: [733, 340],
  Meghalaya: [625, 319],
  Mizoram: [682, 384],
  Nagaland: [743, 306],
  Odisha: [445, 453],
  Puducherry: [327, 739],
  Punjab: [196, 169],
  Rajasthan: [157, 287],
  Sikkim: [556, 260],
  'Tamil Nadu': [281, 711],
  Telangana: [298, 527],
  Tripura: [640, 367],
  'Uttar Pradesh': [340, 278],
  Uttarakhand: [307, 189],
  'West Bengal': [542, 362],
};

const stateLabelCalloutPositions = {
  Chandigarh: [177, 202],
  Delhi: [274, 239],
  Goa: [127, 606],
  Haryana: [218, 226],
  Manipur: [754, 340],
  Meghalaya: [607, 342],
  Mizoram: [726, 390],
  Nagaland: [756, 304],
  Puducherry: [333, 752],
  Punjab: [169, 166],
  Sikkim: [543, 239],
  Tripura: [624, 386],
  Uttarakhand: [329, 188],
  'Dadra and Nagar Haveli and Daman and Diu': [104, 459],
};

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

const COUNTRY_FLAGS = {
  'SAUDI ARAB': '🇸🇦',
  'U ARAB EMTS': '🇦🇪',
  'U S A': '🇺🇸',
  IRAQ: '🇮🇶',
  RUSSIA: '🇷🇺',
  NIGERIA: '🇳🇬',
  KUWAIT: '🇰🇼',
  ANGOLA: '🇦🇴',
  BRAZIL: '🇧🇷',
};

const importLines = [
  { code: '2709', label: 'Crude oil', color: '#374151' },
  { code: '2711', label: 'Petroleum gas, including LNG & LPG', color: '#5b6f77' },
  { code: '2710', label: 'Refined products, including petrol & diesel', color: '#7b6f65' },
  { code: '2701', label: 'Coal', color: '#665b54' },
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

const nationalRetailOutletsFy25 = 96724;

const fuelRetailers = [
  {
    name: 'IndianOil',
    ownership: 'Government of India controlled',
    indianControlled: true,
    outlets: 40221,
    revenue: '₹8.59 lakh cr',
    volume: '85.0 MMT',
    volumeScope: 'Domestic petroleum-product sales',
    color: C.blueDeep,
    source: 'https://iocl.com/download/spreadAnnualReport202425.pdf',
  },
  {
    name: 'HPCL',
    ownership: 'Government of India controlled',
    indianControlled: true,
    outlets: 23747,
    revenue: '₹4.66 lakh cr',
    volume: '30.0 MMT',
    volumeScope: 'Retail sales · petrol 9.8 MMT',
    color: C.orange,
    source: 'https://www.hindustanpetroleum.com/documents/pdf/HPCL-Annual-Report-2024-25.pdf',
  },
  {
    name: 'BPCL',
    ownership: 'Government of India controlled',
    indianControlled: true,
    outlets: 23642,
    revenue: '₹5.00 lakh cr',
    volume: '52.4 MMT',
    volumeScope: 'Market sales · petrol 10.74, diesel 21.56 MMT',
    color: C.teal,
    source: 'https://www.bharatpetroleum.in/bharat-petroleum/pdf/annual-report-2024-25.pdf',
  },
  {
    name: 'Nayara Energy',
    ownership: 'Indian-incorporated · foreign-controlled',
    indianControlled: false,
    outlets: 6683,
    revenue: '₹1.49 lakh cr',
    volume: '8.3 Mn KL',
    volumeScope: 'Petrol and diesel sold through retail outlets',
    color: C.purple,
    source:
      'https://www.nayaraenergy.com/storage/annual-reports/November2025/1CmN7t5vJH0yKEQ1y2Cw.pdf',
  },
  {
    name: 'Jio-bp',
    ownership: 'Indian-controlled JV · RIL 51%',
    indianControlled: true,
    outlets: 1916,
    revenue: 'Not disclosed',
    volume: '6.0 Mn KL',
    volumeScope: 'Petrol and diesel retail sales',
    color: '#58758f',
    source: 'https://www.ril.com/sites/default/files/2025-04/SE_Investor.pdf',
  },
  {
    name: 'Shell India',
    ownership: 'Foreign-controlled',
    indianControlled: false,
    outlets: 325,
    revenue: 'Not disclosed',
    volume: 'Not disclosed',
    volumeScope: 'India retail fuel volume',
    color: '#8b7b5f',
    source: 'https://www.shell.in/about-us/what-we-do/powering-progress-in-india.html',
  },
];

const indianControlledOutletShare =
  (fuelRetailers
    .filter((company) => company.indianControlled)
    .reduce((sum, company) => sum + company.outlets, 0) /
    nationalRetailOutletsFy25) *
  100;

function valueFor(rows, code, year = latestYear) {
  const row = rows.find((item) => item.HSCODE === code);
  return Number(row?.[`VAL_USD_${year}`] || 0) / 1000;
}

const petroleumImports = importLines.map((item) => ({
  ...item,
  value: valueFor(importData, item.code),
}));
const petroleumExports = importLines.map((item) => ({
  ...item,
  value: valueFor(exportData, item.code),
}));
const petroleumImportTotal = petroleumImports.reduce((sum, item) => sum + item.value, 0);
const petroleumExportTotal = petroleumExports.reduce((sum, item) => sum + item.value, 0);
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

function SectionHeading({ eyebrow, title, body, id }) {
  return (
    <Box sx={{ maxWidth: 760, mb: { xs: 2.5, md: 3 } }}>
      <Typography variant="overline" sx={{ color: C.orange }}>
        {eyebrow}
      </Typography>
      <Typography component="h2" id={id} variant="h4" sx={{ mt: 0.3 }}>
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
  const width = 760;
  const height = 270;
  const margin = { top: 18, right: 190, bottom: 38, left: 42 };
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
          const [labelX, labelY] = points.at(-1);
          const latestRow = crudeCountryData.series
            .at(-1)
            .countries.find((item) => item.country === country);
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
              <line
                x1={labelX + 5}
                x2={labelX + 13}
                y1={labelY}
                y2={labelY}
                stroke={supplierColors[countryIndex]}
                strokeWidth="1.5"
              />
              <text
                x={labelX + 17}
                y={labelY + 4}
                fill={supplierColors[countryIndex]}
                fontSize="10.5"
                fontWeight="800"
              >
                {`${COUNTRY_FLAGS[country] || '🌐'} ${COUNTRY_NAMES[country] || country} ${latestRow?.[shareKey].toFixed(1)}%`}
              </text>
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
      {false ? (
        <>
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
              sx={{
                p: { xs: 2, md: 2.5 },
                bgcolor: '#f1eee6',
                borderRadius: 1.5,
                alignSelf: 'start',
              }}
            >
              <Typography variant="overline" sx={{ color: C.orange }}>
                Supplier shift
              </Typography>
              <Typography variant="h5" sx={{ mt: 0.5 }}>
                Russia went from 9th to 1st—but its share has eased from the peak.
              </Typography>
              <Typography
                sx={{ mt: 1.2, color: 'text.secondary', fontSize: 13.5, lineHeight: 1.7 }}
              >
                Russia reached {metric === 'value' ? '35.2%' : '35.8%'} in FY2024–25, then moved to{' '}
                {countryRows.find((item) => item.country === 'RUSSIA')?.[shareKey].toFixed(1)}% in
                the latest year. Iraq and Saudi Arabia remain major suppliers.
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
                  <Typography sx={{ ...mono, fontSize: 19, fontWeight: 700 }}>
                    {latestTotal}
                  </Typography>
                  <Typography sx={{ fontSize: 10.8, color: 'text.secondary' }}>
                    latest total
                  </Typography>
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
              <Typography
                sx={{ mt: 0.5, color: 'text.secondary', fontSize: 12.5, lineHeight: 1.6 }}
              >
                Top-three concentration peaked at {peakConcentration.share.toFixed(1)}% in{' '}
                {peakConcentration.fiscalYear}. Value and volume shares differ because crude grades
                and prices differ by supplier.
              </Typography>
              <Typography sx={{ mt: 1, color: 'text.secondary', fontSize: 12.5, lineHeight: 1.6 }}>
                In FY2025–26 customs volume rose 6.3%, while value fell 5.8%. The average unit value
                dropped about 11.4%, showing why the bill can fall even when imported tonnes rise.
              </Typography>
            </Box>
          </Box>
        </>
      ) : null}
    </Paper>
  );
}

const trendLabels = {
  2709: 'Crude oil',
  2711: 'Gas · LNG / LPG',
  2710: 'Refined fuels',
  2701: 'Coal',
  2713: 'Coke · bitumen · residues',
  2712: 'Waxes · related products',
};

function EnergyTradeLineChart({ side }) {
  const rows = side === 'Imports' ? importData : exportData;
  const series = importLines.map((line) => ({
    ...line,
    values: YEARS.map((year) => valueFor(rows, line.code, year)),
  }));
  const width = 640;
  const height = 310;
  const margin = { top: 28, right: 178, bottom: 42, left: 48 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const maxValue = Math.max(...series.flatMap((line) => line.values)) * 1.12 || 1;
  const x = (index) => margin.left + (index / (YEARS.length - 1)) * innerWidth;
  const y = (value) => margin.top + innerHeight - (value / maxValue) * innerHeight;
  const rawLabels = series
    .map((line) => ({ line, actualY: y(line.values.at(-1)) }))
    .sort((a, b) => a.actualY - b.actualY);
  const labels = rawLabels.reduce((placed, label) => {
    const previousY = placed.at(-1)?.labelY ?? margin.top - 18;
    return [...placed, { ...label, labelY: Math.max(label.actualY, previousY + 18) }];
  }, []);
  const overflow = Math.max(0, labels.at(-1).labelY - (height - margin.bottom));
  const labelYByCode = new Map(labels.map((label) => [label.line.code, label.labelY - overflow]));

  return (
    <Paper sx={cardSx}>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'baseline' }}
      >
        <Box>
          <Typography variant="h6">{`${side} by energy product`}</Typography>
          <Typography sx={{ mt: 0.25, fontSize: 11.5, color: 'text.secondary' }}>
            Six major energy lines · US$ billion
          </Typography>
        </Box>
        <Typography
          sx={{
            ...mono,
            fontSize: 11,
            fontWeight: 800,
            color: side === 'Imports' ? C.orange : C.blueDeep,
          }}
        >
          {formatUsd(series.reduce((sum, line) => sum + line.values.at(-1), 0))} latest
        </Typography>
      </Box>
      <Box
        component="svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${side} of crude oil, coal and other energy products over five years`}
        sx={{ mt: 1.5, width: '100%', height: 'auto', display: 'block' }}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
          const value = maxValue * fraction;
          return (
            <g key={fraction}>
              <line
                x1={margin.left}
                x2={width - margin.right}
                y1={y(value)}
                y2={y(value)}
                stroke="#dedbd3"
              />
              <text
                x={margin.left - 8}
                y={y(value) + 4}
                textAnchor="end"
                fill="#7a8290"
                fontSize="10"
                fontFamily="IBM Plex Mono, monospace"
              >
                {Math.round(value)}
              </text>
            </g>
          );
        })}
        {series.map((line) => {
          const points = line.values.map((value, index) => [x(index), y(value)]);
          const path = points
            .map(([px, py], index) => `${index ? 'L' : 'M'} ${px} ${py}`)
            .join(' ');
          const [endX, endY] = points.at(-1);
          const labelY = labelYByCode.get(line.code);
          return (
            <g key={line.code}>
              <path
                d={path}
                fill="none"
                stroke={line.color}
                strokeWidth={line.code === '2709' || line.code === '2710' ? 3 : 2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map(([px, py], index) => (
                <circle
                  key={YEARS[index]}
                  cx={px}
                  cy={py}
                  r="3"
                  fill="#fffdf9"
                  stroke={line.color}
                  strokeWidth="2"
                />
              ))}
              <path
                d={`M ${endX + 4} ${endY} L ${endX + 13} ${labelY} L ${endX + 20} ${labelY}`}
                fill="none"
                stroke={line.color}
                strokeWidth="1.25"
              />
              <text x={endX + 24} y={labelY - 2} fill={line.color} fontSize="10" fontWeight="800">
                {trendLabels[line.code]}
              </text>
              <text
                x={endX + 24}
                y={labelY + 10}
                fill="#687283"
                fontSize="9.5"
                fontFamily="IBM Plex Mono, monospace"
              >
                {formatUsd(line.values.at(-1))}
              </text>
            </g>
          );
        })}
        {YEARS.map((year, index) => (
          <text
            key={year}
            x={x(index)}
            y={height - 14}
            textAnchor={index === 0 ? 'start' : index === YEARS.length - 1 ? 'end' : 'middle'}
            fill={index === YEARS.length - 1 ? C.purple : '#687283'}
            fontSize="10"
            fontWeight={index === YEARS.length - 1 ? 800 : 500}
            fontFamily="IBM Plex Mono, monospace"
          >
            {`FY${year.slice(2)}`}
          </text>
        ))}
      </Box>
    </Paper>
  );
}

function EnergyTradeFlowMap() {
  const width = 1080;
  const compact = false;
  const flows = importLines
    .map((line) => ({
      ...line,
      inVal: valueFor(importData, line.code),
      outVal: valueFor(exportData, line.code),
      inFirst: valueFor(importData, line.code, YEARS[0]),
      outFirst: valueFor(exportData, line.code, YEARS[0]),
    }))
    .sort((a, b) => b.inVal - a.inVal);
  const totalIn = flows.reduce((sum, flow) => sum + flow.inVal, 0);
  const totalOut = flows.reduce((sum, flow) => sum + flow.outVal, 0);
  const firstIn = flows.reduce((sum, flow) => sum + flow.inFirst, 0);
  const firstOut = flows.reduce((sum, flow) => sum + flow.outFirst, 0);
  const changeLabel = (first, last) =>
    `${last >= first ? '+' : ''}${(((last - first) / first) * 100).toFixed(0)}% since FY21–22`;

  const gutterL = compact ? 118 : 190;
  const gutterR = compact ? 92 : 150;
  const barWidth = 10;
  const headerHeight = 38;
  const gap = compact ? 12 : 15;
  const minHeight = compact ? 11 : 13;
  const scale = (compact ? 230 : 320) / (totalIn || 1);
  const rows = flows.reduce((placed, flow) => {
    const previous = placed.at(-1);
    const inHeight = Math.max(flow.inVal * scale, minHeight);
    const outHeight = Math.max(flow.outVal * scale, minHeight);
    return [
      ...placed,
      {
        ...flow,
        inHeight,
        outHeight,
        inY: previous ? previous.inY + previous.inHeight + gap : headerHeight,
        outY: previous ? previous.outY + previous.outHeight + gap : headerHeight,
      },
    ];
  }, []);
  const lastRow = rows.at(-1);
  const height = Math.max(lastRow.inY + lastRow.inHeight, lastRow.outY + lastRow.outHeight) + 12;
  const leftX = gutterL + barWidth;
  const rightX = width - gutterR - barWidth;
  const middleX = (leftX + rightX) / 2;

  return (
    <Paper sx={cardSx}>
      <Box
        sx={{
          mb: 2,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        {[
          ['Imports · FY25–26', formatUsd(totalIn), C.orange],
          ['Import change', changeLabel(firstIn, totalIn), C.orange],
          ['Exports · FY25–26', formatUsd(totalOut), C.blueDeep],
          ['Export change', changeLabel(firstOut, totalOut), C.blueDeep],
        ].map(([label, value, color]) => (
          <Box key={label}>
            <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: 'text.secondary' }}>
              {label}
            </Typography>
            <Typography sx={{ ...mono, mt: 0.25, fontSize: 16, fontWeight: 800, color }}>
              {value}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <Box
          component="svg"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="Energy imports flowing to exports by product category"
          sx={{ width: '100%', minWidth: 620, height: 'auto', display: 'block' }}
        >
          <text x={compact ? 0 : gutterL} y="14" fill={C.orange} fontSize="11" fontWeight="800">
            {compact ? 'Imported · FY25–26' : 'Imported energy · FY25–26'}
          </text>
          <text
            x={compact ? width : width - gutterR}
            y="14"
            textAnchor="end"
            fill={C.blueDeep}
            fontSize="11"
            fontWeight="800"
          >
            Exported energy
          </text>
          {rows.map((flow) => {
            const inMiddle = flow.inY + flow.inHeight / 2;
            const outMiddle = flow.outY + flow.outHeight / 2;
            const coverage = flow.inVal > 0 ? flow.outVal / flow.inVal : null;
            const ribbon = [
              `M ${leftX} ${flow.inY}`,
              `C ${middleX} ${flow.inY}, ${middleX} ${flow.outY}, ${rightX} ${flow.outY}`,
              `L ${rightX} ${flow.outY + flow.outHeight}`,
              `C ${middleX} ${flow.outY + flow.outHeight}, ${middleX} ${flow.inY + flow.inHeight}, ${leftX} ${flow.inY + flow.inHeight}`,
              'Z',
            ].join(' ');
            return (
              <g key={flow.code}>
                <title>{`${flow.label}: ${formatUsd(flow.inVal)} imported → ${formatUsd(flow.outVal)} exported`}</title>
                <path
                  d={ribbon}
                  fill={flow.color}
                  fillOpacity="0.24"
                  stroke={flow.color}
                  strokeOpacity="0.55"
                  strokeWidth="1"
                />
                <rect
                  x={gutterL}
                  y={flow.inY}
                  width={barWidth}
                  height={flow.inHeight}
                  rx="2"
                  fill={flow.color}
                />
                <rect
                  x={rightX}
                  y={flow.outY}
                  width={barWidth}
                  height={flow.outHeight}
                  rx="2"
                  fill={flow.color}
                />
                <text
                  x={gutterL - 8}
                  y={inMiddle - 1}
                  textAnchor="end"
                  fill={flow.color}
                  fontSize={compact ? 9.5 : 11.5}
                  fontWeight="800"
                >
                  {trendLabels[flow.code]}
                </text>
                <text
                  x={gutterL - 8}
                  y={inMiddle + 11}
                  textAnchor="end"
                  fill="#687283"
                  fontSize={compact ? 8.5 : 10}
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {`${formatUsd(flow.inVal)} in`}
                </text>
                <text
                  x={width - gutterR + 8}
                  y={outMiddle - 1}
                  fill={flow.color}
                  fontSize={compact ? 9 : 10.5}
                  fontWeight="800"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {`${formatUsd(flow.outVal)} out`}
                </text>
                {!compact ? (
                  <text x={width - gutterR + 8} y={outMiddle + 11} fill="#687283" fontSize="9.5">
                    {`coverage ${coverage == null ? '—' : `${(coverage * 100).toFixed(0)}%`}`}
                  </text>
                ) : null}
              </g>
            );
          })}
        </Box>
      </Box>
      <Typography sx={{ mt: 1.5, fontSize: 11.5, color: 'text.secondary', lineHeight: 1.55 }}>
        Ribbon widths compare FY2025–26 customs values on one scale. A narrowing ribbon means
        exports are smaller than imports for that energy category; this is a trade comparison, not a
        physical input-output allocation.
      </Typography>
    </Paper>
  );
}

function EnergySystemMap() {
  const width = 1080;
  const headerHeight = 48;
  const scale = 1.75;
  const minRibbon = 5;
  const gap = 14;
  const leftBarX = 188;
  const centerX = 532;
  const centerWidth = 18;
  const rightBarX = 890;
  const barWidth = 10;
  const imports = importLines
    .map((line) => ({ ...line, value: valueFor(importData, line.code) }))
    .sort((a, b) => b.value - a.value);
  const exports = importLines
    .map((line) => ({ ...line, value: valueFor(exportData, line.code) }))
    .sort((a, b) => b.value - a.value);
  const placeRows = (rows) =>
    rows.reduce((placed, row) => {
      const previous = placed.at(-1);
      const ribbonHeight = Math.max(minRibbon, row.value * scale);
      return [
        ...placed,
        {
          ...row,
          ribbonHeight,
          y: previous ? previous.y + previous.ribbonHeight + gap : headerHeight,
        },
      ];
    }, []);
  const importRows = placeRows(imports);
  const exportRows = placeRows(exports);
  const importStackHeight = importRows.reduce((sum, row) => sum + row.ribbonHeight, 0);
  const exportStackHeight = exportRows.reduce((sum, row) => sum + row.ribbonHeight, 0);
  const chartBottom = Math.max(
    importRows.at(-1).y + importRows.at(-1).ribbonHeight,
    exportRows.at(-1).y + exportRows.at(-1).ribbonHeight,
    headerHeight + importStackHeight,
  );
  const height = chartBottom + 20;
  const placeAtCenter = (rows) =>
    rows.reduce((placed, row) => {
      const previous = placed.at(-1);
      const centerY = previous ? previous.centerY + previous.ribbonHeight : headerHeight;
      return [...placed, { ...row, centerY }];
    }, []);
  const importGeometry = placeAtCenter(importRows);
  const exportGeometry = placeAtCenter(exportRows);
  const totalIn = imports.reduce((sum, row) => sum + row.value, 0);
  const totalOut = exports.reduce((sum, row) => sum + row.value, 0);
  const firstIn = importLines.reduce(
    (sum, line) => sum + valueFor(importData, line.code, YEARS[0]),
    0,
  );
  const firstOut = importLines.reduce(
    (sum, line) => sum + valueFor(exportData, line.code, YEARS[0]),
    0,
  );
  const changeLabel = (first, last) =>
    `${last >= first ? '+' : ''}${(((last - first) / first) * 100).toFixed(0)}% since FY21–22`;

  return (
    <Paper sx={cardSx}>
      <Box
        sx={{
          mb: 2,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        {[
          ['Imports · FY25–26', formatUsd(totalIn), C.orange],
          ['Import change', changeLabel(firstIn, totalIn), C.orange],
          ['Exports · FY25–26', formatUsd(totalOut), C.blueDeep],
          ['Export change', changeLabel(firstOut, totalOut), C.blueDeep],
        ].map(([label, value, color]) => (
          <Box key={label}>
            <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: 'text.secondary' }}>
              {label}
            </Typography>
            <Typography sx={{ ...mono, mt: 0.25, fontSize: 16, fontWeight: 800, color }}>
              {value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ overflowX: 'auto' }}>
        <Box
          component="svg"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="Energy imports entering India's energy system and independently reported energy exports"
          sx={{ width: '100%', minWidth: 720, height: 'auto', display: 'block' }}
        >
          <text x="0" y="16" fill={C.orange} fontSize="12" fontWeight="800">
            Imported energy products
          </text>
          <text
            x={centerX + centerWidth / 2}
            y="16"
            textAnchor="middle"
            fill={C.ink}
            fontSize="12"
            fontWeight="800"
          >
            India’s energy system
          </text>
          <text x={width} y="16" textAnchor="end" fill={C.blueDeep} fontSize="12" fontWeight="800">
            Exported energy products
          </text>

          {importGeometry.map((row) => {
            const path = [
              `M ${leftBarX + barWidth} ${row.y}`,
              `C 320 ${row.y}, 430 ${row.centerY}, ${centerX} ${row.centerY}`,
              `L ${centerX} ${row.centerY + row.ribbonHeight}`,
              `C 430 ${row.centerY + row.ribbonHeight}, 320 ${row.y + row.ribbonHeight}, ${leftBarX + barWidth} ${row.y + row.ribbonHeight}`,
              'Z',
            ].join(' ');
            return (
              <g key={`import-${row.code}`}>
                <title>{`${row.label}: ${formatUsd(row.value)} imported`}</title>
                <path
                  d={path}
                  fill={row.color}
                  fillOpacity="0.24"
                  stroke={row.color}
                  strokeOpacity="0.48"
                />
                <rect
                  x={leftBarX}
                  y={row.y}
                  width={barWidth}
                  height={row.ribbonHeight}
                  rx="2"
                  fill={row.color}
                />
                <text
                  x={leftBarX - 8}
                  y={row.y + row.ribbonHeight / 2 - 1}
                  textAnchor="end"
                  fill={row.color}
                  fontSize="11.5"
                  fontWeight="800"
                >
                  {trendLabels[row.code]}
                </text>
                <text
                  x={leftBarX - 8}
                  y={row.y + row.ribbonHeight / 2 + 11}
                  textAnchor="end"
                  fill="#687283"
                  fontSize="10"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {`${formatUsd(row.value)} in`}
                </text>
              </g>
            );
          })}

          <rect
            x={centerX}
            y={headerHeight}
            width={centerWidth}
            height={importStackHeight}
            rx="3"
            fill={C.ink}
            fillOpacity="0.82"
          />

          {exportGeometry.map((row) => {
            const path = [
              `M ${centerX + centerWidth} ${row.centerY}`,
              `C 650 ${row.centerY}, 770 ${row.y}, ${rightBarX} ${row.y}`,
              `L ${rightBarX} ${row.y + row.ribbonHeight}`,
              `C 770 ${row.y + row.ribbonHeight}, 650 ${row.centerY + row.ribbonHeight}, ${centerX + centerWidth} ${row.centerY + row.ribbonHeight}`,
              'Z',
            ].join(' ');
            return (
              <g key={`export-${row.code}`}>
                <title>{`${row.label}: ${formatUsd(row.value)} exported`}</title>
                <path
                  d={path}
                  fill={row.color}
                  fillOpacity="0.24"
                  stroke={row.color}
                  strokeOpacity="0.48"
                />
                <rect
                  x={rightBarX}
                  y={row.y}
                  width={barWidth}
                  height={row.ribbonHeight}
                  rx="2"
                  fill={row.color}
                />
                <text
                  x={rightBarX + 18}
                  y={row.y + row.ribbonHeight / 2 - 1}
                  fill={row.color}
                  fontSize="11"
                  fontWeight="800"
                >
                  {trendLabels[row.code]}
                </text>
                <text
                  x={rightBarX + 18}
                  y={row.y + row.ribbonHeight / 2 + 11}
                  fill="#687283"
                  fontSize="10"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {`${formatUsd(row.value)} out`}
                </text>
              </g>
            );
          })}
        </Box>
      </Box>

      <Box
        sx={{
          mt: 2,
          ml: { lg: '50%' },
          p: 2,
          borderRadius: 2,
          bgcolor: '#f1eee6',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="overline" sx={{ color: C.teal }}>
          Domestic use · separate physical measure
        </Typography>
        <Box sx={{ mt: 0.5, display: 'flex', gap: 2, alignItems: 'baseline', flexWrap: 'wrap' }}>
          <Typography sx={{ ...mono, fontSize: 22, fontWeight: 800 }}>
            {latestConsumptionTotal.toFixed(1)} MMT
          </Typography>
          <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>
            FY2025–26 petroleum consumption · PPAC
          </Typography>
        </Box>
        <Typography sx={{ mt: 0.75, fontSize: 12, color: 'text.secondary', lineHeight: 1.55 }}>
          Led by diesel ({consumption[0].value} MMT), petrol ({consumption[1].value} MMT), LPG (
          {consumption[2].value} MMT), and industrial uses. This tonnage is not subtracted from the
          customs-value ribbons above.
        </Typography>
      </Box>

      <Typography sx={{ mt: 1.5, fontSize: 11.5, color: 'text.secondary', lineHeight: 1.55 }}>
        Import and export categories are independently reported customs series. They meet at the
        energy-system node only to show that India refines, transforms and consumes energy; the
        ribbons do not claim that a specific imported category became a specific export.
      </Typography>
    </Paper>
  );
}

function EnergyTradeTrend() {
  return (
    <>
      <EnergySystemMap />
      {false ? <EnergyTradeFlowMap /> : null}
    </>
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
            Domestic demand extends far beyond passenger mobility.
          </Typography>
          <Typography sx={{ mt: 1, color: 'text.secondary', fontSize: 13.5, lineHeight: 1.7 }}>
            Diesel leads petroleum use by mass, while LPG, petroleum coke, naphtha, aviation fuel
            and bitumen connect the energy system to homes, freight, industry, travel and
            infrastructure.
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

function formatStateMetric(value, metric) {
  if (metric === 'perCapita') return `${value.toFixed(1)} kg/person`;
  return value >= 1000 ? `${(value / 1000).toFixed(2)} MMT` : `${value.toFixed(1)} TMT`;
}

function StatePetroleumMap() {
  const [metric, setMetric] = useState('total');
  const [selectedName, setSelectedName] = useState('Gujarat');
  const rowsByName = useMemo(
    () => new Map(statePetroleumConsumption.map((row) => [row.name, row])),
    [],
  );
  const rankedRows = useMemo(
    () => [...statePetroleumConsumption].sort((a, b) => b[metric] - a[metric]),
    [metric],
  );
  const thresholds = useMemo(() => {
    const values = statePetroleumConsumption.map((row) => row[metric]).sort((a, b) => a - b);
    return [0.2, 0.4, 0.6, 0.8].map(
      (fraction) => values[Math.min(values.length - 1, Math.floor(values.length * fraction))],
    );
  }, [metric]);
  const selected = rowsByName.get(selectedName) || rankedRows[0];
  const metricLabel = metric === 'total' ? 'total sales' : 'sales per person';
  const nationalValue = metric === 'total' ? nationalStateSalesH1Fy25 : 74.4;
  const shareOfIndia = (row) => (row.total / nationalStateSalesH1Fy25) * 100;
  const fillFor = (value) =>
    stateMapColors[thresholds.reduce((band, threshold) => band + (value >= threshold ? 1 : 0), 0)];

  return (
    <Paper sx={cardSx}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 1.5,
          mb: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 800 }}>
            Apr–Sep 2024 consumption proxy
          </Typography>
          <Typography sx={{ mt: 0.2, fontSize: 11.5, color: 'text.secondary' }}>
            Petroleum-product sales · PPAC
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={metric}
          exclusive
          size="small"
          aria-label="State petroleum consumption metric"
          onChange={(_, next) => next && setMetric(next)}
          sx={{ '& .MuiToggleButton-root': { px: 1.5, py: 0.5, fontSize: 11, fontWeight: 800 } }}
        >
          <ToggleButton value="total">Total sales</ToggleButton>
          <ToggleButton value="perCapita">Per person</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0,1.25fr) minmax(260px,.75fr)' },
          gap: { xs: 2.5, lg: 4 },
          alignItems: 'center',
        }}
      >
        <Box>
          <Box
            component="svg"
            viewBox="0 0 800 828"
            role="img"
            aria-label={`India map shaded by state petroleum-product ${metricLabel}`}
            sx={{ width: '100%', maxHeight: 570, display: 'block' }}
          >
            {indiaStatePaths.map((shape, index) => {
              const canonicalName = stateMapNames[shape.name] || shape.name;
              const row = rowsByName.get(canonicalName);
              if (!row) return null;
              const isSelected = canonicalName === selected.name;
              return (
                <path
                  key={`${shape.name}-${index}`}
                  d={shape.path}
                  fillRule={shape.fillRule}
                  fill={fillFor(row[metric])}
                  stroke={isSelected ? C.ink : '#fffdf9'}
                  strokeWidth={isSelected ? 2.2 : 0.75}
                  vectorEffect="non-scaling-stroke"
                  tabIndex={0}
                  role="button"
                  aria-label={`${canonicalName}: ${formatStateMetric(row[metric], metric)}, ${shareOfIndia(row).toFixed(1)}% of India petroleum-product sales`}
                  onMouseEnter={() => setSelectedName(canonicalName)}
                  onFocus={() => setSelectedName(canonicalName)}
                  onClick={() => setSelectedName(canonicalName)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedName(canonicalName);
                    }
                  }}
                  style={{ cursor: 'pointer', outline: 'none', transition: 'fill 160ms ease' }}
                >
                  <title>{`${canonicalName}: ${formatStateMetric(row[metric], metric)} · ${shareOfIndia(row).toFixed(1)}% of India sales`}</title>
                </path>
              );
            })}
            <g aria-hidden="true" pointerEvents="none">
              {statePetroleumConsumption.map((row) => {
                const [anchorX, anchorY] = stateLabelPositions[row.name];
                const [x, y] = stateLabelCalloutPositions[row.name] || [anchorX, anchorY];
                const share = shareOfIndia(row);
                const label = share < 0.05 ? '<0.1%' : `${share.toFixed(1)}%`;
                const isSelected = row.name === selected.name;
                const isCallout = x !== anchorX || y !== anchorY;
                const badgeWidth = label.length > 4 ? 54 : 49;
                return (
                  <g key={row.name} data-state-share-label={row.name}>
                    {isCallout ? (
                      <line
                        x1={anchorX}
                        y1={anchorY}
                        x2={x}
                        y2={y}
                        stroke={C.ink}
                        strokeWidth="0.9"
                        strokeOpacity="0.65"
                        vectorEffect="non-scaling-stroke"
                      />
                    ) : null}
                    <rect
                      x={x - badgeWidth / 2}
                      y={y - 12}
                      width={badgeWidth}
                      height="24"
                      rx="8"
                      fill={isSelected ? C.ink : '#fffdf9'}
                      fillOpacity={isSelected ? 1 : 0.94}
                      stroke={isSelected ? '#fffdf9' : C.ink}
                      strokeWidth="0.8"
                      vectorEffect="non-scaling-stroke"
                    />
                    <text
                      x={x}
                      y={y + 0.5}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={isSelected ? '#fffdf9' : C.ink}
                      fontFamily="IBM Plex Mono, monospace"
                      fontSize="14"
                      fontWeight="800"
                    >
                      {label}
                    </text>
                  </g>
                );
              })}
            </g>
          </Box>
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.8, flexWrap: 'wrap' }}>
            <Typography sx={{ mr: 0.4, fontSize: 10.5, color: 'text.secondary' }}>Lower</Typography>
            {stateMapColors.map((color, index) => (
              <Box
                key={color}
                aria-label={`Color band ${index + 1} of ${stateMapColors.length}`}
                sx={{ width: 34, height: 9, bgcolor: color, borderRadius: 99 }}
              />
            ))}
            <Typography sx={{ ml: 0.4, fontSize: 10.5, color: 'text.secondary' }}>
              Higher
            </Typography>
            <Typography sx={{ ml: { sm: 'auto' }, fontSize: 10.5, color: 'text.secondary' }}>
              Labels: share of India sales · colors: five equal state groups
            </Typography>
          </Box>
        </Box>

        <Stack spacing={1.5}>
          <Box sx={{ p: 2.2, bgcolor: C.ink, color: '#fff', borderRadius: 1.5 }}>
            <Typography variant="overline" sx={{ color: '#d0a77f' }}>
              Selected state / UT
            </Typography>
            <Typography variant="h5" sx={{ mt: 0.4, color: '#fff' }}>
              {selected.name}
            </Typography>
            <Box
              sx={{ mt: 1, display: 'flex', alignItems: 'baseline', gap: 1.2, flexWrap: 'wrap' }}
            >
              <Typography sx={{ ...mono, fontSize: 25, fontWeight: 800 }}>
                {shareOfIndia(selected).toFixed(1)}%
              </Typography>
              <Typography sx={{ ...mono, fontSize: 14, color: 'rgba(255,255,255,.76)' }}>
                {formatStateMetric(selected[metric], metric)}
              </Typography>
            </Box>
            <Typography sx={{ mt: 0.25, fontSize: 11.5, color: 'rgba(255,255,255,.62)' }}>
              Share of India’s petroleum-product sales
            </Typography>
            <Typography sx={{ mt: 0.3, fontSize: 11.5, color: 'rgba(255,255,255,.62)' }}>
              Rank {rankedRows.findIndex((row) => row.name === selected.name) + 1} of 36
            </Typography>
          </Box>

          <Box sx={{ p: 2, bgcolor: '#f1eee6', borderRadius: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
              <Typography sx={{ fontSize: 12.5, fontWeight: 800 }}>India</Typography>
              <Typography sx={{ ...mono, fontSize: 12.5, fontWeight: 800 }}>
                {formatStateMetric(nationalValue, metric)}
              </Typography>
            </Box>
            <Divider sx={{ my: 1.25 }} />
            <Typography variant="overline" sx={{ color: C.orange, fontSize: 9.5 }}>
              Highest {metricLabel}
            </Typography>
            {rankedRows.slice(0, 5).map((row, index) => (
              <Box
                component="button"
                type="button"
                key={row.name}
                onClick={() => setSelectedName(row.name)}
                sx={{
                  width: '100%',
                  mt: 0.8,
                  p: 0,
                  display: 'grid',
                  gridTemplateColumns: '18px minmax(0,1fr) auto',
                  gap: 0.7,
                  border: 0,
                  bgcolor: 'transparent',
                  color: 'inherit',
                  textAlign: 'left',
                  cursor: 'pointer',
                  font: 'inherit',
                }}
              >
                <Typography sx={{ ...mono, fontSize: 10.5, color: 'text.secondary' }}>
                  {index + 1}
                </Typography>
                <Typography sx={{ fontSize: 11.5, fontWeight: 700 }}>{row.name}</Typography>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ ...mono, fontSize: 10.8, fontWeight: 800 }}>
                    {shareOfIndia(row).toFixed(1)}%
                  </Typography>
                  <Typography sx={{ ...mono, fontSize: 9.5, color: 'text.secondary' }}>
                    {formatStateMetric(row[metric], metric)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Stack>
      </Box>

      <Typography sx={{ mt: 2, fontSize: 10.8, color: 'text.secondary', lineHeight: 1.55 }}>
        This is petroleum-product sales, used as a consumption proxy—not total energy use. It does
        not include electricity, coal used outside petroleum-product sales, gas or biomass. The
        per-person view helps separate population scale from consumption intensity; small
        territories can rank highly on that measure.
      </Typography>
    </Paper>
  );
}

function CrudePriceSensitivity() {
  const [price, setPrice] = useState(75);
  const importedBarrelsBillion = (245.3 * 7.3) / 1000;
  const estimatedBill = importedBarrelsBillion * price;
  const tenDollarImpact = importedBarrelsBillion * 10;

  return (
    <Paper sx={cardSx}>
      <Typography variant="overline" sx={{ color: C.orange }}>
        Price sensitivity
      </Typography>
      <Typography variant="h5" sx={{ mt: 0.4 }}>
        India’s crude-import bill under different prices
      </Typography>
      <Typography sx={{ mt: 0.7, color: 'text.secondary', fontSize: 12.5, lineHeight: 1.6 }}>
        Hold FY2025–26 import volume constant and move the assumed crude price.
      </Typography>
      <Box sx={{ mt: 2.2, display: 'grid', gridTemplateColumns: '1fr auto', gap: 2 }}>
        <Box>
          <Typography sx={{ ...mono, fontSize: 29, fontWeight: 800, color: C.orange }}>
            ${price}/bbl
          </Typography>
          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>scenario price</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ ...mono, fontSize: 29, fontWeight: 800 }}>
            ${estimatedBill.toFixed(0)}bn
          </Typography>
          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
            estimated annual crude cost
          </Typography>
        </Box>
      </Box>
      <Slider
        value={price}
        min={50}
        max={120}
        step={5}
        marks={[
          { value: 50, label: '$50' },
          { value: 75, label: '$75' },
          { value: 100, label: '$100' },
          { value: 120, label: '$120' },
        ]}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `$${value}/bbl`}
        onChange={(_, value) => setPrice(Array.isArray(value) ? value[0] : value)}
        aria-label="Assumed crude oil price per barrel"
        sx={{ mt: 3, color: C.orange, '& .MuiSlider-markLabel': { fontSize: 10.5 } }}
      />
      <Box sx={{ mt: 2.5, p: 1.5, bgcolor: '#f1eee6', borderRadius: 1.25 }}>
        <Typography sx={{ ...mono, fontSize: 18, fontWeight: 800 }}>
          ≈${tenDollarImpact.toFixed(1)}bn
        </Typography>
        <Typography sx={{ mt: 0.25, fontSize: 11.5, color: 'text.secondary' }}>
          Additional annual cost for every $10/barrel increase
        </Typography>
      </Box>
      <Typography sx={{ mt: 1.3, fontSize: 10.5, color: 'text.secondary', lineHeight: 1.5 }}>
        Scenario uses 245.3 MMT of crude imports and an approximate conversion of 7.3 barrels per
        metric tonne. Actual customs cost also reflects crude grade, freight, insurance and timing.
      </Typography>
    </Paper>
  );
}

function ImportDependenceTrend() {
  const width = 620;
  const height = 250;
  const margin = { top: 22, right: 28, bottom: 36, left: 42 };
  const minValue = 80;
  const maxValue = 90;
  const x = (index) =>
    margin.left +
    (index / (crudeImportDependence.length - 1)) * (width - margin.left - margin.right);
  const y = (value) =>
    margin.top +
    ((maxValue - value) / (maxValue - minValue)) * (height - margin.top - margin.bottom);
  const path = crudeImportDependence
    .map((row, index) => `${index ? 'L' : 'M'} ${x(index)} ${y(row.value)}`)
    .join(' ');
  const change = crudeImportDependence.at(-1).value - crudeImportDependence[0].value;

  return (
    <Paper sx={cardSx}>
      <Typography variant="overline" sx={{ color: C.teal }}>
        Long-run dependence
      </Typography>
      <Box sx={{ mt: 0.4, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Typography variant="h5">Imported crude supplies nearly nine-tenths of demand</Typography>
        <Box sx={{ flexShrink: 0, textAlign: 'right' }}>
          <Typography sx={{ ...mono, fontSize: 22, fontWeight: 800, color: C.teal }}>
            +{change.toFixed(1)}pp
          </Typography>
          <Typography sx={{ fontSize: 10.5, color: 'text.secondary' }}>since FY2016–17</Typography>
        </Box>
      </Box>
      <Box
        component="svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="India crude oil import dependence from fiscal year 2016-17 to 2025-26"
        sx={{ mt: 1.5, width: '100%', height: 'auto', display: 'block' }}
      >
        {[80, 85, 90].map((tick) => (
          <g key={tick}>
            <line
              x1={margin.left}
              x2={width - margin.right}
              y1={y(tick)}
              y2={y(tick)}
              stroke="#ddd8cd"
            />
            <text
              x={margin.left - 8}
              y={y(tick) + 4}
              textAnchor="end"
              fill="#687283"
              fontSize="10"
              fontFamily="IBM Plex Mono, monospace"
            >
              {tick}%
            </text>
          </g>
        ))}
        <path d={path} fill="none" stroke={C.teal} strokeWidth="3" strokeLinejoin="round" />
        {crudeImportDependence.map((row, index) => (
          <g key={row.year}>
            <circle
              cx={x(index)}
              cy={y(row.value)}
              r="4"
              fill="#fffdf9"
              stroke={C.teal}
              strokeWidth="2"
            />
            <text
              x={x(index)}
              y={height - 12}
              textAnchor="middle"
              fill="#687283"
              fontSize="9.5"
              fontFamily="IBM Plex Mono, monospace"
            >
              {row.year}
            </text>
            {index === 0 || index === crudeImportDependence.length - 1 ? (
              <text
                x={x(index)}
                y={y(row.value) - 10}
                textAnchor="middle"
                fill={C.teal}
                fontSize="11"
                fontWeight="800"
              >
                {row.value.toFixed(1)}%
              </text>
            ) : null}
          </g>
        ))}
      </Box>
      <Typography sx={{ mt: 0.5, fontSize: 10.5, color: 'text.secondary', lineHeight: 1.5 }}>
        PPAC’s consumption-basis measure; FY2025–26 is provisional.
      </Typography>
    </Paper>
  );
}

function RefineryCapacity() {
  const maxCapacity = majorRefineries[0].capacity;
  return (
    <Paper sx={cardSx}>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'baseline' }}
      >
        <Box>
          <Typography variant="overline" sx={{ color: C.blueDeep }}>
            Refining capacity
          </Typography>
          <Typography variant="h5" sx={{ mt: 0.4 }}>
            India’s largest refinery sites
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
          <Typography sx={{ ...mono, fontSize: 22, fontWeight: 800 }}>258.1 MMT/yr</Typography>
          <Typography sx={{ fontSize: 10.5, color: 'text.secondary' }}>
            all-India installed capacity
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          mt: 2.2,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 1.2,
        }}
      >
        {majorRefineries.map((refinery) => (
          <Box key={refinery.name} sx={{ p: 1.4, bgcolor: '#f4f1ea', borderRadius: 1.25 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5 }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 800 }}>{refinery.name}</Typography>
                <Typography sx={{ fontSize: 10.5, color: 'text.secondary' }}>
                  {refinery.state}
                </Typography>
              </Box>
              <Typography sx={{ ...mono, flexShrink: 0, fontSize: 12, fontWeight: 800 }}>
                {refinery.capacity.toFixed(1)}
              </Typography>
            </Box>
            <Box
              sx={{ mt: 0.8, height: 6, bgcolor: '#ddd8cd', borderRadius: 99, overflow: 'hidden' }}
            >
              <Box
                sx={{
                  width: `${(refinery.capacity / maxCapacity) * 100}%`,
                  height: '100%',
                  bgcolor: C.blueDeep,
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>
      <Typography sx={{ mt: 1.4, fontSize: 10.5, color: 'text.secondary', lineHeight: 1.5 }}>
        Capacity in million metric tonnes per year as at 1 April 2025. Reliance combines its 33.0
        MMT domestic-tariff and 35.2 MMT SEZ units at Jamnagar.
      </Typography>
    </Paper>
  );
}

function StrategicReserves() {
  const operatingCapacity = strategicReserveSites.reduce((sum, site) => sum + site.capacity, 0);
  const currentImportDays = operatingCapacity / (245.3 / 365);
  const phaseTwoImportDays = 6.5 / (245.3 / 365);
  return (
    <Paper sx={{ ...cardSx, bgcolor: '#ece7dc' }}>
      <Typography variant="overline" sx={{ color: C.purple }}>
        Supply buffer
      </Typography>
      <Typography variant="h5" sx={{ mt: 0.4 }}>
        Strategic petroleum reserves
      </Typography>
      <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
        <Box sx={{ p: 1.6, bgcolor: C.ink, color: '#fff', borderRadius: 1.25 }}>
          <Typography sx={{ ...mono, fontSize: 25, fontWeight: 800 }}>5.33 MMT</Typography>
          <Typography sx={{ mt: 0.3, fontSize: 11.5, color: 'rgba(255,255,255,.7)' }}>
            operating Phase I capacity
          </Typography>
        </Box>
        <Box sx={{ p: 1.6, bgcolor: '#fffdf9', borderRadius: 1.25 }}>
          <Typography sx={{ ...mono, fontSize: 25, fontWeight: 800 }}>
            ≈{currentImportDays.toFixed(1)} days
          </Typography>
          <Typography sx={{ mt: 0.3, fontSize: 11.5, color: 'text.secondary' }}>
            at FY2025–26 import volume
          </Typography>
        </Box>
      </Box>
      <Stack spacing={1.1} sx={{ mt: 2 }}>
        {strategicReserveSites.map((site) => (
          <Box
            key={site.name}
            sx={{
              display: 'grid',
              gridTemplateColumns: '110px 1fr 62px',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Typography sx={{ fontSize: 11.5, fontWeight: 800 }}>{site.name}</Typography>
            <Box sx={{ height: 7, bgcolor: '#d4cdbf', borderRadius: 99, overflow: 'hidden' }}>
              <Box
                sx={{ width: `${(site.capacity / 2.5) * 100}%`, height: '100%', bgcolor: C.purple }}
              />
            </Box>
            <Typography sx={{ ...mono, fontSize: 11, textAlign: 'right' }}>
              {site.capacity.toFixed(2)} MMT
            </Typography>
          </Box>
        ))}
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Typography sx={{ fontSize: 12.5, fontWeight: 800 }}>
        Phase II: 6.5 MMT approved—not yet operating
      </Typography>
      <Typography sx={{ mt: 0.45, fontSize: 11.5, color: 'text.secondary', lineHeight: 1.55 }}>
        Chandikhol (4.0 MMT) and a second Padur facility (2.5 MMT) would add roughly{' '}
        {phaseTwoImportDays.toFixed(1)} days at FY2025–26 import volume. The government’s official
        benchmark for Phase I is 9.5 days using 2019–20 consumption.
      </Typography>
      <Typography sx={{ mt: 1.1, fontSize: 10.5, color: 'text.secondary', lineHeight: 1.5 }}>
        Storage capacity is not the same as the amount of crude currently held.
      </Typography>
    </Paper>
  );
}

function CrudeExposureAndResilience() {
  return (
    <Stack spacing={1.5}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 1.5 }}>
        <CrudePriceSensitivity />
        <ImportDependenceTrend />
      </Box>
      <Box
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.15fr .85fr' }, gap: 1.5 }}
      >
        <RefineryCapacity />
        <StrategicReserves />
      </Box>
    </Stack>
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
            Petrol use by vehicle type in the 2021 retail-outlet survey
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

function FuelRetailMarket() {
  const coveredOutlets = fuelRetailers.reduce((sum, company) => sum + company.outlets, 0);
  const otherOutlets = Math.max(0, nationalRetailOutletsFy25 - coveredOutlets);
  const networkRows = [
    ...fuelRetailers,
    {
      name: 'Other operators',
      outlets: otherOutlets,
      color: '#c8c2b7',
    },
  ];

  return (
    <Stack spacing={1.5}>
      <Paper sx={{ ...cardSx, bgcolor: '#ece7dc' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4,1fr)' },
            gap: { xs: 2, md: 3 },
          }}
        >
          {[
            {
              value: `≥${indianControlledOutletShare.toFixed(1)}%`,
              label: 'Indian-controlled pump footprint',
              note: 'Listed operators · FY2024–25',
            },
            { value: '96,724', label: 'Petrol pumps nationwide', note: 'As at 1 April 2025' },
            { value: '40.01 MMT', label: 'Petrol consumed', note: 'FY2024–25' },
            { value: '91.41 MMT', label: 'Diesel consumed', note: 'FY2024–25 · 88% retail' },
          ].map((item, index) => (
            <Box
              key={item.label}
              sx={{
                minWidth: 0,
                pl: { md: index ? 3 : 0 },
                borderLeft: { md: index ? '1px solid #d2cbbf' : 0 },
              }}
            >
              <Typography sx={{ ...mono, fontSize: { xs: 18, md: 22 }, fontWeight: 700 }}>
                {item.value}
              </Typography>
              <Typography sx={{ mt: 0.35, fontSize: 12.5, fontWeight: 800 }}>
                {item.label}
              </Typography>
              <Typography sx={{ mt: 0.2, fontSize: 10.8, color: 'text.secondary' }}>
                {item.note}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      <Paper sx={cardSx}>
        <Typography sx={{ fontSize: 13, fontWeight: 800 }}>
          Share of India’s petrol-pump network
        </Typography>
        <Typography sx={{ mt: 0.25, fontSize: 11.5, color: 'text.secondary' }}>
          Outlet count is the consistent distribution measure available across operators.
        </Typography>
        <Box
          sx={{ mt: 2, display: 'flex', height: 30, borderRadius: 1, overflow: 'hidden' }}
          role="img"
          aria-label={networkRows
            .map(
              (company) =>
                `${company.name} ${((company.outlets / nationalRetailOutletsFy25) * 100).toFixed(1)}%`,
            )
            .join(', ')}
        >
          {networkRows.map((company) => (
            <Box
              key={company.name}
              sx={{
                width: `${(company.outlets / nationalRetailOutletsFy25) * 100}%`,
                minWidth: company.outlets > 0 ? 2 : 0,
                bgcolor: company.color,
              }}
            />
          ))}
        </Box>
        <Box
          sx={{
            mt: 1.5,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4,1fr)', lg: 'repeat(7,1fr)' },
            gap: 1,
          }}
        >
          {networkRows.map((company) => (
            <Box key={company.name} sx={{ minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: 99, bgcolor: company.color }} />
                <Typography sx={{ fontSize: 10.8, fontWeight: 800 }}>{company.name}</Typography>
              </Box>
              <Typography sx={{ ...mono, mt: 0.25, fontSize: 11.5 }}>
                {((company.outlets / nationalRetailOutletsFy25) * 100).toFixed(1)}%
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      <Paper sx={{ ...cardSx, p: 0, overflow: 'hidden' }}>
        <Box
          sx={{
            px: { xs: 1.5, md: 2 },
            py: 1.15,
            display: { xs: 'none', md: 'grid' },
            gridTemplateColumns: '1.05fr 1.35fr .72fr .9fr 1.45fr 44px',
            gap: 1.5,
            bgcolor: '#f1eee6',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          {[
            'Company',
            'Ownership / control',
            'Pump share',
            'FY25 revenue',
            'Annual fuel volume',
            '',
          ].map((label) => (
            <Typography
              key={label || 'source'}
              variant="overline"
              sx={{ fontSize: 9.5, color: 'text.secondary' }}
            >
              {label}
            </Typography>
          ))}
        </Box>
        {fuelRetailers.map((company, index) => {
          const share = (company.outlets / nationalRetailOutletsFy25) * 100;
          return (
            <Box
              key={company.name}
              sx={{
                px: { xs: 1.5, md: 2 },
                py: { xs: 1.5, md: 1.25 },
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', md: '1.05fr 1.35fr .72fr .9fr 1.45fr 44px' },
                gap: { xs: 1.2, md: 1.5 },
                alignItems: 'center',
                borderBottom: index < fuelRetailers.length - 1 ? '1px solid' : 0,
                borderColor: 'divider',
              }}
            >
              <Box>
                <Typography sx={{ fontSize: 12.5, fontWeight: 800 }}>{company.name}</Typography>
                <Typography sx={{ ...mono, mt: 0.2, fontSize: 10.5, color: 'text.secondary' }}>
                  {company.outlets.toLocaleString('en-IN')} outlets
                </Typography>
              </Box>
              <Typography sx={{ fontSize: 11.5, lineHeight: 1.45, color: 'text.secondary' }}>
                {company.ownership}
              </Typography>
              <Box>
                <Typography sx={{ ...mono, fontSize: 12.5, fontWeight: 700 }}>
                  {share.toFixed(1)}%
                </Typography>
                <Typography
                  sx={{ display: { md: 'none' }, fontSize: 9.8, color: 'text.secondary' }}
                >
                  Pump share
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ ...mono, fontSize: 12, fontWeight: 700 }}>
                  {company.revenue}
                </Typography>
                <Typography
                  sx={{ display: { md: 'none' }, fontSize: 9.8, color: 'text.secondary' }}
                >
                  Revenue
                </Typography>
              </Box>
              <Box sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}>
                <Typography sx={{ ...mono, fontSize: 12, fontWeight: 700 }}>
                  {company.volume}
                </Typography>
                <Typography
                  sx={{ mt: 0.15, fontSize: 10.3, lineHeight: 1.35, color: 'text.secondary' }}
                >
                  {company.volumeScope}
                </Typography>
              </Box>
              <Box
                component="a"
                href={company.source}
                target="_blank"
                rel="noreferrer"
                aria-label={`${company.name} source (opens in new tab)`}
                sx={{ fontSize: 10.5, fontWeight: 800, color: C.blueDeep, textDecoration: 'none' }}
              >
                Source ↗
              </Box>
            </Box>
          );
        })}
      </Paper>

      <Typography sx={{ px: 0.25, fontSize: 10.8, color: 'text.secondary', lineHeight: 1.55 }}>
        Revenue is company-wide revenue from operations, not profit or petrol-pump revenue alone.
        Annual volume follows each company’s own disclosure and is labelled by scope; MMT and
        million kilolitres are not directly interchangeable. Jio-bp and Shell do not publish
        standalone India fuel-retail revenue in the cited sources.
      </Typography>
    </Stack>
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
    <Box
      component="details"
      sx={{
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'divider',
        '& summary::-webkit-details-marker': { display: 'none' },
        '&[open] .source-chevron': { transform: 'rotate(180deg)' },
      }}
    >
      <Box
        component="summary"
        sx={{
          py: 1.6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          cursor: 'pointer',
          listStyle: 'none',
          userSelect: 'none',
          '&:hover': { color: C.orange },
          '&:focus-visible': { outline: `2px solid ${C.orange}`, outlineOffset: 3 },
        }}
      >
        <Box>
          <Typography component="h2" variant="h5">
            Sources &amp; method
          </Typography>
          <Typography sx={{ mt: 0.2, fontSize: 11.5, color: 'text.secondary' }}>
            Data definitions, source links and freshness notes
          </Typography>
        </Box>
        <ExpandMore
          className="source-chevron"
          aria-hidden="true"
          sx={{ flexShrink: 0, color: 'text.secondary', transition: 'transform 180ms ease' }}
        />
      </Box>
      <Box sx={{ pb: 2.25 }}>
        <Typography
          sx={{ maxWidth: 880, color: 'text.secondary', fontSize: 12.5, lineHeight: 1.75 }}
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
          . The FY2024–25 fuel-distribution baseline uses PPAC’s{' '}
          <Box
            component="a"
            href="https://ppac.gov.in/download.php?file=menu%2F1745468191_ICR_April-March+2024-25_Final.pdf"
            target="_blank"
            rel="noreferrer"
            sx={linkSx}
          >
            April–March industry report
          </Box>
          . State petroleum-product sales and per-capita sales use PPAC’s{' '}
          <Box
            component="a"
            href="https://ppac.gov.in/download.php?file=rep_studies%2F1733114272_Ready+Reckoner_H1_FY+2024-25_Final.pdf"
            target="_blank"
            rel="noreferrer"
            sx={linkSx}
          >
            H1 FY2024–25 Ready Reckoner
          </Box>
          ; company revenue, outlet and sales-volume figures come from the annual reports linked in
          the operator table. Map geometry is simplified from Anuj Tiwari’s{' '}
          <Box
            component="a"
            href="https://github.com/AnujTiwari/India-State-and-Country-Shapefile-Updated-Jan-2020"
            target="_blank"
            rel="noreferrer"
            sx={linkSx}
          >
            MIT-licensed state boundary dataset
          </Box>
          .
        </Typography>
        <Typography
          sx={{ mt: 1, maxWidth: 880, color: 'text.secondary', fontSize: 12.5, lineHeight: 1.75 }}
        >
          Refinery figures use PPAC’s{' '}
          <Box
            component="a"
            href="https://ppac.gov.in/infrastructure/installed-refinery-capacity"
            target="_blank"
            rel="noreferrer"
            sx={linkSx}
          >
            installed refinery capacity table
          </Box>
          . Strategic-storage capacity and Phase II status come from the Ministry of Petroleum &amp;
          Natural Gas’s{' '}
          <Box
            component="a"
            href="https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2113233"
            target="_blank"
            rel="noreferrer"
            sx={linkSx}
          >
            March 2025 reserve update
          </Box>
          . The price scenario uses the EIA’s approximate{' '}
          <Box
            component="a"
            href="https://www.eia.gov/todayinenergy/detail.php?id=30792"
            target="_blank"
            rel="noreferrer"
            sx={linkSx}
          >
            7.3 barrels-per-tonne conversion
          </Box>
          .
        </Typography>
        <Typography
          sx={{ mt: 1, maxWidth: 880, color: 'text.secondary', fontSize: 11.5, lineHeight: 1.65 }}
        >
          Country shares use TradeStat’s principal commodity “Petroleum: crude”. Value shares are
          reported by TradeStat; volume shares and unit values are derived from its tonnes series.
          Product mix uses HS-4 customs lines. PPAC figures describe the energy system and are kept
          separate from customs totals. State-map colors are quantile bands, with an equal number of
          states and UTs in each band. Price sensitivity holds import volume constant and is not a
          forecast. Reserve-day estimates divide stated capacity by FY2025–26 crude-import volume;
          they measure capacity, not current inventory. Pump shares divide each reported outlet
          count by the national total of 96,724. MMT means million metric tonnes; TMT means thousand
          metric tonnes; percentage-point changes may differ slightly due to rounding.
        </Typography>
        <Typography sx={{ mt: 1, color: 'text.secondary', fontSize: 11.5 }}>
          Freshness: TradeStat retrieved 1 August 2026 · PPAC energy data through FY2025–26 and June
          2026.
        </Typography>
      </Box>
    </Box>
  );
}

export default function PetroleumBrief() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Masthead pageTitle="Petroleum & Energy" backHref="/" />
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
                  India’s crude oil and energy trade, explained.
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
                  How crude oil and other energy imports changed, what India exports after refining,
                  where the crude comes from, and how the wider energy system uses it.
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
                  The system view
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
                  Crude is the dominant import, but energy trade is broader than one fuel.
                </Typography>
                <Typography
                  sx={{ mt: 1, color: 'rgba(255,255,255,.62)', fontSize: 13, lineHeight: 1.65 }}
                >
                  India imports crude, gas, refined fuels and industrial petroleum inputs. Its
                  refineries also turn crude into a substantial stream of exported products.
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
                value={formatUsd(petroleumImportTotal)}
                label="Energy-product imports"
                note="FY2025–26 · customs value"
              />
              <Stat value="88.7%" label="Crude import dependence" note="FY2025–26 · PPAC" />
              <Stat
                value={formatUsd(petroleumExportTotal)}
                label="Energy-product exports"
                note="FY2025–26 · six HS-4 lines"
              />
            </Box>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Stack spacing={1.5}>
            <Box component="section">
              <SectionHeading
                eyebrow="Supplier shift"
                title="India’s crude oil suppliers"
                body="Follow every year in the five-year transition, then switch between dollar exposure and physical tonnes to separate price effects from sourcing changes."
              />
              <CountryShift />
            </Box>

            <Box component="section">
              <SectionHeading
                eyebrow="Energy trade flow"
                title="India’s energy imports and refined-product exports"
                body={`The flow view compares FY2025–26 customs values for crude oil, coal, gas, refined fuels and other petroleum products. Five-year change is summarized above the ribbons without crowding the chart.`}
              />
              <EnergyTradeTrend />
              {false ? (
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
                        industry, or a refined product exported abroad. Those are different
                        questions and need different datasets.
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
              ) : null}
            </Box>

            <Box component="section" aria-labelledby="crude-exposure-heading">
              <SectionHeading
                id="crude-exposure-heading"
                eyebrow="Exposure and resilience"
                title="India’s crude-price exposure, refining capacity and reserves"
                body="Imported volume determines how strongly global oil prices affect the bill. Refining capacity converts that crude into useful products, while strategic storage provides a limited disruption buffer."
              />
              <CrudeExposureAndResilience />
            </Box>

            <Box component="section">
              <SectionHeading
                eyebrow="From barrel to use"
                title="One imported input becomes many domestic products"
                body="The refinery sits between the customs record and the final user. That is why crude-import data cannot directly answer which vehicle consumed it."
              />
              <RefineryFlow />
            </Box>

            <Box component="section" aria-labelledby="domestic-use-heading">
              <SectionHeading
                id="domestic-use-heading"
                eyebrow="Domestic use breakdown"
                title="India’s domestic petroleum-use mix"
                body="PPAC reports consumption by petroleum product rather than by one exclusive end-use sector. This breakdown shows each product’s share of FY2025–26 consumption and connects it to the main purposes it serves."
              />
              <ConsumptionMix />
            </Box>

            <Box component="section" aria-labelledby="state-consumption-heading">
              <SectionHeading
                id="state-consumption-heading"
                eyebrow="State consumption map"
                title="State petroleum-product consumption"
                body="PPAC’s state sales data show where petroleum demand is concentrated. Toggle between total sales and sales per person to compare market scale with consumption intensity."
              />
              <StatePetroleumMap />
            </Box>

            <Box component="section" aria-labelledby="fuel-retail-heading">
              <SectionHeading
                id="fuel-retail-heading"
                eyebrow="Fuel distribution"
                title="India’s petrol-pump operators"
                body="The distribution layer is led by Indian-controlled oil marketing companies. Pump-network share provides a consistent comparison; company revenue and annual fuel volume are shown separately with their reported scope."
              />
              <FuelRetailMarket />
            </Box>

            {false ? (
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
            ) : null}

            {false ? (
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
                      <Stat
                        value="30.3%"
                        label="Russia’s latest share"
                        note="up from 2.0% in FY22"
                      />
                      <Stat
                        value="58%"
                        label="Petrol used by 2-wheelers"
                        note="2021 survey benchmark"
                      />
                    </Box>
                  </Box>
                </Paper>
              </Box>
            ) : null}

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
