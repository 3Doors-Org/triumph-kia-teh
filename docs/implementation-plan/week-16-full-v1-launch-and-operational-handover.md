# Week 16 — Full V1 Production Launch, Post-Deploy Verification, and Operational Handover

## Week objectives

- Execute **Full V1 launch** per `docs/project_roadmap.md` (end of Week 16 target): deploy production, validate launch gates, monitor early traffic, stabilize hotfixes, and complete operational handover documentation.
- Transition into Week 17+ optimization mode with a managed backlog.

## Canonical references

- `docs/deployment_runbook.md` — production deployment steps, nginx, SSL, rollback.
- `docs/project_roadmap.md` — V1 launch definition and full-scope completion items.
- `docs/qa_testing_plan_checklist.md` — final verification patterns and evidence expectations.
- `docs/analytics_guide.md` — post-launch monitoring of events and dashboards.

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

## Day 1 — Production cutover (deploy, migrate, verify) + communication

### Objectives

- Ship V1 to production safely using the Week 15 RC and documented runbook.

### Tasks

1. Announce maintenance window and confirm stakeholders available for go/no-go.
2. Run production deploy: pull RC image/build, run migrations, restart services, run smoke checklist.
3. Validate health checks, `/`, `/contact`, `/admin/login`, and one deep content page.
4. Validate SSL, redirects, security headers on production host.
5. Post brief launch note internally with links to monitoring dashboards.

### Deliverables

- [ ] Production V1 live at canonical domain with smoke checks passed.

### Tools (free)

GitHub Actions, Docker Compose, curl, SSL Labs.

### Dependencies / prerequisites

Week 15 RC approved; secrets verified.

### Security and quality

- Confirm production env flags: no dev routes, no verbose errors, no secret logs.

### Maintainability

- Tag production release with immutable git SHA and changelog link.

---

## Day 2 — Post-deploy verification marathon (public, admin, analytics, email)

### Objectives

- Catch production-only issues early (DNS, CDN, TLS chain, caching, email deliverability).

### Tasks

1. Re-run shortened Playwright smoke suite against production (read-only tests; avoid mutating prod unless safe fixtures exist).
2. Verify Plausible/Clarity receiving events from production (sanity counts).
3. Verify contact email notifications (Resend) end-to-end with a controlled test submission.
4. Verify admin login + logout + RBAC smoke on production with a dedicated ops account.
5. Record anomalies in incident log.

### Deliverables

- [ ] Post-deploy verification checklist completed with signatures.

### Tools (free)

Playwright (prod config), Plausible UI, Sentry, mail logs.

### Dependencies / prerequisites

Day 1 deploy successful.

### Security and quality

- Use least-privileged test accounts; rotate passwords if exposed during testing.

### Maintainability

- Keep prod smoke suite minimal to reduce risk and runtime.

---

## Day 3 — Monitoring week: Sentry triage, uptime alerts, performance dashboards

### Objectives

- Establish operational rhythm for first week of production traffic.

### Tasks

1. Triage Sentry issues: group duplicates, assign owners, set alert rules (noise control).
2. Validate uptime probes cover critical endpoints and alert destinations.
3. Watch DB metrics: connections, slow queries, disk growth.
4. Watch Redis metrics: memory, eviction, and rate limit spikes.
5. Produce daily ops note (Day 3 snapshot) with trends.

### Deliverables

- [ ] Monitoring dashboard links + alert thresholds documented.

### Tools (free)

Sentry, UptimeRobot, provider metrics, `docker stats`.

### Dependencies / prerequisites

Production telemetry enabled.

### Security and quality

- Review any spike in `401/403/429` patterns for abuse.

### Maintainability

- Create weekly ops checklist template for ongoing operations.

---

## Day 4 — Hotfix window (P0/P1 only) with strict change control

### Objectives

- Resolve production defects without destabilizing the release.

### Tasks

