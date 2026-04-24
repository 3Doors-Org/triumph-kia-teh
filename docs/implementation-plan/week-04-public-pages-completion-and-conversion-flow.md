# Week 04 — Conversion Flow Hardening, SEO, Proxy Defenses, and Operational Logging

## Week objectives

- Turn Phase 1 pages into production-quality surfaces: responsive polish, SEO/OG, operational logging, defense-in-depth rate limits at Nginx, and automated tests for abuse scenarios and navigation integrity.
- Align implementation with interaction flows in `docs/14_user_interaction_navigation_flow_diagrams.md` and QA expectations in `docs/qa_testing_plan_checklist.md`.

## Canonical references

- `docs/14_user_interaction_navigation_flow_diagrams.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/api_reference.md`
- `docs/09_security_architecture_review_document.md`
- `docs/deployment_runbook.md`

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

## Day 1 — Responsive polish and visual QA across Phase 1 routes

### Objectives

- Achieve consistent responsive behavior for `/`, `/organizations/*`, `/community-impact`, `/contact`.

### Tasks

1. Audit each page at `390`, `768`, `1280` widths; fix overflow, tap targets, and typography scaling per `docs/02_design_system_component_library_brief.md`.
2. Normalize spacing using the 4px grid; remove one-off margins.
3. Validate focus order and keyboard navigation for nav + forms.
4. Capture before/after screenshots for design review and attach them to the PR as required evidence.
5. Add Playwright viewport matrix tests for critical layouts (smoke level).

### Deliverables

- [ ] Responsive issues triaged to zero blockers.
- [ ] PR with visual QA notes attached.

### Tools (free)

Chrome DevTools, Playwright, Firefox responsive mode.

### Dependencies / prerequisites

Week 03 pages merged.

### Security and quality

- Ensure mobile nav does not expose admin links or debug routes.

### Maintainability

- Prefer CSS utilities + small components over page-level inline styles.

---

## Day 2 — SEO metadata, Open Graph, and canonical URLs

### Objectives

- Implement metadata strategy consistent across Phase 1 pages and prevent duplicate canonicals.

### Tasks

1. Implement `generateMetadata` (or static metadata) for each Phase 1 route with title/description templates.
2. Add OG/Twitter cards where design provides imagery policy; otherwise define safe defaults.
3. Implement canonical URL helper using environment base URL (`NEXT_PUBLIC_SITE_URL`).
4. Add `robots` directives per environment (noindex staging).
5. Add unit tests for metadata builders (snapshot or key fields).

### Deliverables

- [ ] Metadata present for all Phase 1 routes.
- [ ] Staging is `noindex` verified.

### Tools (free)

Next.js Metadata API, Vitest.

### Dependencies / prerequisites

Public URL env documented in Week 01–02.

### Security and quality

- Avoid reflecting raw user input into `<title>` without escaping/sanitization paths.

### Maintainability

- Central `seo.ts` module owns templates and defaults.

---

## Day 3 — Structured logging, Sentry, and PII redaction for contact pipeline

### Objectives

- Make contact failures diagnosable without violating privacy commitments in security/analytics docs.

### Tasks

1. Add Pino logger with structured fields; standardize log levels.
2. Integrate Sentry for API routes and server components; configure scrubbing rules for email/message bodies.
3. Add explicit audit events: `lead_created`, `lead_rejected_honeypot`, `lead_rate_limited`, `turnstile_failed` (names aligned to analytics taxonomy later).
4. Document what is never logged (message content, tokens).
5. Add a staging dry-run checklist for verifying redaction.

### Deliverables

- [ ] Sentry shows events without sensitive payloads.
- [ ] Logging schema documented in `README` or internal doc.

### Tools (free)

Pino, Sentry (free tier), GitHub Issues for scrubbing checklist.

### Dependencies / prerequisites

Contact API live in staging.

### Security and quality

- Validate Sentry beforeSend filters with synthetic payloads.

### Maintainability

- Keep logging helpers in `lib/observability/` with stable interfaces.

---

## Day 4 — Nginx defense-in-depth: rate limits and upstream hardening

### Objectives

- Add proxy-layer protections for `POST /api/v1/contact` per `docs/deployment_runbook.md` / security guidance.

### Tasks

1. Add dedicated `location` block for `/api/v1/contact` with `limit_req` zones tuned to match app-layer limits (document mapping explicitly).
2. Ensure correct `real_ip_header` chain if using Cloudflare.
3. Add timeouts (`proxy_read_timeout`) appropriate for Turnstile verification latency.
4. Validate error pages do not leak stack traces at proxy layer.
5. Roll out to staging first; measure false positives.

