# Week 13 — Full Animation Suite Across Public Pages + Performance Guardrails

## Week objectives

- Complete Phase 4 animation scope from `docs/project_roadmap.md` / Sprint 7 language: section scroll reveals across **all public pages**, refined motion choreography, and performance guardrails so animation work does not compromise Lighthouse targets.
- Prepare the codebase for analytics week by keeping custom event hooks stable.

## Canonical references

- `docs/project_roadmap.md` — animation suite completion milestone.
- `docs/technical_spec.md` — performance budgets, dynamic imports, animation libraries.
- `docs/qa_testing_plan_checklist.md` — Lighthouse and accessibility expectations (full pass intensifies Week 15–16).
- `docs/02_design_system_component_library_brief.md` — motion system details.

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

## Day 1 — Roll out `<RevealSection>` across all MVP public routes

### Objectives

- Apply standardized reveals consistently; remove one-off animations.

### Tasks

1. Inventory all public pages from Week 06 route list; add reveal wrapper to eligible sections per design guidance.
2. Ensure each page has a “no motion” path that still reads well (layout does not depend on animation for meaning).
3. Add content-driven exceptions (e.g., dense tables) where animation is inappropriate.
4. Add visual QA checklist per page.
5. Commit in page batches to simplify review.

### Deliverables

- [ ] All public pages use consistent reveal pattern where applicable.

### Tools (free)

Playwright screenshots, manual QA.

### Dependencies / prerequisites

Week 12 pilot hook stable.

### Security and quality

- Avoid animating elements containing user-generated content until sanitized render path verified.

### Maintainability

- Centralize per-page “animation manifest” config to disable sections quickly.

---

## Day 2 — Hero and above-the-fold motion refinement + LCP protection

### Objectives

- Improve hero motion without regressing LCP.

### Tasks

1. Audit hero animations for LCP element (text/image); remove/transform animations that delay LCP.
2. Prefer opacity/transform animations only; avoid layout-affecting properties.
3. Tune image priority attributes (`priority`) where appropriate.
4. Measure LCP before/after on Home and one heavy page.
5. Document LCP budget outcomes.

### Deliverables

- [ ] LCP meets agreed threshold on pilot pages (document numbers).

### Tools (free)

Lighthouse, Web Vitals extension.

### Dependencies / prerequisites

Day 1 rollout started.

### Security and quality

- Ensure hero CTA remains keyboard accessible during animation.

### Maintainability

- Keep hero animation config in one file per page type.

---

## Day 3 — Mobile and low-end device profiles + adaptive animation intensity

### Objectives

- Reduce motion intensity on smaller screens or slower CPUs if metrics indicate jank.

### Tasks

1. Add reduced-intensity motion mode using non-invasive heuristics and breakpoint-safe defaults aligned with privacy stance.
2. Test iPhone and mid-tier Android profiles in Playwright device matrix.
3. Fix overflow issues introduced by transforms.
4. Validate tap targets remain >= 44px after animations.
5. Update docs for motion policy decisions.

### Deliverables

- [ ] Mobile animation QA notes with issues resolved.

### Tools (free)

Playwright devices, BrowserStack-free alternatives (local devices preferred).

### Dependencies / prerequisites

Day 1–2 changes merged.

### Security and quality

- Do not fingerprint users aggressively; if using device signals, document and minimize.

### Maintainability

- Prefer coarse heuristics over persistent identifiers.

---

## Day 4 — Code splitting audit for GSAP/Framer + route-level lazy motion

### Objectives

- Keep JS payload controlled as animation coverage grows.

### Tasks

1. Identify largest chunks; ensure GSAP plugins are imported narrowly.
2. Add route-level dynamic imports for motion-heavy sections where feasible.
3. Verify server components remain default; client-only boundaries minimal.
4. Add CI bundle diff reporting.
5. Fix any accidental client bundling of server-only libraries.

### Deliverables

- [ ] Bundle report shows acceptable delta vs Week 12 baseline.

### Tools (free)

Next.js analyzer, `next build` output.

### Dependencies / prerequisites

Animation suite integrated.

### Security and quality

- Ensure dynamic imports do not expose internal modules via client graph.

### Maintainability

- Enforce eslint rules for client/server import boundaries if configured.

---

## Day 5 — Lighthouse CI on representative routes + perf budget enforcement

### Objectives

- Turn performance budgets into enforced CI signals (warn now, fail later if policy requires).

### Tasks

1. Add Lighthouse CI config for `/`, `/writing`, `/contact`, `/community-impact` (representative mix).
2. Set thresholds for Performance/Best Practices/SEO per roadmap intent (document chosen gates).
3. Tune until CI stable on runner hardware; record variance mitigation (median of N runs).
4. Fix top regressions.
5. Document false-positive handling.

### Deliverables

- [ ] Lighthouse CI job green on `main` (or nightly with trend tracking—document).

### Tools (free)

Lighthouse CI, GitHub Actions.

### Dependencies / prerequisites

Staging stable URL for CI.

### Security and quality

- Ensure Lighthouse runs against HTTPS staging with valid certs.

### Maintainability

- Keep LHCI config versioned and reviewed like code.

---

## Day 6 — Accessibility regression focused on motion (focus, screen reader, reduced motion)

### Objectives

- Ensure animations do not break WCAG expectations referenced across docs.

### Tasks

1. Run axe scans on all public pages with animations enabled.
2. Manual screen reader spot check on Home + Contact + Writing post.
3. Verify reduced-motion disables non-essential animations completely.
4. Fix focus traps and ESC behavior for any animated overlays.
5. Document remaining known issues with owners.

### Deliverables

- [ ] A11y motion regression notes with zero P0 issues.

### Tools (free)

axe, VoiceOver/NVDA (free).

### Dependencies / prerequisites

Lighthouse/perf acceptable.

### Security and quality

- Ensure animated modals still enforce keyboard security (no hidden focus).

### Maintainability

- Add a11y checks to Playwright smoke suite for critical pages.

---

## Day 7 — Phase 4 sign-off, freeze animation scope, prep Week 14 analytics

### Objectives

- Close animation milestone and stabilize for analytics instrumentation.

### Tasks

1. Stakeholder review of motion intensity (institutional tone).
2. Scope freeze for animation tweaks post-V1 (only bugfixes).
3. Groom Week 14: Plausible events, Clarity, custom scroll depth, admin analytics.
4. Update risk register: perf, a11y, dependency weight.
5. Tag release candidate after green CI.

### Deliverables

- [ ] Phase 4 sign-off + Week 14 tickets ready.

### Tools (free)

GitHub Releases, Markdown.

### Dependencies / prerequisites

Days 1–6 complete.

### Security and quality

- Re-run `pnpm audit` after any last-minute animation dependency bumps.

### Maintainability

- Capture “how to disable animations” in runbook for incidents.

---

## V1 Definition of Done (Weekly Gate)

- [ ] All Day 1-Day 7 deliverables are completed with linked evidence (PRs, CI runs, reports).
- [ ] No open P0/P1 defects remain for this week's scope.
- [ ] Security controls introduced this week are implemented, tested, and documented.
- [ ] API/DB/UI contract changes are synchronized with `docs/` (no drift).
- [ ] Automated tests added this week are passing in CI.
- [ ] Rollback/operational notes for this week's changes are documented where applicable.

## Week completion checklist

- [ ] Animation suite applied across public pages with guardrails
- [ ] Lighthouse CI and/or documented perf evidence updated
- [ ] Accessibility motion regression addressed
- [ ] Phase 4 sign-off completed
