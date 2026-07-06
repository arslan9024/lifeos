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
└─ package.json            # Root orchestration scripts
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
npm --prefix client run lint
npm --prefix client run build
npm --prefix server test
npm run dev
```

Then check:

- `http://localhost:5000/api/health`
- `http://localhost:5000/api/health/live`
- `http://localhost:5000/api/health/ready`

## Current Status

- Legacy CRA/property leftovers removed
- Client and server are separated and orchestrated from root
- Multi-layer backend hardening implemented and validated
- Route UX upgraded with lazy loading + explicit 404 handling
- Repository is on incremental, verified commit-by-commit workflow