### Deliverables

- [ ] Nginx config merged with comments + staging validation notes.
- [ ] Coordinated limits table (Nginx vs app) attached to PR.

### Tools (free)

Nginx, curl, `ab` or `k6` (free) for light load testing.

### Dependencies / prerequisites

Staging domain routed through same Nginx as prod pattern.

### Security and quality

- Avoid “double strict” that blocks legitimate users; tune burst parameters.

### Maintainability

- Keep limit zones in included files with clear naming.

---

## Day 5 — Internal link graph, route registry enforcement, and flow alignment

### Objectives

- Eliminate orphan routes and align CTAs with documented navigation flows.

### Tasks

1. Implement `routes.ts` as single source for internal links; replace string literals across Phase 1 components.
2. Cross-check against `docs/14_user_interaction_navigation_flow_diagrams.md` for primary journeys.
3. Add a CI script that fails if any `href` points to unknown internal paths (lightweight static scan).
4. Fix broken anchors and footer links.
5. Add breadcrumb components where UI spec requires them.

### Deliverables

- [ ] No broken internal links on Phase 1 pages (automated check or weekly report).
- [ ] Flow diagram coverage notes updated in PR description.

### Tools (free)

Custom node script, ripgrep, Playwright link crawler.

### Dependencies / prerequisites

Route registry from Week 02.

### Security and quality

- Validate external links use `rel="noopener noreferrer"` where appropriate.

### Maintainability

- Prefer typed route builder functions (`routes.writing(slug)`).

---

## Day 6 — Automated tests for contact abuse scenarios and negative paths

### Objectives

- Encode security behavior as permanent tests (not manual tribal knowledge).

### Tasks

1. Integration tests: missing Turnstile token, invalid token, honeypot triggered, validation errors, rate limit response shape.
2. Playwright tests: double-submit prevention, disabled submit states, error banner behavior.
3. Add test fixtures for Redis limiter reset strategy (test DB namespace / key prefix).
4. Measure and document flakiness policy for E2E (retry rules).
5. Add CI job partitioning to keep PR checks fast.

### Deliverables

- [ ] CI includes stable security-focused tests for contact.
- [ ] Documented approach for mocking Turnstile in CI.

### Tools (free)

Vitest, Playwright, GitHub Actions.

### Dependencies / prerequisites

Contact endpoint stable.

### Security and quality

- Include tests proving non-JSON body returns safe error response.

### Maintainability

- Keep security tests close to handler (`route.test.ts`) for discoverability.

---

## Day 7 — Content lock, stakeholder review, and Week 05 backlog grooming

### Objectives

- Freeze Phase 1 copy for staging demo and prepare detailed tasks for writing/research/impact build-out.

### Tasks

1. Run stakeholder walkthrough of Home → Contact funnel with content strategist using `docs/content_strategy_editorial_governance.md` checklist.
2. Convert findings into tickets: must-fix vs post-MVP.
3. Groom Week 05 stories: pagination contracts, JSON-LD scope, ISR tags.
4. Update risk register for any SEO or perf concerns discovered.
5. Ensure `docs/api_reference.md` numeric rate limits match implemented policy (single PR if drift exists).

### Deliverables

- [ ] Approved staging demo notes.
- [ ] Week 05 backlog prioritized with estimates.

### Tools (free)

GitHub Projects, Markdown.

### Dependencies / prerequisites

Days 1–6 complete.

### Security and quality

- Confirm staging still `noindex` after metadata changes.

### Maintainability

- Keep decisions in ADRs if they change public URL or SEO strategy.

---

## V1 Definition of Done (Weekly Gate)

- [ ] All Day 1-Day 7 deliverables are completed with linked evidence (PRs, CI runs, reports).
- [ ] No open P0/P1 defects remain for this week's scope.
- [ ] Security controls introduced this week are implemented, tested, and documented.
- [ ] API/DB/UI contract changes are synchronized with `docs/` (no drift).
- [ ] Automated tests added this week are passing in CI.
- [ ] Rollback/operational notes for this week's changes are documented where applicable.

## Week completion checklist

- [ ] Responsive + SEO baseline complete for Phase 1 pages.
- [ ] Logging/Sentry redaction verified.
- [ ] Nginx rate limit layer aligned with app limits.
- [ ] Automated security tests for contact in CI.
