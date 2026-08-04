'use client';

import * as React from 'react';
import { Autocomplete, Box, Chip, Paper, Stack, TextField, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { HubRounded } from '@mui/icons-material';

import { C } from '../../theme.js';
import { moneyB } from '../../lib/format.js';
import cardSx from '../primitives/cardSx.js';

const stageColors = {
  'raw material': '#887746',
  'intermediate input': C.purple,
  'finished product': C.blue,
  'capital good': C.teal,
  'energy input': C.orange,
  'agricultural commodity': '#5f7b58',
  'consumption asset': '#9a5868',
};

const titleCase = (value = '') => value.replace(/\b\w/g, (letter) => letter.toUpperCase());
const shorten = (value = '', limit = 31) =>
  value.length > limit ? `${value.slice(0, limit - 1)}…` : value;

function GraphNode({ x, y, width, height, eyebrow, label, value, color, muted = false }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="12"
        fill={muted ? '#f8fafc' : alpha(color, 0.08)}
        stroke={muted ? '#d9e0ea' : alpha(color, 0.45)}
        strokeWidth="1.5"
      />
      <text x={x + 14} y={y + 21} fill={muted ? '#64748b' : color} fontSize="10" fontWeight="800">
        {eyebrow.toUpperCase()}
      </text>
      <text x={x + 14} y={y + 44} fill="#0c1730" fontSize="13" fontWeight="750">
        {shorten(label)}
      </text>
      {value ? (
        <text
          x={x + 14}
          y={y + height - 13}
          fill="#64748b"
          fontSize="10.5"
          fontFamily="IBM Plex Mono, monospace"
        >
          {shorten(value, 36)}
        </text>
      ) : null}
    </g>
  );
}

function curve(x1, y1, x2, y2) {
  const mid = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;
}

