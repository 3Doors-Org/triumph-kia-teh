# Week 02 Team Assignment Sheet (Lead + 2 Developers)

This sheet translates `week-02-database-ci-cd-and-core-ui-shell.md` into clear, non-duplicated ownership for Team Lead, Developer A (Frontend/UI), and Developer B (Backend/Platform).

Use this sheet together with:

- `docs/implementation-plan/week-02-database-ci-cd-and-core-ui-shell.md`
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

- A02-A15 structural shells (no full business behavior yet)

### Route/Page Scope

- All public and admin route skeletons per technical route map

### API Endpoint Scope

- DB migration pipeline endpoints/health checks as needed for staging


## Day-by-Day Assignment Plan


## Day 1 — PostgreSQL 15, roles, and network isolation


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/database_schema.md`
- `docs/deployment_runbook.md`
- `docs/02_design_system_component_library_brief.md`
- `docs/technical_spec.md`
- `docs/ui_screen_design_specs.md`

### Team Lead

- [ ] W02-TL-101: Define measurable acceptance criteria and dependencies for "PostgreSQL 15, roles, and network isolation" before execution starts.
- [ ] W02-TL-102: Review merged output for "PostgreSQL 15, roles, and network isolation" against security, contract, and quality requirements.
- [ ] W02-TL-103: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W02-A-101: Implement the day's required UI/route behaviors for "PostgreSQL 15, roles, and network isolation" with complete interaction states.
- [ ] W02-A-102: Validate responsiveness and accessibility for all updated screens/routes tied to "PostgreSQL 15, roles, and network isolation".
- [ ] W02-A-103: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W02-B-101: Add `docker-compose` service for Postgres 15 with persistent volume and healthcheck.
- [ ] W02-B-102: Create application role with minimal privileges and a separate migration role for controlled schema operations.
- [ ] W02-B-103: Bind Postgres to internal Docker network only (not `0.0.0.0:5432` on host unless strictly firewalled).

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 2 — Drizzle ORM, schema bootstrap, and migration pipeline


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/database_schema.md`
- `docs/deployment_runbook.md`
- `docs/02_design_system_component_library_brief.md`
- `docs/technical_spec.md`
- `docs/ui_screen_design_specs.md`

### Team Lead

- [ ] W02-TL-201: Define measurable acceptance criteria and dependencies for "Drizzle ORM, schema bootstrap, and migration pipeline" before execution starts.
- [ ] W02-TL-202: Review merged output for "Drizzle ORM, schema bootstrap, and migration pipeline" against security, contract, and quality requirements.
- [ ] W02-TL-203: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W02-A-201: Implement initial schema modules mirroring core tables needed for Week 03+ (users, leads, organizations, nav, posts minimum viable set per dependency graph).
- [ ] W02-A-202: Validate responsiveness and accessibility for all updated screens/routes tied to "Drizzle ORM, schema bootstrap, and migration pipeline".
- [ ] W02-A-203: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W02-B-201: Install Drizzle ORM + Drizzle Kit; configure `drizzle.config.ts`.
- [ ] W02-B-202: Generate initial migration; verify `pnpm db:migrate` (or documented script) applies cleanly on empty DB.
- [ ] W02-B-203: Add CI job step: migration dry-run against ephemeral Postgres service.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 3 — Seed data and deterministic local/staging bootstrap


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/database_schema.md`
- `docs/deployment_runbook.md`
- `docs/02_design_system_component_library_brief.md`
- `docs/technical_spec.md`
- `docs/ui_screen_design_specs.md`

### Team Lead

- [ ] W02-TL-301: Define measurable acceptance criteria and dependencies for "Seed data and deterministic local/staging bootstrap" before execution starts.
- [ ] W02-TL-302: Review merged output for "Seed data and deterministic local/staging bootstrap" against security, contract, and quality requirements.
- [ ] W02-TL-303: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W02-A-301: Implement the day's required UI/route behaviors for "Seed data and deterministic local/staging bootstrap" with complete interaction states.
- [ ] W02-A-302: Validate responsiveness and accessibility for all updated screens/routes tied to "Seed data and deterministic local/staging bootstrap".
- [ ] W02-A-303: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W02-B-301: Implement idempotent seed script (`pnpm db:seed`) using Drizzle inserts with upsert patterns where needed.
- [ ] W02-B-302: Seed organizations aligned with route slugs in `docs/technical_spec.md` (`3doors`, `palaverinstitute`, `dewisefoundation`).
- [ ] W02-B-303: Seed at least one `owner` user with bcrypt-hashed password for staging only (document password distribution out-of-band).

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 4 — Staging deployment pipeline (build, migrate, restart)


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/database_schema.md`
- `docs/deployment_runbook.md`
- `docs/02_design_system_component_library_brief.md`
- `docs/technical_spec.md`
- `docs/ui_screen_design_specs.md`

### Team Lead

