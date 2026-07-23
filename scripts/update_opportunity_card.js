import fs from 'fs';
import path from 'path';

const cardPath = path.join(process.cwd(), 'app/components/products/OpportunityEvidenceCard.js');
let cardContent = fs.readFileSync(cardPath, 'utf8');

const target = `<StageChip stage={selected.productionStage} />`;
const replacement = `<StageChip stage={selected.productionStage} />
          {selected.partnerRiskFlag && (
            <Chip
              size="small"
              label="Partner Risk"
              sx={{
                height: 22,
                fontWeight: 700,
                color: '#b91c1c',
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}
            />
          )}`;

cardContent = cardContent.replace(target, replacement);

fs.writeFileSync(cardPath, cardContent);
console.log('Added partner risk flag to OpportunityEvidenceCard.js');
