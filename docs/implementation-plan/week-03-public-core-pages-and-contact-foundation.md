# Week 03 — Public Core Pages, Contact Foundation, and Secure Lead Capture

## Week objectives

- Ship the highest-priority public conversion funnel from `docs/project_roadmap.md` Phase 1: Home, Organizations (overview + org subpages), Community Impact, and Contact—wired to real data where available.
- Implement `POST /api/v1/contact` with validation, Turnstile, honeypot, and rate limiting **before** widening public exposure.

## Canonical references

- `docs/project_roadmap.md` — Phase 1 page priorities and contact handler expectations.
- `docs/ui_screen_design_specs.md`, `docs/wf_public_screens_specification.md` — layout and component intent.
- `docs/content_strategy_editorial_governance.md` — Tier 1 narrative and taxonomy constraints.
- `docs/api_reference.md`, `docs/technical_spec.md` — `/api/v1/contact`, response/error shapes.
- `docs/09_security_architecture_review_document.md` — Turnstile, rate limits, logging/redaction.
- `docs/database_schema.md` — `leads` table and privacy fields.

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

## Day 1 — Home page implementation (institutional narrative + CTA)

### Objectives

- Deliver Home (`/`) per UI/wireframe specs with production-ready, final Tier 1 content wiring.

### Tasks

1. Implement hero, Three Doors framing section, org spotlight, writing teaser, and final CTA to `/contact` per `docs/project_roadmap.md` Phase 1 checklist.
2. Bind metrics/impact teaser blocks to `org_metrics` with finalized production data bindings.
3. Implement responsive layout across breakpoints using design tokens only.
4. Add complete metadata (`title`, `description`, Open Graph image, canonical tags) for production.
5. Add Playwright smoke: Home loads, no console errors (baseline).

### Deliverables

- [ ] `/` matches spec structure and passes smoke test.
- [ ] Content gaps logged as editorial tickets with owners.

### Tools (free)

Next.js, Tailwind, Playwright, axe DevTools.

### Dependencies / prerequisites

Week 02 route shell + primitives.

### Security and quality

- No inline scripts for third parties yet unless required—document CSP implications before adding analytics.

### Maintainability

- Split Home into section components under `components/home/` with typed props.

---

## Day 2 — Organizations overview + three org subpages

### Objectives

- Implement `/organizations` and `/organizations/[slug]` for `3doors`, `palaverinstitute`, `dewisefoundation` per `docs/technical_spec.md`.

### Tasks

1. Build overview page with cards linking to subpages (use `routes.ts` constants).
2. Implement dynamic subpage template driven by DB content (seeded) with fallback for missing fields.
3. Add outbound external links (org sites) with `rel` attributes per accessibility/security guidance.
4. Add SEO metadata per org page.
5. Add tests for slug param validation and 404 behavior for unknown slugs.

### Deliverables

- [ ] Four organization routes live with seeded content.
- [ ] 404 handling covered by tests.

### Tools (free)

Next.js dynamic routes, Drizzle queries, Playwright.

### Dependencies / prerequisites

Week 02 org seeds.

### Security and quality

- Validate slug against allowlist in route handler if any server actions accept user-provided slugs.

### Maintainability

- Single `getOrganizationBySlug` data access function shared by overview cards and detail page.

---

## Day 3 — Community Impact page (filters + data binding)

### Objectives

- Implement `/community-impact` with list UI, filters, and API-backed data per specs.

### Tasks

1. Implement public `GET /api/v1/community-impact` consumer on the page (server components preferred for first paint).
2. Add URL-driven filters (door/type/date) consistent with `docs/14_user_interaction_navigation_flow_diagrams.md` intent.
3. Implement empty/loading/error UI states.
4. Add pagination or “load more” consistent with API pagination contract in `docs/api_reference.md`.
5. Add unit tests for filter serialization/parsing utilities.

### Deliverables

- [ ] `/community-impact` renders real seeded entries.
- [ ] Filter state is shareable via URL.

### Tools (free)

Next.js, Zod (URL query parsing), Vitest.

### Dependencies / prerequisites

API route implemented or stubbed with mock adapter behind feature flag.

### Security and quality

- Ensure public GET rate limiting is compatible with filter interactions (avoid client refetch storms).

### Maintainability

- Keep filter parsing in a pure module for easy testing.

---

## Day 4 — Contact page UI + client-side validation

### Objectives

- Build `/contact` form UX to spec with accessibility and strong client validation (mirrors server schema).

### Tasks

1. Implement fields per `docs/api_reference.md` / `docs/database_schema.md` alignment (name, email, inquiry type, message, honeypot `website`, Turnstile widget).
2. Wire React Hook Form + Zod schema shared with server (`packages/shared` or `lib/schemas/contact.ts`).
3. Implement accessible error summaries and per-field errors.
4. Add subject/inquiry dropdown styling per wireframe notes.
5. Disable submit until Turnstile resolves (client UX) while ensuring server still validates.

