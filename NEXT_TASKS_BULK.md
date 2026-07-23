# Product Intelligence Dashboard — Bulk Execution Backlog

## Purpose

This is the execution backlog after completion of the electronics evidence
pilot. It expands the strategic roadmap into work packages that can be assigned,
reviewed, and completed independently.

The objective is not to make the dashboard larger for its own sake. Each task
must improve at least one of these decisions:

1. Is the product economically important on a **net**, not merely gross, basis?
2. Why is India importing or exporting it?
3. Is the opportunity buildable, growable, recoverable, substitutable, or
   structurally imported?
4. What is the realistic deficit impact after imported inputs and export
   offsets?
5. What evidence supports the conclusion, and what remains unknown?

## Current position

- S01–S05: complete
- S06 electronics evidence pilot: complete and accepted
- Next primary task: S07 edible-oils evidence pilot
- Scaling tasks remain conditional on the two-pilot decision gate

---

# Wave 1 — Complete the second evidence pilot

## [x] S07.1 — Audit the existing edible-oils pilot files

**Priority:** First  
**Effort:** 0.5–1 day  
**Depends on:** None

Review `data/pilots/edible-oils/`, the associated enrichment rows, and the
product page for HS 1511, 1507, and 1512.

Check:

- whether every factual claim has a primary or strong official source
- whether evidence is actually HS-4 specific
- whether proxy evidence is explicitly labelled
- whether years, units, and fiscal/calendar periods are compatible
- whether zero, unavailable, and not applicable are distinguished
- whether qualitative assumptions are labelled as analyst assumptions

**Done when:** The pilot has a written issue list, with every issue classified
as data, methodology, interface, or documentation.

## [x] S07.2 — Add quantity and unit-value evidence

**Priority:** Critical  
**Effort:** 1–2 days  
**Depends on:** S07.1

For each pilot oil line, record:

- annual import value
- annual physical quantity
- reported unit
- calculated unit value
- source period and retrieval date
- unit-consistency status

Reject comparisons where units change or cannot be reconciled.

**Done when:** Five-year price-versus-volume decomposition can be reproduced
from stored source rows without manual calculation.

## [x] S07.3 — Build price-versus-volume decomposition

**Priority:** Critical  
**Effort:** 1 day  
**Depends on:** S07.2

Separate import-value change into:

- quantity effect
- unit-value effect
- interaction/residual

Show clearly when the deficit grew because India imported more physical oil
versus when international prices increased.

**Done when:** Components reconcile to the total value change within a defined
tolerance and pass automated validation.

## [x] S07.4 — Add domestic production and consumption evidence

**Priority:** Critical  
**Effort:** 1–2 days  
**Depends on:** S07.1

Add, where defensible:

- domestic oilseed output
- domestic oil production
- yield
- area harvested
- apparent consumption
- estimated import dependence
- extraction or processing losses

Keep oilseed, crude oil, refined oil, and finished consumption measures
separate.

**Done when:** Every displayed dependence percentage has an explicit numerator,
denominator, unit, period, and source.

## [x] S07.5 — Model realistic growability and substitution constraints

**Priority:** High  
**Effort:** 1–2 days  
**Depends on:** S07.4

Create conservative, base, and upper-bound cases using:

- feasible yield improvement
- feasible planted-area change
- oil extraction rate
- crop suitability
- competing food uses
- land and water constraints
- substitution between palm, soybean, sunflower, mustard, and other oils

Do not equate theoretical agronomic potential with commercially achievable
import replacement.

**Done when:** Each case explains its binding constraint and reports both gross
replacement and realistic net-import impact.

## [x] S07.6 — Add partner concentration and sourcing resilience

**Priority:** High  
**Effort:** 1 day  
**Depends on:** S07.1

Calculate, where HS-4 evidence is available:

- top supplier
- top-three supplier share
- HHI or another documented concentration measure
- five-year concentration movement
- exposure to one country or region

Keep sourcing diversification separate from domestic substitution.

**Done when:** The dashboard can identify a concentrated but structurally
imported product as a sourcing-risk problem rather than falsely calling it a
manufacturing opportunity.

## [x] S07.7 — Complete the edible-oils evidence card and brief

**Priority:** High  
**Effort:** 1 day  
**Depends on:** S07.2–S07.6

The card and brief must answer:

1. Is the deficit large on a net basis?
2. Was the recent movement driven by price or quantity?
3. How dependent is India on imports?
4. What share is plausibly growable or substitutable?
5. What constraint binds first?
6. Is sourcing diversification more realistic?
7. How confident is the conclusion?

**Done when:** The evidence changes either the ranking, recommended lever, or
confidence relative to a gross-import-only view.

## [x] S07.8 — Validate and formally review S07

