# Week 09 Team Assignment Sheet (Lead + 2 Developers)

This sheet translates `week-09-admin-shell-and-content-cms-core.md` into clear, non-duplicated ownership for Team Lead, Developer A (Frontend/UI), and Developer B (Backend/Platform).

Use this sheet together with:

- `docs/implementation-plan/week-09-admin-shell-and-content-cms-core.md`
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

- A02 Dashboard
- A03 Writing Management
- A04 Writing Editor
- A05 Research Management

### Route/Page Scope

- /admin
- /admin/writing
- /admin/writing/[slug]/edit
- /admin/research

### API Endpoint Scope

- GET/POST/PATCH /api/v1/writing*
- GET/POST/PATCH /api/v1/research*
- Revalidation hooks


## Day-by-Day Assignment Plan


## Day 1 — Admin layout shell (A02), navigation, and role-aware menu


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/admin_wireframe_specifications.md`
- `docs/api_reference.md`
- `docs/technical_spec.md`
- `docs/database_schema.md`
- `docs/02_design_system_component_library_brief.md`

### Team Lead

- [ ] W09-TL-101: Define measurable acceptance criteria and dependencies for "Admin layout shell (A02), navigation, and role-aware menu" before execution starts.
- [ ] W09-TL-102: Review merged output for "Admin layout shell (A02), navigation, and role-aware menu" against security, contract, and quality requirements.
- [ ] W09-TL-103: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W09-A-101: Implement top bar: page title, breadcrumb, primary action slot.
- [ ] W09-A-102: Implement responsive drawer behavior for tablet/mobile breakpoints per spec.
- [ ] W09-A-103: Add `data-testid` hooks only where E2E stability requires them.

### Developer B

- [ ] W09-B-101: Build sidebar nav items for all modules A02–A15; hide/disable owner-only items for editors (`Navigation`, destructive deletes, etc.) per RBAC matrix in `docs/api_reference.md`.
- [ ] W09-B-102: Add Playwright smoke: authed user can navigate across modules (stub pages ok).
- [ ] W09-B-103: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 2 — Dashboard home (A02): stats, quick actions, and health indicators


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/admin_wireframe_specifications.md`
- `docs/api_reference.md`
- `docs/technical_spec.md`
- `docs/database_schema.md`
- `docs/02_design_system_component_library_brief.md`

### Team Lead

- [ ] W09-TL-201: Define measurable acceptance criteria and dependencies for "Dashboard home (A02): stats, quick actions, and health indicators" before execution starts.
- [ ] W09-TL-202: Review merged output for "Dashboard home (A02): stats, quick actions, and health indicators" against security, contract, and quality requirements.
- [ ] W09-TL-203: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W09-A-201: Implement the day's required UI/route behaviors for "Dashboard home (A02): stats, quick actions, and health indicators" with complete interaction states.
- [ ] W09-A-202: Validate responsiveness and accessibility for all updated screens/routes tied to "Dashboard home (A02): stats, quick actions, and health indicators".
- [ ] W09-A-203: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W09-B-201: Wire dashboard metrics cards to DB queries (counts: unread leads, published posts, etc.) per spec examples.
- [ ] W09-B-202: Add “system health” section with live DB and Redis connectivity indicators as required operational diagnostics.
- [ ] W09-B-203: Implement empty states for new installs (zero posts/leads).

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 3 — Writing management list (A03) + server pagination/filtering


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/admin_wireframe_specifications.md`
- `docs/api_reference.md`
- `docs/technical_spec.md`
- `docs/database_schema.md`
- `docs/02_design_system_component_library_brief.md`

### Team Lead

- [ ] W09-TL-301: Define measurable acceptance criteria and dependencies for "Writing management list (A03) + server pagination/filtering" before execution starts.
- [ ] W09-TL-302: Review merged output for "Writing management list (A03) + server pagination/filtering" against security, contract, and quality requirements.
- [ ] W09-TL-303: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W09-A-301: Implement list UI: status badges, filters, search by title/slug, sort by updated date.
- [ ] W09-A-302: Validate responsiveness and accessibility for all updated screens/routes tied to "Writing management list (A03) + server pagination/filtering".
- [ ] W09-A-303: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W09-B-301: Implement server-side pagination to handle large libraries.
- [ ] W09-B-302: Wire `GET /api/v1/writing` admin variant if separate query params are required; otherwise document single endpoint behavior for admin vs public.
- [ ] W09-B-303: Add production-ready bulk actions for operations explicitly required by the admin workflow.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 4 — Writing editor (A04): `/admin/writing/new` + `/admin/writing/[slug]/edit` with Tiptap


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/admin_wireframe_specifications.md`
- `docs/api_reference.md`
- `docs/technical_spec.md`
- `docs/database_schema.md`
- `docs/02_design_system_component_library_brief.md`

### Team Lead

