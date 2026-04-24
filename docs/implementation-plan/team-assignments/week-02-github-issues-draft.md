# Week 02 GitHub Issues Draft (20 Issues)

This file provides the first 20 Week 2 issues derived from:

- `docs/implementation-plan/week-02-database-ci-cd-and-core-ui-shell.md`
- `docs/implementation-plan/team-assignments/week-02-team-assignment-sheet.md`
- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`

Use one issue per section below.

---

## Issue 01

**Title:** `[W02][Dev-B][Infra] Provision PostgreSQL 15 service with persistent volume and healthcheck`

**Description:**
Implement PostgreSQL 15 in Docker Compose with persistent storage and health checks for local/staging parity.

**Scope:**
- Add Postgres 15 service in compose
- Configure persistent volume
- Add healthcheck command and retry thresholds
- Verify local connectivity from app network

**Acceptance Criteria:**
- `docker compose up` starts healthy DB service
- Volume persists data across container restart
- Healthcheck reports healthy status
- Verification evidence attached (logs/screenshots)

**Labels:** `week-02`, `owner-dev-b`, `infra`, `backend`
**Dependencies:** Week 1 infra baseline complete

---

## Issue 02

**Title:** `[W02][Dev-B][Security] Create least-privilege DB roles (app + migration)`

**Description:**
Define and apply two DB roles: application role (least privilege) and migration role (controlled schema changes).

**Scope:**
- Create role strategy document in repo notes
- Apply SQL/init scripts for role creation
- Assign correct grants for app runtime and migrations

**Acceptance Criteria:**
- App role cannot perform schema-destructive actions
- Migration role can run required migrations
- Role policy documented and linked

**Labels:** `week-02`, `owner-dev-b`, `security`, `backend`
**Dependencies:** Issue 01

---

## Issue 03

**Title:** `[W02][Dev-B][Security] Restrict Postgres to internal Docker network only`

**Description:**
Ensure Postgres is not publicly exposed and only reachable within the internal Docker network.

**Scope:**
- Remove public host binding to `0.0.0.0:5432`
- Validate network-only access from app services
- Document verification steps in runbook notes

**Acceptance Criteria:**
- No external host can connect to DB port
- App container can connect successfully
- Security validation output attached

**Labels:** `week-02`, `owner-dev-b`, `security`, `infra`
**Dependencies:** Issue 01

---

## Issue 04

**Title:** `[W02][Dev-B][Backend] Configure Drizzle ORM and drizzle.config.ts`

**Description:**
Set up Drizzle ORM and Drizzle Kit for schema-first migrations.

**Scope:**
- Install Drizzle packages
- Create `drizzle.config.ts`
- Add migration and studio scripts in package scripts

**Acceptance Criteria:**
- Drizzle config resolves DB URL correctly
- Scripts run without config errors
- Setup documented in README or team notes

**Labels:** `week-02`, `owner-dev-b`, `backend`, `database`
**Dependencies:** Issue 01, Issue 02

---

## Issue 05

**Title:** `[W02][Dev-B][Database] Implement initial schema modules for core tables`

**Description:**
Create initial schema modules needed for Week 3+ work (`users`, `leads`, `organizations`, `nav/config`, minimal `posts`).

**Scope:**
- Add schema files by domain
- Define constraints and enums per schema reference
- Keep naming and column semantics aligned with docs

**Acceptance Criteria:**
- Schema compiles with no type errors
- Core tables exist in generated migration
- Column/enum mapping reviewed for contract consistency

**Labels:** `week-02`, `owner-dev-b`, `database`, `backend`
**Dependencies:** Issue 04

---

## Issue 06

**Title:** `[W02][Dev-B][CI] Generate and validate initial migration on clean database`

**Description:**
Generate first migration and verify it applies cleanly on an empty database.

**Scope:**
- Generate migration files
- Run migrate against fresh DB
- Verify schema objects created correctly

**Acceptance Criteria:**
- Migration runs successfully on clean DB
- No manual DB patching required
- Output logs attached in issue

**Labels:** `week-02`, `owner-dev-b`, `database`, `ci`
**Dependencies:** Issue 05

---

## Issue 07

**Title:** `[W02][Dev-B][CI] Add migration dry-run job with ephemeral Postgres in GitHub Actions`

**Description:**
Add CI step that validates migration applicability in a clean ephemeral DB environment.

**Scope:**
- Add Postgres service in CI workflow
- Run migration dry-run/check job
- Fail pipeline on migration errors

**Acceptance Criteria:**
- CI job runs on PRs
- Migration failures block merge
- Workflow link attached

**Labels:** `week-02`, `owner-dev-b`, `ci`, `database`
**Dependencies:** Issue 06

---

## Issue 08

**Title:** `[W02][Dev-B][Database] Implement idempotent seed script for foundational records`

**Description:**
Create `db:seed` script for foundational records and rerunnable local/staging bootstrap.

**Scope:**
- Seed `organizations` (3doors/palaverinstitute/dewisefoundation)
- Seed initial config/navigation baseline
- Seed staging-safe admin account placeholder path

**Acceptance Criteria:**
- Seed script runs repeatedly without duplicate corruption
- Required foundational records exist
- Seed logs attached

**Labels:** `week-02`, `owner-dev-b`, `database`, `backend`
**Dependencies:** Issue 06

---

## Issue 09

**Title:** `[W02][Dev-B][Docs] Document local reset + migrate + seed bootstrap workflow`

**Description:**
Add a concise developer runbook for local reset, migrate, and seed.

**Scope:**
- Document reset commands
- Document migrate/seed sequence
- Include troubleshooting for common failures

**Acceptance Criteria:**
- New developer can reproduce DB setup from docs
- Steps are tested once end-to-end

**Labels:** `week-02`, `owner-dev-b`, `docs`, `database`
**Dependencies:** Issue 08

---

## Issue 10

**Title:** `[W02][Dev-B][DevOps] Add production-like Dockerfile and staging deploy workflow`

**Description:**
Create production-style Docker build and staging deployment automation with migration-first sequencing.

**Scope:**
- Add multi-stage Dockerfile
- Add/update staging deploy workflow
- Ensure migration executes before app restart/switch

**Acceptance Criteria:**
- Staging deploy runs from CI
- Migration step is enforced pre-serve
- Failed migration blocks deployment

**Labels:** `week-02`, `owner-dev-b`, `devops`, `ci`
**Dependencies:** Issue 07

---

## Issue 11

**Title:** `[W02][Dev-B][Ops] Add application health endpoint and post-deploy validation steps`

**Description:**
Implement health endpoint/check and scriptable post-deploy validation.

**Scope:**
- Add health route or equivalent app check
- Add deploy validation commands to workflow/runbook
- Capture logs/artifacts on deployment failure

**Acceptance Criteria:**
- Health endpoint returns expected status
- Deploy pipeline validates health automatically
- Failure artifacts are accessible

**Labels:** `week-02`, `owner-dev-b`, `ops`, `backend`
**Dependencies:** Issue 10

---

## Issue 12

**Title:** `[W02][Dev-A][DesignSystem] Map core design tokens into Tailwind theme`

**Description:**
Implement foundational token mapping (colors, typography, spacing, radii, shadows) aligned with design system docs.

**Scope:**
- Add token values to Tailwind/theme config
- Ensure canonical colors are present (`#0E2F2C`, `#C4A164`, `#F9F8F5`)
- Remove hardcoded duplicate token values in bootstrap UI

