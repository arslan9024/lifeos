# Git Publish Runbook (Main Branch)

Use this runbook to publish the local repository to GitHub and enable protected-main workflow.

## Current Local State

- Local default branch: `main`
- Verification gate: `npm run verify:all`
- Governance files: PR template, issue templates, CONTRIBUTING, branch-protection checklist

## Step 1: Add Remote

```bash
git remote add origin <YOUR_GITHUB_REPO_URL>
```

Examples:

- `https://github.com/<owner>/lifeos.git`
- `git@github.com:<owner>/lifeos.git`

## Step 2: Fetch Remote

```bash
git fetch origin
```

## Step 3: Publish Local Main

If remote has no commits yet:

```bash
git push -u origin main
```

If remote already has history (README/license/etc):

```bash
git pull --rebase origin main
git push -u origin main
```

## Step 4: Protect Main Branch (GitHub UI)

Follow `plans/BRANCH_PROTECTION_CHECKLIST.md` and enforce:

- PR required before merge
- At least 1 approval
- Conversations resolved
- Required check: `CI / verify`
- No force-push, no branch deletion

## Step 5: Create First Release Tag

After merging a stable increment:

```bash
git tag v0.1.0
git push origin v0.1.0
```

This triggers `.github/workflows/release-tag.yml` to run `verify:all` and create a GitHub Release.

## Step 6: Ongoing Team Flow

- Work only on feature/fix/chore branches
- Open PR to `main`
- Require CI green + review approval
- Update `plans/DEVELOPMENT_TRACKER.md` after each session
