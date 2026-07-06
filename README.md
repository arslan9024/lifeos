# LifeOS

Production-oriented full-stack foundation for LifeOS.

- **Client:** React 19 + Vite + TypeScript (strict)
- **Server:** Express with security, lifecycle, and operations middleware
- **Workspace orchestration:** root scripts using `concurrently`

## Project Structure

```text
lifeos/
├─ client/                 # Vite + React + TypeScript app shell
│  ├─ src/routes/          # Route map and lazy route wiring
│  ├─ src/pages/           # Landing, app home, coming soon, not-found pages
│  └─ src/lib/api.ts       # Env-aware API helper
├─ server/                 # Express API
│  ├─ src/config/env.js    # Centralized env parsing/validation
│  ├─ src/errors/          # API error types
│  ├─ src/middleware/      # Request context, security, error handling
│  └─ src/routes/          # Health and legacy route modules
├─ scripts/                # Health and smoke verification utilities
├─ plans/                  # Master plans, trackers, backlog, release checklists
├─ AGENTS.md               # Agent-role workflow conventions
└─ .github/copilot-instructions.md # Repo-specific Copilot guidance
```

## Prerequisites

- Node.js 20+
- npm 10+

## Quick Start

From repository root:

```bash
npm install
npm --prefix client install
npm --prefix server install
```

Create local env files from examples:

```bash
copy client\.env.example client\.env
copy server\.env.example server\.env
```

Run both apps:

```bash
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:5000

## Scripts

### Root

- `npm run dev` — run client + server concurrently
- `npm run dev:client` — run only client
- `npm run dev:server` — run only server
- `npm run build` — build client
- `npm run lint` — lint client source
- `npm run verify:smoke` — start server and run automated health smoke checks
- `npm run verify:all` — run client verification + server tests + smoke checks

### Client

- `npm --prefix client run dev`
- `npm --prefix client run build`
- `npm --prefix client run lint`
- `npm --prefix client run format`

### Server

- `npm --prefix server run dev`
- `npm --prefix server run start`
- `npm --prefix server test`
- `npm --prefix server run test:watch`

## API Health & Ops Endpoints

- `GET /api/health` — service health + environment + uptime + shutdown state
- `GET /api/health/live` — liveness probe
- `GET /api/health/ready` — readiness probe (returns 503 during shutdown)
- `GET /api/legacy` — isolated legacy sandbox route

## Implemented Server Hardening

- Security headers via `helmet`
- CORS allowlist with env-configured origins
- Request body size limit (`JSON_BODY_LIMIT`)
- Request context middleware with `x-request-id`
- Structured error pipeline with `ApiError`
- Graceful shutdown (`SIGINT`/`SIGTERM`) + crash guards
- Shutdown gate returning `503` for non-health routes during drain
- API rate limiting (`express-rate-limit`)
- Compression toggle (`compression`)
- Proxy awareness toggle (`trust proxy`)

## Implemented Client Hardening

- Migrated from legacy CRA runtime to Vite + TypeScript
- TS7-safe path aliasing (`@/* -> ./src/*`, no deprecated `baseUrl`)
- Env-aware API utility (`VITE_API_BASE_URL` with local proxy fallback)
- Route-level lazy loading with `Suspense`
- Explicit not-found pages for public, app, and legacy route spaces
- Global React error boundary with recovery actions

## Environment Variables

### Client (`client/.env`)

- `VITE_API_BASE_URL` — optional direct API origin
- `VITE_APP_NAME` — client app label

### Server (`server/.env`)

- `PORT` — API port
- `NODE_ENV` — environment name
- `CLIENT_ORIGIN` — comma-separated CORS origin allowlist
- `REQUEST_LOGGING` — request log override (`true`/`false`)
- `JSON_BODY_LIMIT` — JSON payload limit (e.g., `1mb`)
- `SHUTDOWN_TIMEOUT_MS` — graceful shutdown timeout
- `RATE_LIMIT_WINDOW_MS` — rate-limit window in milliseconds
- `RATE_LIMIT_MAX` — max requests per IP in window
- `TRUST_PROXY` — enable reverse-proxy trust
- `COMPRESSION_ENABLED` — toggle response compression

## Verification Commands

```bash
npm run verify:all
npm run dev
```

Then check:

- `http://localhost:5000/api/health`
- `http://localhost:5000/api/health/live`
- `http://localhost:5000/api/health/ready`

## CI/CD

- GitHub Actions workflow: `.github/workflows/ci.yml`
- Triggers on push and pull request
- Runs `npm run verify:all` on Ubuntu with Node 20
- GitHub Actions release workflow: `.github/workflows/release-tag.yml`
- Tag-based releases on `v*.*.*` with automated release notes

## Planning & Tracking System

All execution planning artifacts now live in `/plans`:

- `plans/INDEX.md`
- `plans/PROJECT_MASTER_PLAN.md`
- `plans/DEVELOPMENT_TRACKER.md`
- `plans/PHASE_BACKLOG.md`
- `plans/RELEASE_READINESS_CHECKLIST.md`
- `plans/COPILOT_AUTOPILOT_WORKFLOW.md`
- `plans/BRANCH_PROTECTION_CHECKLIST.md`
- `plans/GIT_PUBLISH_RUNBOOK.md`
- `plans/DEPLOYMENT_RUNBOOK.md`

Use `DEVELOPMENT_TRACKER.md` as the live status file after every session.

## Copilot Efficiency Setup

- `.github/copilot-instructions.md` — coding/verification rules for Copilot
- `.github/instructions/*.instructions.md` — scoped frontend/backend guidance
- `AGENTS.md` — role-based autopilot workflow for implementation/verifier/docs
- `.github/pull_request_template.md` — standardized PR quality/verification checklist
- `.github/ISSUE_TEMPLATE/*` — structured bug report and feature request intake
- `.github/CODEOWNERS` — area-based default code review ownership
- `CONTRIBUTING.md` — branching model and contribution workflow

## Direct Command Access

- VS Code tasks configured in `.vscode/tasks.json`
- PowerShell helper available at `scripts/ops.ps1`
- Usage guide: `plans/COMMAND_ACCESS_RUNBOOK.md`

## Current Status

- Legacy CRA/property leftovers removed
- Client and server are separated and orchestrated from root
- Multi-layer backend hardening implemented and validated
- Route UX upgraded with lazy loading + explicit 404 handling
- Repository is on incremental, verified commit-by-commit workflow
