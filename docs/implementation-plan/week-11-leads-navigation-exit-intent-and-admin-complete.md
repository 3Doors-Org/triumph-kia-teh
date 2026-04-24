# Week 11 — Leads (A11), Navigation (A14), Exit Intent (A13), Metrics polish, and Admin Completion Milestone

## Week objectives

- Complete the remaining admin modules required for the **“admin dashboard complete”** milestone in `docs/project_roadmap.md`: Leads management, Navigation management, Exit Intent configuration, and any outstanding Metrics dashboard behaviors.
- Implement public/runtime wiring for navigation config + exit intent per `docs/exit_intent_system_spec.md`, `docs/14_user_interaction_navigation_flow_diagrams.md`, and normalized API notes in `docs/technical_spec.md`.

## Canonical references

- `docs/04_admin_dashboard_ui_screen_design_specifications.md` — A11, A13, A14, A09.
- `docs/exit_intent_system_spec.md` — modal, contexts, analytics hooks, testing expectations.
- `docs/api_reference.md` — leads, navigation, exit-intent endpoints (normalized).
- `docs/analytics_guide.md` — exit intent event naming alignment.
- `docs/qa_testing_plan_checklist.md` — exit intent and admin security tests (incrementally applicable).

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

## Day 1 — Leads admin (A11): inbox, detail panel, status workflow

### Objectives

- Implement owner-only leads operations (`GET /api/v1/leads`, `PATCH /api/v1/leads/[id]`) with UI aligned to admin spec.

### Tasks

1. Build `/admin/leads` split view: list + detail panel with message rendering in a safe scroll container.
2. Implement status transitions per API contract (align enums across DB/API/UI in the same PR if mismatches exist).
3. Implement internal notes field updates with optimistic UI + rollback.
4. Add search/filter by inquiry type and status with server-side queries.
5. Add tests: editor cannot access leads endpoints; owner can.

### Deliverables

- [ ] Leads workflow operational for owner role.

### Tools (free)

TanStack Query, Zod, Playwright.

### Dependencies / prerequisites

Contact submissions creating rows in `leads`.

### Security and quality

- Render message text safely (escape/plaintext component); never `dangerouslySetInnerHTML` for lead messages.

### Maintainability

- Keep lead status enum in one module imported by API + UI.

---

## Day 2 — Navigation public fetch + admin Navigation module (A14)

### Objectives

- Make navigation configurable via DB/API and consumed by public layout.

### Tasks

1. Implement `GET /api/v1/navigation` and `PATCH /api/v1/navigation` (owner-only) per route tables.
2. Build `/admin/navigation` editor: reorder, enable/disable, set labels/hrefs with validation against `routes.ts` allowlist.
3. Wire public header/footer to server-fetch navigation config with caching (short TTL + tag revalidation on PATCH).
4. Add migration/seed default nav items mirroring baseline IA.
5. Add tests for invalid href rejection and cycle prevention (if reorder uses linked list).

### Deliverables

- [ ] Public nav reflects admin changes without redeploy.

### Tools (free)

Drizzle, Zod, Vitest.

### Dependencies / prerequisites

Route registry from Week 02/06.

### Security and quality

- Prevent `javascript:` URLs and other dangerous schemes in nav items.

### Maintainability

- Store nav as structured records, not HTML blobs.

---

## Day 3 — Exit intent config API + admin UI (A13)

### Objectives

- Implement `GET/PATCH /api/v1/exit-intent` per canonical addendum and admin configuration UX.

### Tasks

1. Implement config schema validation for contexts map (headline, supportingLine, CTA fields, dismiss text, delay).
2. Build `/admin/exit-intent` UI for editing contexts in one normalized document (per technical spec addendum).
3. Add preview modal in admin (safe sandbox) to validate copy and CTA destinations.
4. Add audit trail fields (updated_by, updated_at) if schema supports; otherwise add minimal logging.
5. Add tests: invalid config rejected; valid config saved.

### Deliverables

- [ ] Admin can update exit intent config in staging.

### Tools (free)

React, Zod, Vitest.

### Dependencies / prerequisites

DB config table migrated (`exit_intent_configs` per schema doc).

### Security and quality

- Validate CTA URLs and disallow unsafe schemes; enforce max lengths to prevent DB bloat.

### Maintainability

- Version config schema with `schemaVersion` field if spec implies future migrations.

---

