import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

import { TOTAL_STEPS } from '@/lib/recipe/progress';
import type { Recipe } from '@/lib/recipe/types';
import { LiveBrief, liveBriefTitleId } from './live-brief';

type Props = {
  recipe: Recipe;
  briefPulse: boolean;
  completed: number;
};

/** Mirrors the `@media (max-width: 980px)` guard on `.brief-bar` in CSS. */
const BRIEF_BAR_QUERY = '(max-width: 980px)';

/**
 * A `<dialog>` is its own backdrop: the sheet's own padding, and any of its
 * background a child does not cover, both report the dialog as the click
 * target. `event.target === dialog` would therefore dismiss on an in-sheet tap
 * — the full-width strip beside the 44px close button, or the safe-area inset
 * below the ticket. Hit-test the pointer against the sheet's box instead.
 */
function isBackdropClick(dialog: HTMLDialogElement, event: MouseEvent) {
  // Keyboard-activated clicks carry no pointer position (detail 0, at 0/0),
  // and a bottom sheet never contains that point. They are never backdrop
  // clicks; the controls inside the sheet handle their own activation.
  if (event.detail === 0) return false;
  const box = dialog.getBoundingClientRect();
  return (
    event.clientX < box.left ||
    event.clientX > box.right ||
    event.clientY < box.top ||
    event.clientY > box.bottom
  );
}

/** A fixed summary bar (≤ 980px) that opens the live brief in a sheet. */
export function MobileBriefBar({ recipe, briefPulse, completed }: Props) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    // Only a click outside the sheet's own box is a backdrop click.
    const onBackdrop = (event: MouseEvent) => {
      if (!isBackdropClick(dialog, event)) return;
      dialog.close();
      setOpen(false);
    };
    // `close` does not bubble, so React's onClose never sees it. This catches
    // the one dismissal we cannot intercept ourselves: the Escape key.
    const onClose = () => setOpen(false);
    dialog.addEventListener('click', onBackdrop);
    dialog.addEventListener('close', onClose);
    return () => {
      dialog.removeEventListener('click', onBackdrop);
      dialog.removeEventListener('close', onClose);
    };
  }, []);

  // The sheet is a sibling of `.brief-bar`, never a child: a `display: none`
  // ancestor stops a modal dialog from painting but leaves it in the top layer,
  // so the page would stay inert with no visible way out. Rendering it outside
  // the bar fixes that; closing it here keeps a phone-sized sheet from hanging
  // over the desktop layout after a rotation crosses the breakpoint.
  useEffect(() => {
    const query = window.matchMedia(BRIEF_BAR_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) return;
      dialogRef.current?.close();
      setOpen(false);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  function openSheet() {
    dialogRef.current?.showModal();
    setOpen(true);
  }

  function closeSheet() {
    dialogRef.current?.close();
    setOpen(false);
  }

  return (
    <>
      <div className="brief-bar">
        <button
          type="button"
          className="brief-bar__summary"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={openSheet}
        >
          <span className="brief-bar__name">
            {recipe.name || 'Untitled site'}
          </span>
          <span className="brief-bar__meta">
            {completed} of {TOTAL_STEPS} complete
          </span>
          <span className="brief-bar__open">Open brief</span>
        </button>
      </div>
      <dialog
        ref={dialogRef}
        className="brief-sheet"
        aria-labelledby={liveBriefTitleId('sheet')}
      >
        <button
          type="button"
          className="brief-sheet__close"
          aria-label="Close brief"
          onClick={closeSheet}
        >
          <X aria-hidden="true" />
        </button>
        <LiveBrief
          recipe={recipe}
          briefPulse={briefPulse}
          idPrefix="sheet"
          compact
          onNavigate={closeSheet}
        />
      </dialog>
    </>
  );
}
