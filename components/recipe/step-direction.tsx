import { Check } from 'lucide-react';

import { visualDirections } from '@/lib/recipe/catalog';
import type { VisualDirection } from '@/lib/recipe/types';
import { ContinueButton } from './continue-button';
import { StepHeading } from './step-heading';

type Props = {
  direction: VisualDirection | null;
  onSelect: (id: VisualDirection) => void;
};

export function StepDirection({ direction, onSelect }: Props) {
  return (
    <section
      id="visual-direction"
      className="recipe-step"
      aria-labelledby="direction-title"
    >
      <StepHeading
        number="02"
        label="The feeling"
        titleId="direction-title"
        title="Choose a visual direction."
      >
        <p>Pick the closest starting point. You can refine it later.</p>
      </StepHeading>

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
              onClick={() => onSelect(item.id)}
            >
              <span
                className={`direction-preview ${item.previewClass}`}
                aria-hidden="true"
              >
                <span className="preview-kicker">Make something clear</span>
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

      <ContinueButton target="site-shape">Next: shape the page</ContinueButton>
    </section>
  );
}
