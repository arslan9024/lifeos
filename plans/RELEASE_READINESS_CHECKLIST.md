# Release Readiness Checklist

## Pre-Merge (Feature Branch -> main)
- [ ] Branch rebased/updated with latest target branch
- [ ] `npm run verify:all` passes locally
- [ ] CI workflow passes on PR
- [ ] No unresolved TODOs for reliability/security on touched code
- [ ] Documentation updated (`README.md` + relevant `plans/*`)

## Pre-Push Main
- [ ] `git status` clean
- [ ] Commit history is meaningful and grouped by increment
- [ ] Tag/notes prepared for major milestone (optional)

## Post-Merge Validation
- [ ] Run `npm run dev`
- [ ] Check:
  - [ ] `GET /api/health`
  - [ ] `GET /api/health/live`
  - [ ] `GET /api/health/ready`
- [ ] Smoke script succeeds: `npm run verify:smoke`

## Rollback Trigger Conditions
- CI failures on main
- Runtime health endpoint regressions
- Broken startup or non-recoverable route errors
