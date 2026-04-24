# Week 05 — Writing, Research, Community Impact APIs, and Safe Rich Content Rendering

## Week objectives

- Implement public `/writing`, `/writing/[slug]`, and `/research` experiences plus the supporting `GET` APIs under `/api/v1/*`.
- Establish the canonical rich-content pipeline: JSONB source in DB, sanitized derived HTML rendering, and ISR/tag revalidation hooks aligned with `docs/technical_spec.md` and `docs/database_schema.md`.

## Canonical references

- `docs/technical_spec.md` — route tree, ISR notes, Tiptap/HTML pipeline decision.
- `docs/api_reference.md` — writing/research endpoints (normalized to `/api/v1` per docs).
- `docs/database_schema.md` — `posts.body` JSONB and related tables.
- `docs/ui_screen_design_specs.md` — writing index + post layout.
- `docs/content_strategy_editorial_governance.md` — editorial constraints (where applicable to fields).

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

## Day 1 — Public writing index (`/writing`) with pagination and filters

### Objectives

- Deliver paginated writing list with door/tag filters and stable query contract.

### Tasks

1. Implement server-driven listing using `GET /api/v1/writing` (or direct DB read in RSC if that matches final architecture—document choice).
2. Implement door filter + tag filter UI; sync filter state to URL search params.
3. Add empty state for no posts and skeleton loading pattern.
4. Add pagination controls (cursor or page-based) consistent with API `meta` envelope if used.
5. Add unit tests for query builder utilities.

### Deliverables

- [ ] `/writing` functional against seeded posts.
- [ ] URL shareability verified manually + automated where feasible.

### Tools (free)

Next.js, Zod, Vitest, Playwright smoke.

### Dependencies / prerequisites

Seeded `posts` rows (draft vs published rules enforced).

### Security and quality

- Public list must never leak draft posts.

### Maintainability

- Centralize “published only” predicate in query module.

---

## Day 2 — Writing post detail (`/writing/[slug]`) + related posts module

### Objectives

- Render a full post page with metadata bar, hero image policy, and related posts.

### Tasks

1. Implement dynamic route with `generateStaticParams` / ISR strategy per technical spec (document revalidate windows).
2. Implement JSONB → render pipeline: derive sanitized HTML server-side; cache derived output if spec calls for it.
3. Add “related posts” query by shared tags/door with fallbacks.
4. Add 404 page for unknown slug with helpful navigation.
5. Add Playwright test: published post renders; draft slug is inaccessible publicly.

### Deliverables

- [ ] `/writing/[slug]` renders correctly for multiple seeded posts.
- [ ] Draft leakage tests pass.

### Tools (free)

Next.js, DOMPurify (server-safe config), Playwright.

### Dependencies / prerequisites

Day 1 listing live.

### Security and quality

- Sanitize any embedded HTML before render; disallow dangerous tags/attributes per security doc.

### Maintainability

- Isolate renderer in `lib/rich-text/render-post.ts` with unit tests for sanitization edge cases.

---

## Day 3 — Research index + detail pages

### Objectives

- Implement `/research` list and detail views consistent with UI specs and API contracts.

### Tasks

1. Implement research list UI with venue/status metadata from schema.
2. Implement detail template with authors list, DOI/external link patterns per wireframe/spec.
3. Wire to `GET /api/v1/research` and detail fetch by id/slug per API contract (align slug strategy with DB).
4. Add tests for malformed identifiers.
5. Add ISR/revalidation hooks for research updates (parallel to writing).

### Deliverables

- [ ] `/research` pages operational with seeded data.
- [ ] Identifier strategy documented (slug vs id).

### Tools (free)

Next.js, Drizzle, Vitest.

### Dependencies / prerequisites

Research table migrated + seeded.

### Security and quality

- External links must be validated/sanitized where user-provided (future CMS); for seed-only, still set safe `rel` attributes.

### Maintainability

- Reuse list/grid components from writing where possible.

---

## Day 4 — Community Impact public API completion + UI polish

### Objectives

- Ensure `/community-impact` is backed by stable `GET /api/v1/community-impact` behavior (filters, pagination) and matches UI expectations.

### Tasks

1. Finalize server handler: Zod validation for query params, consistent error responses.
2. Add DB indexes usage verification (explain plans for heavy queries) per `docs/database_schema.md`.
3. Improve UI cards: metrics JSON rendering safeguards (unknown shape handling).
4. Add caching headers or ISR policy decision documented.
5. Add integration tests for filter combinations.

