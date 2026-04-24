# Week 10 — Admin CRUD Expansion (Impact, Achievements, Media, Testimonials) and R2 Media Library

## Week objectives

- Implement remaining content admin modules per admin screen specs and API reference: Community Impact, Achievements, Media Appearances, Testimonials, Metrics (if not already), plus **Media Library / assets** with Cloudflare R2 presigned upload flow.
- Strengthen RBAC tests around destructive operations and owner-only endpoints.

## Canonical references

- `docs/04_admin_dashboard_ui_screen_design_specifications.md` — A06–A10, A12.
- `docs/api_reference.md` — assets upload/confirm/delete patterns (normalized to `/api/v1/*` in technical docs).
- `docs/database_schema.md` — assets polymorphism notes and related tables.
- `docs/technical_spec.md` — upload-url flow and asset confirm mentions.

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

## Day 1 — Community Impact admin (A06) + Achievements admin (A07)

### Objectives

- Ship list + editor workflows for impact entries and achievements with correct validation for JSON fields and enums.

### Tasks

1. Implement `/admin/community-impact` list with filters and status indicators per spec.
2. Implement editor for metrics JSON using structured form controls (avoid raw JSON textarea unless unavoidable).
3. Implement `/admin/achievements` CRUD with year/category constraints.
4. Wire PATCH/DELETE endpoints with RBAC: deletes strictly owner-only per API matrix.
5. Add integration tests for editor vs owner permissions.

### Deliverables

- [ ] A06/A07 usable in staging with seeded records.

### Tools (free)

React, Zod, Drizzle, Vitest.

### Dependencies / prerequisites

Week 09 admin shell and auth.

### Security and quality

- Validate JSON metrics with Zod schema; reject unknown keys if policy requires strictness.

### Maintainability

- Shared `JsonFieldEditor` component with schema-driven UI.

---

## Day 2 — Media Appearances admin (A08) + Testimonials admin (A10)

### Objectives

- Complete media and testimonials management modules with consistent table UX.

### Tasks

1. Implement `/admin/media-appearances` CRUD with venue/date/format fields and outbound link validation.
2. Implement `/admin/testimonials` CRUD with quote/author fields and production-ready publish controls.
3. Add bulk delete only if spec requires; otherwise avoid.
4. Add image/avatar fields for testimonials and wire them to assets in this week’s implementation.
5. Add Playwright smoke for both modules.

### Deliverables

- [ ] A08/A10 functional.

### Tools (free)

Playwright, Zod.

### Dependencies / prerequisites

Assets module may be partial; use URL fields temporarily if needed (document).

### Security and quality

- Sanitize rich text if testimonials allow formatting; default to plain text if unsure.

### Maintainability

- Reuse list table + drawer detail pattern from writing list.

---

## Day 3 — Cloudflare R2 integration: creds, buckets, CORS, and local dev ergonomics

### Objectives

- Establish object storage foundation for uploads and media library.

### Tasks

1. Create R2 bucket(s): separate dev/staging/prod buckets per policy.
2. Configure CORS rules for browser PUT uploads to presigned URLs (tight origins only).
3. Add env vars to `.env.example` and GitHub secrets.
4. Implement storage abstraction interface (`StorageProvider`) with R2 implementation.
5. Document disaster considerations: object deletion vs DB references.

### Deliverables

- [ ] R2 buckets configured and documented.
- [ ] Storage abstraction merged.

### Tools (free)

Cloudflare dashboard, Wrangler CLI (free), TypeScript.

### Dependencies / prerequisites

Cloudflare account access.

### Security and quality

- Never expose R2 secret keys to client bundles; presigned URLs only.

### Maintainability

- Keep upload policy (max size, allowed MIME) centralized.

---

## Day 4 — Presigned upload initiation + client PUT + confirm metadata (`/api/v1/assets/*`)

### Objectives

- Implement the upload pipeline described in `docs/api_reference.md` / `docs/technical_spec.md` (`upload-url`, `confirm`, list, delete).

### Tasks

