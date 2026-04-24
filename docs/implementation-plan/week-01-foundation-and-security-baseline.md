# Week 01 — Foundation and Security Baseline

## Week objectives

- Stand up a secure engineering foundation from zero: repository governance, baseline Next.js application, hardened VPS posture, TLS-ready reverse proxy, and CI security gates.
- Embed security as default behavior (branch protection, secrets hygiene, scanning, transport and header planning) before feature work begins.

## Canonical references

- `docs/project_roadmap.md` — Phase 0 / Sprint 1 expectations and milestone timing.
- `docs/technical_spec.md` — stack, proposed app structure, canonical API/auth contract addendum.
- `docs/deployment_runbook.md` — VPS, UFW, fail2ban, Nginx, Certbot patterns.
- `docs/09_security_architecture_review_document.md` — headers, session posture, dependency and secret scanning expectations.

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

## Day 1 — Repository, governance, and application scaffold

### Objectives

- Create the canonical Git workflow and a runnable Next.js 14 + TypeScript baseline aligned with the technical specification.

### Tasks

1. Create or configure the GitHub repository: default branch `main`, description, license, and `README.md` with link to `docs/`.
2. Enable branch protection on `main`: require PR reviews, require status checks, disallow force-push, require linear history if team policy allows.
3. Add issue templates (bug, feature, security) and a PR template referencing security checklist items from `docs/09_security_architecture_review_document.md`.
4. Initialize Next.js 14 App Router + TypeScript + ESLint + Tailwind (per `docs/technical_spec.md`); use `pnpm` as package manager if that matches the documented toolchain.
5. Add `.gitignore`, `.editorconfig`, and `CONTRIBUTING.md` with “no secrets in repo” rule.
6. Add Dependabot (or Renovate) configuration for npm/pnpm and GitHub Actions updates.

### Deliverables

- [ ] Mergeable baseline app runs locally (`pnpm dev`).
- [ ] Branch protection and templates live on GitHub.
- [ ] Dependency update automation configured.

### Tools (free)

GitHub, Node.js LTS, pnpm, ESLint, Cursor/VS Code.

### Dependencies / prerequisites

GitHub organization access; local Node LTS installed.

### Security and quality

- No `.env` with real secrets committed; only `.env.example` with placeholder keys.
- Enable GitHub secret scanning and push protection if available.

### Maintainability

- Document exact Node/pnpm versions in `README.md` to avoid environment drift.

---

## Day 2 — VPS provisioning and host hardening

### Objectives

- Provision the production VPS and apply baseline hardening consistent with the deployment runbook.

### Tasks

1. Create non-root deploy user with SSH key authentication; disable password SSH if policy allows.
2. Apply system updates (`apt update && apt upgrade`).
3. Configure UFW: allow `22`, `80`, `443` only; default deny inbound.
4. Install and configure `fail2ban` for SSH jail (per `docs/deployment_runbook.md`).
5. Install Docker Engine and Docker Compose plugin; add deploy user to `docker` group where appropriate.
6. Record all commands actually used into an internal “as-built” note (or extend runbook) for reproducibility.

### Deliverables

- [ ] SSH access works for deploy user.
- [ ] UFW active with intended rules only.
- [ ] Docker and Compose available on host.

### Tools (free)

Ubuntu 22.04 LTS, UFW, fail2ban, OpenSSH, Docker.

### Dependencies / prerequisites

VPS credentials; DNS may follow on Day 3 (not blocking SSH).

### Security and quality

- Confirm no database or Redis ports are exposed publicly at this stage.

### Maintainability

- Prefer repeatable shell snippets over one-off manual edits; schedule migration to IaC as a post-launch hardening milestone.

---

## Day 3 — DNS, Nginx reverse proxy skeleton, and HTTP routing

### Objectives

- Route the domain to the VPS and terminate HTTP at Nginx with a safe default server and upstream to the app container (or temporary health page).

### Tasks

1. Configure DNS `A`/`AAAA` records for apex and `www` (or documented canonical hostnames from `docs/deployment_runbook.md`).
2. Install Nginx; create site config with upstream to app (stub ok if app not built yet—use static health response).
3. Enforce HTTP→HTTPS redirect once TLS is ready (prepare `return 301` blocks).
4. Configure real client IP forwarding headers if behind Cloudflare (per runbook/security guidance).
5. Smoke test: `curl -I` from local machine shows expected status codes.

### Deliverables

- [ ] DNS resolves to VPS.
- [ ] Nginx serves a deterministic health response or proxies to container.

### Tools (free)

Cloudflare DNS (free tier), Nginx, curl, dig.

### Dependencies / prerequisites

Domain control; Day 2 VPS ready.

### Security and quality

- Disable directory listing; remove default site ambiguity; avoid exposing internal upstream ports externally.

### Maintainability

- Split Nginx config into `include` snippets (TLS, upstream, security headers) for easier review.

---

## Day 4 — TLS certificates and baseline security headers

### Objectives

- Enable HTTPS with auto-renewal and apply first-pass security headers at the edge.

