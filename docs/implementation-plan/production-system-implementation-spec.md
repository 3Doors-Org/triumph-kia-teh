# Production System Implementation Spec (V1)

This is the mandatory implementation baseline for all weekly plans (`week-01` to `week-16`).  
Every weekly task must conform to this spec in addition to day-level tasks.

## 1) Visual System (Non-Negotiable)

Source authorities: `docs/02_design_system_component_library_brief.md`, `docs/ui_screen_design_specs.md`, `docs/04_admin_dashboard_ui_screen_design_specifications.md`, `docs/wireframe_specs.md`, `docs/wf_public_screens_specification.md`, `docs/admin_wireframe_specifications.md`.

### Core color tokens (must be implemented exactly)

- `--color-primary`: `#0E2F2C` (deep midnight teal)
- `--color-accent`: `#C4A164` (antique bronze/gold)
- `--color-background`: `#F9F8F5` (warm off-white, default page background)
- `--color-card`: `#FFFFFF` (card/modal surfaces on light mode)
- `--color-foreground`: near-dark text for body copy on light backgrounds
- `--color-muted-fg`: metadata-only text; never for primary body copy
- `--color-destructive`: error/destructive actions

### Color usage rules

- Never replace page background with pure white globally; use `#F9F8F5`.
- Use accent color for primary attention targets only (CTA, active nav, key highlights).
- Public navbar/footer/hero-dark sections use primary color backgrounds.
- Admin sidebar uses primary tone; admin content area uses warm off-white.
- Maintain documented contrast targets (AA minimum, AAA where documented).

### Typography and spacing rules

- Body text minimum: `16px` at all breakpoints.
- Use documented type scale (`display`, `h1/h2/h3`, body, caption, label).
- Use 8pt spacing grid and tokenized spacing constants only.
- No ad-hoc font sizes or margin values unless added to token set first.

### Component state rules (required)

- Every interactive component must implement: `default`, `hover`, `active`, `focus-visible`, `disabled`, and `loading` where relevant.
- Focus styles must use the documented double-ring/focus token approach.
- Button variants (Primary/Secondary/Ghost/Destructive) must follow tokenized state transitions.
- Inputs must implement accent-border focus states and accessible error states.

## 2) Screen and Layout Coverage (V1 Scope)

### Public screens

The implementation must fully cover all public routes and templates defined in specs and roadmap:

- `/` (Home)
- `/organizations`
- `/organizations/3doors`
- `/organizations/palaverinstitute`
- `/organizations/dewisefoundation`
- `/community-impact`
- `/achievements`
- `/media`
- `/writing`
- `/writing/[slug]`
- `/research`
- `/contact`
- `/about` (required by editorial Tier 1 governance)

### Admin screens (A01-A15)

All screens from `docs/04_admin_dashboard_ui_screen_design_specifications.md` are required:

- A01 Login
- A02 Dashboard
- A03 Writing management
- A04 Writing editor
- A05 Research management
- A06 Community impact management
- A07 Achievements management
- A08 Media appearances management
- A09 Metrics management
- A10 Testimonials management
- A11 Leads management
- A12 Media library/assets
- A13 Exit intent configuration
- A14 Navigation management
- A15 Analytics view

### Layout rules

- Public: consistent top navbar + footer + tokenized section spacing.
- Admin: sidebar + topbar + content panel (`AdminLayout`), role-aware navigation.
- Responsive behavior must match documented breakpoints and collapse behavior.

## 3) Interaction and Flow Fidelity

Source authority: `docs/14_user_interaction_navigation_flow_diagrams.md`.

The system must preserve interaction flow integrity for:

- Flow 01: site-wide navigation
- Flow 02: home interactions
- Flow 03: contact flow (`POST /api/v1/contact`)
- Flow 06: admin auth (`/admin/login`, `/api/v1/auth/login`, `/api/v1/auth/logout`)
- Flow 07: admin publishing workflow
- Flow 08: admin lead management
- Flow 09: exit intent behavior

