# Week 12 — Animation Foundation, Motion System, and Accessibility-Safe Motion

## Week objectives

- Begin Phase 4 from `docs/project_roadmap.md`: establish animation infrastructure (Framer Motion + GSAP as specified in `docs/technical_spec.md`), shared motion tokens from `docs/02_design_system_component_library_brief.md`, and accessibility-safe motion defaults (`prefers-reduced-motion`).
- Prepare the codebase for section reveals and page transitions without blowing performance budgets.

## Canonical references

- `docs/project_roadmap.md` — Phase 4 sequencing (after core pages/admin completion).
- `docs/technical_spec.md` — animation libraries, performance budgets, dynamic imports.
- `docs/02_design_system_component_library_brief.md` — motion timing/easing tokens.
- `docs/qa_testing_plan_checklist.md` — performance and accessibility checks relevant to motion.

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

## Day 1 — Motion architecture decision + dependency wiring

### Objectives

- Lock implementation approach: where Framer Motion vs GSAP is used, lazy loading strategy, and folder structure.

### Tasks

1. Document motion architecture ADR: page transitions (Framer), scroll choreography (GSAP), reduced-motion behavior.
2. Add dependencies with explicit versions; enable tree-shaking-friendly imports.
3. Add dynamic imports for heavy animation modules in public routes only (avoid admin unless spec requires).
4. Add bundle size check step in CI (warn thresholds).
5. Establish performance budget numbers from technical spec (record in CI config).

### Deliverables

- [ ] ADR merged + CI bundle warning configured.

### Tools (free)

webpack-bundle-analyzer, GitHub Actions, TypeScript.

### Dependencies / prerequisites

Public pages stable (Weeks 03–08).

### Security and quality

- Review third-party script integrity if any CDN usage (prefer npm packages).

### Maintainability

- Keep `lib/motion/*` as the only import path for animation primitives.

---

## Day 2 — Global motion primitives: `MotionProvider`, variants, and reduced-motion gate

### Objectives

- Implement reusable motion utilities and a hard gate for reduced motion users.

### Tasks

1. Implement `useReducedMotion` hook and apply globally in layout.
2. Create standard variants: `fadeInUp`, `staggerChildren`, `routeFade`.
3. Add unit tests for variant factories (snapshot of resolved durations/easing).
4. Ensure focus management is not broken by animations (especially modals).
5. Document developer guidelines: “no motion without purpose”.

### Deliverables

- [ ] Motion primitives merged and documented.

### Tools (free)

Framer Motion APIs, Vitest.

### Dependencies / prerequisites

Day 1 ADR approved.

### Security and quality

- Avoid `autoPlay` infinite animations that can cause CPU abuse and accessibility issues.

### Maintainability

- Centralize durations/easing constants; forbid magic numbers in pages.

---

## Day 3 — Section reveal pattern using IntersectionObserver + GSAP timelines

### Objectives

- Implement the first standardized scroll reveal pattern aligned with roadmap Sprint 7 language (“IntersectionObserver + fadeInUp”).

### Tasks

1. Build `useSectionReveal` hook with IO thresholds tuned per design spec.
2. Implement GSAP timeline creation/teardown to avoid memory leaks on route changes.
3. Apply pattern to 1–2 pilot sections on Home only.
4. Measure CLS and LCP impact; adjust transforms (`will-change` sparingly).
5. Add feature flag to disable reveals quickly in production if needed.

### Deliverables

- [ ] Pilot reveals shipped behind flag or enabled on staging.

### Tools (free)

Chrome Performance panel, Lighthouse.

### Dependencies / prerequisites

Day 2 primitives.

### Security and quality

- Ensure IO callbacks cannot be triggered excessively by DOM thrash; debounce where needed.

### Maintainability

- One hook + one wrapper component (`<RevealSection>`) reused sitewide later.

---

## Day 4 — Page transition choreography between major routes

