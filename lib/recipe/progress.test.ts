import { describe, expect, it } from 'vitest';

import { completedSteps, isRecipeReady, stepStatus } from './progress';
import { starters } from './starters';
import { emptyRecipe } from './types';
import type { Recipe } from './types';

function make(patch: Partial<Recipe>): Recipe {
  return { ...emptyRecipe, ...patch };
}

describe('completedSteps', () => {
  it('counts nothing for an empty recipe', () => {
    expect(completedSteps(emptyRecipe)).toBe(0);
    expect(stepStatus(emptyRecipe)).toEqual([
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
    expect(isRecipeReady(emptyRecipe)).toBe(false);
  });

  it('counts all six for every starter', () => {
    for (const starter of starters) {
      expect(completedSteps(starter.recipe)).toBe(6);
      expect(isRecipeReady(starter.recipe)).toBe(true);
    }
  });

  it('needs both a name and an idea for step one', () => {
    expect(stepStatus(make({ name: 'A' }))[0]).toBe(false);
    expect(stepStatus(make({ idea: 'B' }))[0]).toBe(false);
    expect(stepStatus(make({ name: '  ', idea: 'B' }))[0]).toBe(false);
    expect(stepStatus(make({ name: 'A', idea: 'B' }))[0]).toBe(true);
  });

  it('needs both a shape and at least one section for step three', () => {
    expect(stepStatus(make({ shape: 'event' }))[2]).toBe(false);
    expect(stepStatus(make({ sections: ['hero'] }))[2]).toBe(false);
    expect(stepStatus(make({ shape: 'event', sections: ['hero'] }))[2]).toBe(
      true,
    );
  });

  it('counts plain as a pattern answer', () => {
    expect(stepStatus(make({ patterns: ['plain'] }))[3]).toBe(true);
    expect(stepStatus(make({ patterns: [] }))[3]).toBe(false);
  });

  it('marks the remaining single-choice steps', () => {
    expect(stepStatus(make({ direction: 'playful' }))[1]).toBe(true);
    expect(stepStatus(make({ motion: 'none' }))[4]).toBe(true);
    expect(stepStatus(make({ access: 'public' }))[5]).toBe(true);
  });

  it('adds up one step at a time', () => {
    const partial = make({
      name: 'Test',
      idea: 'An idea',
      direction: 'playful',
      shape: 'landing',
      sections: ['hero'],
    });
    expect(completedSteps(partial)).toBe(3);
    expect(isRecipeReady(partial)).toBe(false);
    expect(completedSteps({ ...partial, patterns: ['plain'] })).toBe(4);
    expect(completedSteps({ ...partial, motion: 'subtle' })).toBe(4);
  });
});
