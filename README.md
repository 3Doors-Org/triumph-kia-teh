# Triumph Kia Teh - Personal Website Platform

Enterprise-grade implementation workspace for the Triumph Kia Teh digital platform.  
The project uses a security-first baseline with documented implementation plans, CI controls, and production deployment scaffolding.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Drizzle ORM + PostgreSQL
- pnpm workspaces
- GitHub Actions CI/CD

## Repository Layout

- `web/` - application source code
- `docs/` - implementation plans, architecture, security, and runbooks
- `.github/workflows/` - CI and deployment workflows
- `scripts/` - operational and database scripts

## Prerequisites

- Node.js `20.19.5`
- pnpm `10.19.0`
- Docker + Docker Compose (for containerized workflows)

## Local Development

```bash
pnpm install
pnpm dev
```

Application URL: [http://localhost:3000](http://localhost:3000)

## Environment Configuration

1. Copy `.env.example` to `.env`.
2. Populate required values (`DATABASE_URL`, `MIGRATION_DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`).
3. Keep `.env` local only; do not commit secrets.

## Database Workflows

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed:dev
```

Notes:
- `db:migrate` is the non-interactive migration path used in CI/deploy contexts.
- Seeding is guarded and opt-in (`ALLOW_SEED=true`).

## Quality and Security Gates

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm audit:deps
```

CI also runs:
- migration check against ephemeral PostgreSQL
- TruffleHog secret scanning

## CI/CD

- `CI` workflow (`.github/workflows/ci.yml`)
  - install, migrate check, lint, typecheck, build, audit, secret scan
- `Deploy Staging` workflow (`.github/workflows/deploy-staging.yml`)
  - SSH deploy, migrate, health check, failure log artifact

## Deployment

Production-oriented scaffolding is included:

- `web/Dockerfile`
- `docker-compose.production.yml`

Operational guidance:
- `docs/deployment_runbook.md`
- `docs/runbooks/staging-deploy-secrets.md`
- `docs/runbooks/staging-day7-verification.md`

## Canonical Week Plans

- `docs/implementation-plan/week-01-foundation-and-security-baseline.md`
- `docs/implementation-plan/week-02-database-ci-cd-and-core-ui-shell.md`

## Security Notice

- Never commit real secrets.
- Rotate credentials immediately if exposed.
- Commit only `.env.example` placeholders.
