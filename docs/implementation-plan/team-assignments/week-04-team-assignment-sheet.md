# Week 04 Team Assignment Sheet (Lead + 2 Developers)

This sheet translates `week-04-public-pages-completion-and-conversion-flow.md` into clear, non-duplicated ownership for Team Lead, Developer A (Frontend/UI), and Developer B (Backend/Platform).

Use this sheet together with:

- `docs/implementation-plan/week-04-public-pages-completion-and-conversion-flow.md`
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

- Public conversion flow screens and states

### Route/Page Scope

- Phase 1 public pages responsive/SEO completion

### API Endpoint Scope

- POST /api/v1/contact (hardening)
- Nginx rate-limit policy for contact path


## Day-by-Day Assignment Plan


## Day 1 — Responsive polish and visual QA across Phase 1 routes


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/14_user_interaction_navigation_flow_diagrams.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/api_reference.md`
- `docs/09_security_architecture_review_document.md`
- `docs/deployment_runbook.md`

### Team Lead

- [ ] W04-TL-101: Audit each page at `390`, `768`, `1280` widths; fix overflow, tap targets, and typography scaling per `docs/02_design_system_component_library_brief.md`.
- [ ] W04-TL-102: Capture before/after screenshots for design review and attach them to the PR as required evidence.
- [ ] W04-TL-103: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W04-A-101: Validate focus order and keyboard navigation for nav + forms.
- [ ] W04-A-102: Add Playwright viewport matrix tests for critical layouts (smoke level).
- [ ] W04-A-103: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W04-B-101: Normalize spacing using the 4px grid; remove one-off margins.
- [ ] W04-B-102: Execute validation/integration/security checks for services changed by "Responsive polish and visual QA across Phase 1 routes".
- [ ] W04-B-103: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 2 — SEO metadata, Open Graph, and canonical URLs


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/14_user_interaction_navigation_flow_diagrams.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/api_reference.md`
- `docs/09_security_architecture_review_document.md`
- `docs/deployment_runbook.md`

### Team Lead

- [ ] W04-TL-201: Define measurable acceptance criteria and dependencies for "SEO metadata, Open Graph, and canonical URLs" before execution starts.
- [ ] W04-TL-202: Review merged output for "SEO metadata, Open Graph, and canonical URLs" against security, contract, and quality requirements.
- [ ] W04-TL-203: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W04-A-201: Add unit tests for metadata builders (snapshot or key fields).
- [ ] W04-A-202: Validate responsiveness and accessibility for all updated screens/routes tied to "SEO metadata, Open Graph, and canonical URLs".
- [ ] W04-A-203: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W04-B-201: Implement `generateMetadata` (or static metadata) for each Phase 1 route with title/description templates.
- [ ] W04-B-202: Add OG/Twitter cards where design provides imagery policy; otherwise define safe defaults.
- [ ] W04-B-203: Implement canonical URL helper using environment base URL (`NEXT_PUBLIC_SITE_URL`).

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 3 — Structured logging, Sentry, and PII redaction for contact pipeline


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/14_user_interaction_navigation_flow_diagrams.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/api_reference.md`
- `docs/09_security_architecture_review_document.md`
- `docs/deployment_runbook.md`
- `docs/02_design_system_component_library_brief.md`

### Team Lead

- [ ] W04-TL-301: Add explicit audit events: `lead_created`, `lead_rejected_honeypot`, `lead_rate_limited`, `turnstile_failed` (names aligned to analytics taxonomy later).
- [ ] W04-TL-302: Add a staging dry-run checklist for verifying redaction.
- [ ] W04-TL-303: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W04-A-301: Document what is never logged (message content, tokens).
- [ ] W04-A-302: Validate responsiveness and accessibility for all updated screens/routes tied to "Structured logging, Sentry, and PII redaction for contact pipeline".
- [ ] W04-A-303: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W04-B-301: Add Pino logger with structured fields; standardize log levels.
- [ ] W04-B-302: Integrate Sentry for API routes and server components; configure scrubbing rules for email/message bodies.
- [ ] W04-B-303: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 4 — Nginx defense-in-depth: rate limits and upstream hardening


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/14_user_interaction_navigation_flow_diagrams.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/api_reference.md`
- `docs/09_security_architecture_review_document.md`
- `docs/deployment_runbook.md`

### Team Lead