1. Gate changes: P0/P1 only; require second reviewer for security-sensitive fixes.
2. Cherry-pick fixes to a patch branch; run CI; deploy patch release.
3. Post-deploy smoke subset after each patch.
4. Update changelog and release notes for patches.
5. Close incident tickets with root causes.

### Deliverables

- [ ] Patch release(s) deployed with documented rationale.

### Tools (free)

Git branches, CI, issue tracker.

### Dependencies / prerequisites

Day 2–3 findings.

### Security and quality

- For auth/contact changes, add regression tests before merge even in hotfix mode.

### Maintainability

- Prefer forward fixes over rollbacks unless rollback is safer.

---

## Day 5 — Operational handover package (runbooks, ownership, escalation)

### Objectives

- Ensure anyone on the team can operate and recover the system.

### Tasks

1. Finalize handover doc: deploy, rollback, backups, restores, common incidents, analytics dashboards, vendor accounts.
2. Define ownership map: infra, backend, frontend, content, security.
3. Add escalation contacts and severity definitions.
4. Verify secrets inventory matches actual services (names only in doc).
5. Conduct a recorded 60-minute handover walkthrough session.

### Deliverables

- [ ] Handover document approved by platform owner.

### Tools (free)

Markdown, video call recording.

### Dependencies / prerequisites

Stable production after Day 4.

### Security and quality

- Remove any temporary access grants issued during launch week.

### Maintainability

- Store handover doc in repo `docs/` or linked secure location with access control.

---

## Day 6 — Retrospective on V1 delivery + metrics vs plan

### Objectives

- Capture lessons learned and quantify outcomes.

### Tasks

1. Compare planned vs actual timeline; identify top delays.
2. Review defect curves, security incidents, perf outcomes vs roadmap targets.
3. Identify technical debt paydown priorities for Week 17+.
4. Update risk register with residual risks (vendor lock-in, scaling limits).
5. Thank contributors and document “known limitations” for stakeholders.

### Deliverables

- [ ] Retrospective notes + debt backlog prioritized.

### Tools (free)

GitHub Insights, issue metrics.

### Dependencies / prerequisites

Launch week data available.

### Security and quality

- Confirm retrospective notes do not include secrets or PII.

### Maintainability

- Convert top 3 retro items into CI or architecture guardrails.

---

## Day 7 — Week 17+ transition: optimization roadmap and cadence

### Objectives

- Move from launch mode to sustainable product operations.

### Tasks

1. Publish optimization roadmap: perf, content iteration, analytics depth, hardening, internationalization (if post-V1).
2. Establish cadence: weekly dependency audit, monthly ZAP scan, quarterly DR test.
3. Groom next sprint from backlog with sizing.
4. Set review date for spec/doc drift (`docs/technical_spec.md` vs implementation).
5. Close launch epic; archive launch checklist.

### Deliverables

- [ ] Post-launch operating cadence documented and scheduled.

### Tools (free)

GitHub Projects, calendar reminders.

### Dependencies / prerequisites

Stakeholder availability for planning.

### Security and quality

- Ensure ongoing access reviews for production accounts.

### Maintainability

- Keep “single source of truth” policy: code + `docs/` updated together for contract changes.

---

## V1 Definition of Done (Weekly Gate)

- [ ] All Day 1-Day 7 deliverables are completed with linked evidence (PRs, CI runs, reports).
- [ ] No open P0/P1 defects remain for this week's scope.
- [ ] Security controls introduced this week are implemented, tested, and documented.
- [ ] API/DB/UI contract changes are synchronized with `docs/` (no drift).
- [ ] Automated tests added this week are passing in CI.
- [ ] Rollback/operational notes for this week's changes are documented where applicable.

## Week completion checklist

- [ ] V1 deployed and verified in production
- [ ] Monitoring and hotfix process exercised
- [ ] Handover + retro completed
- [ ] Week 17+ operating cadence established
