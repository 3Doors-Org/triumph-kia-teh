# Week 12 Team Assignment Sheet (Lead + 2 Developers)

This sheet translates `week-12-animation-foundation-and-motion-system.md` into clear, non-duplicated ownership for Team Lead, Developer A (Frontend/UI), and Developer B (Backend/Platform).

Use this sheet together with:

- `docs/implementation-plan/week-12-animation-foundation-and-motion-system.md`
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

- Motion system applied across public and selected admin states

### Route/Page Scope

- All public pages motion baseline
- Admin micro-interaction surfaces

### API Endpoint Scope

- No new core API; enforce performance and accessibility gates on existing surfaces


## Day-by-Day Assignment Plan


## Day 1 — Motion architecture decision + dependency wiring


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/02_design_system_component_library_brief.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/ui_screen_design_specs.md`

### Team Lead

- [ ] W12-TL-101: Define measurable acceptance criteria and dependencies for "Motion architecture decision + dependency wiring" before execution starts.
- [ ] W12-TL-102: Review merged output for "Motion architecture decision + dependency wiring" against security, contract, and quality requirements.
- [ ] W12-TL-103: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W12-A-101: Document motion architecture ADR: page transitions (Framer), scroll choreography (GSAP), reduced-motion behavior.
- [ ] W12-A-102: Add dynamic imports for heavy animation modules in public routes only (avoid admin unless spec requires).
- [ ] W12-A-103: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W12-B-101: Add dependencies with explicit versions; enable tree-shaking-friendly imports.
- [ ] W12-B-102: Add bundle size check step in CI (warn thresholds).
- [ ] W12-B-103: Establish performance budget numbers from technical spec (record in CI config).

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 2 — Global motion primitives: `MotionProvider`, variants, and reduced-motion gate


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/02_design_system_component_library_brief.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/ui_screen_design_specs.md`

### Team Lead

- [ ] W12-TL-201: Define measurable acceptance criteria and dependencies for "Global motion primitives: `MotionProvider`, variants, and reduced-motion gate" before execution starts.
- [ ] W12-TL-202: Review merged output for "Global motion primitives: `MotionProvider`, variants, and reduced-motion gate" against security, contract, and quality requirements.
- [ ] W12-TL-203: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W12-A-201: Implement `useReducedMotion` hook and apply globally in layout.
- [ ] W12-A-202: Create standard variants: `fadeInUp`, `staggerChildren`, `routeFade`.
- [ ] W12-A-203: Document developer guidelines: “no motion without purpose”.

### Developer B

- [ ] W12-B-201: Add unit tests for variant factories (snapshot of resolved durations/easing).
- [ ] W12-B-202: Ensure focus management is not broken by animations (especially modals).
- [ ] W12-B-203: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 3 — Section reveal pattern using IntersectionObserver + GSAP timelines


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/02_design_system_component_library_brief.md`
- `docs/qa_testing_plan_checklist.md`

### Team Lead

- [ ] W12-TL-301: Define measurable acceptance criteria and dependencies for "Section reveal pattern using IntersectionObserver + GSAP timelines" before execution starts.
- [ ] W12-TL-302: Review merged output for "Section reveal pattern using IntersectionObserver + GSAP timelines" against security, contract, and quality requirements.
- [ ] W12-TL-303: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W12-A-301: Build `useSectionReveal` hook with IO thresholds tuned per design spec.
- [ ] W12-A-302: Implement GSAP timeline creation/teardown to avoid memory leaks on route changes.
- [ ] W12-A-303: Measure CLS and LCP impact; adjust transforms (`will-change` sparingly).

### Developer B

- [ ] W12-B-301: Apply pattern to 1–2 pilot sections on Home only.
- [ ] W12-B-302: Execute validation/integration/security checks for services changed by "Section reveal pattern using IntersectionObserver + GSAP timelines".
- [ ] W12-B-303: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 4 — Page transition choreography between major routes


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/02_design_system_component_library_brief.md`
- `docs/qa_testing_plan_checklist.md`

### Team Lead

