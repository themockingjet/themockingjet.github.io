# themockingjet.github.io

Personal portfolio of Jet, an Associate Software Engineer focused on automation. The site is a horizontal journey through five destinations — Home, Projects, The lab, About and Contact — with all content authored in a single Markdown file.

**Live:** https://themockingjet.github.io · **Raw content:** https://themockingjet.github.io/raw/portfolio.md

## Features

- **Workflow graph hero** — an animated pipeline with retries, a cached fallback and a dead-letter replay loop.
- **Journey navigation** — keyboard, wheel, swipe and footer route navigation with deep links to every destination and project.
- **Warp transitions** — pages glide with a speed-matched motion blur while the star field moves with parallax.
- **Automation lab** — a local simulation of a pipeline run using fixed synthetic events; nothing leaves the browser.
- **Themes** — six accent colours plus light and dark modes, remembered between visits.
- **Accessible by default** — keyboard focus, reduced-motion support and WCAG A/AA checks in CI.

## Tech stack

React 19, TypeScript, Vite, CSS Modules, GSAP and the Web Animations API. Content is parsed with `marked`. Space Grotesk and Source Sans 3 are self-hosted from `public/fonts/` under the OFL.

## Getting started

Requires Node.js 22.

```sh
npm ci
npm run dev
```

Open http://localhost:5173.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit and integration tests (Vitest) |
| `npm run test:e2e` | Run end-to-end and accessibility tests (Playwright) |

Install the Playwright browser once before running end-to-end tests:

```sh
npx playwright install chromium
```

## Editing content

All copy lives in [`src/content/portfolio.md`](src/content/portfolio.md). The front matter holds the hero details, followed by `## About`, `## Projects` and `## Skills` sections. The build also publishes this file at `/raw/portfolio.md`.

Each project is a `###` heading followed by metadata lines and a description:

```md
### Binance Trading Bot
id: binance-trading-bot
interests: automation, real-time, backend
match_reason: Streaming market events feed backend rules that trigger automated actions.
status: beta
stack: Bun, TypeScript, Binance API

One-paragraph summary shown on the card.

[Context]
...
```

- `id` — required, unique, lowercase kebab-case. Used for the `#project-<id>` link.
- `interests` — required, one or more unique lowercase kebab-case tags.
- `match_reason` — required, one sentence on why the project is relevant.

The parser runs when the page loads and throws a descriptive error if any required field is missing or invalid, so check the dev server after editing.

## Project structure

```text
src/
  components/   UI components, one folder each with a CSS Module
  content/      portfolio.md, the single source of content
  lib/          Markdown parser, lab simulator and themes
  styles/       global styles and design tokens
tests/
  unit/         component and library tests
  integration/  app-level behaviour tests
  e2e/          Playwright journeys, layout and axe checks
```

## Deployment

Pushes to `main` build and deploy to GitHub Pages. The **Deploy GitHub Pages (Dev)** workflow can be run manually to deploy another branch. Pull requests and pushes to `main` and `dev` run lint, unit, build and end-to-end checks.

To roll back, revert the offending commit on `main`; the Pages workflow redeploys automatically.

## License

[MIT](LICENSE) © Jet Joseph
