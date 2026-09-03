import { describe, expect, it } from 'vitest';

import {
  accessOptions,
  CHATGPT_SITES_URL,
  chatgptComposeUrl,
  motionLevels,
  pageSections,
  siteShapes,
  uiPatterns,
  visualDirections,
} from './catalog';

const sectionIds = pageSections.map((item) => item.id);
const patternIds = uiPatterns.map((item) => item.id);

describe('catalog data', () => {
  it('keeps the original ids and order', () => {
    expect(visualDirections.map((item) => item.id)).toEqual([
      'editorial',
      'playful',
      'precise',
      'cinematic',
    ]);
    expect(siteShapes.map((item) => item.id)).toEqual([
      'landing',
      'portfolio',
      'product',
      'event',
      'community',
      'shop',
    ]);
    expect(sectionIds).toEqual([
      'hero',
      'how-it-works',
      'features',
      'gallery',
      'proof',
      'pricing',
      'faq',
      'cta',
    ]);
    expect(patternIds).toEqual([
      'bento',
      'tabs',
      'accordion',
      'carousel',
      'dialog',
      'command',
      'plain',
    ]);
    expect(motionLevels.map((item) => item.id)).toEqual([
      'none',
      'subtle',
      'expressive',
    ]);
    expect(accessOptions.map((item) => item.id)).toEqual([
      'public',
      'email-code',
      'google',
      'phone',
    ]);
  });

  it('keeps plain last so it renders as the final card', () => {
    expect(uiPatterns.at(-1)?.id).toBe('plain');
    expect(uiPatterns.at(-1)?.plainName).toBe('No special patterns');
  });

  it('gives every option a non-empty sentence', () => {
    for (const item of visualDirections) {
      expect(item.description.length).toBeGreaterThan(0);
      expect(item.guidance.length).toBeGreaterThan(0);
    }
    for (const item of motionLevels) {
      expect(item.guidance.length).toBeGreaterThan(0);
    }
    for (const item of accessOptions) {
      expect(item.instruction.endsWith('.')).toBe(true);
    }
    for (const item of pageSections) {
      expect(item.note.length).toBeGreaterThan(0);
    }
    for (const item of uiPatterns) {
      expect(item.use.startsWith('Good')).toBe(true);
    }
  });

  it('only uses known ids in the shape starter sets', () => {
    for (const shape of siteShapes) {
      expect(shape.defaultSections.length).toBeGreaterThan(0);
      expect(shape.defaultPatterns.length).toBeGreaterThan(0);
      for (const id of shape.defaultSections) {
        expect(sectionIds).toContain(id);
      }
      for (const id of shape.defaultPatterns) {
        expect(patternIds).toContain(id);
      }
    }
  });
});

describe('chatgptComposeUrl', () => {
  it('prefills the composer with the encoded prompt', () => {
    expect(chatgptComposeUrl('Build a site for me')).toBe(
      'https://chatgpt.com/?q=Build%20a%20site%20for%20me',
    );
  });

  it('escapes newlines and punctuation', () => {
    expect(chatgptComposeUrl('a\nb&c')).toBe(
      'https://chatgpt.com/?q=a%0Ab%26c',
    );
  });

  it('falls back to the plain URL above the length cap', () => {
    expect(chatgptComposeUrl('x'.repeat(6000))).toContain('?q=');
    expect(chatgptComposeUrl('x'.repeat(6001))).toBe(CHATGPT_SITES_URL);
    // Encoded length, not raw length: each space costs three characters.
    expect(chatgptComposeUrl(' '.repeat(2001))).toBe(CHATGPT_SITES_URL);
  });
});
