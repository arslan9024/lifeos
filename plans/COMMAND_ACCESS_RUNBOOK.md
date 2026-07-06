# Command Access Runbook (Chat + PowerShell + VS Code Tasks)

This runbook standardizes direct command execution for LifeOS.

## 1) Run Commands from Chat

Use short, explicit asks in chat, for example:

- "run verify"
- "run dev"
- "run server tests"
- "publish main and tag v0.1.0"

The agent can execute shell commands directly and return output.

## 2) Run Commands in PowerShell

Use the operational helper script:

```powershell
powershell -ExecutionPolicy Bypass -File ./scripts/ops.ps1 status
powershell -ExecutionPolicy Bypass -File ./scripts/ops.ps1 verify
powershell -ExecutionPolicy Bypass -File ./scripts/ops.ps1 dev
powershell -ExecutionPolicy Bypass -File ./scripts/ops.ps1 push
powershell -ExecutionPolicy Bypass -File ./scripts/ops.ps1 tag v0.1.0
powershell -ExecutionPolicy Bypass -File ./scripts/ops.ps1 publish v0.1.0
```

## 3) Run Commands in VS Code Tasks

Use **Terminal → Run Task** and pick one:

- LifeOS: Dev (Client + Server)
- LifeOS: Verify All
- LifeOS: Server Tests
- LifeOS: Build Client
- LifeOS: Smoke Server
- LifeOS: Git Status
- LifeOS: Push Main
- LifeOS: Tag Release
- LifeOS: Publish (Push + Tag)

Tasks are defined in `.vscode/tasks.json`.

## 4) Important Safety Notes

- `push`, `tag`, and `publish` require a clean working tree.
- A git remote must exist (`git remote -v`).
- Use semantic tags (`vX.Y.Z`) to trigger release workflow.

## 5) Previous Push Error Fix

If you accidentally run a combined command like:

```bash
git push -u origin maingit tag v0.1.0
```

Run the commands separately:

```bash
git push -u origin main
git tag v0.1.0
git push origin v0.1.0
```
