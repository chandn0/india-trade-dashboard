'use client';

import Link from 'next/link';
import { ArrowBack, ExpandMore, Launch } from '@mui/icons-material';
import { Box, Button, Container, Divider, Paper, Stack, Typography } from '@mui/material';
import importData from '../../../data/india_trade_hs4_world_import_5fy.json';
import exportData from '../../../data/india_trade_hs4_world_export_5fy.json';
import partnerData from '../../../data/india_trade_partner_top_products.json';
import Footer from '../layout/Footer.js';
import Masthead from '../layout/Masthead.js';
import cardSx from '../primitives/cardSx.js';
import { C, layout, mono } from '../../theme.js';

const YEARS = ['2021-22', '2022-23', '2023-24', '2024-25', '2025-26'];

const CONFIG = {
  electronics: {
    eyebrow: 'Electronics trade brief',
    title: 'India’s electronics import stack',
    intro:
      'India now exports far more finished phones, but the production system still draws heavily on imported chips, displays, batteries and computing hardware.',
    codes: [
      '8517',
      '8542',
      '8541',
      '8471',
      '8507',
      '8473',
      '8536',
      '8529',
      '8524',
      '8534',
      '8525',
      '8504',
    ],
    hs2: '85',
    hs2Label: 'HS85',
    trendName: 'electronics',
    accent: C.blueDeep,
    products: [
      [
        '8542',
        'Electronic integrated circuits',
        'Core input',
        'Chip imports feed almost every device category; exports offset less than 1% of the bill.',
      ],
      [
        '8517',
        'Phones and telecom equipment',
        'Export engine',
        'Finished-device exports now exceed imports, the clearest evidence of assembly scale.',
      ],
      [
        '8471',
        'Computers and data-processing machines',
        'Finished goods',
        'A large import bill with limited export offset keeps computing hardware externally dependent.',
      ],
      [
        '8541',
        'Semiconductor devices',
        'Core input',
        'Diodes, transistors and photovoltaic semiconductor devices remain a component bottleneck.',
      ],
      [
        '8507',
        'Electric accumulators',
        'Scaling input',
        'Battery demand is rising across electronics, mobility and storage faster than exports.',
      ],
      [
        '8524',
        'Flat-panel display modules',
        'Core input',
        'A concentrated, import-heavy display layer sits upstream of phones, TVs and computers.',
      ],
    ],
    takeawayTitle: 'Assembly strength and component dependence coexist',
    takeaway:
      'The phone line moved to a trade surplus while chips alone produced a roughly $30.0bn deficit in FY25–26. The next layer of value creation is therefore components, not more final assembly alone.',
    stages: [
      ['Advanced inputs', 'Chips, displays and battery cells'],
      ['Components', 'Boards, cameras, power units and enclosures'],
      ['Device assembly', 'Phones, computers and communications equipment'],
      ['Markets', 'Indian demand and rapidly growing phone exports'],
    ],
    context: [
      ['18–20%', 'Estimated domestic electronics value addition'],
      ['₹12 lakh cr', 'Electronics production in FY24–25'],
      ['₹3.3 lakh cr', 'Electronics exports in FY24–25'],
      ['99.2%', 'Phones sold in India made domestically'],
    ],
    contextNote:
      'Official production indicators show strong scale-up, but value addition remains much lower than the share of phones assembled domestically.',
    officialSources: [
      [
        'PIB · electronics manufacturing and value addition',
        'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2247771&lang=1&reg=3',
      ],
      [
        'PIB · mobile manufacturing update',
        'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2284789&lang=1&reg=+3',
      ],
    ],
  },
  chemicals: {
    eyebrow: 'Chemicals trade brief',
    title: 'India’s chemicals and pharmaceutical trade',
    intro:
      'The chemicals basket spans basic industrial inputs, fertilisers, specialty chemistry and finished medicines. India’s pharmaceutical export strength sits beside large upstream material deficits.',
    prefixes: ['28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38'],
    hs2: ['28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38'],
    hs2Label: 'HS28–38',
    trendName: 'chemicals',
    accent: C.teal,
    products: [
      [
        '3105',
        'Compound and mixed fertilisers',
        'Agricultural input',
        'A large, almost entirely import-led input into Indian farm productivity.',
      ],
      [
        '2843',
        'Precious-metal compounds',
        'Advanced input',
        'Specialised compounds used across catalysts, electronics and industrial applications have little direct export offset.',
      ],
      [
        '3102',
        'Nitrogenous fertilisers',
        'Agricultural input',
        'Domestic agriculture creates a structurally large import requirement with minimal merchandise exports.',
      ],
      [
        '2902',
        'Cyclic hydrocarbons',
        'Basic chemical',
        'A major petrochemical feedstock where exports recover roughly half of import value.',
      ],
      [
        '2933',
        'Nitrogen heterocyclic compounds',
        'High-value intermediate',
        'Exports exceed imports, reflecting strength in complex intermediates used by pharmaceuticals and specialty chemicals.',
      ],
      [
        '3004',
        'Medicaments in measured doses',
        'Export engine',
        'Finished medicines are the basket’s largest export line and generate a substantial trade surplus.',
      ],
    ],
    takeawayTitle: 'Upstream deficits fund downstream export strength',
    takeaway:
      'The broad basket recorded $73.8bn of imports and $65.2bn of exports in FY25–26. Fertilisers and specialised inputs drive the gap, while measured-dose medicines alone produced more than $20bn of net exports.',
    stages: [
      ['Feedstocks', 'Minerals, hydrocarbons, gases and biological materials'],
      ['Basic chemistry', 'Acids, alkalis, fertilisers and commodity intermediates'],
      ['Specialty conversion', 'Active ingredients, dyes, coatings and crop protection'],
      ['End markets', 'Medicines, agriculture and inputs for Indian manufacturing'],
    ],
    context: [
      ['8.1%', 'Share of manufacturing GVA in FY24'],
      ['58.6 MMT', 'Selected chemicals and petrochemicals output in FY25'],
      ['83.8%', 'Selected industry capacity utilisation in FY25'],
      ['11.41 lakh', 'People engaged in 2023–24'],
    ],
    contextNote:
      'Official production statistics cover selected medium and large chemical and petrochemical units, so they describe industrial scale rather than the entire HS28–38 trade basket.',
    officialSources: [
      [
        'PIB · Economic Survey chemicals sector highlights',
        'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2220980&lang=1&reg=1',
      ],
      [
        'Department of Chemicals · Annual Report 2025–26',
        'https://chemicals.gov.in/sites/default/files/Reports/annual_report_2025-26_Eng_1.pdf',
      ],
    ],
  },
  machinery: {
    eyebrow: 'Machinery trade brief',
    title: 'India’s machinery and equipment trade',
    intro:
      'HS84 combines computers with engines, turbines, pumps and production machinery. The product view separates finished computing demand from the equipment that expands industrial capacity.',
    prefixes: ['84'],
    hs2: '84',
    hs2Label: 'HS84',
    trendName: 'machinery',
    accent: C.purple,
    products: [
      [
        '8471',
        'Computers and data-processing machines',
        'Finished equipment',
        'Computers are the chapter’s largest import line and have only a small direct export offset.',
      ],
      [
        '8479',
        'Special-purpose machinery',
        'Production equipment',
        'Machines with individual functions support many factories but remain substantially import dependent.',
      ],
      [
        '8411',
        'Turbo-jets, turbines and related equipment',
        'Export strength',
        'Exports exceed imports, making turbines one of India’s strongest complex machinery lines.',
      ],
      [
        '8473',
        'Computer and office-machine parts',
        'Component input',
        'The parts layer remains import heavy alongside the finished-computer deficit.',
      ],
      [
        '8414',
        'Pumps, compressors and fans',
        'Industrial equipment',
        'A broad enabling category with meaningful exports but less than half of imports offset.',
      ],
      [
        '8481',
        'Taps, valves and flow controls',
        'Export strength',
        'Indian exports exceed imports in a widely used industrial component category.',
      ],
    ],
    takeawayTitle: 'The chapter contains both dependence and engineering depth',
    takeaway:
      'HS84 imports reached $74.0bn against $36.6bn of exports in FY25–26. Computers created the largest single gap, while turbines and industrial valves generated trade surpluses.',
    stages: [
      ['Core inputs', 'Precision metals, controls, bearings and specialised components'],
      ['Sub-assemblies', 'Engines, pumps, transmissions and machine modules'],
      ['Capital equipment', 'Factory, process, construction and computing machinery'],
      ['Productive use', 'Infrastructure, manufacturing, services and equipment exports'],
    ],
    context: [
      ['1.9%', 'Estimated capital-goods share of GDP'],
      ['₹80,750 cr', 'Earthmoving machinery output in FY25'],
      ['₹29,716 cr', 'Printing machinery output in FY25'],
      ['₹14,286 cr', 'Machine-tool output in FY25'],
    ],
    contextNote:
      'The domestic indicators cover selected capital-goods subsectors. They are narrower than HS84, which also includes computers, domestic appliances and other mechanical equipment.',
    officialSources: [
      [
        'PIB · status of heavy industries and capital goods',
        'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2225882&lang=1&reg=3',
      ],
      [
        'Ministry of Heavy Industries · Annual Report 2025–26',
        'https://heavyindustries.gov.in/sites/default/files/2026-03/final_heavy_annual_report_2025-26_hindi_english_28_march_2026.pdf',
      ],
    ],
  },
  gems: {
    eyebrow: 'Gems and jewellery trade brief',
    title: 'India’s gems, gold and jewellery value chain',
    intro:
      'The headline import bill combines very different flows: gold for domestic demand, rough stones for processing, silver for industry and investment, and jewellery inputs for export.',
    codes: [
      '7108',
      '7102',
      '7113',
      '7106',
      '7103',
      '7101',
      '7104',
      '7105',
      '7107',
      '7109',
      '7110',
      '7111',
      '7112',
      '7114',
      '7115',
      '7116',
      '7117',
      '7118',
    ],
    hs2: '71',
    hs2Label: 'HS71',
    trendName: 'gems and jewellery',
    accent: '#7a4b2d',
    products: [
      [
        '7108',
        'Gold, unwrought or semi-manufactured',
        'Domestic demand',
        'Gold dominates the bill and has almost no direct merchandise-export offset.',
      ],
      [
        '7102',
        'Diamonds',
        'Processing input',
        'Rough stones support cutting and polishing; exports recover about three-quarters of import value.',
      ],
      [
        '7106',
        'Silver',
        'Mixed demand',
        'Industrial, jewellery and investment uses make silver different from a pure processing input.',
      ],
      [
        '7113',
        'Jewellery and parts',
        'Export output',
        'Jewellery exports substantially exceed imports, capturing value added after design and fabrication.',
      ],
      [
        '7104',
        'Synthetic or reconstructed stones',
        'Processing input',
        'A smaller line where exports slightly exceed imports.',
      ],
      [
        '7103',
        'Precious and semi-precious stones',
        'Processing input',
        'Cutting, grading and trading create an export offset, though below the import value.',
      ],
    ],
    takeawayTitle: 'The deficit is mostly gold, not a single industrial weakness',
    takeaway:
      'Gold created about $71.7bn of the FY25–26 gap. Diamonds behave differently: $16.4bn of imports supported $12.4bn of exports, while jewellery generated a $13.3bn export stream.',
    stages: [
      ['Primary inputs', 'Gold, silver, rough diamonds and coloured stones'],
      ['Processing', 'Refining, cutting, polishing, grading and certification'],
      ['Manufacturing', 'Jewellery design, fabrication and finishing'],
      ['Markets', 'Domestic savings and adornment, plus global exports'],
    ],
    context: [
      ['$72.0bn', 'FY25–26 gold imports'],
      ['$16.4bn', 'FY25–26 diamond imports'],
      ['$12.4bn', 'FY25–26 diamond exports'],
      ['$13.3bn', 'FY25–26 jewellery exports'],
    ],
    contextNote:
      'Import type matters: rough stones are productive inputs, jewellery is a downstream export, and much of gold demand serves the domestic market.',
    officialSources: [
      [
        'GJEPC · current gems and jewellery export update',
        'https://gjepc.org/news_detail.php?news=india-s-gem-jewellery-exports-stood-at-us-4-27-billion-in-april-may-2026-gjepc-flags-concerns-to-govt-on-duty-free-gold-supply-constraints-for-exporters-1',
      ],
      [
        'Department of Commerce · Annual Report',
        'https://www.commerce.gov.in/wp-content/uploads/2024/12/Annual-Report-English-Lower-Resolution.pdf',
      ],
    ],
  },
};

