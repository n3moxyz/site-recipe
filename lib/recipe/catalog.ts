import { Globe2, KeyRound, Mail, Phone } from 'lucide-react';

/**
 * Curated option data. This module is the single source of truth for every
 * id, label and sentence the recipe uses; the id unions in `types.ts` are
 * derived from these arrays, so adding an option here is enough.
 */

export const visualDirections = [
  {
    id: 'editorial',
    label: 'Editorial',
    description: 'Strong type, generous rhythm, and a clear reading path.',
    previewClass: 'preview-editorial',
    guidance:
      'Lead with typography: a large serif or grotesque display face, generous line height, a single-column reading measure around 65 characters, and whitespace instead of boxes. Keep color to ink, paper, and one accent.',
  },
  {
    id: 'playful',
    label: 'Playful',
    description: 'Friendly shapes, bright signals, and light-hearted details.',
    previewClass: 'preview-playful',
    guidance:
      'Use rounded shapes, one bright accent plus a warm neutral, chunky friendly type, and small illustrated or emoji-scale details. Keep it legible: high contrast, no text over busy backgrounds.',
  },
  {
    id: 'precise',
    label: 'Precise',
    description: 'Tight grids, useful labels, and calm technical confidence.',
    previewClass: 'preview-precise',
    guidance:
      'Use a visible grid, compact monospaced labels for metadata, restrained type sizes, hairline rules, and a cool neutral palette with one signal color. Every element should look measured.',
  },
  {
    id: 'cinematic',
    label: 'Cinematic',
    description: 'Immersive imagery, larger moments, and deliberate reveals.',
    previewClass: 'preview-cinematic',
    guidance:
      'Use full-bleed imagery or dark backgrounds, large display type with tight tracking, and deliberate spacing between a few big moments. Keep body text on solid backgrounds for readability.',
  },
] as const;

export const siteShapes = [
  {
    id: 'landing',
    label: 'Landing page',
    description: 'One focused story with a clear next action.',
    guidance:
      'Tell one story top to bottom and repeat a single primary action.',
    defaultSections: ['hero', 'features', 'proof', 'cta'],
    defaultPatterns: ['bento'],
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    description: 'Selected work, a point of view, and a way to connect.',
    guidance:
      'Let the work lead; keep chrome minimal and make contact effortless.',
    defaultSections: ['hero', 'gallery', 'proof', 'cta'],
    defaultPatterns: ['carousel'],
  },
  {
    id: 'product',
    label: 'Product or app',
    description: 'Explain the value, then help people try or join it.',
    guidance:
      'Explain the value in one screen, show it working, then make trying it the obvious next step.',
    defaultSections: [
      'hero',
      'how-it-works',
      'features',
      'pricing',
      'faq',
      'cta',
    ],
    defaultPatterns: ['tabs', 'accordion'],
  },
  {
    id: 'event',
    label: 'Event',
    description: 'Set the scene, share the details, and collect interest.',
    guidance:
      'Answer what, when, where, and who it is for above the fold, then make the RSVP or ticket action unmistakable.',
    defaultSections: ['hero', 'how-it-works', 'gallery', 'proof', 'cta'],
    defaultPatterns: ['bento', 'accordion'],
  },
  {
    id: 'community',
    label: 'Community',
    description: 'Make the purpose clear and show how people belong.',
    guidance:
      'State the shared purpose, show real members or moments, and make joining feel low-risk.',
    defaultSections: ['hero', 'how-it-works', 'gallery', 'proof', 'faq', 'cta'],
    defaultPatterns: ['accordion'],
  },
  {
    id: 'shop',
    label: 'Small shop',
    description: 'Present a tight collection and make buying feel easy.',
    guidance:
      'Show the products first, keep the collection small and browsable, and make price and buying obvious.',
    defaultSections: ['hero', 'gallery', 'features', 'faq', 'cta'],
    defaultPatterns: ['carousel', 'dialog'],
  },
] as const;

