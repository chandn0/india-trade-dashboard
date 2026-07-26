# Product evidence enrichment contracts

These empty, committed CSV contracts define the evidence required for deeper
product analysis without placing estimates or unsupported assumptions in UI
code. A source pipeline should populate a file only when the stated grain is
available from a reviewable source.

## Files

- `product_partner_hs4.csv`: partner × HS-4 × flow × fiscal year. Required for
  true product-specific sourcing and destination concentration. Current HS-2
  partner indicators are not written here.
- `product_quantity_unit_value.csv`: HS-4 physical quantities and unit values.
  Required to decompose value growth into price and volume effects.
- `product_domestic_supply.csv`: Indian production, capacity, and apparent
  consumption. Required for import-penetration and domestic-capacity analysis.
- `product_policy.csv`: tariffs, preferences, incentives, standards, remedies,
  and restrictions with effective dates.
- `state_product_capability.csv`: state × HS-4 exports or production evidence.
  Required before the dashboard attributes a product opportunity to a state.
- `domestic_value_chain_links.csv`: directional end-product × required-input
  links, with Indian availability evidence and the missing conversion step. It
  is not a bill of materials and does not allocate input imports to end uses.

## Rules

1. Do not populate a field with a model estimate unless an explicit
   `evidence_note` and methodology are added to the schema.
2. Preserve the source URL and source date on every row.
3. Never silently mix HS-2 evidence into an HS-4 contract.
4. Use the same fiscal-year labels as the trade datasets.
5. Validate uniqueness at the file's declared grain before joining.
6. For value-chain links, use only `available`, `emerging`, `limited`,
   `not_available`, or `unknown` for domestic availability and preserve an
   evidence grade, source URL, and source date.

Until these files contain evidence rows, the Product Composition workspace
shows the corresponding dimensions as unavailable rather than zero.
