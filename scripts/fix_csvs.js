import fs from 'fs';
import path from 'path';

// Fix product_policy.csv
const policyPath = path.join(process.cwd(), 'data/enrichment/product_policy.csv');
const policyData = [
  ['hscode','effective_from','applicable_hs6','bcd_range','basic_customs_duty_pct','effective_tariff_pct','fta_preference','pli_coverage','qco_coverage','trade_remedy','restriction_status','evidence_note','source_url','source_date'],
  ['8542','2025-02-01','','','','','ASEAN FTA 0%; CEPA Singapore 0%','India Semiconductor Mission PLI (chip design and ATMP); $10bn ISM incentive pool','No','None','Unrestricted','Zero BCD maintained to support electronics manufacturing cost-competitiveness. ISM PLI covers design companies and ATMP operations.','https://www.cbic.gov.in/resources/htdocs-cbec/customs/cs-act/formatted-htmls/cst-sch1.pdf','2026-02-01'],
  ['8541','2025-02-01','8541.42 (Solar Cells), 8541.43 (PV Modules)','0% - 25%','','','ASEAN FTA 0%','ISM PLI for compound semiconductors; ALMM scheme for solar cells (8541.42) mandates domestic procurement','No','None','Unrestricted','Solar cells (8541.42) under ALMM: domestic purchase mandate for government-funded projects. Non-solar semiconductor devices at 0% BCD.','https://mnre.gov.in/solar/almm','2026-02-01'],
  ['8517','2023-04-01','','','20','20','ASEAN FTA: component sub-headings at 0-5%; finished phones at 20%','PLI for Large Scale Electronics Manufacturing (LSEM): Rs 41,000 cr over 5 years for mobile phones and components','Yes — phones subject to BIS QCO','None','Unrestricted','PLI LSEM attracted Apple, Samsung, Dixon, Micromax. Tariff escalation (0% components, 20% finished) incentivises domestic assembly. BIS QCO on phones from 2020.','https://www.meity.gov.in/writereaddata/files/PLI_for_Large_Scale_Electronics_Manufacturing.pdf','2026-02-01'],
  ['8471','2023-04-01','','','20','20','ASEAN FTA: subassembly components at 0-5%','PLI for IT Hardware: Rs 7,325 cr for laptops, tablets and servers; limited uptake','Yes — laptops and tablets subject to BIS QCO from Oct 2023; import licensing introduced Aug 2023 (paused for review)','None','Import monitoring; prior licensing paused','20% BCD raised from 0% in Union Budget 2023 to incentivise domestic manufacturing. QCO effective Oct 2023. Import licensing order (Category B) introduced Aug 2023 but paused pending review.','https://www.meity.gov.in/writereaddata/files/PLI_IT_Hardware.pdf','2026-02-01'],
  ['8507','2025-02-01','','','15','15','None','PLI for ACC batteries: Rs 18,100 cr for 50 GWh capacity over 5 years; Ola Cell Technologies, Amara Raja, Reliance New Energy selected','No','None','Unrestricted','15% BCD on Li-ion cells; lead-acid batteries (domestic near-captive) at lower rates. PLI for ACC targets EV and grid storage cell manufacturing.','https://dhi.nic.in/uploadfiles/MFiles/PLI-ACC.pdf','2026-02-01'],
  ['8473','2025-02-01','','','0','0','ASEAN FTA 0%','No dedicated PLI; covered under broader IT hardware program for qualifying components','No','None','Unrestricted','Parts for ADP machines at 0% BCD to support domestic electronics assembly ecosystems.','https://www.cbic.gov.in/resources/htdocs-cbec/customs/cs-act/formatted-htmls/cst-sch1.pdf','2026-02-01'],
  ['8536','2025-02-01','','','7.5','7.5','ASEAN FTA: varies by sub-heading 0-7.5%','No dedicated PLI','No','None','Unrestricted','Electrical switching apparatus at standard 7.5% BCD. Indian manufacturers (Havells, L&T, Legrand) compete with Chinese imports.','https://www.cbic.gov.in/resources/htdocs-cbec/customs/cs-act/formatted-htmls/cst-sch1.pdf','2026-02-01'],
  ['1511','2025-01-01','','','27.5','27.5','AIF 20%','National Mission on Edible Oils - Oil Palm (NMEO-OP)','No','None','Unrestricted','Import duties on crude palm oil were raised to 27.5% (effective Sep 2024) to support domestic oilseed farmer realisations amid falling global prices. Includes Agriculture Infrastructure and Development Cess (AIDC).','https://www.cbic.gov.in/resources/htdocs-cbec/customs/cs-act/formatted-htmls/cst-sch1.pdf','2026-06-15'],
  ['1507','2025-01-01','','','27.5','27.5','AIF 20%','No','No','None','Unrestricted','Import duties on crude soybean oil raised to 27.5% to protect domestic soybean farmers from price collapse.','https://www.cbic.gov.in/resources/htdocs-cbec/customs/cs-act/formatted-htmls/cst-sch1.pdf','2026-06-15'],
  ['1512','2025-01-01','','','27.5','27.5','AIF 20%','No','No','None','Unrestricted','Import duties on crude sunflower oil raised to 27.5% inline with other edible oils.','https://www.cbic.gov.in/resources/htdocs-cbec/customs/cs-act/formatted-htmls/cst-sch1.pdf','2026-06-15'],
  ['1201','2025-01-01','','','15','15','None','No','No','None','Unrestricted','Duties on soybeans are maintained to protect domestic Kharif farmers. Non-GM certification required for import.','https://www.cbic.gov.in/resources/htdocs-cbec/customs/cs-act/formatted-htmls/cst-sch1.pdf','2026-06-15'],
  ['3105','2025-01-01','','','5','5','None','Nutrient Based Subsidy (NBS) scheme covers P&K fertilisers','No','None','Unrestricted','DAP imports are strictly regulated and subsidised under NBS to manage retail prices for farmers.','https://fert.nic.in/','2026-06-15'],
  ['3102','2025-01-01','','','5','5','None','Urea Subsidy Scheme and New Investment Policy (NIP) 2012 for domestic capacity expansion','No','None','State Trading Enterprises (STEs) only','Urea imports are restricted to STEs (NFL, RCF, IPL) on behalf of the government to manage the subsidy bill and supply.','https://fert.nic.in/','2026-06-15'],
  ['7108','2025-01-01','','','6','6','CEPA UAE: 1% concession up to 140 MT TRQ','No','No','None','Canalised/Nominated Agencies','Basic Customs Duty on gold reduced from 15% to 6% in Union Budget 2024 to curb smuggling and support gems and jewellery exports.','https://www.cbic.gov.in/resources/htdocs-cbec/customs/cs-act/formatted-htmls/cst-sch1.pdf','2026-07-01']
];

