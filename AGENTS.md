# Site Recipe agent guide

## Product

Site Recipe is a one-page guided decision tool for beginner and non-designer ChatGPT Sites builders. Its job is to turn a vague website idea into a coherent, paste-ready build brief in under two minutes.

## First run

```bash
npm install
npm run dev
```

Use Node.js 22.13 or newer. No environment variables are required for the MVP.

## Commands

- `npm run dev` — start the local Sites development server.
- `npm run build` — create the deployable build.
- `npm run lint` — run oxlint.
- `npm run format` — run oxfmt.
- `npm test` — run the `lib/recipe/*.test.ts` vitest suite.

## Architecture

- `app/page.tsx` is a server component that renders `<RecipeBuilder />`.
- `components/recipe/recipe-builder.tsx` owns the single-page guided flow, composed from the other `components/recipe/*` pieces; `components/recipe/use-recipe.ts` owns client-side recipe state, URL-hash sync, and the live-brief pulse.
- `lib/recipe/` owns the pure, framework-free recipe logic: catalog data and types, starters, shape defaults and mismatch hints, progress calculation, deterministic prompt building, and URL-hash encode/decode. It has its own `*.test.ts` vitest suite.
- `app/globals.css` is the stylesheet entry point: it declares the `@layer reset, controls;` order and then imports the ordered partials in `app/styles/`, which own shared design tokens, responsive behavior, and motion fallbacks — plain CSS, no Tailwind or shadcn. Edit the partials; Vite inlines the imports at build time.
- `app/layout.tsx` owns document metadata and fonts.
- `.openai/hosting.json` contains ChatGPT Sites hosting declarations.

## Working rules

- Read `DESIGN.md` and `.impeccable.md` before visual work; do not drift from them without approval.
- Keep the critical path client-side and deterministic for the hackathon MVP.
- Use semantic HTML, visible focus, keyboard-operable choices, and reduced-motion fallbacks.
- Do not copy screenshots, animations, or proprietary prompts from reference catalogs.
- Keep selections small and curated. This is a decision funnel, not a searchable encyclopedia.
- Preserve the one-page, under-two-minute completion goal unless scope is explicitly expanded.
