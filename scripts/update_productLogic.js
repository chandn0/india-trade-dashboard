import fs from 'fs';
import path from 'path';

const logicPath = path.join(process.cwd(), 'app/lib/productLogic.js');
let content = fs.readFileSync(logicPath, 'utf8');

const target = `export function calculateScenarioRange(
  product,
  { substitution, exportGrowth, importedInputShare, realisation },
) {
  const base = calculateScenario(product, { substitution, exportGrowth, importedInputShare, realisation });
  const conservative = calculateScenario(product, { substitution, exportGrowth, importedInputShare, realisation: Math.max(0, realisation - 15) });
  const optimistic = calculateScenario(product, { substitution, exportGrowth, importedInputShare, realisation: Math.min(100, realisation + 15) });
  
  return {
    base,
    conservative,
    optimistic,
  };
}`;

const replacement = `export function calculateScenarioRange(
  product,
  { substitution, exportGrowth, importedInputShare, realisation },
) {
  const base = calculateScenario(product, { substitution, exportGrowth, importedInputShare, realisation });
  const conservative = calculateScenario(product, { substitution, exportGrowth, importedInputShare, realisation: Math.max(0, realisation - 15) });
  const optimistic = calculateScenario(product, { substitution, exportGrowth, importedInputShare, realisation: Math.min(100, realisation + 15) });
  
  // Calculate sensitivities (+1 point absolute change)
  const dSub = Math.abs(calculateScenario(product, { substitution: substitution + 1, exportGrowth, importedInputShare, realisation }).netImpact - base.netImpact);
  const dExp = Math.abs(calculateScenario(product, { substitution, exportGrowth: exportGrowth + 1, importedInputShare, realisation }).netImpact - base.netImpact);
  const dInp = Math.abs(calculateScenario(product, { substitution, exportGrowth, importedInputShare: importedInputShare + 1, realisation }).netImpact - base.netImpact);
  const dReal = Math.abs(calculateScenario(product, { substitution, exportGrowth, importedInputShare, realisation: realisation + 1 }).netImpact - base.netImpact);

  const sensitivities = [
    { name: 'Substitution limit', value: dSub },
    { name: 'Export growth', value: dExp },
    { name: 'Imported input share', value: dInp },
    { name: 'Execution realisation', value: dReal }
  ];
  
  sensitivities.sort((a, b) => b.value - a.value);
  const mostInfluentialAssumption = sensitivities[0].name;

  return {
    base,
    conservative,
    optimistic,
    mostInfluentialAssumption,
    breakEvenInputShare: 100 // At 100% imported input, the gross movement is fully cancelled out
  };
}`;

content = content.replace(target, replacement);

fs.writeFileSync(logicPath, content);
console.log('Updated productLogic.js');
