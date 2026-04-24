# Week 09 — Admin Shell (A02), Dashboard, Writing CMS Core, and Research Parity

## Week objectives

- Deliver the admin experience foundation described in `docs/04_admin_dashboard_ui_screen_design_specifications.md` and structural guidance in `docs/admin_wireframe_specifications.md`.
- Implement the core CMS workflows for **Writing** and **Research**: list screens, editor routes, create/update/publish/unpublish, ISR revalidation triggers, and automated tests.

## Canonical references

- `docs/04_admin_dashboard_ui_screen_design_specifications.md` — A02–A04 and global layout.
- `docs/admin_wireframe_specifications.md` — AWF layout and navigation intent.
- `docs/api_reference.md` — CRUD endpoints under `/api/v1/*` (normalized).
- `docs/technical_spec.md` — `/admin/writing/[slug]/edit`, middleware, revalidation expectations.
- `docs/database_schema.md` — content tables and constraints.

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

## Day 1 — Admin layout shell (A02), navigation, and role-aware menu

### Objectives

- Implement `AdminLayout` with sidebar, top bar, breadcrumbs, and role-based nav visibility (`owner` vs `editor`) per admin UI spec.

### Tasks

1. Build sidebar nav items for all modules A02–A15; hide/disable owner-only items for editors (`Navigation`, destructive deletes, etc.) per RBAC matrix in `docs/api_reference.md`.
2. Implement top bar: page title, breadcrumb, primary action slot.
3. Implement responsive drawer behavior for tablet/mobile breakpoints per spec.
4. Add `data-testid` hooks only where E2E stability requires them.
5. Add Playwright smoke: authed user can navigate across modules (stub pages ok).

### Deliverables

- [ ] Admin shell merged; unauthenticated users still redirected by middleware.
- [ ] Navigation config centralized (`adminNav.ts`).

### Tools (free)

Next.js layouts, Radix UI, Tailwind, Playwright.

### Dependencies / prerequisites

Week 07 auth complete.

### Security and quality

- Navigation hiding is **not** security; enforce RBAC on every mutation route.

### Maintainability

- Drive nav from a typed config array to avoid drift as modules land.

---

## Day 2 — Dashboard home (A02): stats, quick actions, and health indicators

### Objectives

- Implement `/admin` dashboard cards and “quick actions” aligned with roadmap/admin spec expectations.

### Tasks

1. Wire dashboard metrics cards to DB queries (counts: unread leads, published posts, etc.) per spec examples.
2. Add “system health” section with live DB and Redis connectivity indicators as required operational diagnostics.
3. Implement empty states for new installs (zero posts/leads).
4. Add caching where appropriate (short TTL server cache or React Query stale time) to protect DB.
5. Add tests for query logic with seeded DB.

### Deliverables

- [ ] `/admin` dashboard meaningful on seeded staging.

### Tools (free)

Drizzle, Vitest, TanStack Query.

### Dependencies / prerequisites

Seeded data includes representative counts.

### Security and quality

- Dashboard queries must respect role (editor may not see privileged metrics if spec says so—verify against UI spec + API).

### Maintainability

- Keep dashboard queries in `lib/admin/metrics.ts` with explicit types.

---

## Day 3 — Writing management list (A03) + server pagination/filtering

### Objectives

- Implement `/admin/writing` list view with draft/published states, actions, and safe queries.

### Tasks

1. Implement list UI: status badges, filters, search by title/slug, sort by updated date.
2. Implement server-side pagination to handle large libraries.
3. Wire `GET /api/v1/writing` admin variant if separate query params are required; otherwise document single endpoint behavior for admin vs public.
4. Add production-ready bulk actions for operations explicitly required by the admin workflow.
5. Add authorization tests: editor can list; unauth cannot.

### Deliverables

- [ ] `/admin/writing` functional against seeded posts.

### Tools (free)

Next.js server components / route handlers, Drizzle, Playwright.

### Dependencies / prerequisites

Writing table populated.

### Security and quality

- Prevent prototype pollution in search query parsing; strict Zod query schema.

### Maintainability

- Reuse table component built in Week 10 patterns if already started; otherwise keep module-local with TODO to extract.

---

## Day 4 — Writing editor (A04): `/admin/writing/new` + `/admin/writing/[slug]/edit` with Tiptap

### Objectives

- Provide full editor shell with autosave strategy (debounced), slug rules, door/tags fields, and preview toggle if spec requires.

### Tasks

