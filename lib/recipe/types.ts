import type {
  accessOptions,
  motionLevels,
  pageSections,
  siteShapes,
  uiPatterns,
  visualDirections,
} from './catalog';

export type VisualDirection = (typeof visualDirections)[number]['id'];
export type SiteShape = (typeof siteShapes)[number]['id'];
export type PageSection = (typeof pageSections)[number]['id'];
export type UiPattern = (typeof uiPatterns)[number]['id'];
export type MotionLevel = (typeof motionLevels)[number]['id'];
export type AccessOption = (typeof accessOptions)[number]['id'];

/**
 * The whole app state. `sections` and `patterns` are always stored in catalog
 * order, and `patterns` never mixes 'plain' with anything else — every writer
 * goes through the helpers in `defaults.ts` or `url-state.ts`.
 */
export type Recipe = {
  name: string;
  idea: string;
  audience: string;
  direction: VisualDirection | null;
  shape: SiteShape | null;
  sections: PageSection[];
  patterns: UiPattern[];
  motion: MotionLevel | null;
  access: AccessOption | null;
};

export const emptyRecipe: Recipe = {
  name: '',
  idea: '',
  audience: '',
  direction: null,
  shape: null,
  sections: [],
  patterns: [],
  motion: null,
  access: null,
};
