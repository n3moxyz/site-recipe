import {
  accessOptions,
  motionLevels,
  pageSections,
  siteShapes,
  uiPatterns,
  visualDirections,
} from './catalog';
import type { Recipe } from './types';

const INTRO = 'Build a website for ChatGPT Sites using this brief.';

const PATTERN_TAIL = 'Keep the interface easy to scan and keyboard accessible.';

const MOTION_TAIL =
  'Respect reduced-motion preferences and never let animation delay the main task.';

const QUALITY_BAR =
  'Quality bar: responsive from mobile to desktop, WCAG-aware contrast and focus states, concise copy, semantic structure, fast loading, and no decorative interaction that competes with the content.';

/**
 * Lower-cases only the first character, so notes and `use` sentences can be
 * folded into a longer sentence without touching proper nouns like FAQs.
 */
function lowerFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

/**
 * Collapses any run of whitespace -- including the newlines a textarea or a
 * shared hash can carry -- into a single space, so every free-text field stays
 * on the one `Key: value` line the brief format promises. Without this, a
 * pasted multi-line idea would inject stray lines (and even blank lines, which
 * read as block separators) into the middle of the identity block.
 */
function oneLine(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function typeLine(recipe: Recipe): string {
  const shape = siteShapes.find((item) => item.id === recipe.shape);
  if (!shape) {
    return 'Type: Open. Recommend the page type that fits the purpose and say why in one sentence.';
  }
  return `Type: ${shape.label}. ${shape.guidance}`;
}

function identityBlock(recipe: Recipe): string {
  const audience = oneLine(recipe.audience);
  const idea = oneLine(recipe.idea);
  const lines = [
    `Name: ${oneLine(recipe.name) || 'Untitled site'}`,
    typeLine(recipe),
  ];
  if (audience) lines.push(`Audience: ${audience}`);
  lines.push(
    `Purpose: ${idea || 'Help me clarify the purpose with one concise sentence.'}`,
  );
  return lines.join('\n');
}

function directionBlock(recipe: Recipe): string {
  const direction = visualDirections.find(
    (item) => item.id === recipe.direction,
  );
  if (!direction) {
    return 'Visual direction: Open. Recommend one direction that fits the purpose and describe it in one sentence.';
  }
  return `Visual direction: ${direction.label}. ${direction.description} ${direction.guidance}`;
}

function anatomyBlock(recipe: Recipe): string {
  const chosen = pageSections
    .filter((item) => recipe.sections.includes(item.id))
    .map((item) => `${item.label} (${lowerFirst(item.note)})`);
  const middle = chosen.length
    ? chosen.join('; ')
    : 'only the sections essential to the main goal';
  return `Page anatomy, in order: a clear site header; ${middle}; a simple footer.`;
}

function ingredientsBlock(recipe: Recipe): string {
  if (recipe.patterns.length === 0) {
    return `UI ingredients: simple, familiar interface patterns only where they help the content. ${PATTERN_TAIL}`;
  }
  if (recipe.patterns.includes('plain')) {
    return `UI ingredients: none beyond plain lists, headings, and links. ${PATTERN_TAIL}`;
  }
  const bullets = uiPatterns
    .filter((item) => recipe.patterns.includes(item.id))
    .map(
      (item) =>
        `- ${item.label} (${lowerFirst(item.plainName)}): ${lowerFirst(item.use)}`,
    );
  const closing = `Use each only where it helps the content. If a plain list would work better, use the list. ${PATTERN_TAIL}`;
  return ['UI ingredients:', ...bullets, closing].join('\n');
}

function motionBlock(recipe: Recipe): string {
  const level = motionLevels.find((item) => item.id === recipe.motion);
  if (!level) return `Motion: Open. Default to subtle motion. ${MOTION_TAIL}`;
  return `Motion: ${level.label}. ${level.description} ${level.guidance} ${MOTION_TAIL}`;
}

function accessBlock(recipe: Recipe): string {
  const option = accessOptions.find((item) => item.id === recipe.access);
  if (!option) {
    return 'Access: Open. Recommend the least restrictive access method that fits the content.';
  }
  return `Access: ${option.label}. ${option.instruction}`;
}

/**
 * Deterministic: the same recipe always produces the same string. Every
 * variable word is preceded by a colon, never an article, so we can never
 * emit "a event" or "a editorial" again.
 */
export function buildPrompt(recipe: Recipe): string {
  return [
    INTRO,
    identityBlock(recipe),
    directionBlock(recipe),
    anatomyBlock(recipe),
    ingredientsBlock(recipe),
    motionBlock(recipe),
    accessBlock(recipe),
    QUALITY_BAR,
  ].join('\n\n');
}
