# Week 14 Team Assignment Sheet (Lead + 2 Developers)

This sheet translates `week-14-analytics-instrumentation-and-dashboard-insights.md` into clear, non-duplicated ownership for Team Lead, Developer A (Frontend/UI), and Developer B (Backend/Platform).

Use this sheet together with:

- `docs/implementation-plan/week-14-analytics-instrumentation-and-dashboard-insights.md`
- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`

---

## Working Agreement for the Week

- Ticket text must state exactly what is being built, tested, and delivered (no generic phrasing).
- Each ticket must attach implementation evidence (PR, CI run, report, or screenshot/video).
- No merge without CI green and Lead approval.
- Security-impacting changes require explicit security checklist in PR description.
- End of each day: update tracker status and capture blockers with owner + ETA.

---

## Ownership Summary

- **Team Lead:** architecture decisions, sequencing, acceptance criteria, security/quality sign-off, release control.
- **Developer A (Frontend/UI):** route implementation, UI states, accessibility, interactions, and visual verification.
- **Developer B (Backend/Platform):** API/data/infrastructure/security implementation, integration tests, observability evidence.

---


## Week-Specific Domain Scope (Must be Explicitly Tracked)

### Screen IDs

- A15 Analytics View

### Route/Page Scope

- Public analytics-instrumented pages
- /admin/analytics

### API Endpoint Scope

- Analytics summary endpoints under /api/v1 (project canonical)
- Event instrumentation: contact_form_submitted, scroll_depth_*, exit_intent_*


## Day-by-Day Assignment Plan


## Day 1 — Plausible CE deployment wiring + baseline pageview script


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/analytics_guide.md`
- `docs/exit_intent_system_spec.md`
- `docs/14_user_interaction_navigation_flow_diagrams.md`
- `docs/api_reference.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/qa_testing_plan_checklist.md`

### Team Lead

- [ ] W14-TL-101: Define measurable acceptance criteria and dependencies for "Plausible CE deployment wiring + baseline pageview script" before execution starts.
- [ ] W14-TL-102: Review merged output for "Plausible CE deployment wiring + baseline pageview script" against security, contract, and quality requirements.
- [ ] W14-TL-103: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W14-A-101: Add Next.js integration: public layout script component with `defer`, domain config, and strict staging/local exclusion rules.
- [ ] W14-A-102: Verify no console errors across key routes (per roadmap Phase 5 checks).
- [ ] W14-A-103: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W14-B-101: Deploy/configure Plausible CE per `docs/analytics_guide.md` (docker/service) in staging first; validate health endpoint.
- [ ] W14-B-102: Add documentation for self-hosted URL and env vars.
- [ ] W14-B-103: Add smoke test: script tag present on `/` and `/contact`.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 2 — Microsoft Clarity integration with privacy configuration


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/analytics_guide.md`
- `docs/exit_intent_system_spec.md`
- `docs/14_user_interaction_navigation_flow_diagrams.md`
- `docs/api_reference.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/qa_testing_plan_checklist.md`

### Team Lead

- [ ] W14-TL-201: Define measurable acceptance criteria and dependencies for "Microsoft Clarity integration with privacy configuration" before execution starts.
- [ ] W14-TL-202: Review merged output for "Microsoft Clarity integration with privacy configuration" against security, contract, and quality requirements.
- [ ] W14-TL-203: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W14-A-201: Mask sensitive fields on `/contact` and any PII-bearing UI.
- [ ] W14-A-202: Validate performance impact (long tasks).
- [ ] W14-A-203: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W14-B-201: Add Clarity snippet via Next.js `Script` strategy after consent policy check (site is cookieless for Plausible; follow analytics guide for Clarity GDPR mode guidance).
- [ ] W14-B-202: Add runbook note: who can access Clarity, retention expectations.
- [ ] W14-B-203: Add smoke test: clarity script loads only on public routes (not admin unless explicitly required).

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 3 — Custom scroll depth events + `contact_form_submitted` plumbing


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/analytics_guide.md`
- `docs/exit_intent_system_spec.md`
- `docs/14_user_interaction_navigation_flow_diagrams.md`
- `docs/api_reference.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/qa_testing_plan_checklist.md`

### Team Lead

