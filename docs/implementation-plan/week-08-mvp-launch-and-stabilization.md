# Week 08 — MVP Launch, Monitoring, Stabilization, and Post-MVP Backlog

## Week objectives

- Meet the **MVP milestone** defined in `docs/project_roadmap.md`: all 12 public pages with real content, contact pipeline operational, Plausible script installed (goals may follow), SSL/CDN configured, and basic admin authentication usable for minimal operations.
- Establish post-deploy monitoring and a disciplined stabilization window.

## Canonical references

- `docs/project_roadmap.md` — V1 launch definition and full-scope completion requirements.
- `docs/deployment_runbook.md` — production deployment, rollback, verification.
- `docs/qa_testing_plan_checklist.md` — smoke/launch verification patterns (full gate happens later).
- `docs/analytics_guide.md` — Plausible baseline install expectations.

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

## Day 1 — MVP completeness audit (requirements → evidence)

### Objectives

- Produce an auditable matrix mapping each MVP requirement to evidence (URL, PR, CI run).

### Tasks

1. Extract MVP checklist bullets from `docs/project_roadmap.md` (public pages, contact, admin auth, Plausible install, SSL/CDN).
2. For each item, link staging/prod URL and test artifact.
3. Mark gaps with severities: blocker vs post-MVP.
4. Review `docs/qa_testing_plan_checklist.md` for any “MVP-applicable” items and copy into audit scope where relevant.
5. Socialize audit doc to stakeholders.

### Deliverables

- [ ] MVP audit markdown with pass/fail and owners.

### Tools (free)

GitHub Issues/Projects, Markdown.

### Dependencies / prerequisites

Weeks 01–07 complete.

### Security and quality

- Ensure audit does not paste secrets or production credentials.

### Maintainability

- Keep audit template reusable for V1 launch week.

---

## Day 2 — Scope freeze, change-control, and post-MVP backlog creation

### Objectives

- Prevent last-minute scope creep from destabilizing MVP launch.

### Tasks

1. Lock MVP scope in writing; require formal approval to expand.
2. Enforce full V1 scope closure and remove deferral paths by assigning owners and due dates for every remaining item.
3. Add release branch strategy (`release/mvp` vs `main`) if team uses it; document.
4. Assign owners for each remaining MVP blocker.
5. Set launch communication plan (status page, maintenance window if any).

### Deliverables

- [ ] Scope freeze announcement + backlog board updated.

### Tools (free)

GitHub Projects.

### Dependencies / prerequisites

Day 1 audit identifies blockers.

### Security and quality

- Confirm freeze includes “no new public endpoints without review”.

### Maintainability

- Tag backlog items with `post-mvp` label for filtering.

---

## Day 3 — Production-like staging rehearsal (deploy + migrate + smoke)

### Objectives

- Run a full rehearsal identical to production steps to surface integration issues early.

### Tasks

1. Deploy current `main` to staging using the same workflow as production.
2. Run migrations and verify schema version table (if used).
3. Run smoke suite: public pages + contact + admin login/logout.
4. Validate Plausible script loads without console errors on key pages (per roadmap MVP).
5. Capture timings and failure modes; fix blockers immediately.

### Deliverables

- [ ] Staging rehearsal report with timings and logs links.

### Tools (free)

GitHub Actions, Playwright, browser devtools console.

### Dependencies / prerequisites

Staging secrets mirror prod categories.

### Security and quality

- Validate staging remains `noindex` and does not send real user emails incorrectly.

### Maintainability

- Automate rehearsal checklist as a GitHub Issue template.

---

## Day 4 — MVP production deploy (or final staging hardening if blockers)

### Objectives

- Execute production deployment if audit is green; otherwise finish blockers with timeboxed cuts.

### Tasks

1. Tag release candidate (`mvp-2026-...`) from tested SHA.
2. Run production deploy per `docs/deployment_runbook.md` (compose pull/up, migrate, health checks).
3. Run post-deploy smoke checklist on production URLs.
4. Validate SSL, redirects, headers at production host.
5. If blockers: stop deploy, rollback, and document decision.

