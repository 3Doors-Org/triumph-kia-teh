# Week 02 — Database, CI/CD, Core UI Shell, and Phase 0 Closeout

## Week objectives

- Establish PostgreSQL 15 with safe network posture, Drizzle migrations + seeds, deployment automation to staging, and the shared UI foundation (tokens + layout + route tree) required by later weeks.
- Close Phase 0 readiness from `docs/project_roadmap.md`: CI/CD green, DB migrated, design-system-aligned atoms, and navigable route skeletons.

## Canonical references

- `docs/database_schema.md` — tables, indexes, migration rules, seed expectations.
- `docs/deployment_runbook.md` — Docker Compose patterns, deploy sequencing.
- `docs/02_design_system_component_library_brief.md` — tokens, typography, motion constraints.
- `docs/technical_spec.md` — proposed `src/app` route tree for public and admin.
- `docs/ui_screen_design_specs.md` — public layout expectations.

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

## Day 1 — PostgreSQL 15, roles, and network isolation

### Objectives

- Run PostgreSQL 15 in Docker (or managed equivalent) with least-privilege DB roles and no public DB port exposure.

### Tasks

1. Add `docker-compose` service for Postgres 15 with persistent volume and healthcheck.
2. Create application role with minimal privileges and a separate migration role for controlled schema operations.
3. Bind Postgres to internal Docker network only (not `0.0.0.0:5432` on host unless strictly firewalled).
4. Document connection strings for local vs staging vs prod in `.env.example` (names only).
5. Verify connectivity from an ephemeral `psql` container on the same Docker network.

### Deliverables

- [ ] Healthy Postgres container with persistent storage.
- [ ] Documented role strategy and connection policy.

### Tools (free)

Docker Compose, PostgreSQL official image, psql.

### Dependencies / prerequisites

Week 01 VPS + Docker baseline.

### Security and quality

- No superuser credentials in application runtime env; rotate default passwords immediately.

### Maintainability

- Keep compose overrides per environment (`compose.override.yml` pattern) to avoid prod-only hacks in base file.

---

## Day 2 — Drizzle ORM, schema bootstrap, and migration pipeline

### Objectives

- Implement schema as code and a reliable migration workflow aligned with `docs/database_schema.md`.

### Tasks

1. Install Drizzle ORM + Drizzle Kit; configure `drizzle.config.ts`.
2. Implement initial schema modules mirroring core tables needed for Week 03+ (users, leads, organizations, nav, posts minimum viable set per dependency graph).
3. Generate initial migration; verify `pnpm db:migrate` (or documented script) applies cleanly on empty DB.
4. Add CI job step: migration dry-run against ephemeral Postgres service.
5. Document rule: never rewrite committed migrations; additive changes only.

### Deliverables

- [ ] Repeatable migrate-up on fresh DB.
- [ ] CI migration check passing.

### Tools (free)

Drizzle ORM, Drizzle Kit, pnpm, GitHub Actions.

### Dependencies / prerequisites

Day 1 database running.

### Security and quality

- Ensure migrations do not log secrets; scrub CI output.

### Maintainability

- Split schema by domain (`schema/users.ts`, `schema/content.ts`) to match team ownership boundaries.

---

## Day 3 — Seed data and deterministic local/staging bootstrap

### Objectives

- Provide reproducible seeds for organizations, admin user(s), navigation skeleton, and baseline config rows referenced by specs.

### Tasks

1. Implement idempotent seed script (`pnpm db:seed`) using Drizzle inserts with upsert patterns where needed.
2. Seed organizations aligned with route slugs in `docs/technical_spec.md` (`3doors`, `palaverinstitute`, `dewisefoundation`).
3. Seed at least one `owner` user with bcrypt-hashed password for staging only (document password distribution out-of-band).
4. Add staging seed guardrails (refuse to run destructive seeds in production without explicit flag).
5. Document “reset local DB” procedure for developers.

### Deliverables

- [ ] `pnpm db:seed` works on clean DB after migrate.
- [ ] Staging can be bootstrapped from scratch with documented commands.

### Tools (free)

TypeScript, Drizzle, psql (debug).

### Dependencies / prerequisites

Day 2 migrations applied.

### Security and quality

- Never commit real bcrypt hashes for production identities; use staging-only fixtures.

### Maintainability

- Keep seeds small and focused; large content imports belong to editorial pipeline (later weeks).

---

## Day 4 — Staging deployment pipeline (build, migrate, restart)

### Objectives

- Automate deploy to staging: build container image, run migrations, restart app, verify health.

### Tasks

1. Author production-like `Dockerfile` for Next.js (multi-stage) per `docs/deployment_runbook.md` guidance.
2. Wire GitHub Actions deploy workflow to staging environment (SSH + compose pull/up, or registry-based deploy—match runbook).
3. Ensure migrations run before traffic switch; fail deploy if migrate fails.
4. Add `/api/health` or `GET /` health semantics documented for probes.
5. Capture deploy logs artifact on failure.

