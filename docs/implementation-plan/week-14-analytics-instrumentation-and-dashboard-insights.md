# Week 14 — Plausible, Clarity, Custom Events, Scroll Depth, and Admin Analytics (A15)

## Week objectives

- Execute Phase 5 from `docs/project_roadmap.md`: bring the full analytics stack online per `docs/analytics_guide.md`—Plausible CE self-hosted, Microsoft Clarity (privacy settings), custom scroll depth events, exit-intent analytics hooks, and the admin analytics dashboard (A15) backed by summary endpoints.
- Ensure instrumentation does not violate privacy commitments and does not break CSP/CORS posture.

## Canonical references

- `docs/analytics_guide.md` — primary implementation source for events, setup, and reporting.
- `docs/exit_intent_system_spec.md` + `docs/14_user_interaction_navigation_flow_diagrams.md` — exit intent event expectations.
- `docs/api_reference.md` — analytics summary endpoint(s) as documented (normalized).
- `docs/04_admin_dashboard_ui_screen_design_specifications.md` — Screen A15.
- `docs/qa_testing_plan_checklist.md` — analytics verification items (incremental now, full gate later).

## Mandatory cross-cutting baseline

This week must implement in full compliance with `docs/implementation-plan/production-system-implementation-spec.md`.
## Daily Acceptance Gate (Applies to Day 1-Day 7)

Before marking any day complete, verify all of the following:

- [ ] Day deliverables are complete and linked to concrete evidence (PR, CI run, report, screenshot, or test output).
- [ ] Security checks for the day's scope are executed (auth/rate-limit/validation/headers/logging as applicable).
- [ ] UI work for the day follows token, state, accessibility, and responsiveness requirements from `production-system-implementation-spec.md`.
- [ ] Analytics work for the day uses canonical event names and avoids duplicate firing/PII leakage.
- [ ] Contract consistency is preserved (`/api/v1/*`, RBAC rules, schema enums, route conventions).
- [ ] No unresolved blocker remains that would invalidate downstream days in the same week.


---

## Day 1 — Plausible CE deployment wiring + baseline pageview script

### Objectives

- Load Plausible script on all public pages with compliant configuration and verify events in Plausible UI.

### Tasks

1. Deploy/configure Plausible CE per `docs/analytics_guide.md` (docker/service) in staging first; validate health endpoint.
2. Add Next.js integration: public layout script component with `defer`, domain config, and strict staging/local exclusion rules.
3. Verify no console errors across key routes (per roadmap Phase 5 checks).
4. Add documentation for self-hosted URL and env vars.
5. Add smoke test: script tag present on `/` and `/contact`.

### Deliverables

- [ ] Plausible pageviews visible in Plausible real-time dashboard (staging).

### Tools (free)

Docker, browser devtools console, Plausible UI.

### Dependencies / prerequisites

Staging/prod domains stable.

### Security and quality

- Ensure Plausible endpoint is HTTPS; avoid mixed content.

### Maintainability

- Wrap analytics in `AnalyticsProvider` to keep integration swappable.

---

## Day 2 — Microsoft Clarity integration with privacy configuration

### Objectives

- Add Clarity with masking settings consistent with `docs/analytics_guide.md` and security/privacy posture.

### Tasks

1. Add Clarity snippet via Next.js `Script` strategy after consent policy check (site is cookieless for Plausible; follow analytics guide for Clarity GDPR mode guidance).
2. Mask sensitive fields on `/contact` and any PII-bearing UI.
3. Validate performance impact (long tasks).
4. Add runbook note: who can access Clarity, retention expectations.
5. Add smoke test: clarity script loads only on public routes (not admin unless explicitly required).

### Deliverables

- [ ] Clarity recording works in staging with masking verified.

### Tools (free)

Microsoft Clarity UI, browser devtools.

### Dependencies / prerequisites

Day 1 baseline stable.

### Security and quality

- Never send secrets/admin content to Clarity; exclude `/admin/*` by default.

### Maintainability

- Centralize masking rules in one config module.

---

## Day 3 — Custom scroll depth events + `contact_form_submitted` plumbing

### Objectives

- Implement custom events described in `docs/analytics_guide.md` with stable naming and dedupe guards.

### Tasks

1. Implement scroll depth buckets (`scroll_depth_25/50/75/100`) with IO-based measurement.
2. Implement `contact_form_submitted` event on the authoritative success path with explicit deduplication to avoid double counting.
3. Add dedupe keys / session memory to prevent repeated firing.
4. Add unit tests for scroll threshold calculations.
5. Validate events appear in Plausible goals (configure goals as guide describes).

### Deliverables

- [ ] Core custom events visible and trustworthy in staging dashboards.

### Tools (free)

Plausible `window.plausible`, Vitest.

