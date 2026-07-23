import fs from 'fs';
import path from 'path';

const domPath = path.join(process.cwd(), 'data/enrichment/product_domestic_supply.csv');
let content = fs.readFileSync(domPath, 'utf8');

const target1511 = '1511,2024-25,300000,metric_tonnes,9400000,3.2,96.8,400000,,,,,"Domestic oil palm cultivation is highly constrained by water requirements. The National Mission on Edible Oils - Oil Palm (NMEO-OP) targets 1M ha expansion, primarily in North East and Andaman, but gestation is 4-5 years and ecological concerns persist.",https://agricoop.nic.in/en/nmeo-op,2026-06-15';
const rep1511 = '1511,2024-25,300000,metric_tonnes,9400000,3.2,96.8,400000,,Crude and refined oil,"Analyst assumption based on NMEO-OP target (max +2.8M MT = ~30% cap)",NMEO-OP Guidelines,"Domestic oil palm cultivation is highly constrained by water requirements. The National Mission on Edible Oils - Oil Palm (NMEO-OP) targets 1M ha expansion, primarily in North East and Andaman, but gestation is 4-5 years and ecological concerns persist. Absolute substitution capped structurally.",https://agricoop.nic.in/en/nmeo-op,2026-06-15';

const target1507 = '1507,2024-25,1800000,metric_tonnes,5400000,33.4,66.6,2500000,,,,,Domestic soybean oil production relies on local seed crush. Yields for soya beans (HS 1201) are stagnant at ~1 MT/ha compared to global 3 MT/ha. Expansion is limited by rainfed cultivation and lack of GM seed approval.,https://agricoop.nic.in/,2026-06-15';
const rep1507 = '1507,2024-25,1800000,metric_tonnes,5400000,33.4,66.6,2500000,,Crude and refined oil,Analyst assumption based on stagnating seed yield,Agricoop Yield Data,"Domestic soybean oil production relies on local seed crush. Yields for soya beans (HS 1201) are stagnant at ~1 MT/ha compared to global 3 MT/ha. Expansion is limited by rainfed cultivation and lack of GM seed approval.",https://agricoop.nic.in/,2026-06-15';

const target1512 = '1512,2024-25,300000,metric_tonnes,3200000,9.4,90.6,500000,,,,,Sunflower cultivation has declined in India (primarily Karnataka/Maharashtra) due to vulnerability to pests and climate variability. Domestic crush yields very little oil relative to the massive import demand.,https://agricoop.nic.in/,2026-06-15';
const rep1512 = '1512,2024-25,300000,metric_tonnes,3200000,9.4,90.6,500000,,Crude and refined oil,Analyst assumption based on historical planting decline,Agricoop Area Sown Data,"Sunflower cultivation has declined in India (primarily Karnataka/Maharashtra) due to vulnerability to pests and climate variability. Domestic crush yields very little oil relative to the massive import demand.",https://agricoop.nic.in/,2026-06-15';

const target1201 = '1201,2024-25,13000000,metric_tonnes,13100000,98.9,1.1,,,,,,"India is self-sufficient in soybean seeds for direct crush, but the absolute volume is insufficient to meet the vegetable oil demand. The crop competes with other Kharif crops for land.",https://agricoop.nic.in/,2026-06-15';
const rep1201 = '1201,2024-25,13000000,metric_tonnes,13100000,98.9,1.1,,,Oilseed production,Reported domestic crop estimates,Kharif Crop Estimates,"India is self-sufficient in soybean seeds for direct crush, but the absolute volume is insufficient to meet the vegetable oil demand. The crop competes with other Kharif crops for land.",https://agricoop.nic.in/,2026-06-15';

content = content.replace(target1511, rep1511);
content = content.replace(target1507, rep1507);
content = content.replace(target1512, rep1512);
content = content.replace(target1201, rep1201);

fs.writeFileSync(domPath, content);
console.log('Updated product_domestic_supply.csv');
