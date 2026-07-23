# Strategic Next Tasks — Revised

This second-pass backlog is intentionally narrower than the first version.

The project already has broad product coverage, multiple dashboards, a
Buildability Atlas, comparison tools, and a scenario model. The main risk is no
longer “not enough features.” The risk is building increasingly elaborate views
before proving that the evidence changes a real decision.

## Strategic conclusion

Do **not** expand every missing dataset across all 1,235 products yet.

First prove the complete workflow on two contrasting product systems:

1. **Electronics / integrated circuits** — manufactured intermediate inputs,
   technology dependence, complex supply chains, and export-linked imports.
2. **Edible oils** — agricultural dependence, physical quantities, price versus
   volume, domestic production, and land/yield constraints.

These pilots test nearly every difficult part of the product:

- partner concentration
- raw/intermediate/finished attribution
- domestic production
- price versus volume
- imported content
- policy overlays
- buildability
- realistic net-impact modelling

If the pilots do not produce clearer decisions, scaling the data model would
only produce a larger dashboard.

---

## What changed after reconsideration

### Removed as immediate priorities

- **Curating exactly 100 products:** the count is arbitrary. Review should stop
  when value coverage and confidence targets are reached.
- **Partner-HS4 for every product immediately:** first prove that the official
  endpoint is stable and that concentration changes prioritisation.
- **A broad state-capability map:** national trade data cannot support it, and a
  weak state mapping would reduce trust.
- **A full tariff/policy database:** policy facts change frequently and are
  expensive to maintain. Start only with products in the selected pilots.
- **More general dashboard modules:** the current UI is sufficient to test the
  analytical proposition.

### Elevated priorities

- Define the exact user and decision.
- Stabilise and test the existing model.
- Improve confidence by trade-value coverage, not row count.
- Build two end-to-end evidence pilots.
- Introduce explicit decision gates before scaling.

---

# Phase 0 — Prove what decision the product serves

## [x] S01 — Write the decision charter

**Priority:** Do first  
**Impact:** Critical  
**Cost:** Low  
**Owner:** Product / research  
**Time:** Half a day

Write a one-page charter answering:

1. Who is the primary user for the next release?
2. What decision should they make differently after using the dashboard?
3. What evidence must be present before the dashboard recommends an
   opportunity?
4. What should the dashboard refuse to conclude?

**Recommended primary user:** an analyst or founder screening Indian import
substitution and value-add opportunities—not a policymaker seeking a complete
economic model.

**Recommended core decision:**

> Which product areas deserve deeper commercial or policy investigation, and
> which large imports should be excluded because they are structural,
> productive, or misleading on a gross basis?

**Deliverable:** `docs/product-decision-charter.md`

**Acceptance test:** Every major page section must support one question in the
charter. Sections that support no decision become candidates for removal.

## [x] S02 — Test five real research journeys

**Priority:** Do first  
**Impact:** Critical  
**Cost:** Low  
**Owner:** Product / research  
**Dependency:** S01  
**Time:** 1–2 days

Run the dashboard through five concrete questions:

1. Should integrated circuits be treated as a buildable import opportunity?
2. Is the edible-oil deficit driven by price, volume, or structural demand?
3. Does smartphone export growth improve the net electronics position?
4. Which scrap imports are realistic recycling opportunities?
5. Which large imports should not be targeted for substitution?

For each journey, record:

- the answer the current dashboard provides
- missing evidence
- misleading or redundant UI
- time required to reach a conclusion
- confidence in the conclusion

**Deliverable:** `docs/product-research-journeys.md`

**Decision gate:** If users cannot distinguish “large import” from “credible
opportunity,” fix the reasoning flow before collecting more data.

---

# Phase 1 — Make the current model safe to extend

## [x] S03 — Add automated data and arithmetic validation

**Priority:** Do now  
**Impact:** Critical  
**Cost:** Low  
**Owner:** Data pipeline  
**Time:** 1–2 days

Create `scripts/validate_product_data.js` and
`npm run validate:products`.

Validate:

- unique and correctly formatted HS-4 codes
- five finite annual observations per flow
- stage, method, confidence, and review status on every product
- product totals against stored flow totals
- stage totals against product totals
- stage net balances against the full merchandise balance
- scenario fixtures and sign conventions
- uniqueness of each enrichment contract at its declared grain
- generated summary and full datasets share identical metadata

**Acceptance test:** Deliberate duplicate, malformed-code, non-finite-value, and
net-sign errors fail with actionable messages. Validation runs without network
access.

## [x] S04 — Review classifications until value-coverage targets are reached

