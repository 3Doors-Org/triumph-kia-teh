# Week 03 Team Assignment Sheet (Lead + 2 Developers)

This sheet translates `week-03-public-core-pages-and-contact-foundation.md` into clear, non-duplicated ownership for Team Lead, Developer A (Frontend/UI), and Developer B (Backend/Platform).

Use this sheet together with:

- `docs/implementation-plan/week-03-public-core-pages-and-contact-foundation.md`
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

- Public core screen set (Home/Organizations/Impact/Contact)

### Route/Page Scope

- /
- /organizations
- /organizations/3doors
- /organizations/palaverinstitute
- /organizations/dewisefoundation
- /community-impact
- /contact

### API Endpoint Scope

- POST /api/v1/contact
- GET /api/v1/community-impact


## Day-by-Day Assignment Plan


## Day 1 — Home page implementation (institutional narrative + CTA)


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/ui_screen_design_specs.md`
- `docs/wf_public_screens_specification.md`
- `docs/content_strategy_editorial_governance.md`
- `docs/api_reference.md`
- `docs/technical_spec.md`

### Team Lead

- [ ] W03-TL-101: Implement hero, Three Doors framing section, org spotlight, writing teaser, and final CTA to `/contact` per `docs/project_roadmap.md` Phase 1 checklist.
- [ ] W03-TL-102: Review merged output for "Home page implementation (institutional narrative + CTA)" against security, contract, and quality requirements.
- [ ] W03-TL-103: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W03-A-101: Implement responsive layout across breakpoints using design tokens only.
- [ ] W03-A-102: Add complete metadata (`title`, `description`, Open Graph image, canonical tags) for production.
- [ ] W03-A-103: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W03-B-101: Bind metrics/impact teaser blocks to `org_metrics` with finalized production data bindings.
- [ ] W03-B-102: Add Playwright smoke: Home loads, no console errors (baseline).
- [ ] W03-B-103: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 2 — Organizations overview + three org subpages


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/ui_screen_design_specs.md`
- `docs/wf_public_screens_specification.md`
- `docs/content_strategy_editorial_governance.md`
- `docs/api_reference.md`
- `docs/technical_spec.md`

### Team Lead

- [ ] W03-TL-201: Define measurable acceptance criteria and dependencies for "Organizations overview + three org subpages" before execution starts.
- [ ] W03-TL-202: Review merged output for "Organizations overview + three org subpages" against security, contract, and quality requirements.
- [ ] W03-TL-203: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W03-A-201: Build overview page with cards linking to subpages (use `routes.ts` constants).
- [ ] W03-A-202: Add SEO metadata per org page.
- [ ] W03-A-203: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W03-B-201: Implement dynamic subpage template driven by DB content (seeded) with fallback for missing fields.
- [ ] W03-B-202: Add outbound external links (org sites) with `rel` attributes per accessibility/security guidance.
- [ ] W03-B-203: Add tests for slug param validation and 404 behavior for unknown slugs.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 3 — Community Impact page (filters + data binding)


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/ui_screen_design_specs.md`
- `docs/wf_public_screens_specification.md`
- `docs/content_strategy_editorial_governance.md`
- `docs/api_reference.md`
- `docs/technical_spec.md`

### Team Lead

- [ ] W03-TL-301: Define measurable acceptance criteria and dependencies for "Community Impact page (filters + data binding)" before execution starts.
- [ ] W03-TL-302: Review merged output for "Community Impact page (filters + data binding)" against security, contract, and quality requirements.
- [ ] W03-TL-303: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W03-A-301: Add URL-driven filters (door/type/date) consistent with `docs/14_user_interaction_navigation_flow_diagrams.md` intent.
- [ ] W03-A-302: Implement empty/loading/error UI states.
- [ ] W03-A-303: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W03-B-301: Implement public `GET /api/v1/community-impact` consumer on the page (server components preferred for first paint).
- [ ] W03-B-302: Add pagination or “load more” consistent with API pagination contract in `docs/api_reference.md`.
- [ ] W03-B-303: Add unit tests for filter serialization/parsing utilities.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 4 — Contact page UI + client-side validation


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/ui_screen_design_specs.md`
- `docs/wf_public_screens_specification.md`
- `docs/content_strategy_editorial_governance.md`
- `docs/api_reference.md`
- `docs/technical_spec.md`

### Team Lead

