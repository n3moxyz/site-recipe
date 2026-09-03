/* oxlint-disable jsx-a11y/prefer-tag-over-role --
 * The starter row is a labelled set of buttons, not form fields. <fieldset>
 * carries `min-inline-size: min-content`, which would change the wrapping of
 * the chip row, so the group is a div with role="group". */

import { starters } from '@/lib/recipe/starters';
import type { Recipe } from '@/lib/recipe/types';
import { IDEA_MAX, NAME_MAX } from '@/lib/recipe/url-state';
import { StepHeading } from './step-heading';

type Props = {
  recipe: Recipe;
  onName: (value: string) => void;
  onIdea: (value: string) => void;
  onAudience: (value: string) => void;
  onStarter: (index: number) => void;
};

export function StepIdea({
  recipe,
  onName,
  onIdea,
  onAudience,
  onStarter,
}: Props) {
  return (
    <section className="recipe-step" aria-labelledby="idea-title">
      <StepHeading
        number="01"
        label="The starting point"
        titleId="idea-title"
        title="What should exist after this?"
      />

      <div className="idea-fields">
        <label htmlFor="project-name">Give it a working name</label>
        <input
          id="project-name"
          className="recipe-input"
          maxLength={NAME_MAX}
          value={recipe.name}
          onChange={(event) => onName(event.target.value)}
        />
        <label htmlFor="project-idea">Describe the idea in one sentence</label>
        <textarea
          id="project-idea"
          className="recipe-textarea"
          maxLength={IDEA_MAX}
          value={recipe.idea}
          onChange={(event) => onIdea(event.target.value)}
        />
        <label htmlFor="project-audience">Who is it for?</label>
        <input
          id="project-audience"
          className="recipe-input"
          maxLength={NAME_MAX}
          placeholder="e.g. neighbors in the East Side who like cooking"
          value={recipe.audience}
          onChange={(event) => onAudience(event.target.value)}
        />
      </div>

      <div
        className="starter-row"
        role="group"
        aria-label="Starter idea examples"
      >
        <span className="utility-label">Try an example</span>
        {starters.map((starter, index) => (
          <button
            key={starter.name}
            type="button"
            className="starter-chip"
            onClick={() => onStarter(index)}
          >
            {starter.name}
          </button>
        ))}
      </div>
    </section>
  );
}