- [ ] W12-TL-401: Define measurable acceptance criteria and dependencies for "Page transition choreography between major routes" before execution starts.
- [ ] W12-TL-402: Review merged output for "Page transition choreography between major routes" against security, contract, and quality requirements.
- [ ] W12-TL-403: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W12-A-401: Implement shared layout transitions for public route group using Framer Motion layout animations (scoped).
- [ ] W12-A-402: Add fallback: instant navigation if reduced motion.
- [ ] W12-A-403: Add E2E checks for navigation still completing under timeout.

### Developer B

- [ ] W12-B-401: Ensure transitions do not delay interactive elements becoming clickable.
- [ ] W12-B-402: Execute validation/integration/security checks for services changed by "Page transition choreography between major routes".
- [ ] W12-B-403: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 5 — Admin micro-interactions (non-blocking)


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/02_design_system_component_library_brief.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/04_admin_dashboard_ui_screen_design_specifications.md`
- `docs/admin_wireframe_specifications.md`

### Team Lead

- [ ] W12-TL-501: Define measurable acceptance criteria and dependencies for "Admin micro-interactions (non-blocking)" before execution starts.
- [ ] W12-TL-502: Review merged output for "Admin micro-interactions (non-blocking)" against security, contract, and quality requirements.
- [ ] W12-TL-503: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W12-A-501: Implement save status indicator on CMS forms (saving/saved/error).
- [ ] W12-A-502: Add modal transitions for confirm delete dialogs.
- [ ] W12-A-503: Ensure animations do not obscure validation errors.

### Developer B

- [ ] W12-B-501: Implement backend/platform work required for "Admin micro-interactions (non-blocking)" (API/data/infra/security).
- [ ] W12-B-502: Execute validation/integration/security checks for services changed by "Admin micro-interactions (non-blocking)".
- [ ] W12-B-503: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 6 — Performance profiling + bundle optimization pass


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/02_design_system_component_library_brief.md`
- `docs/qa_testing_plan_checklist.md`

### Team Lead

- [ ] W12-TL-601: Define measurable acceptance criteria and dependencies for "Performance profiling + bundle optimization pass" before execution starts.
- [ ] W12-TL-602: Review merged output for "Performance profiling + bundle optimization pass" against security, contract, and quality requirements.
- [ ] W12-TL-603: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W12-A-601: Profile longest tasks on Home with animations enabled.
- [ ] W12-A-602: Tune image decoding/loading interactions with animations (avoid animating large images).
- [ ] W12-A-603: Address top 5 performance findings.

### Developer B

- [ ] W12-B-601: Split heavy GSAP plugins only if imported; remove unused plugins.
- [ ] W12-B-602: Update CI Lighthouse thresholds (warn/fail) accordingly.
- [ ] W12-B-603: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 7 — Week review, animation QA checklist, Week 13 polish backlog


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/02_design_system_component_library_brief.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/ui_screen_design_specs.md`

### Team Lead

- [ ] W12-TL-701: Run animation QA checklist: keyboard, screen reader spot checks, reduced motion.
- [ ] W12-TL-702: Groom Week 13: roll reveals across all public pages + perf guardrails.
- [ ] W12-TL-703: Security review: dependency additions, supply chain notes.

### Developer A

- [ ] W12-A-701: Triage defects; ensure no P0 a11y regressions.
- [ ] W12-A-702: Tag staging release for animation baseline.
- [ ] W12-A-703: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W12-B-701: Implement backend/platform work required for "Week review, animation QA checklist, Week 13 polish backlog" (API/data/infra/security).
- [ ] W12-B-702: Execute validation/integration/security checks for services changed by "Week review, animation QA checklist, Week 13 polish backlog".
- [ ] W12-B-703: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

---

## Ticket Import Format (copy into GitHub/Jira)

- **Title:** `[W12][Owner] <ticket-id> - <explicit action + scope>`
- **Labels:** `week-12`, `owner-lead|owner-dev-a|owner-dev-b`, `security|frontend|backend|infra|qa`.
- **Description:** include exact reference documents used, acceptance criteria, and evidence requirements.
- **Definition of Done:** daily deliverable gate + weekly gate must both be satisfied.

---

## Week Sign-off Checklist (Lead)

- [ ] All TL/A/B tickets closed or explicitly carried with owner/date.
- [ ] CI required checks green for merged PRs.
- [ ] Security and contract checks passed for the week scope.
- [ ] Reference-document alignment confirmed for each day.
- [ ] Week status updated in `v1-execution-tracker.md`.
