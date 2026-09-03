# Design System — Site Recipe

## Product Context

- **What this is:** A guided decision tool that turns a loose website idea into a coherent, paste-ready ChatGPT Sites brief.
- **Who it's for:** First-time and non-designer site builders working quickly.
- **Space/industry:** AI-assisted site creation, design education, and developer tools.
- **Project type:** A single-page interactive onboarding experience.

## Aesthetic Direction

- **Direction:** Maker's field guide — an editorial workshop surface rather than a glossy generator.
- **Decoration level:** Intentional. Grid lines, numbered stages, and ticket-like summaries encode progress and decisions.
- **Mood:** Clear, curious, tactile, and confidence-building.
- **Reference sites:** https://namethatui.com/, https://ui.shadcn.com/, https://motionsites.ai/, https://www.awwwards.com/, https://creatorprogram.manus.space/

## Typography

- **Display/Hero:** Bricolage Grotesque — expressive enough to feel authored while remaining approachable.
- **Body:** DM Sans — highly readable at interface sizes and friendly without becoming childish.
- **UI/Labels:** DM Sans for actions; Geist Mono for step labels, metadata, and the generated brief.
- **Data/Tables:** Geist Mono with tabular numerals.
- **Code:** Geist Mono.
- **Loading:** `next/font` self-hosted output.
- **Scale:** 12, 14, 16, 20, 28, 48, 72, and fluid 52–122px display sizes.

## Color

- **Approach:** Balanced with one decisive blue and two warm signals.
- **Primary:** `#2454FF` workshop blue — selections, focus, and important progress.
- **Secondary:** `#FF6547` signal coral — supporting emphasis and completion details.
- **Neutrals:** cool paper `#F4F7F2`, white `#FFFFFF`, line `#CBD3CC`, ink `#17221B`.
- **Supporting:** mint `#D9F3E2`, pale blue `#DFE8FF`, yellow `#FFE76A`.
- **Semantic:** success `#188A50`, warning `#A56600`, error `#C73232`, info `#2454FF`.
- **Dark mode:** Not exposed in the time-boxed MVP; system tokens retain enough separation for a future redesigned dark palette.

## Spacing

- **Base unit:** 4px.
- **Density:** Comfortable, with compact metadata and spacious decision stages.
- **Scale:** 2xs 4, xs 8, sm 12, md 16, lg 24, xl 32, 2xl 48, 3xl 72, 4xl 112.

## Layout

- **Approach:** Hybrid: a disciplined sequential builder beside a sticky live recipe ticket.
- **Grid:** 12-column desktop expressed as roughly 8 columns for choices and 4 for the live brief; single-column below 980px.
- **Max content width:** 1440px.
- **Border radius:** 4px small, 8px controls, 12px cards, 14px ticket, full for selection indicators.

## Motion

- **Approach:** Intentional and functional. Selection and live-preview transitions show cause and effect.
- **Easing:** enter `ease-out`, exit `ease-in`, move `ease-in-out`.
- **Duration:** micro 100ms, short 160–200ms, medium 240–320ms.
- **Reduced motion:** Remove smooth scrolling, transitions, and nonessential animation.

## Safe Choices

- Ordered steps, visible progress, and smart defaults make the unfamiliar task legible.
- Familiar cards and form controls keep the learning curve low.
- High contrast and persistent feedback make every choice understandable.

## Deliberate Risks

- The sticky build ticket feels like a real artifact taking shape rather than a generic summary sidebar.
- Saturated workshop colors create a memorable face without covering the page in gradients.
- Oversized, tightly set display type gives the first screen personality while the working controls stay restrained.

## Decisions Log

| Date       | Decision                                                                                                                                                                                                           | Rationale                                                                                                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-09-02 | Initial design system created                                                                                                                                                                                      | Based on the creator's approved light, confident, playful editorial direction and supplied references.                                                                                             |
| 2026-09-03 | Review round 1: dropped Tailwind/shadcn for hand-written CSS and components; added an audience field, shape starter sets with mismatch hints, an editable build prompt, URL-hash sharing, and a mobile brief sheet | Removes a dependency surface the hackathon build didn't need, fixes a11y and mobile-reachability gaps found in review, and lets a visitor's link-sharing and prompt edits stay in their own hands. |
