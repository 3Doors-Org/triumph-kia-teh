# Triumph Kia Teh — Personal Website

Production-ready portfolio and institutional platform for [Triumph Kia Teh](https://triumphkiateh.com). The site combines a public-facing Next.js experience with an owner-administered content system backed by PostgreSQL, object storage, and hardened API routes.

Built as a pnpm monorepo with documented runbooks, automated quality gates, and VPS deployment via Docker Compose behind an existing `nginx-proxy` ingress.

---

## Features

### Public site

- Home, About (hero, path of purpose, education, institutional copy), Organizations, Community impact, Achievements, Research, Writing, Media, Testimonials, Contact
- SEO metadata, JSON-LD, sitemap, and robots policies
- Analytics (Plausible, Microsoft Clarity) with privacy-conscious instrumentation
- Motion and accessibility guardrails (reduced-motion support, bundle budgets)

### Admin (`/admin`)

- Role-based access (`owner`, `editor`) with credentials login
- CMS for writing, research, achievements, media, testimonials, community impact, metrics, portrait, navigation, exit intent, and **Site content** (About page, organizations)
- Leads inbox for contact submissions
- Asset library (Cloudflare R2)

### Content pipeline

- Portfolio modules under `web/src/lib/**/portfolio-*-content.ts` (honors, certifications, education, research, community impact, and related surfaces)
- `pnpm db:apply-*` scripts sync portfolio modules into Postgres without mock placeholders
- About page JSON in `about_page_config` (including explicit `education.location`)

---

## Tech stack

| Layer | Choice |
|--------|--------|
| Framework | Next.js 16 (App Router), React, TypeScript |
| Styling | Tailwind CSS 4 |
| Data | PostgreSQL 15, Drizzle ORM |
| Auth | NextAuth (JWT, HttpOnly cookies) |
| Cache / limits | Upstash Redis |
| Media | Cloudflare R2 |
| Email | Resend |
| Observability | Sentry, structured logging (Pino) |
| CI | GitHub Actions |
| Production runtime | Docker (`web/Dockerfile`), `docker-compose.production.yml` |

---

## Repository layout

```
.
├── web/                      # Next.js application
├── docs/                     # Architecture, implementation plans, runbooks
├── extracts/                 # Reference UI bundles (source for portfolio content)
├── .github/workflows/        # CI, deploy, security, launch-readiness
├── docker-compose.production.yml
├── docker-compose.db.yml     # Local Postgres (optional)
└── scripts/                  # DB init, Day-4 proxy checks, ops helpers
```

---

## Prerequisites

- **Node.js** `20.19.5` (see `.nvmrc` if present)
- **pnpm** `10.19.0` (`corepack enable`)
- **Docker** + Compose (for containerized deploy and local DB)
- **PostgreSQL** (local via Compose or hosted, e.g. Supabase)

---

## Local development

```bash
git clone git@github.com:3Doors-Org/triumph-kia-teh.git
cd triumph-kia-teh
pnpm install
cp .env.example .env
# Edit .env with your DATABASE_URL, NEXTAUTH_SECRET, etc.
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin](http://localhost:3000/admin).

### Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e          # requires Playwright browsers
pnpm audit:deps
```

### Database

```bash
pnpm db:migrate        # Apply Drizzle SQL migrations (CI/deploy path)
pnpm db:seed:dev       # Dev seed (requires ALLOW_SEED=true in env)
```

Portfolio sync (loads real content modules; **replaces** rows for that table):

```bash
pnpm --dir web db:apply-about
pnpm --dir web db:apply-achievements
pnpm --dir web db:apply-research
pnpm --dir web db:apply-community-impact
# Optional when you have portfolio rows defined:
# pnpm --dir web db:apply-writing
# pnpm --dir web db:apply-media
# pnpm --dir web db:apply-testimonials
# pnpm --dir web db:apply-org-metrics
```

About patch (non-destructive; ensures `education.location` is stored in DB JSON):

```bash
pnpm --dir web db:apply-about
```

Full about reset: `ABOUT_APPLY_FULL=true pnpm --dir web db:apply-about`

---

## Environment variables

Copy `.env.example` to `.env` at the repository root. Required for production runtime (non-development):

- `DATABASE_URL`, `MIGRATION_DATABASE_URL`
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET` (32+ random bytes)
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- R2, Resend, Turnstile, Sentry, and analytics keys as needed

Never commit `.env` or production secrets. See `docs/runbooks/predeploy-security-checklist.md` before release.

---

## CI/CD and deployment

### What runs automatically on push

| Event | Workflow | What it does |
|--------|-----------|----------------|
| Push or PR to `main` | **CI** (`.github/workflows/ci.yml`) | Install, migration dry-run, unit tests, link validation, lint, typecheck, `pnpm build`, bundle budget, E2E, dependency audit, secret scan |
| Push to `main` or manual trigger | **Build and Push Web Image** (`.github/workflows/build-and-push-image.yml`) | Builds `web/Dockerfile` and pushes GHCR tags (`latest`, `sha-*`, branch) |
| Manual trigger | **Deploy Production** (`.github/workflows/deploy-production.yml`) | SSH to VPS, `git pull`, **build image on server**, `docker compose up`, `db:migrate`, health check |
| Manual trigger | **Deploy Staging** (`.github/workflows/deploy-staging.yml`) | Same pattern for staging host |

Other workflows (manual): `launch-readiness.yml`, `lighthouse.yml`, `security-baseline.yml`.

### Docker images and GitHub Container Registry

Web image publishing to GHCR is automated by `build-and-push-image.yml`.

Deploy workflows SSH into your VPS and run:

```bash
docker compose -f docker-compose.production.yml --env-file .env build web
docker compose -f docker-compose.production.yml --env-file .env up -d web
```

Current deploy workflows still build on the VPS using local tag `personal-website-web:production` (see `docker-compose.production.yml`).

If you want fully pull-based deploys, switch compose to an image like `ghcr.io/<org>/personal-website-web:<tag>` and change deploy steps from `docker compose build` to `docker compose pull`.

### Enabling manual production deploy

1. Create GitHub **environments**: `production` (and `staging` if needed).
2. Add secrets per runbooks:
   - Production: `docs/runbooks/production-deploy-secrets.md`
   - Staging: `docs/runbooks/staging-deploy-secrets.md`
3. On the VPS: clone repo, create `.env`, ensure `proxy-net` exists and `nginx-proxy` + Lets Encrypt companion are running.
4. Push to `main` → **CI** runs automatically.
5. Deploy when ready from **Actions → Deploy Production → Run workflow**.

### First-time production content

After the first successful deploy, SSH to the server and run portfolio apply scripts (see Database section above) or a one-time guarded seed (`ALLOW_PROD_SEED=true`).

---

## Production Docker (VPS)

Designed for a **shared VPS** already using [jwilder/nginx-proxy](https://github.com/nginx-proxy/nginx-proxy) and [letsencrypt-nginx-proxy-companion](https://github.com/nginx-proxy/docker-letsencrypt-nginx-proxy-companion):

- Container joins external network `proxy-net`
- TLS via `VIRTUAL_HOST`, `LETSENCRYPT_HOST`, `LETSENCRYPT_EMAIL`
- App listens on port `3000` inside the container

```bash
docker compose -f docker-compose.production.yml --env-file .env build web
docker compose -f docker-compose.production.yml --env-file .env up -d web
docker compose -f docker-compose.production.yml --env-file .env exec -T web pnpm --dir web db:migrate
curl -fsS https://your-domain.com/api/health
```

Do **not** bind a second nginx to host ports `80`/`443` if the proxy stack already owns them. See `docs/implementation-plan/week-01-day-04-execution-guide.md`.

Broader operations: `docs/deployment_runbook.md`.

---

## Documentation

| Topic | Location |
|--------|----------|
| Deployment runbook | `docs/deployment_runbook.md` |
| Pre-deploy security | `docs/runbooks/predeploy-security-checklist.md` |
| Production deploy secrets | `docs/runbooks/production-deploy-secrets.md` |
| Staging deploy secrets | `docs/runbooks/staging-deploy-secrets.md` |
| Implementation tracker | `docs/implementation-plan/v1-execution-tracker.md` |
| Web app RBAC notes | `web/README.md` |

---

## Security

- Server-side RBAC only; never trust client-sent roles
- Rate limiting on auth and contact routes
- Turnstile on contact form (bypass flags for E2E only)
- Security headers and CSP in production
- TruffleHog secret scanning in CI

Report security issues through your organization's preferred channel; do not open public issues with exploit details.

---

## License

Private repository. All rights reserved unless otherwise stated by the copyright holder.
