import * as React from "react";
import { BookOpenIcon } from "lucide-react";

import { Composer, ComposerInput, ComposerSend } from "@/components/dx/ai-composer";
import { ChatBubble, ChatThinking, ChatThread } from "@/components/dx/chat-thread";
import { TextShimmer } from "@/components/dx/text-shimmer";
import { cn } from "@/lib/utils";

type Msg = { id: number; from: "user" | "assistant"; text: string };

export default function AiComposerMinimal() {
  const [messages, setMessages] = React.useState<Msg[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [deep, setDeep] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div className="flex h-[440px] w-full max-w-xl flex-col">
      <ChatThread>
        {messages.map((m) => (
          <ChatBubble key={m.id} from={m.from}>
            {m.text}
          </ChatBubble>
        ))}
        {busy && <ChatThinking key="thinking" label={deep ? "Thinking deeply…" : "Thinking…"} />}
      </ChatThread>
      <Composer
        busy={busy}
        onStop={() => {
          clearTimeout(timer.current);
          setBusy(false);
        }}
        onSubmit={(text) => {
          setMessages((m) => [...m, { id: Date.now(), from: "user", text }]);
          setBusy(true);
          timer.current = setTimeout(() => {
            setMessages((m) => [...m, { id: Date.now() + 1, from: "assistant", text: "Done. Want me to go deeper?" }]);
            setBusy(false);
          }, deep ? 2600 : 1400);
        }}
        className="bg-container-high p-0"
      >
        <div className="relative rounded-2xl border border-outline-variant bg-background">
          <ComposerInput placeholders={["Ask anything…", "Summarize a document…", "Draft a reply…"]} className="pr-14" />
          <ComposerSend variant="default" className="absolute top-2.5 right-2.5 rounded-xl border-transparent" />
        </div>
        <div className="flex h-10 items-center justify-between px-1.5">
          <button
            type="button"
            aria-pressed={deep}
            onClick={() => setDeep(!deep)}
            className={cn(
              "focus-ring state-layer flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors",
              deep && "text-foreground",
            )}
          >
            <BookOpenIcon className="size-4" />
            {deep ? <TextShimmer>Deep thinking on</TextShimmer> : <span>Try deep thinking</span>}
          </button>
          <span className="pr-2 text-xs text-muted-foreground/60">Shift + Enter for a new line</span>
        </div>
      </Composer>
    </div>
  );
}
