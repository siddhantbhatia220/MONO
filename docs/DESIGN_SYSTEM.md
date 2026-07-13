# MONO — Design System

## Philosophy

MONO uses a pure monochrome design system — black, white, and grayscale only.

Visual hierarchy is achieved entirely through:
- **Weight** (font-weight)
- **Size** (font-size)
- **Spacing** (whitespace)
- **Opacity** (transparency layers)
- **Motion** (spring animations)

No color is used for emphasis. This is intentional — the design remains timeless and elegant regardless of context.

---

## Color Palette

| Token | Value | Use |
|---|---|---|
| `--color-white` | `#ffffff` | Primary background (light) |
| `--color-black` | `#000000` | Primary text, interactive elements |
| `--color-gray-50` | `#f8f8f8` | Sidebar background, hover states |
| `--color-gray-100` | `#efefef` | Subtle borders, disabled backgrounds |
| `--color-gray-200` | `#dddddd` | Default borders |
| `--color-gray-300` | `#bbbbbb` | Placeholder text, tertiary icons |
| `--color-gray-400` | `#999999` | Disabled text |
| `--color-gray-500` | `#777777` | Secondary text |
| `--color-gray-600` | `#555555` | Body text (secondary) |
| `--color-gray-700` | `#444444` | Labels, captions |
| `--color-gray-800` | `#333333` | Dark mode backgrounds |
| `--color-gray-900` | `#222222` | Primary text (light mode) |

---

## Typography Scale

| Token | Size | Use |
|---|---|---|
| `--text-xs` | 12px | Labels, captions, badges |
| `--text-sm` | 14px | Body text, item titles |
| `--text-base` | 16px | Default |
| `--text-md` | 18px | Subheadings |
| `--text-lg` | 20px | Section headings |
| `--text-xl` | 24px | Page titles |
| `--text-2xl` | 30px | Modal titles |
| `--text-3xl` | 36px | Hero subheadings |
| `--text-4xl` | 48px | Hero headings |
| `--text-5xl` | 60px | Display |
| `--text-6xl` | 72px | Jumbo display |

**Primary font:** Inter (geometric sans-serif)
**Mono font:** JetBrains Mono (code snippets, keyboard shortcuts)

---

## Spacing Scale (4px base)

| Token | Value |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-12` | 48px |
| `--space-16` | 64px |

---

## Motion Tokens

| Token | Value | Use |
|---|---|---|
| `--transition-fast` | `100ms ease` | Micro-interactions (button press) |
| `--transition-base` | `200ms ease` | Hover states, color changes |
| `--transition-slow` | `300ms ease` | Panel transitions |
| `--transition-spring` | `400ms cubic-bezier(0.34, 1.56, 0.64, 1)` | Spring physics (sidebar, modals) |

Framer Motion spring config for most animations: `{ type: 'spring', damping: 25, stiffness: 250 }`

---

## Component Variants

### Button
- `primary` — Black fill, white text
- `secondary` — White fill, dark border
- `ghost` — Transparent, no border
- `destructive` — Inverts to black on hover

### Badge
- Priority uses weight/fill to indicate severity (Critical = solid black)
- Tags use light gray fill

### Checkbox
- Custom SVG with animated path draw on check
- Transitions from white to black fill

---

## Accessibility Standards

- WCAG 2.2 AA minimum contrast
- All interactive elements have `:focus-visible` rings (2px solid black)
- `aria-label` on all icon-only buttons
- `role`, `aria-selected`, `aria-expanded` on all composite components
- `prefers-reduced-motion` respected via CSS media query
- `prefers-color-scheme` used for automatic dark mode