export const pageSections = [
  { id: 'hero', label: 'Hero', note: 'The promise and main action' },
  {
    id: 'how-it-works',
    label: 'How it works',
    note: 'A short, scannable sequence',
  },
  { id: 'features', label: 'Features', note: 'What people can do or get' },
  { id: 'gallery', label: 'Gallery', note: 'Work, products, or atmosphere' },
  { id: 'proof', label: 'Proof', note: 'Results, quotes, or trusted names' },
  { id: 'pricing', label: 'Pricing', note: 'Plans and what is included' },
  { id: 'faq', label: 'FAQ', note: 'Answer the last useful questions' },
  { id: 'cta', label: 'Final action', note: 'A clear way to continue' },
] as const;

export const uiPatterns = [
  {
    id: 'bento',
    label: 'Bento grid',
    plainName: 'Mixed-size feature cards',
    use: 'Good for showing several benefits without a long list.',
  },
  {
    id: 'tabs',
    label: 'Tabs',
    plainName: 'Switchable views',
    use: 'Good when people need to compare related content in one place.',
  },
  {
    id: 'accordion',
    label: 'Accordion',
    plainName: 'Expandable answers',
    use: 'Good for optional detail, especially FAQs.',
  },
  {
    id: 'carousel',
    label: 'Carousel',
    plainName: 'Swipeable gallery',
    use: 'Good for visual examples when order is not critical.',
  },
  {
    id: 'dialog',
    label: 'Dialog',
    plainName: 'Focused pop-up',
    use: 'Good for one short task that should not replace the page.',
  },
  {
    id: 'command',
    label: 'Command menu',
    plainName: 'Fast search and actions',
    use: 'Good for expert tools with many destinations or actions.',
  },
  {
    id: 'plain',
    label: 'Keep it plain',
    plainName: 'No special patterns',
    use: 'Good when lists, headings, and links already tell the story.',
  },
] as const;

export const motionLevels = [
  {
    id: 'none',
    label: 'Nearly still',
    description: 'Only essential state changes. Calm and immediate.',
    guidance:
      'No scroll-triggered animation. Use instant state changes with clear hover and focus styles only.',
  },
  {
    id: 'subtle',
    label: 'Subtle',
    description: 'Soft reveals and responsive hover feedback.',
    guidance:
      'Fade-and-rise reveals of about 200ms on sections as they enter, gentle hover feedback on cards and buttons, nothing that loops.',
  },
  {
    id: 'expressive',
    label: 'Expressive',
    description: 'One memorable sequence plus richer section transitions.',
    guidance:
      'One signature moment (for example a staged hero reveal) and smooth section transitions, kept under 600ms, with everything else calm.',
  },
] as const;

export const accessOptions = [
  {
    id: 'public',
    label: 'Public',
    description: 'No sign-in. Best when everyone should see the site.',
    instruction: 'The site should not require an account.',
    Icon: Globe2,
  },
  {
    id: 'email-code',
    label: 'Email code',
    description:
      'A passwordless code that works with Gmail, Outlook, and more.',
    instruction:
      'Use a six-digit passwordless email code and support all major email providers.',
    Icon: Mail,
  },
  {
    id: 'google',
    label: 'Google sign-in',
    description:
      'Fast for Google users; consider an email fallback for everyone else.',
    instruction:
      'Use Google OAuth and include a non-Google fallback if the audience is mixed.',
    Icon: KeyRound,
  },
  {
    id: 'phone',
    label: 'Phone code',
    description: 'Familiar on mobile, with extra delivery cost and setup.',
    instruction:
      'Use a one-time phone code and explain any data or messaging costs clearly.',
    Icon: Phone,
  },
] as const;

export const CHATGPT_SITES_URL = 'https://chatgpt.com/';

/** Longest `q` value we will put in a link before falling back to the plain
 * ChatGPT URL. Very long query strings get truncated or rejected. */
const MAX_ENCODED_PROMPT = 6000;

/**
 * ChatGPT prefills its composer from the `q` query parameter and sends it
 * immediately as a new chat, so callers must label this "Send brief".
 */
export function chatgptComposeUrl(prompt: string): string {
  const encoded = encodeURIComponent(prompt);
  if (encoded.length > MAX_ENCODED_PROMPT) return CHATGPT_SITES_URL;
  return `${CHATGPT_SITES_URL}?q=${encoded}`;
}
