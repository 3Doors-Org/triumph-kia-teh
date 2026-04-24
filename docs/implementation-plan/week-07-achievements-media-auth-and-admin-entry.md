# Week 07 — Public Polish, Auth.js, Admin Middleware, and Secure Admin Entry (A01)

## Week objectives

- Complete any remaining public-site MVP gaps for achievements/media polish if not finished in Week 06.
- Implement authentication and authorization foundations: credentials login, secure cookies, middleware protection for `/admin/*`, admin login UI (A01), logout + session invalidation strategy, and automated security tests.

## Canonical references

- `docs/project_roadmap.md` — Phase 2 auth + MVP dependencies.
- `docs/technical_spec.md` — canonical `/api/v1/auth/*`, `/admin/login`, middleware matcher notes.
- `docs/api_reference.md` — auth endpoints, error shapes, rate limiting notes.
- `docs/09_security_architecture_review_document.md` — cookie properties, lockout, CSRF posture, logging.
- `docs/04_admin_dashboard_ui_screen_design_specifications.md` — Screen A01 requirements.

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

## Day 1 — Public achievements/media polish + performance pass

### Objectives

- Ensure `/achievements` and `/media` meet MVP quality: content density, images, filters, and perf.

### Tasks

1. Resolve UI defects from Week 06 review (spacing, typography, card consistency).
2. Optimize images using Next.js image patterns where applicable; define alt text policy.
3. Validate list endpoints handle pagination growth with mandatory load-more or paginated navigation support.
4. Run Lighthouse on both routes; fix top regressions.
5. Add regression tests for filter edge cases.

### Deliverables

- [ ] Achievements/media pages meet agreed MVP bar (attach checklist).
- [ ] Lighthouse notes recorded.

### Tools (free)

Lighthouse, Playwright, Next.js Image (if adopted).

### Dependencies / prerequisites

Week 06 pages exist.

### Security and quality

- Validate outbound links and media embeds cannot inject scripts.

### Maintainability

- Keep media card component API stable for admin module reuse later.

---

## Day 2 — Auth.js credentials provider + `POST /api/v1/auth/login`

### Objectives

- Implement secure login API with bcrypt verification, generic errors, and lockout hooks per security doc.

### Tasks

1. Configure Auth.js v5 with credentials provider; store sessions in HttpOnly Secure SameSite=Strict cookies.
2. Implement `POST /api/v1/auth/login` using Zod validation for email/password fields.
3. Implement bcrypt compare with documented cost factor; protect against timing leaks where feasible (constant-time compare patterns).
4. Wire Redis lockout counters per IP + per email policy (align numeric policy across docs in the same change set).
5. Add integration tests: valid login, invalid password, locked account path, rate limited path.

### Deliverables

- [ ] Login works in staging for seeded `owner` user.
- [ ] Tests cover primary negative cases.

### Tools (free)

Auth.js, bcrypt, Upstash Redis, Vitest.

### Dependencies / prerequisites

Seeded users table; Redis available in staging.

### Security and quality

- Never return “user not found” vs “bad password” distinctions in responses.

### Maintainability

- Centralize auth error codes in `lib/auth/errors.ts`.

---

## Day 3 — Middleware: protect `/admin/*`, matcher config, and `/admin/login` redirect

### Objectives

- Enforce authentication at the edge for admin UI routes per `docs/technical_spec.md`.

### Tasks

1. Implement `src/middleware.ts` using Auth.js middleware helper; redirect unauthenticated users to `/admin/login`.
2. Validate matcher includes `/admin/:path*` and does not accidentally expose debug routes.
3. Ensure `/admin/login` remains accessible without session.
4. Add tests for middleware behavior using both middleware-focused tests and E2E validation.
5. Document cookie name decision (`next-auth.session-token` vs `__Secure-` prefix) and apply consistently across envs.

### Deliverables

- [ ] Unauthed access to `/admin` routes redirects correctly.
- [ ] Cookie naming policy documented in ADR.

### Tools (free)

Next.js middleware, Playwright.

### Dependencies / prerequisites

Day 2 login creates session.

### Security and quality

- Confirm middleware does not leak sensitive paths in redirects.

### Maintainability

- Keep matcher patterns in one module with comments explaining inclusion/exclusion.

---

## Day 4 — Admin Login screen (A01) + secure UX details

### Objectives

- Ship A01 UI per admin UI spec with accessibility and secure client behaviors.

### Tasks