const policyCsv = policyData.map(row => row.map(cell => {
  if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
    return '"' + cell.replace(/"/g, '""') + '"';
  }
  return cell;
}).join(',')).join('\n');
fs.writeFileSync(policyPath, policyCsv);


// Fix product_domestic_supply.csv
const domPath = path.join(process.cwd(), 'data/enrichment/product_domestic_supply.csv');
const domData = [
  ['hscode','fiscal_year','domestic_production','production_unit','apparent_consumption','localisable_share_pct','replacement_imported_input_pct','capacity','capacity_utilisation_pct','production_scope','derivation_method','source_document_section','evidence_note','source_url','source_date'],
  ['8517','2024-25','22500','capacity_mn_usd','','10','90','','','','','','Domestic phone assembly: PLI scheme mobilised approx $22.5bn annual production (FY25). Apple (Foxconn/Tata), Samsung, Dixon Technologies assembling in India. Approx 99% of domestic demand met domestically for smartphones; export-linked imports are structural components.','https://www.meity.gov.in/writereaddata/files/PLI_for_Large_Scale_Electronics_Manufacturing.pdf','2026-01-15'],
  ['8507','2024-25','1200','capacity_mn_usd','','22','78','','','','','','ACC battery PLI approved for 50 GWh by 2028. Operational capacity approx 5-8 GWh by FY25. Dominant domestic players: Amara Raja, Exide (lead-acid near-100% domestic); lithium-ion cell manufacturing nascent. Import dependence for Li-ion cells approaches 95%.','https://dhi.nic.in/uploadfiles/MFiles/PLI-ACC.pdf','2026-02-01'],
  ['8542','2024-25','','capacity_mn_usd','','5','80','','','','','','India Semiconductor Mission: Micron ATMP facility (Gujarat) operational for memory testing-and-packaging. Tata Electronics + Powerchip fab (Dholera) under construction; CG Power + Renesas fab (Sanand) under construction. No logic wafer fabrication yet operational. Current domestic output is entirely ATMP not wafer fabrication.','https://semiconductors.india.gov.in/','2026-06-01'],
  ['8541','2024-25','','capacity_mn_usd','','40','60','','','','','','Solar cell manufacturing: India produced approx 25 GW/year domestically (FY24-25) under ALMM scheme. Semiconductor-device (non-solar) manufacturing nascent. HS 8541 mixes solar PV cells (8541.42) with diodes and LEDs; domestic production figure covers solar cells only. Includes Waaree, Adani Solar, Premier Energies.','https://mnre.gov.in/solar','2026-04-01'],
  ['8471','2024-25','450','capacity_mn_usd','','70','30','','','','','','Laptop and PC domestic assembly: HP, Dell, Lenovo have limited local assembly. PLI scheme for IT hardware approved; take-up slow due to component import dependence. Approx 5-10% of domestic demand met locally by value. Laptop PCB, chipsets, displays all imported.','https://www.meity.gov.in/writereaddata/files/PLI_IT_Hardware.pdf','2026-03-01'],
  ['1511','2024-25','300000','metric_tonnes','9400000','3.2','96.8','400000','','','','','Domestic oil palm cultivation is highly constrained by water requirements. The National Mission on Edible Oils - Oil Palm (NMEO-OP) targets 1M ha expansion, primarily in North East and Andaman, but gestation is 4-5 years and ecological concerns persist.','https://agricoop.nic.in/en/nmeo-op','2026-06-15'],
  ['1507','2024-25','1800000','metric_tonnes','5400000','33.4','66.6','2500000','','','','','Domestic soybean oil production relies on local seed crush. Yields for soya beans (HS 1201) are stagnant at ~1 MT/ha compared to global 3 MT/ha. Expansion is limited by rainfed cultivation and lack of GM seed approval.','https://agricoop.nic.in/','2026-06-15'],
  ['1512','2024-25','300000','metric_tonnes','3200000','9.4','90.6','500000','','','','','Sunflower cultivation has declined in India (primarily Karnataka/Maharashtra) due to vulnerability to pests and climate variability. Domestic crush yields very little oil relative to the massive import demand.','https://agricoop.nic.in/','2026-06-15'],
  ['1201','2024-25','13000000','metric_tonnes','13100000','98.9','1.1','','','','','','India is self-sufficient in soybean seeds for direct crush, but the absolute volume is insufficient to meet the vegetable oil demand. The crop competes with other Kharif crops for land.','https://agricoop.nic.in/','2026-06-15'],
  ['3105','2024-25','4500000','metric_tonnes','10500000','42.9','57.1','5000000','90','','','','Domestic DAP production is heavily reliant on imported rock phosphate and phosphoric acid. The 57% import dependence is structural due to lack of domestic reserves.','https://fert.nic.in/','2026-06-15'],
  ['3102','2024-25','31500000','metric_tonnes','36000000','87.5','12.5','32000000','98','','','','India produces over 30M MT of urea domestically but remains a net importer due to massive consumption (36M MT). Production relies on imported natural gas (LNG).','https://fert.nic.in/','2026-06-15'],
  ['7108','2024-25','1.5','metric_tonnes','750','0.2','99.8','','','','','','India has negligible domestic gold mine production (Hutti Gold Mines). Almost 100% of demand is met through imports of unwrought or semi-manufactured gold.','https://mines.gov.in/','2026-07-01']
];

const domCsv = domData.map(row => row.map(cell => {
  if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
    return '"' + cell.replace(/"/g, '""') + '"';
  }
  return cell;
}).join(',')).join('\n');
fs.writeFileSync(domPath, domCsv);

console.log('CSVs rewritten with strict quoting.');