const rowValue = (row, year) => Number(row?.[`VAL_USD_${year}`] || 0);
const money = (value) => `$${(value / 1000).toFixed(1)}bn`;
const pct = (value) => `${value.toFixed(1)}%`;

function buildSector(config) {
  const imports = new Map(importData.map((row) => [String(row.HSCODE), row]));
  const exports = new Map(exportData.map((row) => [String(row.HSCODE), row]));
  const codes =
    config.codes ||
    Array.from(new Set([...imports.keys(), ...exports.keys()])).filter((code) =>
      config.prefixes.some((prefix) => code.startsWith(prefix)),
    );
  const hs2Codes = Array.isArray(config.hs2) ? config.hs2 : [config.hs2];
  const totals = (rows) =>
    YEARS.map((year) => codes.reduce((sum, code) => sum + rowValue(rows.get(code), year), 0));
  const importTotals = totals(imports);
  const exportTotals = totals(exports);
  const products = config.products.map(([code, label, role, note]) => {
    const imported = rowValue(imports.get(code), YEARS.at(-1));
    const exported = rowValue(exports.get(code), YEARS.at(-1));
    return {
      code,
      label,
      role,
      note,
      imported,
      exported,
      balance: exported - imported,
      coverage: imported ? (exported / imported) * 100 : 0,
    };
  });
  const partners = partnerData.partners
    .map((partner) => ({
      country: partner.country,
      value: Number(
        partner.imports.top_chapters
          .filter((chapter) => hs2Codes.includes(String(chapter.hs2)))
          .reduce((sum, chapter) => sum + Number(chapter.value_usd_mn || 0), 0),
      ),
    }))
    .filter((partner) => partner.value > 0)
    .sort((a, b) => b.value - a.value);
  const partnerTotal = partners.reduce((sum, partner) => sum + partner.value, 0);
  return {
    importTotals,
    exportTotals,
    products,
    partners: partners.map((partner) => ({
      ...partner,
      share: (partner.value / partnerTotal) * 100,
    })),
  };
}

