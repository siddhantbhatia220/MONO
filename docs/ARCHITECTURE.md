# MONO — Architecture

## System Overview

MONO Phase 1 is a purely client-side, local-first web application. There is no backend in Phase 1 — all data lives on-device in IndexedDB.

```
┌─────────────────────────────────────────┐
│              Browser                    │
│                                         │
│  ┌─────────────┐    ┌────────────────┐  │
│  │  Next.js    │    │   IndexedDB    │  │
│  │  App Router │◄──►│   (idb lib)    │  │
│  │             │    │                │  │
│  │  React UI   │    │ items          │  │
│  │  Components │    │ workspaces     │  │
│  │             │    │ projects       │  │
│  │  Zustand    │    │ preferences    │  │
│  │  Stores     │    └────────────────┘  │
│  └─────────────┘                        │
└─────────────────────────────────────────┘
```

## Data Flow

```
User Action
    │
    ▼
React Component
    │
    ├──► Zustand Store (optimistic update — instant UI)
    │
    └──► IndexedDB (db layer) — async, durable
             │
             └──► Zustand Store subscription triggers re-render
```

## Domain Model

```
Workspace
 └── Project (nested, unlimited depth)
      └── Item (Task | Note | Goal | Event | Habit | Bookmark | Checklist)
           ├── SubItems (checklist entries)
           ├── Tags []
           ├── Properties (custom key-value)
           └── Item (parentId — nested sub-tasks, unlimited depth)
```

## Component Architecture

```
app/page.tsx (Client)
 ├── OnboardingScreen        — first-run workspace setup
 └── AppShell
      ├── Sidebar            — collapsible nav, workspace/project list
      │    └── ProjectList
      ├── WorkspaceHeader    — breadcrumb, view switcher
      ├── ListView           — primary item view
      │    ├── ItemRow       — animated row with checkbox, priority, due date
      │    └── EmptyState    — illustrated empty states
      ├── QuickCapture       — always-visible item creation bar
      │
      │   [Global Overlays]
      ├── CommandPalette     — ⌘K universal search & actions
      ├── CreateWorkspaceModal
      ├── ShortcutsModal
      └── Toasts
```

## State Architecture

Three Zustand stores, each with a single responsibility:

| Store       | Responsibility                                              | Persisted?      |
| ----------- | ----------------------------------------------------------- | --------------- |
| `appStore`  | Active workspace/project, user preferences, resolved theme  | ✅ localStorage |
| `itemStore` | In-memory item cache, optimistic updates, undo/redo history | ❌ Session only |
| `uiStore`   | Command palette, modals, toasts, sidebar state              | ❌ Session only |

## Phase 3 Target Architecture (Backend)

```
┌──────────────┐     WebSocket (Yjs CRDT)    ┌───────────────┐
│   Client     │◄────────────────────────────►│  NestJS API   │
│  (Next.js)   │                              │               │
│   + Yjs      │        REST / HTTP           │  PostgreSQL   │
│   + SQLite   │◄────────────────────────────►│  Redis Cache  │
└──────────────┘                              └───────────────┘
```

Key principle: The client always has the full truth in local storage. The server is a sync layer, not the source of truth.
