# Phase Backlog

## P0 (Immediate)
- [ ] Implement first production data module (Goals API + client page wiring)
- [ ] Add server contract tests for `/api/legacy` and new feature routes
- [ ] Add frontend loading/error empty-states for API failures

## P1 (Short-term)
- [ ] Add `CONTRIBUTING.md` + PR template
- [ ] Add changelog/release notes format
- [ ] Add optional e2e smoke script for app+api startup and core route hit

## P2 (Mid-term)
- [ ] Introduce persistence layer pattern and migrations policy
- [ ] Add auth/authz scaffolding
- [ ] Add observability hooks (metrics/event logging abstraction)

## Definition of Done for Backlog Items
- Code merged with tests.
- `npm run verify:all` green.
- README/plans updated where behavior changed.
- No regression in health/readiness/smoke flows.
