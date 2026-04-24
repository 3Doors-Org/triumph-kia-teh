# Week 06 — Complete Public Route Inventory, Tier 1/2 Content, Sitemap, and MVP Readiness Gates

## Week objectives

- Fill out the full public site structure required for MVP per `docs/project_roadmap.md`: **12 public pages + dynamic `/writing/[slug]`**, with real Tier 1/Tier 2 content aligned to `docs/content_strategy_editorial_governance.md`.
- Implement discovery artifacts: `robots.txt`, dynamic sitemap, JSON-LD where applicable, and regression tests that match `docs/qa_testing_plan_checklist.md` expectations.

## Canonical references

- `docs/project_roadmap.md` — MVP definition, public page checklist, sitemap handler mention.
- `docs/technical_spec.md` — canonical public route tree.
- `docs/content_strategy_editorial_governance.md` — Tier 1/2 requirements, About biography requirement.
- `docs/qa_testing_plan_checklist.md` — pre-launch gates and testing expectations (use as ongoing checklist; full execution peaks Week 15–16).

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

## Day 1 — Public route inventory completion and `/about` institutional page

### Objectives

- Ensure every MVP public route exists, is linked, and has an explicit content owner.

### Tasks

1. Verify route list against `docs/technical_spec.md`: `/`, `/organizations`, `/organizations/3doors`, `/organizations/palaverinstitute`, `/organizations/dewisefoundation`, `/community-impact`, `/achievements`, `/media`, `/writing`, `/writing/[slug]`, `/research`, `/contact`.
2. Implement `/about` (Tier 1 biography page) per `docs/content_strategy_editorial_governance.md` if not already present in the technical tree—record decision in PR if product chooses to fold About into Home (must be explicit).
3. Update nav/footer to include About if shipped.
4. Add route registry entries and internal link audit.
5. Create content-owner matrix ticket (page → owner → due date).

### Deliverables

- [ ] 12 core pages accounted for + dynamic writing pages.
- [ ] About page shipped as part of V1 public route inventory.

### Tools (free)

Next.js, Markdown/MDX (if used), issue tracker.

### Dependencies / prerequisites

Weeks 03–05 public foundations.

### Security and quality

- About page must not expose private contact details beyond what content strategy allows.

### Maintainability

- Store long-form About body in CMS/DB early if editorial workflow demands change tracking.

---

## Day 2 — Achievements (`/achievements`) and Media appearances (`/media`) public pages

### Objectives

- Complete remaining public “credibility” surfaces required for MVP scope parity.

### Tasks

1. Implement `/achievements` list UI + detail modals or expandable rows per UI spec.
2. Implement `/media` list UI with filters (format/date) per wireframe/spec.
3. Bind to public read APIs under `/api/v1/*` per normalized contract.
4. Add seed content sufficient for realistic layout stress tests.
5. Add Playwright smoke coverage for both routes.

### Deliverables

- [ ] `/achievements` and `/media` live with seeded/real content.
- [ ] Smoke tests added.

### Tools (free)

Next.js, Drizzle, Playwright.

### Dependencies / prerequisites

Tables migrated; seed data available.

### Security and quality

- Validate external URLs on media entries (allowlist schemes `http/https` only).

### Maintainability

- Shared “credibility list” component patterns to reduce duplication.

---

## Day 3 — JSON-LD structured data for key templates

### Objectives

- Add machine-readable structured data for posts, organizations, and other eligible templates.

### Tasks

1. Implement JSON-LD for writing posts (`BlogPosting` or appropriate schema) with strict field mapping.
2. Add organization structured data for org subpages (choose `Organization` vs `EducationalOrganization` appropriately—document choice).
3. Add breadcrumbs JSON-LD where UI includes breadcrumbs.
4. Add unit tests validating JSON-LD JSON parseability and required fields.
5. Validate output in Google Rich Results test tool (manual) and record results.

### Deliverables

- [ ] JSON-LD present on agreed templates.
- [ ] Tests prevent malformed JSON regressions.

### Tools (free)

Vitest, Google Rich Results Test (manual).

### Dependencies / prerequisites

Stable canonical URLs from Week 04.

### Security and quality

- Never embed unescaped user HTML into JSON-LD; always stringify safely.

### Maintainability

- Central `jsonld.ts` builders per entity type.

---

## Day 4 — `robots.txt`, dynamic sitemap (`GET /api/sitemap.xml` or App Router equivalent), and canonical policy

### Objectives

- Implement discovery endpoints consistent with `docs/project_roadmap.md` (`GET /api/sitemap.xml` mentioned) while keeping staging `noindex`.

### Tasks

