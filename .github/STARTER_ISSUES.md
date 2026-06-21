# Starter Issue Backlog

This file seeds the first public backlog. Each item is designed to become a
GitHub Issue with the listed labels.

## 1. Data: Improve the FTSPCC source note

Labels: `good first issue`, `data-pipeline`, `docs`, `needs-source`, `rank:C`

Problem: `data/sources.md` explains the FTSPCC monthly source, but a new
contributor still has to infer how the March cumulative row becomes a fiscal-year
total.

Why it matters: source notes are the trust layer for the dashboard.

Proposed next step: add a concise explanation of the March cumulative convention
and name the generated files that depend on it.

## 2. Product: Add a chart caveat for provisional FY2025-26 data

Labels: `good first issue`, `frontend`, `methodology`, `rank:C`

Problem: the dashboard labels FY2025-26 as provisional in the masthead, but some
chart contexts may still read like closed-year certainty.

Why it matters: public readers should see uncertainty close to the claim they are
interpreting.

Proposed next step: identify one chart where the provisional caveat should appear
near the title, legend, or footer.

## 3. Method: Document FTSPCC vs FTPA total differences

Labels: `methodology`, `needs-source`, `help wanted`, `rank:B`

Problem: the report mentions that official totals differ across source paths, but
contributors need a clearer issue-sized reconciliation target.

Why it matters: source differences are expected, but unexplained differences can
reduce trust.

Proposed next step: compare one overlapping year across FTSPCC, FTPA, and HS4
totals, then propose wording for the method note.

## 4. Product: Fix cramped axis labels on CompositionChart at ≤375 px

Labels: `good first issue`, `frontend`, `needs-design`, `rank:C`

Problem: `app/components/charts/CompositionChart.js` shows year-axis labels
every `labelStep` ticks, but on a 375 px viewport the step calculation can
still produce overlapping text when there are 5 years to show.

File to edit: `app/components/charts/CompositionChart.js` (the `labelStep`
computation around line 182, and the `compact` padding object).

Acceptance criteria:
- At 375 px width, no two axis labels overlap.
- The latest year label is always visible.
- `npm run build` passes.
- PR includes a screenshot at 375 px before and after.

Done when: the build passes and the before/after screenshot confirms labels
no longer overlap.

## 5. Data: Draft a manual all-data refresh checklist

Labels: `good first issue`, `data-pipeline`, `docs`, `rank:C`

Problem: README lists refresh commands, but there is no checklist that says what
to run, what files should change, and what to inspect after a refresh.

Why it matters: a repeatable checklist lowers the risk of stale or partial data
updates.

Proposed next step: add a short checklist to docs or README that maps commands to
expected output files.

## 6. Data: Add a `refresh:all` npm script that runs every fetch in order

Labels: `data-pipeline`, `help wanted`, `rank:B`

Problem: `package.json` only wires one of the eight fetch/build scripts, so
contributors have to copy-paste commands from `README.md` and get the order
wrong.

Files to edit: `package.json` (`scripts` block), `README.md § Refresh the Data`.

Acceptance criteria:
- `npm run refresh:all` runs all scripts in dependency order and stops on the
  first non-zero exit.
- Correct order (from `README.md`):
  1. `fetch:monthly` → `build:yearly`
  2. `fetch:groups`
  3. `fetch:hs4-export` + `fetch:hs4-import` (can be parallel)
  4. `fetch:country` → `build:country-slim`
  5. `fetch:rbi-fx`
  6. `fetch:partner-products`
- `README.md` documents the single command and what files it regenerates.
- `npm run build` still passes after running `refresh:all`.

Done when: `npm run refresh:all` in a clean checkout regenerates `data/` with
no manual steps beyond `pip install -r scripts/requirements.txt`.

## 7. Report: Create a services-trade comparison note

Labels: `report`, `methodology`, `help wanted`, `rank:B`

Problem: the current report focuses on merchandise trade, but readers may
over-interpret the goods deficit without services context.

Why it matters: services exports materially change the broader external-balance
story.

Proposed next step: outline a short note that compares goods-only interpretation
with the broader services-aware caveat.

## 8. Product: Add one annotation for a major trade break

Labels: `frontend`, `report`, `needs-design`, `rank:C`

Problem: the charts show major breaks such as COVID reopening and the post-FY2023
export plateau, but readers have to infer the story.

Why it matters: annotations can connect the visual to the report without adding
clutter.

Proposed next step: propose one annotation and the exact chart where it should
appear.

## 9. Method: Clarify cumulative deficit interpretation

Labels: `methodology`, `report`, `rank:B`

Problem: cumulative deficit and INR/USD can look mechanically linked because both
trend upward over time.

Why it matters: the report should prevent readers from mistaking visual
correlation for simple causation.

Proposed next step: tighten the caveat in the rupee note and consider whether the
dashboard needs a matching caption.

## 10. Docs: Add a worked example of adding a new chart to CLAUDE.md

Labels: `good first issue`, `docs`, `help wanted`, `rank:C`

Problem: `CLAUDE.md` explains the file layout but a first-time contributor still
has to figure out the plumbing: where to import data, which lib helpers to reuse,
and what the PR checklist looks like.

File to edit: `CLAUDE.md` (the "Adding a new chart" section).

Acceptance criteria:
- Add a step-by-step walkthrough: create the component file in
  `app/components/charts/`, import any needed data from `app/lib/transforms.js`,
  add the component to `app/page.js`, run `npm run build`.
- The example is concrete — it references real file names, not placeholders.
- The section ends with a two-item checklist: `npm run build` passes, screenshot
  added to the PR.

Done when: a contributor with no prior knowledge of this repo can follow the
section and add a minimal static chart without asking questions.

## 11. Docs: Publish a scored idea leaderboard in a GitHub Discussion or pinned issue

Labels: `docs`, `methodology`, `help wanted`, `rank:B`

Problem: ideas live in closed issues with inconsistent scoring, so new
contributors cannot see which ideas are highest-priority without reading through
old threads.

Files involved: `docs/idea-evaluation-handbook.md` (scoring rubric),
`.github/STARTER_ISSUES.md` (existing backlog to score).

Acceptance criteria:
- Score every item in `STARTER_ISSUES.md` using the six-dimension rubric from
  `docs/idea-evaluation-handbook.md` (trade relevance, evidence, ease, owner fit,
  report value, uncertainty control, each 1–5).
- Produce a sorted table: columns = Idea, Score, Rank (A/B/C/Park), Owner.
- Publish as either a GitHub Discussion (preferred) or a pinned issue.
- Link the leaderboard from `ROADMAP.md`.

Done when: the leaderboard is public, linked from `ROADMAP.md`, and includes all
11 seed items with scores.
