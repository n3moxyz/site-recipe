import type { Recipe } from './types';

export const TOTAL_STEPS = 6;

/**
 * One boolean per step, in page order: idea, direction, shape + anatomy,
 * patterns, motion, access. A step counts when it is answered, not when it
 * has been scrolled past.
 */
export function stepStatus(recipe: Recipe): boolean[] {
  return [
    Boolean(recipe.name.trim() && recipe.idea.trim()),
    recipe.direction !== null,
    Boolean(recipe.shape) && recipe.sections.length > 0,
    recipe.patterns.length > 0,
    recipe.motion !== null,
    recipe.access !== null,
  ];
}

export function completedSteps(recipe: Recipe): number {
  return stepStatus(recipe).filter(Boolean).length;
}

export function isRecipeReady(recipe: Recipe): boolean {
  return completedSteps(recipe) === TOTAL_STEPS;
}