### Tasks

1. Issue certificates via Certbot (HTTP-01) for all required hostnames.
2. Configure TLS modern profile (protocols/ciphers) per `docs/deployment_runbook.md` / `docs/09_security_architecture_review_document.md`.
3. Add baseline headers: `Strict-Transport-Security`, `X-Frame-Options` / frame-ancestors policy direction, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` (start conservative).
4. Configure automated renewal (`certbot renew`) and verify timer/cron.
5. Validate externally using SSL Labs test (document results).

### Deliverables

- [ ] HTTPS works end-to-end.
- [ ] Renewal path verified (dry-run).
- [ ] Header baseline present on default responses.

### Tools (free)

Certbot, Nginx, curl, SSL Labs (browser).

### Dependencies / prerequisites

Day 3 HTTP routing functional.

### Security and quality

- Start CSP in report-only or narrow allowlist if the app is not ready; avoid breaking dev loop—document follow-up in Week 2.

### Maintainability

- Keep header policy in version-controlled Nginx templates, not manual server-only edits.

---

## Day 5 — CI pipeline with security gates

### Objectives

- Ensure every merge is automatically checked for quality and common security issues.

### Tasks

1. Add GitHub Actions workflow: install, lint, typecheck, unit tests, build (all required and passing).
2. Add `pnpm audit` / `npm audit` step with documented policy (fail on critical, warn on high, etc.).
3. Add secret scanning step (e.g., TruffleHog OSS) on pull requests.
4. Mark CI checks as required in branch protection.
5. Add caching for pnpm store to keep CI fast.

### Deliverables

- [ ] CI green on `main` for baseline app.
- [ ] Security scanning stages visible in CI logs.

### Tools (free)

GitHub Actions, pnpm, TruffleHog OSS.

### Dependencies / prerequisites

Repository from Day 1.

### Security and quality

- Fail builds on detected secrets; document rotation procedure if a leak occurs.

### Maintainability

- Keep workflows small and composable (reusable workflow for lint/test/build).

---

## Day 6 — Environment contract and secrets handling

### Objectives

- Define the full environment variable matrix for local/staging/production without storing secrets in git.

### Tasks

1. Create `.env.example` enumerating every variable referenced across `docs/api_reference.md`, `docs/database_schema.md`, `docs/deployment_runbook.md`, and `docs/09_security_architecture_review_document.md` (group by domain: DB, auth, Redis, R2, Turnstile, email, Sentry, analytics).
2. Configure GitHub Environments (`staging`, `production`) with protection rules and secrets.
3. Document secret rotation expectations (what rotates, who owns it, how to validate).
4. Add runtime config validation module stub (Zod) to fail fast on boot in staging/prod.

### Deliverables

- [ ] `.env.example` complete and reviewed.
- [ ] GitHub secrets placeholders documented (names only in repo docs).

### Tools (free)

GitHub Environments/Secrets, dotenv, Zod.

### Dependencies / prerequisites

None beyond prior days.

### Security and quality

- Separate staging vs prod credentials; never reuse production DB URLs in staging.

### Maintainability

- Single schema for env parsing prevents “works on my machine” drift.

---

## Day 7 — Week review, threat model checkpoint, and risk register

### Objectives

- Close Week 1 with explicit sign-off artifacts and a prioritized risk backlog for Week 2.

### Tasks

1. Run a 60–90 minute threat modeling pass using the public/admin boundaries from `docs/09_security_architecture_review_document.md` (assets, adversaries, entry points).
2. Produce a risk register: id, risk, likelihood/impact, mitigation owner, target week.
3. Verify end-to-end: clone → `pnpm i` → `pnpm dev` → CI green for a clean PR.
4. Capture any spec ambiguities discovered (cookie naming, session TTL, enum mismatches) as ADR tickets to resolve before auth/contact go live.

### Deliverables

- [ ] Week 1 demo notes + risk register merged to `docs/` or internal wiki.
- [ ] Agreed Week 2 priorities list.

### Tools (free)

Markdown, Mermaid, GitHub Projects.

### Dependencies / prerequisites

Days 1–6 complete.

### Security and quality

- Confirm branch protection still enforced after any settings changes.

### Maintainability

- Prefer ADRs for security-impacting decisions to preserve audit trail.

---

## V1 Definition of Done (Weekly Gate)

- [ ] All Day 1-Day 7 deliverables are completed with linked evidence (PRs, CI runs, reports).
- [ ] No open P0/P1 defects remain for this week's scope.
- [ ] Security controls introduced this week are implemented, tested, and documented.
- [ ] API/DB/UI contract changes are synchronized with `docs/` (no drift).
- [ ] Automated tests added this week are passing in CI.
- [ ] Rollback/operational notes for this week's changes are documented where applicable.

## Week completion checklist

- [ ] VPS hardened; only intended ports exposed.
- [ ] HTTPS + renewal configured.
- [ ] CI required checks enabled.
- [ ] `.env.example` + secrets handling documented.
- [ ] Risk register created and linked from `docs/implementation-plan/README.md` if desired.