1. Implement `/admin/login` layout (no admin shell), form fields, and error banner patterns.
2. Add client-side validation mirroring server constraints (length, email format).
3. Implement “show password” toggle with a11y considerations.
4. Wire submit to `POST /api/v1/auth/login`; handle lockout and rate limit messaging safely.
5. Add Playwright tests for A01 flows.

### Deliverables

- [ ] A01 matches spec structure and passes E2E.
- [ ] Accessibility spot-check documented.

### Tools (free)

React, Playwright, axe.

### Dependencies / prerequisites

Middleware + login endpoint.

### Security and quality

- Rate limit login endpoint (reuse generic limiter from contact week).

### Maintainability

- Keep login form isolated from admin shell to prevent bundle coupling.

---

## Day 5 — `POST /api/v1/auth/logout` + Redis token blocklist strategy

### Objectives

- Implement full session teardown consistent with `docs/api_reference.md` / security doc logout behavior.

### Tasks

1. Implement logout route; clear cookies with correct attributes.
2. Add Redis blocklist entry for token id / session id until TTL matches remaining session lifetime.
3. Ensure logout works without CSRF issues under SameSite=Strict + POST-only pattern (document why GET logout is disallowed).
4. Add integration tests verifying cookie cleared and subsequent requests are unauthenticated.
5. Wire admin UI logout action in sidebar (minimal) if time permits; else schedule Week 09.

### Deliverables

- [ ] Logout endpoint verified in staging.
- [ ] Blocklist entries expire correctly (TTL test).

### Tools (free)

Redis CLI / Upstash console, Vitest.

### Dependencies / prerequisites

Login working; Redis available.

### Security and quality

- Validate and enforce Origin/Referer checks on logout POST per security controls.

### Maintainability

- Centralize cookie clearing logic to avoid mismatched attributes.

---

## Day 6 — RBAC enforcement utilities + API guard tests (`owner` vs `editor`)

### Objectives

- Implement reusable `requireRole()` utilities for route handlers and add baseline tests.

### Tasks

1. Implement `requireRole(['owner'])` / `requireRole(['owner','editor'])` helpers used by future admin APIs.
2. Add sample protected internal endpoint (non-prod) or unit-tested handler module demonstrating 401/403 mapping.
3. Add tests proving editor cannot call owner-only operations when endpoints appear in later weeks.
4. Document RBAC matrix excerpt from `docs/api_reference.md` in `README` for engineers.
5. Run security checklist section for authentication controls (manual).

### Deliverables

- [ ] RBAC helper merged with tests.
- [ ] RBAC documentation snippet added.

### Tools (free)

Vitest, TypeScript.

### Dependencies / prerequisites

Auth session includes role claim.

### Security and quality

- Never trust client-sent role; only JWT/session role.

### Maintainability

- Keep RBAC rules close to route handlers but not duplicated across files—use policy map.

---

## Day 7 — Auth security review checkpoint + MVP staging rehearsal

### Objectives

- Formalize sign-off for auth subsystem before MVP launch week.

### Tasks

1. Review cookies in browser devtools: flags, path, expiry; verify in HTTPS staging only.
2. Validate rate limits and lockouts with scripted attempts in a safe test account.
3. Confirm logs/Sentry scrubbing for auth errors.
4. Run MVP staging rehearsal: public browsing + admin login + logout.
5. Produce Week 07 sign-off notes and Week 08 launch checklist.

### Deliverables

- [ ] Auth sign-off document/ticket completed.
- [ ] Week 08 launch tasks ordered (deploy, smoke, monitoring).

### Tools (free)

Browser devtools, curl, Sentry UI.

### Dependencies / prerequisites

Days 1–6 complete.

### Security and quality

- Confirm session cookies never sent to third-party origins (SameSite strict behavior).

### Maintainability

- Capture any remaining spec mismatches (session TTL hours) as tickets with single chosen policy.

---

## V1 Definition of Done (Weekly Gate)

- [ ] All Day 1-Day 7 deliverables are completed with linked evidence (PRs, CI runs, reports).
- [ ] No open P0/P1 defects remain for this week's scope.
- [ ] Security controls introduced this week are implemented, tested, and documented.
- [ ] API/DB/UI contract changes are synchronized with `docs/` (no drift).
- [ ] Automated tests added this week are passing in CI.
- [ ] Rollback/operational notes for this week's changes are documented where applicable.

## Week completion checklist

- [ ] Achievements/media polished for MVP bar.
- [ ] Login/logout + middleware + A01 complete.
- [ ] RBAC helper in place for subsequent admin endpoints.
- [ ] Security review checkpoint completed with evidence.
