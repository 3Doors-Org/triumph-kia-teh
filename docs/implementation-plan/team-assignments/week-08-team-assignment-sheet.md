# Week 08 Team Assignment Sheet (Lead + 2 Developers)

This sheet translates `week-08-mvp-launch-and-stabilization.md` into clear, non-duplicated ownership for Team Lead, Developer A (Frontend/UI), and Developer B (Backend/Platform).

Use this sheet together with:

- `docs/implementation-plan/week-08-mvp-launch-and-stabilization.md`
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

- MVP-to-V1 stabilization surfaces

### Route/Page Scope

- All V1 public pages + auth-ready admin entry

### API Endpoint Scope

- Critical path validation across /api/v1/contact and /api/v1/auth/*


## Day-by-Day Assignment Plan


## Day 1 — MVP completeness audit (requirements → evidence)


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/deployment_runbook.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/analytics_guide.md`
- `docs/02_design_system_component_library_brief.md`
- `docs/ui_screen_design_specs.md`

### Team Lead

- [ ] W08-TL-101: Extract MVP checklist bullets from `docs/project_roadmap.md` (public pages, contact, admin auth, Plausible install, SSL/CDN).
- [ ] W08-TL-102: Review `docs/qa_testing_plan_checklist.md` for any “MVP-applicable” items and copy into audit scope where relevant.
- [ ] W08-TL-103: Socialize audit doc to stakeholders.

### Developer A

- [ ] W08-A-101: For each item, link staging/prod URL and test artifact.
- [ ] W08-A-102: Validate responsiveness and accessibility for all updated screens/routes tied to "MVP completeness audit (requirements → evidence)".
- [ ] W08-A-103: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W08-B-101: Mark gaps with severities: blocker vs post-MVP.
- [ ] W08-B-102: Execute validation/integration/security checks for services changed by "MVP completeness audit (requirements → evidence)".
- [ ] W08-B-103: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 2 — Scope freeze, change-control, and post-MVP backlog creation


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/deployment_runbook.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/analytics_guide.md`

### Team Lead

- [ ] W08-TL-201: Set launch communication plan (status page, maintenance window if any).
- [ ] W08-TL-202: Review merged output for "Scope freeze, change-control, and post-MVP backlog creation" against security, contract, and quality requirements.
- [ ] W08-TL-203: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W08-A-201: Lock MVP scope in writing; require formal approval to expand.
- [ ] W08-A-202: Validate responsiveness and accessibility for all updated screens/routes tied to "Scope freeze, change-control, and post-MVP backlog creation".
- [ ] W08-A-203: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W08-B-201: Enforce full V1 scope closure and remove deferral paths by assigning owners and due dates for every remaining item.
- [ ] W08-B-202: Add release branch strategy (`release/mvp` vs `main`) if team uses it; document.
- [ ] W08-B-203: Assign owners for each remaining MVP blocker.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 3 — Production-like staging rehearsal (deploy + migrate + smoke)


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/deployment_runbook.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/analytics_guide.md`

### Team Lead

- [ ] W08-TL-301: Define measurable acceptance criteria and dependencies for "Production-like staging rehearsal (deploy + migrate + smoke)" before execution starts.
- [ ] W08-TL-302: Review merged output for "Production-like staging rehearsal (deploy + migrate + smoke)" against security, contract, and quality requirements.
- [ ] W08-TL-303: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W08-A-301: Run smoke suite: public pages + contact + admin login/logout.
- [ ] W08-A-302: Validate responsiveness and accessibility for all updated screens/routes tied to "Production-like staging rehearsal (deploy + migrate + smoke)".
- [ ] W08-A-303: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W08-B-301: Deploy current `main` to staging using the same workflow as production.
- [ ] W08-B-302: Run migrations and verify schema version table (if used).
- [ ] W08-B-303: Validate Plausible script loads without console errors on key pages (per roadmap MVP).

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 4 — MVP production deploy (or final staging hardening if blockers)


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/deployment_runbook.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/analytics_guide.md`
- `docs/09_security_architecture_review_document.md`

### Team Lead

- [ ] W08-TL-401: Run post-deploy smoke checklist on production URLs.
- [ ] W08-TL-402: If blockers: stop deploy, rollback, and document decision.
- [ ] W08-TL-403: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W08-A-401: Implement the day's required UI/route behaviors for "MVP production deploy (or final staging hardening if blockers)" with complete interaction states.
- [ ] W08-A-402: Validate responsiveness and accessibility for all updated screens/routes tied to "MVP production deploy (or final staging hardening if blockers)".
- [ ] W08-A-403: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W08-B-401: Tag release candidate (`mvp-2026-...`) from tested SHA.
- [ ] W08-B-402: Run production deploy per `docs/deployment_runbook.md` (compose pull/up, migrate, health checks).
- [ ] W08-B-403: Validate SSL, redirects, headers at production host.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 5 — Monitoring, uptime probes, and incident runbook activation


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/deployment_runbook.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/analytics_guide.md`

### Team Lead

- [ ] W08-TL-501: Define measurable acceptance criteria and dependencies for "Monitoring, uptime probes, and incident runbook activation" before execution starts.
- [ ] W08-TL-502: Review merged output for "Monitoring, uptime probes, and incident runbook activation" against security, contract, and quality requirements.
- [ ] W08-TL-503: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W08-A-501: Document on-call rotation (even if informal).
- [ ] W08-A-502: Validate responsiveness and accessibility for all updated screens/routes tied to "Monitoring, uptime probes, and incident runbook activation".
- [ ] W08-A-503: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W08-B-501: Configure uptime checks for `/`, `/contact`, `/api/health` (or equivalent).
- [ ] W08-B-502: Ensure Sentry release tagging matches deployed SHA.
- [ ] W08-B-503: Add basic dashboards: error rate, response time (provider-native free tiers).

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 6 — Stabilization window: hotfix triage, perf spot fixes, content fixes


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/deployment_runbook.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/analytics_guide.md`
- `docs/content_strategy_editorial_governance.md`

### Team Lead

- [ ] W08-TL-601: Update known issues doc for users/stakeholders.
- [ ] W08-TL-602: Review merged output for "Stabilization window: hotfix triage, perf spot fixes, content fixes" against security, contract, and quality requirements.
- [ ] W08-TL-603: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W08-A-601: Run Lighthouse spot checks on heaviest pages; fix easy wins (image sizing, font loading).
- [ ] W08-A-602: Validate responsiveness and accessibility for all updated screens/routes tied to "Stabilization window: hotfix triage, perf spot fixes, content fixes".
- [ ] W08-A-603: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W08-B-601: Triage incoming issues into: security, correctness, perf, content, cosmetic.
- [ ] W08-B-602: Fix P0/P1 issues with paired tests.
- [ ] W08-B-603: Validate contact deliverability (email) and spam false positives.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 7 — Retrospective + transition plan to Phase 3 (admin CMS completion)


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/deployment_runbook.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/analytics_guide.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/admin_wireframe_specifications.md`

### Team Lead

- [ ] W08-TL-701: Run retrospective: security, delivery, testing, content readiness.
- [ ] W08-TL-702: Plan Week 09: admin shell, writing list/editor, research parity, CRUD endpoints.
- [ ] W08-TL-703: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W08-A-701: Update `docs/project_roadmap.md` with execution status annotations and evidence links.
- [ ] W08-A-702: Validate responsiveness and accessibility for all updated screens/routes tied to "Retrospective + transition plan to Phase 3 (admin CMS completion)".
- [ ] W08-A-703: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W08-B-701: Capture metrics baseline (Lighthouse scores, error rates) as starting point for V1 goals.
- [ ] W08-B-702: Celebrate launch milestone and freeze repo for 24h unless P0.
- [ ] W08-B-703: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

---

## Ticket Import Format (copy into GitHub/Jira)

- **Title:** `[W08][Owner] <ticket-id> - <explicit action + scope>`
- **Labels:** `week-08`, `owner-lead|owner-dev-a|owner-dev-b`, `security|frontend|backend|infra|qa`.
- **Description:** include exact reference documents used, acceptance criteria, and evidence requirements.
- **Definition of Done:** daily deliverable gate + weekly gate must both be satisfied.

---

## Week Sign-off Checklist (Lead)

- [ ] All TL/A/B tickets closed or explicitly carried with owner/date.
- [ ] CI required checks green for merged PRs.
- [ ] Security and contract checks passed for the week scope.
- [ ] Reference-document alignment confirmed for each day.
- [ ] Week status updated in `v1-execution-tracker.md`.
