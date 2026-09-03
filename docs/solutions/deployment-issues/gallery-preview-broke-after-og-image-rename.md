# Gallery preview broke after the Open Graph image rename

**Date**: 2026-09-04
**Project**: site-recipe
**Category**: deployment-issue

## Symptoms

- The “Sites Recipe” card in the Singapore hackathon gallery showed “Preview unavailable.”
- The site itself loaded normally and its current Open Graph image was valid.
- The gallery requested `https://site-recipe.n3mooo.chatgpt.site/og.png`, which returned a 404.

## Root Cause

The gallery persisted the `/og.png` cover URL when the submission was indexed. A later release optimized the same 1200 × 630 artwork into `public/og.jpg`, updated the Open Graph and Twitter metadata, and deleted `public/og.png`. The gallery did not re-scrape the metadata, so its stored image URL became a broken external reference.

## Solution

Restore `public/og.png` as a backwards-compatible asset while keeping the smaller `public/og.jpg` as the canonical metadata image, then rebuild and deploy the site.

Verify the exact gallery request, including its cache-busting query string, returns `200 image/png` before checking that the card renders in the gallery.

## Prevention

- Treat published image URLs as stable API paths; add aliases before renaming or removing them.
- Keep `og.png` and `og.jpg` covered by a regression test that checks their file signatures and 1200 × 630 dimensions.
- Verify both current page metadata and any known external gallery URL after each production deployment.
