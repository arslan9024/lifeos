# LifeOS Project Master Plan

## 1) Vision
Build LifeOS as a production-oriented full-stack platform with:
- robust backend reliability/security defaults,
- strict frontend quality gates,
- repeatable local and CI verification,
- incremental, commit-sized delivery.

## 2) Current Foundation Status

### Backend (Implemented)
- Centralized env config (`server/src/config/env.js`)
- Security stack: `helmet`, CORS allowlist, rate limiting, compression
- Request traceability: `x-request-id`
- Structured error model (`ApiError`, classified responses)
- Health endpoints: `/api/health`, `/live`, `/ready`
- Graceful shutdown + lifecycle guards
- Shutdown gate (503 for non-health during drain)

### Frontend (Implemented)
- React 19 + Vite + TS strict setup
- TS7-safe aliasing (`@/* -> ./src/*`)
- Route-level lazy loading
- Explicit 404 pages by route space
- Global `ErrorBoundary` recovery UI

### Tooling/Quality (Implemented)
- Root scripts for dev/build/lint/test/verify
- Server integration tests with `supertest`
- Health-check and smoke scripts in `/scripts`
- CI workflow in `.github/workflows/ci.yml`

## 3) Delivery Phases

### Phase A — Foundation Hardening (DONE)
- Server middleware hardening
- Routing and UX hardening
- Verification scripts

### Phase B — Feature Baseline (NEXT)
- Define real domain entities and API contracts
- Add first persisted module (e.g., Goals/Tasks)
- Add client-side API service layer patterns and typed contracts

### Phase C — Quality Expansion
- More integration tests (server routes)
- Client tests for route guards and recovery UX
- Optional E2E smoke flows

### Phase D — Release Operations
- PR templates and branch protections
- Environment-specific deployment checks
- Rollback/runbook docs

## 4) Non-Negotiable Standards
- No unverified merges.
- Every increment must pass `npm run verify:all`.
- Every backend endpoint must return structured error JSON on failure.
- Every production-impacting change must be represented in tracking docs.
