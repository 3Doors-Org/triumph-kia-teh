# Week 06 Team Assignment Sheet (Lead + 2 Developers)

This sheet translates `week-06-public-content-depth-and-mvp-readiness.md` into clear, non-duplicated ownership for Team Lead, Developer A (Frontend/UI), and Developer B (Backend/Platform).

Use this sheet together with:

- `docs/implementation-plan/week-06-public-content-depth-and-mvp-readiness.md`
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

- Remaining public V1 screens + metadata/structured-data states

### Route/Page Scope

- /achievements
- /media
- /about
- sitemap/robots coverage

### API Endpoint Scope

- GET /api/sitemap.xml (or App Router equivalent)
- Public GET route validations


## Day-by-Day Assignment Plan


## Day 1 — Public route inventory completion and `/about` institutional page


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/content_strategy_editorial_governance.md`
- `docs/qa_testing_plan_checklist.md`

### Team Lead

- [ ] W06-TL-101: Implement `/about` (Tier 1 biography page) per `docs/content_strategy_editorial_governance.md` if not already present in the technical tree—record decision in PR if product chooses to fold About into Home (must be explicit).
- [ ] W06-TL-102: Add route registry entries and internal link audit.
- [ ] W06-TL-103: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W06-A-101: Verify route list against `docs/technical_spec.md`: `/`, `/organizations`, `/organizations/3doors`, `/organizations/palaverinstitute`, `/organizations/dewisefoundation`, `/community-impact`, `/achievements`, `/media`, `/writing`, `/writing/[slug]`, `/research`, `/contact`.
- [ ] W06-A-102: Update nav/footer to include About if shipped.
- [ ] W06-A-103: Create content-owner matrix ticket (page → owner → due date).

### Developer B

- [ ] W06-B-101: Implement backend/platform work required for "Public route inventory completion and `/about` institutional page" (API/data/infra/security).
- [ ] W06-B-102: Execute validation/integration/security checks for services changed by "Public route inventory completion and `/about` institutional page".
- [ ] W06-B-103: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 2 — Achievements (`/achievements`) and Media appearances (`/media`) public pages


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/content_strategy_editorial_governance.md`
- `docs/qa_testing_plan_checklist.md`

### Team Lead

- [ ] W06-TL-201: Define measurable acceptance criteria and dependencies for "Achievements (`/achievements`) and Media appearances (`/media`) public pages" before execution starts.
- [ ] W06-TL-202: Review merged output for "Achievements (`/achievements`) and Media appearances (`/media`) public pages" against security, contract, and quality requirements.
- [ ] W06-TL-203: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W06-A-201: Implement `/achievements` list UI + detail modals or expandable rows per UI spec.
- [ ] W06-A-202: Implement `/media` list UI with filters (format/date) per wireframe/spec.
- [ ] W06-A-203: Add Playwright smoke coverage for both routes.

### Developer B

- [ ] W06-B-201: Bind to public read APIs under `/api/v1/*` per normalized contract.
- [ ] W06-B-202: Add seed content sufficient for realistic layout stress tests.
- [ ] W06-B-203: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 3 — JSON-LD structured data for key templates


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/content_strategy_editorial_governance.md`
- `docs/qa_testing_plan_checklist.md`

### Team Lead

- [ ] W06-TL-301: Define measurable acceptance criteria and dependencies for "JSON-LD structured data for key templates" before execution starts.
- [ ] W06-TL-302: Review merged output for "JSON-LD structured data for key templates" against security, contract, and quality requirements.
- [ ] W06-TL-303: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W06-A-301: Implement JSON-LD for writing posts (`BlogPosting` or appropriate schema) with strict field mapping.
- [ ] W06-A-302: Add organization structured data for org subpages (choose `Organization` vs `EducationalOrganization` appropriately—document choice).
- [ ] W06-A-303: Add breadcrumbs JSON-LD where UI includes breadcrumbs.

### Developer B

- [ ] W06-B-301: Validate output in Google Rich Results test tool (manual) and record results.
- [ ] W06-B-302: Execute validation/integration/security checks for services changed by "JSON-LD structured data for key templates".
- [ ] W06-B-303: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 4 — `robots.txt`, dynamic sitemap (`GET /api/sitemap.xml` or App Router equivalent), and canonical policy


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/content_strategy_editorial_governance.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/02_design_system_component_library_brief.md`
- `docs/ui_screen_design_specs.md`

### Team Lead

