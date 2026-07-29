# MONO — Roadmap

## Phase 0 — Concept (COMPLETE)
Product vision, design philosophy, tech stack selection, architecture decisions.

---

## Phase 1 — Foundation (COMPLETE v0.1.0)

### Status: SHIPPED

| Feature | Status |
|---|---|
| Project scaffold (Next.js 16, TypeScript strict, Tailwind v4) | Done |
| Design token system (monochrome, full CSS custom properties) | Done |
| Universal Item domain model (one type, many forms) | Done |
| IndexedDB local-first persistence (idb, typed schema, versioned) | Done |
| Three-store Zustand architecture (App / Item / UI) | Done |
| UI primitive library (Button, Checkbox, Input, Modal, Badge, Tooltip) | Done |
| Three-step onboarding flow | Done |
| Collapsible sidebar with spring animation | Done |
| Command Palette (Ctrl+K) with fuzzy search | Done |
| Quick Capture bar with #tag and !priority parsing | Done |
| Item CRUD (create, complete, delete with undo toast) | Done |
| Light/dark mode with system preference detection | Done |
| Keyboard shortcut registry with overlay | Done |
| Animated monochrome SVG empty state illustrations | Done |
| 50-state undo/redo history in ItemStore | Done |
| Full ARIA accessibility | Done |
| GitHub Actions CI (type-check + lint + build) | Done |
| Professional documentation suite | Done |

---

## Phase 2 — Views & Search (COMPLETE v0.2.0 — 100%)

### Status: SHIPPED

| Feature | Priority | Complexity | Status |
|---|---|---|---|
| Board (Kanban) view | High | Medium | Done |
| Calendar view | High | High | Done |
| Timeline/Gantt view | Medium | High | Done |
| Universal full-text search | High | Medium | Done |
| Smart filters (saved, custom) | High | Medium | Done |
| Rich Markdown editor (block-based) | High | High | Done |
| File/image attachments | Medium | Medium | Done |
| Sub-item checklist UI | High | Low | Done |
| Item detail panel (slide-in) | High | Medium | Done |
| Batch operations (multi-select) | Medium | Low | Done |
| Drag and drop reordering | Medium | Medium | Done |
| Tag management (rename, merge, color) | Medium | Low | Done |
| Due date picker | High | Low | Done |
| Recurring items | Medium | High | Done |
| Focus mode (hide sidebar, fullscreen editor) | Low | Low | Done |
| Saved Filter Presets | High | Low | Done |
| Mobile touch snap-scrolling | High | Medium | Done |
| Automated Google SEO Generator | High | Low | Done |

---

## Phase 3 — Collaboration & Sync (COMPLETE v0.3.0 — 100%)

### Status: SHIPPED

| Feature | Priority | Complexity | Status |
|---|---|---|---|
| NestJS Server Foundation & Config | High | High | Done |
| PostgreSQL Prisma Database Schema | High | High | Done |
| User Authentication & JWT Rotation (Argon2) | High | Medium | Done |
| REST Sync API (Hydration & Delta) | High | Medium | Done |
| Real-time Yjs CRDT over WebSockets Gateway | High | High | Done |
| BitChat Offline Local P2P Wireless Mesh Sync | High | High | Done |
| Workspace Sharing & Member Roles UI | Medium | Medium | Done |
| Item Activity Audit Feed & Discussion | Medium | Low | Done |
| Offline-first with conflict resolution | High | Very High | Future |
| Workspace sharing and permissions | High | High | Future |
| Comments and reactions on items | Medium | Medium | Future |
| Activity history / audit log | Medium | Medium | Future |
| @mentions and notifications | Medium | High | Future |
| Guest access (view-only links) | Low | Medium | Future |

---

## Phase 4 — Extensibility (FUTURE)

### Priority: MEDIUM
### Target: v0.4.0

| Feature | Priority | Complexity | Status |
|---|---|---|---|
| Visual automation (IF/THEN rules) | High | Very High | Future |
| Plugin system (sandboxed) | High | Very High | Future |
| Public REST API | Medium | High | Future |
| Webhooks | Medium | Medium | Future |
| Import (Notion, Todoist, Obsidian, CSV) | High | Medium | Future |
| Export (PDF, Markdown, JSON, CSV) | High | Medium | Future |
| Backup and restore | High | Medium | Future |
| Custom item properties (Phase 1 data model already supports this) | High | Low | Future |
| Custom views (user-defined filters + layouts) | Medium | High | Future |

---

## Phase 5 — Intelligence Layer (FUTURE)

### Priority: LOW
### Target: v0.5.0
### Constraint: NO LLM APIs — intelligence is pattern recognition only

| Feature | Priority | Complexity | Status |
|---|---|---|---|
| Duplicate item detection | Medium | Medium | Future |
| Smart scheduling suggestions | Medium | High | Future |
| Workload analysis and warnings | Medium | High | Future |
| Pattern recognition (recurring behavior) | Medium | Very High | Future |
| Natural language date parsing | High | Medium | Future |
| Auto-tagging suggestions | Medium | High | Future |

---

## Platform Expansion (After Phase 2)

| Platform | Technology | Status |
|---|---|---|
| iOS / Android | Expo (React Native) | Future |
| Desktop (macOS / Windows / Linux) | Tauri 2 (wraps web app) | Future |
| Browser extension (Quick Capture) | Chrome/Firefox extension | Future |
| CLI tool | Node.js CLI | Future |

---

## Known Constraints and Non-Goals

- **No AI APIs** — intelligence is always local pattern recognition
- **No vendor lock-in** — data is always exportable
- **No freemium dark patterns** — MONO will have a clear, honest pricing model
- **No tracking** — zero analytics, zero telemetry by default
- **No electron** — desktop via Tauri only (50x smaller bundle, native security)