### Deliverables

- [ ] API + UI aligned; performance sanity on seed dataset documented.

### Tools (free)

psql `EXPLAIN`, Vitest, Playwright.

### Dependencies / prerequisites

Community impact tables seeded.

### Security and quality

- Guard against JSON injection in rendered metrics text (treat numbers/strings strictly).

### Maintainability

- Define typed `CommunityImpactMetrics` Zod schema shared by API and UI.

---

## Day 5 — Central sanitization module + editorial lint hooks (where specified)

### Objectives

- Consolidate sanitization and editorial constraints so CMS expansion does not duplicate logic.

### Tasks

1. Create `lib/security/sanitize-html.ts` with allowlist config and tests.
2. Add mandatory editorial lint for fields where governance doc prohibits constructs (e.g., emoji/em dash rules), and enforce blocking validation for V1-authoring paths.
3. Wire sanitization into writing/research render paths only (not double-sanitize incorrectly).
4. Document threat model notes: stored XSS vs reflected XSS boundaries.
5. Add regression tests for sample Tiptap JSON fixtures.

### Deliverables

- [ ] Sanitization module + tests merged.
- [ ] Fixture suite for rich JSON samples.

### Tools (free)

Vitest, DOMPurify.

### Dependencies / prerequisites

Day 2 renderer in place.

### Security and quality

- Add tests for SVG/mathML bypass attempts if relevant to allowed tags policy.

### Maintainability

- Version allowlist policy in code comments tied to security doc section IDs where possible.

---

## Day 6 — ISR / `revalidateTag` / `revalidatePath` integration for content publishes

### Objectives

- Implement cache invalidation strategy aligned with `docs/technical_spec.md` and roadmap acceptance criteria (“within 5 seconds” intent—document measured results).

### Tasks

1. Tag pages: `writing`, `research`, `community-impact` as applicable.
2. Implement publish/unpublish hooks in future admin endpoints early via internal test routes **only in non-prod** if needed; otherwise stub with manual revalidate script for Week 05 verification.
3. Add monitoring log lines for revalidation calls (no secrets).
4. Document operational procedure for emergency revalidation.
5. Add perf check: revalidation storm protection (debounce/coalesce) if admin triggers rapid saves.

### Deliverables

- [ ] Demonstrable ISR update path documented with timings from staging.
- [ ] Non-prod revalidate helper or script committed.

### Tools (free)

Next.js revalidation APIs, curl, logs.

### Dependencies / prerequisites

Public pages using tags/paths consistently.

### Security and quality

- Any revalidate endpoint must be authenticated/secret-protected before production (align with QA references to revalidate security).

### Maintainability

- Central `revalidateContent()` helper to avoid scattered strings.

---

## Day 7 — Accessibility + performance budget checks for new content routes

### Objectives

- Ensure new routes meet baseline gates that will become CI gates later.

### Tasks

1. Run Lighthouse on `/writing`, `/writing/[slug]`, `/research`, `/community-impact` in staging.
2. Run axe checks focusing on heading order, landmark regions, list semantics.
3. Fix image `alt` policy for hero images and cards.
4. Record bundle impact of rich-text rendering dependencies; adjust dynamic imports if needed.
5. Produce Week 05 completion report with open risks for Week 06.

### Deliverables

- [ ] Lighthouse/axe reports attached to ticket/PR.
- [ ] Week 06 backlog updated (About page, testimonials public surface, sitemap, JSON-LD breadth).

### Tools (free)

Lighthouse, axe DevTools, Next.js bundle analyzer.

### Dependencies / prerequisites

Days 1–6 complete.

### Security and quality

- Validate no CSP violations introduced by inline styles/scripts.

### Maintainability

- Promote best fixes into reusable components rather than page-local hacks.

---

## V1 Definition of Done (Weekly Gate)

- [ ] All Day 1-Day 7 deliverables are completed with linked evidence (PRs, CI runs, reports).
- [ ] No open P0/P1 defects remain for this week's scope.
- [ ] Security controls introduced this week are implemented, tested, and documented.
- [ ] API/DB/UI contract changes are synchronized with `docs/` (no drift).
- [ ] Automated tests added this week are passing in CI.
- [ ] Rollback/operational notes for this week's changes are documented where applicable.

## Week completion checklist

- [ ] Writing + research public surfaces live with safe rendering.
- [ ] Community impact public API/UI stable.
- [ ] ISR strategy demonstrated with documented results.
- [ ] Sanitization centralized and tested.
