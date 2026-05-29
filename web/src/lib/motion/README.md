# Motion System Guidelines

Use shared utilities from `lib/motion/*` for any new animation work.

## Rules

1. No motion without purpose.
2. Respect `prefers-reduced-motion` in all interactive flows.
3. Do not add magic timing/easing numbers in page components.
4. Keep scroll choreography behind feature flags when rollout risk exists.
5. Avoid animations that delay validation, focus, or auth-critical feedback.

## Allowed entry points

- `MOTION_TOKENS`
- `fadeInUpVariants`
- `staggerChildrenVariants`
- `routeFadeVariants`
- `useReducedMotionPreference`

## Anti-patterns

1. Do not animate height/width/top/left on critical content regions.
2. Do not hide required content until an animation finishes.
3. Do not animate filter forms, auth controls, or submit affordances.
4. Do not add per-page ad hoc easing/timing constants.
5. Do not couple analytics event timing to animation completion.

## Incident rollback

1. Set `NEXT_PUBLIC_ENABLE_SECTION_REVEALS=false` to disable reveal choreography quickly.
2. Keep route transitions simple and short; if regressions appear, reduce to opacity-only variants.
3. Re-run `pnpm --dir web check:bundle-budget` and reduced-motion e2e smoke before re-enabling.
