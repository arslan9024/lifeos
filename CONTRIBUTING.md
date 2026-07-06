# Contributing to LifeOS

Thank you for contributing to LifeOS.

## Branching Model

- Default protected branch: `main` (recommended)
- Work on focused feature/fix branches:
  - `feat/<scope>`
  - `fix/<scope>`
  - `chore/<scope>`

## Development Workflow

1. Sync latest base:
   - `git checkout main`
   - `git pull --rebase origin main`
2. Create branch:
   - `git checkout -b feat/<your-scope>`
3. Implement one scoped increment.
4. Verify locally:
   - `npm run verify:all`
   - If behavior changed: `npm run dev` and verify health endpoints.
5. Update docs when needed:
   - `README.md` for scripts/architecture/runbook changes.
   - `plans/DEVELOPMENT_TRACKER.md` for meaningful increments.
6. Commit with clear message (conventional style preferred).
7. Open PR using `.github/pull_request_template.md`.

## Quality Requirements

A change is complete only when all are true:

- `npm run verify:all` passes
- No breaking behavior unless explicitly documented
- Relevant docs updated
- PR checklist completed

## Commit Message Guidance

Recommended format:

- `feat(<scope>): add <capability>`
- `fix(<scope>): resolve <issue>`
- `chore(<scope>): update <tooling/docs>`

Examples:

- `feat(server): add readiness-gated shutdown handling`
- `fix(client): prevent route fallback crash on unknown paths`
- `chore(ci): enforce verify-all in pull requests`

## Review Expectations

Please include in PR description:

- What changed and why
- Risks and rollback plan
- Validation evidence (commands + outcomes)