- [ ] W09-TL-401: Implement Tiptap editor with allowed marks/nodes per roadmap editor checklist (headings h2–h4, bold/italic/underline, links, images, blockquote, lists, code block).
- [ ] W09-TL-402: Review merged output for "Writing editor (A04): `/admin/writing/new` + `/admin/writing/[slug]/edit` with Tiptap" against security, contract, and quality requirements.
- [ ] W09-TL-403: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W09-A-401: Implement slug generation + collision handling UX.
- [ ] W09-A-402: Add image embed flow: either stub “select asset” modal if Week 10 not ready, or minimal URL validation with follow-up.
- [ ] W09-A-403: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W09-B-401: Persist canonical JSONB to DB; generate sanitized HTML snapshot if architecture requires derived field (follow `docs/technical_spec.md` + schema).
- [ ] W09-B-402: Add client-side guardrails for editorial governance rules where applicable.
- [ ] W09-B-403: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 5 — Writing mutations + publish/unpublish + ISR revalidation integration


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/admin_wireframe_specifications.md`
- `docs/api_reference.md`
- `docs/technical_spec.md`
- `docs/database_schema.md`
- `docs/02_design_system_component_library_brief.md`

### Team Lead

- [ ] W09-TL-501: Add audit logs for publish events (who/when/slug) without storing body content in logs.
- [ ] W09-TL-502: Review merged output for "Writing mutations + publish/unpublish + ISR revalidation integration" against security, contract, and quality requirements.
- [ ] W09-TL-503: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W09-A-501: Implement the day's required UI/route behaviors for "Writing mutations + publish/unpublish + ISR revalidation integration" with complete interaction states.
- [ ] W09-A-502: Validate responsiveness and accessibility for all updated screens/routes tied to "Writing mutations + publish/unpublish + ISR revalidation integration".
- [ ] W09-A-503: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W09-B-501: Implement handlers with Zod + RBAC checks (`owner`/`editor` rules for delete/publish if differentiated).
- [ ] W09-B-502: Ensure publish/unpublish triggers `revalidatePath`/`revalidateTag` for `/writing` and affected `/writing/[slug]`.
- [ ] W09-B-503: Add integration tests for publish permission boundaries.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 6 — Research admin parity (A05): list + editor + mutations


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/admin_wireframe_specifications.md`
- `docs/api_reference.md`
- `docs/technical_spec.md`
- `docs/database_schema.md`
- `docs/02_design_system_component_library_brief.md`

### Team Lead

- [ ] W09-TL-601: Define measurable acceptance criteria and dependencies for "Research admin parity (A05): list + editor + mutations" before execution starts.
- [ ] W09-TL-602: Review merged output for "Research admin parity (A05): list + editor + mutations" against security, contract, and quality requirements.
- [ ] W09-TL-603: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W09-A-601: Implement `/admin/research` list and editor routes analogous to writing.
- [ ] W09-A-602: Add ISR hooks for `/research` pages.
- [ ] W09-A-603: Update admin nav active states and breadcrumbs.

### Developer B

- [ ] W09-B-601: Implement research create/update/publish endpoints with schema validation aligned to DB enums (resolve any enum mismatch explicitly in code + docs).
- [ ] W09-B-602: Add tests mirroring writing tests (draft leakage, publish permissions).
- [ ] W09-B-603: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 7 — Week review, demo script, defect burn-down, and Week 10 plan


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/admin_wireframe_specifications.md`
- `docs/api_reference.md`
- `docs/technical_spec.md`
- `docs/database_schema.md`

### Team Lead

- [ ] W09-TL-701: Groom Week 10: community impact, achievements, media appearances, testimonials, R2 uploads.
- [ ] W09-TL-702: Security review: confirm admin mutations are not callable without session; verify CSRF posture for same-site POSTs.
- [ ] W09-TL-703: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W09-A-701: Run internal demo: create post → publish → verify public page; same for research.
- [ ] W09-A-702: Validate responsiveness and accessibility for all updated screens/routes tied to "Week review, demo script, defect burn-down, and Week 10 plan".
- [ ] W09-A-703: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W09-B-701: Triage defects; fix P0/P1.
- [ ] W09-B-702: Add documentation for editor keyboard shortcuts and known limitations.
- [ ] W09-B-703: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

---

## Ticket Import Format (copy into GitHub/Jira)

- **Title:** `[W09][Owner] <ticket-id> - <explicit action + scope>`
- **Labels:** `week-09`, `owner-lead|owner-dev-a|owner-dev-b`, `security|frontend|backend|infra|qa`.
- **Description:** include exact reference documents used, acceptance criteria, and evidence requirements.
- **Definition of Done:** daily deliverable gate + weekly gate must both be satisfied.

---

## Week Sign-off Checklist (Lead)

- [ ] All TL/A/B tickets closed or explicitly carried with owner/date.
- [ ] CI required checks green for merged PRs.
- [ ] Security and contract checks passed for the week scope.
- [ ] Reference-document alignment confirmed for each day.
- [ ] Week status updated in `v1-execution-tracker.md`.
