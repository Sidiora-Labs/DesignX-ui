import * as React from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { ArrowUpIcon } from "lucide-react";

import { ComposerBurst } from "@/components/dx/ai-composer";
import { cn } from "@/lib/utils";

/**
 * MentionComposera single-line prompt where typing `@tool` drops a tilted
 * tool card into the composer, which grows to hold it. Suggestions appear
 * while a mention is half-typed.
 */

type Mention = { id: string; label: string; icon?: React.ReactNode };

type MentionComposerProps = {
  mentions: Mention[];
  onSubmit?: (payload: { text: string; mentions: Mention[] }) => void;
  placeholder?: string;
  className?: string;
};

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function MentionCard({ mention, className }: { mention: Mention; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-background/80 p-1 pr-3 text-sm whitespace-nowrap backdrop-blur",
        className,
      )}
    >
      {mention.icon && (
        <span className="flex size-7 items-center justify-center rounded-md border border-outline-variant bg-container [&_svg]:size-4">{mention.icon}</span>
      )}
      {mention.label}
    </span>
  );
}

function MentionComposer({ mentions, onSubmit, placeholder = "Ask anythingtype @ for tools", className }: MentionComposerProps) {
  const [value, setValue] = React.useState("");
  const [burst, setBurst] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listId = React.useId();

  const pattern = React.useMemo(() => new RegExp(`@(${mentions.map((m) => escape(m.id)).join("|")})\\b`, "g"), [mentions]);
  const active = React.useMemo(() => {
    const ids = Array.from(value.matchAll(pattern), (m) => m[1]);
    return [...new Set(ids)].map((id) => mentions.find((m) => m.id === id)!).filter(Boolean);
  }, [value, pattern, mentions]);

  const partial = /(?:^|\s)@([\w-]*)$/.exec(value)?.[1];
  const suggestions =
    partial !== undefined ? mentions.filter((m) => m.id.startsWith(partial.toLowerCase()) && m.id !== partial && !active.includes(m)) : [];

  const complete = (m: Mention) => {
    setValue((v) => v.replace(/@([\w-]*)$/, `@${m.id} `));
    inputRef.current?.focus();
  };

  const submit = () => {
    const text = value.trim();
    if (!text) return;
    onSubmit?.({ text, mentions: active });
    setValue("");
    setBurst((b) => b + 1);
  };

  const open = active.length > 0;

  return (
    <MotionConfig transition={{ type: "spring", stiffness: 300, damping: 30 }}>
      <div data-slot="mention-composer" className={cn("relative w-full", className)}>
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              id={listId}
              // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
              role="listbox"
              aria-label="Tools"
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              className="absolute bottom-full left-2 mb-2 flex flex-wrap gap-1.5 rounded-xl border border-outline-variant bg-popover p-1.5 shadow-float"
            >
              {suggestions.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
                  role="option"
                  aria-selected={false}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => complete(m)}
                  className="focus-ring state-layer rounded-lg"
                >
                  <MentionCard mention={m} className="border-transparent bg-transparent" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          initial={false}
          animate={{ height: open ? 116 : 60, borderRadius: open ? 20 : 30 }}
          className="relative isolate flex flex-col justify-between overflow-hidden border border-outline-variant bg-container p-2 has-[input:focus-visible]:border-border"
        >
          <input
            ref={inputRef}
            type="text"
            value={value}
            placeholder={placeholder}
            aria-label="Message"
            aria-autocomplete="list"
            aria-controls={suggestions.length ? listId : undefined}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Tab" && suggestions[0]) {
                e.preventDefault();
                complete(suggestions[0]);
              } else if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
            className="h-10 w-full bg-transparent pr-14 pl-3 text-[17px] outline-none placeholder:text-muted-foreground/60"
          />
          <div className="relative ml-1 h-12">
            <AnimatePresence mode="popLayout">
              {active.map((m, i) => (
                <motion.div
                  key={m.id}
                  className="absolute top-1"
                  style={{ left: i * 56 }}
                  initial={{ rotate: 0, scale: 0.7, opacity: 0, y: 12 }}
                  animate={{ rotate: i % 2 === 0 ? 3 : -5, scale: 1, opacity: 1, y: 0 }}
                  exit={{ rotate: 0, scale: 0.7, opacity: 0, y: -24 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  <MentionCard mention={m} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <motion.button
            type="button"
            aria-label="Send"
            onClick={submit}
            disabled={!value.trim()}
            initial={false}
            animate={{ width: open ? 36 : 44, height: open ? 36 : 44 }}
            className="focus-ring state-layer absolute right-2 bottom-2 flex items-center justify-center rounded-full border border-outline-variant bg-background disabled:opacity-50"
          >
            <ArrowUpIcon className="size-5" />
          </motion.button>
          <ComposerBurst trigger={burst} className="z-[-1] h-[200%]" />
        </motion.div>
      </div>
    </MotionConfig>
  );
}

export { MentionCard, MentionComposer };
export type { Mention, MentionComposerProps };
