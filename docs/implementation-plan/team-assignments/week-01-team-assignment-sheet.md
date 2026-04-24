# Week 01 Team Assignment Sheet (Lead + 2 Developers)

This sheet translates `week-01-foundation-and-security-baseline.md` into clear, non-duplicated ownership for Team Lead, Developer A (Frontend/UI), and Developer B (Backend/Platform).

Use this sheet together with:

- `docs/implementation-plan/week-01-foundation-and-security-baseline.md`
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

- A01 (prep only)

### Route/Page Scope

- /
- /admin/login (bootstrap only)

### API Endpoint Scope

- CI/security pipeline setup (no production APIs yet)


## Day-by-Day Assignment Plan


## Day 1 — Repository, governance, and application scaffold


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/deployment_runbook.md`
- `docs/09_security_architecture_review_document.md`

### Team Lead

- [ ] W01-TL-101: Enable branch protection on `main`: require PR reviews, require status checks, disallow force-push, require linear history if team policy allows.
- [ ] W01-TL-102: Add issue templates (bug, feature, security) and a PR template referencing security checklist items from `docs/09_security_architecture_review_document.md`.
- [ ] W01-TL-103: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W01-A-101: Create or configure the GitHub repository: default branch `main`, description, license, and `README.md` with link to `docs/`.
- [ ] W01-A-102: Initialize Next.js 14 App Router + TypeScript + ESLint + Tailwind (per `docs/technical_spec.md`); use `pnpm` as package manager if that matches the documented toolchain.
- [ ] W01-A-103: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W01-B-101: Add `.gitignore`, `.editorconfig`, and `CONTRIBUTING.md` with “no secrets in repo” rule.
- [ ] W01-B-102: Add Dependabot (or Renovate) configuration for npm/pnpm and GitHub Actions updates.
- [ ] W01-B-103: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 2 — VPS provisioning and host hardening


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/deployment_runbook.md`
- `docs/09_security_architecture_review_document.md`

### Team Lead

- [ ] W01-TL-201: Define measurable acceptance criteria and dependencies for "VPS provisioning and host hardening" before execution starts.
- [ ] W01-TL-202: Review merged output for "VPS provisioning and host hardening" against security, contract, and quality requirements.
- [ ] W01-TL-203: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W01-A-201: Implement the day's required UI/route behaviors for "VPS provisioning and host hardening" with complete interaction states.
- [ ] W01-A-202: Validate responsiveness and accessibility for all updated screens/routes tied to "VPS provisioning and host hardening".
- [ ] W01-A-203: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W01-B-201: Create non-root deploy user with SSH key authentication; disable password SSH if policy allows.
- [ ] W01-B-202: Apply system updates (`apt update && apt upgrade`).
- [ ] W01-B-203: Configure UFW: allow `22`, `80`, `443` only; default deny inbound.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 3 — DNS, Nginx reverse proxy skeleton, and HTTP routing


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/deployment_runbook.md`
- `docs/09_security_architecture_review_document.md`

### Team Lead

- [ ] W01-TL-301: Define measurable acceptance criteria and dependencies for "DNS, Nginx reverse proxy skeleton, and HTTP routing" before execution starts.
- [ ] W01-TL-302: Review merged output for "DNS, Nginx reverse proxy skeleton, and HTTP routing" against security, contract, and quality requirements.
- [ ] W01-TL-303: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W01-A-301: Implement the day's required UI/route behaviors for "DNS, Nginx reverse proxy skeleton, and HTTP routing" with complete interaction states.
- [ ] W01-A-302: Validate responsiveness and accessibility for all updated screens/routes tied to "DNS, Nginx reverse proxy skeleton, and HTTP routing".
- [ ] W01-A-303: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W01-B-301: Configure DNS `A`/`AAAA` records for apex and `www` (or documented canonical hostnames from `docs/deployment_runbook.md`).
- [ ] W01-B-302: Install Nginx; create site config with upstream to app (stub ok if app not built yet—use static health response).
- [ ] W01-B-303: Enforce HTTP→HTTPS redirect once TLS is ready (prepare `return 301` blocks).

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 4 — TLS certificates and baseline security headers


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/deployment_runbook.md`
- `docs/09_security_architecture_review_document.md`

### Team Lead

