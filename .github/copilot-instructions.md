# Repository documentation rules

- Preserve the local-first, frontend-only and GitHub Pages architecture unless a separately approved design change says otherwise.
- Use `src/curriculum.ts` for curriculum inventory and `src/content.ts` for authored lesson content; do not duplicate these contracts in UI code.
- Treat `src/storage.ts` keys, schema values and pending/current write order as persistent-data contracts. Document and test migrations before changing them.
- Keep comments focused on ownership, invariants, equations, units, evidence boundaries, recovery behaviour and other non-obvious decisions.
- Do not add comments that simply restate TypeScript/React syntax or annotate every JSX element.
- Do not mark curriculum material as authored or verified without the corresponding content/evidence and regression coverage.
- Keep README and `CODE-MAP.md` current when routing, persistence, curriculum, content, PWA or deployment boundaries change.
- Preserve UK English, SI units, accessibility semantics and the supported GitHub Pages deployment base.
