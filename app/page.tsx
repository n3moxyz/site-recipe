'use client';

import { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Check,
  Copy,
  Globe2,
  KeyRound,
  Mail,
  Phone,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const starterIdeas = [
  {
    name: 'Neighborhood Table',
    idea: 'A welcoming event page that helps neighbors find and host small communal dinners.',
  },
  {
    name: 'Studio Index',
    idea: 'A compact portfolio for an independent designer, with selected work and an easy way to get in touch.',
  },
  {
    name: 'Tiny Field Notes',
    idea: 'A thoughtful publication for short observations about cities, objects, and everyday rituals.',
  },
];

const visualDirections = [
  {
    id: 'editorial',
    label: 'Editorial',
    description: 'Strong type, generous rhythm, and a clear reading path.',
    previewClass: 'preview-editorial',
  },
  {
    id: 'playful',
    label: 'Playful',
    description: 'Friendly shapes, bright signals, and light-hearted details.',
    previewClass: 'preview-playful',
  },
  {
    id: 'precise',
    label: 'Precise',
    description: 'Tight grids, useful labels, and calm technical confidence.',
    previewClass: 'preview-precise',
  },
  {
    id: 'cinematic',
    label: 'Cinematic',
    description: 'Immersive imagery, larger moments, and deliberate reveals.',
    previewClass: 'preview-cinematic',
  },
] as const;

const siteShapes = [
  {
    id: 'landing',
    label: 'Landing page',
    description: 'One focused story with a clear next action.',
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    description: 'Selected work, a point of view, and a way to connect.',
  },
  {
    id: 'product',
    label: 'Product or app',
    description: 'Explain the value, then help people try or join it.',
  },
  {
    id: 'event',
    label: 'Event',
    description: 'Set the scene, share the details, and collect interest.',
  },
  {
    id: 'community',
    label: 'Community',
    description: 'Make the purpose clear and show how people belong.',
  },
  {
    id: 'shop',
    label: 'Small shop',
    description: 'Present a tight collection and make buying feel easy.',
  },
] as const;

const pageSections = [
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

const uiPatterns = [
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
] as const;

const motionLevels = [
  {
    id: 'none',
    label: 'Nearly still',
    description: 'Only essential state changes. Calm and immediate.',
  },
  {
    id: 'subtle',
    label: 'Subtle',
    description: 'Soft reveals and responsive hover feedback.',
  },
  {
    id: 'expressive',
    label: 'Expressive',
    description: 'One memorable sequence plus richer section transitions.',
  },
] as const;

const accessOptions = [
  {
    id: 'public',
    label: 'Public',
    description: 'No sign-in. Best when everyone should see the site.',
    Icon: Globe2,
  },
  {
    id: 'email-code',
    label: 'Email code',
    description:
      'A passwordless code that works with Gmail, Outlook, and more.',
    Icon: Mail,
  },
  {
    id: 'google',
    label: 'Google sign-in',
    description:
      'Fast for Google users; consider an email fallback for everyone else.',
    Icon: KeyRound,
  },
  {
    id: 'phone',
    label: 'Phone code',
    description: 'Familiar on mobile, with extra delivery cost and setup.',
    Icon: Phone,
  },
] as const;

type VisualDirection = (typeof visualDirections)[number]['id'];
type SiteShape = (typeof siteShapes)[number]['id'];
type PageSection = (typeof pageSections)[number]['id'];
type UiPattern = (typeof uiPatterns)[number]['id'];
type MotionLevel = (typeof motionLevels)[number]['id'];
type AccessOption = (typeof accessOptions)[number]['id'];

export default function Home() {
  const [projectName, setProjectName] = useState(starterIdeas[0].name);
  const [idea, setIdea] = useState(starterIdeas[0].idea);
  const [direction, setDirection] = useState<VisualDirection | null>(
    'editorial',
  );
  const [siteShape, setSiteShape] = useState<SiteShape | null>('event');
  const [sections, setSections] = useState<PageSection[]>([
    'hero',
    'how-it-works',
    'gallery',
    'proof',
    'cta',
  ]);
  const [patterns, setPatterns] = useState<UiPattern[]>(['bento', 'accordion']);
  const [motion, setMotion] = useState<MotionLevel | null>('subtle');
  const [access, setAccess] = useState<AccessOption | null>('public');
  const [reviewedSteps, setReviewedSteps] = useState(2);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>(
    'idle',
  );

  const directionLabel = useMemo(
    () =>
      visualDirections.find((item) => item.id === direction)?.label ?? 'Open',
    [direction],
  );

  const shapeLabel = useMemo(
    () => siteShapes.find((item) => item.id === siteShape)?.label ?? 'Open',
    [siteShape],
  );

  const motionLabel = useMemo(
    () => motionLevels.find((item) => item.id === motion)?.label ?? 'Open',
    [motion],
  );

  const accessLabel = useMemo(
    () => accessOptions.find((item) => item.id === access)?.label ?? 'Open',
    [access],
  );

  const selectedSectionLabels = pageSections
    .filter((item) => sections.includes(item.id))
    .map((item) => item.label);

  const selectedPatternLabels = uiPatterns
    .filter((item) => patterns.includes(item.id))
    .map((item) => item.label);

  const generatedPrompt = useMemo(
    () => `Build a ${shapeLabel.toLowerCase()} called “${projectName || 'Untitled site'}” with a ${directionLabel.toLowerCase()} visual direction.

Purpose: ${idea || 'Help me clarify the purpose with one concise sentence.'}

Page anatomy: Include a clear site header and footer, plus ${selectedSectionLabels.length ? selectedSectionLabels.join(', ') : 'only the sections essential to the main goal'}.

UI ingredients: Use ${selectedPatternLabels.length ? selectedPatternLabels.join(', ') : 'simple, familiar interface patterns'} only where they help the content. Keep the interface easy to scan and keyboard accessible.

Motion: Use a ${motionLabel.toLowerCase()} motion approach. Respect reduced-motion preferences and never let animation delay the main task.

Access: ${accessLabel}. ${
      access === 'public'
        ? 'The site should not require an account.'
        : access === 'email-code'
          ? 'Use a six-digit passwordless email code and support all major email providers.'
          : access === 'google'
            ? 'Use Google OAuth and include a non-Google fallback if the audience is mixed.'
            : access === 'phone'
              ? 'Use a one-time phone code and explain any data or messaging costs clearly.'
              : 'Recommend the least restrictive access method that fits the content.'
    }

Quality bar: responsive from mobile to desktop, WCAG-aware contrast and focus states, concise copy, semantic structure, fast loading, and no decorative interaction that competes with the content.`,
    [
      access,
      accessLabel,
      directionLabel,
      idea,
      motionLabel,
      projectName,
      selectedPatternLabels,
      selectedSectionLabels,
      shapeLabel,
    ],
  );

  const recipeReady = Boolean(
    projectName.trim() &&
    idea.trim() &&
    direction &&
    siteShape &&
    sections.length &&
    patterns.length &&
    motion &&
    access,
  );

  function reviewStep(step: number) {
    setReviewedSteps((current) => Math.max(current, step));
  }

  function goToStep(id: string, step: number) {
    reviewStep(step);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function toggleSection(section: PageSection) {
    setSections((current) =>
      current.includes(section)
        ? current.filter((item) => item !== section)
        : [...current, section],
    );
    reviewStep(3);
  }

  function togglePattern(pattern: UiPattern) {
    setPatterns((current) =>
      current.includes(pattern)
        ? current.filter((item) => item !== pattern)
        : [...current, pattern],
    );
    reviewStep(4);
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 2200);
    } catch {
      setCopyState('error');
    }
  }

  function resetRecipe() {
    setProjectName('');
    setIdea('');
    setDirection(null);
    setSiteShape(null);
    setSections([]);
    setPatterns([]);
    setMotion(null);
    setAccess(null);
    setReviewedSteps(0);
    setCopyState('idle');
    document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' });
  }

  function applyStarter(index: number) {
    setProjectName(starterIdeas[index].name);
    setIdea(starterIdeas[index].idea);
    reviewStep(1);
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Site Recipe home">
          <span className="brand-mark" aria-hidden="true">
            <Sparkles />
          </span>
          <span>Site Recipe</span>
        </a>
        <div
          className="header-progress"
          aria-label={`${reviewedSteps} of 6 recipe steps reviewed`}
        >
          <span className="header-progress__label">Your recipe</span>
          <span className="header-progress__track" aria-hidden="true">
            <span
              className="header-progress__fill"
              style={{ width: `${(reviewedSteps / 6) * 100}%` }}
            />
          </span>
          <span className="utility-label">{reviewedSteps} / 6</span>
        </div>
        <a className="quiet-link" href="#site-shape">
          Explore the flow <ArrowDown aria-hidden="true" />
        </a>
      </header>

      <div id="top" className="page-shell">
        <section className="builder-column" aria-labelledby="page-title">
          <div className="intro-block">
            <p className="eyebrow">
              <span>Two-minute site starter</span>
              <span aria-hidden="true">No design degree needed</span>
            </p>
            <h1 id="page-title">
              Turn a loose idea into a site you can <em>actually build.</em>
            </h1>
            <p className="intro-copy">
              Make a handful of useful choices. We’ll turn them into one clear,
              taste-aware brief for ChatGPT Sites.
            </p>
          </div>

          <section className="recipe-step" aria-labelledby="idea-title">
            <div className="step-heading">
              <span className="step-number">01</span>
              <div>
                <p className="utility-label">The starting point</p>
                <h2 id="idea-title">What should exist after this?</h2>
              </div>
            </div>

            <div className="idea-fields">
              <label htmlFor="project-name">Give it a working name</label>
              <Input
                id="project-name"
                value={projectName}
                onChange={(event) => {
                  setProjectName(event.target.value);
                  reviewStep(1);
                }}
                className="recipe-input"
              />
              <label htmlFor="project-idea">
                Describe the idea in one sentence
              </label>
              <Textarea
                id="project-idea"
                value={idea}
                onChange={(event) => {
                  setIdea(event.target.value);
                  reviewStep(1);
                }}
                className="recipe-textarea"
              />
            </div>

            <div className="starter-row" aria-label="Starter idea examples">
              <span className="utility-label">Try an example</span>
              {starterIdeas.map((starter, index) => (
                <button
                  key={starter.name}
                  type="button"
                  className="starter-chip"
                  onClick={() => applyStarter(index)}
                >
                  {starter.name}
                </button>
              ))}
            </div>
          </section>

          <section
            id="visual-direction"
            className="recipe-step"
            aria-labelledby="direction-title"
          >
            <div className="step-heading">
              <span className="step-number">02</span>
              <div>
                <p className="utility-label">The feeling</p>
                <h2 id="direction-title">Choose a visual direction.</h2>
                <p>Pick the closest starting point. You can refine it later.</p>
              </div>
            </div>

            <div className="direction-grid">
              {visualDirections.map((item) => {
                const selected = direction === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className="direction-card"
                    aria-pressed={selected}
                    aria-label={`Select ${item.label} visual direction`}
                    onClick={() => {
                      setDirection(item.id);
                      reviewStep(2);
                    }}
                  >
                    <span
                      className={`direction-preview ${item.previewClass}`}
                      aria-hidden="true"
                    >
                      <span className="preview-kicker">
                        Make something clear
                      </span>
                      <span className="preview-title">
                        A good site starts with a point of view.
                      </span>
                      <span className="preview-rule" />
                      <span className="preview-blocks">
                        <i />
                        <i />
                        <i />
                      </span>
                    </span>
                    <span className="direction-card__copy">
                      <span>
                        <strong>{item.label}</strong>
                        <small>{item.description}</small>
                      </span>
                      <span className="select-indicator" aria-hidden="true">
                        {selected ? <Check /> : null}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <Button
              type="button"
              className="continue-button"
              onClick={() => goToStep('site-shape', 2)}
            >
              Next: shape the page <ArrowRight data-icon="inline-end" />
            </Button>
          </section>

          <section
            id="site-shape"
            className="recipe-step"
            aria-labelledby="shape-title"
          >
            <div className="step-heading">
              <span className="step-number">03</span>
              <div>
                <p className="utility-label">The structure</p>
                <h2 id="shape-title">Give the idea a useful shape.</h2>
                <p>
                  Choose the page type, then keep only the sections that earn
                  their place.
                </p>
              </div>
            </div>

            <div className="shape-grid" aria-label="Site type">
              {siteShapes.map((shape) => {
                const selected = siteShape === shape.id;
                return (
                  <button
                    key={shape.id}
                    type="button"
                    className="shape-card"
                    aria-pressed={selected}
                    onClick={() => {
                      setSiteShape(shape.id);
                      reviewStep(3);
                    }}
                  >
                    <span className="shape-card__title">
                      <strong>{shape.label}</strong>
                      <span className="select-indicator" aria-hidden="true">
                        {selected ? <Check /> : null}
                      </span>
                    </span>
                    <small>{shape.description}</small>
                  </button>
                );
              })}
            </div>

            <div className="subsection-heading">
              <div>
                <p className="utility-label">Page anatomy</p>
                <h3>Which sections help tell the story?</h3>
              </div>
              <span>{sections.length} selected</span>
            </div>
            <div className="section-picker" aria-label="Page sections">
              {pageSections.map((section) => {
                const selected = sections.includes(section.id);
                return (
                  <button
                    key={section.id}
                    type="button"
                    className="section-choice"
                    aria-pressed={selected}
                    onClick={() => toggleSection(section.id)}
                  >
                    <span className="section-check" aria-hidden="true">
                      {selected ? <Check /> : null}
                    </span>
                    <span>
                      <strong>{section.label}</strong>
                      <small>{section.note}</small>
                    </span>
                  </button>
                );
              })}
            </div>

            <Button
              type="button"
              className="continue-button"
              onClick={() => goToStep('ui-patterns', 3)}
            >
              Next: choose useful interactions{' '}
              <ArrowRight data-icon="inline-end" />
            </Button>
          </section>

          <section
            id="ui-patterns"
            className="recipe-step"
            aria-labelledby="patterns-title"
          >
            <div className="step-heading">
              <span className="step-number">04</span>
              <div>
                <p className="utility-label">The ingredients</p>
                <h2 id="patterns-title">Add UI only where it helps.</h2>
                <p>
                  Learn the name, understand the job, then select the patterns
                  your content needs.
                </p>
              </div>
            </div>

            <div className="pattern-grid">
              {uiPatterns.map((pattern) => {
                const selected = patterns.includes(pattern.id);
                return (
                  <button
                    key={pattern.id}
                    type="button"
                    className="pattern-card"
                    aria-pressed={selected}
                    aria-label={`${selected ? 'Remove' : 'Add'} ${pattern.label}`}
                    onClick={() => togglePattern(pattern.id)}
                  >
                    <span
                      className={`pattern-art pattern-art--${pattern.id}`}
                      aria-hidden="true"
                    >
                      <i />
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="pattern-card__body">
                      <span className="pattern-card__topline">
                        <strong>{pattern.label}</strong>
                        <span className="select-indicator" aria-hidden="true">
                          {selected ? <Check /> : null}
                        </span>
                      </span>
                      <span className="plain-name">
                        Also called: {pattern.plainName}
                      </span>
                      <small>{pattern.use}</small>
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="pattern-tip">
              <strong>Small rule:</strong> if a plain list would work better,
              use the list. Interaction should clarify—not decorate.
            </p>

            <Button
              type="button"
              className="continue-button"
              onClick={() => goToStep('motion', 4)}
            >
              Next: set the motion level <ArrowRight data-icon="inline-end" />
            </Button>
          </section>

          <section
            id="motion"
            className="recipe-step"
            aria-labelledby="motion-title"
          >
            <div className="step-heading">
              <span className="step-number">05</span>
              <div>
                <p className="utility-label">The movement</p>
                <h2 id="motion-title">Decide how alive it should feel.</h2>
                <p>
                  Choose one motion philosophy. A site rarely needs every
                  effect.
                </p>
              </div>
            </div>

            <div className="motion-grid">
              {motionLevels.map((level) => {
                const selected = motion === level.id;
                return (
                  <button
                    key={level.id}
                    type="button"
                    className="motion-card"
                    aria-pressed={selected}
                    aria-label={`Use ${level.label} motion`}
                    onClick={() => {
                      setMotion(level.id);
                      reviewStep(5);
                    }}
                  >
                    <span
                      className={`motion-stage motion-stage--${level.id}`}
                      aria-hidden="true"
                    >
                      <i className="motion-orbit" />
                      <i className="motion-dot motion-dot--one" />
                      <i className="motion-dot motion-dot--two" />
                      <i className="motion-dot motion-dot--three" />
                    </span>
                    <span className="motion-card__copy">
                      <span>
                        <strong>{level.label}</strong>
                        <small>{level.description}</small>
                      </span>
                      <span className="select-indicator" aria-hidden="true">
                        {selected ? <Check /> : null}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <Button
              type="button"
              className="continue-button"
              onClick={() => goToStep('access', 5)}
            >
              Next: choose who gets in <ArrowRight data-icon="inline-end" />
            </Button>
          </section>

          <section
            id="access"
            className="recipe-step"
            aria-labelledby="access-title"
          >
            <div className="step-heading">
              <span className="step-number">06</span>
              <div>
                <p className="utility-label">Access and trust</p>
                <h2 id="access-title">Does this site need a door?</h2>
                <p>
                  Use the least restrictive sign-in that protects what actually
                  needs protecting.
                </p>
              </div>
            </div>

            <div className="access-grid">
              {accessOptions.map(({ id, label, description, Icon }) => {
                const selected = access === id;
                return (
                  <button
                    key={id}
                    type="button"
                    className="access-card"
                    aria-pressed={selected}
                    onClick={() => {
                      setAccess(id);
                      reviewStep(6);
                    }}
                  >
                    <span className="access-icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <span>
                      <strong>{label}</strong>
                      <small>{description}</small>
                    </span>
                    <span className="select-indicator" aria-hidden="true">
                      {selected ? <Check /> : null}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="trust-note">
              <KeyRound aria-hidden="true" />
              <p>
                <strong>Plan the gate; don’t fake the security.</strong> Real
                sign-in needs secure server-side setup, protected data rules,
                and clear account recovery. This recipe records the requirement
                for the build.
              </p>
            </div>

            <div className="finish-panel" aria-labelledby="finish-title">
              <div className="finish-heading">
                <div>
                  <p className="utility-label">Your finished recipe</p>
                  <h3 id="finish-title">Ready for ChatGPT Sites.</h3>
                </div>
                <span
                  className={
                    recipeReady
                      ? 'ready-badge'
                      : 'ready-badge ready-badge--open'
                  }
                >
                  {recipeReady ? 'Complete' : 'Needs choices'}
                </span>
              </div>

              <pre className="prompt-preview">{generatedPrompt}</pre>

              <div className="finish-actions">
                <Button
                  type="button"
                  className="copy-button"
                  onClick={copyPrompt}
                  disabled={!recipeReady}
                >
                  {copyState === 'copied' ? <Check /> : <Copy />}
                  {copyState === 'copied'
                    ? 'Copied to clipboard'
                    : 'Copy prompt for Sites'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="reset-button"
                  onClick={resetRecipe}
                >
                  <RotateCcw /> Start over
                </Button>
              </div>
              <p className="copy-status" aria-live="polite">
                {copyState === 'error'
                  ? 'Copying was blocked. Select the brief above and copy it manually.'
                  : copyState === 'copied'
                    ? 'Your build prompt is ready to paste.'
                    : 'You can edit the copied prompt before you build.'}
              </p>
            </div>
          </section>

          <footer className="resource-footer">
            <p>
              Want to go deeper? Browse the source vocabulary and inspiration
              libraries after your first draft—not before it.
            </p>
            <nav aria-label="Design reference libraries">
              <a
                href="https://namethatui.com/"
                target="_blank"
                rel="noreferrer"
              >
                Name That UI
              </a>
              <a href="https://ui.shadcn.com/" target="_blank" rel="noreferrer">
                shadcn/ui
              </a>
              <a
                href="https://motionsites.ai/"
                target="_blank"
                rel="noreferrer"
              >
                Motion Sites
              </a>
              <a
                href="https://www.awwwards.com/"
                target="_blank"
                rel="noreferrer"
              >
                Awwwards
              </a>
            </nav>
          </footer>
        </section>

        <aside className="recipe-rail" aria-label="Live site recipe">
          <div className="recipe-ticket">
            <div className="ticket-topline">
              <span className="utility-label">Live build brief</span>
              <span className="live-dot">Updating</span>
            </div>
            <div className="ticket-window" aria-hidden="true">
              <span className="window-bar">
                <i />
                <i />
                <i />
              </span>
              <span
                className={`window-scene window-scene--${direction ?? 'open'}`}
              >
                <i className="scene-label" />
                <i className="scene-title" />
                <i className="scene-action" />
                <i className="scene-card scene-card--one" />
                <i className="scene-card scene-card--two" />
              </span>
            </div>
            <div className="ticket-copy">
              <span className="ticket-index">SR—001</span>
              <h2>{projectName || 'Untitled site'}</h2>
              <p>{idea || 'Your one-sentence idea will appear here.'}</p>
            </div>
            <dl className="ticket-decisions">
              <div>
                <dt>Direction</dt>
                <dd>{directionLabel}</dd>
              </div>
              <div>
                <dt>Page shape</dt>
                <dd>{shapeLabel}</dd>
              </div>
              <div>
                <dt>Sections</dt>
                <dd>{sections.length || 'Open'}</dd>
              </div>
              <div>
                <dt>UI ingredients</dt>
                <dd>{patterns.length || 'Open'}</dd>
              </div>
              <div>
                <dt>Motion</dt>
                <dd>{motionLabel}</dd>
              </div>
              <div>
                <dt>Access</dt>
                <dd>{accessLabel}</dd>
              </div>
            </dl>
            <p className="ticket-note">
              Your choices become a clean, editable prompt at the finish.
            </p>
            <a className="ticket-link" href="#access">
              Review the complete brief <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </aside>
      </div>
    </main>
  );
}
