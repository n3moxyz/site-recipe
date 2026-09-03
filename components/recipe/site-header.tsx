/* oxlint-disable jsx-a11y/prefer-tag-over-role --
 * The progress meter is a styled label + track + count. A native <progress>
 * cannot contain those children, so role="progressbar" on the wrapper is the
 * only way to expose the value to assistive tech. */

import type { MouseEvent } from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';

import { TOTAL_STEPS } from '@/lib/recipe/progress';
import { scrollToId } from './continue-button';

type Props = {
  completed: number;
};

/**
 * Put focus where the page just scrolled. `preventDefault` below cancels the
 * browser's own focus move, so without this a keyboard user reading step 02
 * still has focus on the header link and the next Tab drops them into step 01.
 * Mirrors `focusFinishPanel` in live-brief.tsx.
 */
function focusSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  // The step is a plain <section>: -1 makes it a script-only focus stop.
  target.tabIndex = -1;
  // scrollToId already put the section in view; don't let focus fight it.
  target.focus({ preventScroll: true });
}

/**
 * Scroll to a section instead of navigating to it. `location.hash` carries the
 * whole recipe, so letting the browser follow `#top` / `#visual-direction`
 * would overwrite the shared choices. The href stays for right-click / open in
 * new tab.
 *
 * `moveFocus` is off for the brand link: `#top` wraps the whole page, so
 * focusing it would rewind the reader past the header they are standing in.
 */
function scrollWithoutHash(id: string, moveFocus = true) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToId(id);
    if (moveFocus) focusSection(id);
  };
}

export function SiteHeader({ completed }: Props) {
  return (
    <header className="site-header">
      <a
        className="brand"
        href="#top"
        aria-label="Site Recipe home"
        onClick={scrollWithoutHash('top', false)}
      >
        <span className="brand-mark" aria-hidden="true">
          <Sparkles />
        </span>
        <span>Site Recipe</span>
      </a>
      <div
        className="header-progress"
        role="progressbar"
        aria-label="Recipe progress"
        aria-valuemin={0}
        aria-valuemax={TOTAL_STEPS}
        aria-valuenow={completed}
        aria-valuetext={`${completed} of ${TOTAL_STEPS} steps complete`}
      >
        <span className="header-progress__label">Your recipe</span>
        <span className="header-progress__track" aria-hidden="true">
          <span
            className="header-progress__fill"
            style={{ width: `${(completed / TOTAL_STEPS) * 100}%` }}
          />
        </span>
        <span className="utility-label">
          {completed} / {TOTAL_STEPS}
        </span>
      </div>
      <a
        className="quiet-link"
        href="#visual-direction"
        onClick={scrollWithoutHash('visual-direction')}
      >
        <span className="quiet-link__text">Explore the flow</span>
        <ArrowDown aria-hidden="true" />
      </a>
    </header>
  );
}
