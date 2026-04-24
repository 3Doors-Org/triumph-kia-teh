# Week 07 Team Assignment Sheet (Lead + 2 Developers)

This sheet translates `week-07-achievements-media-auth-and-admin-entry.md` into clear, non-duplicated ownership for Team Lead, Developer A (Frontend/UI), and Developer B (Backend/Platform).

Use this sheet together with:

- `docs/implementation-plan/week-07-achievements-media-auth-and-admin-entry.md`
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

- A01 login and auth entry controls

### Route/Page Scope

- /admin/login
- /admin/* protected entry

### API Endpoint Scope

- POST /api/v1/auth/login
- POST /api/v1/auth/logout
- Admin middleware protection


## Day-by-Day Assignment Plan


## Day 1 — Public achievements/media polish + performance pass


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/api_reference.md`
- `docs/09_security_architecture_review_document.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`

### Team Lead

- [ ] W07-TL-101: Resolve UI defects from Week 06 review (spacing, typography, card consistency).
- [ ] W07-TL-102: Review merged output for "Public achievements/media polish + performance pass" against security, contract, and quality requirements.
- [ ] W07-TL-103: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W07-A-101: Run Lighthouse on both routes; fix top regressions.
- [ ] W07-A-102: Validate responsiveness and accessibility for all updated screens/routes tied to "Public achievements/media polish + performance pass".
- [ ] W07-A-103: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W07-B-101: Optimize images using Next.js image patterns where applicable; define alt text policy.
- [ ] W07-B-102: Validate list endpoints handle pagination growth with mandatory load-more or paginated navigation support.
- [ ] W07-B-103: Add regression tests for filter edge cases.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 2 — Auth.js credentials provider + `POST /api/v1/auth/login`


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/api_reference.md`
- `docs/09_security_architecture_review_document.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`

### Team Lead

- [ ] W07-TL-201: Define measurable acceptance criteria and dependencies for "Auth.js credentials provider + `POST /api/v1/auth/login`" before execution starts.
- [ ] W07-TL-202: Review merged output for "Auth.js credentials provider + `POST /api/v1/auth/login`" against security, contract, and quality requirements.
- [ ] W07-TL-203: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W07-A-201: Implement the day's required UI/route behaviors for "Auth.js credentials provider + `POST /api/v1/auth/login`" with complete interaction states.
- [ ] W07-A-202: Validate responsiveness and accessibility for all updated screens/routes tied to "Auth.js credentials provider + `POST /api/v1/auth/login`".
- [ ] W07-A-203: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W07-B-201: Configure Auth.js v5 with credentials provider; store sessions in HttpOnly Secure SameSite=Strict cookies.
- [ ] W07-B-202: Implement `POST /api/v1/auth/login` using Zod validation for email/password fields.
- [ ] W07-B-203: Implement bcrypt compare with documented cost factor; protect against timing leaks where feasible (constant-time compare patterns).

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 3 — Middleware: protect `/admin/*`, matcher config, and `/admin/login` redirect


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/api_reference.md`
- `docs/09_security_architecture_review_document.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/admin_wireframe_specifications.md`

### Team Lead

- [ ] W07-TL-301: Document cookie name decision (`next-auth.session-token` vs `__Secure-` prefix) and apply consistently across envs.
- [ ] W07-TL-302: Review merged output for "Middleware: protect `/admin/*`, matcher config, and `/admin/login` redirect" against security, contract, and quality requirements.
- [ ] W07-TL-303: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W07-A-301: Implement the day's required UI/route behaviors for "Middleware: protect `/admin/*`, matcher config, and `/admin/login` redirect" with complete interaction states.
- [ ] W07-A-302: Validate responsiveness and accessibility for all updated screens/routes tied to "Middleware: protect `/admin/*`, matcher config, and `/admin/login` redirect".
- [ ] W07-A-303: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W07-B-301: Implement `src/middleware.ts` using Auth.js middleware helper; redirect unauthenticated users to `/admin/login`.
- [ ] W07-B-302: Validate matcher includes `/admin/:path*` and does not accidentally expose debug routes.
- [ ] W07-B-303: Ensure `/admin/login` remains accessible without session.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 4 — Admin Login screen (A01) + secure UX details


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/api_reference.md`
- `docs/09_security_architecture_review_document.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/02_design_system_component_library_brief.md`

### Team Lead

- [ ] W07-TL-401: Define measurable acceptance criteria and dependencies for "Admin Login screen (A01) + secure UX details" before execution starts.
- [ ] W07-TL-402: Review merged output for "Admin Login screen (A01) + secure UX details" against security, contract, and quality requirements.
- [ ] W07-TL-403: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W07-A-401: Implement `/admin/login` layout (no admin shell), form fields, and error banner patterns.
- [ ] W07-A-402: Add client-side validation mirroring server constraints (length, email format).
- [ ] W07-A-403: Implement “show password” toggle with a11y considerations.

### Developer B

- [ ] W07-B-401: Wire submit to `POST /api/v1/auth/login`; handle lockout and rate limit messaging safely.
- [ ] W07-B-402: Add Playwright tests for A01 flows.
- [ ] W07-B-403: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 5 — `POST /api/v1/auth/logout` + Redis token blocklist strategy


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/api_reference.md`
- `docs/09_security_architecture_review_document.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`

### Team Lead

- [ ] W07-TL-501: Define measurable acceptance criteria and dependencies for "`POST /api/v1/auth/logout` + Redis token blocklist strategy" before execution starts.
- [ ] W07-TL-502: Review merged output for "`POST /api/v1/auth/logout` + Redis token blocklist strategy" against security, contract, and quality requirements.
- [ ] W07-TL-503: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W07-A-501: Implement logout route; clear cookies with correct attributes.
- [ ] W07-A-502: Wire admin UI logout action in sidebar (minimal) if time permits; else schedule Week 09.
- [ ] W07-A-503: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W07-B-501: Add Redis blocklist entry for token id / session id until TTL matches remaining session lifetime.
- [ ] W07-B-502: Ensure logout works without CSRF issues under SameSite=Strict + POST-only pattern (document why GET logout is disallowed).
- [ ] W07-B-503: Add integration tests verifying cookie cleared and subsequent requests are unauthenticated.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 6 — RBAC enforcement utilities + API guard tests (`owner` vs `editor`)


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/api_reference.md`
- `docs/09_security_architecture_review_document.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`

### Team Lead

- [ ] W07-TL-601: Run security checklist section for authentication controls (manual).
- [ ] W07-TL-602: Review merged output for "RBAC enforcement utilities + API guard tests (`owner` vs `editor`)" against security, contract, and quality requirements.
- [ ] W07-TL-603: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W07-A-601: Implement the day's required UI/route behaviors for "RBAC enforcement utilities + API guard tests (`owner` vs `editor`)" with complete interaction states.
- [ ] W07-A-602: Validate responsiveness and accessibility for all updated screens/routes tied to "RBAC enforcement utilities + API guard tests (`owner` vs `editor`)".
- [ ] W07-A-603: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W07-B-601: Implement `requireRole(['owner'])` / `requireRole(['owner','editor'])` helpers used by future admin APIs.
- [ ] W07-B-602: Add sample protected internal endpoint (non-prod) or unit-tested handler module demonstrating 401/403 mapping.
- [ ] W07-B-603: Add tests proving editor cannot call owner-only operations when endpoints appear in later weeks.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 7 — Auth security review checkpoint + MVP staging rehearsal


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/api_reference.md`
- `docs/09_security_architecture_review_document.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`

### Team Lead

- [ ] W07-TL-701: Review cookies in browser devtools: flags, path, expiry; verify in HTTPS staging only.
- [ ] W07-TL-702: Produce Week 07 sign-off notes and Week 08 launch checklist.
- [ ] W07-TL-703: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W07-A-701: Implement the day's required UI/route behaviors for "Auth security review checkpoint + MVP staging rehearsal" with complete interaction states.
- [ ] W07-A-702: Validate responsiveness and accessibility for all updated screens/routes tied to "Auth security review checkpoint + MVP staging rehearsal".
- [ ] W07-A-703: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W07-B-701: Validate rate limits and lockouts with scripted attempts in a safe test account.
- [ ] W07-B-702: Confirm logs/Sentry scrubbing for auth errors.
- [ ] W07-B-703: Run MVP staging rehearsal: public browsing + admin login + logout.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

---

## Ticket Import Format (copy into GitHub/Jira)

- **Title:** `[W07][Owner] <ticket-id> - <explicit action + scope>`
- **Labels:** `week-07`, `owner-lead|owner-dev-a|owner-dev-b`, `security|frontend|backend|infra|qa`.
- **Description:** include exact reference documents used, acceptance criteria, and evidence requirements.
- **Definition of Done:** daily deliverable gate + weekly gate must both be satisfied.

---

## Week Sign-off Checklist (Lead)

- [ ] All TL/A/B tickets closed or explicitly carried with owner/date.
- [ ] CI required checks green for merged PRs.
- [ ] Security and contract checks passed for the week scope.
- [ ] Reference-document alignment confirmed for each day.
- [ ] Week status updated in `v1-execution-tracker.md`.
