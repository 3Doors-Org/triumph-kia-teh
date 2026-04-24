# Week 13 Team Assignment Sheet (Lead + 2 Developers)

This sheet translates `week-13-animation-polish-and-performance-guardrails.md` into clear, non-duplicated ownership for Team Lead, Developer A (Frontend/UI), and Developer B (Backend/Platform).

Use this sheet together with:

- `docs/implementation-plan/week-13-animation-polish-and-performance-guardrails.md`
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

- Cross-screen transition and reveal fidelity pass

### Route/Page Scope

- All public pages with final animation polish

### API Endpoint Scope

- No new core API; CI performance/a11y enforcement across existing APIs


## Day-by-Day Assignment Plan


## Day 1 — Roll out `<RevealSection>` across all MVP public routes


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/02_design_system_component_library_brief.md`

### Team Lead

- [ ] W13-TL-101: Add visual QA checklist per page.
- [ ] W13-TL-102: Commit in page batches to simplify review.
- [ ] W13-TL-103: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W13-A-101: Inventory all public pages from Week 06 route list; add reveal wrapper to eligible sections per design guidance.
- [ ] W13-A-102: Ensure each page has a “no motion” path that still reads well (layout does not depend on animation for meaning).
- [ ] W13-A-103: Add content-driven exceptions (e.g., dense tables) where animation is inappropriate.

### Developer B

- [ ] W13-B-101: Implement backend/platform work required for "Roll out `<RevealSection>` across all MVP public routes" (API/data/infra/security).
- [ ] W13-B-102: Execute validation/integration/security checks for services changed by "Roll out `<RevealSection>` across all MVP public routes".
- [ ] W13-B-103: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 2 — Hero and above-the-fold motion refinement + LCP protection


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/02_design_system_component_library_brief.md`
- `docs/ui_screen_design_specs.md`

### Team Lead

- [ ] W13-TL-201: Audit hero animations for LCP element (text/image); remove/transform animations that delay LCP.
- [ ] W13-TL-202: Review merged output for "Hero and above-the-fold motion refinement + LCP protection" against security, contract, and quality requirements.
- [ ] W13-TL-203: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W13-A-201: Measure LCP before/after on Home and one heavy page.
- [ ] W13-A-202: Validate responsiveness and accessibility for all updated screens/routes tied to "Hero and above-the-fold motion refinement + LCP protection".
- [ ] W13-A-203: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W13-B-201: Prefer opacity/transform animations only; avoid layout-affecting properties.
- [ ] W13-B-202: Tune image priority attributes (`priority`) where appropriate.
- [ ] W13-B-203: Document LCP budget outcomes.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 3 — Mobile and low-end device profiles + adaptive animation intensity


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/02_design_system_component_library_brief.md`
- `docs/ui_screen_design_specs.md`

### Team Lead

- [ ] W13-TL-301: Update docs for motion policy decisions.
- [ ] W13-TL-302: Review merged output for "Mobile and low-end device profiles + adaptive animation intensity" against security, contract, and quality requirements.
- [ ] W13-TL-303: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W13-A-301: Add reduced-intensity motion mode using non-invasive heuristics and breakpoint-safe defaults aligned with privacy stance.
- [ ] W13-A-302: Fix overflow issues introduced by transforms.
- [ ] W13-A-303: Validate tap targets remain >= 44px after animations.

### Developer B

- [ ] W13-B-301: Test iPhone and mid-tier Android profiles in Playwright device matrix.
- [ ] W13-B-302: Execute validation/integration/security checks for services changed by "Mobile and low-end device profiles + adaptive animation intensity".
- [ ] W13-B-303: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 4 — Code splitting audit for GSAP/Framer + route-level lazy motion


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/02_design_system_component_library_brief.md`
- `docs/ui_screen_design_specs.md`
- `docs/09_security_architecture_review_document.md`

### Team Lead

