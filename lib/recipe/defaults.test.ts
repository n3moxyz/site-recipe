import { describe, expect, it } from 'vitest';

import {
  applyShape,
  applyStarterSet,
  defaultPatternsFor,
  defaultSectionsFor,
  matchesStarterSet,
  mismatchHints,
  normalizePatterns,
  normalizeSections,
  togglePattern,
  toggleSection,
} from './defaults';
import { emptyRecipe } from './types';
import type { Recipe } from './types';

function make(patch: Partial<Recipe>): Recipe {
  return { ...emptyRecipe, ...patch };
}

function hintIds(recipe: Recipe): string[] {
  return mismatchHints(recipe).map((hint) => hint.id);
}

describe('normalizers', () => {
  it('drops unknown ids, dedupes, and restores catalog order', () => {
    expect(normalizeSections(['cta', 'nope', 'hero', 'hero'])).toEqual([
      'hero',
      'cta',
    ]);
    expect(normalizePatterns(['dialog', 'bento', 'bogus'])).toEqual([
      'bento',
      'dialog',
    ]);
  });

  it('lets plain win over every other pattern', () => {
    expect(normalizePatterns(['bento', 'plain', 'tabs'])).toEqual(['plain']);
  });
});

describe('applyShape', () => {
  it('fills empty lists with the new shape defaults', () => {
    const next = applyShape(emptyRecipe, 'shop');
    expect(next.shape).toBe('shop');
    expect(next.sections).toEqual(defaultSectionsFor('shop'));
    expect(next.patterns).toEqual(defaultPatternsFor('shop'));
  });

  it('stores the shop starter set in catalog order', () => {
    expect(defaultSectionsFor('shop')).toEqual([
      'hero',
      'features',
      'gallery',
      'faq',
      'cta',
    ]);
  });

  it('replaces the previous shape defaults', () => {
    const event = applyShape(emptyRecipe, 'event');
    const product = applyShape(event, 'product');
    expect(product.sections).toEqual(defaultSectionsFor('product'));
    expect(product.patterns).toEqual(defaultPatternsFor('product'));
  });

  it('replaces defaults even when they were reordered', () => {
    const event = make({
      shape: 'event',
      sections: ['cta', 'proof', 'gallery', 'how-it-works', 'hero'],
      patterns: ['accordion', 'bento'],
    });
    const landing = applyShape(event, 'landing');
    expect(landing.sections).toEqual(defaultSectionsFor('landing'));
    expect(landing.patterns).toEqual(defaultPatternsFor('landing'));
  });

  it('keeps hand-picked lists', () => {
    const custom = make({
      shape: 'event',
      sections: ['hero', 'faq'],
      patterns: ['command'],
    });
    const next = applyShape(custom, 'product');
    expect(next.sections).toEqual(['hero', 'faq']);
    expect(next.patterns).toEqual(['command']);
  });

  it('treats a null previous shape as having no defaults', () => {
    const custom = make({ sections: ['faq'], patterns: ['plain'] });
    const next = applyShape(custom, 'landing');
    expect(next.sections).toEqual(['faq']);
    expect(next.patterns).toEqual(['plain']);
  });

  it('decides sections and patterns independently', () => {
    const mixed = make({
      shape: 'landing',
      sections: ['hero', 'pricing', 'faq'],
      patterns: defaultPatternsFor('landing'),
    });
    const next = applyShape(mixed, 'event');
    expect(next.sections).toEqual(['hero', 'pricing', 'faq']);
    expect(next.patterns).toEqual(defaultPatternsFor('event'));
  });

  it('does not mutate the input recipe', () => {
    const before = make({
      shape: 'event',
      sections: ['hero'],
      patterns: ['tabs'],
    });
    applyShape(before, 'shop');
    expect(before.shape).toBe('event');
    expect(before.sections).toEqual(['hero']);
    expect(before.patterns).toEqual(['tabs']);
  });
});

describe('applyStarterSet', () => {
  it('forces the current shape defaults', () => {
    const custom = make({ shape: 'event', sections: ['faq'], patterns: [] });
    const next = applyStarterSet(custom);
    expect(next.sections).toEqual(defaultSectionsFor('event'));
    expect(next.patterns).toEqual(defaultPatternsFor('event'));
  });

  it('is a no-op without a shape', () => {
    const custom = make({ sections: ['faq'] });
    expect(applyStarterSet(custom)).toBe(custom);
  });
});

describe('matchesStarterSet', () => {
  it('is true for an untouched shape and false after a change', () => {
    const event = applyShape(emptyRecipe, 'event');
    expect(matchesStarterSet(event)).toBe(true);
    expect(matchesStarterSet(toggleSection(event, 'pricing'))).toBe(false);
    expect(matchesStarterSet(togglePattern(event, 'command'))).toBe(false);
  });

  it('is true when no shape is chosen', () => {
    expect(matchesStarterSet(emptyRecipe)).toBe(true);
  });
});

