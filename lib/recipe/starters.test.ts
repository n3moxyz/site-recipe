import { describe, expect, it } from 'vitest';

import {
  defaultPatternsFor,
  defaultSectionsFor,
  normalizePatterns,
  normalizeSections,
} from './defaults';
import { defaultRecipe, starters } from './starters';

describe('starters', () => {
  it('offers exactly the three original ideas', () => {
    expect(starters.map((starter) => starter.name)).toEqual([
      'Neighborhood Table',
      'Studio Index',
      'Tiny Field Notes',
    ]);
  });

  it('loads Neighborhood Table by default', () => {
    expect(defaultRecipe).toBe(starters[0].recipe);
  });

  it('names each recipe after its starter', () => {
    for (const starter of starters) {
      expect(starter.recipe.name).toBe(starter.name);
    }
  });

  it('fills every field', () => {
    for (const { recipe } of starters) {
      expect(recipe.idea.length).toBeGreaterThan(0);
      expect(recipe.audience.length).toBeGreaterThan(0);
      expect(recipe.direction).not.toBeNull();
      expect(recipe.shape).not.toBeNull();
      expect(recipe.sections.length).toBeGreaterThan(0);
      expect(recipe.patterns.length).toBeGreaterThan(0);
      expect(recipe.motion).not.toBeNull();
      expect(recipe.access).not.toBeNull();
    }
  });

  it('stores lists in catalog order with valid ids', () => {
    for (const { recipe } of starters) {
      expect(normalizeSections(recipe.sections)).toEqual(recipe.sections);
      expect(normalizePatterns(recipe.patterns)).toEqual(recipe.patterns);
    }
  });

  it('uses the shape starter set where the recipe follows it', () => {
    expect(starters[0].recipe.sections).toEqual(defaultSectionsFor('event'));
    expect(starters[0].recipe.patterns).toEqual(defaultPatternsFor('event'));
    expect(starters[1].recipe.sections).toEqual(
      defaultSectionsFor('portfolio'),
    );
    expect(starters[1].recipe.patterns).toEqual(
      defaultPatternsFor('portfolio'),
    );
    expect(starters[2].recipe.sections).toEqual(defaultSectionsFor('landing'));
    expect(starters[2].recipe.patterns).toEqual(['plain']);
  });
});
