# Week 16 Team Assignment Sheet (Lead + 2 Developers)

This sheet translates `week-16-full-v1-launch-and-operational-handover.md` into clear, non-duplicated ownership for Team Lead, Developer A (Frontend/UI), and Developer B (Backend/Platform).

Use this sheet together with:

- `docs/implementation-plan/week-16-full-v1-launch-and-operational-handover.md`
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

- A01-A15 production acceptance

### Route/Page Scope

- Production all routes go-live verification

### API Endpoint Scope

- Production verification for /api/v1 contact/auth/content/admin analytics endpoints


## Day-by-Day Assignment Plan


## Day 1 — Production cutover (deploy, migrate, verify) + communication


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/deployment_runbook.md`
- `docs/project_roadmap.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/analytics_guide.md`

### Team Lead

- [ ] W16-TL-101: Announce maintenance window and confirm stakeholders available for go/no-go.
- [ ] W16-TL-102: Run production deploy: pull RC image/build, run migrations, restart services, run smoke checklist.
- [ ] W16-TL-103: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W16-A-101: Validate health checks, `/`, `/contact`, `/admin/login`, and one deep content page.
- [ ] W16-A-102: Post brief launch note internally with links to monitoring dashboards.
- [ ] W16-A-103: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W16-B-101: Validate SSL, redirects, security headers on production host.
- [ ] W16-B-102: Execute validation/integration/security checks for services changed by "Production cutover (deploy, migrate, verify) + communication".
- [ ] W16-B-103: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 2 — Post-deploy verification marathon (public, admin, analytics, email)


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/deployment_runbook.md`
- `docs/project_roadmap.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/analytics_guide.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/admin_wireframe_specifications.md`

### Team Lead

- [ ] W16-TL-201: Define measurable acceptance criteria and dependencies for "Post-deploy verification marathon (public, admin, analytics, email)" before execution starts.
- [ ] W16-TL-202: Review merged output for "Post-deploy verification marathon (public, admin, analytics, email)" against security, contract, and quality requirements.
- [ ] W16-TL-203: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W16-A-201: Re-run shortened Playwright smoke suite against production (read-only tests; avoid mutating prod unless safe fixtures exist).
- [ ] W16-A-202: Validate responsiveness and accessibility for all updated screens/routes tied to "Post-deploy verification marathon (public, admin, analytics, email)".
- [ ] W16-A-203: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W16-B-201: Verify Plausible/Clarity receiving events from production (sanity counts).
- [ ] W16-B-202: Verify contact email notifications (Resend) end-to-end with a controlled test submission.
- [ ] W16-B-203: Verify admin login + logout + RBAC smoke on production with a dedicated ops account.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 3 — Monitoring week: Sentry triage, uptime alerts, performance dashboards


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/deployment_runbook.md`
- `docs/project_roadmap.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/analytics_guide.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/admin_wireframe_specifications.md`

### Team Lead

- [ ] W16-TL-301: Define measurable acceptance criteria and dependencies for "Monitoring week: Sentry triage, uptime alerts, performance dashboards" before execution starts.
- [ ] W16-TL-302: Review merged output for "Monitoring week: Sentry triage, uptime alerts, performance dashboards" against security, contract, and quality requirements.
- [ ] W16-TL-303: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W16-A-301: Implement the day's required UI/route behaviors for "Monitoring week: Sentry triage, uptime alerts, performance dashboards" with complete interaction states.
- [ ] W16-A-302: Validate responsiveness and accessibility for all updated screens/routes tied to "Monitoring week: Sentry triage, uptime alerts, performance dashboards".
- [ ] W16-A-303: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W16-B-301: Triage Sentry issues: group duplicates, assign owners, set alert rules (noise control).
- [ ] W16-B-302: Validate uptime probes cover critical endpoints and alert destinations.
- [ ] W16-B-303: Watch DB metrics: connections, slow queries, disk growth.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 4 — Hotfix window (P0/P1 only) with strict change control


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/deployment_runbook.md`
- `docs/project_roadmap.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/analytics_guide.md`

### Team Lead