### Dependencies / prerequisites

Contact flow stable.

### Security and quality

- Do not include message bodies in event props.

### Maintainability

- Central `analytics/events.ts` with constants and payload types.

---

## Day 4 — Exit intent analytics hooks + QA alignment

### Objectives

- Emit exit-intent events consistent with `docs/exit_intent_system_spec.md` and analytics guide taxonomy.

### Tasks

1. Implement `exit_intent_shown`, `exit_intent_cta_click`, `exit_intent_dismiss` (exact names per `docs/analytics_guide.md`; adjust code to match docs in the same PR if names differ).
2. Ensure events include only safe context keys (route/context id), not freeform user text.
3. Wire events into modal lifecycle hooks from Week 11.
4. Add Playwright assertions that event function called (mock plausible in test).
5. Update QA checklist mapping for future full pass.

### Deliverables

- [ ] Exit intent analytics E2E-friendly and verified manually in Plausible.

### Tools (free)

Playwright, Plausible UI.

### Dependencies / prerequisites

Exit intent modal shipped.

### Security and quality

- Guard against event spam loops if modal reopens; debounce.

### Maintainability

- Single analytics wrapper used by exit intent module.

---

## Day 5 — Admin analytics API + caching (`GET /api/v1/metrics` summary extensions / `analytics/summary` per docs)

### Objectives

- Provide owner-visible analytics summaries for A15 without hammering Plausible/Clarity APIs.

### Tasks

1. Implement summary aggregation endpoint(s) as documented in `docs/api_reference.md` (normalize paths under `/api/v1`).
2. Add Redis caching with TTL and cache bust strategy on deploy.
3. Add authorization: owner-only if spec requires; editors excluded from sensitive summaries.
4. Add robust error handling for upstream analytics outages (graceful degradation UI).
5. Add tests for caching behavior and auth.

### Deliverables

- [ ] API returns stable JSON contract for dashboard consumption.

### Tools (free)

Upstash Redis, Vitest.

### Dependencies / prerequisites

Plausible/Clarity keys and endpoints available server-side.

### Security and quality

- Never expose API keys to client; all upstream calls server-only.

### Maintainability

- Typed DTOs for dashboard charts; version API with `v=` field if needed.

---

## Day 6 — Admin Analytics screen (A15): charts, funnels, and operational views

### Objectives

- Implement A15 UI: top pages, scroll depth funnel, contact conversions, exit intent performance, Clarity deep links (if allowed).

### Tasks

1. Build dashboard layout per admin UI spec: cards, charts, tables.
2. Implement date range selector with timezone correctness.
3. Add empty/error states for upstream failures.
4. Add export CSV capability for operational reporting in V1.
5. Playwright smoke: owner can open analytics; editor cannot.

### Deliverables

- [ ] A15 usable in staging with live data.

### Tools (free)

Recharts (MIT), TanStack Query.

### Dependencies / prerequisites

Day 5 API complete.

### Security and quality

- Confirm charts never display sensitive identifiers (lead emails).

### Maintainability

- Keep chart components dumb; data fetching in hooks.

---

## Day 7 — Analytics verification week closeout + documentation + perf check

### Objectives

- Sign off analytics milestone and ensure site remains performant with scripts enabled.

### Tasks

1. Run Lighthouse on key pages with analytics enabled; compare to Week 13 baseline.
2. Verify Plausible + Clarity do not violate CSP (adjust CSP hashes/nonces if used).
3. Update operator docs: where dashboards live, how to validate events, troubleshooting.
4. Run stakeholder demo of A15.
5. Groom Week 15 hardening tasks (full QA matrix, vuln remediation, backups).

### Deliverables

- [ ] Phase 5 milestone evidence: dashboards + docs + perf comparison.

### Tools (free)

Lighthouse, Markdown docs.

### Dependencies / prerequisites

Days 1–6 complete.

### Security and quality

- Review third-party domains in CSP allowlists; minimize.

### Maintainability

- Add “event dictionary” doc under `docs/` linking to code constants.

---

## V1 Definition of Done (Weekly Gate)

- [ ] All Day 1-Day 7 deliverables are completed with linked evidence (PRs, CI runs, reports).
- [ ] No open P0/P1 defects remain for this week's scope.
- [ ] Security controls introduced this week are implemented, tested, and documented.
- [ ] API/DB/UI contract changes are synchronized with `docs/` (no drift).
- [ ] Automated tests added this week are passing in CI.
- [ ] Rollback/operational notes for this week's changes are documented where applicable.

## Week completion checklist

- [ ] Plausible + Clarity integrated with privacy safeguards
- [ ] Custom events + exit intent events verified
- [ ] Admin analytics API + A15 UI operational
- [ ] Performance and CSP validated post-analytics
