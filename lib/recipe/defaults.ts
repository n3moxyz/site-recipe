import { pageSections, siteShapes, uiPatterns } from './catalog';
import type { PageSection, Recipe, SiteShape, UiPattern } from './types';

export type Hint = { id: string; text: string };

const sectionOrder = pageSections.map((item) => item.id);
const patternOrder = uiPatterns.map((item) => item.id);

/** Drops unknown ids, removes duplicates, and restores catalog order. */
export function normalizeSections(ids: readonly string[]): PageSection[] {
  return sectionOrder.filter((id) => ids.includes(id));
}

/** Same as `normalizeSections`, plus 'plain' wins over every other pattern. */
export function normalizePatterns(ids: readonly string[]): UiPattern[] {
  if (ids.includes('plain')) return ['plain'];
  return patternOrder.filter((id) => ids.includes(id));
}

function shapeEntry(shape: SiteShape) {
  const entry = siteShapes.find((item) => item.id === shape);
  // Every SiteShape comes from the catalog, so this cannot be undefined.
  return entry ?? siteShapes[0];
}

export function defaultSectionsFor(shape: SiteShape): PageSection[] {
  return normalizeSections(shapeEntry(shape).defaultSections);
}

export function defaultPatternsFor(shape: SiteShape): UiPattern[] {
  return normalizePatterns(shapeEntry(shape).defaultPatterns);
}

function sameSet(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((item) => b.includes(item));
}

/**
 * Keeps a hand-picked list, replaces an untouched one. "Untouched" means the
 * list is empty or still exactly the previous shape's starter set.
 */
function nextList<T extends string>(
  current: readonly T[],
  previousDefaults: readonly T[],
  nextDefaults: T[],
): T[] {
  if (current.length === 0 || sameSet(current, previousDefaults)) {
    return nextDefaults;
  }
  return [...current];
}

export function applyShape(recipe: Recipe, shape: SiteShape): Recipe {
  const previous = recipe.shape;
  return {
    ...recipe,
    shape,
    sections: nextList(
      recipe.sections,
      previous ? defaultSectionsFor(previous) : [],
      defaultSectionsFor(shape),
    ),
    patterns: nextList(
      recipe.patterns,
      previous ? defaultPatternsFor(previous) : [],
      defaultPatternsFor(shape),
    ),
  };
}

/** Forces the current shape's starter set. No-op when no shape is chosen. */
export function applyStarterSet(recipe: Recipe): Recipe {
  if (!recipe.shape) return recipe;
  return {
    ...recipe,
    sections: defaultSectionsFor(recipe.shape),
    patterns: defaultPatternsFor(recipe.shape),
  };
}

/** True when there is nothing a starter-set button could change. */
export function matchesStarterSet(recipe: Recipe): boolean {
  if (!recipe.shape) return true;
  return (
    sameSet(recipe.sections, defaultSectionsFor(recipe.shape)) &&
    sameSet(recipe.patterns, defaultPatternsFor(recipe.shape))
  );
}

export function toggleSection(recipe: Recipe, id: PageSection): Recipe {
  const next = recipe.sections.includes(id)
    ? recipe.sections.filter((item) => item !== id)
    : [...recipe.sections, id];
  return { ...recipe, sections: normalizeSections(next) };
}

export function togglePattern(recipe: Recipe, id: UiPattern): Recipe {
  if (id === 'plain') {
    const on = recipe.patterns.includes('plain');
    return { ...recipe, patterns: on ? [] : ['plain'] };
  }
  const others = recipe.patterns.filter((item) => item !== 'plain');
  const next = others.includes(id)
    ? others.filter((item) => item !== id)
    : [...others, id];
  return { ...recipe, patterns: normalizePatterns(next) };
}

type Rule = Hint & { when: (recipe: Recipe) => boolean };

const rules: Rule[] = [
  {
    id: 'pattern-event-command',
    text: 'Command menus rarely help an event page. A clear header link to the RSVP usually does more.',
    when: (recipe) =>
      recipe.shape === 'event' && recipe.patterns.includes('command'),
  },
  {
    id: 'section-portfolio-pricing',
    text: "Pricing is unusual on a portfolio. A short 'how I work' note inside Proof or the final action usually fits better.",
    when: (recipe) =>
      recipe.shape === 'portfolio' && recipe.sections.includes('pricing'),
  },
  {
    id: 'section-shop-gallery',
    text: 'A shop without a Gallery has nowhere to show the products. Add Gallery or switch the page type.',
    when: (recipe) =>
      recipe.shape === 'shop' && !recipe.sections.includes('gallery'),
  },
  {
    id: 'section-event-pricing-cta',
    text: 'If tickets cost money, pair Pricing with a Final action so people can actually buy.',
    when: (recipe) =>
      recipe.shape === 'event' &&
      recipe.sections.includes('pricing') &&
      !recipe.sections.includes('cta'),
  },
  {
    id: 'section-landing-count',
    text: 'Landing pages work best with five sections or fewer. Cut anything that does not support the main action.',
    when: (recipe) => recipe.shape === 'landing' && recipe.sections.length > 6,
  },
  {
    id: 'motion-expressive-precise',
    text: 'Expressive motion fights a precise direction. Consider Subtle so the grid stays calm.',
    when: (recipe) =>
      recipe.motion === 'expressive' && recipe.direction === 'precise',
  },
  {
    id: 'access-phone-community',
    text: 'Phone codes add cost and friction for a community site. Email code keeps joining low-risk.',
    when: (recipe) => recipe.access === 'phone' && recipe.shape === 'community',
  },
  {
    id: 'pattern-faq-accordion',
    text: 'An FAQ usually reads best as an Accordion, or as a plain list.',
    when: (recipe) =>
      recipe.sections.includes('faq') &&
      !recipe.patterns.includes('accordion') &&
      !recipe.patterns.includes('plain'),
  },
];

/** At most two hints, in the curated order above. */
export function mismatchHints(recipe: Recipe): Hint[] {
  return rules
    .filter((rule) => rule.when(recipe))
    .slice(0, 2)
    .map(({ id, text }) => ({ id, text }));
}
