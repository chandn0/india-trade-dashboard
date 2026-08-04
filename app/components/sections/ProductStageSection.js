'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ArrowForwardRounded, InfoOutlined } from '@mui/icons-material';

import stageData from '../../../data/product_stage_summary.json';
import { C, mono } from '../../theme.js';
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

const titleCase = (value) => value.replace(/\b\w/g, (letter) => letter.toUpperCase());

function StageLegend({ stages, selected, onSelect }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
      {stages.map((stage) => {
        const color = stageColors[stage.stage];
        const active = !selected || selected === stage.stage;
        return (
          <Chip
            key={stage.stage}
            size="small"
            onClick={() => onSelect(selected === stage.stage ? '' : stage.stage)}
            label={`${titleCase(stage.stage)} · ${stage.sharePct.toFixed(1)}%`}
            sx={{
              minHeight: 30,
              color: active ? color : 'text.secondary',
              bgcolor: active ? alpha(color, 0.1) : '#f1f5f9',
              opacity: active ? 1 : 0.55,
              border: `1px solid ${active ? alpha(color, 0.22) : 'transparent'}`,
            }}
          />
        );
      })}
    </Box>
  );
}

function FlowPanel({ flow }) {
  const [selectedStage, setSelectedStage] = React.useState('');
  const products = selectedStage
    ? flow.products.filter((product) => product.productionStage === selectedStage)
    : flow.products;
  const accent = flow.flow === 'Imports' ? C.orange : C.blue;
  const displayStages = flow.topStages ?? flow.stages;

  return (
    <Paper sx={{ ...cardSx, p: 0, overflow: 'hidden' }}>
      <Box sx={{ p: { xs: 2, md: 2.5 }, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            alignItems: 'flex-start',
          }}
        >
          <Box>
            <Typography variant="overline" sx={{ color: accent }}>
              {flow.flow} · FY{stageData.metadata.fiscalYear}
            </Typography>
            <Typography component="h3" variant="h5">
              {flow.flow} by production stage
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
            <Typography sx={{ ...mono, fontSize: 19, fontWeight: 800 }}>
              {moneyB(flow.classifiedUsdMn)}
            </Typography>
            <Tooltip
              title="Share of the complete HS-4 trade flow represented by these 40 classified lines."
              arrow
            >
              <Typography sx={{ fontSize: 10.5, color: 'text.secondary' }}>
                {flow.coveragePct.toFixed(1)}% flow coverage{' '}
                <InfoOutlined sx={{ fontSize: 11, verticalAlign: '-2px' }} />
              </Typography>
            </Tooltip>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 2,
            display: 'flex',
            height: 18,
            overflow: 'hidden',
            borderRadius: 99,
            bgcolor: '#e2e8f0',
          }}
          aria-label={`${flow.flow} stage distribution`}
        >
          {displayStages.map((stage) => (
            <Tooltip
              key={stage.stage}
              title={`${titleCase(stage.stage)}: ${moneyB(stage.valueUsdMn)} (${stage.sharePct.toFixed(1)}%)`}
              arrow
            >
              <Box
                sx={{
                  width: `${stage.sharePct}%`,
                  minWidth: stage.sharePct > 0 ? 3 : 0,
                  bgcolor: stageColors[stage.stage],
                  opacity: selectedStage && selectedStage !== stage.stage ? 0.25 : 1,
                  transition: 'opacity 150ms',
                  borderRight: '1px solid rgba(255,255,255,0.65)',
                }}
              />
            </Tooltip>
          ))}
        </Box>
        <Box sx={{ mt: 1.5 }}>
          <StageLegend
            stages={displayStages}
            selected={selectedStage}
            onSelect={setSelectedStage}
          />
        </Box>
      </Box>

      <TableContainer sx={{ maxHeight: 485 }}>
        <Table stickyHeader size="small" sx={{ tableLayout: { xs: 'fixed', sm: 'auto' } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: { xs: '72%', sm: 'auto' } }}>Attributed product</TableCell>
              <TableCell align="right" sx={{ width: { xs: '28%', sm: 'auto' } }}>
                Value
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Stage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              const color = stageColors[product.productionStage];
              return (
                <Tooltip
                  key={product.hscode}
                  title={product.attributionReason}
                  placement="top-start"
                  arrow
                >
                  <TableRow hover>
                    <TableCell sx={{ px: { xs: 1.5, sm: 2 } }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography sx={{ ...mono, fontSize: 11, fontWeight: 800, color: accent }}>
                          {product.hscode}
                        </Typography>
                        <Typography sx={{ fontSize: 11.5, fontWeight: 700, lineHeight: 1.35 }}>
                          {titleCase(product.description.toLowerCase())}
                          <Box
                            component="span"
                            sx={{
                              display: { xs: 'block', sm: 'none' },
                              mt: 0.35,
                              color,
                              fontSize: 10,
                              fontWeight: 800,
                            }}
                          >
                            {titleCase(product.productionStage)}
                          </Box>
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ ...mono, fontSize: 11.5, fontWeight: 800, whiteSpace: 'nowrap' }}
                    >
                      {moneyB(product.valueUsdMn)}
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      <Chip
                        size="small"
                        label={titleCase(product.productionStage)}
                        sx={{ color, bgcolor: alpha(color, 0.1), whiteSpace: 'nowrap' }}
                      />
                    </TableCell>
                  </TableRow>
                </Tooltip>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{ px: 2, py: 1.25, borderTop: '1px solid', borderColor: 'divider', bgcolor: '#f8fafc' }}
      >
        <Typography sx={{ fontSize: 10.5, color: 'text.secondary' }}>
          {selectedStage
            ? `${products.length} ${selectedStage} lines · click the stage again to show all 40`
            : 'Hover a row for its attribution rationale · select a stage to isolate it'}
        </Typography>
      </Box>
    </Paper>
  );
}

export default function ProductStageSection() {
  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
          alignItems: 'flex-end',
          flexWrap: 'wrap',
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ color: C.purple }}>
            Product composition
          </Typography>
          <Typography component="h2" variant="h4">
            India’s traded product stages
          </Typography>
          <Typography
            sx={{
              mt: 0.75,
              maxWidth: 840,
              fontSize: 13.5,
              lineHeight: 1.65,
              color: 'text.secondary',
            }}
          >
            The same dollar value means different things depending on whether it is crude feedstock,
            a factory component, productive machinery, or a consumer-ready product. These views
            classify the 40 largest HS-4 lines on each side and make every attribution inspectable.
          </Typography>
        </Box>
        <Button
          component={Link}
          href="/products"
          variant="contained"
          endIcon={<ArrowForwardRounded />}
        >
          Open full product workspace
        </Button>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '1fr 1fr' }, gap: 2 }}>
        {stageData.flows.map((flow) => (
          <FlowPanel key={flow.flow} flow={flow} />
        ))}
      </Box>
      <Paper sx={{ ...cardSx, py: 1.5, bgcolor: alpha(C.purple, 0.035) }}>
        <Typography sx={{ fontSize: 11.5, lineHeight: 1.55, color: 'text.secondary' }}>
          <strong>Classification note:</strong> HS-4 headings can contain mixed end uses. The
          assigned stage reflects the dominant economic use at this aggregation level, and the
          row-level rationale is stored in the classification CSV. This is a transparent analytical
          layer, not an official Government of India classification.
        </Typography>
      </Paper>
    </Stack>
  );
}
