'use client';

import * as React from 'react';
import { toneColor } from '../../theme.js';
import { PARTNER_COMPS } from '../../lib/transforms.js';
import CompositionChart from './CompositionChart.js';
import ToggleChips from '../primitives/ToggleChips.js';

export default function PartnerShareCard() {
  const [metric, setMetric] = React.useState('total');
  const META = {
    total: { side: 'Total trade', tone: 'success' },
    exp: { side: 'Exports', tone: 'primary' },
    imp: { side: 'Imports', tone: 'warning' },
  };
  return (
    <CompositionChart
      title="Partner share of trade over time"
      sideLabel={META[metric].side}
      tone={META[metric].tone}
      comp={PARTNER_COMPS[metric]}
      groupNoun="partner countries"
      controls={
        <ToggleChips
          options={[
            ['total', 'Total trade'],
            ['exp', 'Exports'],
            ['imp', 'Imports'],
          ]}
          value={metric}
          onChange={setMetric}
          colorFor={(k) => toneColor(META[k].tone)}
        />
      }
    />
  );
}