**Priority:** Release gate  
**Effort:** 0.5–1 day  
**Depends on:** S07.7

Run data validation, regression tests, responsive rendering, and a production
build. Review all claims against their cited source and document remaining
limitations.

**Done when:** S07 receives an explicit go/no-go decision.

---

# Decision Gate A — Decide what deserves scaling

## [ ] G01 — Compare electronics and edible-oils pilots

**Priority:** Mandatory before broad expansion  
**Effort:** 1 day  
**Depends on:** S06 and S07

Score both pilots from 0–2 on:

- decision clarity
- source reliability
- HS-4 reconciliation
- refreshability
- interface value
- maintenance cost

**Decision rules:**

- Scale a pipeline only if it materially changed a decision and its evidence is
  repeatable.
- Retain a pilot as a research brief if it is insightful but not refreshable.
- Stop a pipeline if proxies dominate the conclusion or cannot be reconciled.

**Deliverable:** `docs/pilot-gate-review.md`

---

# Wave 2 — Improve the decision engine

## [x] S08.1 — Define the scenario input contract

Specify required, optional, sourced, and user-entered fields for:

- localisation
- imported-input dependence
- export response
- quantity and price
- capacity or yield constraints
- time horizon
- implementation confidence

**Done when:** Missing evidence produces “unavailable,” never an invented
default.

## [x] S08.2 — Add conservative, base, and optimistic scenarios

Use evidence-backed defaults only for supported products. Show user edits
separately from sourced assumptions.

**Done when:** All three cases reconcile from gross intervention to realistic
net-deficit impact.

## [x] S08.3 — Add uncertainty and sensitivity

Show:

- impact range
- most influential assumption
- break-even value
- warning when results depend on low-confidence inputs

**Done when:** Users can see which assumption changes the recommendation.

## [x] S08.4 — Make scenarios reproducible

Add:

- shareable URL state
- downloadable assumption CSV/JSON
- source and methodology metadata
- model version

**Done when:** Another user can recreate the same result from an exported
scenario.

## [x] S09.1 — Standardise opportunity evidence cards

Create one consistent card contract covering:

- gross imports
- exports and export offset
- net deficit
- five-year movement
- product stage and import reason
- buildability
- domestic capability
- partner exposure
- realistic impact range
- confidence and missing evidence

## [x] S09.2 — Add “why this ranks here” explanations

For every ranked opportunity, show which factors raised or lowered its score.

**Done when:** No ranking appears as an unexplained composite number.

## [x] S09.3 — Add evidence completeness indicators

Show completeness by dimension rather than one misleading global confidence
score:

- trade evidence
- partner evidence
- domestic-supply evidence
- technology/buildability evidence
- policy evidence
- scenario evidence

---

# Wave 3 — Expand product composition insight

## [x] S16.1 — Add import-versus-export stage matrices

Create side-by-side composition views for:

- raw materials
- intermediates
- finished products
- capital goods
- energy
- agricultural commodities
- consumption assets

Show value, share, five-year change, and net balance for each stage.

## [x] S16.2 — Add sector × product-stage heatmap

Reveal which sectors:

- import upstream inputs but export finished goods
- import and export the same product class
- remain dependent across the full value chain
- have rising intermediate-input dependence

## [x] S16.3 — Add value-chain position and flow

Map selected products through:

`raw material → intermediate → component → finished good → export`

Use this to distinguish productive imports from final-consumption leakage.

## [x] S16.4 — Add product-family drill-down

Allow navigation:

`sector → HS2 chapter → HS4 product → evidence card`

Preserve filters and selected comparison products through the drill-down.

## [x] S16.5 — Add import/export mirror analysis

Flag:

- high imports and high exports in the same HS-4
- likely processing or re-export patterns
- products whose gross deficit exaggerates dependence
- products whose export growth increases imported-component demand

## [x] S16.6 — Add contribution-to-change analysis

For every view, distinguish:

- largest level
- fastest growth
- largest contribution to total deficit change
- largest deterioration or improvement in net balance

This prevents small, fast-growing products from being confused with major
macroeconomic drivers.

## [x] S16.7 — Add cohort comparisons

Compare:

- buildable versus structural imports
- raw/intermediate versus finished products
- high- versus low-confidence classifications
- pilot-supported versus classification-only products

---

# Wave 4 — Scale approved evidence pipelines

## [ ] S10.1 — Scale partner-HS4 evidence to top-value products

**Start only if:** G01 approves partner evidence.

Start with products covering at least 70% of the net deficit, not an arbitrary
row count.

## [ ] S10.2 — Add concentration trend and supplier-switch analysis

Distinguish persistent concentration from successful diversification.

## [ ] S10.3 — Add partner-product risk flags

Flag concentration only when it is combined with:

- high net exposure
- low domestic substitutability
- geopolitical or logistics vulnerability supported by evidence

