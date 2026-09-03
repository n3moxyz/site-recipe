import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * Scrolls a step into view. `behavior` is deliberately omitted so it
 * defaults to 'auto', which resolves to the computed `scroll-behavior`
 * CSS property: smooth normally, instant under the reduced-motion block
 * in app/globals.css. Passing 'smooth' here would override that.
 */
export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ block: 'start' });
}

type Props = {
  target: string;
  children: ReactNode;
};

/** The "Next: …" button at the foot of a step. */
export function ContinueButton({ target, children }: Props) {
  return (
    <button
      type="button"
      className="continue-button"
      onClick={() => scrollToId(target)}
    >
      {children} <ArrowRight data-icon="inline-end" />
    </button>
  );
}
