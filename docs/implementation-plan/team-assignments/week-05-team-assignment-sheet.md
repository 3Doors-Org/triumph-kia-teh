# Week 05 Team Assignment Sheet (Lead + 2 Developers)

This sheet translates `week-05-writing-research-and-impact-implementation.md` into clear, non-duplicated ownership for Team Lead, Developer A (Frontend/UI), and Developer B (Backend/Platform).

Use this sheet together with:

- `docs/implementation-plan/week-05-writing-research-and-impact-implementation.md`
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

- Writing Index, Writing Post, Research, Impact list/detail states

### Route/Page Scope

- /writing
- /writing/[slug]
- /research
- /community-impact

### API Endpoint Scope

- GET /api/v1/writing
- GET /api/v1/writing/[slug]
- GET /api/v1/research
- GET /api/v1/community-impact


## Day-by-Day Assignment Plan


## Day 1 — Public writing index (`/writing`) with pagination and filters


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/technical_spec.md`
- `docs/api_reference.md`
- `docs/database_schema.md`
- `docs/ui_screen_design_specs.md`
- `docs/content_strategy_editorial_governance.md`
- `docs/02_design_system_component_library_brief.md`

### Team Lead

- [ ] W05-TL-101: Define measurable acceptance criteria and dependencies for "Public writing index (`/writing`) with pagination and filters" before execution starts.
- [ ] W05-TL-102: Review merged output for "Public writing index (`/writing`) with pagination and filters" against security, contract, and quality requirements.
- [ ] W05-TL-103: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W05-A-101: Implement door filter + tag filter UI; sync filter state to URL search params.
- [ ] W05-A-102: Validate responsiveness and accessibility for all updated screens/routes tied to "Public writing index (`/writing`) with pagination and filters".
- [ ] W05-A-103: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W05-B-101: Implement server-driven listing using `GET /api/v1/writing` (or direct DB read in RSC if that matches final architecture—document choice).
- [ ] W05-B-102: Add empty state for no posts and skeleton loading pattern.
- [ ] W05-B-103: Add pagination controls (cursor or page-based) consistent with API `meta` envelope if used.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 2 — Writing post detail (`/writing/[slug]`) + related posts module


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/technical_spec.md`
- `docs/api_reference.md`
- `docs/database_schema.md`
- `docs/ui_screen_design_specs.md`
- `docs/content_strategy_editorial_governance.md`
- `docs/02_design_system_component_library_brief.md`

### Team Lead

- [ ] W05-TL-201: Define measurable acceptance criteria and dependencies for "Writing post detail (`/writing/[slug]`) + related posts module" before execution starts.
- [ ] W05-TL-202: Review merged output for "Writing post detail (`/writing/[slug]`) + related posts module" against security, contract, and quality requirements.
- [ ] W05-TL-203: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W05-A-201: Add 404 page for unknown slug with helpful navigation.
- [ ] W05-A-202: Validate responsiveness and accessibility for all updated screens/routes tied to "Writing post detail (`/writing/[slug]`) + related posts module".
- [ ] W05-A-203: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W05-B-201: Implement dynamic route with `generateStaticParams` / ISR strategy per technical spec (document revalidate windows).
- [ ] W05-B-202: Implement JSONB → render pipeline: derive sanitized HTML server-side; cache derived output if spec calls for it.
- [ ] W05-B-203: Add “related posts” query by shared tags/door with fallbacks.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 3 — Research index + detail pages


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/technical_spec.md`
- `docs/api_reference.md`
- `docs/database_schema.md`
- `docs/ui_screen_design_specs.md`
- `docs/content_strategy_editorial_governance.md`
- `docs/02_design_system_component_library_brief.md`

### Team Lead

- [ ] W05-TL-301: Define measurable acceptance criteria and dependencies for "Research index + detail pages" before execution starts.
- [ ] W05-TL-302: Review merged output for "Research index + detail pages" against security, contract, and quality requirements.
- [ ] W05-TL-303: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W05-A-301: Implement research list UI with venue/status metadata from schema.
- [ ] W05-A-302: Add tests for malformed identifiers.
- [ ] W05-A-303: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W05-B-301: Implement detail template with authors list, DOI/external link patterns per wireframe/spec.
- [ ] W05-B-302: Wire to `GET /api/v1/research` and detail fetch by id/slug per API contract (align slug strategy with DB).
- [ ] W05-B-303: Add ISR/revalidation hooks for research updates (parallel to writing).

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 4 — Community Impact public API completion + UI polish


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/technical_spec.md`
- `docs/api_reference.md`
- `docs/database_schema.md`
- `docs/ui_screen_design_specs.md`
- `docs/content_strategy_editorial_governance.md`
- `docs/02_design_system_component_library_brief.md`

### Team Lead

