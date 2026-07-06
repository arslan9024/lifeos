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
| Frontend | Route-level API error presentation + retry pattern | ✅ |
| Backend | CORS/helmet/compression/rate-limit hardening | ✅ |
| Backend | Request IDs + structured errors + lifecycle guards | ✅ |
| Backend | Liveness/readiness + shutdown gate | ✅ |
| Backend | Structured rate-limit errors with requestId | ✅ |
| Testing | Server integration tests (supertest) | ✅ |
| Testing | Added payload-limit + rate-limit integration edge tests | ✅ |
| Testing | Added security middleware header/CORS integration tests | ✅ |
| Tooling | verify scripts + smoke checks + CI workflow | ✅ |
| Tooling | Tag-based release workflow automation | ✅ |
| Docs | Root README updated to current architecture | ✅ |
| Governance | PR/Issue templates + CONTRIBUTING + branch-protection checklist | ✅ |
| Governance | CODEOWNERS + deployment runbook | ✅ |
| Tooling | Direct command access (chat/task/PowerShell) | ✅ |

## Active Workstream
- Operationalize merge/release governance for `main` readiness.

## Next Priority Queue
1. Implement first real persisted feature module (Goals or Tasks).
2. Expand route-level API error pattern to additional data pages as they are added.
3. Expand server tests for lifecycle and proxy-awareness edge behaviors.
4. Enable GitHub branch protection rules in repository settings.

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
- Added `.github/CODEOWNERS` (placeholder owner mapping; replace `@REPO_OWNER`).
- Added `plans/DEPLOYMENT_RUNBOOK.md` for preflight, smoke checks, and rollback steps.
- Added `.vscode/tasks.json` with one-click dev/verify/publish tasks.
- Added `scripts/ops.ps1` for direct operational commands in PowerShell.
- Added `plans/COMMAND_ACCESS_RUNBOOK.md` and linked it from plans index.
- Replaced CODEOWNERS placeholder owner with `@arslan9024`.
- Restored comprehensive `.gitignore` coverage for Node/Vite/TS and env safety.
- Added backend integration tests for JSON body-size and rate-limit edge behavior.
- Rate-limit responses now include stable `code` and `requestId` for traceability.
- Added typed API request errors on client with server `code`/`requestId` support.
- Added reusable `ApiErrorNotice` and applied explicit retry/error UX on `AppHomePage`.
- Added server integration tests for Helmet headers, x-powered-by suppression, and allowed-origin CORS headers.

## Gate Before Merge to Main
- [ ] `git status` clean
- [ ] `npm run verify:all` pass
- [ ] Plans tracker updated
- [ ] PR review checklist completed
