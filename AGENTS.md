# AGENTS: LifeOS Agent Roles & Workflow

This file defines practical agent roles for structured autopilot execution.

## Roles

### 1) Implementer Agent
- Builds/refactors code for one scoped increment.
- Must include tests/verification and a clean commit.

### 2) Verifier Agent
- Runs `verify:all` and endpoint checks.
- Confirms no regressions and reports concrete pass/fail outputs.

### 3) Documentation Agent
- Updates `README.md` and `/plans` tracking files.
- Keeps operational commands and architecture docs current.

## Standard Increment Protocol
1. **Plan**: declare scope and acceptance criteria.
2. **Implement**: edit minimal necessary files.
3. **Verify**: run required scripts/tests.
4. **Document**: update plans/docs as needed.
5. **Commit**: one focused message.

## Definition of Complete
- All requested work implemented.
- `npm run verify:all` passes.
- Docs/tracker updated.
- Repo clean after commit.
