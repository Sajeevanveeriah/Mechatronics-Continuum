# Code Map

Use this file to locate the owner of a behaviour before editing the application. Generated dependencies and binary assets are listed as boundaries rather than code to hand-edit.

## Application source

| Path | Responsibility | Change risk |
| --- | --- | --- |
| `src/main.tsx` | React application shell, hash-route view selection, learning-session orchestration and user interactions. | High: it connects curriculum, content and persistence. Keep domain rules in their owning modules. |
| `src/curriculum.ts` | Level 0-14 curriculum inventory, subject labels/slugs, prerequisite labels and the set of currently authored subjects. | High: subject names/slugs can affect routes and persisted progress references. |
| `src/content.ts` | Authored lesson payloads, exercises, explanations, examples and evidence-oriented learning content. | High: publishing content changes what the application claims is available and technically reviewed. |
| `src/storage.ts` | IndexedDB schema validation, seed state, recovery writes, import/export and deterministic review scheduling. | High: schema/key changes can strand existing browser progress. |
| `src/types.ts` | Shared TypeScript domain contracts used across UI, curriculum, content and storage. | High: type changes propagate across the application and persisted-data expectations. |
| `src/style.css` | Global layout, themes, responsive behaviour, focus visibility and presentation. | Medium: preserve accessibility and small-screen reflow. |
| `src/vite-env.d.ts` | Vite-generated environment typings. | Low: normally maintained by tooling, not business logic. |
| `src/test-setup.ts` | Shared unit/component test environment setup. | Medium: changes can alter every test's assumptions. |

## Automated verification

| Path | Responsibility |
| --- | --- |
| `src/app.test.tsx` | Application/component behaviour and accessibility-oriented regression coverage. |
| `src/assets.test.ts` | Static asset/visual source expectations. |
| `src/content.test.ts` | Authored lesson content/evidence contract. |
| `src/curriculum.test.ts` | Curriculum structure, subjects and availability invariants. |
| `src/storage.test.ts` | Persistence validation, recovery/import and scheduling behaviour. |
| `e2e/app.spec.ts` | Browser-level navigation and learning workflow checks through Playwright. |
| `playwright.config.ts` | Playwright server/browser/test configuration. |

## Documentation and content inventory

| Path | Responsibility |
| --- | --- |
| `README.md` | Operator/developer overview and current system boundaries. |
| `CODE-MAP.md` | This maintainer navigation map. |
| `docs/Curriculum-Coverage.md` | Detailed coverage ledger for the curriculum inventory. Treat it as the auditable coverage view, not application runtime code. |

## Build and deployment

| Path | Responsibility |
| --- | --- |
| `package.json` | Scripts and direct dependency contract. |
| `package-lock.json` | npm-resolved dependency graph. Do not hand-edit. |
| `vite.config.ts` | Vite build configuration, production base path and PWA behaviour. |
| `tsconfig.json` | TypeScript project entry configuration. |
| `tsconfig.app.json` | Application compiler rules. |
| `eslint.config.js` | Lint rules. |
| `.prettierignore` | Files intentionally excluded from formatting. |
| `.gitignore` | Local/generated paths excluded from version control. |
| `.github/workflows/ci.yml` | Verification workflow. Keep validation separate from deployment. |
| `.github/workflows/deploy-pages.yml` | GitHub Pages build/publish workflow after changes reach `main`. |
| `.github/copilot-instructions.md` | Repository-specific future documentation/editing rules. |
| `index.html` | Vite HTML entry shell. |
| `public/app-icon.svg` | Reviewable application icon source. |

## Change routes

```text
bad lesson/content
   -> src/content.ts
   -> src/content.test.ts

curriculum structure/availability
   -> src/curriculum.ts
   -> src/curriculum.test.ts
   -> docs/Curriculum-Coverage.md when coverage changes

lost/corrupt progress or review timing
   -> src/storage.ts
   -> src/storage.test.ts

navigation/workflow/UI behaviour
   -> src/main.tsx
   -> src/app.test.tsx
   -> e2e/app.spec.ts for browser-visible flows

Pages/PWA behaviour
   -> vite.config.ts or deploy-pages.yml
   -> build/e2e verification
```

## Persistent-data invariant

The IndexedDB database is `mechatronics-continuum`, object store `progress`, with `current` as the durable record and `pending` as the recovery staging record. Schema version 1 is validated through Zod. Do not rename keys, enum values or stored shapes as a cosmetic refactor.

## Curriculum/content invariant

`src/curriculum.ts` says what exists in the learning graph; `src/content.ts` says what is actually authored. The two must remain consistent. A node should not be presented as authored merely because it exists in the curriculum list.
