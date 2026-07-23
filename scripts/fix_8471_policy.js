import fs from 'fs';
import path from 'path';

const policyPath = path.join(process.cwd(), 'data/enrichment/product_policy.csv');
let content = fs.readFileSync(policyPath, 'utf8');

const targetLine = '8471,2023-04-01,"8471.30 (Laptops), 8471.41 (Subassemblies)",0% - 20%,,,ASEAN FTA: subassembly components at 0-5%,"PLI for IT Hardware: Rs 7,325 cr for laptops, tablets and servers; limited uptake",Yes — laptops and tablets subject to BIS QCO from Oct 2023; import licensing introduced Aug 2023 (paused for review),None,Import monitoring; prior licensing paused,"20% BCD raised from 0% in Union Budget 2023 to incentivise domestic manufacturing. QCO effective Oct 2023. Import licensing order (Category B) introduced Aug 2023 but paused pending review.",https://www.meity.gov.in/writereaddata/files/PLI_IT_Hardware.pdf,2026-02-01';

const replacementLine = '8471,2023-04-01,8471 (IT Hardware / ADP Machines),0%,,,ITA-1 zero-duty regime,"PLI for IT Hardware: Rs 7,325 cr for laptops, tablets and servers; limited uptake","Yes — laptops and tablets subject to BIS QCO from Oct 2023; import licensing introduced Aug 2023 (paused for review)",None,Import monitoring; prior licensing paused,"Covered under the WTO Information Technology Agreement (ITA-1) at 0% basic customs duty. QCO effective Oct 2023. Import licensing order (Category B) introduced Aug 2023 but paused pending review (replaced with import monitoring system).",https://www.meity.gov.in/writereaddata/files/Production%20Linked%20Scheme%202.0%20for%20IT%20Hardware%20notification_0.pdf,2026-02-01';

content = content.replace(targetLine, replacementLine);
fs.writeFileSync(policyPath, content);
console.log('Fixed 8471 policy');
