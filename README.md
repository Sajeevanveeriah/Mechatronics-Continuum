# Mechatronics-Continuum

A private, local-first engineering learning workbench for Saj, a Robotics, Mechatronics, AI/ML & End-To-End Automation Engineer. It rebuilds knowledge from SI units and mathematics through integrated mechatronics, with retrieval practice rather than reading-based completion.

## Learning model and coverage

The study cycle is diagnostic, learn, retrieve, solve or simulate, diagnose, explain, review and demonstrate. Six measured mastery states are kept separate from confidence. A deterministic scheduler prioritises overdue reviews, prerequisites and recurring classified mistakes. The complete Level 0-14 curriculum graph is browsable. Foundation nodes listed as Authored have working material; all other nodes are truthfully Unavailable rather than placeholder lesson routes. See [the coverage ledger](docs/Curriculum-Coverage.md).

## Architecture

React 19, strict TypeScript, Vite 7, hash routing, validated local content, KaTeX, deterministic SVG, IndexedDB through `idb`, Zod import validation, and `vite-plugin-pwa`. Application artwork is stored as reviewable SVG source, so the repository does not require binary image assets. There is no backend, login, tracking, cookie, remote AI or runtime CDN dependency. The production base is `/Mechatronics-Continuum/`.

## Development and testing

```sh
npm ci
npm run dev
npm run format
npm run lint
npm run typecheck
npm run validate:content
npm run validate:curriculum
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm audit --audit-level=high
```

CI runs these checks without deployment. The separate GitHub Pages workflow deploys the production build after changes reach `main` and also supports manual dispatch.

## Content authoring

Curriculum inventory and availability live in `src/curriculum.ts`; published lesson content lives in `src/content.ts`. A published lesson must satisfy the full evidence contract: prerequisites, objectives, first-principles theory, variables, SI equations, limits, verified example, meaningful simulator where applicable, varied practice, fault diagnosis, recall, interview explanation, mastery evidence, review and source provenance. Add schema and regression tests with each lesson.

## Local data, export and backup

Progress is stored only in browser IndexedDB. JSON export includes the complete schema; import has a 2 MB limit, validation, preview, merge and confirmed replacement. IndexedDB can be cleared by the browser, so periodic export is recommended. Writes use a pending record before replacing the current record, supporting recovery without executing imported code or HTML.

## Accessibility and offline behaviour

The interface targets WCAG 2.2 AA with semantic landmarks, skip navigation, labelled controls, visible focus, text status, keyboard operation, reduced motion, responsive reflow and light, dark and system themes. Automated axe checks supplement manual browser inspection. The PWA caches the authored application shell and lesson assets, prompts before updates and can recover through a normal refresh.

## Deployment boundary and limitations

GitHub Pages serves the built Vite output at `/Mechatronics-Continuum/`; routing is hash-based so deep views survive static hosting. GitHub Pages is the only supported deployment target and `.vercel` project metadata is explicitly excluded from version control. This repository does not collect telemetry or include credentials. Advanced curriculum nodes remain unavailable until each full content pack and its technical review are complete. Browser storage availability and install prompts vary by browser. Python and C/C++ exercises are reasoning and debugging tasks; code is not claimed to execute in-browser.

## Maintainer handoff

Use `CODE-MAP.md` as the repository navigation map before changing code. The main ownership boundaries are:

- `src/curriculum.ts` defines the Level 0-14 inventory, subject slugs, authored-subject availability and prerequisite labels. Changing names can affect content lookups, stored progress and routes.
- `src/content.ts` owns published lesson material and its evidence/assessment structure. Curriculum availability should not be marked complete without corresponding authored content and tests.
- `src/storage.ts` owns the persisted `Progress` schema, recovery record, import/export contract and deterministic review scheduler. Treat schema changes as data migrations, not ordinary refactors.
- `src/main.tsx` composes navigation, learning workflows and UI state. Keep domain/content rules in their owning modules rather than duplicating them in the view layer.
- `src/style.css` owns presentation and responsive/accessibility styling. Preserve visible focus, reduced-motion behaviour and reflow when changing layout.
- `src/*.test.*` and `e2e/app.spec.ts` protect content, curriculum, persistence, assets and complete user flows. Change tests together with the contract they verify.
- `.github/workflows/ci.yml` verifies the repository; `.github/workflows/deploy-pages.yml` publishes the already-validated application to GitHub Pages.

For the complete file-by-file responsibility and change-risk table, see `CODE-MAP.md`.

### Persistence invariant

`src/storage.ts` deliberately writes a `pending` copy before replacing `current`, then deletes `pending`. On load, a valid pending record can be promoted when needed. Keep that ordering intact unless a replacement recovery strategy is designed and migration-tested.

### Review-scheduling invariant

The review scheduler is deterministic. The selected rating sets a base interval multiplier and recorded mistakes reduce the resulting interval. Changing those factors changes learning behaviour and should be accompanied by scheduler tests and an explanation in the documentation.
