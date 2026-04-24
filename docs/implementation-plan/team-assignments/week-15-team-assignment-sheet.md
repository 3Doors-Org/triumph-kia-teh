# Week 15 Team Assignment Sheet (Lead + 2 Developers)

This sheet translates `week-15-system-hardening-full-qa-and-release-readiness.md` into clear, non-duplicated ownership for Team Lead, Developer A (Frontend/UI), and Developer B (Backend/Platform).

Use this sheet together with:

- `docs/implementation-plan/week-15-system-hardening-full-qa-and-release-readiness.md`
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

- A01-A15 full regression coverage

### Route/Page Scope

- All public/admin routes under full QA sweep

### API Endpoint Scope

- Security/performance verification across full /api/v1 surface


## Day-by-Day Assignment Plan


## Day 1 — Full functional regression: public + admin + API matrix


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/09_security_architecture_review_document.md`
- `docs/deployment_runbook.md`
- `docs/project_roadmap.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/admin_wireframe_specifications.md`

### Team Lead

- [ ] W15-TL-101: Define measurable acceptance criteria and dependencies for "Full functional regression: public + admin + API matrix" before execution starts.
- [ ] W15-TL-102: Review merged output for "Full functional regression: public + admin + API matrix" against security, contract, and quality requirements.
- [ ] W15-TL-103: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W15-A-101: Expand Playwright suites to cover all public routes and primary admin modules A01–A15.
- [ ] W15-A-102: Validate responsiveness and accessibility for all updated screens/routes tied to "Full functional regression: public + admin + API matrix".
- [ ] W15-A-103: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W15-B-101: Add API integration tests for critical endpoints: auth, contact, leads, assets, navigation, exit intent, content CRUD.
- [ ] W15-B-102: Track failures in a triage board with severities.
- [ ] W15-B-103: Fix P0 defects same day where possible.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 2 — Accessibility conformance push (WCAG 2.1 AA targets per roadmap language)


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/09_security_architecture_review_document.md`
- `docs/deployment_runbook.md`
- `docs/project_roadmap.md`

### Team Lead

- [ ] W15-TL-201: Define measurable acceptance criteria and dependencies for "Accessibility conformance push (WCAG 2.1 AA targets per roadmap language)" before execution starts.
- [ ] W15-TL-202: Review merged output for "Accessibility conformance push (WCAG 2.1 AA targets per roadmap language)" against security, contract, and quality requirements.
- [ ] W15-TL-203: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W15-A-201: Run axe across all pages; export violations list.
- [ ] W15-A-202: Fix heading hierarchy, landmarks, form labels, color contrast issues.
- [ ] W15-A-203: Re-run axe until clean on representative pages.

### Developer B

- [ ] W15-B-201: Keyboard-only walkthrough for Contact, admin login, writing editor critical path.
- [ ] W15-B-202: Resolve all blockers and document closure evidence; no open waivers permitted for launch-critical items.
- [ ] W15-B-203: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 3 — Security verification week: headers, CSRF, rate limits, dependency audit, ZAP baseline


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/09_security_architecture_review_document.md`
- `docs/deployment_runbook.md`
- `docs/project_roadmap.md`

### Team Lead

- [ ] W15-TL-301: Run `pnpm audit` / OSV scanner; upgrade or mitigate vulnerabilities with documented risk acceptance.
- [ ] W15-TL-302: Review merged output for "Security verification week: headers, CSRF, rate limits, dependency audit, ZAP baseline" against security, contract, and quality requirements.
- [ ] W15-TL-303: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W15-A-301: Implement the day's required UI/route behaviors for "Security verification week: headers, CSRF, rate limits, dependency audit, ZAP baseline" with complete interaction states.
- [ ] W15-A-302: Validate responsiveness and accessibility for all updated screens/routes tied to "Security verification week: headers, CSRF, rate limits, dependency audit, ZAP baseline".
- [ ] W15-A-303: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W15-B-301: Verify security headers at Nginx + Next layers; resolve duplicates/conflicts.
- [ ] W15-B-302: Validate CSRF posture for session-cookie auth flows per security doc (Origin checks on mutations).
- [ ] W15-B-303: Validate rate limits for `POST /api/v1/contact` and `POST /api/v1/auth/login` under load test harness.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 4 — Performance hardening: Lighthouse 90+ push and Core Web Vitals stabilization


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/09_security_architecture_review_document.md`
- `docs/deployment_runbook.md`
- `docs/project_roadmap.md`

### Team Lead

