# LifeOS

Modern full-stack foundation for LifeOS using:
- **Client:** React 19 + Vite + TypeScript
- **Server:** Express
- **Workspace orchestration:** root scripts with `concurrently`

## Project Structure

```text
lifeos/
├─ client/   # Vite + React + TypeScript app
├─ server/   # Express API
└─ package.json  # root scripts to run both apps
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
- Health check: http://localhost:5000/api/health

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

## Environment Variables

See:
- `client/.env.example`
- `server/.env.example`

## Current Status

- CRA leftovers removed
- TypeScript alias updated to TS7-safe form (`paths` with `./src/*`, no `baseUrl`)
- Client build/lint and runtime health verified
