import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  Link2,
  RefreshCw,
  RotateCcw,
} from 'lucide-react';

import { CHATGPT_SITES_URL, chatgptComposeUrl } from '@/lib/recipe/catalog';

const IDLE_STATUS = 'You can edit the copied prompt before you build.';
const COPIED_STATUS = 'Your build prompt is ready to paste.';
const COPY_BLOCKED_STATUS =
  'Copying was blocked. The brief is selected, so press Ctrl+C or Cmd+C to copy it.';
const SHARE_STATUS =
  'Share link copied. Anyone who opens it sees these choices.';
const SHARE_BLOCKED_STATUS =
  'Copying was blocked. Copy this page URL from the address bar to share it.';
const SEND_HELP =
  'Send brief to ChatGPT opens ChatGPT in a new tab and sends this brief as a new chat.';
const SEND_TOO_LONG =
  'This brief is too long to send automatically. Copy it, then paste it into ChatGPT.';
const SEND_LABEL = 'Send brief to ChatGPT';
const OPEN_LABEL = 'Open ChatGPT';
const REGENERATED_STATUS = 'Brief regenerated from your choices.';
const NOT_READY_STATUS =
  'Finish the six steps, or edit the brief yourself, before copying.';
/** Describes the link, so its promise and its behaviour stay in sync. */
const SEND_HELP_ID = 'send-brief-help';
/** Lets the copy button borrow the badge as its reason for being inert. */
const READY_BADGE_ID = 'finish-ready-badge';
const COPIED_RESET_MS = 2200;

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** What the last action did. Retired by the next action or a new prompt. */
type Feedback = { text: string; copied: boolean };

type Status = {
  feedback: Feedback | null;
  show: (next: Feedback) => void;
  showCopied: (next: Feedback) => void;
  clear: () => void;
};

/**
 * One status paragraph, so at most one pending expiry: an older action can
 * never blank a newer message, because every write clears the timer and only
 * "copied" re-arms it.
 */
function useStatus(): Status {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function show(next: Feedback) {
    window.clearTimeout(timer.current);
    setFeedback(next);
  }

  return {
    feedback,
    show,
    showCopied: (next) => {
      show(next);
      timer.current = window.setTimeout(
        () => setFeedback(null),
        COPIED_RESET_MS,
      );
    },
    clear: () => {
      window.clearTimeout(timer.current);
      setFeedback(null);
    },
  };
}

type DraftState = {
  edit: string | null;
  setEdit: (next: string | null) => void;
  editor: RefObject<HTMLTextAreaElement | null>;
  status: Status;
  draft: string;
  composeUrl: string;
  blocked: boolean;
  live: Feedback | null;
  tooLong: boolean;
};

/** The editable brief and everything the panel reads off it. */
function useDraft(prompt: string, ready: boolean): DraftState {
  // `null` means "not hand-edited", so the draft simply follows the prompt.
  const [edit, setEdit] = useState<string | null>(null);
  const editor = useRef<HTMLTextAreaElement>(null);
  const status = useStatus();
  const [seenPrompt, setSeenPrompt] = useState(prompt);

  // A message describes the choices that produced it, so a new prompt retires
  // it here, during the render that first sees it. Merely hiding a stale
  // message would let it come back: `buildPrompt` is deterministic, so
  // toggling a choice off and on again rebuilds the very same prompt.
  if (seenPrompt !== prompt) {
    setSeenPrompt(prompt);
    status.clear();
  }

  const draft = edit ?? prompt;
  const composeUrl = chatgptComposeUrl(draft);

  return {
    edit,
    setEdit,
    editor,
    status,
    draft,
    composeUrl,
    // Copy takes the draft, and the draft is the user's to type — so an
    // incomplete recipe only blocks copying while the text is still ours.
    blocked: !ready && edit === null,
    live: status.feedback,
    // Over its length cap `chatgptComposeUrl` drops the brief, so an edited
    // draft can silently open an empty chat. Say that instead of promising it.
    tooLong: draft.trim() !== '' && composeUrl === CHATGPT_SITES_URL,
  };
}

type ActionDeps = DraftState & {
  onReset: () => void;
  onFlushHash: () => void;
};

async function copyPrompt(deps: ActionDeps) {
  const { blocked, draft, editor, status } = deps;

  if (blocked) {
    status.show({ text: NOT_READY_STATUS, copied: false });
    return;
  }
  if (await copyText(draft)) {
    status.showCopied({ text: COPIED_STATUS, copied: true });
    return;
  }
  editor.current?.focus();
  editor.current?.select();
  status.show({ text: COPY_BLOCKED_STATUS, copied: false });
}

async function copyShareLink(deps: ActionDeps) {
  deps.onFlushHash();
  const ok = await copyText(location.href);
  const text = ok ? SHARE_STATUS : SHARE_BLOCKED_STATUS;
  deps.status.show({ text, copied: false });
}

/** The four button handlers, so the panel body stays a description of it. */
function finishActions(deps: ActionDeps) {
  const { editor, setEdit, status } = deps;

  return {
    copy: () => copyPrompt(deps),
    share: () => copyShareLink(deps),
    /**
     * Dropping the edit unmounts the button that was just pressed, which
     * would strand focus on `<body>` (WCAG 2.4.3). Focus moves to the
     * textarea first — the element whose content just changed — and the
     * status paragraph says what happened, since the change is otherwise
     * silent.
     */
    regenerate: () => {
      setEdit(null);
      editor.current?.focus();
      status.show({ text: REGENERATED_STATUS, copied: false });
    },
    startOver: () => {
      status.clear();
      setEdit(null);
      deps.onReset();
    },
  };
}

