import fs from 'fs';
import path from 'path';

const cardPath = path.join(process.cwd(), 'app/components/products/OpportunityEvidenceCard.js');
let cardContent = fs.readFileSync(cardPath, 'utf8');

const targetState = `{/* 6: Domestic capacity/production */}
      {selected.domesticSupply ? (`;

const replacementState = `{/* 5.5: State Capability */
      selected.stateCapability && selected.stateCapability.length > 0 && (
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(C.teal, 0.04), border: \`1px solid \${alpha(C.teal, 0.2)}\` }}>
          <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: C.teal, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            State Capability
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {selected.stateCapability.map((state, idx) => (
              <Box key={idx} sx={{ p: 1, bgcolor: '#fff', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                <Typography sx={{ fontSize: 11, fontWeight: 800 }}>{state.state}</Typography>
                <Box sx={{ mt: 0.5, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                  <Box>
                    <Typography sx={{ fontSize: 9, color: 'text.secondary' }}>Observed Production</Typography>
                    <Typography sx={{ ...mono, fontSize: 11.5, fontWeight: 600 }}>{moneyB(state.observedProductionUsdMn)}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 9, color: 'text.secondary' }}>Announced Capacity</Typography>
                    <Typography sx={{ ...mono, fontSize: 11.5, fontWeight: 600 }}>{moneyB(state.announcedCapacityUsdMn)}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 9, color: 'text.secondary' }}>Investment</Typography>
                    <Typography sx={{ ...mono, fontSize: 11.5, fontWeight: 600 }}>{moneyB(state.investmentUsdMn)}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 9, color: 'text.secondary' }}>Employment</Typography>
                    <Typography sx={{ ...mono, fontSize: 11.5, fontWeight: 600 }}>{state.employment.toLocaleString()}</Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* 6: Domestic capacity/production */}
      {selected.domesticSupply ? (`;

cardContent = cardContent.replace(targetState, replacementState);

fs.writeFileSync(cardPath, cardContent);
console.log('Updated State Capability UI in OpportunityEvidenceCard.js');
