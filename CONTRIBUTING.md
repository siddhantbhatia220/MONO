# Contributing to MONO

Thank you for your interest in contributing to MONO. This document outlines the process for contributing code, documentation, and ideas.

---

## Before You Start

- Read the [README](README.md) to understand the project
- Check [open issues](https://github.com/siddhantbhatia220/MONO/issues) to avoid duplicate work
- For major changes, open an issue first to discuss the approach

---

## Development Setup

```bash
git clone https://github.com/siddhantbhatia220/MONO.git
cd MONO
npm install
cp .env.example .env.local
npm run dev
```

---

## Engineering Standards

These are non-negotiable for all contributions:

### 1. No placeholder code
Never submit `// TODO`, fake implementations, or `coming soon` stubs. Every piece of code must compile, run, and be production-ready.

### 2. TypeScript strict
No `any` types. No `@ts-ignore`. All types must be explicit and correct.

### 3. Accessibility first
Every interactive element must be keyboard navigable and ARIA-annotated.

### 4. Monochrome only
No colors outside the design token system. The palette is black, white, and grayscale — no exceptions.

### 5. Test your changes
Verify your changes work in both light and dark mode, on mobile (375px) and desktop (1440px).

---

## Commit Convention

Each commit must represent exactly one logical change. Write commit messages as a complete sentence describing *what* the change achieves, not *what files were changed*.

**Good:**
```
Implement full-text search across items, notes, and tags with fuzzy matching
Add keyboard shortcut overlay with categorized shortcut list and search
Fix CheckBox path animation not completing on rapid toggle
```

**Bad:**
```
feat: add search
fix stuff
update files
chore: misc
```

---

## Pull Request Process

1. Fork the repository
2. Create a branch: `git checkout -b your-feature-name`
3. Make your changes following the engineering standards above
4. Verify: `npm run type-check && npm run lint && npm run build`
5. Open a pull request against `main` with a clear description

---

## Code of Conduct

By contributing, you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md).