function Stat({ label, value, note, color }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: 10 }}>
        {label}
      </Typography>
      <Typography sx={{ ...mono, mt: 0.25, fontSize: { xs: 21, md: 25 }, fontWeight: 800, color }}>
        {value}
      </Typography>
      {note && (
        <Typography sx={{ mt: 0.15, fontSize: 11.5, color: 'text.secondary' }}>{note}</Typography>
      )}
    </Box>
  );
}

function TrendChart({ imports, exports, label }) {
  const width = 760;
  const height = 270;
  const pad = { left: 58, right: 18, top: 22, bottom: 42 };
  const max = Math.max(...imports, ...exports) * 1.08;
  const x = (index) => pad.left + (index * (width - pad.left - pad.right)) / (YEARS.length - 1);
  const y = (value) => pad.top + (1 - value / max) * (height - pad.top - pad.bottom);
  const points = (values) => values.map((value, index) => `${x(index)},${y(value)}`).join(' ');
  const grid = [0, 0.5, 1];
  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Box
        component="svg"
        role="img"
        aria-label={label}
        viewBox={`0 0 ${width} ${height}`}
        sx={{ display: 'block', minWidth: 620, width: '100%', height: 'auto' }}
      >
        {grid.map((fraction) => {
          const value = max * fraction;
          return (
            <g key={fraction}>
              <line
                x1={pad.left}
                x2={width - pad.right}
                y1={y(value)}
                y2={y(value)}
                stroke={C.grid}
              />
              <text x={pad.left - 9} y={y(value) + 4} textAnchor="end" fontSize="11" fill={C.slate}>
                {money(value)}
              </text>
            </g>
          );
        })}
        <polyline points={points(imports)} fill="none" stroke={C.orange} strokeWidth="3" />
        <polyline points={points(exports)} fill="none" stroke={C.blue} strokeWidth="3" />
        {YEARS.map((year, index) => (
          <text
            key={year}
            x={x(index)}
            y={height - 13}
            textAnchor="middle"
            fontSize="11"
            fill={C.slate}
          >
            FY{year.slice(2)}
          </text>
        ))}
        {imports.map((value, index) => (
          <circle
            key={`i-${YEARS[index]}`}
            cx={x(index)}
            cy={y(value)}
            r="4"
            fill="#fff"
            stroke={C.orange}
            strokeWidth="2.5"
          />
        ))}
        {exports.map((value, index) => (
          <circle
            key={`e-${YEARS[index]}`}
            cx={x(index)}
            cy={y(value)}
            r="4"
            fill="#fff"
            stroke={C.blue}
            strokeWidth="2.5"
          />
        ))}
      </Box>
    </Box>
  );
}