- [ ] W05-TL-401: Add DB indexes usage verification (explain plans for heavy queries) per `docs/database_schema.md`.
- [ ] W05-TL-402: Add caching headers or ISR policy decision documented.
- [ ] W05-TL-403: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W05-A-401: Improve UI cards: metrics JSON rendering safeguards (unknown shape handling).
- [ ] W05-A-402: Validate responsiveness and accessibility for all updated screens/routes tied to "Community Impact public API completion + UI polish".
- [ ] W05-A-403: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W05-B-401: Finalize server handler: Zod validation for query params, consistent error responses.
- [ ] W05-B-402: Add integration tests for filter combinations.
- [ ] W05-B-403: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 5 — Central sanitization module + editorial lint hooks (where specified)


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/technical_spec.md`
- `docs/api_reference.md`
- `docs/database_schema.md`
- `docs/ui_screen_design_specs.md`
- `docs/content_strategy_editorial_governance.md`

### Team Lead

- [ ] W05-TL-501: Define measurable acceptance criteria and dependencies for "Central sanitization module + editorial lint hooks (where specified)" before execution starts.
- [ ] W05-TL-502: Review merged output for "Central sanitization module + editorial lint hooks (where specified)" against security, contract, and quality requirements.
- [ ] W05-TL-503: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W05-A-501: Implement the day's required UI/route behaviors for "Central sanitization module + editorial lint hooks (where specified)" with complete interaction states.
- [ ] W05-A-502: Validate responsiveness and accessibility for all updated screens/routes tied to "Central sanitization module + editorial lint hooks (where specified)".
- [ ] W05-A-503: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W05-B-501: Create `lib/security/sanitize-html.ts` with allowlist config and tests.
- [ ] W05-B-502: Add mandatory editorial lint for fields where governance doc prohibits constructs (e.g., emoji/em dash rules), and enforce blocking validation for V1-authoring paths.
- [ ] W05-B-503: Wire sanitization into writing/research render paths only (not double-sanitize incorrectly).

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 6 — ISR / `revalidateTag` / `revalidatePath` integration for content publishes


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/technical_spec.md`
- `docs/api_reference.md`
- `docs/database_schema.md`
- `docs/ui_screen_design_specs.md`
- `docs/content_strategy_editorial_governance.md`

### Team Lead

- [ ] W05-TL-601: Define measurable acceptance criteria and dependencies for "ISR / `revalidateTag` / `revalidatePath` integration for content publishes" before execution starts.
- [ ] W05-TL-602: Review merged output for "ISR / `revalidateTag` / `revalidatePath` integration for content publishes" against security, contract, and quality requirements.
- [ ] W05-TL-603: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W05-A-601: Tag pages: `writing`, `research`, `community-impact` as applicable.
- [ ] W05-A-602: Validate responsiveness and accessibility for all updated screens/routes tied to "ISR / `revalidateTag` / `revalidatePath` integration for content publishes".
- [ ] W05-A-603: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W05-B-601: Implement publish/unpublish hooks in future admin endpoints early via internal test routes **only in non-prod** if needed; otherwise stub with manual revalidate script for Week 05 verification.
- [ ] W05-B-602: Add monitoring log lines for revalidation calls (no secrets).
- [ ] W05-B-603: Document operational procedure for emergency revalidation.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 7 — Accessibility + performance budget checks for new content routes


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/technical_spec.md`
- `docs/api_reference.md`
- `docs/database_schema.md`
- `docs/ui_screen_design_specs.md`
- `docs/content_strategy_editorial_governance.md`

### Team Lead

- [ ] W05-TL-701: Produce Week 05 completion report with open risks for Week 06.
- [ ] W05-TL-702: Review merged output for "Accessibility + performance budget checks for new content routes" against security, contract, and quality requirements.
- [ ] W05-TL-703: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W05-A-701: Fix image `alt` policy for hero images and cards.
- [ ] W05-A-702: Validate responsiveness and accessibility for all updated screens/routes tied to "Accessibility + performance budget checks for new content routes".
- [ ] W05-A-703: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W05-B-701: Run Lighthouse on `/writing`, `/writing/[slug]`, `/research`, `/community-impact` in staging.
- [ ] W05-B-702: Run axe checks focusing on heading order, landmark regions, list semantics.
- [ ] W05-B-703: Record bundle impact of rich-text rendering dependencies; adjust dynamic imports if needed.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

---

## Ticket Import Format (copy into GitHub/Jira)

- **Title:** `[W05][Owner] <ticket-id> - <explicit action + scope>`
- **Labels:** `week-05`, `owner-lead|owner-dev-a|owner-dev-b`, `security|frontend|backend|infra|qa`.
- **Description:** include exact reference documents used, acceptance criteria, and evidence requirements.
- **Definition of Done:** daily deliverable gate + weekly gate must both be satisfied.

---

## Week Sign-off Checklist (Lead)

- [ ] All TL/A/B tickets closed or explicitly carried with owner/date.
- [ ] CI required checks green for merged PRs.
- [ ] Security and contract checks passed for the week scope.
- [ ] Reference-document alignment confirmed for each day.
- [ ] Week status updated in `v1-execution-tracker.md`.
