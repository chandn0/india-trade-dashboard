import fs from 'fs';
import path from 'path';

const cardPath = path.join(process.cwd(), 'app/components/products/OpportunityEvidenceCard.js');
let cardContent = fs.readFileSync(cardPath, 'utf8');

const targetExplanation = `        <Box sx={{ mt: 1.5, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>`;

const replacementExplanation = `        <Box sx={{ mt: 1.5, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>`;
// Wait, I want to add the explanation box below the title.

const fullTargetHeader = `      <Box sx={{ pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography sx={{ ...mono, fontSize: 11, fontWeight: 800, color: accent }}>
              HS {selected.hscode} · {flowName} rank #{selected[rankKey]}
            </Typography>
            <Typography variant="h5" sx={{ mt: 0.5, lineHeight: 1.2 }}>
              {titleCase(selected.description.toLowerCase())}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 1.5, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>`;

const fullReplacementHeader = `      <Box sx={{ pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography sx={{ ...mono, fontSize: 11, fontWeight: 800, color: accent }}>
              HS {selected.hscode} · {flowName} rank #{selected[rankKey]}
            </Typography>
            <Typography variant="h5" sx={{ mt: 0.5, lineHeight: 1.2 }}>
              {titleCase(selected.description.toLowerCase())}
            </Typography>
          </Box>
        </Box>

        {/* 0. Score / Ranking Explanation */}
        <Box sx={{ mt: 1.5, p: 1.25, borderRadius: 1.5, bgcolor: alpha(accent, 0.04), border: \`1px solid \${alpha(accent, 0.15)}\` }}>
           <Typography sx={{ fontSize: 10, fontWeight: 700, color: accent, textTransform: 'uppercase' }}>Why this ranks #{selected[rankKey]}</Typography>
           <Typography sx={{ mt: 0.5, fontSize: 11.5, color: 'text.secondary', lineHeight: 1.4 }}>
             Ranked primarily by gross {flowName.toLowerCase()} value ({moneyB(flowName === 'Imports' ? selected.latestImportUsdMn : selected.latestExportUsdMn)}).
             Tractability is influenced by its stage ({selected.productionStage}) and review status ({selected.reviewStatus}).
           </Typography>
        </Box>

        <Box sx={{ mt: 1.5, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>`;

cardContent = cardContent.replace(fullTargetHeader, fullReplacementHeader);

// Add evidence completeness at the bottom.
const targetBottom = `      {/* 6: Domestic capacity/production */}`;

const completenessSnippet = `      {/* Evidence Completeness Indicators */}
      <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid', borderColor: 'divider' }}>
        <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Evidence Completeness
        </Typography>
        <Box sx={{ mt: 1.5, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             <Typography sx={{ fontSize: 14 }}>{selected.quantityUnitValue ? '🟢' : '🔴'}</Typography>
             <Typography sx={{ fontSize: 11, fontWeight: 600 }}>Trade/Price</Typography>
           </Box>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             <Typography sx={{ fontSize: 14 }}>{selected.productPartnerExposure || selected.chapterPartnerExposure ? '🟢' : '🔴'}</Typography>
             <Typography sx={{ fontSize: 11, fontWeight: 600 }}>Partner</Typography>
           </Box>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             <Typography sx={{ fontSize: 14 }}>{selected.domesticSupply ? '🟢' : '🔴'}</Typography>
             <Typography sx={{ fontSize: 11, fontWeight: 600 }}>Domestic Supply</Typography>
           </Box>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             <Typography sx={{ fontSize: 14 }}>{selected.policyOverlay ? '🟢' : '🔴'}</Typography>
             <Typography sx={{ fontSize: 11, fontWeight: 600 }}>Policy</Typography>
           </Box>
        </Box>
      </Box>

      {/* 6: Domestic capacity/production */}`;

cardContent = cardContent.replace(targetBottom, completenessSnippet);

fs.writeFileSync(cardPath, cardContent);
console.log('Updated OpportunityEvidenceCard.js');
