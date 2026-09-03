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
  If font files 404 in dev after the project folder moves, delete the `.vinext/` cache: it stores absolute paths.
- `npm run build` — create the deployable build.
- `npm run lint` — run oxlint.
- `npm run format` — run oxfmt.
- `npm test` — run the `lib/recipe/*.test.ts` vitest suite.

## Deploying

There is no CLI for ChatGPT Sites; versions are saved and deployed only from ChatGPT web or the desktop app. `.openai/hosting.json` links this repository to the hosted project, and the Vite plugin copies it into `dist/` at build time.

1. Merge to `main` on GitHub first. The Sites editor has a GitHub connection and can build a pinned commit.
2. Open chatgpt.com/sites, choose Site Recipe, then Edit.
3. In the composer, ask for a deploy of an exact commit and say not to change code, for example: "Deploy commit `<sha>` from https://github.com/n3moxyz/site-recipe with Sites. Do not modify or regenerate any code; pull that exact commit, run `npm ci && npm run build`, save it as a version tied to that commit, deploy it, and reply with the version and URL."
4. Every Sites deployment is production. To review first, ask for a saved version without deploying it.
5. Verify the live site afterwards: the HTML should reference the expected commit's markers (for example `og.jpg`, the audience field), `/og.png` should remain a working compatibility URL for the hackathon gallery, and `document.fonts` should report Geist Mono as loaded.

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
- Unless the user says otherwise, finish every requested code or content change by committing it, pushing the active branch, and publishing the corresponding ChatGPT Site. Read-only requests do not trigger this rule.
