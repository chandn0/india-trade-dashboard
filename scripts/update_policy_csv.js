import fs from 'fs';
import path from 'path';

const policyPath = path.join(process.cwd(), 'data', 'enrichment', 'product_policy.csv');

const csvData = `hscode,exact_affected_scope,measure_type,effective_date,expiry_review_date,primary_source,last_verification_date,status
8542,Chip design and ATMP,PLI Incentive,2025-02-01,2030-02-01,https://www.meity.gov.in/ism,2026-02-01,Active
8541,"Solar Cells (8541.42), PV Modules (8541.43)","ALMM Domestic Mandate / PLI",2025-02-01,2028-02-01,https://mnre.gov.in/solar/almm,2026-02-01,Active
8517,"Smartphones (8517.13), Parts (8517.70)","PLI LSEM / BIS QCO",2023-04-01,2028-04-01,https://www.meity.gov.in/writereaddata/files/PLI_for_Large_Scale_Electronics_Manufacturing.pdf,2026-02-01,Active
8471,"Laptops, Tablets, Servers","Import Monitoring System / PLI IT Hardware",2023-08-01,2029-08-01,https://www.meity.gov.in/writereaddata/files/Production%20Linked%20Scheme%202.0%20for%20IT%20Hardware%20notification_0.pdf,2026-02-01,Active
8507,Li-ion Cells (8507.60),PLI ACC,2025-02-01,2030-02-01,https://dhi.nic.in/uploadfiles/MFiles/PLI-ACC.pdf,2026-02-01,Active
1511,Crude Palm Oil,Tariff Adjustment / NMEO-OP,2024-09-01,2027-09-01,https://www.cbic.gov.in,2026-06-15,Active
1507,Crude Soybean Oil,Tariff Adjustment,2024-09-01,2027-09-01,https://www.cbic.gov.in,2026-06-15,Active
1512,Crude Sunflower Oil,Tariff Adjustment,2024-09-01,2027-09-01,https://www.cbic.gov.in,2026-06-15,Active
1201,Soybeans,Non-GM Certification / Tariff,2025-01-01,2026-06-15,https://www.cbic.gov.in,2026-06-15,Active
3105,DAP,Nutrient Based Subsidy (NBS),2025-01-01,2026-06-15,https://fert.nic.in,2026-06-15,Active
3102,Urea,Urea Subsidy Scheme / STE Restriction,2025-01-01,2026-06-15,https://fert.nic.in,2026-06-15,Active
7108,Gold,Tariff Adjustment (15% to 6%),2024-07-23,2025-07-23,https://www.cbic.gov.in,2026-07-01,Active
`;

fs.writeFileSync(policyPath, csvData);
console.log('Updated product_policy.csv with new evidence contract schema.');
