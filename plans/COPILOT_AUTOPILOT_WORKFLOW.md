# Copilot Autopilot Workflow (LifeOS)

## Objective
Use Copilot Chat/autopilot to deliver fast, safe, and verifiable increments.

## Operating Pattern
1. State desired increment clearly (scope + acceptance criteria).
2. Let autopilot implement in one pass.
3. Require verification commands in same pass.
4. Require commit only after green checks.
5. Update tracker docs in `/plans`.

## Prompt Template (Recommended)
"Implement [scope] end-to-end. Include code changes, verification commands, and a single focused commit. Update plans tracker after success."

## Guardrails
- Never skip verification.
- Avoid mega-commits containing unrelated concerns.
- Prefer additive/refactor-safe changes with rollback paths.

## Artifacts to Keep Updated
- `.github/copilot-instructions.md`
- `AGENTS.md`
- `plans/DEVELOPMENT_TRACKER.md`
- `plans/PHASE_BACKLOG.md`