## Day 4 — Public exit intent hook + modal + exclusions (e.g., `/contact`)

### Objectives

- Implement client detection + modal presentation aligned with `docs/exit_intent_system_spec.md` and flow diagrams.

### Tasks

1. Implement `useExitIntent` hook with documented thresholds; respect `prefers-reduced-motion`.
2. Implement modal component with Framer Motion per spec; ensure focus trap and ESC handling.
3. Enforce exclusions (e.g., do not trigger on `/contact` if spec requires).
4. Wire `GET /api/v1/exit-intent` fetch with ISR/revalidate policy.
5. Add unit tests for pure detection logic; Playwright tests for modal open/close.

### Deliverables

- [ ] Exit intent works on at least one context in staging.

### Tools (free)

Framer Motion, Vitest, Playwright.

### Dependencies / prerequisites

Day 3 config API live.

### Security and quality

- Ensure modal CTA navigation cannot be abused via open redirects; validate URLs against allowlist.

### Maintainability

- Keep detection logic framework-agnostic in `lib/exit-intent/*` for testing.

---

## Day 5 — Metrics admin polish (A09) + dashboard alignment

### Objectives

- Ensure metrics editing and dashboard cards remain consistent after leads/navigation/exit intent additions.

### Tasks

1. Review `/admin/metrics` UX against spec; fix table edit regressions.
2. Ensure org metrics timestamps displayed on dashboard match queries.
3. Add validation for numeric ranges and units.
4. Add tests for concurrent edits (last-write-wins behavior documented).
5. Performance check: dashboard query batching.

### Deliverables

- [ ] Metrics module stable and consistent with dashboard.

### Tools (free)

Drizzle, EXPLAIN, Vitest.

### Dependencies / prerequisites

Metrics tables seeded.

### Security and quality

- Owner/editor permissions verified for metric updates per API matrix.

### Maintainability

- Centralize metric definitions (label/unit) to avoid UI/DB drift.

---

## Day 6 — Admin end-to-end regression (A01–A15) + security smoke

### Objectives

- Prove admin completion milestone with a structured regression pass.

### Tasks

1. Run Playwright suite across all admin modules: create/edit/publish where applicable.
2. Run API security smoke: unauth 401, editor forbidden on owner routes.
3. Verify session expiry behavior matches chosen policy (document hours).
4. Verify logout clears session and prevents reuse of old cookie (blocklist).
5. Triage defects into P0/P1/P2.

### Deliverables

- [ ] Regression report with pass/fail matrix.

### Tools (free)

Playwright, curl, checklist markdown.

### Dependencies / prerequisites

Days 1–5 complete.

### Security and quality

- Confirm no admin pages leak draft content via client bundles.

### Maintainability

- Tag release candidate after green regression.

---

## Day 7 — Milestone sign-off: “Admin dashboard complete” + handoff to animation phase

### Objectives

- Formalize admin completion and freeze scope heading into animation work.

### Tasks

1. Stakeholder demo: leads workflow, nav update propagation, exit intent config + live modal.
2. Update roadmap tracking artifacts (if used).
3. Create animation backlog tied to `docs/project_roadmap.md` Phase 4 items.
4. Security sign-off: RBAC, uploads, nav URL validation, exit intent open redirect checks.
5. Celebrate milestone and lock critical admin APIs for change-control.

### Deliverables

- [ ] Milestone sign-off notes + stable tag.

### Tools (free)

Screen recording, GitHub Releases (free).

### Dependencies / prerequisites

Day 6 fully green with no waivers.

### Security and quality

- Run `pnpm audit` and capture baseline before animation dependencies.

### Maintainability

- Capture “admin module owner map” for future maintenance.

---

## V1 Definition of Done (Weekly Gate)

- [ ] All Day 1-Day 7 deliverables are completed with linked evidence (PRs, CI runs, reports).
- [ ] No open P0/P1 defects remain for this week's scope.
- [ ] Security controls introduced this week are implemented, tested, and documented.
- [ ] API/DB/UI contract changes are synchronized with `docs/` (no drift).
- [ ] Automated tests added this week are passing in CI.
- [ ] Rollback/operational notes for this week's changes are documented where applicable.

## Week completion checklist

- [ ] Leads, Navigation, Exit Intent, Metrics modules complete.
- [ ] Public nav + exit intent behavior live in staging.
- [ ] Admin regression + security smoke completed
- [ ] Roadmap admin milestone signed