1. Implement Tiptap editor with allowed marks/nodes per roadmap editor checklist (headings h2–h4, bold/italic/underline, links, images, blockquote, lists, code block).
2. Implement slug generation + collision handling UX.
3. Persist canonical JSONB to DB; generate sanitized HTML snapshot if architecture requires derived field (follow `docs/technical_spec.md` + schema).
4. Add image embed flow: either stub “select asset” modal if Week 10 not ready, or minimal URL validation with follow-up.
5. Add client-side guardrails for editorial governance rules where applicable.

### Deliverables

- [ ] Editor can create/edit drafts for a post end-to-end in staging.

### Tools (free)

Tiptap, Zod, React Hook Form.

### Dependencies / prerequisites

Auth session with role; writing PATCH endpoints (Day 5) stubbed or implemented in parallel with feature flags.

### Security and quality

- Sanitize on save; validate outbound links inserted into editor content.

### Maintainability

- Separate `EditorDocument` type from transport DTOs.

---

## Day 5 — Writing mutations + publish/unpublish + ISR revalidation integration

### Objectives

- Implement `POST /api/v1/writing`, `PATCH /api/v1/writing/[id]`, publish/unpublish routes per `docs/technical_spec.md` route table.

### Tasks

1. Implement handlers with Zod + RBAC checks (`owner`/`editor` rules for delete/publish if differentiated).
2. Ensure publish/unpublish triggers `revalidatePath`/`revalidateTag` for `/writing` and affected `/writing/[slug]`.
3. Add audit logs for publish events (who/when/slug) without storing body content in logs.
4. Add integration tests for publish permission boundaries.
5. Measure revalidation latency in staging; document results.

### Deliverables

- [ ] Publish flow updates public pages within agreed SLA (document actual).

### Tools (free)

Next.js revalidation APIs, Vitest, Drizzle.

### Dependencies / prerequisites

Public writing pages exist (Week 05).

### Security and quality

- Protect any `revalidate` endpoint with secret or admin-only server action; never public open revalidate.

### Maintainability

- Centralize “content changed” domain events to reuse for research/impact later.

---

## Day 6 — Research admin parity (A05): list + editor + mutations

### Objectives

- Match writing module patterns for research to reduce cognitive load and defects.

### Tasks

1. Implement `/admin/research` list and editor routes analogous to writing.
2. Implement research create/update/publish endpoints with schema validation aligned to DB enums (resolve any enum mismatch explicitly in code + docs).
3. Add ISR hooks for `/research` pages.
4. Add tests mirroring writing tests (draft leakage, publish permissions).
5. Update admin nav active states and breadcrumbs.

### Deliverables

- [ ] Research CMS workflows operational.

### Tools (free)

Shared CMS components, Vitest, Playwright.

### Dependencies / prerequisites

Writing CMS patterns stable.

### Security and quality

- Validate external links and attachments fields if present.

### Maintainability

- Extract shared `CmsFormLayout`, `SaveStatus`, `SlugField` components.

---

## Day 7 — Week review, demo script, defect burn-down, and Week 10 plan

### Objectives

- Stabilize Week 09 deliverables and prepare CRUD expansion + assets.

### Tasks

1. Run internal demo: create post → publish → verify public page; same for research.
2. Triage defects; fix P0/P1.
3. Add documentation for editor keyboard shortcuts and known limitations.
4. Groom Week 10: community impact, achievements, media appearances, testimonials, R2 uploads.
5. Security review: confirm admin mutations are not callable without session; verify CSRF posture for same-site POSTs.

### Deliverables

- [ ] Demo recording or notes + stable staging build tag.

### Tools (free)

GitHub Issues, screen recording (OBS free), Markdown.

### Dependencies / prerequisites

Days 1–6 complete.

### Security and quality

- Re-run dependency audit if new editor deps added.

### Maintainability

- Lock editor extension set; avoid installing many Tiptap extensions without review.

---

## V1 Definition of Done (Weekly Gate)

- [ ] All Day 1-Day 7 deliverables are completed with linked evidence (PRs, CI runs, reports).
- [ ] No open P0/P1 defects remain for this week's scope.
- [ ] Security controls introduced this week are implemented, tested, and documented.
- [ ] API/DB/UI contract changes are synchronized with `docs/` (no drift).
- [ ] Automated tests added this week are passing in CI.
- [ ] Rollback/operational notes for this week's changes are documented where applicable.

## Week completion checklist

- [ ] Admin shell + dashboard usable.
- [ ] Writing CMS: list + editor + publish + revalidation.
- [ ] Research CMS parity delivered.
- [ ] Automated tests cover critical auth + publish paths
