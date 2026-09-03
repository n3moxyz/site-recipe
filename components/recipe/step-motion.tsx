import { Check } from 'lucide-react';

import { motionLevels } from '@/lib/recipe/catalog';
import type { Hint } from '@/lib/recipe/defaults';
import type { MotionLevel } from '@/lib/recipe/types';
import { ChoiceHints } from './choice-hints';
import { ContinueButton } from './continue-button';
import { StepHeading } from './step-heading';

type Props = {
  motion: MotionLevel | null;
  hints: Hint[];
  onSelect: (id: MotionLevel) => void;
};

export function StepMotion({ motion, hints, onSelect }: Props) {
  return (
    <section id="motion" className="recipe-step" aria-labelledby="motion-title">
      <StepHeading
        number="05"
        label="The movement"
        titleId="motion-title"
        title="Decide how alive it should feel."
      >
        <p>Choose one motion philosophy. A site rarely needs every effect.</p>
      </StepHeading>

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
              onClick={() => onSelect(level.id)}
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

      <ChoiceHints hints={hints} prefix="motion-" />

      <ContinueButton target="access">Next: choose who gets in</ContinueButton>
    </section>
  );
}
