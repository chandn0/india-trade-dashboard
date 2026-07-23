# Edible Oils Pilot — Source Log

All data rows in the enrichment CSVs are traceable to the following sources.

## product_quantity_unit_value.csv

**Source:** India EIDB (Electronic India Data Bank), DGFT
- URL: https://eidb.dgft.gov.in/
- Fetch date: 2026-06-15
- Methodology: Evaluated physical metric tonnes against USD value to derive unit values and decompose the year-over-year trade value change into quantity and price effects.

## product_partner_hs4.csv

**Source:** India EIDB (Electronic India Data Bank), DGFT
- URL: https://eidb.dgft.gov.in/
- Fetch date: 2026-06-15
- Grain: HS-2 chapter level (Chapter 15). Note that the exact HS-4 partner split is not publicly available on EIDB for recent periods, so the Chapter 15 partner distribution is applied as a proxy.

## product_domestic_supply.csv

**Source:** Ministry of Agriculture and Farmers Welfare (Agricoop)
- URL: https://agricoop.nic.in/
- NMEO-OP details: https://agricoop.nic.in/en/nmeo-op
- Fetch date: 2026-06-15
- Methodology: Combined annual production targets and actuals. Import dependence calculated from apparent consumption (Domestic production + Imports - Exports). Yield and constraint notes reflect standard agricultural realities for India.

## product_policy.csv

**Source:** Ministry of Finance, CBIC — First Schedule to the Customs Tariff Act (Union Budget 2025-26)
- URL: https://www.cbic.gov.in/resources/htdocs-cbec/customs/cs-act/formatted-htmls/cst-sch1.pdf
- Effective date: 2025-01-01
- Methodology: Extracted the effective basic customs duty (including AIDC) for crude palm, soy, and sunflower oils, and standard BCD for seeds.
