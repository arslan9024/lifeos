# Copilot Instructions for LifeOS

## Development Principles
- Keep changes incremental and commit-scoped.
- Prefer readability and maintainability over cleverness.
- Preserve strict TypeScript safety and predictable error handling.

## Required Verification
Before considering any task complete:
1. `npm run verify:all`
2. If server behavior changed, validate health endpoints.
3. Ensure `git status` is clean after commit.

## Backend Conventions
- Use centralized env parsing (`server/src/config/env.js`).
- Return structured JSON errors with stable `code` and `requestId`.
- Keep lifecycle/readiness behaviors intact.

## Frontend Conventions
- Use `@/` path aliases.
- Keep route fallback UX explicit (no silent redirect unless intended).
- Use shared API helper (`client/src/lib/api.ts`) for server calls.

## Documentation Conventions
- Update `README.md` when scripts, architecture, or runbooks change.
- Update `/plans` tracker files after meaningful increments.
