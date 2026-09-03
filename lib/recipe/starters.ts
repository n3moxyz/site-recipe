import type { Recipe } from './types';

/** Three complete, deliberately varied recipes. The first loads by default. */
export const starters: Array<{ name: string; recipe: Recipe }> = [
  {
    name: 'Night Garden Walk',
    recipe: {
      name: 'Night Garden Walk',
      idea: 'A cinematic event page for a guided after-dark botanical walk, with the route, schedule, safety notes, and a clear RSVP.',
      audience:
        'Curious locals and amateur photographers looking for a memorable evening outdoors',
      direction: 'cinematic',
      shape: 'event',
      sections: ['hero', 'how-it-works', 'gallery', 'proof', 'cta'],
      patterns: ['bento', 'accordion'],
      motion: 'expressive',
      access: 'public',
    },
  },
  {
    name: 'Sunday Kiln',
    recipe: {
      name: 'Sunday Kiln',
      idea: 'A warm small-shop site for a ceramicist selling a limited collection of hand-thrown cups, bowls, and serving pieces.',
      audience:
        'Home cooks and gift shoppers who value useful, handmade objects',
      direction: 'editorial',
      shape: 'shop',
      sections: ['hero', 'gallery', 'faq', 'cta'],
      patterns: ['accordion', 'carousel', 'dialog'],
      motion: 'subtle',
      access: 'public',
    },
  },
  {
    name: 'Freelance Ledger',
    recipe: {
      name: 'Freelance Ledger',
      idea: 'A crisp product site for a lightweight client and invoice tracker built for independent creatives.',
      audience:
        'Freelancers who want proposals, project status, invoices, and payment reminders in one calm place',
      direction: 'precise',
      shape: 'product',
      sections: ['hero', 'how-it-works', 'features', 'pricing', 'faq', 'cta'],
      patterns: ['tabs', 'accordion'],
      motion: 'subtle',
      access: 'google',
    },
  },
];

export const defaultRecipe: Recipe = starters[0].recipe;
