# Deployment Runbook (LifeOS)

This runbook defines a safe baseline for deploying LifeOS with rollback readiness.

## 1) Pre-Deployment Gate

Must all be true before deployment:

- `npm run verify:all` passes
- PR approved and merged into `main`
- Release notes prepared (or generated via tag workflow)
- Environment variables reviewed and validated

## 2) Environment Checklist

### Client

- `VITE_API_BASE_URL`
- `VITE_APP_NAME`

### Server

- `PORT`
- `NODE_ENV`
- `CLIENT_ORIGIN`
- `REQUEST_LOGGING`
- `JSON_BODY_LIMIT`
- `SHUTDOWN_TIMEOUT_MS`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX`
- `TRUST_PROXY`
- `COMPRESSION_ENABLED`

## 3) Release Procedure

1. Merge approved PR to `main`
2. Pull latest main locally:
   - `git checkout main`
   - `git pull --rebase origin main`
3. Create tag:
   - `git tag vX.Y.Z`
   - `git push origin vX.Y.Z`
4. Confirm GitHub workflow `.github/workflows/release-tag.yml` passes
5. Confirm GitHub Release created

## 4) Post-Deployment Smoke Checks

Verify:

- `GET /api/health` returns 200 and expected payload
- `GET /api/health/live` returns 200
- `GET /api/health/ready` returns 200
- Client is reachable and renders key routes

## 5) Rollback Procedure

If critical issues are detected:

1. Identify previous stable tag (e.g. `vX.Y.(Z-1)`)
2. Re-deploy previous known-good release artifacts
3. Re-run smoke checks
4. Open incident issue with:
   - impact window
   - root cause hypothesis
   - corrective actions

## 6) Incident Communication Template

- **Status:** Investigating / Mitigating / Resolved
- **Impact:** (user-facing summary)
- **Start Time:**
- **Current Mitigation:**
- **Next Update ETA:**
- **Owner:**

## 7) Operational Ownership

Use `.github/CODEOWNERS` to enforce review routing by area.