- [ ] W06-TL-401: Define measurable acceptance criteria and dependencies for "`robots.txt`, dynamic sitemap (`GET /api/sitemap.xml` or App Router equivalent), and canonical policy" before execution starts.
- [ ] W06-TL-402: Review merged output for "`robots.txt`, dynamic sitemap (`GET /api/sitemap.xml` or App Router equivalent), and canonical policy" against security, contract, and quality requirements.
- [ ] W06-TL-403: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W06-A-401: Implement sitemap generation including static routes + published posts + research entries (per roadmap text).
- [ ] W06-A-402: Add tests for sitemap shape (counts, ordering, lastmod format).
- [ ] W06-A-403: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W06-B-401: Implement `robots.txt` referencing sitemap; block staging hosts.
- [ ] W06-B-402: Ensure sitemap URLs match `NEXT_PUBLIC_SITE_URL` canonical policy.
- [ ] W06-B-403: Add operational note for sitemap caching headers/CDN behavior.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 5 — Public regression suite expansion (navigation, content rendering, 404s)


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/content_strategy_editorial_governance.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/02_design_system_component_library_brief.md`
- `docs/ui_screen_design_specs.md`

### Team Lead

- [ ] W06-TL-501: Define measurable acceptance criteria and dependencies for "Public regression suite expansion (navigation, content rendering, 404s)" before execution starts.
- [ ] W06-TL-502: Review merged output for "Public regression suite expansion (navigation, content rendering, 404s)" against security, contract, and quality requirements.
- [ ] W06-TL-503: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W06-A-501: Expand Playwright suite to visit all MVP public routes and assert key headings load.
- [ ] W06-A-502: Add snapshot or structured assertions for critical text blocks (avoid brittle full-page snapshots).
- [ ] W06-A-503: Add tests for 404 and malformed slug behavior across dynamic routes.

### Developer B

- [ ] W06-B-501: Add production performance assertions (including TTFB thresholds) as mandatory CI gates.
- [ ] W06-B-502: Wire suite into CI with shard strategy if runtime grows.
- [ ] W06-B-503: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 6 — Editorial governance QA pass (Tier 1 completeness + style rules)


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/content_strategy_editorial_governance.md`
- `docs/qa_testing_plan_checklist.md`

### Team Lead

- [ ] W06-TL-601: Run Tier 1 checklist from `docs/content_strategy_editorial_governance.md` (Three Doors explanation, About, org profiles, core metrics).
- [ ] W06-TL-602: Capture sign-off from content owner (async acceptable) in ticket comments.
- [ ] W06-TL-603: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W06-A-601: Run readability pass on CTAs and contact pathways.
- [ ] W06-A-602: Validate responsiveness and accessibility for all updated screens/routes tied to "Editorial governance QA pass (Tier 1 completeness + style rules)".
- [ ] W06-A-603: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W06-B-601: Validate taxonomy labels match ACCESS/EXCELLENCE/OPPORTUNITY across UI + DB tags.
- [ ] W06-B-602: Record violations and fix or assign owners with deadlines.
- [ ] W06-B-603: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 7 — MVP readiness report, gap list, and Week 07/08 execution plan


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/content_strategy_editorial_governance.md`
- `docs/qa_testing_plan_checklist.md`

### Team Lead

- [ ] W06-TL-701: Identify only execution risks and defects (not scope deferrals), and assign same-week closure plans.
- [ ] W06-TL-702: Update risk register: perf, SEO, content, security.
- [ ] W06-TL-703: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W06-A-701: Implement the day's required UI/route behaviors for "MVP readiness report, gap list, and Week 07/08 execution plan" with complete interaction states.
- [ ] W06-A-702: Validate responsiveness and accessibility for all updated screens/routes tied to "MVP readiness report, gap list, and Week 07/08 execution plan".
- [ ] W06-A-703: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W06-B-701: Map MVP requirements from `docs/project_roadmap.md` to evidence links (PRs, CI runs, staging URLs).
- [ ] W06-B-702: Prepare Week 07 backlog: achievements/media polish if needed, Auth.js, middleware, admin login UI.
- [ ] W06-B-703: Run cross-doc consistency check for `/api/v1/*` paths and session policy numbers (resolve in tickets if mismatched).

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

---

## Ticket Import Format (copy into GitHub/Jira)

- **Title:** `[W06][Owner] <ticket-id> - <explicit action + scope>`
- **Labels:** `week-06`, `owner-lead|owner-dev-a|owner-dev-b`, `security|frontend|backend|infra|qa`.
- **Description:** include exact reference documents used, acceptance criteria, and evidence requirements.
- **Definition of Done:** daily deliverable gate + weekly gate must both be satisfied.

---

## Week Sign-off Checklist (Lead)

- [ ] All TL/A/B tickets closed or explicitly carried with owner/date.
- [ ] CI required checks green for merged PRs.
- [ ] Security and contract checks passed for the week scope.
- [ ] Reference-document alignment confirmed for each day.
- [ ] Week status updated in `v1-execution-tracker.md`.
