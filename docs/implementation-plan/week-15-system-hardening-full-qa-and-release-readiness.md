# Week 15 — Full QA Matrix, Security Hardening, Backups, and V1 Release Candidate

## Week objectives

- Execute Phase 6 hardening from `docs/project_roadmap.md` and comprehensive verification aligned with `docs/qa_testing_plan_checklist.md` and `docs/09_security_architecture_review_document.md`.
- Produce a **release candidate** with evidence pack: tests, scans, Lighthouse/axe results, backup/restore rehearsal, and stakeholder approvals.

## Canonical references

- `docs/qa_testing_plan_checklist.md` — primary QA execution source (sections vary; execute applicable items per feature readiness).
- `docs/09_security_architecture_review_document.md` — headers, CSRF posture, dependency security, logging.
- `docs/deployment_runbook.md` — backups, nginx, SSL, incident response.
- `docs/project_roadmap.md` — V1 launch criteria (Lighthouse 90+, axe zero critical/serious, etc., as stated in roadmap sections).

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

## Day 1 — Full functional regression: public + admin + API matrix

### Objectives

- Run end-to-end coverage for all user journeys documented in `docs/14_user_interaction_navigation_flow_diagrams.md` plus admin CRUD flows.

### Tasks

1. Expand Playwright suites to cover all public routes and primary admin modules A01–A15.
2. Add API integration tests for critical endpoints: auth, contact, leads, assets, navigation, exit intent, content CRUD.
3. Track failures in a triage board with severities.
4. Fix P0 defects same day where possible.
5. Capture trace artifacts for flaky tests and stabilize.

### Deliverables

- [ ] Functional regression report with pass rates and links to CI runs.

### Tools (free)

Playwright, Vitest, GitHub Actions.

### Dependencies / prerequisites

Feature-complete staging environment.

### Security and quality

- Include negative tests for auth bypass and IDOR on parameterized routes.

### Maintainability

- Shard tests in CI to keep runtime manageable.

---

## Day 2 — Accessibility conformance push (WCAG 2.1 AA targets per roadmap language)

### Objectives

- Drive axe serious/critical issues to zero on public pages (and admin where roadmap applies).

### Tasks

1. Run axe across all pages; export violations list.
2. Fix heading hierarchy, landmarks, form labels, color contrast issues.
3. Keyboard-only walkthrough for Contact, admin login, writing editor critical path.
4. Re-run axe until clean on representative pages.
5. Resolve all blockers and document closure evidence; no open waivers permitted for launch-critical items.

### Deliverables

- [ ] A11y report with zero blockers and full closure evidence.

### Tools (free)

axe DevTools, Lighthouse a11y, keyboard testing.

### Dependencies / prerequisites

Day 1 functional stability.

### Security and quality

- Ensure accessibility fixes do not weaken security controls (e.g., autocomplete on passwords).

### Maintainability

- Add `@axe-core/playwright` integration for CI.

---

## Day 3 — Security verification week: headers, CSRF, rate limits, dependency audit, ZAP baseline

### Objectives

- Validate security architecture claims with evidence, not assumptions.

### Tasks

1. Verify security headers at Nginx + Next layers; resolve duplicates/conflicts.
2. Validate CSRF posture for session-cookie auth flows per security doc (Origin checks on mutations).
3. Validate rate limits for `POST /api/v1/contact` and `POST /api/v1/auth/login` under load test harness.
4. Run `pnpm audit` / OSV scanner; upgrade or mitigate vulnerabilities with documented risk acceptance.
5. Run OWASP ZAP baseline scan against staging; triage findings.

### Deliverables

- [ ] Security verification report with ZAP + audit outputs attached.

### Tools (free)

OWASP ZAP baseline, curl, `pnpm audit`, GitHub Dependabot alerts.

### Dependencies / prerequisites

Staging publicly reachable for ZAP (or run locally with tunnel—document).

### Security and quality

- Rotate any credentials accidentally exposed during testing.

### Maintainability

- Store ZAP automation config in repo for repeatable scans.

---

## Day 4 — Performance hardening: Lighthouse 90+ push and Core Web Vitals stabilization

### Objectives

- Meet roadmap performance targets on representative pagesets (adjust page list to match roadmap wording).

