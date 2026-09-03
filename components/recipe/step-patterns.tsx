import { Check } from 'lucide-react';

import { uiPatterns } from '@/lib/recipe/catalog';
import type { Hint } from '@/lib/recipe/defaults';
import type { UiPattern } from '@/lib/recipe/types';
import { ChoiceHints } from './choice-hints';
import { ContinueButton } from './continue-button';
import { StepHeading } from './step-heading';

type Props = {
  patterns: UiPattern[];
  hints: Hint[];
  onToggle: (id: UiPattern) => void;
};

export function StepPatterns({ patterns, hints, onToggle }: Props) {
  return (
    <section
      id="ui-patterns"
      className="recipe-step"
      aria-labelledby="patterns-title"
    >
      <StepHeading
        number="04"
        label="The ingredients"
        titleId="patterns-title"
        title="Add UI only where it helps."
      >
        <p>
          Learn the name, understand the job, then select the patterns your
          content needs.
        </p>
      </StepHeading>

      <div className="pattern-grid">
        {uiPatterns.map((pattern) => {
          const selected = patterns.includes(pattern.id);
          const plain = pattern.id === 'plain';
          return (
            <button
              key={pattern.id}
              type="button"
              className={
                plain ? 'pattern-card pattern-card--plain' : 'pattern-card'
              }
              aria-pressed={selected}
              aria-label={`${selected ? 'Remove' : 'Add'} ${pattern.label}`}
              onClick={() => onToggle(pattern.id)}
            >
              <span
                className={`pattern-art pattern-art--${pattern.id}`}
                aria-hidden="true"
              >
                <i />
                <i />
                <i />
                {plain ? null : <i />}
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

      <ChoiceHints hints={hints} prefix="pattern-" />

      <p className="pattern-tip">
        <strong>Small rule:</strong> if a plain list would work better, use the
        list. Interaction should clarify—not decorate.
      </p>

      <ContinueButton target="motion">
        Next: set the motion level
      </ContinueButton>
    </section>
  );
}
