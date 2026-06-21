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

## 4. Product: Tighten one mobile chart layout pain point

Labels: `good first issue`, `frontend`, `needs-design`, `rank:C`

Problem: the dashboard is dense, and one chart should be checked for cramped
labels or tooltip behavior on mobile.

Why it matters: mobile readers should still be able to inspect the data rather
than only skim it.

Proposed next step: pick one chart, capture the mobile issue, and make a small
layout or copy adjustment with before/after evidence.

## 5. Data: Draft a manual all-data refresh checklist

Labels: `good first issue`, `data-pipeline`, `docs`, `rank:C`

Problem: README lists refresh commands, but there is no checklist that says what
to run, what files should change, and what to inspect after a refresh.

Why it matters: a repeatable checklist lowers the risk of stale or partial data
updates.

Proposed next step: add a short checklist to docs or README that maps commands to
expected output files.

## 6. Data: Explore scheduled data refresh automation

Labels: `data-pipeline`, `help wanted`, `rank:B`

Problem: data refresh is manual, and the repo does not yet define a safe GitHub
Action or equivalent workflow.

Why it matters: the dashboard should eventually stay current without relying on
manual local runs.

Proposed next step: propose a minimal scheduled-refresh design that runs scripts,
shows diffs, and avoids committing broken output automatically.

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

## 10. Docs: Make one contributor path easier to start

Labels: `good first issue`, `docs`, `help wanted`, `rank:C`

Problem: new contributors may still need more concrete examples for their first
PR.

Why it matters: clear first steps make outside contribution more likely.

Proposed next step: improve one section of `CONTRIBUTING.md` or `ROADMAP.md` with
a specific example and expected evidence.

## 11. Report: Create a public idea leaderboard

Labels: `report`, `methodology`, `help wanted`, `rank:B`

Problem: ideas can be submitted as issues, but there is not yet a public
leaderboard that ranks them by impact, evidence, ease, and owner fit.

Why it matters: contributors like knowing which ideas are most valuable, and
maintainers need a visible way to prioritize work without relying on private
judgment.

Proposed next step: use `docs/idea-evaluation-handbook.md` to draft a lightweight
leaderboard format that can live in an issue, project board, or report note.
