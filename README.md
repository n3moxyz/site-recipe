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
```

## Product slice

The MVP helps a beginner:

1. Describe an idea and audience.
2. Choose a visual direction.
3. Pick the page's essential sections.
4. Pick useful UI patterns.
5. Set a motion level.
6. Decide whether the site is public or gated.
7. Copy a structured prompt for ChatGPT Sites.

Reference material includes [Name That UI](https://namethatui.com/), [shadcn/ui](https://ui.shadcn.com/), [Motion Sites](https://motionsites.ai/), and [Awwwards](https://www.awwwards.com/). We borrow vocabulary and interaction ideas, not protected assets or copied designs.