- [ ] W15-TL-401: Define measurable acceptance criteria and dependencies for "Performance hardening: Lighthouse 90+ push and Core Web Vitals stabilization" before execution starts.
- [ ] W15-TL-402: Review merged output for "Performance hardening: Lighthouse 90+ push and Core Web Vitals stabilization" against security, contract, and quality requirements.
- [ ] W15-TL-403: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W15-A-401: Implement the day's required UI/route behaviors for "Performance hardening: Lighthouse 90+ push and Core Web Vitals stabilization" with complete interaction states.
- [ ] W15-A-402: Validate responsiveness and accessibility for all updated screens/routes tied to "Performance hardening: Lighthouse 90+ push and Core Web Vitals stabilization".
- [ ] W15-A-403: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W15-B-401: Run Lighthouse CI across the full agreed public page list and key admin pages.
- [ ] W15-B-402: Fix top issues: image sizing, font loading, JS long tasks, caching headers.
- [ ] W15-B-403: Validate ISR/caching effectiveness with `curl -I` tests.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 5 — Backup + restore rehearsal + DR documentation updates


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/09_security_architecture_review_document.md`
- `docs/deployment_runbook.md`
- `docs/project_roadmap.md`

### Team Lead

- [ ] W15-TL-501: Define measurable acceptance criteria and dependencies for "Backup + restore rehearsal + DR documentation updates" before execution starts.
- [ ] W15-TL-502: Review merged output for "Backup + restore rehearsal + DR documentation updates" against security, contract, and quality requirements.
- [ ] W15-TL-503: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W15-A-501: Update runbook with “as-built” differences discovered.
- [ ] W15-A-502: Validate responsiveness and accessibility for all updated screens/routes tied to "Backup + restore rehearsal + DR documentation updates".
- [ ] W15-A-503: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W15-B-501: Take encrypted backup artifact of production-like staging DB.
- [ ] W15-B-502: Restore into a fresh local/staging instance; verify checksums/row counts for critical tables.
- [ ] W15-B-503: Document RTO/RPO results and gaps.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 6 — Release candidate build, changelog, and stakeholder sign-offs


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/09_security_architecture_review_document.md`
- `docs/deployment_runbook.md`
- `docs/project_roadmap.md`
- `docs/02_design_system_component_library_brief.md`
- `docs/ui_screen_design_specs.md`

### Team Lead

- [ ] W15-TL-601: Collect sign-offs in ticket comments or release doc.
- [ ] W15-TL-602: Prepare production deploy checklist for Week 16.
- [ ] W15-TL-603: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W15-A-601: Implement the day's required UI/route behaviors for "Release candidate build, changelog, and stakeholder sign-offs" with complete interaction states.
- [ ] W15-A-602: Validate responsiveness and accessibility for all updated screens/routes tied to "Release candidate build, changelog, and stakeholder sign-offs".
- [ ] W15-A-603: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W15-B-601: Cut `release/v1` branch or tag RC from green `main`.
- [ ] W15-B-602: Write changelog: security-relevant changes highlighted.
- [ ] W15-B-603: Run final smoke on RC artifact.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 7 — Pre-launch freeze, comms plan, rollback rehearsal #2, and Week 16 go-live scheduling


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/09_security_architecture_review_document.md`
- `docs/deployment_runbook.md`
- `docs/project_roadmap.md`

### Team Lead

- [ ] W15-TL-701: Enforce code freeze policy (exceptions require security review).
- [ ] W15-TL-702: Prepare customer/partner comms if needed (status page, tweet, email—per stakeholder).
- [ ] W15-TL-703: Confirm DNS TTL lowering plan if IP changes.

### Developer A

- [ ] W15-A-701: Implement the day's required UI/route behaviors for "Pre-launch freeze, comms plan, rollback rehearsal #2, and Week 16 go-live scheduling" with complete interaction states.
- [ ] W15-A-702: Validate responsiveness and accessibility for all updated screens/routes tied to "Pre-launch freeze, comms plan, rollback rehearsal #2, and Week 16 go-live scheduling".
- [ ] W15-A-703: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W15-B-701: Final rollback rehearsal from RC to previous stable (timeboxed).
- [ ] W15-B-702: Schedule Week 16 deploy window and on-call coverage.
- [ ] W15-B-703: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

---

## Ticket Import Format (copy into GitHub/Jira)

- **Title:** `[W15][Owner] <ticket-id> - <explicit action + scope>`
- **Labels:** `week-15`, `owner-lead|owner-dev-a|owner-dev-b`, `security|frontend|backend|infra|qa`.
- **Description:** include exact reference documents used, acceptance criteria, and evidence requirements.
- **Definition of Done:** daily deliverable gate + weekly gate must both be satisfied.

---

## Week Sign-off Checklist (Lead)

- [ ] All TL/A/B tickets closed or explicitly carried with owner/date.
- [ ] CI required checks green for merged PRs.
- [ ] Security and contract checks passed for the week scope.
- [ ] Reference-document alignment confirmed for each day.
- [ ] Week status updated in `v1-execution-tracker.md`.