**Acceptance Criteria:**
- Tokens available as classes/utilities
- No conflicting duplicate token definitions
- Screenshot evidence of token usage in base UI

**Labels:** `week-02`, `owner-dev-a`, `frontend`, `design-system`
**Dependencies:** None

---

## Issue 13

**Title:** `[W02][Dev-A][UI] Build base primitives (Button/Input/Textarea/Select/Card/Badge)`

**Description:**
Create reusable primitive components with complete interaction states.

**Scope:**
- Implement defaults + hover + focus-visible + disabled + loading where relevant
- Ensure accessibility semantics and keyboard behavior
- Align with tokenized styles only

**Acceptance Criteria:**
- Primitive components exported and used in at least one test surface
- Focus and disabled states verified
- Basic component usage docs added

**Labels:** `week-02`, `owner-dev-a`, `frontend`, `ui`
**Dependencies:** Issue 12

---

## Issue 14

**Title:** `[W02][Dev-A][UX] Create non-production component preview surface (Storybook or /dev/ui)`

**Description:**
Add a safe preview surface for component verification that is blocked in production.

**Scope:**
- Implement Storybook or `/dev/ui` route
- Add environment guard to block production access
- Showcase core primitives and states

**Acceptance Criteria:**
- Preview works in dev/staging
- Production guard confirmed
- Reference screenshots attached

