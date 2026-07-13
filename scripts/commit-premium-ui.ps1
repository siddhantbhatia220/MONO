# MONO - Individual File Commits for Premium UI/UX Polish
# Each file committed separately with a descriptive commit message

$commits = @(
  @{ f = "src/styles/tokens.css"; m = "Redefine monochrome scale tokens using premium Zinc and Obsidian Carbon values" },
  @{ f = "src/components/layout/ThemeProvider.tsx"; m = "Synchronize document dark class with data-theme attribute resolving Tailwind dark mode selector matching" },
  @{ f = "src/components/ui/Button.tsx"; m = "Refactor button sizes to use explicit vertical padding preventing browser layout squeezing" },
  @{ f = "src/components/ui/Checkbox.tsx"; m = "Unify Checkbox with Zinc scale borders and fix invisible dark mode checkmark stroke" },
  @{ f = "src/components/ui/Input.tsx"; m = "Polish Input component colors to Zinc scale and replace thick ring outlines with sleek one-pixel states" },
  @{ f = "src/components/ui/Modal.tsx"; m = "Update Modal colors, headings, and background shadows to follow premium Zinc scale variables" },
  @{ f = "src/components/views/EmptyState.tsx"; m = "Enhance EmptyState illustration contrast and headings for perfect visibility in dark mode" },
  @{ f = "src/components/views/ListView.tsx"; m = "Update skeleton loading animation colors to Zinc scale for premium contrast consistency" },
  @{ f = "src/components/layout/Sidebar.tsx"; m = "Re-color collapsible sidebar panels and navigations using theme Zinc variables" },
  @{ f = "src/components/layout/CommandPalette.tsx"; m = "Polish CommandPalette query input and result option backgrounds with Zinc borders" },
  @{ f = "src/components/items/QuickCapture.tsx"; m = "Convert QuickCapture container to a premium glassmorphic floating panel" },
  @{ f = "src/app/page.tsx"; m = "Redesign OnboardingScreen layout into card wrapper and apply premium Zinc theme variables to main workspace shell" }
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

# The remaining ItemRow.tsx commit
$status = git status --porcelain src/components/items/ItemRow.tsx 2>&1
if ($status) {
  git add src/components/items/ItemRow.tsx 2>&1 | Out-Null
  git commit -m "Replace hardcoded colors in ItemRow list items with theme Zinc variables for consistent high contrast" 2>&1 | Out-Null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "COMMITTED: src/components/items/ItemRow.tsx" -ForegroundColor Green
    $success++
  }
}

Write-Host "`n=== COMPLETED: $success committed, $skip skipped ===" -ForegroundColor Cyan
