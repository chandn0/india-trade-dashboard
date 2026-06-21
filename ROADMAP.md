# Roadmap

This roadmap helps contributors choose useful work. India Trade Monitor should
grow as a public trade report, not just as a codebase, so each workstream connects
implementation work to clearer public interpretation.

Substantial new ideas should use the
[Idea Evaluation Handbook](docs/idea-evaluation-handbook.md). The handbook gives
contributors a square frame, a scorecard, and a rank so ideas can be compared
without pretending the project can predict trade outcomes precisely.

## Data

Objective: make the data pipeline easier to run, verify, and refresh.

Why it matters: readers can only trust the dashboard if the source path is
reproducible and failures are visible.

Example issue shapes:

- `Data: Add clearer failure output to the FTSPCC yearly fetch script`
- `Data: Document which generated files change after each refresh command`
- `Data: Add a manual checklist for refreshing all committed snapshots`
- `Data: Compare latest generated country totals with stored summary totals`

Skills needed: JavaScript, shell basics, CSV/JSON handling, source inspection,
careful logging.

Good first contribution: improve one source note or add one small verification
step to a refresh workflow without changing the data model.

## Methodology

Objective: make source choices, reconciliation gaps, caveats, and provisional
status easier to understand.

Why it matters: official trade series can differ by source, extraction method,
and fiscal-year convention; the report should make those differences legible.

Example issue shapes:

- `Method: Explain why FTSPCC and FTPA totals differ in selected years`
- `Method: Add a provisional-data note for FY2025-26 charts`
- `Method: Clarify March cumulative fiscal-year convention in source docs`
- `Method: Document where HS4 totals are directional rather than exact matches`

Skills needed: data analysis, careful writing, source comparison, trade-data
context.

Good first contribution: add or tighten one caveat in `data/sources.md` or a
report note with a specific source reference.

## Product

Objective: make the dashboard easier to scan, use on mobile, and cite in public
writing.

Why it matters: clear visuals let readers inspect claims instead of taking the
report on trust.

Example issue shapes:

- `Product: Improve mobile spacing in the partner share chart`
- `Product: Add a chart annotation for a major import or export break`
- `Product: Make hover readouts easier to compare across years`
- `Product: Improve source visibility near chart footers`

Skills needed: React, MUI, responsive layout, SVG/chart UX, accessibility.

Good first contribution: fix one label, spacing, or annotation issue with a
before/after screenshot.

## Report

Objective: make the public interpretation sharper, better caveated, and easier
to extend.

Why it matters: the report should turn data into claims people can question,
reuse, and improve.

Example issue shapes:

- `Report: Add a services-trade comparison note`
- `Report: Explain electronics import dependence more clearly`
- `Report: Add a short caveat about cumulative deficit charts`
- `Report: Create a partner-country concentration note`

Skills needed: data storytelling, macro/trade context, technical writing,
careful caveating.

Good first contribution: improve one paragraph, caveat, or chart interpretation
without expanding the scope of the report.

## Not In Scope Right Now

- new backend services
- non-official data without strong justification
- major redesigns without a reporting need

## How To Propose New Work

Open a GitHub Issue with the problem, value, evidence, and suggested direction.
Use the closest issue template even if the idea is early. The goal is to turn
good questions into reviewable work.

For larger ideas, include:

- square-frame placement: `Rank A`, `Rank B`, `Rank C`, or `Park`
- scorecard total and the weakest dimension
- likely first owner: frontend, data pipeline, methodology, report, or mixed
- smallest useful implementation
- matching GitHub label: `rank:A`, `rank:B`, `rank:C`, or `parked`
