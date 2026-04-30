# Contributing Guide

## Workflow

1. Create a feature branch from `main`.
2. Open a PR with a linked issue and complete the PR checklist.
3. Keep PRs small and scoped to one concern.

## Required checks before review

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`

## Security requirements

- Never commit real credentials, tokens, or private keys.
- Use `.env.example` placeholders only.
- Validate all inbound API input with Zod.
- Keep API routes under `/api/v1/*` contract.
- If you discover a leaked secret, rotate it immediately and document remediation.

## Documentation contract

When code changes alter behavior, update the matching file in `docs/` in the same PR to avoid contract drift.