**Priority:** Do now  
**Impact:** High  
**Cost:** Medium  
**Owner:** Methodology  
**Dependency:** S03  
**Time:** 2–4 days

Achieved curated coverage:

- Imports: **87.80%** (Target: ≥85%)
- Exports: **80.05%** (Target: ≥80%)
- Total Curated HS-4 Lines: **213 products** (100% substantive rationales and evidence notes; zero boilerplate)

S04.1 Quality Remediation Completed:
- **Curated Corrections**: HS 7114 (`consumption asset`), HS 5703 (`finished product`), and HS 5201 (`agricultural commodity`).
- **Strict Fail-Fast Validation**: Removed default fallbacks from `build_product_stage_mix.js` and added direct schema validation in `validate_product_data.js`.
- **Dashboard Visibility**: Added `Review status` filter (`Reviewed`, `Mixed-use`, `Needs review`), table status indicators, and full attribution/evidence notes in `ProductCompositionDashboard.js`.

Added fields to curated evidence (strictly enforced across all 213 lines):

- reviewer
- review date
- confidence
- dominant-use rationale
- mixed-use flag
- evidence note where the classification is not obvious

**Stop condition:** Stop reviewing when both value-coverage targets are reached and substantive quality review is validated.
The long tail can remain transparently rule-mapped.

## [x] S05 — Add regression tests for the current interface

**Priority:** Do now  
**Impact:** High  
**Cost:** Low  
**Owner:** Frontend  
**Dependency:** S03  
**Time:** 2 days

Test:

- search and hierarchical filters
- import/export switching
- top-20/50/100/all controls
- comparison add/remove
- scenario arithmetic and slider boundaries
- zero-import and zero-export products
- desktop and mobile page rendering
- main-dashboard summary versus dedicated-page totals

**Acceptance test:** Product totals and scenario results cannot change silently.

---

# Phase 2 — Build two complete evidence pilots

## [x] S06 — Electronics evidence pilot

**Priority:** Strategic pilot  
**Impact:** Very high  
**Cost:** Medium–high  
**Owner:** Data pipeline + methodology  
**Dependencies:** S01–S04  
**Time:** 1–2 weeks

### Scope

Start with:

- HS 8542 integrated circuits
- HS 8541 semiconductor devices
- HS 8517 telecom equipment
- HS 8471 computers
- HS 8507 batteries
- directly related parts and subassemblies

### Evidence to add

- partner × HS-4 imports and exports
- five-year supplier concentration where obtainable
- product-level import and export offsets
- known domestic assembly, component, packaging, or cell capacity
- imported-input dependence of exported finished goods where defensible
- relevant policies with effective dates
- classification confidence and mixed-use notes

### Questions the pilot must answer

1. Which component gaps widen as finished-electronics exports grow?
2. Which imports are locally manufacturable versus structurally technology
   dependent?
3. Does the net electronics position improve under plausible localisation?
4. Which partner concentration is a sourcing risk rather than a deficit issue?

**Deliverable:** `data/pilots/electronics/` plus a short evidence brief.

**Success condition:** The pilot changes the rank or interpretation of at least
one electronics opportunity compared with gross-import ranking.

## [ ] S07 — Edible-oils evidence pilot

**Priority:** Strategic pilot  
**Impact:** High  
**Cost:** Medium–high  
**Owner:** Data pipeline + methodology  
**Dependencies:** S01–S04  
**Time:** 1–2 weeks

### Scope

- HS 1511 palm oil
- HS 1507 soybean oil
- HS 1512 sunflower/safflower/cotton-seed oil
- the closest domestic oilseed substitutes where the data permit

### Evidence to add

- import quantities and physical units
- unit values and price-versus-volume decomposition
- partner concentration
- domestic oilseed/oil production and yield
- apparent consumption
- import-dependence estimate
- land, yield, food-price, and ecological constraints
- relevant duties and programmes with effective dates

### Questions the pilot must answer

1. Did the deficit change because of prices or physical dependence?
2. What share could plausibly be grown domestically?
3. What is constrained by agroclimate, land, or food-price effects?
4. Is sourcing diversification more realistic than substitution?

**Deliverable:** `data/pilots/edible-oils/` plus a short evidence brief.

**Success condition:** The page can distinguish high net-deficit relevance from
low tractability without relying only on a qualitative note.

---

# Decision Gate 1 — Scale, revise, or stop

After S06 and S07, evaluate the pilots against the same criteria:

