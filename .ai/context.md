# MONO — Persistent AI Context & Repository Findings

This document serves as the persistent memory and architectural context for AI models working on the MONO repository. Update this document whenever new structural or architectural decisions are made.

---

## 1. System Architecture & Routing Map

- **Framework**: Next.js 16 (App Router, Turbopack)
- **State & Storage**: Zustand Stores + IndexedDB local persistence (`idb`)
- **Styling**: Tailwind CSS v4 + `src/styles/tokens.css` (Strictly Monochrome: black, white, 10-stop grayscale)

### Route Mapping
- `/` (`src/app/page.tsx`): High-converting marketing landing page featuring logo tracking animations, feature pillars, and live interactive app mockup tour.
- `/app` (`src/app/app/page.tsx`): Primary Personal OS workspace application shell (ListView, QuickCapture, CommandPalette, Onboarding, Modals).
- `/api/health` (`src/app/api/health/route.ts`): Server health & environment metadata endpoint.
- `/api/items` (`src/app/api/items/route.ts`): Universal items REST API interface.
- `/api/workspaces` (`src/app/api/workspaces/route.ts`): Workspaces & templates API interface.

---

## 2. API Architecture (Controllers & Services Layer)

All API route handlers in `src/app/api/` delegate business logic to decoupled controllers and services in `src/lib/api/`:

```
src/
├── app/
│   └── api/
│       ├── health/route.ts        -> Calls healthController.getHealth()
│       ├── items/route.ts         -> Calls itemsController.getItems()
│       └── workspaces/route.ts    -> Calls workspacesController.getWorkspaces()
└── lib/
    └── api/
        ├── controllers/           -> Response formatting & HTTP handling
        │   ├── healthController.ts
        │   ├── itemsController.ts
        │   └── workspacesController.ts
        └── services/              -> Business logic & data providers
            ├── itemsService.ts
            └── workspacesService.ts
```

---

## 3. UI/UX & Design Token Conventions

- **Monochrome Policy**: Zero vibrant colors in workspace UI. Use black, white, and grays (`text-zinc-500`, `bg-zinc-900`, `border-zinc-200`).
- **Icons**: Minimal emoji usage. Project icons use `ProjectIcon` (`src/components/ui/ProjectIcon.tsx`), which dynamically renders monochrome Lucide SVG icons with backward compatibility for legacy emojis.
- **Accessibility (A11y)**:
  - Button elements inside `Checkbox.tsx` forward `aria-label` and `aria-labelledby`.
  - Item row wrapper uses `role="listitem"`.
  - Color contrast on text elements meets WCAG AA 4.5:1 minimum ratio.

---

## 4. Git Commit Policy & Automated Scheduling

- **Single Change Commits**: Each commit represents exactly one logical file change.
- **Commit Messages**: Written as plain imperative sentences (avoid `feat:` or `chore:` prefixes).
- **Daily Commit Cap (40%)**: When large batches of files are modified, stage/commit up to 40% on day 1. Remaining files are committed on day 2 using `scripts/auto-commit-remaining.ps1`.

---

## 5. Build & Environment Gotchas

- **Turbopack Root**: `next.config.ts` explicitly sets `turbopack.root: path.resolve(__dirname)` to eliminate multi-lockfile root warnings.
- **CI Lockfile Alignment**: `package-lock.json` must remain strictly aligned with `package.json` to pass GitHub Actions `npm ci`.
