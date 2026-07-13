# MONO - Individual File Commits for SEO & Layout Polish
# Each file committed separately with a descriptive commit message

$commits = @(
  @{ f = "src/app/layout.tsx"; m = "Optimize global SEO metadata and inject JSON-LD WebApplication schema" },
  @{ f = "src/app/page.tsx"; m = "Clean up WorkspaceHeader actions, stack onboarding features on mobile, and add floating QuickCapture styling" },
  @{ f = "src/components/items/QuickCapture.tsx"; m = "Remove redundant horizontal padding from QuickCapture container to fix layout alignment" },
  @{ f = "src/components/views/ListView.tsx"; m = "Remove extra horizontal margins from ListView outer wrapper ensuring exact grid alignment" }
)

$success = 0
$skip = 0

foreach ($item in $commits) {
  $status = git status --porcelain $item.f 2>&1
  if ($status) {
    git add $item.f 2>&1 | Out-Null
    $result = git commit -m $item.m 2>&1
    if ($LASTEXITCODE -eq 0) {
      Write-Host "COMMITTED: $($item.f) -> $($item.m)" -ForegroundColor Green
      $success++
    } else {
      Write-Host "ERR $($item.f): $result" -ForegroundColor Red
    }
  } else {
    Write-Host "SKP $($item.f) (not modified)" -ForegroundColor Gray
    $skip++
  }
}

Write-Host "`n=== COMPLETED: $success committed, $skip skipped ===" -ForegroundColor Cyan
