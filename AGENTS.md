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

## Architecture

- `app/page.tsx` owns the single-page guided flow and client-side recipe state.
- `app/globals.css` owns shared design tokens, responsive behavior, and motion fallbacks.
- `app/layout.tsx` owns document metadata and fonts.
- `components/ui/` contains generated shadcn primitives; compose these instead of recreating equivalent controls.
- `.openai/hosting.json` contains ChatGPT Sites hosting declarations.

## Working rules

- Read `DESIGN.md` and `.impeccable.md` before visual work; do not drift from them without approval.
- Keep the critical path client-side and deterministic for the hackathon MVP.
- Use semantic HTML, visible focus, keyboard-operable choices, and reduced-motion fallbacks.
- Do not copy screenshots, animations, or proprietary prompts from reference catalogs.
- Keep selections small and curated. This is a decision funnel, not a searchable encyclopedia.
- Preserve the one-page, under-two-minute completion goal unless scope is explicitly expanded.