export default function ProductRelationshipMap({ products: allProducts }) {
  const products = React.useMemo(
    () =>
      [...allProducts]
        .filter((product) => product.latestImportUsdMn >= 1.0)
        .sort((a, b) => b.latestImportUsdMn - a.latestImportUsdMn),
    [allProducts],
  );
  const [hscode, setHscode] = React.useState('8542');
  const product = products.find((item) => item.hscode === hscode) ?? products[0];
  const productPartner = product.productPartnerExposure?.imports;
  const chapterPartners = product.chapterPartnerExposure?.imports ?? [];
  const isProxy = productPartner?.grain === 'chapter_proxy' || !productPartner;
  const suppliers = productPartner
    ? [
        [productPartner.topPartner, productPartner.topPartnerSharePct],
        [productPartner.secondPartner, productPartner.secondPartnerSharePct],
        [productPartner.thirdPartner, productPartner.thirdPartnerSharePct],
      ]
        .filter(([name]) => name)
        .map(([name, share]) => ({ name, share }))
    : chapterPartners.slice(0, 3).map((partner) => ({
        name: titleCase(partner.country.toLowerCase()),
        share: partner.sharePct,
      }));

  const stageColor = stageColors[product.productionStage] ?? C.slate;
  const netDeficit = Math.max(0, -product.netBalanceUsdMn);
  const localisable = product.domesticSupply?.analystLocalisableSharePct;
  const buildability = product.buildability;
  const exportCoverage = product.exportCoveragePct ?? 0;
  const supplierRows = suppliers.length
    ? suppliers
    : [{ name: 'Supplier evidence unavailable', share: null }];

  return (
    <Paper sx={{ ...cardSx, p: 0, overflow: 'hidden' }}>
      <Box
        sx={{
          p: { xs: 2, md: 2.5 },
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ color: C.teal }}>
            Connected-data view
          </Typography>
          <Typography variant="h5">Imported-product decision pathway</Typography>
          <Typography sx={{ mt: 0.5, maxWidth: 760, fontSize: 12.5, color: 'text.secondary' }}>
            Trace supplier exposure into the HS-4 line, its production stage, domestic lever, export
            offset, and final net-balance consequence.
          </Typography>
        </Box>
        <HubRounded sx={{ color: C.teal, fontSize: 32 }} />
      </Box>

      <Box sx={{ p: { xs: 2, md: 2.5 } }}>
        <Autocomplete
          options={products.slice(0, 300)}
          value={product}
          onChange={(_, next) => next && setHscode(next.hscode)}
          getOptionLabel={(option) =>
            `HS ${option.hscode} · ${titleCase(option.description.toLowerCase())}`
          }
          isOptionEqualToValue={(option, value) => option.hscode === value.hscode}
          renderInput={(params) => (
            <TextField {...params} size="small" label="Trace an imported product" />
          )}
          sx={{ maxWidth: 680 }}
        />

        <Box sx={{ mt: 2, overflowX: 'auto' }}>
          <Box
            component="svg"
            viewBox="0 0 1160 430"
            role="img"
            aria-label={`Relationship map for HS ${product.hscode}`}
            sx={{ display: 'block', width: '100%', minWidth: 840, height: 'auto' }}
          >
            <defs>
              <marker
                id="relationship-arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
              </marker>
            </defs>

            {supplierRows.map((supplier, index) => {
              const y = 46 + index * 91;
              return (
                <React.Fragment key={`${supplier.name}-${index}`}>
                  <path
                    d={curve(218, y + 34, 310, 183)}
                    fill="none"
                    stroke={C.blue}
                    strokeOpacity={0.45}
                    strokeWidth={supplier.share ? Math.max(1.5, supplier.share / 18) : 1.5}
                    strokeDasharray={isProxy ? '6 5' : undefined}
                    markerEnd="url(#relationship-arrow)"
                  />
                  <GraphNode
                    x={18}
                    y={y}
                    width={200}
                    height={68}
                    eyebrow={isProxy ? 'Supplier proxy' : 'Supplier'}
                    label={supplier.name}
                    value={
                      supplier.share != null
                        ? `${supplier.share.toFixed(1)}% observed share`
                        : 'No structured share'
                    }
                    color={C.blue}
                    muted={supplier.share == null}
                  />
                </React.Fragment>
              );
            })}

            <path
              d={curve(550, 183, 636, 126)}
              fill="none"
              stroke={stageColor}
              strokeWidth="3"
              markerEnd="url(#relationship-arrow)"
            />
            <path
              d={curve(802, 126, 884, 111)}
              fill="none"
              stroke={C.teal}
              strokeWidth="3"
              markerEnd="url(#relationship-arrow)"
            />
            <path
              d={curve(550, 205, 636, 306)}
              fill="none"
              stroke={C.blue}
              strokeWidth="2.5"
              markerEnd="url(#relationship-arrow)"
            />
            <path
              d={curve(802, 306, 884, 306)}
              fill="none"
              stroke={C.red}
              strokeOpacity="0.75"
              strokeWidth="2.5"
              markerEnd="url(#relationship-arrow)"
            />
            <path
              d={curve(1004, 156, 1004, 268)}
              fill="none"
              stroke={C.teal}
              strokeWidth="2"
              strokeDasharray="5 5"
              markerEnd="url(#relationship-arrow)"
            />

            <GraphNode
              x={310}
              y={135}
              width={240}
              height={96}
              eyebrow={`HS ${product.hscode}`}
              label={titleCase(product.description.toLowerCase())}
              value={`${moneyB(product.latestImportUsdMn)} imports`}
              color={C.orange}
            />
            <GraphNode
              x={636}
              y={82}
              width={166}
              height={88}
              eyebrow="Production stage"
              label={titleCase(product.productionStage)}
              value={
                product.reviewStatus === 'needs review'
                  ? 'Rule-mapped'
                  : titleCase(product.reviewStatus)
              }
              color={stageColor}
            />
            <GraphNode
              x={884}
              y={66}
              width={240}
              height={90}
              eyebrow="Domestic lever"
              label={buildability ? titleCase(buildability.lever) : 'Evidence unavailable'}
              value={
                localisable != null
                  ? `${localisable}% analyst-localisable ceiling`
                  : buildability
                    ? `${titleCase(buildability.category)} (Rule-based screen)`
                    : 'No capability estimate'
              }
              color={C.teal}
              muted={!buildability}
            />
            <GraphNode
              x={636}
              y={268}
              width={166}
              height={76}
              eyebrow="Export offset"
              label={moneyB(product.latestExportUsdMn)}
              value={
                exportCoverage > 999
                  ? '>999% of imports'
                  : `${exportCoverage.toFixed(1)}% of imports`
              }
              color={C.blue}
            />
            <GraphNode
              x={884}
              y={268}
              width={240}
              height={76}
              eyebrow="Net balance"
              label={
                product.netBalanceUsdMn >= 0
                  ? `+${moneyB(product.netBalanceUsdMn)}`
                  : `−${moneyB(netDeficit)}`
              }
              value={
                product.netBalanceUsdMn >= 0 ? 'HS-4 surplus' : 'HS-4 deficit after export offset'
              }
              color={product.netBalanceUsdMn >= 0 ? C.teal : C.red}
            />
          </Box>
        </Box>

        <Stack direction="row" spacing={1} useFlexGap sx={{ mt: 1, flexWrap: 'wrap' }}>
          <Chip
            size="small"
            label={
              isProxy
                ? 'Dashed supplier links = proxy grain'
                : 'Solid supplier links = HS-4 evidence'
            }
          />
          <Chip
            size="small"
            label={`Import type: ${titleCase(product.productionStage)}`}
            sx={{ color: stageColor, bgcolor: alpha(stageColor, 0.08) }}
          />
          <Chip
            size="small"
            label={
              buildability
                ? localisable != null
                  ? `${titleCase(buildability.category)} · ${titleCase(buildability.timeHorizon)}`
                  : `${titleCase(buildability.category)} (Rule-based screen)`
                : 'Buildability unavailable'
            }
            sx={{ color: C.teal, bgcolor: alpha(C.teal, 0.08) }}
          />
        </Stack>
      </Box>
    </Paper>
  );
}
