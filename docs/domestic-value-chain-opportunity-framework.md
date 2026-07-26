# Domestic Value-Chain Opportunity Framework

## Decision question

Which finished or end-use products does India import even though relevant materials, components, or adjacent production capabilities exist domestically, and what manufacturing step is still missing?

The framework is a screening system. It does not treat the presence of one input as proof that a finished product can be made competitively in India.

## Traceable unit

Each observation is a directional link:

`imported end product → required input → Indian availability evidence → missing conversion step`

The source contract is `data/enrichment/domestic_value_chain_links.csv`. Trade values, stage attribution, domestic-supply evidence, and buildability are joined from the existing product datasets by HS-4 code.

## Required distinctions

1. **Input presence is not feasibility.** Availability must be separated from technology, scale, quality, cost, infrastructure, intellectual-property, and workforce constraints.
2. **HS-4 is not a bill of materials.** A link identifies a value-chain relationship. It never allocates a component's imports to an end product unless a sourced input share is later added.
3. **Headings may be mixed-use.** A finished-product heading can also contain parts. Mixed-use status is displayed and lowers the strength of any conclusion.
4. **Gross imports are not impact.** The screen always shows the finished product's exports and net balance. Component deficits are shown separately and are never added to finished-product imports because that would double count the chain.
5. **No evidence means no claim.** Unmapped products remain in the universe with an `insufficient evidence` status.

## Domestic availability vocabulary

- `available`: observed commercial production with evidence relevant to the linked input.
- `emerging`: pilot, announced, or early capacity exists but is not yet demonstrated at required scale.
- `limited`: only a narrower processing step or product subset is evidenced.
- `not_available`: evidence shows the relevant input is structurally absent.
- `unknown`: no usable product-level evidence is available.

## Evidence grades

- `E0`: hypothesis only; not shown as a mapped link.
- `E1`: directional relationship supported, but scope or product grain is partial.
- `E2`: relationship and Indian capability status supported by a primary policy or official source.
- `E3`: observed production/capacity and product-specific relationship are both supported.
- `E4`: audited product-level capacity, cost, quality, and input-share evidence.

The current curated electronics and industrial-machinery links are E1 with
`unknown` domestic availability. They are suitable for prioritising research,
not for claiming feasibility or a monetary localisation opportunity. Stronger
statuses remain available for future links only after claim-specific evidence
supports them.

## Decision states

- **Inputs evidenced:** all mapped inputs have relevant commercial availability. A feasibility study can begin.
- **Component ecosystem emerging:** one or more linked inputs are limited or emerging. The opportunity requires component build-out, not only final assembly.
- **Structural input gap:** at least one critical input is evidenced as unavailable.
- **Insufficient evidence:** the input map or domestic-capability evidence is missing.
- **Export platform — localise inputs:** the finished heading is already in net surplus; the strategic question is domestic value addition and resilience, not gross import elimination.

## Net-impact gate

A monetary net-deficit impact must remain suppressed until all of the following are sourced:

- addressable finished-product scope within the HS-4 heading;
- domestic replacement share;
- imported-input share for replacement production;
- additional export-production input share, if exports are modelled;
- execution horizon and realisation range.

Until then the dashboard may show observed import, export, and net-balance values, but not a calculated localisation benefit.

## Expansion sequence

1. Map the top end-product deficit lines to critical HS inputs.
2. Add product-specific production, capacity, quality, and cost evidence.
3. Add state capabilities only where facility or production evidence exists.
4. Add sourced bill-of-material or imported-input shares.
5. Only then enable monetary opportunity ranges and rank by time-adjusted net impact.
