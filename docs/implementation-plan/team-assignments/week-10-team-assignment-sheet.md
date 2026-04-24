# Week 10 Team Assignment Sheet (Lead + 2 Developers)

This sheet translates `week-10-admin-crud-expansion-and-assets.md` into clear, non-duplicated ownership for Team Lead, Developer A (Frontend/UI), and Developer B (Backend/Platform).

Use this sheet together with:

- `docs/implementation-plan/week-10-admin-crud-expansion-and-assets.md`
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

- A06
- A07
- A08
- A10
- A12

### Route/Page Scope

- /admin/community-impact
- /admin/achievements
- /admin/media-appearances
- /admin/testimonials
- /admin/assets

### API Endpoint Scope

- /api/v1/community-impact*
- /api/v1/achievements*
- /api/v1/media-appearances*
- /api/v1/testimonials*
- POST /api/v1/assets/upload-url
- POST /api/v1/assets/confirm
- GET/DELETE /api/v1/assets/[id]


## Day-by-Day Assignment Plan


## Day 1 — Community Impact admin (A06) + Achievements admin (A07)


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/api_reference.md`
- `docs/database_schema.md`
- `docs/technical_spec.md`
- `docs/admin_wireframe_specifications.md`

### Team Lead

- [ ] W10-TL-101: Define measurable acceptance criteria and dependencies for "Community Impact admin (A06) + Achievements admin (A07)" before execution starts.
- [ ] W10-TL-102: Review merged output for "Community Impact admin (A06) + Achievements admin (A07)" against security, contract, and quality requirements.
- [ ] W10-TL-103: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W10-A-101: Implement editor for metrics JSON using structured form controls (avoid raw JSON textarea unless unavoidable).
- [ ] W10-A-102: Validate responsiveness and accessibility for all updated screens/routes tied to "Community Impact admin (A06) + Achievements admin (A07)".
- [ ] W10-A-103: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W10-B-101: Implement `/admin/community-impact` list with filters and status indicators per spec.
- [ ] W10-B-102: Implement `/admin/achievements` CRUD with year/category constraints.
- [ ] W10-B-103: Wire PATCH/DELETE endpoints with RBAC: deletes strictly owner-only per API matrix.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 2 — Media Appearances admin (A08) + Testimonials admin (A10)


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/api_reference.md`
- `docs/database_schema.md`
- `docs/technical_spec.md`
- `docs/admin_wireframe_specifications.md`

### Team Lead