- [ ] W02-TL-401: Define measurable acceptance criteria and dependencies for "Staging deployment pipeline (build, migrate, restart)" before execution starts.
- [ ] W02-TL-402: Review merged output for "Staging deployment pipeline (build, migrate, restart)" against security, contract, and quality requirements.
- [ ] W02-TL-403: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W02-A-401: Implement the day's required UI/route behaviors for "Staging deployment pipeline (build, migrate, restart)" with complete interaction states.
- [ ] W02-A-402: Validate responsiveness and accessibility for all updated screens/routes tied to "Staging deployment pipeline (build, migrate, restart)".
- [ ] W02-A-403: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W02-B-401: Author production-like `Dockerfile` for Next.js (multi-stage) per `docs/deployment_runbook.md` guidance.
- [ ] W02-B-402: Wire GitHub Actions deploy workflow to staging environment (SSH + compose pull/up, or registry-based deploy—match runbook).
- [ ] W02-B-403: Ensure migrations run before traffic switch; fail deploy if migrate fails.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 5 — Design tokens, Tailwind theme, and primitive components


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/database_schema.md`
- `docs/deployment_runbook.md`
- `docs/02_design_system_component_library_brief.md`
- `docs/technical_spec.md`
- `docs/ui_screen_design_specs.md`

### Team Lead

- [ ] W02-TL-501: Add a mandatory component preview surface (Storybook or `/dev/ui`) gated to non-production environments only.
- [ ] W02-TL-502: Add visual regression checklist (manual) for primitives.
- [ ] W02-TL-503: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W02-A-501: Implement base styles: focus rings, selection, link styles, reduced-motion baseline hooks.
- [ ] W02-A-502: Build primitives: `Button`, `Input`, `Textarea`, `Select`, `Card`, `Badge`, `IconButton` with Radix where applicable.
- [ ] W02-A-503: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W02-B-501: Map `docs/02_design_system_component_library_brief.md` tokens into Tailwind theme extension (`colors`, `fontFamily`, spacing scale).
- [ ] W02-B-502: Execute validation/integration/security checks for services changed by "Design tokens, Tailwind theme, and primitive components".
- [ ] W02-B-503: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 6 — Public + admin route skeletons aligned to technical route tree


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/database_schema.md`
- `docs/deployment_runbook.md`
- `docs/02_design_system_component_library_brief.md`
- `docs/technical_spec.md`
- `docs/ui_screen_design_specs.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`

### Team Lead

- [ ] W02-TL-601: Define measurable acceptance criteria and dependencies for "Public + admin route skeletons aligned to technical route tree" before execution starts.
- [ ] W02-TL-602: Review merged output for "Public + admin route skeletons aligned to technical route tree" against security, contract, and quality requirements.
- [ ] W02-TL-603: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W02-A-601: Implement public routes: `/`, `/organizations`, `/organizations/3doors`, `/organizations/palaverinstitute`, `/organizations/dewisefoundation`, `/community-impact`, `/achievements`, `/media`, `/writing`, `/writing/[slug]`, `/research`, `/contact`.
- [ ] W02-A-602: Implement admin route group under `/admin` with complete section layouts for dashboard, writing, research, impact, achievements, media-appearances, metrics, testimonials, leads, assets, exit-intent, navigation, analytics.
- [ ] W02-A-603: Add a single `routes.ts` registry exporting path constants for internal links and sitemap later.

### Developer B

- [ ] W02-B-601: Add `/about` route as a first-class V1 route aligned with `docs/content_strategy_editorial_governance.md` Tier 1 requirements.
- [ ] W02-B-602: Wire global layout: header/nav/footer for public; `AdminLayout` shell for admin (login excluded).
- [ ] W02-B-603: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 7 — Phase 0 verification: rollback rehearsal, SSL/DNS checks, sign-off


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/database_schema.md`
- `docs/deployment_runbook.md`
- `docs/02_design_system_component_library_brief.md`
- `docs/technical_spec.md`
- `docs/ui_screen_design_specs.md`

### Team Lead

- [ ] W02-TL-701: Produce Phase 0 checklist completion report mapped to `docs/project_roadmap.md` Phase 0 bullets.
- [ ] W02-TL-702: Prioritize Week 03 backlog issues (Home, orgs, impact, contact).
- [ ] W02-TL-703: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W02-A-701: Implement the day's required UI/route behaviors for "Phase 0 verification: rollback rehearsal, SSL/DNS checks, sign-off" with complete interaction states.
- [ ] W02-A-702: Validate responsiveness and accessibility for all updated screens/routes tied to "Phase 0 verification: rollback rehearsal, SSL/DNS checks, sign-off".
- [ ] W02-A-703: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W02-B-701: Run migration rollback rehearsal on staging clone (document exact steps and time).
- [ ] W02-B-702: Validate TLS renewal dry-run on staging host.
- [ ] W02-B-703: Run `pnpm lint`, `pnpm test`, `pnpm build` locally and in CI on `main`.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

---

## Ticket Import Format (copy into GitHub/Jira)

- **Title:** `[W02][Owner] <ticket-id> - <explicit action + scope>`
- **Labels:** `week-02`, `owner-lead|owner-dev-a|owner-dev-b`, `security|frontend|backend|infra|qa`.
- **Description:** include exact reference documents used, acceptance criteria, and evidence requirements.
- **Definition of Done:** daily deliverable gate + weekly gate must both be satisfied.

---

## Week Sign-off Checklist (Lead)

- [ ] All TL/A/B tickets closed or explicitly carried with owner/date.
- [ ] CI required checks green for merged PRs.
- [ ] Security and contract checks passed for the week scope.
- [ ] Reference-document alignment confirmed for each day.
- [ ] Week status updated in `v1-execution-tracker.md`.
