# Week 11 Team Assignment Sheet (Lead + 2 Developers)

This sheet translates `week-11-leads-navigation-exit-intent-and-admin-complete.md` into clear, non-duplicated ownership for Team Lead, Developer A (Frontend/UI), and Developer B (Backend/Platform).

Use this sheet together with:

- `docs/implementation-plan/week-11-leads-navigation-exit-intent-and-admin-complete.md`
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

- A11 Leads
- A13 Exit Intent
- A14 Navigation
- A09 Metrics polish

### Route/Page Scope

- /admin/leads
- /admin/exit-intent
- /admin/navigation
- /admin/metrics

### API Endpoint Scope

- GET /api/v1/leads
- PATCH /api/v1/leads/[id]
- GET/PATCH /api/v1/exit-intent
- GET/PATCH /api/v1/navigation


## Day-by-Day Assignment Plan


## Day 1 — Leads admin (A11): inbox, detail panel, status workflow


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/exit_intent_system_spec.md`
- `docs/api_reference.md`
- `docs/analytics_guide.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/admin_wireframe_specifications.md`

### Team Lead

- [ ] W11-TL-101: Define measurable acceptance criteria and dependencies for "Leads admin (A11): inbox, detail panel, status workflow" before execution starts.
- [ ] W11-TL-102: Review merged output for "Leads admin (A11): inbox, detail panel, status workflow" against security, contract, and quality requirements.
- [ ] W11-TL-103: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W11-A-101: Build `/admin/leads` split view: list + detail panel with message rendering in a safe scroll container.
- [ ] W11-A-102: Implement internal notes field updates with optimistic UI + rollback.
- [ ] W11-A-103: Add search/filter by inquiry type and status with server-side queries.

### Developer B

- [ ] W11-B-101: Implement status transitions per API contract (align enums across DB/API/UI in the same PR if mismatches exist).
- [ ] W11-B-102: Add tests: editor cannot access leads endpoints; owner can.
- [ ] W11-B-103: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 2 — Navigation public fetch + admin Navigation module (A14)


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/exit_intent_system_spec.md`
- `docs/api_reference.md`
- `docs/analytics_guide.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/02_design_system_component_library_brief.md`

### Team Lead

- [ ] W11-TL-201: Define measurable acceptance criteria and dependencies for "Navigation public fetch + admin Navigation module (A14)" before execution starts.
- [ ] W11-TL-202: Review merged output for "Navigation public fetch + admin Navigation module (A14)" against security, contract, and quality requirements.
- [ ] W11-TL-203: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W11-A-201: Build `/admin/navigation` editor: reorder, enable/disable, set labels/hrefs with validation against `routes.ts` allowlist.
- [ ] W11-A-202: Add tests for invalid href rejection and cycle prevention (if reorder uses linked list).
- [ ] W11-A-203: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W11-B-201: Implement `GET /api/v1/navigation` and `PATCH /api/v1/navigation` (owner-only) per route tables.
- [ ] W11-B-202: Wire public header/footer to server-fetch navigation config with caching (short TTL + tag revalidation on PATCH).
- [ ] W11-B-203: Add migration/seed default nav items mirroring baseline IA.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 3 — Exit intent config API + admin UI (A13)


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/exit_intent_system_spec.md`
- `docs/api_reference.md`
- `docs/analytics_guide.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/02_design_system_component_library_brief.md`

### Team Lead

- [ ] W11-TL-301: Add preview modal in admin (safe sandbox) to validate copy and CTA destinations.
- [ ] W11-TL-302: Add audit trail fields (updated_by, updated_at) if schema supports; otherwise add minimal logging.
- [ ] W11-TL-303: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W11-A-301: Implement config schema validation for contexts map (headline, supportingLine, CTA fields, dismiss text, delay).
- [ ] W11-A-302: Build `/admin/exit-intent` UI for editing contexts in one normalized document (per technical spec addendum).
- [ ] W11-A-303: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W11-B-301: Add tests: invalid config rejected; valid config saved.
- [ ] W11-B-302: Execute validation/integration/security checks for services changed by "Exit intent config API + admin UI (A13)".
- [ ] W11-B-303: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 4 — Public exit intent hook + modal + exclusions (e.g., `/contact`)


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/exit_intent_system_spec.md`
- `docs/api_reference.md`
- `docs/analytics_guide.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/02_design_system_component_library_brief.md`

### Team Lead