- [ ] W14-TL-301: Define measurable acceptance criteria and dependencies for "Custom scroll depth events + `contact_form_submitted` plumbing" before execution starts.
- [ ] W14-TL-302: Review merged output for "Custom scroll depth events + `contact_form_submitted` plumbing" against security, contract, and quality requirements.
- [ ] W14-TL-303: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W14-A-301: Implement the day's required UI/route behaviors for "Custom scroll depth events + `contact_form_submitted` plumbing" with complete interaction states.
- [ ] W14-A-302: Validate responsiveness and accessibility for all updated screens/routes tied to "Custom scroll depth events + `contact_form_submitted` plumbing".
- [ ] W14-A-303: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W14-B-301: Implement scroll depth buckets (`scroll_depth_25/50/75/100`) with IO-based measurement.
- [ ] W14-B-302: Implement `contact_form_submitted` event on the authoritative success path with explicit deduplication to avoid double counting.
- [ ] W14-B-303: Add dedupe keys / session memory to prevent repeated firing.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 4 — Exit intent analytics hooks + QA alignment


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/analytics_guide.md`
- `docs/exit_intent_system_spec.md`
- `docs/14_user_interaction_navigation_flow_diagrams.md`
- `docs/api_reference.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/qa_testing_plan_checklist.md`

### Team Lead

- [ ] W14-TL-401: Update QA checklist mapping for future full pass.
- [ ] W14-TL-402: Review merged output for "Exit intent analytics hooks + QA alignment" against security, contract, and quality requirements.
- [ ] W14-TL-403: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W14-A-401: Implement `exit_intent_shown`, `exit_intent_cta_click`, `exit_intent_dismiss` (exact names per `docs/analytics_guide.md`; adjust code to match docs in the same PR if names differ).
- [ ] W14-A-402: Ensure events include only safe context keys (route/context id), not freeform user text.
- [ ] W14-A-403: Wire events into modal lifecycle hooks from Week 11.

### Developer B

- [ ] W14-B-401: Add Playwright assertions that event function called (mock plausible in test).
- [ ] W14-B-402: Execute validation/integration/security checks for services changed by "Exit intent analytics hooks + QA alignment".
- [ ] W14-B-403: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 5 — Admin analytics API + caching (`GET /api/v1/metrics` summary extensions / `analytics/summary` per docs)


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/analytics_guide.md`
- `docs/exit_intent_system_spec.md`
- `docs/14_user_interaction_navigation_flow_diagrams.md`
- `docs/api_reference.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/qa_testing_plan_checklist.md`

### Team Lead

- [ ] W14-TL-501: Define measurable acceptance criteria and dependencies for "Admin analytics API + caching (`GET /api/v1/metrics` summary extensions / `analytics/summary` per docs)" before execution starts.
- [ ] W14-TL-502: Review merged output for "Admin analytics API + caching (`GET /api/v1/metrics` summary extensions / `analytics/summary` per docs)" against security, contract, and quality requirements.
- [ ] W14-TL-503: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W14-A-501: Add robust error handling for upstream analytics outages (graceful degradation UI).
- [ ] W14-A-502: Validate responsiveness and accessibility for all updated screens/routes tied to "Admin analytics API + caching (`GET /api/v1/metrics` summary extensions / `analytics/summary` per docs)".
- [ ] W14-A-503: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W14-B-501: Implement summary aggregation endpoint(s) as documented in `docs/api_reference.md` (normalize paths under `/api/v1`).
- [ ] W14-B-502: Add Redis caching with TTL and cache bust strategy on deploy.
- [ ] W14-B-503: Add authorization: owner-only if spec requires; editors excluded from sensitive summaries.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 6 — Admin Analytics screen (A15): charts, funnels, and operational views


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/analytics_guide.md`
- `docs/exit_intent_system_spec.md`
- `docs/14_user_interaction_navigation_flow_diagrams.md`
- `docs/api_reference.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/qa_testing_plan_checklist.md`

### Team Lead

- [ ] W14-TL-601: Add export CSV capability for operational reporting in V1.
- [ ] W14-TL-602: Review merged output for "Admin Analytics screen (A15): charts, funnels, and operational views" against security, contract, and quality requirements.
- [ ] W14-TL-603: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W14-A-601: Build dashboard layout per admin UI spec: cards, charts, tables.
- [ ] W14-A-602: Validate responsiveness and accessibility for all updated screens/routes tied to "Admin Analytics screen (A15): charts, funnels, and operational views".
- [ ] W14-A-603: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W14-B-601: Implement date range selector with timezone correctness.
- [ ] W14-B-602: Add empty/error states for upstream failures.
- [ ] W14-B-603: Playwright smoke: owner can open analytics; editor cannot.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 7 — Analytics verification week closeout + documentation + perf check


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/analytics_guide.md`
- `docs/exit_intent_system_spec.md`
- `docs/14_user_interaction_navigation_flow_diagrams.md`
- `docs/api_reference.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/qa_testing_plan_checklist.md`

### Team Lead

- [ ] W14-TL-701: Run stakeholder demo of A15.
- [ ] W14-TL-702: Groom Week 15 hardening tasks (full QA matrix, vuln remediation, backups).
- [ ] W14-TL-703: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W14-A-701: Run Lighthouse on key pages with analytics enabled; compare to Week 13 baseline.
- [ ] W14-A-702: Update operator docs: where dashboards live, how to validate events, troubleshooting.
- [ ] W14-A-703: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W14-B-701: Verify Plausible + Clarity do not violate CSP (adjust CSP hashes/nonces if used).
- [ ] W14-B-702: Execute validation/integration/security checks for services changed by "Analytics verification week closeout + documentation + perf check".
- [ ] W14-B-703: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

---

## Ticket Import Format (copy into GitHub/Jira)

- **Title:** `[W14][Owner] <ticket-id> - <explicit action + scope>`
- **Labels:** `week-14`, `owner-lead|owner-dev-a|owner-dev-b`, `security|frontend|backend|infra|qa`.
- **Description:** include exact reference documents used, acceptance criteria, and evidence requirements.
- **Definition of Done:** daily deliverable gate + weekly gate must both be satisfied.

---

## Week Sign-off Checklist (Lead)

- [ ] All TL/A/B tickets closed or explicitly carried with owner/date.
- [ ] CI required checks green for merged PRs.
- [ ] Security and contract checks passed for the week scope.
- [ ] Reference-document alignment confirmed for each day.
- [ ] Week status updated in `v1-execution-tracker.md`.
