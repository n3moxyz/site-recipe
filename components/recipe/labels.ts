import {
  accessOptions,
  motionLevels,
  pageSections,
  siteShapes,
  uiPatterns,
  visualDirections,
} from '@/lib/recipe/catalog';
import type { Recipe } from '@/lib/recipe/types';

type Labelled = { readonly id: string; readonly label: string };

/** 'Open' matches the original page's fallback for an unanswered choice. */
function labelOf(items: readonly Labelled[], id: string | null): string {
  return items.find((item) => item.id === id)?.label ?? 'Open';
}

export type RecipeLabels = {
  direction: string;
  shape: string;
  motion: string;
  access: string;
  sections: string[];
  patterns: string[];
};

/** Every display label the ticket, header and hints need, in catalog order. */
export function recipeLabels(recipe: Recipe): RecipeLabels {
  return {
    direction: labelOf(visualDirections, recipe.direction),
    shape: labelOf(siteShapes, recipe.shape),
    motion: labelOf(motionLevels, recipe.motion),
    access: labelOf(accessOptions, recipe.access),
    sections: pageSections
      .filter((item) => recipe.sections.includes(item.id))
      .map((item) => item.label),
    patterns: uiPatterns
      .filter((item) => recipe.patterns.includes(item.id))
      .map((item) => item.label),
  };
}