type ActionsProps = {
  composeUrl: string;
  tooLong: boolean;
  blocked: boolean;
  copied: boolean;
  edited: boolean;
  onCopy: () => void;
  onShare: () => void;
  onRegenerate: () => void;
  onReset: () => void;
};

type CopyProps = { blocked: boolean; copied: boolean; onCopy: () => void };

/**
 * Soft-disabled on purpose: a native `disabled` drops the button out of the
 * tab order, so the one control that explains itself would be the one nobody
 * can reach. It stays focusable, points at the badge for the reason, and
 * `onCopy` refuses the copy itself.
 */
function CopyButton({ blocked, copied, onCopy }: CopyProps) {
  return (
    <button
      type="button"
      className="copy-button"
      onClick={onCopy}
      aria-disabled={blocked}
      aria-describedby={blocked ? READY_BADGE_ID : undefined}
    >
      {copied ? <Check /> : <Copy />}
      {copied ? 'Copied to clipboard' : 'Copy prompt for Sites'}
    </button>
  );
}

/** Over the length cap the link can only open ChatGPT, so it says so. */
function SendLink({
  composeUrl,
  tooLong,
}: {
  composeUrl: string;
  tooLong: boolean;
}) {
  return (
    <a
      className="open-sites-link"
      href={composeUrl}
      target="_blank"
      rel="noreferrer"
      aria-describedby={SEND_HELP_ID}
    >
      {tooLong ? OPEN_LABEL : SEND_LABEL}{' '}
      <ExternalLink data-icon="inline-end" />
    </a>
  );
}

function FinishActions({
  composeUrl,
  tooLong,
  blocked,
  copied,
  edited,
  onCopy,
  onShare,
  onRegenerate,
  onReset,
}: ActionsProps) {
  return (
    <div className="finish-actions">
      <CopyButton blocked={blocked} copied={copied} onCopy={onCopy} />
      <SendLink composeUrl={composeUrl} tooLong={tooLong} />
      <button type="button" className="share-button" onClick={onShare}>
        <Link2 /> Copy share link
      </button>
      {edited ? (
        <button
          type="button"
          className="regenerate-button"
          onClick={onRegenerate}
        >
          <RefreshCw /> Regenerate from choices
        </button>
      ) : null}
      <button type="button" className="reset-button" onClick={onReset}>
        <RotateCcw /> Start over
      </button>
    </div>
  );
}

/** The title, plus the badge the copy button cites when it refuses. */
function FinishHeading({ ready }: { ready: boolean }) {
  return (
    <div className="finish-heading">
      <div>
        <p className="utility-label">Your finished recipe</p>
        <h3 id="finish-title">Ready for ChatGPT Sites.</h3>
      </div>
      <span
        id={READY_BADGE_ID}
        className={ready ? 'ready-badge' : 'ready-badge ready-badge--open'}
      >
        {ready ? 'Complete' : 'Needs choices'}
      </span>
    </div>
  );
}

type EditorProps = {
  value: string;
  editor: RefObject<HTMLTextAreaElement | null>;
  onEdit: (next: string) => void;
};

function PromptEditor({ value, editor, onEdit }: EditorProps) {
  return (
    <textarea
      ref={editor}
      id="prompt-editor"
      className="prompt-editor"
      aria-label="Build prompt, editable"
      rows={16}
      spellCheck={false}
      value={value}
      onChange={(event) => onEdit(event.target.value)}
    />
  );
}

/**
 * The live region carries action results only. Standing help sits in plain
 * paragraphs beside it: text that never changes has nothing to announce, and
 * routing it through the live region made every message end in a second,
 * uninvited announcement as the region fell back to the idle sentence.
 */
function FinishStatus({
  message,
  tooLong,
}: {
  message: string;
  tooLong: boolean;
}) {
  return (
    <>
      <p className="copy-status" aria-live="polite">
        {message}
      </p>
      <p className="copy-status">{IDLE_STATUS}</p>
      <p className="copy-status" id={SEND_HELP_ID}>
        {tooLong ? SEND_TOO_LONG : SEND_HELP}
      </p>
    </>
  );
}

type Props = {
  prompt: string;
  ready: boolean;
  onReset: () => void;
  /** Writes the pending hash immediately so `location.href` is shareable. */
  onFlushHash: () => void;
};

export function FinishPanel({ prompt, ready, onReset, onFlushHash }: Props) {
  const state = useDraft(prompt, ready);
  const { draft, live, tooLong } = state;
  const actions = finishActions({ ...state, onReset, onFlushHash });

  return (
    <section
      id="finish"
      className="finish-panel"
      aria-labelledby="finish-title"
    >
      <FinishHeading ready={ready} />

      <PromptEditor
        value={draft}
        editor={state.editor}
        onEdit={state.setEdit}
      />

      <FinishActions
        composeUrl={state.composeUrl}
        tooLong={tooLong}
        blocked={state.blocked}
        copied={live?.copied ?? false}
        edited={state.edit !== null}
        onCopy={actions.copy}
        onShare={actions.share}
        onRegenerate={actions.regenerate}
        onReset={actions.startOver}
      />
      <FinishStatus message={live?.text ?? ''} tooLong={tooLong} />
    </section>
  );
}
