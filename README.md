<div align="center">

<br/>

# ◼ MONO

### A Local-First Personal Operating System

**One place. Every workflow.**

<br/>

[![Version](https://img.shields.io/badge/version-0.1.0-black?style=flat-square)](https://github.com/siddhantbhatia220/MONO)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-black?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/license-MIT-black?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-black?style=flat-square)](CONTRIBUTING.md)

<br/>

</div>

---

## What is MONO?

MONO is not a to-do app.

It is a **high-performance, local-first Personal Operating System** — a single, adaptive workspace where tasks, notes, goals, events, and projects live together without forcing a rigid workflow on you.

Instead of adapting to the software, the software adapts to you.

**Everything is an Item.** A task, a note, a goal, a bookmark, a habit — all inherit from the same type. Infinite views. One source of truth.

---

## Design Philosophy

- **Pure monochrome** — black, white, and grayscale only. Timeless.
- **Keyboard-first** — every action accessible via `⌘K` command palette
- **Local-first** — instant launch, works offline, syncs later
- **Invisible UI** — the interface disappears so you can focus on your work
- **Composable** — build your workflow from modular, reusable primitives

---

## Features — Phase 1

- ✅ **Onboarding** — beautiful first-run experience with workspace templates
- ✅ **Universal Command Palette** — `Ctrl+K` / `⌘K` for everything
- ✅ **Quick Capture** — `N` to add an item instantly, with `#tag` and `!priority` syntax
- ✅ **Offline-First Storage** — IndexedDB via `idb`, no backend required
- ✅ **Animated UI** — spring physics via Framer Motion
- ✅ **Monochrome Design System** — full token system (spacing, radius, shadow, motion)
- ✅ **Workspace Management** — create, switch, and organize workspaces
- ✅ **Item CRUD** — create, complete, delete, with undo/redo history
- ✅ **Light & Dark Mode** — automatic system theme detection
- ✅ **Keyboard Shortcuts** — global registry with `?` overlay
- ✅ **Accessible** — ARIA annotations, keyboard navigation, focus management
- ✅ **Monochrome Empty States** — hand-crafted animated SVG illustrations
- ✅ **TypeScript Strict** — zero `any`, fully typed throughout

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| State | Zustand (with persistence + devtools) |
| Local DB | IndexedDB via `idb` |
| IDs | nanoid |
| Dates | date-fns |
| Icons | lucide-react |

---

## Project Roadmap

### Phase 1 — Foundation ✅ (current)
Design system · Authentication-free local storage · Item CRUD · Workspaces · Command palette · Keyboard shortcuts · Onboarding

### Phase 2 — Views & Search
Multiple views (Board, Calendar, Timeline) · Universal search · Rich markdown editor · Attachments · Smart filters

### Phase 3 — Collaboration & Sync
Backend (NestJS + PostgreSQL) · Real-time sync (Yjs CRDT) · User authentication · Sharing & permissions · Comments · Activity history

### Phase 4 — Extensibility
Visual automation (IF/THEN) · Plugin system · Public API · Import/export · Backup/restore

### Phase 5 — Intelligence Layer
Duplicate detection · Smart scheduling · Workload analysis · Pattern recognition · No LLM APIs

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
git clone https://github.com/siddhantbhatia220/MONO.git
cd MONO
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Commands

```bash
npm run dev          # Start development server (Turbopack)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run type-check   # TypeScript check (no emit)
npm run format       # Prettier (write)
npm run format:check # Prettier (check only)
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+K` / `⌘K` | Open Command Palette |
| `N` | New item (focuses quick capture) |
| `?` | Show keyboard shortcuts |
| `Ctrl+B` | Toggle sidebar |
| `Escape` | Close / Cancel |
| `↵` | Complete / Open item |

---

## Folder Structure

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx       # Root layout (Server Component)
│   ├── page.tsx         # Main application
│   └── globals.css      # Global styles
├── components/
│   ├── ui/              # Button, Checkbox, Input, Modal, Badge, Tooltip
│   ├── layout/          # Sidebar, CommandPalette, ThemeProvider
│   ├── items/           # ItemRow, QuickCapture
│   └── views/           # ListView, EmptyState
├── lib/
│   ├── db/              # IndexedDB CRUD (items, workspaces)
│   ├── hooks/           # Custom React hooks
│   ├── store/           # Zustand stores (app, item, ui)
│   ├── types/           # TypeScript domain models
│   └── utils/           # date, id, keyboard utilities
└── styles/
    └── tokens.css       # Design token system
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## Security

See [SECURITY.md](SECURITY.md) for the security policy.

## License

MIT © [Siddhant Bhatia](https://github.com/siddhantbhatia220)
