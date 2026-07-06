# Branch Protection Checklist (main)

Use this checklist when configuring repository branch protection for `main`.

## Required Settings

- [ ] Require a pull request before merging
- [ ] Require at least 1 approving review
- [ ] Dismiss stale approvals when new commits are pushed
- [ ] Require conversation resolution before merging
- [ ] Require status checks to pass before merging
- [ ] Require branches to be up to date before merging
- [ ] Restrict force pushes
- [ ] Restrict branch deletion

## Required Status Checks

- [ ] `CI / verify` (from `.github/workflows/ci.yml`)

## Recommended Optional Settings

- [ ] Require signed commits
- [ ] Require linear history
- [ ] Lock branch after release windows (optional policy)

## Operational Rules

- [ ] All PRs include completed template checklist
- [ ] `npm run verify:all` evidence attached in PR summary
- [ ] README/plans updates included for architecture/process changes
- [ ] High-risk changes include rollback steps

## Owner Sign-off

- Platform Owner: __________________
- Date: ____________________________
- Notes: ___________________________