- [ ] W10-TL-201: Define measurable acceptance criteria and dependencies for "Media Appearances admin (A08) + Testimonials admin (A10)" before execution starts.
- [ ] W10-TL-202: Review merged output for "Media Appearances admin (A08) + Testimonials admin (A10)" against security, contract, and quality requirements.
- [ ] W10-TL-203: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W10-A-201: Implement `/admin/media-appearances` CRUD with venue/date/format fields and outbound link validation.
- [ ] W10-A-202: Add bulk delete only if spec requires; otherwise avoid.
- [ ] W10-A-203: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W10-B-201: Implement `/admin/testimonials` CRUD with quote/author fields and production-ready publish controls.
- [ ] W10-B-202: Add image/avatar fields for testimonials and wire them to assets in this week’s implementation.
- [ ] W10-B-203: Add Playwright smoke for both modules.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 3 — Cloudflare R2 integration: creds, buckets, CORS, and local dev ergonomics


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/api_reference.md`
- `docs/database_schema.md`
- `docs/technical_spec.md`

### Team Lead

- [ ] W10-TL-301: Define measurable acceptance criteria and dependencies for "Cloudflare R2 integration: creds, buckets, CORS, and local dev ergonomics" before execution starts.
- [ ] W10-TL-302: Review merged output for "Cloudflare R2 integration: creds, buckets, CORS, and local dev ergonomics" against security, contract, and quality requirements.
- [ ] W10-TL-303: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W10-A-301: Implement the day's required UI/route behaviors for "Cloudflare R2 integration: creds, buckets, CORS, and local dev ergonomics" with complete interaction states.
- [ ] W10-A-302: Validate responsiveness and accessibility for all updated screens/routes tied to "Cloudflare R2 integration: creds, buckets, CORS, and local dev ergonomics".
- [ ] W10-A-303: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W10-B-301: Create R2 bucket(s): separate dev/staging/prod buckets per policy.
- [ ] W10-B-302: Configure CORS rules for browser PUT uploads to presigned URLs (tight origins only).
- [ ] W10-B-303: Add env vars to `.env.example` and GitHub secrets.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 4 — Presigned upload initiation + client PUT + confirm metadata (`/api/v1/assets/*`)


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/api_reference.md`
- `docs/database_schema.md`
- `docs/technical_spec.md`

### Team Lead

- [ ] W10-TL-401: Define measurable acceptance criteria and dependencies for "Presigned upload initiation + client PUT + confirm metadata (`/api/v1/assets/*`)" before execution starts.
- [ ] W10-TL-402: Review merged output for "Presigned upload initiation + client PUT + confirm metadata (`/api/v1/assets/*`)" against security, contract, and quality requirements.
- [ ] W10-TL-403: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W10-A-401: Implement the day's required UI/route behaviors for "Presigned upload initiation + client PUT + confirm metadata (`/api/v1/assets/*`)" with complete interaction states.
- [ ] W10-A-402: Validate responsiveness and accessibility for all updated screens/routes tied to "Presigned upload initiation + client PUT + confirm metadata (`/api/v1/assets/*`)".
- [ ] W10-A-403: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W10-B-401: Implement `POST /api/v1/assets/upload-url` returning presigned PUT URL + storage key + asset id placeholder.
- [ ] W10-B-402: Implement client upload worker: PUT to R2, progress UI, retry strategy.
- [ ] W10-B-403: Implement `POST /api/v1/assets/confirm` to persist metadata (dimensions, alt text).

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 5 — Media Library UI (A12) + editor integration for images


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/api_reference.md`
- `docs/database_schema.md`
- `docs/technical_spec.md`
- `docs/02_design_system_component_library_brief.md`
- `docs/ui_screen_design_specs.md`

### Team Lead

- [ ] W10-TL-501: Define measurable acceptance criteria and dependencies for "Media Library UI (A12) + editor integration for images" before execution starts.
- [ ] W10-TL-502: Review merged output for "Media Library UI (A12) + editor integration for images" against security, contract, and quality requirements.
- [ ] W10-TL-503: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W10-A-501: Build `/admin/assets` grid/list with filters (type, date, search by alt/filename).
- [ ] W10-A-502: Implement asset picker modal in writing/research editors.
- [ ] W10-A-503: Enforce alt text requirements for accessibility before insert (block or warn).

### Developer B

- [ ] W10-B-501: Add Playwright tests for upload + insert + delete (staging-only credentials).
- [ ] W10-B-502: Execute validation/integration/security checks for services changed by "Media Library UI (A12) + editor integration for images".
- [ ] W10-B-503: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 6 — RBAC regression suite expansion + destructive action auditing


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/api_reference.md`
- `docs/database_schema.md`
- `docs/technical_spec.md`
- `docs/02_design_system_component_library_brief.md`
- `docs/ui_screen_design_specs.md`

### Team Lead

- [ ] W10-TL-601: Add audit log entries for deletes (asset + content) if security doc requires traceability.
- [ ] W10-TL-602: Review CORS again after any changes to upload domains.
- [ ] W10-TL-603: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W10-A-601: Implement the day's required UI/route behaviors for "RBAC regression suite expansion + destructive action auditing" with complete interaction states.
- [ ] W10-A-602: Validate responsiveness and accessibility for all updated screens/routes tied to "RBAC regression suite expansion + destructive action auditing".
- [ ] W10-A-603: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W10-B-601: Add matrix tests for each module: editor can update but cannot delete where forbidden; owner can delete.
- [ ] W10-B-602: Run manual penetration-style checks: attempt direct API calls without cookies.
- [ ] W10-B-603: Document large-upload support strategy with concrete limits and production-safe handling for V1.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 7 — Data integrity review, backup impact assessment, Week 11 prep


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/api_reference.md`
- `docs/database_schema.md`
- `docs/technical_spec.md`
- `docs/deployment_runbook.md`

### Team Lead

- [ ] W10-TL-701: Groom Week 11: leads UI, navigation config, exit intent, metrics polish.
- [ ] W10-TL-702: Review merged output for "Data integrity review, backup impact assessment, Week 11 prep" against security, contract, and quality requirements.
- [ ] W10-TL-703: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W10-A-701: Implement the day's required UI/route behaviors for "Data integrity review, backup impact assessment, Week 11 prep" with complete interaction states.
- [ ] W10-A-702: Validate responsiveness and accessibility for all updated screens/routes tied to "Data integrity review, backup impact assessment, Week 11 prep".
- [ ] W10-A-703: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W10-B-701: Run DB integrity checks: orphaned assets, broken foreign keys (if used), inconsistent polymorphic references.
- [ ] W10-B-702: Validate backup includes R2 strategy (DB-only vs object replication) per runbook intent.
- [ ] W10-B-703: Fix P0 integrity issues.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

---

## Ticket Import Format (copy into GitHub/Jira)

- **Title:** `[W10][Owner] <ticket-id> - <explicit action + scope>`
- **Labels:** `week-10`, `owner-lead|owner-dev-a|owner-dev-b`, `security|frontend|backend|infra|qa`.
- **Description:** include exact reference documents used, acceptance criteria, and evidence requirements.
- **Definition of Done:** daily deliverable gate + weekly gate must both be satisfied.

---

## Week Sign-off Checklist (Lead)

- [ ] All TL/A/B tickets closed or explicitly carried with owner/date.
- [ ] CI required checks green for merged PRs.
- [ ] Security and contract checks passed for the week scope.
- [ ] Reference-document alignment confirmed for each day.
- [ ] Week status updated in `v1-execution-tracker.md`.
