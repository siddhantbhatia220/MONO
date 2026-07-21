# Changelog

All notable changes to MONO are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
MONO uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

Changes staged for the next release.

---

## [0.1.0] — 2026-07-12

Initial Phase 1 release — Foundation.

### Added

- **Onboarding flow** — three-step workspace setup with template selection and icon picker
- **Universal Command Palette** — `Ctrl+K` / `⌘K` with grouped results, keyboard navigation, and fuzzy search highlighting
- **Quick Capture bar** — always-visible item creation with `#tag` and `!priority` inline syntax
- **IndexedDB persistence layer** — offline-first local storage via `idb` with typed schema and versioned migrations
- **Universal Item architecture** — Task, Note, Goal, Event, Habit, Bookmark, Checklist all inherit from one type
- **Workspace management** — create, switch, and organize workspaces with emoji icons
- **Zustand state management** — AppStore, ItemStore, UIStore with devtools and persistence
- **Monochrome design token system** — full CSS custom property system (color, spacing, radius, shadow, motion)
- **Animated UI components** — Button, Checkbox (SVG draw animation), Input, Modal, Badge, Tooltip
- **Collapsible sidebar** — spring-animated width transition with full keyboard navigation
- **Light and dark mode** — automatic system theme detection, no flash on load
- **Keyboard shortcut registry** — global shortcuts with `?` overlay showing all shortcuts
- **Monochrome empty state illustrations** — hand-crafted animated SVG for no-items, no-workspace, no-results
- **Undo/redo history** — 50-state history in ItemStore
- **ARIA accessibility** — full keyboard navigation, focus management, screen reader support
- **TypeScript strict mode** — zero `any` throughout the codebase
- **Production build** — zero errors, optimized output

### Architecture

- Next.js 16 App Router (Turbopack)
- Framer Motion for spring physics animations
- `nanoid` for URL-safe unique IDs
- `date-fns` for tree-shakeable date utilities
- Security headers in `next.config.ts`

---

## Phase 2 (Upcoming)

- Multiple views: Board (Kanban), Calendar, Timeline
- Rich markdown editor with attachment support
- Universal search across all item fields
- Smart filters and saved searches
- React Native mobile app (Expo)
- Tauri desktop wrapper