- [ ] W01-TL-401: Configure TLS modern profile (protocols/ciphers) per `docs/deployment_runbook.md` / `docs/09_security_architecture_review_document.md`.
- [ ] W01-TL-402: Review merged output for "TLS certificates and baseline security headers" against security, contract, and quality requirements.
- [ ] W01-TL-403: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W01-A-401: Issue certificates via Certbot (HTTP-01) for all required hostnames.
- [ ] W01-A-402: Validate responsiveness and accessibility for all updated screens/routes tied to "TLS certificates and baseline security headers".
- [ ] W01-A-403: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W01-B-401: Add baseline headers: `Strict-Transport-Security`, `X-Frame-Options` / frame-ancestors policy direction, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` (start conservative).
- [ ] W01-B-402: Configure automated renewal (`certbot renew`) and verify timer/cron.
- [ ] W01-B-403: Validate externally using SSL Labs test (document results).

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 5 — CI pipeline with security gates


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/deployment_runbook.md`
- `docs/09_security_architecture_review_document.md`

### Team Lead

- [ ] W01-TL-501: Add `pnpm audit` / `npm audit` step with documented policy (fail on critical, warn on high, etc.).
- [ ] W01-TL-502: Review merged output for "CI pipeline with security gates" against security, contract, and quality requirements.
- [ ] W01-TL-503: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W01-A-501: Add GitHub Actions workflow: install, lint, typecheck, unit tests, build (all required and passing).
- [ ] W01-A-502: Validate responsiveness and accessibility for all updated screens/routes tied to "CI pipeline with security gates".
- [ ] W01-A-503: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W01-B-501: Add secret scanning step (e.g., TruffleHog OSS) on pull requests.
- [ ] W01-B-502: Mark CI checks as required in branch protection.
- [ ] W01-B-503: Add caching for pnpm store to keep CI fast.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 6 — Environment contract and secrets handling


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/deployment_runbook.md`
- `docs/09_security_architecture_review_document.md`

### Team Lead

- [ ] W01-TL-601: Create `.env.example` enumerating every variable referenced across `docs/api_reference.md`, `docs/database_schema.md`, `docs/deployment_runbook.md`, and `docs/09_security_architecture_review_document.md` (group by domain: DB, auth, Redis, R2, Turnstile, email, Sentry, analytics).
- [ ] W01-TL-602: Review merged output for "Environment contract and secrets handling" against security, contract, and quality requirements.
- [ ] W01-TL-603: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W01-A-601: Document secret rotation expectations (what rotates, who owns it, how to validate).
- [ ] W01-A-602: Validate responsiveness and accessibility for all updated screens/routes tied to "Environment contract and secrets handling".
- [ ] W01-A-603: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W01-B-601: Configure GitHub Environments (`staging`, `production`) with protection rules and secrets.
- [ ] W01-B-602: Add runtime config validation module stub (Zod) to fail fast on boot in staging/prod.
- [ ] W01-B-603: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 7 — Week review, threat model checkpoint, and risk register


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/deployment_runbook.md`
- `docs/09_security_architecture_review_document.md`

### Team Lead

- [ ] W01-TL-701: Run a 60–90 minute threat modeling pass using the public/admin boundaries from `docs/09_security_architecture_review_document.md` (assets, adversaries, entry points).
- [ ] W01-TL-702: Produce a risk register: id, risk, likelihood/impact, mitigation owner, target week.
- [ ] W01-TL-703: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W01-A-701: Implement the day's required UI/route behaviors for "Week review, threat model checkpoint, and risk register" with complete interaction states.
- [ ] W01-A-702: Validate responsiveness and accessibility for all updated screens/routes tied to "Week review, threat model checkpoint, and risk register".
- [ ] W01-A-703: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W01-B-701: Verify end-to-end: clone → `pnpm i` → `pnpm dev` → CI green for a clean PR.
- [ ] W01-B-702: Capture any spec ambiguities discovered (cookie naming, session TTL, enum mismatches) as ADR tickets to resolve before auth/contact go live.
- [ ] W01-B-703: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

---

## Ticket Import Format (copy into GitHub/Jira)

- **Title:** `[W01][Owner] <ticket-id> - <explicit action + scope>`
- **Labels:** `week-01`, `owner-lead|owner-dev-a|owner-dev-b`, `security|frontend|backend|infra|qa`.
- **Description:** include exact reference documents used, acceptance criteria, and evidence requirements.
- **Definition of Done:** daily deliverable gate + weekly gate must both be satisfied.

---

## Week Sign-off Checklist (Lead)

- [ ] All TL/A/B tickets closed or explicitly carried with owner/date.
- [ ] CI required checks green for merged PRs.
- [ ] Security and contract checks passed for the week scope.
- [ ] Reference-document alignment confirmed for each day.
- [ ] Week status updated in `v1-execution-tracker.md`.
