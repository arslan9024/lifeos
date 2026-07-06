# Development Tracker

## Snapshot
- Date: 2026-07-06
- Branch: `main`
- Verification baseline: `npm run verify:all` required
- Status: Foundation hardened and automation-enabled

## Completed Increments

| Area | Increment | Status |
|---|---|---|
| Frontend | CRA cleanup + TS7-safe pathing | ✅ |
| Frontend | Lazy routing + explicit 404 pages | ✅ |
| Frontend | Global error boundary | ✅ |
| Backend | CORS/helmet/compression/rate-limit hardening | ✅ |
| Backend | Request IDs + structured errors + lifecycle guards | ✅ |
| Backend | Liveness/readiness + shutdown gate | ✅ |
| Testing | Server integration tests (supertest) | ✅ |
| Tooling | verify scripts + smoke checks + CI workflow | ✅ |
| Tooling | Tag-based release workflow automation | ✅ |
| Docs | Root README updated to current architecture | ✅ |
| Governance | PR/Issue templates + CONTRIBUTING + branch-protection checklist | ✅ |

## Active Workstream
- Operationalize merge/release governance for `main` readiness.

## Next Priority Queue
1. Implement first real persisted feature module (Goals or Tasks).
2. Add route-level API error presentation patterns on client.
3. Expand server tests for rate-limiter and payload limit edges.
4. Add CODEOWNERS and environment-specific deployment runbook.

## Verification Record (latest)
- `verify:client`: pass
- `test:server`: pass
- `verify:smoke`: pass (after Windows spawn fix)

## Session Update (2026-07-06)
- Added PR template and issue templates for standardized intake/review.
- Added `CONTRIBUTING.md` with branch/verification expectations.
- Added `release-tag.yml` for tag-triggered GitHub Releases with `verify:all` gate.
- Added `plans/BRANCH_PROTECTION_CHECKLIST.md` and linked it from plans index.
- Renamed local default branch from `master` to `main`.
- Added `plans/GIT_PUBLISH_RUNBOOK.md` for remote setup and publish sequence.

## Gate Before Merge to Main
- [ ] `git status` clean
- [ ] `npm run verify:all` pass
- [ ] Plans tracker updated
- [ ] PR review checklist completed