## [ ] S11.1 — Scale quantity/unit-value evidence by compatible unit family

**Start only if:** G01 approves the edible-oils method.

Suggested order:

1. crude petroleum and fuels
2. fertilisers
3. metal ores and feedstocks
4. other agricultural commodities

## [ ] S11.2 — Add physical-dependence dashboards

Show value and physical quantity together so price shocks do not masquerade as
greater structural dependence.

## [ ] S12.1 — Establish a policy evidence contract

Every policy row must include:

- exact affected scope
- measure type
- effective date
- expiry/review date
- primary source
- last verification date
- status

## [ ] S12.2 — Add selective policy overlays

Add policies only for evidence-supported products. Keep policy existence,
implementation, and proven effectiveness separate.

## [ ] S13.1 — Secure a defensible state-capability source

Do not build a map until the data can distinguish production, exports,
employment, investment, and announced capacity.

## [ ] S13.2 — Pilot one state-capability sector

Test electronics first if a reliable state × sector dataset is secured.

**Done when:** State recommendations cite observed capability rather than port
location or company announcements alone.

---

# Wave 5 — Trust, publishing, and workflow

## [ ] S14.1 — Add dataset manifests

For every generated dataset store:

- source URL
- source period
- fetch date
- row count
- checksum
- transformation version
- validation result

## [ ] S14.2 — Add field-level provenance

Users should be able to trace important metrics from the interface to the source
and derivation method.

## [ ] S14.3 — Add evidence-age warnings

Define staleness thresholds by evidence type. Policy and tariff evidence should
expire faster than structural classification evidence.

## [ ] S14.4 — Add scheduled refresh checks

Automate fetch, reconciliation, validation, and change reports. Do not publish
automatically when reconciliation fails.

## [ ] S15.1 — Add filtered CSV export

Include active filters, fiscal period, units, methodology version, and evidence
status.

## [ ] S15.2 — Add research snapshot export

Export an evidence card or comparison as a printable image/PDF with sources and
assumptions.

## [ ] S15.3 — Add saved and shareable research views

Persist:

- selected products
- filters
- ranking method
- scenario assumptions
- visible evidence dimensions

## [ ] S15.4 — Add methodology and limitation panels

Place concise definitions beside the relevant result, with the full methodology
available from every exported view.

---

# Wave 6 — Quality and product validation

## [ ] S17.1 — Test ten additional research journeys

Include energy, fertiliser, metals, recycling, capital goods, agricultural
commodities, and productive-import cases.

## [ ] S17.2 — Add ranking stability tests

Detect material opportunity-rank changes caused by:

- data refreshes
- classification changes
- missing enrichment
- scoring-weight changes

## [ ] S17.3 — Add accessibility and keyboard review

Test filters, tables, charts, tooltips, dialogs, focus order, colour contrast,
and screen-reader labels.

## [ ] S17.4 — Add performance budgets

Set budgets for:

- initial page load
- filtering response
- chart rendering
- dataset size
- mobile memory use

## [ ] S17.5 — Run analyst usability sessions

Observe whether users can answer:

1. Why is this imported?
2. Is it realistically addressable?
3. What is the net impact?
4. What evidence is missing?

Record time-to-answer and incorrect interpretations.

---

# Recommended execution order

## Do next

1. S07.1 — Audit edible-oils evidence
2. S07.2 — Quantity and unit values
3. S07.3 — Price-versus-volume decomposition
4. S07.4 — Domestic production and dependence
5. S07.5 — Growability constraints
6. S07.6 — Partner and sourcing resilience
7. S07.7 — Evidence card and brief
8. S07.8 — Formal validation and review
9. G01 — Two-pilot decision gate

## Then, if the gate passes

10. S08 — Scenario Model v2
11. S09 — Standardised evidence cards
12. S16.1–S16.7 — Product-composition expansion
13. S14.1–S14.3 — Provenance and staleness
14. Approved portions of S10–S13
15. S15 — Shareable research outputs
16. S17 — Product validation and quality

## Explicitly defer

- HS-6 coverage across the entire trade dataset
- a national state opportunity ranking without defensible state evidence
- blanket tariff or policy coverage
- country-risk scoring without product-level exposure
- machine-learning opportunity scores before evidence completeness is adequate
- more composite scores that cannot be explained to the user

---

# Release definition

The next major release is ready when a user can:

1. identify a product with a material net deficit;
2. understand its role as raw material, intermediate, capital good, or finished
   product;
3. understand why India imports it;
4. see whether the best lever is manufacturing, growing, recycling,
   substitution, demand shaping, sourcing diversification, or export upgrading;
5. reproduce a conservative net-impact estimate;
6. inspect the source and age of every decision-critical input; and
7. clearly see what the dashboard does not know.