**Labels:** `week-02`, `owner-dev-a`, `frontend`, `ux`
**Dependencies:** Issue 13

---

## Issue 15

**Title:** `[W02][Dev-A][Frontend] Implement public route skeletons per technical route map`

**Description:**
Create all public route skeletons required for V1 planning continuity.

**Scope:**
- `/`, `/about`, `/organizations`, org subpages, `/community-impact`, `/achievements`, `/media`, `/writing`, `/writing/[slug]`, `/research`, `/contact`
- Add consistent layout shell integration

**Acceptance Criteria:**
- All routes resolve successfully
- Basic structural sections present for each route
- Route list verified against technical spec

**Labels:** `week-02`, `owner-dev-a`, `frontend`, `routing`
**Dependencies:** Issue 13

---

## Issue 16

**Title:** `[W02][Dev-A][Frontend] Implement admin route skeletons for A02–A15`

**Description:**
Add admin route skeletons to support upcoming Week 3+ implementation.

**Scope:**
- `/admin` and module routes for writing/research/impact/achievements/media-appearances/metrics/testimonials/leads/assets/exit-intent/navigation/analytics
- Structural shell only, no full business logic yet

**Acceptance Criteria:**
- Admin routes resolve and render structural layout
- Route inventory aligns with A02–A15 map

**Labels:** `week-02`, `owner-dev-a`, `frontend`, `admin-ui`
**Dependencies:** Issue 13

---

## Issue 17

**Title:** `[W02][Dev-A][Frontend] Add central route registry and replace string-literal internal paths`

**Description:**
Create a single route registry to reduce link drift and keep navigation consistent.

**Scope:**
- Add `routes` constants/helpers
- Use registry in skeleton layouts/components
- Include public + admin routes

**Acceptance Criteria:**
- No raw hardcoded internal path strings in new Week 2 code
- Registry is imported where routing is used

**Labels:** `week-02`, `owner-dev-a`, `frontend`, `architecture`
**Dependencies:** Issue 15, Issue 16

---

## Issue 18

**Title:** `[W02][Lead][Architecture] Week 2 contract consistency review and ADR updates`

**Description:**
Run architecture/contract review for Week 2 outputs and record decisions that affect Weeks 3+.

**Scope:**
- Verify route inventories and canonical conventions
- Verify `/api/v1/*` consistency in docs/code references
- Capture ADRs for any resolved ambiguity

**Acceptance Criteria:**
- Review notes published
- Drift items converted into tracked tasks
- Tracker updated with Week 2 decision evidence

**Labels:** `week-02`, `owner-lead`, `architecture`, `governance`
**Dependencies:** Issues 10–17

---

## Issue 19

**Title:** `[W02][Lead][Security] Week 2 security gate review (DB, deploy, preview-surface, secrets)`

**Description:**
Perform Week 2 security gate sign-off across data, CI/CD, and frontend preview controls.

**Scope:**
- Validate DB exposure and role restrictions
- Validate migration/deploy safety controls
- Validate dev preview route is blocked in production
- Validate no secret leakage in scripts/workflows

**Acceptance Criteria:**
- Security gate report attached
- No open P0/P1 security issues for Week 2 scope
- Week 2 gate status updated in tracker

**Labels:** `week-02`, `owner-lead`, `security`, `release-gate`
**Dependencies:** Issues 01–17

---

## Issue 20

**Title:** `[W02][Lead][Release] Week 2 sign-off and Week 3 readiness handoff`

**Description:**
Finalize Week 2 completion and prepare actionable handoff for Week 3 execution.

**Scope:**
- Verify all Week 2 deliverables against DoD and weekly gate
- Confirm readiness inputs for Week 3 (DB, routes, CI/CD, tokens, skeletons)
- Publish handoff summary for Dev A and Dev B

**Acceptance Criteria:**
- Week 2 marked complete in tracker
- Handoff note posted with Week 3 priorities/dependencies
- Blockers (if any) have owners + ETA

**Labels:** `week-02`, `owner-lead`, `planning`, `handoff`
**Dependencies:** Issues 01–19

