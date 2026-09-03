import { describe, expect, it } from 'vitest';

import {
  defaultPatternsFor,
  defaultSectionsFor,
  mismatchHints,
  normalizePatterns,
  normalizeSections,
} from './defaults';
import { defaultRecipe, starters } from './starters';

describe('starters', () => {
  it('offers exactly three varied ideas', () => {
    expect(starters.map((starter) => starter.name)).toEqual([
      'Night Garden Walk',
      'Sunday Kiln',
      'Freelance Ledger',
    ]);
  });

  it('varies the page shape and visual direction across every idea', () => {
    expect(new Set(starters.map(({ recipe }) => recipe.shape)).size).toBe(
      starters.length,
    );
    expect(new Set(starters.map(({ recipe }) => recipe.direction)).size).toBe(
      starters.length,
    );
  });

  it('loads Night Garden Walk by default', () => {
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

  it('uses coherent section and pattern sets', () => {
    expect(starters[0].recipe.sections).toEqual(defaultSectionsFor('event'));
    expect(starters[0].recipe.patterns).toEqual(defaultPatternsFor('event'));
    expect(starters[1].recipe.sections).toEqual([
      'hero',
      'gallery',
      'faq',
      'cta',
    ]);
    expect(starters[1].recipe.patterns).toEqual([
      'accordion',
      ...defaultPatternsFor('shop'),
    ]);
    expect(starters[2].recipe.sections).toEqual(defaultSectionsFor('product'));
    expect(starters[2].recipe.patterns).toEqual(defaultPatternsFor('product'));
  });

  it('starts without mismatch hints', () => {
    for (const { recipe } of starters) {
      expect(mismatchHints(recipe)).toEqual([]);
    }
  });
});
