# Idea Evaluation Handbook

This handbook helps contributors turn a raw idea into a ranked, reviewable
proposal for India Trade Monitor.

The goal is not to pretend we can precisely predict trade outcomes. The goal is
to compare ideas consistently: what they might explain, how much trade relevance
they have, how hard they are to implement, who can implement them, and how much
they improve the public report.

## The Idea Card

Every substantial idea should be written as a short card before it becomes code
or report work.

Use this shape:

- `Idea`: one sentence.
- `Claim or question`: what the idea helps test, explain, or show.
- `Trade channel`: export growth, import reduction, deficit explanation, source
  quality, dashboard usability, or public interpretation.
- `Affected data`: product group, HS code, partner country, chart, source, or
  report section.
- `Contributor fit`: frontend, data pipeline, methodology, report, or mixed.
- `First implementation`: the smallest version that creates public value.
- `Evidence needed`: source files, official links, chart output, or caveats.
- `Uncertainty`: what should not be over-claimed.

## The Square Frame

Use the square frame to decide where an idea belongs before scoring it.

| | Easy to implement | Hard to implement |
|---|---|---|
| High trade/report impact | `Rank A: Do soon` | `Rank B: Strategic bet` |
| Lower trade/report impact | `Rank C: Good starter` | `Park: Needs sharper case` |

Definitions:

- `High trade/report impact`: the idea explains a major export, import, deficit,
  source-trust, or reader-understanding problem.
- `Easy to implement`: one contributor can make a useful first version without
  redesigning the app, data model, or methodology.
- `Hard to implement`: the idea needs new source work, reconciliation, complex UI,
  or a larger analytical note.
- `Good starter`: useful scoped work that helps the repo even if it is not a major
  trade-balance idea.
- `Park`: not rejected, but not ready. It needs better evidence, a smaller first
  version, or a clearer reason to matter.

## Scorecard

Score each dimension from `1` to `5`. The total is not a final truth; it is a
triage aid.

| Dimension | What it asks | 1 | 3 | 5 |
|---|---|---:|---:|---:|
| Trade-balance relevance | Could this explain export growth, import reduction, or deficit pressure? | Weak or indirect | Sector-level relevance | Directly tied to a large export/import/deficit driver |
| Evidence strength | Can we support it with official data or transparent methodology? | Anecdotal | Some source support | Strong official or reproducible evidence |
| Implementation ease | Can a first version be built safely? | Large or unclear | Moderate scope | Small, clear, low-risk |
| Contributor fit | Is it obvious who can implement it? | No clear owner | Mixed ownership | Clear frontend, data, methodology, or report owner |
| Public report value | Will it help readers understand the trade story better? | Minor clarity gain | Useful explanation | Changes how readers interpret an important trend |
| Uncertainty control | Can we state limits and caveats honestly? | High risk of over-claiming | Caveats available | Clear limits and careful wording are easy |

Suggested rank and GitHub label:

- `Rank A` / `rank:A`: 24 to 30 points and in the high-impact/easy quadrant.
- `Rank B` / `rank:B`: 21 to 30 points but hard to implement, or strategically
  important.
- `Rank C` / `rank:C`: 16 to 23 points with a clear small first version.
- `Park` / `parked`: below 16 points, unclear evidence, or unclear first
  implementation.

## Estimating Trade Impact

For ideas about exports, imports, or the deficit, estimate impact as a range, not
a promise.

Use one of these forms:

- `Directional`: likely export-positive, import-reducing, deficit-explaining, or
  neutral.
- `Basket size`: the current export/import value of the affected group, HS code,
  or partner flow.
- `Plausible lever`: what would have to change for the idea to matter, such as
  higher domestic value addition, import substitution, new export markets, better
  source reconciliation, or clearer public interpretation.
- `Confidence`: low, medium, or high, based on source quality.

Do not claim that a dashboard or report change will itself reduce imports or
increase exports. Instead, say the idea helps identify, explain, or prioritize a
real-economy opportunity.

## Who Can Implement It

Use this owner map:

- `Frontend`: chart annotations, mobile readability, interaction states, source
  visibility, citation-friendly views.
- `Data pipeline`: source fetches, generated files, refresh checklists,
  validation, logging, automation proposals.
- `Methodology`: source reconciliation, caveats, fiscal-year conventions,
  provisional-data handling, measurement limits.
- `Report`: narrative framing, sector notes, comparison notes, explanatory
  caveats, reader-facing synthesis.
- `Mixed`: anything requiring two or more of the above.

If an idea is mixed, name the first owner and the handoff. For example:
`Methodology first, then frontend annotation`.

## Ranking Workflow

1. Write the idea card.
2. Place it in the square frame.
3. Score the six dimensions.
4. Assign a suggested rank.
5. Name the first owner.
6. Define the smallest useful implementation.
7. Open or update a GitHub Issue with the score, rank, and uncertainty.

## Example

Idea: add a services-trade comparison note.

- Trade channel: deficit explanation.
- Affected data: merchandise deficit note and external-balance caveat.
- First implementation: a short report note explaining why goods-only analysis is
  not the full external-balance picture.
- Square frame: high impact, hard to implement.
- Score: trade-balance relevance `5`, evidence strength `3`, implementation ease
  `3`, contributor fit `4`, public report value `5`, uncertainty control `4`.
- Suggested rank: `Rank B: Strategic bet`.
- First owner: methodology/report.
- Uncertainty: requires careful sourcing outside the current merchandise-only
  data workspace.

## Leaderboard Use

A public idea leaderboard should sort issues by:

1. suggested rank
2. total score
3. evidence strength
4. implementation ease

Use the GitHub rank labels (`rank:A`, `rank:B`, `rank:C`, `parked`) as the
coarse sorting layer, then use the issue's scorecard fields for finer ordering.
The leaderboard should not shame low-ranked ideas. A `Park` idea may become a
strong idea later if someone adds evidence, narrows the first implementation, or
connects it to a clearer report question.
