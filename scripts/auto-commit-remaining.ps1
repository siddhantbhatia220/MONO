# auto-commit-remaining.ps1
# Automates Git commits for remaining files on the next day

Write-Host "Running automated commits for remaining files..."

$filesToCommit = @(
    @{ path = "src/components/layout/Sidebar.tsx"; msg = "Integrate ProjectIcon component inside Sidebar navigation items" },
    @{ path = "src/app/app/page.tsx"; msg = "Integrate ProjectIcon component inside CreateWorkspaceModal and switcher" },
    @{ path = "src/lib/api/controllers/healthController.ts"; msg = "Add healthController to isolate server metadata logic" },
    @{ path = "src/lib/api/controllers/itemsController.ts"; msg = "Add itemsController to isolate mock items data responses" },
    @{ path = "src/lib/api/controllers/workspacesController.ts"; msg = "Add workspacesController to isolate workspace config responses" },
    @{ path = "src/lib/api/services/itemsService.ts"; msg = "Add itemsService containing Phase 1 mock item listings" },
    @{ path = "src/lib/api/services/workspacesService.ts"; msg = "Add workspacesService containing Phase 1 workspace configurations" },
    @{ path = "src/app/api/health/route.ts"; msg = "Refactor health API endpoint to forward to healthController" },
    @{ path = "src/app/api/items/route.ts"; msg = "Refactor items API endpoint to forward to itemsController" },
    @{ path = "src/app/api/workspaces/route.ts"; msg = "Refactor workspaces API endpoint to forward to workspacesController" }
)

foreach ($item in $filesToCommit) {
    if (Test-Path $item.path) {
        $status = git status --porcelain $item.path
        if ($status) {
            Write-Host "Staging and committing: $($item.path)"
            git add $item.path
            git commit -m $item.msg
            Start-Sleep -Seconds 1
        }
    }
}

Write-Host "Automated commits finished successfully."
