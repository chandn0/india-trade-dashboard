# Security Policy

India Trade Monitor is a public dashboard built from official, publicly
published Government of India trade data. It has **no user accounts, no
authentication, no database, and stores no secrets or personal data** — the
attack surface is small. Even so, we take reports seriously.

## Reporting a vulnerability

Please report security issues **privately**, not in a public issue:

- Preferred: open a private report via GitHub's
  [**Report a vulnerability**](https://github.com/chandn0/india-trade-dashboard/security/advisories/new)
  (Security → Advisories) on this repository.
- Alternatively, contact the maintainer ([@chandn0](https://github.com/chandn0))
  directly and we will coordinate a private channel.

Please include what you found, how to reproduce it, and the potential impact.

## What is in scope

- Issues in the dashboard app under `app/`.
- Issues in the data-fetch/build scripts under `scripts/` (e.g. a script that
  could be coerced into writing outside `data/`).
- Dependency vulnerabilities that are actually reachable from this project.

## What is out of scope

- The availability or correctness of upstream government data sources.
- Findings against the deployed hosting platform itself (report those to the
  platform).
- Theoretical issues with no realistic impact given the static, public nature
  of the site.

## Response

We aim to acknowledge a valid report within a few days and will keep you
updated as we investigate and ship a fix. Thank you for helping keep the
project and its readers safe.
