# Triumph Kia Teh Platform

Production-grade implementation workspace for the Triumph Kia Teh platform.

## Repository structure

- `docs/` canonical product, design, security, and delivery specifications
- `web/` Next.js (App Router) application workspace

## Engineering baseline

- Node.js `20.19.5`
- pnpm `10.19.0`
- Package manager: `pnpm`
- Branch model: protected `main` with PR-only changes

## Quick start

```bash
pnpm install
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Quality and security checks

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm audit:deps
```

## Production container scaffold (not active deployment)

This repo includes deployment scaffolding for later production rollout:

- `web/Dockerfile`
- `docker-compose.production.yml`

These files are committed now for Week 1 foundation work, but deployment can remain paused until the full website is ready.

## Documentation

Start with:

- `docs/implementation-plan/week-01-foundation-and-security-baseline.md`
- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/09_security_architecture_review_document.md`

## Agent guidance files

`web/AGENTS.md` and `web/CLAUDE.md` are AI assistant guidance files generated for coding tools. They are expected, safe to keep, and do not affect runtime behavior.

## Security notice

Never commit real secrets. Only commit `.env.example` placeholders.
