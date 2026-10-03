import * as React from "react";
import { BookOpenIcon, BrainIcon, GlobeIcon, ImageIcon, LayoutGridIcon, LightbulbIcon, PlusIcon, SparklesIcon, ZapIcon } from "lucide-react";
import { motion } from "motion/react";

import {
  Composer,
  ComposerGroup,
  ComposerInput,
  ComposerModelSelect,
  ComposerSend,
  ComposerToggle,
  ComposerToolbar,
  type ComposerModel,
} from "@/components/dx/ai-composer";
import { ChatBubble, ChatThinking, ChatThread } from "@/components/dx/chat-thread";
import { TextShimmer } from "@/components/dx/text-shimmer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const models: ComposerModel[] = [
  { id: "pro", name: "DX Pro", icon: SparklesIcon, description: "Best for complex work" },
  { id: "flash", name: "DX Flash", icon: ZapIcon, description: "Fast everyday answers" },
  { id: "reason", name: "DX Reason", icon: LightbulbIcon, description: "Step-by-step thinking" },
];

type Msg = { id: number; from: "user" | "assistant"; text: string };

export default function AiComposerDemo() {
  const [messages, setMessages] = React.useState<Msg[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [search, setSearch] = React.useState(false);
  const [think, setThink] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const started = messages.length > 0;

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const send = (text: string) => {
    setMessages((m) => [...m, { id: Date.now(), from: "user", text }]);
    setBusy(true);
    timer.current = setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: Date.now() + 1, from: "assistant", text: search ? "Here's what I found across 12 sourcesthe short answer is yes." : "Surehere's a quick take on that." },
      ]);
      setBusy(false);
    }, 1600);
  };

  return (
    <div className="relative flex h-[520px] w-full max-w-2xl flex-col overflow-hidden">
      {!started && (
        <motion.div layout className="pointer-events-none absolute inset-x-0 top-[18%] text-center select-none">
          <TextShimmer as="h2" spread={6} className="text-4xl font-medium tracking-[-0.03em]">
            What should we build?
          </TextShimmer>
        </motion.div>
      )}
      <ChatThread className="px-2">
        {messages.map((m) => (
          <ChatBubble key={m.id} from={m.from}>
            {m.text}
          </ChatBubble>
        ))}
        {busy && <ChatThinking key="thinking" label={search ? "Searching the web…" : "Thinking…"} />}
      </ChatThread>
      <motion.div layout initial={false} animate={{ y: started ? 0 : -150 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="px-2 pb-2">
        <Composer onSubmit={send} busy={busy} onStop={() => {
          clearTimeout(timer.current);
          setBusy(false);
        }}>
          <ComposerInput placeholder={search ? "Search the web" : "Ask anything"} />
          <ComposerToolbar className="rounded-xl border border-outline-variant bg-background">
            <ComposerGroup>
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="Add attachment"
                  className="focus-ring state-layer group/add inline-flex size-9 items-center justify-center rounded-xl border border-outline-variant"
                >
                  <PlusIcon className="size-[18px] transition-transform duration-200 group-data-popup-open/add:rotate-45" />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" sideOffset={10}>
                  <DropdownMenuItem><ImageIcon /> Images</DropdownMenuItem>
                  <DropdownMenuItem><BookOpenIcon /> Documents</DropdownMenuItem>
                  <DropdownMenuItem><LayoutGridIcon /> Connect apps</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ComposerToggle icon={<GlobeIcon />} label="Search" spin pressed={search} onPressedChange={setSearch} />
              <ComposerToggle icon={<BrainIcon />} label="Deep think" pressed={think} onPressedChange={setThink} />
              <ComposerModelSelect models={models} />
            </ComposerGroup>
            <ComposerSend />
          </ComposerToolbar>
        </Composer>
      </motion.div>
    </div>
  );
}
