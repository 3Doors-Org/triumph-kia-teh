# Implementation Plan Index (From `docs/`)

This plan is derived from the full documentation set in `docs/`, with schedule authority from `docs/project_roadmap.md` and technical/security authority from `docs/technical_spec.md`, `docs/api_reference.md`, `docs/database_schema.md`, `docs/09_security_architecture_review_document.md`, and `docs/deployment_runbook.md`.

## How each weekly document is structured

Every `week-*.md` file contains **Day 1 through Day 7** as separate sections. For each day you will find:

- **Objectives** — what “done” means for that day.
- **Tasks** — ordered, implementation-ready work items (not single-line summaries).
- **Deliverables** — checklists you can mark in PRs/releases.
- **Tools (free)** — default toolchain (GitHub Actions, Docker, Next.js, Playwright, Vitest, etc.).
- **Dependencies / prerequisites** — hard ordering constraints.
- **Security and quality** — threat-, abuse-, and privacy-aware notes (embedded every day, not deferred).
- **Maintainability** — scalability patterns (modular config, typed DTOs, CI gates, ADRs).

Supporting UX and diagram references are pulled from `docs/ui_screen_design_specs.md`, `docs/wf_public_screens_specification.md`, `docs/admin_wireframe_specifications.md`, `docs/14_user_interaction_navigation_flow_diagrams.md`, `docs/exit_intent_system_spec.md`, `docs/analytics_guide.md`, `docs/content_strategy_editorial_governance.md`, and `docs/qa_testing_plan_checklist.md` wherever they affect sequencing.

## Contract drift resolution (required during implementation)

Some pairs of documents still contain **historical enum / limit / cookie naming variants** (for example lead status values, session TTL hours, or login rate-limit numbers). During Weeks 02–08, each implementation PR must **pick one canonical policy** and update the affected `docs/*.md` in the same change set so code, DB migrations, and QA tests do not diverge.

## V1 Launch Strictness Policy

- No “optional”, “defer”, or “waiver” path is accepted for launch-critical scope.
- Every week must close with all Day 1–Day 7 deliverables completed and evidenced in PRs/issues.
- Security controls are treated as release gates, not advisory checks.
- Any unresolved blocker automatically shifts launch date; quality gates are not bypassed.

## Weekly Documents

Start here for execution tracking:

- `v1-execution-tracker.md`
- `production-system-implementation-spec.md` (mandatory production baseline for all weeks)
- `team-assignments/week-01-team-assignment-sheet.md` (team lead + 2 developer ownership and ticket plan)
- `team-assignments/week-02-team-assignment-sheet.md` through `team-assignments/week-16-team-assignment-sheet.md` (weekly team assignment sheets)

1. `week-01-foundation-and-security-baseline.md`
2. `week-02-database-ci-cd-and-core-ui-shell.md`
3. `week-03-public-core-pages-and-contact-foundation.md`
4. `week-04-public-pages-completion-and-conversion-flow.md`
5. `week-05-writing-research-and-impact-implementation.md`
6. `week-06-public-content-depth-and-mvp-readiness.md`
7. `week-07-achievements-media-auth-and-admin-entry.md`
8. `week-08-mvp-launch-and-stabilization.md`
9. `week-09-admin-shell-and-content-cms-core.md`
10. `week-10-admin-crud-expansion-and-assets.md`
11. `week-11-leads-navigation-exit-intent-and-admin-complete.md`
12. `week-12-animation-foundation-and-motion-system.md`
13. `week-13-animation-polish-and-performance-guardrails.md`
14. `week-14-analytics-instrumentation-and-dashboard-insights.md`
15. `week-15-system-hardening-full-qa-and-release-readiness.md`
16. `week-16-full-v1-launch-and-operational-handover.md`

## Cross-Cutting Rules Applied in Every Week

- Build from scratch with secure defaults first (TLS, host hardening, secrets handling, branch protection, CI security checks).
- Use canonical API namespace and routes (`/api/v1/*`, `/admin/login`, `/admin/writing/[slug]/edit`).
- Keep writing content source-of-truth in JSONB with sanitized HTML as derived output.
- Enforce RBAC and validation at server/API boundaries (not only in UI).
- Maintain reproducible delivery: scripted migrations, deterministic deploy, rollback-ready releases.
