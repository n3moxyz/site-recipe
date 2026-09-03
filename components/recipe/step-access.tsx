import type { ReactNode } from 'react';
import { Check, KeyRound } from 'lucide-react';

import { accessOptions } from '@/lib/recipe/catalog';
import type { Hint } from '@/lib/recipe/defaults';
import type { AccessOption } from '@/lib/recipe/types';
import { ChoiceHints } from './choice-hints';
import { StepHeading } from './step-heading';

type Props = {
  access: AccessOption | null;
  hints: Hint[];
  onSelect: (id: AccessOption) => void;
  /** The finish panel, which lives at the end of this step. */
  children: ReactNode;
};

export function StepAccess({ access, hints, onSelect, children }: Props) {
  return (
    <section id="access" className="recipe-step" aria-labelledby="access-title">
      <StepHeading
        number="06"
        label="Access and trust"
        titleId="access-title"
        title="Does this site need a door?"
      >
        <p>
          Use the least restrictive sign-in that protects what actually needs
          protecting.
        </p>
      </StepHeading>

      <div className="access-grid">
        {accessOptions.map(({ id, label, description, Icon }) => {
          const selected = access === id;
          return (
            <button
              key={id}
              type="button"
              className="access-card"
              aria-pressed={selected}
              onClick={() => onSelect(id)}
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

      <ChoiceHints hints={hints} prefix="access-" />

      <div className="trust-note">
        <KeyRound aria-hidden="true" />
        <p>
          <strong>Plan the gate; don’t fake the security.</strong> Real sign-in
          needs secure server-side setup, protected data rules, and clear
          account recovery. This recipe records the requirement for the build.
        </p>
      </div>

      {children}
    </section>
  );
}
