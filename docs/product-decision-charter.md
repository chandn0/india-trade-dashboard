# Product Decision Charter

## Product purpose

India Trade Monitor should help a user decide **which product areas deserve
deeper investigation** and which large trade lines should be excluded from an
import-substitution narrative because they are structural, productive, or
misleading on a gross basis.

It is a screening and prioritisation system. It is not an investment
recommendation, industrial feasibility study, or forecast of deficit reduction.

## Primary user

The next release is designed for an analyst, founder, researcher, or industry
team screening Indian import-substitution and domestic-value-add opportunities.

The primary user:

- understands sectors but may not know HS nomenclature
- wants to narrow a large trade universe to a defensible research shortlist
- needs to distinguish scale from tractability
- needs visible evidence and uncertainty before committing research time

## Secondary users

- Policy researchers comparing intervention types
- State or cluster teams looking for adjacent industrial capabilities
- Journalists and public-data users explaining large trade movements

Secondary use cases must not weaken the primary screening workflow.

## Core decision

After using the product, the primary user should be able to answer:

> Which product areas deserve deeper commercial or policy investigation, why do
> they rank highly, what could realistically change the net trade position, and
> what evidence is still missing?

## Questions the product must answer

1. How large are imports, exports, and the **net** balance?
2. Is the product a raw material, intermediate, finished good, capital good,
   energy input, agricultural commodity, or consumption asset?
3. Why does India import it?
4. Is the import buildable, growable, recoverable, substitutable, partly
   buildable, or structural?
5. Is the observed change driven by value, physical quantity, price, or an
   export-linked input requirement?
6. How concentrated are sourcing countries?
7. What domestic production or capacity already exists?
8. What is the realistic gross-to-net impact under explicit assumptions?
9. How confident is each conclusion?

## Required evidence before recommending an opportunity

An opportunity can be labelled **research-ready** only when it has:

- reconciled HS-4 import, export, and net values
- a reviewed dominant-use classification
- an explicit reason for the import
- a buildability category and binding constraint
- a realistic impact range applied to net rather than gross trade
- confidence and missing-evidence fields

An opportunity can be labelled **decision-ready** only when it additionally has
the relevant evidence for its product type:

- manufactured products: partner concentration and domestic capacity evidence
- commodities: quantity and unit-value evidence
- agricultural products: domestic production/yield and apparent consumption
- export-linked inputs: imported-content or value-chain evidence

## Evidence levels

| Level | Meaning                                              | Permitted use                                      |
| ----- | ---------------------------------------------------- | -------------------------------------------------- |
| E0    | No sourced evidence                                  | Display as unavailable; do not score the dimension |
| E1    | Transparent rule or directional proxy                | Discovery and filtering only                       |
| E2    | Reviewed product attribution or official aggregate   | Research shortlist                                 |
| E3    | Product-specific, reconciled official evidence       | Evidence-backed defaults and ranking               |
| E4    | Multiple reconciled sources or validated time series | Decision-ready analysis                            |

The interface must not visually present E1 and E4 evidence as equally certain.

## What the product must refuse to conclude

The dashboard must not claim:

- that the full import value is removable
- that import reduction automatically equals net-deficit reduction
- that a finished export represents wholly domestic value added
- that an HS-2 partner total is an HS-4 sourcing share
- that national trade reveals state-level capability
- that policy coverage proves policy effectiveness
- that a scenario is a forecast
- that a low-confidence rule classification is a reviewed fact

## Decision workflow

```text
Full HS-4 universe
  → classify economic stage
  → measure gross and net trade
  → exclude structural or misleading lines
  → identify plausible lever
  → inspect partner / quantity / capacity evidence
  → model explicit scenario
  → shortlist for a deeper sector study
```

## Page responsibilities

| Page or section      | Decision supported                                            |
| -------------------- | ------------------------------------------------------------- |
| Main trade dashboard | Understand macro scale, partners, trends, and context         |
| Product Composition  | Understand what form India trades and find products           |
| Automatic signals    | Identify candidates requiring attention, not recommendations  |
| Product profile      | Inspect evidence, offsets, history, and confidence            |
| Scenario laboratory  | Test assumptions and gross-to-net sensitivity                 |
| Buildability Atlas   | Compare intervention type, tractability, and realistic impact |
| Evidence coverage    | See what cannot yet be concluded                              |

Any section that supports none of these decisions should be removed or merged.

## Success measures

The next release succeeds when:

- a user can produce a five-product research shortlist in under 15 minutes
- every shortlisted product has a visible net balance and evidence level
- users can explain why a large import was excluded
- scenario assumptions can be reproduced outside the UI
- no unavailable evidence is rendered as zero
- at least one pilot changes ranking relative to gross-import order

## Current scope boundary

The current repository is strong enough for product discovery and directional
prioritisation. It is not yet decision-ready for partner concentration,
price-versus-volume analysis, domestic capacity, tariffs, or state capability
outside evidence pilots.

This boundary should narrow only when committed enrichment files contain sourced
and validated rows.
