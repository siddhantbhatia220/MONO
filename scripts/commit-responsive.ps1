# MONO - Individual File Commits for Responsive UX
# Each file committed separately with a descriptive commit message

$commits = @(
  @{ f = "src/lib/hooks/useIsMobile.ts"; m = "Add useIsMobile hook to dynamically detect screen width for responsive layouts" },
  @{ f = "src/components/layout/Sidebar.tsx"; m = "Refactor Sidebar to support collapsible desktop panel and mobile left-drawer overlay" },
  @{ f = "src/app/page.tsx"; m = "Integrate mobile hamburger toggle, useIsMobile state, and safe area layout inside AppShell" },
  @{ f = "src/app/globals.css"; m = "Add safe area padding utility classes and responsive base CSS styling" },
  @{ f = "src/components/ui/Modal.tsx"; m = "Refactor Modal component to slide up as a bottom sheet on mobile screens" },
  @{ f = "src/components/layout/CommandPalette.tsx"; m = "Update CommandPalette to slide from top and scale to full screen on mobile devices" },
  @{ f = "src/components/items/ItemRow.tsx"; m = "Refactor ItemRow to stack metadata underneath the title and show touch targets on mobile viewports" },
  @{ f = "src/components/items/QuickCapture.tsx"; m = "Optimize QuickCapture bar sizing and hide redundant key tips on mobile screens" },
  @{ f = "src/components/views/EmptyState.tsx"; m = "Downscale EmptyState illustrations and improve padding density on mobile screens" }
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