Required implementation behavior:

- No orphan links or dead CTAs.
- Query params and filter states preserved in URL where specified.
- Contact page must suppress exit-intent trigger per design/system rules.
- Admin access always behind middleware/session checks.

## 4) Motion and Animation Standard

Source authority: `docs/02_design_system_component_library_brief.md`, `docs/ui_screen_design_specs.md`, `docs/analytics_guide.md`.

### Required motion stack

- Framer Motion: component-level transitions/modals/route motion.
- GSAP (+ ScrollTrigger as needed): richer timeline and controlled reveal behaviors.
- CSS transitions: all micro-interactions and state transitions.

### Required motion behavior

- Section reveals on public pages.
- Scroll progress bar on writing detail pages.
- Exit intent modal transitions.
- Card/button hover transitions aligned to tokens.

### Accessibility and performance constraints

- Respect `prefers-reduced-motion` globally.
- No motion that blocks interaction or obscures focus.
- Keep motion within performance budgets; dynamic import heavy animation dependencies.

## 5) Analytics and Instrumentation

Source authority: `docs/analytics_guide.md`, `docs/04_admin_dashboard_ui_screen_design_specifications.md`.

### Required analytics stack

- Plausible CE self-hosted (primary metrics + custom events)
- Microsoft Clarity (behavior diagnostics with privacy controls)
- Admin analytics screen (A15) consuming server-side summaries

### Required events (minimum)

- `contact_form_submitted`
- `scroll_depth_25`
- `scroll_depth_50`
- `scroll_depth_75`
- `scroll_depth_100`
- `exit_intent_shown`
- `exit_intent_cta_click`
- `exit_intent_dismissed`

### Analytics implementation rules

- No duplicate events for one user action.
- Event naming must exactly match event dictionary.
- Analytics scripts and endpoints must not violate CSP.
- No PII in analytics events.

## 6) Security-by-Design (Starts Week 1, continues every week)

Source authority: `docs/09_security_architecture_review_document.md`, `docs/deployment_runbook.md`.

### Mandatory platform controls

- HTTPS everywhere + HSTS preload-capable config
- Security headers: CSP, X-Frame-Options/frame-ancestors policy, nosniff, Referrer-Policy, Permissions-Policy, COOP/CORP as defined
- Strict session cookie posture (HttpOnly, Secure, SameSite=Strict)
- Middleware auth enforcement for `/admin/*`
- RBAC on server for all privileged routes
- Zod validation on all request inputs
- Turnstile + honeypot + rate limiting for contact endpoint
- Upstash rate limiting + auth lockout controls
- Secret scanning + dependency audit in CI

### Data and privacy controls

- No secrets in repo; `.env.example` only.
- Hash IP where documented; do not store unnecessary PII.
- Sentry scrubbing enabled (cookies/authorization/PII redaction).
- Public APIs never expose admin/private fields.

## 7) API and Data Contract Consistency

- Use `/api/v1/*` namespace consistently.
- Contact submit endpoint is `POST /api/v1/contact`.
- Admin login route is `/admin/login`.
- Writing editor route is `/admin/writing/[slug]/edit`.
- Writing source-of-truth content stored as JSONB; sanitized HTML is derived output.

Contract drift is not allowed: when code chooses a canonical enum/limit/policy, docs must be updated in the same change.

## 8) Quality Gates (Release Blocking)

Every weekly completion and final launch requires:

- All week-specific DoD gates passed.
- CI green (lint, typecheck, test, build, security scans).
- Accessibility checks for changed UI.
- Performance checks for changed routes.
- Security checks for changed auth/contact/admin behavior.
- Operational notes and rollback path updated.

## 9) Implementation Rule for Week Files

For each `week-*.md` plan:

- Day-level tasks must explicitly satisfy this spec where relevant.
- If any day-level task conflicts with this spec, this spec takes precedence.
- Missing details must be treated as work to define, implement, test, and document before marking the week complete.
