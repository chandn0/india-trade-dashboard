import fs from 'fs';
import path from 'path';

const pdtPath = path.join(process.cwd(), 'app/components/products/ProductDecisionTools.js');
let pdtContent = fs.readFileSync(pdtPath, 'utf8');

const targetLogic = `  const { base, conservative, optimistic } = calculateScenarioRange(product, {
    substitution,
    exportGrowth,
    importedInputShare,
    realisation,
  });`;

const replacementLogic = `  const { base, conservative, optimistic, mostInfluentialAssumption, breakEvenInputShare } = calculateScenarioRange(product, {
    substitution,
    exportGrowth,
    importedInputShare,
    realisation,
  });

  const maxSub = product.domesticSupply?.localisableSharePct != null && product.domesticSupply.evidenceNote?.includes('structurally') 
    ? product.domesticSupply.localisableSharePct 
    : 100;
  
  const hasAuditFields = product.domesticSupply?.derivationMethod;`;

pdtContent = pdtContent.replace(targetLogic, replacementLogic);

const targetSlider = `          <ScenarioSlider
            label="Domestic import substitution"
            value={substitution}
            onChange={setSubstitution}
            help="Share of the current import line replaced"
          />`;

const replacementSlider = `          <ScenarioSlider
            label="Domestic import substitution"
            value={substitution}
            onChange={setSubstitution}
            max={maxSub}
            help={maxSub < 100 ? \`Structurally capped at \${maxSub}% by evidence constraints\` : "Share of the current import line replaced"}
          />`;

pdtContent = pdtContent.replace(targetSlider, replacementSlider);

const targetResults = `              <Typography sx={{ mt: 0.5, fontSize: 9.5, color: 'text.secondary' }}>
                Range: {moneyB(conservative.netImpact)} to {moneyB(optimistic.netImpact)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: '#f8fafc' }}>
            <Typography sx={{ fontSize: 11.5, lineHeight: 1.65 }}>
              <strong>Bridge:</strong> {moneyB(base.importReduction)} import reduction +{' '}
              {moneyB(base.exportGain)} export gain − {moneyB(base.replacementInputCost + base.exportInputCost)}{' '}
              imported inputs, then × {realisation}% realisation (±15% variance).
            </Typography>
          </Box>
          <Typography sx={{ mt: 1.25, fontSize: 10.5, color: 'text.secondary', lineHeight: 1.55 }}>
            This simplified model excludes capital cost, domestic resource constraints, price
            responses, displaced exports, and general-equilibrium effects. Use it to compare
            assumptions, not to claim a forecast.
          </Typography>`;

const replacementResults = `              <Typography sx={{ mt: 0.5, fontSize: 9.5, color: 'text.secondary' }}>
                Range: {moneyB(conservative.netImpact)} (conservative) to {moneyB(optimistic.netImpact)} (optimistic)
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
             <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(C.blue, 0.04), border: \`1px solid \${alpha(C.blue, 0.1)}\` }}>
                <Typography sx={{ fontSize: 10, color: 'text.secondary', fontWeight: 600 }}>Most Influential Assumption</Typography>
                <Typography sx={{ mt: 0.25, fontSize: 12, fontWeight: 700, color: C.blue }}>{mostInfluentialAssumption}</Typography>
                <Typography sx={{ mt: 0.25, fontSize: 10, color: 'text.secondary' }}>Drives highest variance in net impact.</Typography>
             </Box>
             <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(C.red, 0.04), border: \`1px solid \${alpha(C.red, 0.1)}\` }}>
                <Typography sx={{ fontSize: 10, color: 'text.secondary', fontWeight: 600 }}>Break-Even Bound</Typography>
                <Typography sx={{ mt: 0.25, fontSize: 12, fontWeight: 700, color: C.red }}>{breakEvenInputShare}% Imported Inputs</Typography>
                <Typography sx={{ mt: 0.25, fontSize: 10, color: 'text.secondary' }}>If inputs exceed this, net impact turns negative.</Typography>
             </Box>
          </Box>

          {!hasAuditFields && hasEnrichment && (
            <Box sx={{ mt: 2, p: 1.25, borderRadius: 1.5, bgcolor: alpha(C.red, 0.05), border: \`1px solid \${alpha(C.red, 0.2)}\` }}>
              <Typography sx={{ fontSize: 10.5, color: C.red, fontWeight: 600 }}>
                ⚠️ Low-Confidence Inputs: Results depend on assumptions without a recorded derivation method.
              </Typography>
            </Box>
          )}

          <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: '#f8fafc' }}>
            <Typography sx={{ fontSize: 11.5, lineHeight: 1.65 }}>
              <strong>Bridge:</strong> {moneyB(base.importReduction)} import reduction +{' '}
              {moneyB(base.exportGain)} export gain − {moneyB(base.replacementInputCost + base.exportInputCost)}{' '}
              imported inputs, then × {realisation}% realisation (±15% variance).
            </Typography>
          </Box>
          <Typography sx={{ mt: 1.25, fontSize: 10.5, color: 'text.secondary', lineHeight: 1.55 }}>
            Model Version 2.0 (Sensitivity Analysis). Excludes capital cost and GE effects.
          </Typography>`;

pdtContent = pdtContent.replace(targetResults, replacementResults);

fs.writeFileSync(pdtPath, pdtContent);
console.log('Updated ProductDecisionTools.js');
