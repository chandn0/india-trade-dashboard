# Electronics Pilot — Source Log

All data rows in the three enrichment CSVs are traceable to the following sources.

## product_partner_hs4.csv

**Source:** India EIDB (Electronic India Data Bank), DGFT — country-wise HS-2 chapter trade data for FY 2025-26.
- URL: https://eidb.dgft.gov.in/
- Fetch date: 2026-06-10
- Grain: HS-2 chapter (not HS-4). All rows labelled accordingly in the hs2_grain column.
- Methodology: Top partner countries by HS-2 chapter 85 (HS 85xx products: 8542, 8541, 8517, 8507, 8536) and chapter 84 (HS 84xx products: 8471, 8473) import and export value. Share percentage computed as country HS-2 value / sum of reported partners for that chapter.
- Limitation: Chapter 85 includes all HS 8500-8599 products. The partner shares are NOT product-specific; they proxy the electronics cluster composition, not the individual HS-4 line. This is clearly noted in each evidence_note field.

## product_domestic_supply.csv

**HS 8517 (Smartphones/telecom):**
- Source: MEITY PLI for Large Scale Electronics Manufacturing progress report, January 2024
- URL: https://www.meity.gov.in/writereaddata/files/PLI_for_Large_Scale_Electronics_Manufacturing.pdf
- Production figure: Approx $22.5 bn annual production mobilised under PLI scheme (FY25 projection)
- Import dependence: ~90% of gross HS 8517 imports are components for re-export in assembled phones (structural, not substitutable)

**HS 8507 (Batteries/accumulators):**
- Source: DHI PLI for Advanced Chemistry Cell Batteries scheme document
- URL: https://dhi.nic.in/uploadfiles/MFiles/PLI-ACC.pdf
- Capacity figure: 40 GWh awarded; 1 GWh installed in pilot production by FY25
- Import dependence: ~78% for all battery types; Li-ion cell specific dependence approaches 95%

**HS 8542 (Integrated circuits):**
- Source: India Semiconductor Mission (ISM), Ministry of Electronics and IT
- URL: https://semiconductors.india.gov.in/
- Domestic output: Micron ATMP Gujarat (memory testing/packaging); Tata Electronics + Powerchip (Dholera, under construction); CG Power + Renesas (Sanand, under construction)
- Note: No logic wafer fab operational as of June 2026. All current output is ATMP (assembly, test, mark, pack), not wafer-level fabrication.

**HS 8541 (Semiconductor devices incl. solar):**
- Source: MNRE (Ministry of New and Renewable Energy), ALMM scheme
- URL: https://mnre.gov.in/solar
- Production: ~25 GW/year solar cell capacity (FY24-25); includes Waaree, Adani Solar, Premier Energies
- Note: HS 8541 is a mixed heading; figure covers solar PV cells (8541.42) only, not diodes/transistors/LEDs.

**HS 8471 (Computers/ADP):**
- Source: MEITY PLI for IT Hardware scheme document
- URL: https://www.meity.gov.in/writereaddata/files/PLI_IT_Hardware.pdf
- Domestic production: Limited assembly; approx 5-10% of demand by value
- Note: PCB, chipsets, displays, storage all imported. Assembly-only local value-add.

## product_policy.csv

**BCD rates — all products:**
- Source: Ministry of Finance, CBIC — First Schedule to the Customs Tariff Act (Union Budget 2025-26)
- URL: https://www.cbic.gov.in/resources/htdocs-cbec/customs/cs-act/formatted-htmls/cst-sch1.pdf
- Effective date: 2025-02-01 (Union Budget 2025)

**PLI scheme coverage:**
- LSEM (Large Scale Electronics Manufacturing) for HS 8517: https://www.meity.gov.in/writereaddata/files/PLI_for_Large_Scale_Electronics_Manufacturing.pdf
- IT Hardware PLI for HS 8471: https://www.meity.gov.in/writereaddata/files/PLI_IT_Hardware.pdf
- ACC Battery PLI for HS 8507: https://dhi.nic.in/uploadfiles/MFiles/PLI-ACC.pdf
- ISM PLI for HS 8542: https://semiconductors.india.gov.in/

**QCO (Quality Control Order) coverage:**
- HS 8517 (phones): BIS QCO on mobile handsets effective 2020; notification S.O. 3564(E)
- HS 8471 (laptops/tablets): BIS QCO effective October 2023; import licensing (Category B) introduced August 2023, subsequently paused pending review

**ALMM (Approved List of Models and Manufacturers) for HS 8541.42:**
- Source: MNRE ALMM notification
- URL: https://mnre.gov.in/solar/almm
- Coverage: Domestic procurement mandate for solar cells under government-funded projects

---

## Data currency and limitations

- All trade values are FY 2025-26 (April 2025 - March 2026 provisional).
- Partner concentration data is at HS-2 grain only. HS-4 specific partner data is not currently available from public EIDB endpoints.
- Domestic supply figures for manufacturing capacity are indicative estimates from policy documents; not audited production statistics.
- Policy rates are correct as of Union Budget 2025-26. Customs duty rates change with each budget cycle; re-verify annually.
