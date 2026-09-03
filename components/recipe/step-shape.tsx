/* oxlint-disable jsx-a11y/prefer-tag-over-role --
 * Both pickers are CSS grids of toggle buttons. <fieldset> would apply
 * `min-inline-size: min-content` to the grid container and break the mobile
 * layout, so they stay divs with role="group". */

import type { RefObject } from 'react';
import { useRef } from 'react';
import { Check } from 'lucide-react';

import { pageSections, siteShapes } from '@/lib/recipe/catalog';
import { type Hint, matchesStarterSet } from '@/lib/recipe/defaults';
import type { PageSection, Recipe, SiteShape } from '@/lib/recipe/types';
import { ChoiceHints } from './choice-hints';
import { ContinueButton } from './continue-button';
import { recipeLabels } from './labels';
import { StepHeading } from './step-heading';

type ShapeGridProps = {
  shape: SiteShape | null;
  onShape: (id: SiteShape) => void;
};

/** Step 03's page-type picker: one toggle button per site shape. */
function ShapeGrid({ shape, onShape }: ShapeGridProps) {
  return (
    <div className="shape-grid" role="group" aria-labelledby="shape-title">
      {siteShapes.map((item) => {
        const selected = shape === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className="shape-card"
            aria-pressed={selected}
            onClick={() => onShape(item.id)}
          >
            <span className="shape-card__title">
              <strong>{item.label}</strong>
              <span className="select-indicator" aria-hidden="true">
                {selected ? <Check /> : null}
              </span>
            </span>
            <small>{item.description}</small>
          </button>
        );
      })}
    </div>
  );
}

type AnatomyHeadingProps = {
  count: number;
  shapeLabel: string;
  showStarterSet: boolean;
  onStarterSet: () => void;
};

/** Heading row for the section picker, plus the optional starter-set button. */
function AnatomyHeading({
  count,
  shapeLabel,
  showStarterSet,
  onStarterSet,
}: AnatomyHeadingProps) {
  return (
    <div className="subsection-heading">
      <div>
        <p className="utility-label">Page anatomy</p>
        <h3 id="anatomy-title">Which sections help tell the story?</h3>
      </div>
      <span>{count} selected</span>
      {showStarterSet ? (
        <button
          type="button"
          className="starter-set-button"
          onClick={onStarterSet}
        >
          Use the {shapeLabel} starter set
        </button>
      ) : null}
    </div>
  );
}

type SectionPickerProps = {
  sections: PageSection[];
  listRef: RefObject<HTMLDivElement | null>;
  onToggleSection: (id: PageSection) => void;
};

/** The page-anatomy checklist. `listRef` lets the step move focus into it. */
function SectionPicker({
  sections,
  listRef,
  onToggleSection,
}: SectionPickerProps) {
  return (
    <div
      className="section-picker"
      role="group"
      aria-labelledby="anatomy-title"
      ref={listRef}
    >
      {pageSections.map((section) => {
        const selected = sections.includes(section.id);
        return (
          <button
            key={section.id}
            type="button"
            className="section-choice"
            aria-pressed={selected}
            onClick={() => onToggleSection(section.id)}
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
  );
}

type AnatomySectionProps = {
  recipe: Recipe;
  onToggleSection: (id: PageSection) => void;
  onStarterSet: () => void;
};

/**
 * Heading plus checklist. Applying the starter set makes `matchesStarterSet`
 * true, so the button that was just pressed unmounts and would strand focus
 * on `<body>` (WCAG 2.4.3) — the same hazard `finishActions.regenerate`
 * handles in finish-panel.tsx. Focus moves into the picker whose contents
 * just changed, before React removes the button.
 */
function AnatomySection({
  recipe,
  onToggleSection,
  onStarterSet,
}: AnatomySectionProps) {
  const picker = useRef<HTMLDivElement>(null);
  const applyStarterSet = () => {
    onStarterSet();
    picker.current?.querySelector('button')?.focus();
  };

  return (
    <>
      <AnatomyHeading
        count={recipe.sections.length}
        shapeLabel={recipeLabels(recipe).shape}
        showStarterSet={!matchesStarterSet(recipe)}
        onStarterSet={applyStarterSet}
      />
      <SectionPicker
        sections={recipe.sections}
        listRef={picker}
        onToggleSection={onToggleSection}
      />
    </>
  );
}

type Props = {
  recipe: Recipe;
  hints: Hint[];
  onShape: (id: SiteShape) => void;
  onToggleSection: (id: PageSection) => void;
  onStarterSet: () => void;
};

export function StepShape({
  recipe,
  hints,
  onShape,
  onToggleSection,
  onStarterSet,
}: Props) {
  return (
    <section
      id="site-shape"
      className="recipe-step"
      aria-labelledby="shape-title"
    >
      <StepHeading
        number="03"
        label="The structure"
        titleId="shape-title"
        title="Give the idea a useful shape."
      >
        <p>
          Choose the page type, then keep only the sections that earn their
          place.
        </p>
      </StepHeading>

      <ShapeGrid shape={recipe.shape} onShape={onShape} />

      <AnatomySection
        recipe={recipe}
        onToggleSection={onToggleSection}
        onStarterSet={onStarterSet}
      />

      <ChoiceHints hints={hints} prefix="section-" />

      <ContinueButton target="ui-patterns">
        Next: choose useful interactions
      </ContinueButton>
    </section>
  );
}
