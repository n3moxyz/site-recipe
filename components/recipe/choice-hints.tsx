/* oxlint-disable jsx-a11y/prefer-tag-over-role --
 * The hint region holds one <p> per hint. <output>, the tag this rule prefers,
 * accepts phrasing content only and may not contain <p>, so the region stays a
 * div with role="status" (same implicit polite live region, valid markup). */

import type { Hint } from '@/lib/recipe/defaults';

type Props = {
  hints: Hint[];
  /** Only hints whose id starts with this prefix appear here. */
  prefix: string;
};

/**
 * Curated mismatch hints for one step.
 *
 * The region stays in the DOM even with no hints. Screen readers announce
 * changes inside a live region they were already observing, so a region that
 * appears together with its first hint is usually never spoken. Empty, the
 * region has no children and no box of its own; its `margin-top` is suppressed
 * so the spacing around the step is unchanged.
 */
export function ChoiceHints({ hints, prefix }: Props) {
  const shown = hints.filter((hint) => hint.id.startsWith(prefix));
  return (
    <div
      className="choice-hints"
      role="status"
      style={shown.length === 0 ? { marginTop: 0 } : undefined}
    >
      {shown.map((hint) => (
        <p key={hint.id} className="choice-hint">
          {hint.text}
        </p>
      ))}
    </div>
  );
}
