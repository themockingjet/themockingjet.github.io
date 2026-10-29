# Jet's portfolio

A static React portfolio for Jet, an Associate Software Engineer in the Philippines. The site presents six destinations as a horizontal journey and offers a vertical Reading view. Project content is authored in Markdown; the lab is a local synthetic simulation.

Live: https://themockingjet.github.io  
Raw content: https://themockingjet.github.io/raw/portfolio.md

## Development

Use Node.js 22, matching CI and GitHub Pages deployment.

```sh
npm ci
npm run dev
```

The development server is available at `http://localhost:5173`. The production build is static and goes to `dist/`; `npm run preview` serves it locally. Vite copies the content source to `dist/raw/portfolio.md`. The local `.experimental/` prototype is not a production dependency or build artifact.

## Validation

```sh
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Vitest covers parsing, route ranking, briefing generation, simulator transitions and component interactions. Playwright covers desktop and emulated mobile navigation, key interactions and axe checks. Emulation does not replace testing on physical mobile hardware. CI runs these commands on Node 22 for pull requests and pushes to `dev` and `main`.

## Content and features

`src/content/portfolio.md` is the portfolio source of truth. Each project needs a unique lowercase kebab-case `id` and at least one unique lowercase kebab-case `interests` tag. These fields drive stable project fragments and route matching; the parser rejects invalid or duplicate values. Project details, skills, biography and verified links remain in the same file.

The planner ranks projects by selected authored tags and can export a local Markdown briefing. The lab uses fixed synthetic events; it does not contact a service or execute a real action. Reading view and motion settings are stored locally when storage is available. System reduced-motion settings override full background motion.

React, TypeScript, Vite and CSS Modules implement the UI. GSAP animates the canvas scenery; Latin-subset WOFF2 versions of Space Grotesk and Source Sans 3 are bundled with their OFL licenses in `public/fonts/`. Unsupported characters use the system font fallback.

## Deployment and rollback

Pushes to `main` trigger the GitHub Pages workflow. Review the production build and validation results before merging. The previous deployment commit is the rollback reference; revert the migration through a follow-up commit and let the Pages workflow redeploy if needed.
