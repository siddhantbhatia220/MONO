# MONO - Final UI/UX Commit Script
# Commit page.tsx and Sidebar.tsx individually

$commits = @(
  @{ f = "src/app/page.tsx"; m = "Redesign onboarding features list as a vertical showcase and elevate floating QuickCapture bottom padding" },
  @{ f = "src/components/layout/Sidebar.tsx"; m = "Increase sidebar footer bottom padding to push settings and shortcuts above the Turbopack dev badge and add mobile backdrop blur" }
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
