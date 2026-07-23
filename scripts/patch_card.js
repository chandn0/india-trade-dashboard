import fs from 'fs';
import path from 'path';

const p = 'app/components/products/OpportunityEvidenceCard.js';
let content = fs.readFileSync(p, 'utf8');

// 1. Scenario variables
content = content.replace(
  /const substitution = selected\.domesticSupply\?\.importDependencePct != null\s*\n\s*\? Math\.max\(0, 100 - selected\.domesticSupply\.importDependencePct\)\s*\n\s*: 20;/m,
  `const substitution = selected.domesticSupply?.localisableSharePct != null 
    ? selected.domesticSupply.localisableSharePct 
    : 20;`
);

content = content.replace(
  /const importedInputShare = selected\.domesticSupply\?\.importDependencePct != null\s*\n\s*\? selected\.domesticSupply\.importDependencePct\s*\n\s*: 35;/m,
  `const importedInputShare = selected.domesticSupply?.replacementImportedInputPct != null 
    ? selected.domesticSupply.replacementImportedInputPct 
    : 35;`
);

// 2. Partner concentration naming & structure
// Replace `partnerConcentration` references with `chapterPartnerExposure`
content = content.replace(/selected\.partnerConcentration/g, 'selected.chapterPartnerExposure');
// Fix the section title
content = content.replace(
  />\s*Partner concentration\s*<\/Typography>/m,
  '>\n            Chapter {selected.chapterPartnerExposure.grain.replace("HS-", "")} Top Partners\n          </Typography>'
);

// 3. Capacity section
const oldCapSection = `          <Box sx={{ mt: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            {selected.domesticSupply.domesticProduction !== null && (
              <Box>
                <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>Production</Typography>
                <Typography sx={{ ...mono, fontSize: 14, fontWeight: 800 }}>
                  {moneyB(selected.domesticSupply.domesticProduction)}
                </Typography>
              </Box>
            )}
            {selected.domesticSupply.importDependencePct !== null && (
              <Box>
                <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>Import dependence</Typography>
                <Typography sx={{ ...mono, fontSize: 14, fontWeight: 800, color: C.red }}>
                  {selected.domesticSupply.importDependencePct}%
                </Typography>
              </Box>
            )}
          </Box>`;

const newCapSection = `          <Box sx={{ mt: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            {selected.domesticSupply.domesticProduction !== null ? (
              <Box>
                <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>Production {selected.domesticSupply.productionScope && \`(\${selected.domesticSupply.productionScope})\`}</Typography>
                <Typography sx={{ ...mono, fontSize: 14, fontWeight: 800 }}>
                  {moneyB(selected.domesticSupply.domesticProduction)}
                </Typography>
              </Box>
            ) : (
              <Box>
                <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>Production</Typography>
                <Typography sx={{ ...mono, fontSize: 12, fontWeight: 600 }}>Evidence unavailable</Typography>
              </Box>
            )}
            {selected.domesticSupply.localisableSharePct !== null && (
              <Box>
                <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>Localisable Share</Typography>
                <Typography sx={{ ...mono, fontSize: 14, fontWeight: 800, color: C.teal }}>
                  {selected.domesticSupply.localisableSharePct}%
                </Typography>
              </Box>
            )}
          </Box>`;
content = content.replace(oldCapSection, newCapSection);

// 4. Policy section
// we have {selected.policyOverlay.bcdPct !== null && ( ... )}
// and we want to change it to show bcdRange if available
content = content.replace(
  /\{selected\.policyOverlay\.bcdPct !== null && \(\s*<Chip size="small" label={`BCD \$\{selected\.policyOverlay\.bcdPct\}%`} variant="outlined" \/>\s*\)\}/,
  `{selected.policyOverlay.bcdRange ? (
                <Chip size="small" label={\`BCD \${selected.policyOverlay.bcdRange}\`} variant="outlined" />
              ) : selected.policyOverlay.bcdPct !== null ? (
                <Chip size="small" label={\`BCD \${selected.policyOverlay.bcdPct}%\`} variant="outlined" />
              ) : null}
              {selected.policyOverlay.applicableHs6 && (
                <Typography sx={{ fontSize: 10, color: 'text.secondary', alignSelf: 'center', ml: 0.5 }}>
                  (Applies to {selected.policyOverlay.applicableHs6})
                </Typography>
              )}`
);


fs.writeFileSync(p, content);
console.log('Patched OpportunityEvidenceCard.js');