### Deliverables

- [ ] One-click (workflow dispatch) staging deploy works.
- [ ] Post-deploy smoke: HTTP 200 on `/` staging.

### Tools (free)

GitHub Actions, Docker, Docker Compose, curl.

### Dependencies / prerequisites

Week 01 CI + secrets; Day 1–3 DB.

### Security and quality

- Restrict deploy credentials to least privilege; rotate deploy keys regularly.

### Maintainability

- Tag images by git SHA for traceability.

---

## Day 5 — Design tokens, Tailwind theme, and primitive components

### Objectives

- Encode the design system tokens and core primitives so public/admin pages do not diverge visually.

### Tasks

1. Map `docs/02_design_system_component_library_brief.md` tokens into Tailwind theme extension (`colors`, `fontFamily`, spacing scale).
2. Implement base styles: focus rings, selection, link styles, reduced-motion baseline hooks.
3. Build primitives: `Button`, `Input`, `Textarea`, `Select`, `Card`, `Badge`, `IconButton` with Radix where applicable.
4. Add a mandatory component preview surface (Storybook or `/dev/ui`) gated to non-production environments only.
5. Add visual regression checklist (manual) for primitives.

### Deliverables

- [ ] Tokenized primitives merged and documented in `README` or `docs/` dev notes.
- [ ] No hard-coded hex values in new components.

### Tools (free)

Tailwind CSS, Radix UI, TypeScript.

### Dependencies / prerequisites

Week 01 app scaffold.

### Security and quality

- If `/dev/ui` exists, block in production via env guard + middleware.

### Maintainability

- Co-locate component API types with components to prevent prop drift.

---

## Day 6 — Public + admin route skeletons aligned to technical route tree

### Objectives

- Create navigable route stubs for all public pages listed in `docs/technical_spec.md` and admin sections A02–A15 with production-ready structural layouts.

### Tasks

1. Implement public routes: `/`, `/organizations`, `/organizations/3doors`, `/organizations/palaverinstitute`, `/organizations/dewisefoundation`, `/community-impact`, `/achievements`, `/media`, `/writing`, `/writing/[slug]`, `/research`, `/contact`.
2. Add `/about` route as a first-class V1 route aligned with `docs/content_strategy_editorial_governance.md` Tier 1 requirements.
3. Implement admin route group under `/admin` with complete section layouts for dashboard, writing, research, impact, achievements, media-appearances, metrics, testimonials, leads, assets, exit-intent, navigation, analytics.
4. Wire global layout: header/nav/footer for public; `AdminLayout` shell for admin (login excluded).
5. Add a single `routes.ts` registry exporting path constants for internal links and sitemap later.

### Deliverables

- [ ] All listed routes resolve (200) with complete structural sections and no placeholder TODO blocks.
- [ ] Route registry file committed.

### Tools (free)

Next.js App Router, React, TypeScript.

### Dependencies / prerequisites

Day 5 primitives for consistent chrome.

### Security and quality

- Ensure admin routes do not leak sensitive debug info in errors.

### Maintainability

- Use route groups `(public)` / `(admin)` to keep concerns separated.

---

## Day 7 — Phase 0 verification: rollback rehearsal, SSL/DNS checks, sign-off

### Objectives

- Prove the foundation is production-grade enough to start feature sprints without rework.

### Tasks

1. Run migration rollback rehearsal on staging clone (document exact steps and time).
2. Validate TLS renewal dry-run on staging host.
3. Run `pnpm lint`, `pnpm test`, `pnpm build` locally and in CI on `main`.
4. Produce Phase 0 checklist completion report mapped to `docs/project_roadmap.md` Phase 0 bullets.
5. Prioritize Week 03 backlog issues (Home, orgs, impact, contact).

### Deliverables

- [ ] Phase 0 sign-off note (markdown) with links to CI runs.
- [ ] Week 03 tickets prioritized in tracker.

### Tools (free)

GitHub Actions logs, curl, psql, issue tracker.

### Dependencies / prerequisites

Days 1–6 complete.

### Security and quality

- Confirm DB not reachable from public internet; confirm deploy keys scoped.

### Maintainability

- Keep sign-off doc next to implementation plan for audit trail.

---

## V1 Definition of Done (Weekly Gate)

- [ ] All Day 1-Day 7 deliverables are completed with linked evidence (PRs, CI runs, reports).
- [ ] No open P0/P1 defects remain for this week's scope.
- [ ] Security controls introduced this week are implemented, tested, and documented.
- [ ] API/DB/UI contract changes are synchronized with `docs/` (no drift).
- [ ] Automated tests added this week are passing in CI.
- [ ] Rollback/operational notes for this week's changes are documented where applicable.

## Week completion checklist

- [ ] Migrations + seeds reproducible.
- [ ] Staging deploy automated and verified.
- [ ] Design tokens + primitives available.
- [ ] Full route skeleton matches `docs/technical_spec.md` public/admin tree (+ `/about` decision recorded).