describe('toggleSection', () => {
  it('adds in catalog order and removes on a second call', () => {
    const one = toggleSection(emptyRecipe, 'cta');
    const two = toggleSection(one, 'hero');
    expect(two.sections).toEqual(['hero', 'cta']);
    expect(toggleSection(two, 'hero').sections).toEqual(['cta']);
  });
});

describe('togglePattern', () => {
  it('adds in catalog order and removes on a second call', () => {
    const one = togglePattern(emptyRecipe, 'dialog');
    const two = togglePattern(one, 'bento');
    expect(two.patterns).toEqual(['bento', 'dialog']);
    expect(togglePattern(two, 'bento').patterns).toEqual(['dialog']);
  });

  it('clears every other pattern when plain is chosen', () => {
    const busy = make({ patterns: ['bento', 'tabs'] });
    expect(togglePattern(busy, 'plain').patterns).toEqual(['plain']);
  });

  it('drops plain when another pattern is chosen', () => {
    const plain = make({ patterns: ['plain'] });
    expect(togglePattern(plain, 'tabs').patterns).toEqual(['tabs']);
  });

  it('turns plain off again', () => {
    const plain = make({ patterns: ['plain'] });
    expect(togglePattern(plain, 'plain').patterns).toEqual([]);
  });
});

describe('mismatchHints', () => {
  it('returns nothing for a coherent recipe', () => {
    expect(mismatchHints(applyShape(emptyRecipe, 'event'))).toEqual([]);
  });

  it('flags a command menu on an event page', () => {
    const recipe = make({ shape: 'event', patterns: ['command'] });
    expect(mismatchHints(recipe)[0]).toEqual({
      id: 'pattern-event-command',
      text: 'Command menus rarely help an event page. A clear header link to the RSVP usually does more.',
    });
  });

  it('flags pricing on a portfolio', () => {
    const recipe = make({
      shape: 'portfolio',
      sections: ['hero', 'pricing'],
      patterns: ['plain'],
    });
    expect(hintIds(recipe)).toEqual(['section-portfolio-pricing']);
  });

  it('flags a shop with no gallery', () => {
    const recipe = make({
      shape: 'shop',
      sections: ['hero', 'features'],
      patterns: ['plain'],
    });
    expect(hintIds(recipe)).toEqual(['section-shop-gallery']);
  });

  it('flags event pricing without a final action', () => {
    const recipe = make({
      shape: 'event',
      sections: ['hero', 'pricing'],
      patterns: ['plain'],
    });
    expect(hintIds(recipe)).toEqual(['section-event-pricing-cta']);
  });

  it('flags an overlong landing page', () => {
    const recipe = make({
      shape: 'landing',
      sections: [
        'hero',
        'how-it-works',
        'features',
        'gallery',
        'proof',
        'pricing',
        'cta',
      ],
      patterns: ['plain'],
    });
    expect(hintIds(recipe)).toEqual(['section-landing-count']);
  });

  it('flags expressive motion against a precise direction', () => {
    const recipe = make({ motion: 'expressive', direction: 'precise' });
    expect(hintIds(recipe)).toEqual(['motion-expressive-precise']);
  });

  it('flags phone codes on a community site', () => {
    const recipe = make({
      shape: 'community',
      access: 'phone',
      sections: ['hero'],
      patterns: ['plain'],
    });
    expect(hintIds(recipe)).toEqual(['access-phone-community']);
  });

  it('flags an FAQ without an accordion, unless plain is chosen', () => {
    const recipe = make({ sections: ['faq'], patterns: ['bento'] });
    expect(hintIds(recipe)).toEqual(['pattern-faq-accordion']);
    expect(hintIds(make({ sections: ['faq'], patterns: ['plain'] }))).toEqual(
      [],
    );
    expect(
      hintIds(make({ sections: ['faq'], patterns: ['accordion'] })),
    ).toEqual([]);
  });

  it('returns at most two hints, in the curated order', () => {
    const recipe = make({
      shape: 'event',
      direction: 'precise',
      motion: 'expressive',
      sections: ['hero', 'pricing', 'faq'],
      patterns: ['command'],
      access: 'phone',
    });
    expect(hintIds(recipe)).toEqual([
      'pattern-event-command',
      'section-event-pricing-cta',
    ]);
  });

  it('prefixes every hint id with the step it belongs to', () => {
    const recipe = make({
      shape: 'community',
      access: 'phone',
      sections: ['faq'],
      patterns: ['bento'],
    });
    for (const hint of mismatchHints(recipe)) {
      expect(hint.id).toMatch(/^(section|pattern|motion|access)-/);
    }
  });
});