1. Implement sitemap generation including static routes + published posts + research entries (per roadmap text).
2. Implement `robots.txt` referencing sitemap; block staging hosts.
3. Ensure sitemap URLs match `NEXT_PUBLIC_SITE_URL` canonical policy.
4. Add tests for sitemap shape (counts, ordering, lastmod format).
5. Add operational note for sitemap caching headers/CDN behavior.

### Deliverables

- [ ] Sitemap and robots deployed to staging; verified via curl.
- [ ] Tests cover inclusion/exclusion rules for drafts.

### Tools (free)

curl, Vitest, Next.js route handlers.

### Dependencies / prerequisites

Public routes finalized; content visibility rules implemented.

### Security and quality

- Sitemap must not enumerate unpublished or admin URLs.

### Maintainability

- Drive sitemap from the same `routes.ts` registry used for internal links.

---

## Day 5 — Public regression suite expansion (navigation, content rendering, 404s)

### Objectives

- Increase automated confidence ahead of MVP week.

### Tasks

1. Expand Playwright suite to visit all MVP public routes and assert key headings load.
2. Add snapshot or structured assertions for critical text blocks (avoid brittle full-page snapshots).
3. Add tests for 404 and malformed slug behavior across dynamic routes.
4. Add production performance assertions (including TTFB thresholds) as mandatory CI gates.
5. Wire suite into CI with shard strategy if runtime grows.

### Deliverables

- [ ] CI runs expanded public E2E suite on PR or nightly (document choice).

### Tools (free)

Playwright, GitHub Actions.

### Dependencies / prerequisites

Routes and content stable enough for tests.

### Security and quality

- Ensure tests do not use production credentials or prod endpoints.

### Maintainability

- Keep selectors resilient (`data-testid` for critical UI only where needed).

---

## Day 6 — Editorial governance QA pass (Tier 1 completeness + style rules)

### Objectives

- Validate content against governance rules before declaring MVP readiness.

### Tasks

1. Run Tier 1 checklist from `docs/content_strategy_editorial_governance.md` (Three Doors explanation, About, org profiles, core metrics).
2. Validate taxonomy labels match ACCESS/EXCELLENCE/OPPORTUNITY across UI + DB tags.
3. Record violations and fix or assign owners with deadlines.
4. Run readability pass on CTAs and contact pathways.
5. Capture sign-off from content owner (async acceptable) in ticket comments.

### Deliverables

- [ ] Tier 1 sign-off completed with no open waivers.
- [ ] Governance violations tracked to zero blockers.

### Tools (free)

Markdown checklists, GitHub Issues.

### Dependencies / prerequisites

Pages populated with real content (roadmap MVP requirement).

### Security and quality

- Ensure no sensitive personal data appears outside approved biography scope.

### Maintainability

- Consider adding markdownlint or custom script for banned punctuation rules if governance requires automation.

---

## Day 7 — MVP readiness report, gap list, and Week 07/08 execution plan

### Objectives

- Produce a decision-ready MVP readiness package and align next week’s auth work.

### Tasks

1. Map MVP requirements from `docs/project_roadmap.md` to evidence links (PRs, CI runs, staging URLs).
2. Identify only execution risks and defects (not scope deferrals), and assign same-week closure plans.
3. Prepare Week 07 backlog: achievements/media polish if needed, Auth.js, middleware, admin login UI.
4. Update risk register: perf, SEO, content, security.
5. Run cross-doc consistency check for `/api/v1/*` paths and session policy numbers (resolve in tickets if mismatched).

### Deliverables

- [ ] MVP readiness markdown report committed under `docs/implementation-plan/_reports/` with linked evidence.
- [ ] Week 07 stories estimated and ordered.

### Tools (free)

GitHub Projects, Markdown.

### Dependencies / prerequisites

Days 1–6 complete.

### Security and quality

- Confirm no staging content accidentally indexed.

### Maintainability

- Keep MVP report as historical artifact for post-launch audits.

---

## V1 Definition of Done (Weekly Gate)

- [ ] All Day 1-Day 7 deliverables are completed with linked evidence (PRs, CI runs, reports).
- [ ] No open P0/P1 defects remain for this week's scope.
- [ ] Security controls introduced this week are implemented, tested, and documented.
- [ ] API/DB/UI contract changes are synchronized with `docs/` (no drift).
- [ ] Automated tests added this week are passing in CI.
- [ ] Rollback/operational notes for this week's changes are documented where applicable.

## Week completion checklist

- [ ] Full MVP public route set implemented and linked.
- [ ] About/Tier 1 governance fully satisfied for V1 launch.
- [ ] JSON-LD + sitemap + robots operational.
- [ ] Expanded automated tests for public routes exist.
