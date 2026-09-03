# FORET — Site Recipe

## Foundation

Site Recipe helps first-time and non-designer site builders understand the decisions that shape a useful website. The output is a clear prompt for ChatGPT Sites, not generated code or a hosted account system.

## Organization

The MVP is a single Vinext/React route. Curated options live locally as typed data, recipe selections stay in React state, and the final prompt is composed deterministically in the browser.

## Reference experience

- Name That UI informs plain-language names for interface patterns.
- shadcn/ui informs the split between small components and assembled sections.
- Motion Sites informs previewable motion directions.
- Awwwards informs the final taste and quality checklist without importing award-site spectacle.
- Manus Creator Program informs the promise → choices → examples → action progression.

## Experience goals

- Reach the useful result in under two minutes.
- Show real choices instead of teaching through a passive tour.
- Update the site recipe immediately as selections change.
- Prefer confident defaults and progressive disclosure.
- Keep the output editable and copyable.

## Technical context

- Runtime: Vinext on React 19.
- Styling: plain CSS (no Tailwind, no shadcn). Shared tokens live in `app/globals.css`.
- Components: hand-written primitives in `components/recipe/`; pure recipe logic lives in `lib/recipe/`.
- Hosting: ChatGPT Sites via `.openai/hosting.json`.
- Persistence/authentication: none in the MVP; access methods are planning choices only.
- Sharing: a custom 1200 × 630 social card lives at `public/og.jpg`; a recipe can also be shared via a URL hash that restores every choice.
- Testing: `npm test` runs the `lib/recipe/*.test.ts` vitest suite covering the pure catalog, prompt-building, and URL-state logic.

## Implementation notes

- The sticky build ticket is the walkthrough's persistent feedback surface; every choice updates it immediately.
- On wide screens the ticket is capped to the available viewport and scrolls independently; below 980px it returns to normal document flow and a mobile brief sheet (`mobile-brief-bar.tsx`) opens the same ticket from a fixed summary bar.
- The ticket lists every selected section and UI pattern by name, while its miniature preview also reflects direction, shape, selection counts, motion, and access, and the decision list adds an Audience row once that field is filled.
- The generated prompt is intentionally deterministic so the same recipe always produces the same brief, and it stays editable in a textarea before copying or sending to ChatGPT.
- Each site shape ships a starter set of default sections and patterns; picking a shape applies its defaults unless the visitor has already customized away from the previous shape's defaults, and a "Use the starter set" button can reapply them explicitly.
- A small set of curated mismatch hints (at most two at a time) flag combinations that are usually a mistake, like a command menu on an event page.
- CSS previews communicate visual direction, UI patterns, and motion without making external assets part of the critical path.
- Desktop and narrow mobile layouts must remain usable without horizontal overflow, and motion respects `prefers-reduced-motion`.
- Recipe state round-trips through the URL hash (`lib/recipe/url-state.ts`), so a shared link restores the exact same choices.

## Known boundaries

- Do not implement real OAuth, email codes, phone OTP, or role management during the hackathon slice.
- Do not depend on live external catalogs for the critical path.
- Do not turn the page into a comprehensive design reference library.
- Event-specific framing can be added later without changing the decision funnel.

## Lessons

- **The article bug ("a event", "a editorial").** Early prompt text glued a fixed article ("a") in front of whatever word the visitor's choice produced, so shapes and directions starting with a vowel sound read as grammatically broken ("a event", "a editorial"). The tempting fix is an a/an helper that checks the first letter, but that still breaks on words like "hour" or acronyms, and it couples grammar logic to catalog labels that can change independently. The real fix was to restructure the sentence so no article sits directly in front of a variable word — "Type: Event." instead of "Type: a event." Removing the seam removes the whole class of bug instead of patching one symptom of it.
- **The progress bar counted clicks, not completeness.** The original header counter tracked which steps had been "reviewed" — it started at 2 on load and only moved when a Next button or an option was clicked — while every choice was already prefilled. So the page said "2 / 6" beside a ticket that said "Complete", and the two never agreed. The fix, `completedSteps()` in `lib/recipe/progress.ts`, derives the number from the recipe itself: it asks "is step N filled in right now?" for each of the six steps. State you can compute from the data should never be stored as separate history; the two copies drift apart the moment someone changes their mind.
- **The live brief was unreachable on mobile.** The build ticket lived in a sticky sidebar that simply disappeared below the 980px breakpoint, so mobile visitors had no way to see the thing the whole flow was building toward until they scrolled to the finish panel. The fix wasn't to cram the sidebar back onto small screens — it was to give mobile its own affordance: a fixed bottom summary bar (`mobile-brief-bar.tsx`) that opens the same brief in a native `<dialog>` sheet on demand. Same data, a layout suited to the viewport instead of a shrunken desktop one.
- **ARIA labels on plain `div`s were ignored.** Several choice groups and progress indicators were built as styled `div`s with `aria-label`/`aria-labelledby` attached, but without a matching ARIA role a screen reader has no reason to expose those attributes — they only apply to elements with an appropriate role. The fix was pairing every such label with an explicit role (`role="progressbar"`, `role="group"`, `role="status"`) so the accessibility tree actually carries the name instead of silently dropping it. Attributes don't create semantics on their own; the role has to ask for them.
- **The mono font never rendered, and nobody noticed.** `DESIGN.md` promised Geist Mono for labels and the brief, and the font file was downloaded on every visit, yet every label rendered in DM Sans. The token was declared as `--font-mono: var(--font-utility)` on `:root`, but `next/font` attaches `--font-utility` to `<body>`, one level lower. A `var()` that points at a custom property which does not exist on that element is invalid at computed-value time, so `--font-mono` resolved to nothing and every `font-family: var(--font-mono), monospace` fell through to the body font. Re-declaring the token on `body`, where the value actually exists, fixed it in one rule. The lesson: check `document.fonts` (a face that stays `unloaded` is a face nobody uses) and remember that custom properties resolve where they are declared, not where they are read.
