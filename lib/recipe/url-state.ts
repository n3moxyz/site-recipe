import {
  accessOptions,
  motionLevels,
  siteShapes,
  visualDirections,
} from './catalog';
import { normalizePatterns, normalizeSections } from './defaults';
import type { Recipe } from './types';

const KEYS = [
  'name',
  'idea',
  'audience',
  'direction',
  'shape',
  'sections',
  'patterns',
  'motion',
  'access',
] as const;

/**
 * Shared by both sides of the round trip, and exported so the form fields can
 * set the same `maxLength` and never hold text a share link would drop.
 */
export const NAME_MAX = 200;
export const IDEA_MAX = 500;

const directionIds = visualDirections.map((item) => item.id);
const shapeIds = siteShapes.map((item) => item.id);
const motionIds = motionLevels.map((item) => item.id);
const accessIds = accessOptions.map((item) => item.id);

/**
 * Trims, caps at `max`, then trims again so a cut that lands mid-space does
 * not leave a dangling one. Both sides of the round trip use this, so writing
 * a hash and reading it back never changes the text a second time.
 */
function cap(value: string, max: number): string {
  return value.trim().slice(0, max).trim();
}

/** A `URLSearchParams` string for the URL hash, without the leading '#'. */
export function encodeRecipe(recipe: Recipe): string {
  const params = new URLSearchParams();
  const put = (key: string, value: string) => {
    if (value) params.set(key, value);
  };
  put('name', cap(recipe.name, NAME_MAX));
  put('idea', cap(recipe.idea, IDEA_MAX));
  put('audience', cap(recipe.audience, NAME_MAX));
  put('direction', recipe.direction ?? '');
  put('shape', recipe.shape ?? '');
  put('sections', recipe.sections.join(','));
  put('patterns', recipe.patterns.join(','));
  put('motion', recipe.motion ?? '');
  put('access', recipe.access ?? '');
  return params.toString();
}

function text(value: string | null, max: number): string {
  return cap(value ?? '', max);
}

function pickId<T extends string>(
  ids: readonly T[],
  value: string | null,
): T | null {
  return ids.find((id) => id === value) ?? null;
}

function list(value: string | null): string[] {
  return (value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Reads a shared link. Tolerates anything: garbage, unknown ids and missing
 * keys all degrade to empty values instead of throwing. Returns null when no
 * known key carries a value, so unrelated hashes are left alone. A key must
 * carry a value because `URLSearchParams('motion')` parses to `motion=''`,
 * and `#motion` / `#access` are real section anchors on the page.
 */
export function decodeRecipe(hash: string): Recipe | null {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  const params = new URLSearchParams(raw);
  if (!KEYS.some((key) => params.get(key))) return null;
  return {
    name: text(params.get('name'), NAME_MAX),
    idea: text(params.get('idea'), IDEA_MAX),
    audience: text(params.get('audience'), NAME_MAX),
    direction: pickId(directionIds, params.get('direction')),
    shape: pickId(shapeIds, params.get('shape')),
    sections: normalizeSections(list(params.get('sections'))),
    patterns: normalizePatterns(list(params.get('patterns'))),
    motion: pickId(motionIds, params.get('motion')),
    access: pickId(accessIds, params.get('access')),
  };
}
