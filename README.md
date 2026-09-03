# Site Recipe

Site Recipe is a guided, taste-aware blueprint builder for people starting a website with ChatGPT Sites. Visitors turn a rough idea into a practical build prompt by choosing a visual direction, page sections, interface patterns, motion, and access requirements.

This repository was created for a one-hour ChatGPT Sites hackathon. The first release is intentionally a single-page, client-side experience with no account or backend dependency.

## First run

Requirements: Node.js 22.13 or newer and npm.

```bash
npm install
npm run dev
```

Use the local URL printed by the development server.

## Useful commands

```bash
npm run dev
npm run build
npm run lint
npm run format
npm test
```

## Stack

- Styling is plain CSS. `app/globals.css` is the entry point that imports the ordered partials in `app/styles/`; shared design tokens live in `app/styles/01-tokens-reset.css`. There is no Tailwind and no shadcn in the build.
- Pure recipe logic — catalog, starters, shape defaults, progress, prompt building, URL state — lives in `lib/recipe/` and is covered by a vitest suite (`npm test`). The interface lives in `components/recipe/`.
- Each page type ships a starter set of sections and UI patterns, and a short list of curated hints flags combinations that usually miss, like a command menu on an event page.
- The generated build prompt is editable before you copy it, and "Regenerate from choices" restores the generated version.
- Every choice round-trips through the URL hash, so a shared link restores the whole recipe.
- Below 980px the sticky live brief becomes a fixed summary bar that opens the same brief in a sheet.

## Product slice

The MVP helps a beginner:

1. Describe an idea.
2. Describe who the site is for.
3. Choose a visual direction.
4. Pick the page's essential sections.
5. Pick useful UI patterns.
6. Set a motion level.
7. Decide whether the site is public or gated.
8. Copy a structured prompt for ChatGPT Sites.
9. Share a link that restores every choice.

Reference material — inspiration, not dependencies — includes [Name That UI](https://namethatui.com/), [shadcn/ui](https://ui.shadcn.com/), [Motion Sites](https://motionsites.ai/), and [Awwwards](https://www.awwwards.com/). We borrow vocabulary and interaction ideas, not protected assets or copied designs.