### Deliverables

- [ ] Production MVP live **or** documented rollback with next-day plan.

### Tools (free)

GitHub Actions, curl, SSL Labs.

### Dependencies / prerequisites

Domain DNS points to prod; secrets configured.

### Security and quality

- Confirm production env disables debug stacks and dev-only routes.

### Maintainability

- Keep deploy runbook updated with any one-off fixes discovered.

---

## Day 5 — Monitoring, uptime probes, and incident runbook activation

### Objectives

- Ensure the team can detect outages and diagnose errors quickly post-MVP.

### Tasks

1. Configure uptime checks for `/`, `/contact`, `/api/health` (or equivalent).
2. Ensure Sentry release tagging matches deployed SHA.
3. Add basic dashboards: error rate, response time (provider-native free tiers).
4. Run a tabletop incident exercise: “DB down”, “502 from nginx”, “Redis down” using runbook sections.
5. Document on-call rotation (even if informal).

### Deliverables

- [ ] Monitoring live + incident checklist validated.

### Tools (free)

UptimeRobot, Sentry, log tailing.

### Dependencies / prerequisites

Production/staging deployed.

### Security and quality

- Validate alerts do not include sensitive query strings.

### Maintainability

- Store runbook links in repo `README.md`.

---

## Day 6 — Stabilization window: hotfix triage, perf spot fixes, content fixes

### Objectives

- Absorb real-world feedback after launch without breaking change-control.

### Tasks

1. Triage incoming issues into: security, correctness, perf, content, cosmetic.
2. Fix P0/P1 issues with paired tests.
3. Run Lighthouse spot checks on heaviest pages; fix easy wins (image sizing, font loading).
4. Validate contact deliverability (email) and spam false positives.
5. Update known issues doc for users/stakeholders.

### Deliverables

- [ ] P0/P1 list cleared or explicitly accepted with mitigation.

### Tools (free)

GitHub Issues, Lighthouse, mail tester tools (manual).

### Dependencies / prerequisites

MVP live.

### Security and quality

- Any hotfix touching auth/contact requires mandatory two-person review.

### Maintainability

- Prefer reversible feature flags for risky fixes if system supports it.

---

## Day 7 — Retrospective + transition plan to Phase 3 (admin CMS completion)

### Objectives

- Close MVP chapter and start Phase 3 execution with a clean runway.

### Tasks

1. Run retrospective: security, delivery, testing, content readiness.
2. Update `docs/project_roadmap.md` with execution status annotations and evidence links.
3. Plan Week 09: admin shell, writing list/editor, research parity, CRUD endpoints.
4. Capture metrics baseline (Lighthouse scores, error rates) as starting point for V1 goals.
5. Celebrate launch milestone and freeze repo for 24h unless P0.

### Deliverables

- [ ] Retro notes + Week 09 plan committed or ticketed.

### Tools (free)

Markdown, GitHub Projects.

### Dependencies / prerequisites

Stabilization outcomes known.

### Security and quality

- Confirm no emergency endpoints were left open after hotfixes.

### Maintainability

- Convert recurring postmortem items into CI rules where possible.

---

## V1 Definition of Done (Weekly Gate)

- [ ] All Day 1-Day 7 deliverables are completed with linked evidence (PRs, CI runs, reports).
- [ ] No open P0/P1 defects remain for this week's scope.
- [ ] Security controls introduced this week are implemented, tested, and documented.
- [ ] API/DB/UI contract changes are synchronized with `docs/` (no drift).
- [ ] Automated tests added this week are passing in CI.
- [ ] Rollback/operational notes for this week's changes are documented where applicable.

## Week completion checklist

- [ ] MVP audit complete and signed.
- [ ] Production MVP deployed (or explicit rollback with plan).
- [ ] Monitoring and incident response validated.
- [ ] Retro + Phase 3 plan ready