- [ ] W11-TL-401: Define measurable acceptance criteria and dependencies for "Public exit intent hook + modal + exclusions (e.g., `/contact`)" before execution starts.
- [ ] W11-TL-402: Review merged output for "Public exit intent hook + modal + exclusions (e.g., `/contact`)" against security, contract, and quality requirements.
- [ ] W11-TL-403: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W11-A-401: Implement `useExitIntent` hook with documented thresholds; respect `prefers-reduced-motion`.
- [ ] W11-A-402: Implement modal component with Framer Motion per spec; ensure focus trap and ESC handling.
- [ ] W11-A-403: Enforce exclusions (e.g., do not trigger on `/contact` if spec requires).

### Developer B

- [ ] W11-B-401: Wire `GET /api/v1/exit-intent` fetch with ISR/revalidate policy.
- [ ] W11-B-402: Execute validation/integration/security checks for services changed by "Public exit intent hook + modal + exclusions (e.g., `/contact`)".
- [ ] W11-B-403: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 5 — Metrics admin polish (A09) + dashboard alignment


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/exit_intent_system_spec.md`
- `docs/api_reference.md`
- `docs/analytics_guide.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/admin_wireframe_specifications.md`

### Team Lead

- [ ] W11-TL-501: Review `/admin/metrics` UX against spec; fix table edit regressions.
- [ ] W11-TL-502: Review merged output for "Metrics admin polish (A09) + dashboard alignment" against security, contract, and quality requirements.
- [ ] W11-TL-503: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W11-A-501: Ensure org metrics timestamps displayed on dashboard match queries.
- [ ] W11-A-502: Validate responsiveness and accessibility for all updated screens/routes tied to "Metrics admin polish (A09) + dashboard alignment".
- [ ] W11-A-503: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W11-B-501: Add validation for numeric ranges and units.
- [ ] W11-B-502: Add tests for concurrent edits (last-write-wins behavior documented).
- [ ] W11-B-503: Performance check: dashboard query batching.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 6 — Admin end-to-end regression (A01–A15) + security smoke


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/exit_intent_system_spec.md`
- `docs/api_reference.md`
- `docs/analytics_guide.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/admin_wireframe_specifications.md`

### Team Lead

- [ ] W11-TL-601: Define measurable acceptance criteria and dependencies for "Admin end-to-end regression (A01–A15) + security smoke" before execution starts.
- [ ] W11-TL-602: Review merged output for "Admin end-to-end regression (A01–A15) + security smoke" against security, contract, and quality requirements.
- [ ] W11-TL-603: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W11-A-601: Run Playwright suite across all admin modules: create/edit/publish where applicable.
- [ ] W11-A-602: Validate responsiveness and accessibility for all updated screens/routes tied to "Admin end-to-end regression (A01–A15) + security smoke".
- [ ] W11-A-603: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W11-B-601: Run API security smoke: unauth 401, editor forbidden on owner routes.
- [ ] W11-B-602: Verify session expiry behavior matches chosen policy (document hours).
- [ ] W11-B-603: Verify logout clears session and prevents reuse of old cookie (blocklist).

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 7 — Milestone sign-off: “Admin dashboard complete” + handoff to animation phase


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/exit_intent_system_spec.md`
- `docs/api_reference.md`
- `docs/analytics_guide.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/02_design_system_component_library_brief.md`

### Team Lead

- [ ] W11-TL-701: Stakeholder demo: leads workflow, nav update propagation, exit intent config + live modal.
- [ ] W11-TL-702: Security sign-off: RBAC, uploads, nav URL validation, exit intent open redirect checks.
- [ ] W11-TL-703: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W11-A-701: Create animation backlog tied to `docs/project_roadmap.md` Phase 4 items.
- [ ] W11-A-702: Validate responsiveness and accessibility for all updated screens/routes tied to "Milestone sign-off: “Admin dashboard complete” + handoff to animation phase".
- [ ] W11-A-703: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W11-B-701: Update roadmap tracking artifacts (if used).
- [ ] W11-B-702: Celebrate milestone and lock critical admin APIs for change-control.
- [ ] W11-B-703: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

---

## Ticket Import Format (copy into GitHub/Jira)

- **Title:** `[W11][Owner] <ticket-id> - <explicit action + scope>`
- **Labels:** `week-11`, `owner-lead|owner-dev-a|owner-dev-b`, `security|frontend|backend|infra|qa`.
- **Description:** include exact reference documents used, acceptance criteria, and evidence requirements.
- **Definition of Done:** daily deliverable gate + weekly gate must both be satisfied.

---

## Week Sign-off Checklist (Lead)

- [ ] All TL/A/B tickets closed or explicitly carried with owner/date.
- [ ] CI required checks green for merged PRs.
- [ ] Security and contract checks passed for the week scope.
- [ ] Reference-document alignment confirmed for each day.
- [ ] Week status updated in `v1-execution-tracker.md`.
