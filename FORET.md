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

## Known boundaries

- Do not implement real OAuth, email codes, phone OTP, or role management during the hackathon slice.
- Do not depend on live external catalogs for the critical path.
- Do not turn the page into a comprehensive design reference library.
- Event-specific framing and final visual direction will be added from the organizer's Luma page and creator input.

