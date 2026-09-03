import type { MouseEvent } from 'react';
import { ArrowRight, KeyRound } from 'lucide-react';

import { accessOptions } from '@/lib/recipe/catalog';
import type { Recipe, UiPattern } from '@/lib/recipe/types';
import { scrollToId } from './continue-button';
import { recipeLabels } from './labels';

/** The ticket renders twice (rail + mobile sheet), so ids need a namespace. */
export function liveBriefTitleId(idPrefix: string): string {
  return `${idPrefix}-live-brief-title`;
}

/** Where the ticket link points, and the focus target once it gets there. */
const FINISH_ID = 'finish';

/**
 * Without this the reader lands on the finish panel with focus still parked
 * where it was: on the ticket itself, or — after the mobile sheet closes —
 * back on the summary button at the foot of the viewport. Put focus where the
 * page just scrolled.
 */
function focusFinishPanel() {
  const target = document.getElementById(FINISH_ID);
  if (!target) return;
  // The panel is a plain <section>: -1 makes it a script-only focus stop.
  target.tabIndex = -1;
  // scrollToId already put the panel in view; don't let focus fight it.
  target.focus({ preventScroll: true });
}

type ToplineProps = { titleId: string; briefPulse: boolean };

/** The heading plus the dot that reads 'Updated' right after any change. */
function TicketTopline({ titleId, briefPulse }: ToplineProps) {
  return (
    <div className="ticket-topline">
      <span id={titleId} className="utility-label">
        Live build brief
      </span>
      <span className={briefPulse ? 'live-dot is-updating' : 'live-dot'}>
        {briefPulse ? 'Updated' : 'Live'}
      </span>
    </div>
  );
}

/** How many specimens the miniature window has room for. */
const MAX_SPECIMENS = 6;

/** A recognisable specimen of one UI pattern; the CSS draws each variant. */
function IngredientMiniature({ pattern }: { pattern: UiPattern }) {
  return (
    <span
      className={`scene-ingredient scene-ingredient--${pattern}`}
      data-ingredient={pattern}
    >
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

/** Decorative preview of the described site; hidden from assistive tech. */
function TicketWindow({ recipe }: { recipe: Recipe }) {
  const AccessIcon =
    accessOptions.find((item) => item.id === recipe.access)?.Icon ?? KeyRound;

  return (
    <div className="ticket-window" aria-hidden="true">
      <span className="window-bar">
        <i />
        <i />
        <i />
      </span>
      <span
        className={`window-scene window-scene--${recipe.direction ?? 'open'} window-scene--shape-${recipe.shape ?? 'open'} window-scene--motion-${recipe.motion ?? 'open'}`}
      >
        <i className="scene-label" />
        <i className="scene-title" />
        <i className="scene-action" />
        <i className="scene-card scene-card--one" />
        <i className="scene-card scene-card--two" />
        <span className="scene-sections">
          {recipe.sections.slice(0, 6).map((section) => (
            <b key={section} />
          ))}
        </span>
        <span
          className={`scene-ingredients scene-ingredients--${Math.min(recipe.patterns.length, MAX_SPECIMENS)}`}
        >
          {recipe.patterns.slice(0, MAX_SPECIMENS).map((pattern) => (
            <IngredientMiniature key={pattern} pattern={pattern} />
          ))}
        </span>
        <span className="scene-access">
          <AccessIcon />
        </span>
      </span>
    </div>
  );
}

type TagsProps = { labels: string[]; tagClass?: string };

/** Both list rows share this: chosen labels, or a single 'Not chosen' tag. */
function TicketTags({ labels, tagClass }: TagsProps) {
  if (!labels.length) {
    return (
      <ul className="ticket-tags">
        <li className="ticket-tag ticket-tag--open">Not chosen</li>
      </ul>
    );
  }

  const itemClass = tagClass ? `ticket-tag ${tagClass}` : 'ticket-tag';
  return (
    <ul className="ticket-tags">
      {labels.map((label) => (
        <li key={label} className={itemClass}>
          {label}
        </li>
      ))}
    </ul>
  );
}

/** The decision rows; Audience only appears once the field is filled. */
function TicketDecisions({ recipe }: { recipe: Recipe }) {
  const labels = recipeLabels(recipe);

  return (
    <dl className="ticket-decisions">
      <div className="ticket-decision">
        <dt>Direction</dt>
        <dd>{recipe.direction ? labels.direction : 'Not chosen'}</dd>
      </div>
      <div className="ticket-decision">
        <dt>Page shape</dt>
        <dd>{recipe.shape ? labels.shape : 'Not chosen'}</dd>
      </div>
      {recipe.audience ? (
        <div className="ticket-decision">
          <dt>Audience</dt>
          <dd>{recipe.audience}</dd>
        </div>
      ) : null}
      <div className="ticket-decision ticket-decision--list">
        <dt>Page sections</dt>
        <dd>
          <TicketTags labels={labels.sections} />
        </dd>
      </div>
      <div className="ticket-decision ticket-decision--list">
        <dt>UI ingredients</dt>
        <dd>
          <TicketTags labels={labels.patterns} tagClass="ticket-tag--pattern" />
        </dd>
      </div>
      <div className="ticket-decision">
        <dt>Motion</dt>
        <dd>{recipe.motion ? labels.motion : 'Not chosen'}</dd>
      </div>
      <div className="ticket-decision">
        <dt>Access</dt>
        <dd>{recipe.access ? labels.access : 'Not chosen'}</dd>
      </div>
    </dl>
  );
}

type Props = {
  recipe: Recipe;
  briefPulse: boolean;
  idPrefix: string;
  /** Inside the mobile sheet: no roving tab stop, and links close the sheet. */
  compact?: boolean;
  onNavigate?: () => void;
};

export function LiveBrief({
  recipe,
  briefPulse,
  idPrefix,
  compact = false,
  onNavigate,
}: Props) {
  const titleId = liveBriefTitleId(idPrefix);

  /**
   * Scroll instead of navigating, like the header links do. `location.hash`
   * carries the whole recipe, so letting the browser follow `#finish` would
   * overwrite the shared choices. The href stays for right-click / open in
   * new tab. `onNavigate` closes the mobile sheet synchronously, so the
   * scroll and focus below can run straight after it.
   */
  function handleNavigate(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    onNavigate?.();
    scrollToId(FINISH_ID);
    focusFinishPanel();
  }

  return (
    <section
      className="recipe-ticket"
      aria-labelledby={titleId}
      // The independently scrollable desktop brief must be keyboard-focusable.
      tabIndex={compact ? undefined : 0}
    >
      <TicketTopline titleId={titleId} briefPulse={briefPulse} />
      <TicketWindow recipe={recipe} />
      <div className="ticket-copy">
        <span className="ticket-index">SR—001</span>
        <h2>{recipe.name || 'Untitled site'}</h2>
        <p>{recipe.idea || 'Your one-sentence idea will appear here.'}</p>
      </div>
      <TicketDecisions recipe={recipe} />
      <p className="ticket-note">
        Your choices become a clean, editable prompt at the finish.
      </p>
      <a
        className="ticket-link"
        href={`#${FINISH_ID}`}
        onClick={handleNavigate}
      >
        Review the complete brief <ArrowRight aria-hidden="true" />
      </a>
    </section>
  );
}
