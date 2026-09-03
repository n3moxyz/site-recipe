import { useEffect, useMemo, useRef, useState } from 'react';

import { buildPrompt } from '@/lib/recipe/build-prompt';
import {
  applyShape,
  applyStarterSet,
  mismatchHints,
  togglePattern,
  toggleSection,
} from '@/lib/recipe/defaults';
import {
  completedSteps,
  isRecipeReady,
  stepStatus,
} from '@/lib/recipe/progress';
import { defaultRecipe, starters } from '@/lib/recipe/starters';
import type {
  AccessOption,
  MotionLevel,
  PageSection,
  Recipe,
  SiteShape,
  UiPattern,
  VisualDirection,
} from '@/lib/recipe/types';
import { emptyRecipe } from '@/lib/recipe/types';
import { decodeRecipe, encodeRecipe } from '@/lib/recipe/url-state';

const HASH_DEBOUNCE_MS = 200;
const PULSE_MS = 900;

/** The recipe the app loads with needs no hash; a shared link always has one. */
const DEFAULT_HASH = encodeRecipe(defaultRecipe);

/**
 * A cleared recipe encodes to '', so it needs a marker of its own. Without one
 * "Start over" would leave a bare URL, and a bare URL reloads as the starter —
 * the opposite of what the button just did. The marker cannot be an empty
 * value like `#name=`: `decodeRecipe` (lib/recipe/url-state.ts) only accepts a
 * hash where a known key carries a *value*, because `#motion` and `#access`
 * are real section anchors on this page. So the blank state gets a key of its
 * own, read here before decoding and never passed to `decodeRecipe`.
 *
 * This is a deliberate deviation from the spec's "Start over (also clears the
 * hash)": the address bar keeps `#blank=1` rather than going bare, because a
 * bare URL would silently undo the reset on the next reload.
 */
const BLANK_HASH = '#blank=1';

/** Reads the hash on load: our blank marker first, then a shared recipe. */
function readHash(): Recipe | null {
  if (location.hash === BLANK_HASH) return emptyRecipe;
  return decodeRecipe(location.hash);
}

/** The starter owns the bare URL, a blank recipe owns `#blank=1`. */
function hashUrl(recipe: Recipe): string {
  const hash = encodeRecipe(recipe);
  if (hash === DEFAULT_HASH) return location.pathname + location.search;
  return hash ? `#${hash}` : BLANK_HASH;
}

/**
 * WebKit rate-limits the history API — roughly 100 calls per 30 seconds, then
 * `replaceState` throws `SecurityError`. This runs from a `setTimeout`, so no
 * React error boundary sits above it and an uncaught throw would surface as an
 * unhandled error. Swallowing it degrades a throttled write to "the hash lags
 * behind the choices" instead, and the next edit writes the full state again.
 */
function writeHash(recipe: Recipe) {
  try {
    history.replaceState(null, '', hashUrl(recipe));
  } catch {
    // Throttled by the browser; the next write carries the same state.
  }
}

/**
 * "Start over" sits at the bottom of the page, so scrolling to the top while
 * focus stays on the button strands keyboard and screen-reader users on an
 * off-screen element — the next Tab throws the viewport back down (WCAG
 * 2.4.3). Moving focus to the first field fixes both: it lands where the user
 * now starts, and the scroll brings it into view. The `#top` scroll stays as a
 * fallback in case the field is not in the DOM. Neither call passes
 * `behavior`, so both inherit the page's `scroll-behavior` — smooth normally,
 * instant under the reduced-motion block in app/globals.css.
 */
function focusStart() {
  const field = document.getElementById('project-name');
  if (field) {
    field.focus({ preventScroll: true });
    field.scrollIntoView({ block: 'center' });
    return;
  }
  document.getElementById('top')?.scrollIntoView();
}

/**
 * Owns the whole recipe. Every write goes through `update()`, which runs the
 * pure helpers from `lib/recipe`, pulses the live brief, and debounces the URL
 * hash — so the catalog-order and 'plain'-exclusivity invariants hold no
 * matter which control the user touched.
 */
export function useRecipe() {
  const [recipe, setRecipe] = useState<Recipe>(defaultRecipe);
  const [briefPulse, setBriefPulse] = useState(false);
  const pulseTimer = useRef(0);
  const hashTimer = useRef(0);

  useEffect(() => {
    const shared = readHash();
    // The hash does not exist while the page is server-rendered, so a shared
    // recipe can only replace the default once we are in the browser. This is
    // the one state update that genuinely has to happen inside an effect.
    // oxlint-disable-next-line react/react-compiler
    if (shared) setRecipe(shared);
    return () => {
      window.clearTimeout(pulseTimer.current);
      window.clearTimeout(hashTimer.current);
    };
  }, []);

  function update(next: Recipe) {
    setRecipe(next);
    setBriefPulse(true);
    window.clearTimeout(pulseTimer.current);
    pulseTimer.current = window.setTimeout(
      () => setBriefPulse(false),
      PULSE_MS,
    );
    window.clearTimeout(hashTimer.current);
    hashTimer.current = window.setTimeout(
      () => writeHash(next),
      HASH_DEBOUNCE_MS,
    );
  }

  const prompt = useMemo(() => buildPrompt(recipe), [recipe]);
  const steps = useMemo(() => stepStatus(recipe), [recipe]);
  const hints = useMemo(() => mismatchHints(recipe), [recipe]);

  return {
    recipe,
    briefPulse,
    prompt,
    hints,
    stepStatus: steps,
    completed: completedSteps(recipe),
    ready: isRecipeReady(recipe),

    setName: (value: string) => update({ ...recipe, name: value }),
    setIdea: (value: string) => update({ ...recipe, idea: value }),
    setAudience: (value: string) => update({ ...recipe, audience: value }),
    setDirection: (id: VisualDirection) => update({ ...recipe, direction: id }),
    setShape: (id: SiteShape) => update(applyShape(recipe, id)),
    setMotion: (id: MotionLevel) => update({ ...recipe, motion: id }),
    setAccess: (id: AccessOption) => update({ ...recipe, access: id }),
    toggleSection: (id: PageSection) => update(toggleSection(recipe, id)),
    togglePattern: (id: UiPattern) => update(togglePattern(recipe, id)),
    useStarterSet: () => update(applyStarterSet(recipe)),
    applyStarter: (index: number) => update(starters[index].recipe),

    reset: () => {
      update(emptyRecipe);
      focusStart();
    },

    /** Share reads `location.href`, so the pending hash must land first. */
    flushHash: () => {
      window.clearTimeout(hashTimer.current);
      writeHash(recipe);
    },
  };
}
