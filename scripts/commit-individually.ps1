# MONO - Individual File Commit Script
# Each file gets its own meaningful commit message

$commits = @(
  @{ f = ".gitignore"; m = "Configure .gitignore with production-grade ignore patterns for Node, Next.js, and environment files" },
  @{ f = ".env.example"; m = "Document all environment variables with descriptions and phase annotations in .env.example" },
  @{ f = "package.json"; m = "Configure package.json with Phase 1 dependencies: Framer Motion, Zustand, idb, nanoid, date-fns, lucide-react" },
  @{ f = "package-lock.json"; m = "Lock Phase 1 dependency tree for reproducible installs" },
  @{ f = "tsconfig.json"; m = "Enable TypeScript strict mode and configure path alias mapping @/* to ./src/*" },
  @{ f = "next.config.ts"; m = "Configure Next.js with security headers, Turbopack, image optimization, and console removal in production" },
  @{ f = ".prettierrc"; m = "Establish Prettier formatting rules for consistent code style across the codebase" },
  @{ f = "src/styles/tokens.css"; m = "Build the MONO design token system: pure monochrome palette, typography scale, spacing, shadows, motion tokens" },
  @{ f = "src/app/globals.css"; m = "Implement global CSS reset, Tailwind v4 import, and base layout utilities for the app shell" },
  @{ f = "src/lib/types/item.ts"; m = "Define the universal Item domain model: Task, Note, Goal, Event, Habit, Bookmark, Checklist all share one type" },
  @{ f = "src/lib/types/workspace.ts"; m = "Define Workspace, Project, and UserPreferences types with input helpers for CRUD operations" },
  @{ f = "src/lib/types/index.ts"; m = "Export all domain types from a single barrel for clean imports throughout the codebase" },
  @{ f = "src/lib/db/index.ts"; m = "Initialize IndexedDB with typed schema, versioned migrations, and preferences CRUD via the idb library" },
  @{ f = "src/lib/db/items.ts"; m = "Implement full Item CRUD: create, list with filtering, update, complete, restore, reorder, archive, delete, search" },
  @{ f = "src/lib/db/workspaces.ts"; m = "Implement Workspace and Project CRUD with cascade deletion and sort-order management" },
  @{ f = "src/lib/store/appStore.ts"; m = "Create the AppStore managing active workspace, active project, user preferences, and resolved theme with localStorage persistence" },
  @{ f = "src/lib/store/itemStore.ts"; m = "Create the ItemStore with in-memory item cache, optimistic updates, and 50-state undo/redo history" },
  @{ f = "src/lib/store/uiStore.ts"; m = "Create the UIStore managing command palette, sidebar, modals, toasts, and loading states" },
  @{ f = "src/lib/utils/id.ts"; m = "Add ID generation utility using nanoid for URL-safe unique identifiers" },
  @{ f = "src/lib/utils/date.ts"; m = "Add date utilities: human-friendly formatting, overdue detection, relative time, and date-fns re-exports" },
  @{ f = "src/lib/utils/keyboard.ts"; m = "Build the keyboard shortcut registry with Mac and Windows label generation and keyboard event matching" },
  @{ f = "src/components/ui/Button.tsx"; m = "Build the Button component with four monochrome variants, three sizes, loading state, and spring press animation" },
  @{ f = "src/components/ui/Checkbox.tsx"; m = "Build the Checkbox component with an animated SVG path-draw checkmark animation on completion" },
  @{ f = "src/components/ui/Input.tsx"; m = "Build the Input component with label, error, hint, icons, clear button, and full ARIA annotation" },
  @{ f = "src/components/ui/Modal.tsx"; m = "Build the Modal component with focus trapping, backdrop blur, body scroll lock, and spring animation" },
  @{ f = "src/components/ui/Badge.tsx"; m = "Build the Badge component for priority, status, and tags using monochrome visual weight hierarchy" },
  @{ f = "src/components/ui/Tooltip.tsx"; m = "Build the Tooltip component with position variants, keyboard shortcut display, and hover/focus trigger" },
  @{ f = "src/components/ui/index.ts"; m = "Export all UI primitives from a single barrel: Button, Checkbox, Input, Modal, Badge, Tooltip" },
  @{ f = "src/components/layout/ThemeProvider.tsx"; m = "Add ThemeProvider that resolves system/light/dark preference and applies data-theme without flash on load" },
  @{ f = "src/components/layout/Sidebar.tsx"; m = "Build the collapsible Sidebar with spring-animated width, workspace navigation, project list, and footer actions" },
  @{ f = "src/components/layout/CommandPalette.tsx"; m = "Build the Command Palette with grouped results, fuzzy match highlighting, arrow-key navigation, and spring animation" },
  @{ f = "src/components/items/ItemRow.tsx"; m = "Build the ItemRow with animated layout, checkbox, priority badge, due date, tags, and hover action buttons" },
  @{ f = "src/components/items/QuickCapture.tsx"; m = "Build the Quick Capture bar with inline hash-tag and priority parsing, N shortcut, and animated focus state" },
  @{ f = "src/components/views/EmptyState.tsx"; m = "Build hand-crafted monochrome animated SVG empty state illustrations for no-items, no-workspace, and no-results" },
  @{ f = "src/components/views/ListView.tsx"; m = "Build the List View with loading skeleton, animated item list, empty states, and live ItemStore subscription" },
  @{ f = "src/app/layout.tsx"; m = "Implement the root layout as a Server Component with Inter via next/font, SEO metadata, and ThemeProvider" },
  @{ f = "src/app/page.tsx"; m = "Implement the main application page with three-step onboarding, app shell, workspace header, and global keyboard shortcuts" },
  @{ f = "LICENSE"; m = "Add MIT license for open-source distribution" },
  @{ f = "README.md"; m = "Write the project README with features, tech stack, roadmap, installation guide, and folder structure" },
  @{ f = "CONTRIBUTING.md"; m = "Document contribution guidelines with engineering standards, commit conventions, and PR process" },
  @{ f = "SECURITY.md"; m = "Document the security policy with vulnerability reporting process and backend security standards" },
  @{ f = "CHANGELOG.md"; m = "Initialize the changelog documenting all Phase 1 additions following Keep a Changelog format" },
  @{ f = "CODE_OF_CONDUCT.md"; m = "Add Contributor Covenant 2.1 Code of Conduct for the project community" },
  @{ f = "docs/ARCHITECTURE.md"; m = "Document the system architecture with diagrams for data flow, domain model, component tree, and Phase 3 target" },
  @{ f = "docs/DESIGN_SYSTEM.md"; m = "Document the complete design system: monochrome palette, typography scale, spacing, motion tokens, and accessibility" },
  @{ f = ".github/workflows/ci.yml"; m = "Add GitHub Actions CI pipeline running TypeScript check, ESLint, Prettier, and production build on every push and PR" },
  @{ f = ".github/ISSUE_TEMPLATE/bug_report.md"; m = "Add bug report issue template with reproduction steps and environment fields" },
  @{ f = ".github/ISSUE_TEMPLATE/feature_request.md"; m = "Add feature request issue template with phase classification and problem statement" },
  @{ f = ".github/PULL_REQUEST_TEMPLATE.md"; m = "Add PR template with engineering quality checklist covering types, lint, build, dark mode, and accessibility" },
  @{ f = "scripts/commit-individually.ps1"; m = "Add helper script for committing files individually with meaningful messages" }
)

$success = 0
$skip = 0

foreach ($item in $commits) {
  $status = git status --porcelain $item.f 2>&1
  if ($status) {
    git add $item.f 2>&1 | Out-Null
    $result = git commit -m $item.m 2>&1
    if ($LASTEXITCODE -eq 0) {
      Write-Host "OK  $($item.f)" -ForegroundColor Green
      $success++
    } else {
      Write-Host "ERR $($item.f): $result" -ForegroundColor Red
    }
  } else {
    Write-Host "SKP $($item.f) (not modified)" -ForegroundColor Gray
    $skip++
  }
}

Write-Host "`n=== DONE: $success committed, $skip skipped ===" -ForegroundColor Cyan
