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
- Styling: Tailwind CSS 4 with shared tokens in `app/globals.css`.
- Components: generated shadcn primitives in `components/ui/`.
- Hosting: ChatGPT Sites via `.openai/hosting.json`.
- Persistence/authentication: none in the MVP; access methods are planning choices only.
- Sharing: a custom 1200 × 630 social card lives at `public/og.png`.

## Implementation notes

- The sticky build ticket is the walkthrough's persistent feedback surface; every choice updates it immediately.
- On wide screens the ticket is capped to the available viewport and scrolls independently; below 980px it returns to normal document flow.
- The ticket lists every selected section and UI pattern by name, while its miniature preview also reflects direction, shape, selection counts, motion, and access.
- The generated prompt is intentionally deterministic so the same recipe always produces the same brief.
- CSS previews communicate visual direction, UI patterns, and motion without making external assets part of the critical path.
- Desktop and narrow mobile layouts must remain usable without horizontal overflow, and motion respects `prefers-reduced-motion`.

## Known boundaries

- Do not implement real OAuth, email codes, phone OTP, or role management during the hackathon slice.
- Do not depend on live external catalogs for the critical path.
- Do not turn the page into a comprehensive design reference library.
- Event-specific framing can be added later without changing the decision funnel.