- [ ] W16-TL-401: Gate changes: P0/P1 only; require second reviewer for security-sensitive fixes.
- [ ] W16-TL-402: Review merged output for "Hotfix window (P0/P1 only) with strict change control" against security, contract, and quality requirements.
- [ ] W16-TL-403: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W16-A-401: Implement the day's required UI/route behaviors for "Hotfix window (P0/P1 only) with strict change control" with complete interaction states.
- [ ] W16-A-402: Validate responsiveness and accessibility for all updated screens/routes tied to "Hotfix window (P0/P1 only) with strict change control".
- [ ] W16-A-403: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W16-B-401: Cherry-pick fixes to a patch branch; run CI; deploy patch release.
- [ ] W16-B-402: Post-deploy smoke subset after each patch.
- [ ] W16-B-403: Update changelog and release notes for patches.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 5 — Operational handover package (runbooks, ownership, escalation)


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/deployment_runbook.md`
- `docs/project_roadmap.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/analytics_guide.md`

### Team Lead

- [ ] W16-TL-501: Define measurable acceptance criteria and dependencies for "Operational handover package (runbooks, ownership, escalation)" before execution starts.
- [ ] W16-TL-502: Review merged output for "Operational handover package (runbooks, ownership, escalation)" against security, contract, and quality requirements.
- [ ] W16-TL-503: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W16-A-501: Implement the day's required UI/route behaviors for "Operational handover package (runbooks, ownership, escalation)" with complete interaction states.
- [ ] W16-A-502: Validate responsiveness and accessibility for all updated screens/routes tied to "Operational handover package (runbooks, ownership, escalation)".
- [ ] W16-A-503: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W16-B-501: Finalize handover doc: deploy, rollback, backups, restores, common incidents, analytics dashboards, vendor accounts.
- [ ] W16-B-502: Define ownership map: infra, backend, frontend, content, security.
- [ ] W16-B-503: Add escalation contacts and severity definitions.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 6 — Retrospective on V1 delivery + metrics vs plan


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/deployment_runbook.md`
- `docs/project_roadmap.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/analytics_guide.md`

### Team Lead

- [ ] W16-TL-601: Compare planned vs actual timeline; identify top delays.
- [ ] W16-TL-602: Review defect curves, security incidents, perf outcomes vs roadmap targets.
- [ ] W16-TL-603: Update risk register with residual risks (vendor lock-in, scaling limits).

### Developer A

- [ ] W16-A-601: Implement the day's required UI/route behaviors for "Retrospective on V1 delivery + metrics vs plan" with complete interaction states.
- [ ] W16-A-602: Validate responsiveness and accessibility for all updated screens/routes tied to "Retrospective on V1 delivery + metrics vs plan".
- [ ] W16-A-603: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W16-B-601: Identify technical debt paydown priorities for Week 17+.
- [ ] W16-B-602: Execute validation/integration/security checks for services changed by "Retrospective on V1 delivery + metrics vs plan".
- [ ] W16-B-603: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 7 — Week 17+ transition: optimization roadmap and cadence


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/deployment_runbook.md`
- `docs/project_roadmap.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/analytics_guide.md`

### Team Lead

- [ ] W16-TL-701: Establish cadence: weekly dependency audit, monthly ZAP scan, quarterly DR test.
- [ ] W16-TL-702: Groom next sprint from backlog with sizing.
- [ ] W16-TL-703: Set review date for spec/doc drift (`docs/technical_spec.md` vs implementation).

### Developer A

- [ ] W16-A-701: Publish optimization roadmap: perf, content iteration, analytics depth, hardening, internationalization (if post-V1).
- [ ] W16-A-702: Validate responsiveness and accessibility for all updated screens/routes tied to "Week 17+ transition: optimization roadmap and cadence".
- [ ] W16-A-703: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W16-B-701: Implement backend/platform work required for "Week 17+ transition: optimization roadmap and cadence" (API/data/infra/security).
- [ ] W16-B-702: Execute validation/integration/security checks for services changed by "Week 17+ transition: optimization roadmap and cadence".
- [ ] W16-B-703: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

---

## Ticket Import Format (copy into GitHub/Jira)

- **Title:** `[W16][Owner] <ticket-id> - <explicit action + scope>`
- **Labels:** `week-16`, `owner-lead|owner-dev-a|owner-dev-b`, `security|frontend|backend|infra|qa`.
- **Description:** include exact reference documents used, acceptance criteria, and evidence requirements.
- **Definition of Done:** daily deliverable gate + weekly gate must both be satisfied.

---

## Week Sign-off Checklist (Lead)

- [ ] All TL/A/B tickets closed or explicitly carried with owner/date.
- [ ] CI required checks green for merged PRs.
- [ ] Security and contract checks passed for the week scope.
- [ ] Reference-document alignment confirmed for each day.
- [ ] Week status updated in `v1-execution-tracker.md`.