1. Implement `POST /api/v1/assets/upload-url` returning presigned PUT URL + storage key + asset id placeholder.
2. Implement client upload worker: PUT to R2, progress UI, retry strategy.
3. Implement `POST /api/v1/assets/confirm` to persist metadata (dimensions, alt text).
4. Implement `GET /api/v1/assets` list and `DELETE /api/v1/assets/[id]` owner-only.
5. Add tests with mocked R2 and real Zod validation.

### Deliverables

- [ ] End-to-end upload works in staging for small images.

### Tools (free)

Vitest, curl, browser devtools network panel.

### Dependencies / prerequisites

Day 3 R2 configuration.

### Security and quality

- Validate MIME and file size server-side; never trust client-declared sizes alone.

### Maintainability

- Store `content_type` + `content_id` polymorphic linkage consistently with schema doc.

---

## Day 5 — Media Library UI (A12) + editor integration for images

### Objectives

- Provide admin UX for browsing assets and inserting into Tiptap posts.

### Tasks

1. Build `/admin/assets` grid/list with filters (type, date, search by alt/filename).
2. Implement asset picker modal in writing/research editors.
3. Enforce alt text requirements for accessibility before insert (block or warn).
4. Add deletion safeguards: confirm modal + reference check if schema supports linkage.
5. Add Playwright tests for upload + insert + delete (staging-only credentials).

### Deliverables

- [ ] A12 usable; editors can embed uploaded images.

### Tools (free)

Tiptap, Playwright.

### Dependencies / prerequisites

Day 4 upload pipeline stable.

### Security and quality

- Prevent SVG uploads if policy disallows (XSS risk) unless sanitized pipeline exists.

### Maintainability

- Centralize image insertion command for all editors.

---

## Day 6 — RBAC regression suite expansion + destructive action auditing

### Objectives

- Prove owner/editor separation across new modules and assets.

### Tasks

1. Add matrix tests for each module: editor can update but cannot delete where forbidden; owner can delete.
2. Add audit log entries for deletes (asset + content) if security doc requires traceability.
3. Run manual penetration-style checks: attempt direct API calls without cookies.
4. Review CORS again after any changes to upload domains.
5. Document large-upload support strategy with concrete limits and production-safe handling for V1.

### Deliverables

- [ ] RBAC matrix tests merged and CI-green.

### Tools (free)

Vitest, curl, browser devtools.

### Dependencies / prerequisites

Modules implemented.

### Security and quality

- Ensure delete endpoints always check ownership of resource IDs (IDOR prevention).

### Maintainability

- Generate RBAC matrix from a single config object to keep tests and docs aligned.

---

## Day 7 — Data integrity review, backup impact assessment, Week 11 prep

### Objectives

- Ensure assets and content references remain consistent and ready for leads/navigation/exit-intent weeks.

### Tasks

1. Run DB integrity checks: orphaned assets, broken foreign keys (if used), inconsistent polymorphic references.
2. Validate backup includes R2 strategy (DB-only vs object replication) per runbook intent.
3. Fix P0 integrity issues.
4. Groom Week 11: leads UI, navigation config, exit intent, metrics polish.
5. Update documentation for asset MIME policies and retention.

### Deliverables

- [ ] Integrity report with follow-ups ticketed.
- [ ] Week 11 backlog ready.

### Tools (free)

psql queries, scripts, GitHub Issues.

### Dependencies / prerequisites

Week 10 modules complete.

### Security and quality

- Ensure deleted assets remove or rewrite references in content JSON safely (define behavior).

### Maintainability

- Prefer soft-delete for assets if recovery is a business requirement (only if spec allows).

---

## V1 Definition of Done (Weekly Gate)

- [ ] All Day 1-Day 7 deliverables are completed with linked evidence (PRs, CI runs, reports).
- [ ] No open P0/P1 defects remain for this week's scope.
- [ ] Security controls introduced this week are implemented, tested, and documented.
- [ ] API/DB/UI contract changes are synchronized with `docs/` (no drift).
- [ ] Automated tests added this week are passing in CI.
- [ ] Rollback/operational notes for this week's changes are documented where applicable.

## Week completion checklist

- [ ] Impact/achievements/media/testimonials admin modules operational.
- [ ] R2 upload + confirm + library UI working.
- [ ] RBAC matrix tests expanded
- [ ] Integrity review completed
