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

function Assert-Success {
  param(
    [string]$Step
  )

  if ($LASTEXITCODE -ne 0) {
    throw "Command failed at step: $Step"
  }
}

function Test-LocalTagExists {
  param(
    [string]$TagName
  )

  $tag = git tag -l $TagName
  Assert-Success "check local tag $TagName"
  return -not [string]::IsNullOrWhiteSpace($tag)
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
    Assert-Success "push main"
  }

  'tag' {
    Ensure-Clean-Tree
    Ensure-Remote

    if (Test-LocalTagExists $Version) {
      throw "Tag '$Version' already exists locally."
    }

    git tag $Version
    Assert-Success "create local tag $Version"
    git push origin $Version
    Assert-Success "push tag $Version"
    Write-Host "Tagged and pushed $Version" -ForegroundColor Green
  }

  'publish' {
    Ensure-Clean-Tree
    Ensure-Remote

    git push -u origin main
    Assert-Success "push main"

    if (Test-LocalTagExists $Version) {
      throw "Tag '$Version' already exists locally. Choose another version."
    }

    git tag $Version
    Assert-Success "create local tag $Version"
    git push origin $Version
    Assert-Success "push tag $Version"
    Write-Host "Published main and release tag $Version" -ForegroundColor Green
  }
}