### Tasks

1. Run Lighthouse CI across the full agreed public page list and key admin pages.
2. Fix top issues: image sizing, font loading, JS long tasks, caching headers.
3. Validate ISR/caching effectiveness with `curl -I` tests.
4. Tune Postgres queries implicated in slow TTFB (if any) using EXPLAIN.
5. Document remaining perf debt explicitly.

### Deliverables

- [ ] Lighthouse report pack with pass/fail vs thresholds.

### Tools (free)

Lighthouse CI, WebPageTest (free tier), psql EXPLAIN.

### Dependencies / prerequisites

Analytics scripts enabled (Week 14) to measure worst-case.

### Security and quality

- Ensure caching does not leak authenticated responses via CDN (admin routes uncached).

### Maintainability

- Keep perf fixes as small PRs with measured impact notes.

---

## Day 5 — Backup + restore rehearsal + DR documentation updates

### Objectives

- Prove recoverability per `docs/deployment_runbook.md` disaster recovery sections.

### Tasks

1. Take encrypted backup artifact of production-like staging DB.
2. Restore into a fresh local/staging instance; verify checksums/row counts for critical tables.
3. Document RTO/RPO results and gaps.
4. If R2 assets used: document restore strategy (replication vs rebuild from DB references).
5. Update runbook with “as-built” differences discovered.

### Deliverables

- [ ] Backup/restore report with timings and verification queries.

### Tools (free)

pg_dump, pg_restore, gpg encryption, scripts.

### Dependencies / prerequisites

DB contains realistic volume.

### Security and quality

- Store backups encrypted; restrict access roles.

### Maintainability

- Automate backup verification script weekly (cron) if feasible.

---

## Day 6 — Release candidate build, changelog, and stakeholder sign-offs

### Objectives

- Freeze a candidate SHA and obtain formal approvals (engineering, content, security, ops).

### Tasks

1. Cut `release/v1` branch or tag RC from green `main`.
2. Write changelog: security-relevant changes highlighted.
3. Run final smoke on RC artifact.
4. Collect sign-offs in ticket comments or release doc.
5. Prepare production deploy checklist for Week 16.

### Deliverables

- [ ] RC tag + changelog + approvals recorded.

### Tools (free)

Git tags, GitHub Releases draft.

### Dependencies / prerequisites

Days 1–5 fully green with no waivers.

### Security and quality

- Verify SBOM or lockfile integrity (`pnpm-lock.yaml`) included in release notes.

### Maintainability

- Attach CI artifacts to release for audit trail.

---

## Day 7 — Pre-launch freeze, comms plan, rollback rehearsal #2, and Week 16 go-live scheduling

### Objectives

- Enter controlled change freeze and schedule production cutover.

### Tasks

1. Enforce code freeze policy (exceptions require security review).
2. Final rollback rehearsal from RC to previous stable (timeboxed).
3. Prepare customer/partner comms if needed (status page, tweet, email—per stakeholder).
4. Schedule Week 16 deploy window and on-call coverage.
5. Confirm DNS TTL lowering plan if IP changes.

### Deliverables

- [ ] Go-live schedule + freeze announcement + rollback proof.

### Tools (free)

Calendar, runbook, issue tracker.

### Dependencies / prerequisites

RC approved.

### Security and quality

- Validate no debug endpoints exposed in RC build.

### Maintainability

- Keep Week 16 steps copy-pasteable from runbook with RC SHA filled in.

---

## V1 Definition of Done (Weekly Gate)

- [ ] All Day 1-Day 7 deliverables are completed with linked evidence (PRs, CI runs, reports).
- [ ] No open P0/P1 defects remain for this week's scope.
- [ ] Security controls introduced this week are implemented, tested, and documented.
- [ ] API/DB/UI contract changes are synchronized with `docs/` (no drift).
- [ ] Automated tests added this week are passing in CI.
- [ ] Rollback/operational notes for this week's changes are documented where applicable.

## Week completion checklist

- [ ] Full regression + a11y + security scans executed with artifacts
- [ ] Performance evidence meets agreed thresholds with no waivers
- [ ] Backup/restore rehearsed and documented
- [ ] Release candidate tagged and approved
