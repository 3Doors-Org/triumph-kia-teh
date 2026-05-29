# Web application (`personal-website-web`)

Next.js App Router application for the Triumph Kia Teh platform. Workspace commands run from the repository root with `pnpm --dir web <script>` or from this directory with `pnpm <script>`.

## Quick start

```bash
# From repo root
pnpm install
pnpm dev
```

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Development server |
| `pnpm build` / `pnpm start` | Production build and server |
| `pnpm typecheck` | TypeScript |
| `pnpm test` | Unit tests (`tsx --test`) |
| `pnpm test:e2e` | Playwright |
| `pnpm db:migrate` | Apply SQL migrations |
| `pnpm db:apply-*` | Sync portfolio content modules to Postgres |

## Admin RBAC

Enforce roles on the server only:

- `owner` — full access including leads and site configuration
- `editor` — content modules; not owner-only routes

Use `requireRole()` from `src/lib/auth/require-role.ts`. Do not accept role values from the client.

## Project docs

See the [root README](../README.md) for CI/CD, deployment, and environment setup.
