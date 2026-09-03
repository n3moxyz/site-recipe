'use client';

import { FinishPanel } from './finish-panel';
import { IntroBlock } from './intro-block';
import { recipeLabels } from './labels';
import { LiveBrief } from './live-brief';
import { MobileBriefBar } from './mobile-brief-bar';
import { ResourceFooter } from './resource-footer';
import { SiteHeader } from './site-header';
import { StepAccess } from './step-access';
import { StepDirection } from './step-direction';
import { StepIdea } from './step-idea';
import { StepMotion } from './step-motion';
import { StepPatterns } from './step-patterns';
import { StepShape } from './step-shape';
import { useRecipe } from './use-recipe';

export function RecipeBuilder() {
  const app = useRecipe();
  const { recipe } = app;
  const labels = recipeLabels(recipe);

  return (
    <>
      <SiteHeader completed={app.completed} />

      <main>
        <output className="sr-only" aria-live="polite">
          Brief updated. {recipe.direction ? labels.direction : 'No'} direction,{' '}
          {recipe.shape ? labels.shape : 'no page shape'}, page sections:{' '}
          {labels.sections.length ? labels.sections.join(', ') : 'not chosen'}.
          UI ingredients:{' '}
          {labels.patterns.length ? labels.patterns.join(', ') : 'not chosen'}.{' '}
          {recipe.motion ? labels.motion : 'no'} motion, and{' '}
          {recipe.access ? labels.access : 'no access choice'}.
        </output>

        <div id="top" className="page-shell">
          <section className="builder-column" aria-labelledby="page-title">
            <IntroBlock />

            <StepIdea
              recipe={recipe}
              onName={app.setName}
              onIdea={app.setIdea}
              onAudience={app.setAudience}
              onStarter={app.applyStarter}
            />

            <StepDirection
              direction={recipe.direction}
              onSelect={app.setDirection}
            />

            <StepShape
              recipe={recipe}
              hints={app.hints}
              onShape={app.setShape}
              onToggleSection={app.toggleSection}
              onStarterSet={app.useStarterSet}
            />

            <StepPatterns
              patterns={recipe.patterns}
              hints={app.hints}
              onToggle={app.togglePattern}
            />

            <StepMotion
              motion={recipe.motion}
              hints={app.hints}
              onSelect={app.setMotion}
            />

            <StepAccess
              access={recipe.access}
              hints={app.hints}
              onSelect={app.setAccess}
            >
              <FinishPanel
                prompt={app.prompt}
                ready={app.ready}
                onReset={app.reset}
                onFlushHash={app.flushHash}
              />
            </StepAccess>

            <ResourceFooter />
          </section>

          <aside className="recipe-rail" aria-label="Live site recipe">
            <LiveBrief
              recipe={recipe}
              briefPulse={app.briefPulse}
              idPrefix="desktop"
            />
          </aside>
        </div>

        <MobileBriefBar
          recipe={recipe}
          briefPulse={app.briefPulse}
          completed={app.completed}
        />
      </main>
    </>
  );
}
