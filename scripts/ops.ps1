param(
  [Parameter(Position = 0)]
  [ValidateSet('status','verify','dev','push','tag','publish')]
  [string]$Action = 'status',

  [Parameter(Position = 1)]
  [string]$Version = 'v0.1.0'
)

$ErrorActionPreference = 'Stop'

function Ensure-Clean-Tree {
  $changes = git status --porcelain
  if ($changes) {
    throw "Working tree is not clean. Commit/stash changes before running '$Action'."
  }
}

function Ensure-Remote {
  $remote = git remote
  if (-not $remote) {
    throw "No git remote configured. Add origin first: git remote add origin <URL>"
  }
}

switch ($Action) {
  'status' {
    git status --short
    git branch --show-current
    git remote -v
  }

  'verify' {
    npm run verify:all
  }

  'dev' {
    npm run dev
  }

  'push' {
    Ensure-Clean-Tree
    Ensure-Remote
    git push -u origin main
  }

  'tag' {
    Ensure-Clean-Tree
    Ensure-Remote

    if (git rev-parse $Version 2>$null) {
      throw "Tag '$Version' already exists locally."
    }

    git tag $Version
    git push origin $Version
    Write-Host "Tagged and pushed $Version" -ForegroundColor Green
  }

  'publish' {
    Ensure-Clean-Tree
    Ensure-Remote

    git push -u origin main

    if (git rev-parse $Version 2>$null) {
      throw "Tag '$Version' already exists locally. Choose another version."
    }

    git tag $Version
    git push origin $Version
    Write-Host "Published main and release tag $Version" -ForegroundColor Green
  }
}