### Deliverables

- [ ] `/contact` UI complete and a11y-reviewed locally.
- [ ] Shared Zod schema committed.

### Tools (free)

React Hook Form, Zod, `@marsidev/react-turnstile` (per wireframe spec).

### Dependencies / prerequisites

Turnstile site keys available in staging secrets.

### Security and quality

- Honeypot must be visually hidden from users but not `display:none` in a way that harms bots unexpectedly—follow spec guidance.

### Maintainability

- Keep Turnstile wrapper isolated to swap providers if needed.

---

## Day 5 — `POST /api/v1/contact` Route Handler (validation + persistence)

### Objectives

- Implement the contact submission API with strict validation and safe persistence to `leads`.

### Tasks

1. Implement handler: parse JSON, Zod validate, reject unknown fields if strict mode is required.
2. Insert lead row with hashed IP / user agent fields per privacy/security docs.
3. Return consistent error shape for validation, captcha, rate limit, and server errors (align to `docs/api_reference.md` normalization note + technical envelope if adopted).
4. Ensure idempotent handling for honeypot path (silent success without DB write if spec requires).
5. Add integration tests with mocked DB + mocked Turnstile verification.

### Deliverables

- [ ] Staging endpoint accepts valid submissions and persists rows.
- [ ] Automated tests cover validation failures.

### Tools (free)

Vitest, MSW or direct handler tests, Drizzle.

### Dependencies / prerequisites

Migrations include `leads` table; Redis client stub ok but prefer real Upstash staging.

### Security and quality

- Never store raw Turnstile tokens; verify server-side only.

### Maintainability

- Central `ApiError` mapping utility for consistent HTTP codes.

---

## Day 6 — Abuse controls: Turnstile verification + Upstash rate limiting + Nginx limit_req (prep)

### Objectives

- Make the contact endpoint resistant to spam and credential-stuffing adjacent abuse patterns.

### Tasks

1. Integrate Cloudflare Turnstile server verification (HTTP call) with timeouts and structured failures.
2. Implement Upstash sliding window limiter for `POST /api/v1/contact` per documented limits (align numeric policy across code + docs in the same PR).
3. Add honeypot server-side branch with metrics/logging (no PII).
4. Prepare Nginx `limit_req` snippet for contact location (apply in Week 04 if staging proxy not ready).
5. Add monitoring counters/logging fields for `rate_limited`, `captcha_invalid`, `validation_failed`.

### Deliverables

- [ ] Rate limit + captcha enforced in staging.
- [ ] Metrics events contract finalized and ready for analytics week integration.

### Tools (free)

Upstash Redis, Cloudflare Turnstile, fetch.

### Dependencies / prerequisites

Staging secrets for Redis + Turnstile.

### Security and quality

- Confirm limits cannot be bypassed via alternate hostnames or direct container ports in staging.

### Maintainability

- Implement generic rate limit wrapper for reuse on `POST /api/v1/auth/login` later.

---

## Day 7 — End-to-end integration, Resend notification, and journey smoke tests

### Objectives

- Wire UI to API and validate the primary user journeys that Phase 1 depends on.

### Tasks

1. Connect `/contact` to `POST /api/v1/contact`; verify success UI states and error recovery.
2. Integrate Resend notifications for lead creation in staging with safe templates (no secrets logged).
3. Add Playwright E2E: Home → Organizations → Contact submission (Turnstile mocked in CI if needed).
4. Run content review checkpoint: Tier 1 gaps flagged for Week 06.
5. Update implementation plan README cross-links if week deliverables changed scope.

### Deliverables

- [ ] E2E passes in CI (or documented nightly job if Turnstile blocks CI).
- [ ] Lead appears in DB and confirmation/notification email is delivered in staging.

### Tools (free)

Playwright, Resend API (free tier evaluation), curl.

### Dependencies / prerequisites

Days 1–6 complete.

### Security and quality

- Redact email bodies/logs; verify PII not sent to Sentry breadcrumbs.

### Maintainability

- Keep E2E tests short; isolate Turnstile with test keys or mock adapter.

---

## V1 Definition of Done (Weekly Gate)

- [ ] All Day 1-Day 7 deliverables are completed with linked evidence (PRs, CI runs, reports).
- [ ] No open P0/P1 defects remain for this week's scope.
- [ ] Security controls introduced this week are implemented, tested, and documented.
- [ ] API/DB/UI contract changes are synchronized with `docs/` (no drift).
- [ ] Automated tests added this week are passing in CI.
- [ ] Rollback/operational notes for this week's changes are documented where applicable.

## Week completion checklist

- [ ] Phase 1 core pages implemented: Home, Organizations (+3), Community Impact, Contact UI.
- [ ] `POST /api/v1/contact` secured with validation + captcha + rate limiting.
- [ ] Smoke/E2E coverage for primary funnel exists.