| Criterion          | Continue threshold                                                |
| ------------------ | ----------------------------------------------------------------- |
| Decision clarity   | Evidence materially changes prioritisation or confidence          |
| Source reliability | Refreshable, reviewable primary or strong official source         |
| Reconciliation     | New data can be reconciled to the HS-4 trade frame                |
| Maintenance cost   | Refresh can be documented and repeated by one contributor         |
| UI value           | Users reach the conclusion faster than with a written brief alone |

### Continue only if at least four of five thresholds pass

If electronics passes, scale partner-HS4 and supply-chain evidence to adjacent
manufactured sectors.

If edible oils passes, scale quantity/unit-value and domestic-supply evidence to
energy, fertilisers, metals, and other agricultural commodities.

If a pilot fails, keep its evidence brief but do not generalise the pipeline.

---

# Phase 3 — Turn pilot evidence into a stronger decision product

## [ ] S08 — Scenario model version 2

**Priority:** Only after Gate 1  
**Impact:** High  
**Cost:** Medium  
**Owner:** Methodology + frontend  
**Dependencies:** Successful S06 or S07

Replace generic defaults with evidence-backed pilot defaults:

- observed import dependence
- domestic capacity or yield constraint
- physical quantity where appropriate
- imported-input requirement
- conservative/base/optimistic cases
- sourced versus user-entered assumptions shown separately

Add:

- shareable URL parameters
- downloadable assumptions
- explicit uncertainty range
- warning when the required evidence contract is empty

**Acceptance test:** A scenario can be reproduced from exported assumptions and
source rows.

## [ ] S09 — Opportunity evidence cards

**Priority:** After Gate 1  
**Impact:** High  
**Cost:** Medium  
**Owner:** Frontend + methodology

For supported products, create a single decision card showing:

1. gross imports
2. export offset
3. net deficit
4. price-versus-volume movement
5. partner concentration
6. domestic capacity or production
7. buildability and binding constraint
8. realistic net-impact range
9. confidence and missing evidence

Unsupported fields must display “evidence unavailable,” not zero.

**Acceptance test:** A user can explain why an opportunity ranks highly without
opening multiple disconnected sections.

---

# Phase 4 — Scale only the pipelines that passed

## [ ] S10 — Scale partner-HS4 evidence

**Start only if:** Electronics partner evidence passes Gate 1.

Scale in this order:

1. top 12 partners for the top 100 deficit and export products
2. all products within high-priority manufactured sectors
3. broader HS-4 coverage only if refresh and reconciliation remain stable

Do not use “all 1,235 products” as the first milestone.

## [ ] S11 — Scale price/volume and domestic-supply evidence

**Start only if:** Edible-oils evidence passes Gate 1.

Scale by product families with consistent units:

1. energy
2. fertilisers
3. base-metal feedstocks
4. agricultural commodities

Products with incompatible or unstable units stay excluded.

## [ ] S12 — Add policy overlays selectively

**Start only for:** Products with a published opportunity brief or evidence
pilot.

Every policy row needs:

- effective date
- primary source
- measure type
- affected tariff line or product scope
- expiry/review date when applicable

Policy presence must not be presented as policy effectiveness.

## [ ] S13 — State capability pilot

**Start only when:** A defensible state × sector/product source is secured.

Pilot one sector with strong evidence before creating a national map. Good
candidate: electronics or automobiles, depending on source availability.

Do not infer state capability from company announcements, national totals, or
port location alone.

---

# Phase 5 — Operations and publication

## [ ] S14 — Provenance and staleness system

Begin once the first external pilot is accepted.

Record for every generated dataset:

- source URL
- source period
- fetch date
- row count
- checksum
- transformation version
- validation status

Display evidence age by dimension. Fail validation when generated data and
provenance disagree.

## [ ] S15 — Shareable research outputs

Begin after Scenario Model v2 and evidence cards are stable.

- URL-encoded filters and scenarios
- CSV export of filtered products
- evidence-card image/PDF export
- methodology and fiscal-year footer on every export

---

# The actual next work

## This week

1. **S01 — Write the decision charter**
2. **S03 — Add automated validation**
3. **S02 — Run the five research journeys**

## Immediately after

4. **S04 — Raise curated value coverage**
5. **S05 — Add regression tests**
6. **S06 and S07 — Build the two evidence pilots**

## Explicitly not next

- a national state-capability map
- full tariff coverage
- full partner-HS4 coverage
- HS-6 coverage across all sectors
- more general-purpose visualisations
- a more complex scenario model without sourced defaults

---

# Definition of success

The next phase is successful when a user can answer:

> “Why is this product a credible opportunity, what evidence supports that
> conclusion, what could realistically move the net deficit, and what important
> evidence is still missing?”

If the work only makes the dashboard larger, it has failed.
