import type { Recipe } from './types';

/**
 * Three complete, coherent recipes. The first one is what the app loads with,
 * exactly as the original page did.
 */
export const starters: Array<{ name: string; recipe: Recipe }> = [
  {
    name: 'Neighborhood Table',
    recipe: {
      name: 'Neighborhood Table',
      idea: 'A welcoming event page that helps neighbors find and host small communal dinners.',
      audience: 'Neighbors who want to find or host small communal dinners',
      direction: 'editorial',
      shape: 'event',
      sections: ['hero', 'how-it-works', 'gallery', 'proof', 'cta'],
      patterns: ['bento', 'accordion'],
      motion: 'subtle',
      access: 'public',
    },
  },
  {
    name: 'Studio Index',
    recipe: {
      name: 'Studio Index',
      idea: 'A compact portfolio for an independent designer, with selected work and an easy way to get in touch.',
      audience:
        "Potential clients and collaborators looking at an independent designer's work",
      direction: 'precise',
      shape: 'portfolio',
      sections: ['hero', 'gallery', 'proof', 'cta'],
      patterns: ['carousel'],
      motion: 'subtle',
      access: 'public',
    },
  },
  {
    name: 'Tiny Field Notes',
    recipe: {
      name: 'Tiny Field Notes',
      idea: 'A thoughtful publication for short observations about cities, objects, and everyday rituals.',
      audience:
        'Readers who enjoy short, thoughtful observations about everyday life',
      direction: 'editorial',
      shape: 'landing',
      sections: ['hero', 'features', 'proof', 'cta'],
      patterns: ['plain'],
      motion: 'none',
      access: 'email-code',
    },
  },
];

export const defaultRecipe: Recipe = starters[0].recipe;