- [ ] W13-TL-401: Add CI bundle diff reporting.
- [ ] W13-TL-402: Review merged output for "Code splitting audit for GSAP/Framer + route-level lazy motion" against security, contract, and quality requirements.
- [ ] W13-TL-403: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W13-A-401: Add route-level dynamic imports for motion-heavy sections where feasible.
- [ ] W13-A-402: Verify server components remain default; client-only boundaries minimal.
- [ ] W13-A-403: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W13-B-401: Identify largest chunks; ensure GSAP plugins are imported narrowly.
- [ ] W13-B-402: Fix any accidental client bundling of server-only libraries.
- [ ] W13-B-403: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 5 — Lighthouse CI on representative routes + perf budget enforcement


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/02_design_system_component_library_brief.md`

### Team Lead

- [ ] W13-TL-501: Define measurable acceptance criteria and dependencies for "Lighthouse CI on representative routes + perf budget enforcement" before execution starts.
- [ ] W13-TL-502: Review merged output for "Lighthouse CI on representative routes + perf budget enforcement" against security, contract, and quality requirements.
- [ ] W13-TL-503: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W13-A-501: Set thresholds for Performance/Best Practices/SEO per roadmap intent (document chosen gates).
- [ ] W13-A-502: Validate responsiveness and accessibility for all updated screens/routes tied to "Lighthouse CI on representative routes + perf budget enforcement".
- [ ] W13-A-503: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W13-B-501: Add Lighthouse CI config for `/`, `/writing`, `/contact`, `/community-impact` (representative mix).
- [ ] W13-B-502: Tune until CI stable on runner hardware; record variance mitigation (median of N runs).
- [ ] W13-B-503: Fix top regressions.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 6 — Accessibility regression focused on motion (focus, screen reader, reduced motion)


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/02_design_system_component_library_brief.md`
- `docs/ui_screen_design_specs.md`

### Team Lead

- [ ] W13-TL-601: Define measurable acceptance criteria and dependencies for "Accessibility regression focused on motion (focus, screen reader, reduced motion)" before execution starts.
- [ ] W13-TL-602: Review merged output for "Accessibility regression focused on motion (focus, screen reader, reduced motion)" against security, contract, and quality requirements.
- [ ] W13-TL-603: Record completion evidence, decisions, and blocker resolution in the execution tracker.

### Developer A

- [ ] W13-A-601: Run axe scans on all public pages with animations enabled.
- [ ] W13-A-602: Manual screen reader spot check on Home + Contact + Writing post.
- [ ] W13-A-603: Verify reduced-motion disables non-essential animations completely.

### Developer B

- [ ] W13-B-601: Fix focus traps and ESC behavior for any animated overlays.
- [ ] W13-B-602: Document remaining known issues with owners.
- [ ] W13-B-603: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

## Day 7 — Phase 4 sign-off, freeze animation scope, prep Week 14 analytics


### Day Reference Documents

- `docs/implementation-plan/production-system-implementation-spec.md`
- `docs/implementation-plan/v1-execution-tracker.md`
- `docs/project_roadmap.md`
- `docs/technical_spec.md`
- `docs/qa_testing_plan_checklist.md`
- `docs/02_design_system_component_library_brief.md`
- `docs/ui_screen_design_specs.md`
- `docs/analytics_guide.md`

### Team Lead

- [ ] W13-TL-701: Stakeholder review of motion intensity (institutional tone).
- [ ] W13-TL-702: Scope freeze for animation tweaks post-V1 (only bugfixes).
- [ ] W13-TL-703: Groom Week 14: Plausible events, Clarity, custom scroll depth, admin analytics.

### Developer A

- [ ] W13-A-701: Implement the day's required UI/route behaviors for "Phase 4 sign-off, freeze animation scope, prep Week 14 analytics" with complete interaction states.
- [ ] W13-A-702: Validate responsiveness and accessibility for all updated screens/routes tied to "Phase 4 sign-off, freeze animation scope, prep Week 14 analytics".
- [ ] W13-A-703: Attach visual + test evidence demonstrating implemented UI behavior.

### Developer B

- [ ] W13-B-701: Tag release candidate after green CI.
- [ ] W13-B-702: Execute validation/integration/security checks for services changed by "Phase 4 sign-off, freeze animation scope, prep Week 14 analytics".
- [ ] W13-B-703: Attach CI/log/runbook evidence and confirm `/api/v1/*` contract consistency.

Deliverable gate:

- [ ] Day deliverables completed with evidence links in tracker.
- [ ] No unresolved blocker remains for downstream day execution.

---

## Ticket Import Format (copy into GitHub/Jira)

- **Title:** `[W13][Owner] <ticket-id> - <explicit action + scope>`
- **Labels:** `week-13`, `owner-lead|owner-dev-a|owner-dev-b`, `security|frontend|backend|infra|qa`.
- **Description:** include exact reference documents used, acceptance criteria, and evidence requirements.
- **Definition of Done:** daily deliverable gate + weekly gate must both be satisfied.

---

## Week Sign-off Checklist (Lead)

- [ ] All TL/A/B tickets closed or explicitly carried with owner/date.
- [ ] CI required checks green for merged PRs.
- [ ] Security and contract checks passed for the week scope.
- [ ] Reference-document alignment confirmed for each day.
- [ ] Week status updated in `v1-execution-tracker.md`.
