# themockingjet.github.io

Personal portfolio of **Jet** — Associate Software Engineer from the Philippines.

**Live:** https://themockingjet.github.io  
**Raw (AI-readable):** https://themockingjet.github.io/raw/portfolio.md

---

## Stack

- React 19 + Vite 8 + TypeScript 6
- CSS Modules (no Tailwind)
- [motion](https://motion.dev) for panel transitions
- Inline `parseFrontmatter()` for frontmatter parsing (browser-safe, zero dependencies)

---

## Quick Start

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 5173) |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint |
| `npx vitest run` | Unit + integration tests |
| `npx playwright test` | E2E tests (requires `npx playwright install`) |

## Build

Output is in `dist/`. The file `dist/raw/portfolio.md` is the AI-readable version served at `/raw/portfolio.md` on GitHub Pages.

---

## Testing

- **Unit/Integration:** Vitest + Testing Library (`tests/unit/`, `tests/integration/`)
- **E2E:** Playwright (`tests/e2e/`)
- **Accessibility:** axe-core via `@axe-core/playwright` — runs full WCAG 2 AA audit in real browsers

```bash
npx vitest run          # 58 unit/integration tests
npx playwright test     # E2E (desktop + mobile viewports)
```

---

## Content Authoring

All portfolio content lives in a single file:

```
src/content/portfolio.md
```

Edit this file to update the portfolio. No other files need to change.

---

## Project Structure

```
src/
  components/     Component modules (TSX + CSS Modules)
  content/        portfolio.md (single source of truth)
  lib/            Parsing, icons, utilities
  styles/         Global CSS (variables, themes, resets)
tests/
  unit/           Component unit tests
  integration/    Cross-component integration tests
  e2e/            Playwright browser tests
public/
  textures/       Background textures
```