- [ ] W04-TL-401: Define measurable acceptance criteria and dependencies for "Nginx defense-in-depth: rate limits and upstream hardening" before execution starts.
- [ ] W04-TL-402: Review merged output for "Nginx defense-in-depth: rate limits and upstream hardening" against security, contract, and quality requirements.
- [ ] W04-TL-403: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W04-A-401: Validate error pages do not leak stack traces at proxy layer.
- [ ] W04-A-402: Validate responsiveness and accessibility for all updated screens/routes tied to "Nginx defense-in-depth: rate limits and upstream hardening".
- [ ] W04-A-403: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W04-B-401: Add dedicated `location` block for `/api/v1/contact` with `limit_req` zones tuned to match app-layer limits (document mapping explicitly).
- [ ] W04-B-402: Ensure correct `real_ip_header` chain if using Cloudflare.
- [ ] W04-B-403: Add timeouts (`proxy_read_timeout`) appropriate for Turnstile verification latency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 5 — Internal link graph, route registry enforcement, and flow alignment


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/14_user_interaction_navigation_flow_diagrams.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/api_reference.md`
- `docs/09_security_architecture_review_document.md`
- `docs/deployment_runbook.md`

### Team Lead

- [ ] W04-TL-501: Define measurable acceptance criteria and dependencies for "Internal link graph, route registry enforcement, and flow alignment" before execution starts.
- [ ] W04-TL-502: Review merged output for "Internal link graph, route registry enforcement, and flow alignment" against security, contract, and quality requirements.
- [ ] W04-TL-503: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W04-A-501: Implement `routes.ts` as single source for internal links; replace string literals across Phase 1 components.
- [ ] W04-A-502: Cross-check against `docs/14_user_interaction_navigation_flow_diagrams.md` for primary journeys.
- [ ] W04-A-503: Fix broken anchors and footer links.

### Developer B

- [ ] W04-B-501: Add a CI script that fails if any `href` points to unknown internal paths (lightweight static scan).
- [ ] W04-B-502: Execute validation/integration/security checks for services changed by "Internal link graph, route registry enforcement, and flow alignment".
- [ ] W04-B-503: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 6 — Automated tests for contact abuse scenarios and negative paths


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/14_user_interaction_navigation_flow_diagrams.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/api_reference.md`
- `docs/09_security_architecture_review_document.md`
- `docs/deployment_runbook.md`
- `docs/02_design_system_component_library_brief.md`

### Team Lead

- [ ] W04-TL-601: Define measurable acceptance criteria and dependencies for "Automated tests for contact abuse scenarios and negative paths" before execution starts.
- [ ] W04-TL-602: Review merged output for "Automated tests for contact abuse scenarios and negative paths" against security, contract, and quality requirements.
- [ ] W04-TL-603: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W04-A-601: Implement the day's required UI/route behaviors for "Automated tests for contact abuse scenarios and negative paths" with complete interaction states.
- [ ] W04-A-602: Validate responsiveness and accessibility for all updated screens/routes tied to "Automated tests for contact abuse scenarios and negative paths".
- [ ] W04-A-603: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W04-B-601: Integration tests: missing Turnstile token, invalid token, honeypot triggered, validation errors, rate limit response shape.
- [ ] W04-B-602: Playwright tests: double-submit prevention, disabled submit states, error banner behavior.
- [ ] W04-B-603: Add test fixtures for Redis limiter reset strategy (test DB namespace / key prefix).

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 7 — Content lock, stakeholder review, and Week 05 backlog grooming


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/14_user_interaction_navigation_flow_diagrams.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/api_reference.md`
- `docs/09_security_architecture_review_document.md`
- `docs/deployment_runbook.md`
- `docs/content_strategy_editorial_governance.md`

### Team Lead

- [ ] W04-TL-701: Run stakeholder walkthrough of Home → Contact funnel with content strategist using `docs/content_strategy_editorial_governance.md` checklist.
- [ ] W04-TL-702: Groom Week 05 stories: pagination contracts, JSON-LD scope, ISR tags.
- [ ] W04-TL-703: Update risk register for any SEO or perf concerns discovered.

### Developer A

- [ ] W04-A-701: Implement the day's required UI/route behaviors for "Content lock, stakeholder review, and Week 05 backlog grooming" with complete interaction states.
- [ ] W04-A-702: Validate responsiveness and accessibility for all updated screens/routes tied to "Content lock, stakeholder review, and Week 05 backlog grooming".
- [ ] W04-A-703: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W04-B-701: Convert findings into tickets: must-fix vs post-MVP.
- [ ] W04-B-702: Ensure `docs/api_reference.md` numeric rate limits match implemented policy (single PR if drift exists).
- [ ] W04-B-703: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

---

## Ticket Import Format (copy into GitHub/Jira)

- **Title:** `[W04][Owner] <ticket-id> - <explicit action + scope>`
- **Labels:** `week-04`, `owner-lead|owner-dev-a|owner-dev-b`, `security|frontend|backend|infra|qa`.
- **Description:** include exact reference documents used, acceptance criteria, and evidence requirements.
- **Definition of Done:** daily deliverable gate + weekly gate must both be satisfied.

---

## Week Sign-off Checklist (Lead)

- [ ] All TL/A/B tickets closed or explicitly carried with owner/date.
- [ ] CI required checks green for merged PRs.
- [ ] Security and contract checks passed for the week scope.
- [ ] Reference-document alignment confirmed for each day.
- [ ] Week status updated in `v1-execution-tracker.md`.