### Objectives

- Add subtle transitions for route changes without harming navigation speed.

### Tasks

1. Implement shared layout transitions for public route group using Framer Motion layout animations (scoped).
2. Ensure transitions do not delay interactive elements becoming clickable.
3. Add fallback: instant navigation if reduced motion.
4. Add E2E checks for navigation still completing under timeout.
5. Document known limitations for long pages.

### Deliverables

- [ ] Route transitions working on staging subset.

### Tools (free)

Playwright, Framer Motion.

### Dependencies / prerequisites

Stable layouts from design system.

### Security and quality

- Confirm transitions do not interfere with focus outlines.

### Maintainability

- Keep transitions in layout files, not duplicated per page.

---

## Day 5 — Admin micro-interactions (non-blocking)

### Objectives

- Add polish to admin UX: save states, toasts, modal transitions—without impacting security-sensitive flows.

### Tasks

1. Implement save status indicator on CMS forms (saving/saved/error).
2. Add modal transitions for confirm delete dialogs.
3. Ensure animations do not obscure validation errors.
4. Add reduced-motion support in admin too.
5. Add quick a11y regression pass for admin modals.

### Deliverables

- [ ] Admin micro-interactions merged with low risk.

### Tools (free)

Radix Dialog, Framer Motion.

### Dependencies / prerequisites

Admin modules stable (Week 11).

### Security and quality

- Do not animate sensitive values (tokens, passwords).

### Maintainability

- Keep admin motion minimal to reduce maintenance surface.

---

## Day 6 — Performance profiling + bundle optimization pass

### Objectives

- Quantify animation cost and enforce budgets.

### Tasks

1. Profile longest tasks on Home with animations enabled.
2. Split heavy GSAP plugins only if imported; remove unused plugins.
3. Tune image decoding/loading interactions with animations (avoid animating large images).
4. Address top 5 performance findings.
5. Update CI Lighthouse thresholds (warn/fail) accordingly.

### Deliverables

- [ ] Perf report attached; budgets updated.

### Tools (free)

Lighthouse CI, Chrome profiler.

### Dependencies / prerequisites

Days 1–5 integrated.

### Security and quality

- Ensure animation does not block main thread long enough to harm interaction security UX (timeouts).

### Maintainability

- Store perf artifacts in CI for trend tracking.

---

## Day 7 — Week review, animation QA checklist, Week 13 polish backlog

### Objectives

- Stabilize Week 12 and define Week 13 polish scope across all public pages.

### Tasks

1. Run animation QA checklist: keyboard, screen reader spot checks, reduced motion.
2. Triage defects; ensure no P0 a11y regressions.
3. Groom Week 13: roll reveals across all public pages + perf guardrails.
4. Security review: dependency additions, supply chain notes.
5. Tag staging release for animation baseline.

### Deliverables

- [ ] Week 12 sign-off + Week 13 backlog.

### Tools (free)

GitHub Issues, Markdown checklist.

### Dependencies / prerequisites

Day 6 perf acceptable.

### Security and quality

- Re-run `pnpm audit` after dependency changes.

### Maintainability

- Document how to disable animations quickly in incident response.

---

## V1 Definition of Done (Weekly Gate)

- [ ] All Day 1-Day 7 deliverables are completed with linked evidence (PRs, CI runs, reports).
- [ ] No open P0/P1 defects remain for this week's scope.
- [ ] Security controls introduced this week are implemented, tested, and documented.
- [ ] API/DB/UI contract changes are synchronized with `docs/` (no drift).
- [ ] Automated tests added this week are passing in CI.
- [ ] Rollback/operational notes for this week's changes are documented where applicable.

## Week completion checklist

- [ ] Motion architecture ADR + primitives merged.
- [ ] Pilot scroll reveals + route transitions implemented with reduced-motion support.
- [ ] Performance profiling completed with CI budget updates
- [ ] Week 13 plan ready