- [ ] W03-TL-401: Define measurable acceptance criteria and dependencies for "Contact page UI + client-side validation" before execution starts.
- [ ] W03-TL-402: Review merged output for "Contact page UI + client-side validation" against security, contract, and quality requirements.
- [ ] W03-TL-403: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W03-A-401: Wire React Hook Form + Zod schema shared with server (`packages/shared` or `lib/schemas/contact.ts`).
- [ ] W03-A-402: Add subject/inquiry dropdown styling per wireframe notes.
- [ ] W03-A-403: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W03-B-401: Implement fields per `docs/api_reference.md` / `docs/database_schema.md` alignment (name, email, inquiry type, message, honeypot `website`, Turnstile widget).
- [ ] W03-B-402: Implement accessible error summaries and per-field errors.
- [ ] W03-B-403: Disable submit until Turnstile resolves (client UX) while ensuring server still validates.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 5 — `POST /api/v1/contact` Route Handler (validation + persistence)


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/ui_screen_design_specs.md`
- `docs/wf_public_screens_specification.md`
- `docs/content_strategy_editorial_governance.md`
- `docs/api_reference.md`
- `docs/technical_spec.md`

### Team Lead

- [ ] W03-TL-501: Define measurable acceptance criteria and dependencies for "`POST /api/v1/contact` Route Handler (validation + persistence)" before execution starts.
- [ ] W03-TL-502: Review merged output for "`POST /api/v1/contact` Route Handler (validation + persistence)" against security, contract, and quality requirements.
- [ ] W03-TL-503: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W03-A-501: Implement handler: parse JSON, Zod validate, reject unknown fields if strict mode is required.
- [ ] W03-A-502: Validate responsiveness and accessibility for all updated screens/routes tied to "`POST /api/v1/contact` Route Handler (validation + persistence)".
- [ ] W03-A-503: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W03-B-501: Insert lead row with hashed IP / user agent fields per privacy/security docs.
- [ ] W03-B-502: Return consistent error shape for validation, captcha, rate limit, and server errors (align to `docs/api_reference.md` normalization note + technical envelope if adopted).
- [ ] W03-B-503: Ensure idempotent handling for honeypot path (silent success without DB write if spec requires).

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 6 — Abuse controls: Turnstile verification + Upstash rate limiting + Nginx limit_req (prep)


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/ui_screen_design_specs.md`
- `docs/wf_public_screens_specification.md`
- `docs/content_strategy_editorial_governance.md`
- `docs/api_reference.md`
- `docs/technical_spec.md`

### Team Lead

- [ ] W03-TL-601: Define measurable acceptance criteria and dependencies for "Abuse controls: Turnstile verification + Upstash rate limiting + Nginx limit_req (prep)" before execution starts.
- [ ] W03-TL-602: Review merged output for "Abuse controls: Turnstile verification + Upstash rate limiting + Nginx limit_req (prep)" against security, contract, and quality requirements.
- [ ] W03-TL-603: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W03-A-601: Implement the day's required UI/route behaviors for "Abuse controls: Turnstile verification + Upstash rate limiting + Nginx limit_req (prep)" with complete interaction states.
- [ ] W03-A-602: Validate responsiveness and accessibility for all updated screens/routes tied to "Abuse controls: Turnstile verification + Upstash rate limiting + Nginx limit_req (prep)".
- [ ] W03-A-603: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W03-B-601: Integrate Cloudflare Turnstile server verification (HTTP call) with timeouts and structured failures.
- [ ] W03-B-602: Implement Upstash sliding window limiter for `POST /api/v1/contact` per documented limits (align numeric policy across code + docs in the same PR).
- [ ] W03-B-603: Add honeypot server-side branch with metrics/logging (no PII).

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 7 — End-to-end integration, Resend notification, and journey smoke tests


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/ui_screen_design_specs.md`
- `docs/wf_public_screens_specification.md`
- `docs/content_strategy_editorial_governance.md`
- `docs/api_reference.md`
- `docs/technical_spec.md`

### Team Lead

- [ ] W03-TL-701: Run content review checkpoint: Tier 1 gaps flagged for Week 06.
- [ ] W03-TL-702: Update implementation plan README cross-links if week deliverables changed scope.
- [ ] W03-TL-703: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W03-A-701: Implement the day's required UI/route behaviors for "End-to-end integration, Resend notification, and journey smoke tests" with complete interaction states.
- [ ] W03-A-702: Validate responsiveness and accessibility for all updated screens/routes tied to "End-to-end integration, Resend notification, and journey smoke tests".
- [ ] W03-A-703: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W03-B-701: Connect `/contact` to `POST /api/v1/contact`; verify success UI states and error recovery.
- [ ] W03-B-702: Integrate Resend notifications for lead creation in staging with safe templates (no secrets logged).
- [ ] W03-B-703: Add Playwright E2E: Home → Organizations → Contact submission (Turnstile mocked in CI if needed).

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

---

## Ticket Import Format (copy into GitHub/Jira)

- **Title:** `[W03][Owner] <ticket-id> - <explicit action + scope>`
- **Labels:** `week-03`, `owner-lead|owner-dev-a|owner-dev-b`, `security|frontend|backend|infra|qa`.
- **Description:** include exact reference documents used, acceptance criteria, and evidence requirements.
- **Definition of Done:** daily deliverable gate + weekly gate must both be satisfied.

---

## Week Sign-off Checklist (Lead)

- [ ] All TL/A/B tickets closed or explicitly carried with owner/date.
- [ ] CI required checks green for merged PRs.
- [ ] Security and contract checks passed for the week scope.
- [ ] Reference-document alignment confirmed for each day.
- [ ] Week status updated in `v1-execution-tracker.md`.
