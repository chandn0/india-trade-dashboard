# Decision Gate G01: Evidence Pilot Review

This document formally evaluates the Electronics and Edible-Oils evidence pilots against six operational criteria (scored 0–2). The purpose is to determine which evidence architectures should be scaled across the remaining 1,200+ products in the dashboard.

## Scoring Criteria

| Dimension               | 0 (Stop/Rethink)                          | 1 (Acceptable with limits)                  | 2 (Scaleable)                               |
| ----------------------- | ----------------------------------------- | ------------------------------------------- | ------------------------------------------- |
| **Decision Clarity**    | No change to baseline gross-value view    | Nuanced, but requires manual interpretation | Changes the recommended intervention        |
| **Source Reliability**  | Unsupported claims or circular references | Plausible industry/media reports            | Official, reproducible primary data         |
| **HS-4 Reconciliation** | Impossible to map                         | Maps cleanly to headings/chapters (Proxy)   | Maps precisely to the 4-digit product level |
| **Refreshability**      | Fully manual and unstructured             | Requires qualitative mapping/parsing        | Automated parsing of quantitative fields    |
| **Interface Value**     | Confusing or misleading                   | Useful context                              | Essential for strategic triage              |
| **Maintenance Cost**    | High (constant manual patching)           | Medium                                      | Low (scripted, resilient schema)            |

---

## 1. Electronics Pilot (HS 8517, 8542, 8507)

The electronics pilot focused on decomposing gross exports into net impacts by modelling imported-input dependency, localisable share, and capacity announcements.

| Dimension           |   Score    | Rationale                                                                                                                                                           |
| ------------------- | :--------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision Clarity    |   **2**    | Effectively proved that high-value finished exports (phones) mask deep structural deficits in components (chips).                                                   |
| Source Reliability  |   **1**    | Relies heavily on analyst assumptions and media-reported capacity targets rather than verified statistical releases.                                                |
| HS-4 Reconciliation |   **1**    | Many data points were chapter-level proxies (e.g. HS 85) applied downwards. Localisable share is highly product-specific but difficult to reconcile mathematically. |
| Refreshability      |   **0**    | Highly manual. Requires qualitative extraction of `installed_capacity` vs `announced_capacity` from unstructured PLI reports.                                       |
| Interface Value     |   **2**    | The Scenario Modeller (Sensitivity Analysis) built for this is exceptionally valuable for testing assumptions.                                                      |
| Maintenance Cost    |   **0**    | High. Constant manual validation and patching is required to prevent synthetic data errors.                                                                         |
| **Total**           | **6 / 12** | **Retain as Research Brief**                                                                                                                                        |

**Conclusion:** The electronics methodology is highly insightful but operationally fragile.
_Decision:_ Do **not** scale the qualitative domestic capacity or analyst-assumption mapping to the entire dataset. Retain the electronics data as a static, high-value research brief. The Scenario Modeller UI will be retained for generic use.

---

## 2. Edible-Oils Pilot (HS 1511, 1507, 1512)

The edible-oils pilot focused on physical dependency, mapping exact quantities (MT), unit values, and LMDI price-volume decompositions.

| Dimension           |    Score    | Rationale                                                                                                                     |
| ------------------- | :---------: | ----------------------------------------------------------------------------------------------------------------------------- |
| Decision Clarity    |    **2**    | Clearly isolates whether a deficit grew due to structural domestic demand (volume) or international commodity shocks (price). |
| Source Reliability  |    **2**    | Based on exact statistical releases from the Ministry of Commerce and agriculture bodies.                                     |
| HS-4 Reconciliation |    **2**    | Physical quantities and values map perfectly to HS-4 codes.                                                                   |
| Refreshability      |    **2**    | Highly structured. The LMDI decomposition is computed dynamically in the builder script.                                      |
| Interface Value     |    **2**    | The physical dependence and volume vs price effects are critical for commodities.                                             |
| Maintenance Cost    |    **2**    | Low. Schema is completely numeric and validated by automated economic checks (e.g. `quantity × unit_value ≈ trade_value`).    |
| **Total**           | **12 / 12** | **Scale Pipeline**                                                                                                            |

**Conclusion:** The physical quantity, unit-value, and LMDI decomposition architecture is robust, mathematically verifiable, and highly refreshable.
_Decision:_ **Scale** the quantity and unit-value evidence pipeline (S11) to other compatible bulk commodities (fuels, fertilisers, metal ores, agricultural products).

---

## Execution Directives for Wave 4

1. **Scale Partner Evidence (S10):** _Approved with conditions._ We will scale partner concentration data, but explicitly flag grain mismatches (amber `🟡`) when chapter proxies are used instead of exact HS-4 data.
2. **Scale Quantity/Unit-Value (S11):** _Fully Approved._ We will expand the edible-oils physical schema to crude petroleum, fertilisers, and metals.
3. **Scale Policy Evidence (S12):** _Approved._ Implement the strict 7-column policy contract.
4. **State Capability (S13):** _Deferred._ The electronics pilot showed that state-level capacity tracking is too manual and unstructured. We will prototype a stricter schema before attempting to map state capability nationwide.
