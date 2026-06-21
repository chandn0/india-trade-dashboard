# Contributing

Thanks for helping make India Trade Monitor more useful. This project is
builder-led: code, data, methodology, and report improvements all matter when
they make the public trade story easier to inspect or trust.

Use GitHub Issues as the primary intake for ideas, bugs, method concerns, and
proposals. Use pull requests for focused, reviewable changes.

## Choose Your Contribution Path

- `Frontend/UI`: improve chart readability, mobile behavior, accessibility,
  interaction states, or citation-friendly views in the dashboard.
- `Data/source pipeline`: improve fetch scripts, build scripts, data refresh
  notes, provenance, reproducibility, and failure diagnosis.
- `Methodology/reporting`: improve source reconciliation, caveats, fiscal-year
  conventions, provisional-data notes, and interpretation guardrails.
- `Docs/copy`: tighten README, roadmap, source notes, report notes, dashboard
  wording, and contributor guidance.

## Before You Start

1. Read [ROADMAP.md](ROADMAP.md) to understand the current priorities.
2. For substantial ideas, read the
   [Idea Evaluation Handbook](docs/idea-evaluation-handbook.md) and include a
   suggested rank.
3. Search existing issues to avoid duplicating work.
4. Comment on the issue you want to take so maintainers and contributors can
   coordinate.
5. If the work is not already captured, open an issue first with the problem,
   value, evidence, and suggested direction.

## Working Norms

- Keep pull requests small and scoped.
- Explain source or method changes clearly.
- Document uncertainty instead of hiding it.
- Avoid silent data-method changes.
- Prefer official primary sources where possible.
- Keep public interpretation careful: do not imply more certainty than the data
  supports.

## Local Workflow

Install and run locally:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Run a production build before opening a pull request:

```bash
npm run build
```

## Definition Of A Useful PR

A useful pull request explains:

- `What changed`: the concrete code, data, docs, or report change.
- `Why`: the public-report or dashboard value.
- `Source/method impact`: any source, assumption, reconciliation, or caveat
  affected by the change.
- `UI evidence`: screenshots or a short description if dashboard behavior changed.
- `Checks run`: at minimum, list whether `npm run build` was run.

For data pipeline changes, include sample output or a short before/after note so
reviewers can see what changed without re-running every source script.

## Issue-Writing Guide

Issues are the primary intake for ideas, bugs, data concerns, and proposals.

Please include:

- the problem or idea
- why it matters for the dashboard or report
- source, evidence, or example if available
- affected chart, file, page, or data series if known
- a proposed next step
- whether you are reporting, investigating, or volunteering to implement
- for substantial ideas, the square-frame placement, score, suggested rank, and
  likely first owner

Good issue titles are specific:

- `Idea: Add services-trade comparison to the report`
- `Method: Document FY2025-26 provisional differences across sources`
- `Bug: Partner share labels overlap on narrow mobile screens`
- `Data: Make FTSPCC fetch failures easier to diagnose`

## Good First Issue Characteristics

A good first issue should:

- touch a small, understandable part of the repo
- have a clear expected outcome
- name the relevant file, chart, or data source
- avoid requiring a full methodology redesign
- include enough context for a contributor to start without private knowledge

Maintainers should label these with `good first issue` and one area label such as
`frontend`, `data-pipeline`, `methodology`, `report`, or `docs`.

## Idea Ranking Guide

Use the [Idea Evaluation Handbook](docs/idea-evaluation-handbook.md) when an idea
is bigger than a small bug fix or copy edit.

The short version:

- place the idea in the square frame: high/low impact crossed with easy/hard
  implementation
- score trade relevance, evidence, ease, owner fit, report value, and uncertainty
  control from `1` to `5`
- suggest `Rank A`, `Rank B`, `Rank C`, or `Park`, then use the matching GitHub
  label: `rank:A`, `rank:B`, `rank:C`, or `parked`
- name who can implement the first version
- define the smallest useful implementation

This makes the issue easier to compare with other ideas and easier for a builder
to pick up.