function SectionHeading({ eyebrow, title, description, color }) {
  return (
    <Box sx={{ mb: layout.sectionIntroGap, maxWidth: 790 }}>
      <Typography variant="overline" sx={{ color }}>
        {eyebrow}
      </Typography>
      <Typography component="h2" variant="h4" sx={{ mt: 0.2 }}>
        {title}
      </Typography>
      {description && (
        <Typography sx={{ mt: 0.55, color: 'text.secondary', fontSize: 13.5, lineHeight: 1.6 }}>
          {description}
        </Typography>
      )}
    </Box>
  );
}

export default function TradeSectorBrief({ type }) {
  const config = CONFIG[type];
  if (!config) return null;
  const data = buildSector(config);
  const latestImports = data.importTotals.at(-1);
  const latestExports = data.exportTotals.at(-1);
  const importGrowth = (latestImports / data.importTotals[0] - 1) * 100;
  const exportGrowth = (latestExports / data.exportTotals[0] - 1) * 100;
  const sourceLinkSx = {
    color: 'text.primary',
    textUnderlineOffset: 2,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.4,
    '&:hover': { color: config.accent },
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Masthead pageTitle={config.title} backHref="/" />
      <Box component="main">
        <Container maxWidth="xl" sx={{ py: layout.pageY }}>
          <Button
            component={Link}
            href="/"
            startIcon={<ArrowBack />}
            size="small"
            sx={{ mb: 2, color: 'text.secondary' }}
          >
            Trade overview
          </Button>
          <Stack spacing={layout.sectionGap}>
            <Box component="header" sx={{ maxWidth: 960 }}>
              <Typography variant="overline" sx={{ color: config.accent }}>
                {config.eyebrow}
              </Typography>
              <Typography
                component="h1"
                variant="h2"
                sx={{ mt: 0.35, fontSize: { xs: 34, sm: 46, md: 56 }, lineHeight: 1.04 }}
              >
                {config.title}
              </Typography>
              <Typography
                sx={{
                  mt: 1.2,
                  maxWidth: 820,
                  color: 'text.secondary',
                  fontSize: { xs: 15, md: 17 },
                  lineHeight: 1.65,
                }}
              >
                {config.intro}
              </Typography>
            </Box>

            <Paper
              sx={{
                ...cardSx,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(5, 1fr)' },
                gap: { xs: 2.25, md: 3 },
              }}
            >
              <Stat label="Imports · FY25–26" value={money(latestImports)} color={C.orange} />
              <Stat label="Exports · FY25–26" value={money(latestExports)} color={C.blue} />
              <Stat
                label="Net trade gap"
                value={money(latestImports - latestExports)}
                color={C.red}
              />
              <Stat
                label="Import change"
                value={`+${pct(importGrowth)}`}
                note="since FY21–22"
                color={C.orange}
              />
              <Stat
                label="Export change"
                value={`${exportGrowth >= 0 ? '+' : ''}${pct(exportGrowth)}`}
                note="since FY21–22"
                color={exportGrowth >= 0 ? C.teal : C.red}
              />
            </Paper>

            <Box component="section">
              <SectionHeading
                eyebrow="Five-year direction"
                title="Imports, exports and the widening gap"
                description="Current US$ customs values for the selected HS-4 product group. The latest year is FY25–26."
                color={config.accent}
              />
              <Paper sx={{ ...cardSx, p: { xs: 1.5, sm: 2.5 } }}>
                <Stack direction="row" spacing={2.5} sx={{ px: 1, pb: 1 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 800, color: C.orange }}>
                    ● Imports
                  </Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 800, color: C.blue }}>
                    ● Exports
                  </Typography>
                </Stack>
                <TrendChart
                  imports={data.importTotals}
                  exports={data.exportTotals}
                  label={`Five-year ${config.trendName} import and export trend`}
                />
              </Paper>
            </Box>

            <Box component="section">
              <SectionHeading
                eyebrow="Product-level analysis"
                title="The products inside the headline total"
                description="Import value, export offset and the economic role of each large line. Coverage is exports divided by imports for the same HS-4 code."
                color={config.accent}
              />
              <Stack spacing={1}>
                {data.products.map((product) => (
                  <Paper
                    key={product.code}
                    sx={{
                      ...cardSx,
                      p: { xs: 1.75, md: 2 },
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr 1fr',
                        md: 'minmax(220px, 1.25fr) repeat(3, minmax(90px, .55fr)) minmax(260px, 1.6fr)',
                      },
                      columnGap: 2,
                      rowGap: 1.25,
                      alignItems: 'center',
                    }}
                  >
                    <Box sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}>
                      <Typography sx={{ fontSize: 13.5, fontWeight: 800 }}>
                        {product.label}
                      </Typography>
                      <Typography
                        sx={{ ...mono, mt: 0.2, fontSize: 10.5, color: 'text.secondary' }}
                      >
                        HS {product.code} · {product.role}
                      </Typography>
                    </Box>
                    <Stat label="Imports" value={money(product.imported)} color={C.orange} />
                    <Stat label="Exports" value={money(product.exported)} color={C.blue} />
                    <Stat
                      label="Export coverage"
                      value={pct(product.coverage)}
                      color={product.coverage >= 100 ? C.teal : C.ink}
                    />
                    <Typography
                      sx={{
                        gridColumn: { xs: '1 / -1', md: 'auto' },
                        fontSize: 12.5,
                        lineHeight: 1.55,
                        color: 'text.secondary',
                      }}
                    >
                      {product.note}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Box>

            <Paper
              component="aside"
              sx={{ ...cardSx, bgcolor: '#eae5da', borderLeft: `5px solid ${config.accent}` }}
            >
              <Typography variant="overline" sx={{ color: config.accent }}>
                Main finding
              </Typography>
              <Typography variant="h5" sx={{ mt: 0.25 }}>
                {config.takeawayTitle}
              </Typography>
              <Typography
                sx={{
                  mt: 0.6,
                  maxWidth: 920,
                  fontSize: 13.5,
                  lineHeight: 1.65,
                  color: 'text.secondary',
                }}
              >
                {config.takeaway}
              </Typography>
            </Paper>

            <Box component="section">
              <SectionHeading
                eyebrow="Supply chain"
                title="From imported input to Indian market"
                description="The same import total can support domestic consumption, processing, manufacturing or exports. This flow shows where value can be added."
                color={config.accent}
              />
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
                  gap: 1.25,
                }}
              >
                {config.stages.map(([title, description], index) => (
                  <Paper key={title} sx={{ ...cardSx, p: 2, position: 'relative' }}>
                    <Typography
                      sx={{ ...mono, color: config.accent, fontSize: 11, fontWeight: 800 }}
                    >
                      0{index + 1}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      {title}
                    </Typography>
                    <Typography
                      sx={{ mt: 0.45, color: 'text.secondary', fontSize: 12.5, lineHeight: 1.55 }}
                    >
                      {description}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>

            <Box component="section">
              <SectionHeading
                eyebrow="Supplier concentration"
                title="Where the chapter-level imports come from"
                description={`Share of ${config.hs2Label} imports among the major partners available in the local partner dataset. This is a directional chapter proxy, not an exact supplier split for the selected HS-4 basket.`}
                color={config.accent}
              />
              <Paper sx={cardSx}>
                <Typography
                  sx={{
                    mb: 2,
                    fontSize: 11,
                    fontWeight: 800,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: '.08em',
                  }}
                >
                  Observed major-partner share · {config.hs2Label} proxy
                </Typography>
                <Stack spacing={1.35}>
                  {data.partners.slice(0, 8).map((partner) => (
                    <Box
                      key={partner.country}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '105px 1fr 48px', sm: '150px 1fr 58px' },
                        gap: 1.25,
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 12.5,
                          fontWeight: 700,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {partner.country.replace(' P RP', '').replace(' RP', '')}
                      </Typography>
                      <Box
                        sx={{ height: 10, borderRadius: 5, bgcolor: '#ece8df', overflow: 'hidden' }}
                      >
                        <Box
                          sx={{
                            width: `${partner.share}%`,
                            height: '100%',
                            bgcolor: config.accent,
                            borderRadius: 5,
                          }}
                        />
                      </Box>
                      <Typography
                        sx={{ ...mono, fontSize: 12, fontWeight: 800, textAlign: 'right' }}
                      >
                        {pct(partner.share)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Box>

            <Box component="section">
              <SectionHeading
                eyebrow="Domestic context"
                title="Scale and value creation in India"
                description={config.contextNote}
                color={config.accent}
              />
              <Paper
                sx={{
                  ...cardSx,
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
                  gap: 2.5,
                }}
              >
                {config.context.map(([value, label]) => (
                  <Stat key={label} value={value} label={label} color={config.accent} />
                ))}
              </Paper>
            </Box>

            <Box
              component="details"
              sx={{ '&[open] summary svg': { transform: 'rotate(180deg)' } }}
            >
              <Box
                component="summary"
                sx={{
                  listStyle: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 1.5,
                  borderTop: '1px solid',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&::-webkit-details-marker': { display: 'none' },
                }}
              >
                <Typography component="h2" variant="h5">
                  Sources &amp; method
                </Typography>
                <ExpandMore sx={{ transition: 'transform .2s' }} />
              </Box>
              <Box sx={{ py: 2.5, maxWidth: 920 }}>
                <Typography sx={{ fontSize: 12.5, lineHeight: 1.65, color: 'text.secondary' }}>
                  Trade values are current US$ millions from India’s Ministry of Commerce TradeStat
                  HS-4 world tables. Sector totals sum the listed HS-4 codes; they are analytical
                  baskets rather than a claim that every code in the wider HS chapter belongs to the
                  sector. Partner shares use {config.hs2Label} chapter data for the major countries
                  captured locally, so they are labelled as a proxy.
                </Typography>
                <Divider sx={{ my: 1.75 }} />
                <Stack spacing={0.8}>
                  <Typography
                    component="a"
                    href="https://tradestat.commerce.gov.in/ftspcc/import_commodity_wise_all_countries"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TradeStat commodity trade source (opens in new tab)"
                    sx={sourceLinkSx}
                  >
                    TradeStat · HS-4 commodity trade
                    <Launch sx={{ fontSize: 12 }} />
                  </Typography>
                  <Typography
                    component="a"
                    href="https://tradestat.commerce.gov.in/eidb/country_wise_all_commodities_import"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TradeStat partner trade source (opens in new tab)"
                    sx={sourceLinkSx}
                  >
                    TradeStat · partner imports by chapter
                    <Launch sx={{ fontSize: 12 }} />
                  </Typography>
                  {config.officialSources.map(([label, href]) => (
                    <Typography
                      key={href}
                      component="a"
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label} (opens in new tab)`}
                      sx={sourceLinkSx}
                    >
                      {label}
                      <Launch sx={{ fontSize: 12 }} />
                    </Typography>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
