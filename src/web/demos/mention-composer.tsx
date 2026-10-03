import * as React from "react";
import { FaGoogle, FaYoutube } from "react-icons/fa6";
import { SiNotion } from "react-icons/si";
import { AnimatePresence, motion } from "motion/react";

import { MentionCard, MentionComposer, type Mention } from "@/components/dx/mention-composer";

const tools: Mention[] = [
  { id: "yt", label: "YouTube Analyzer", icon: <FaYoutube className="text-[#ff0000]" /> },
  { id: "google", label: "Web Search", icon: <FaGoogle className="text-[var(--dx-blue-3)]" /> },
  { id: "notion", label: "Notion", icon: <SiNotion /> },
];

type Sent = { id: number; text: string; mentions: Mention[] };

export default function MentionComposerDemo() {
  const [sent, setSent] = React.useState<Sent[]>([]);
  return (
    <div className="flex h-[440px] w-full max-w-lg flex-col justify-end gap-4">
      <div className="flex flex-col items-end gap-2 overflow-hidden">
        <AnimatePresence initial={false}>
          {sent.slice(-3).map((s) => (
            <motion.div key={s.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-end gap-1.5">
              <div className="max-w-[300px] rounded-[14px_14px_6px_14px] bg-container-high px-3.5 py-2 text-[15px]">{s.text}</div>
              {s.mentions.map((m) => (
                <MentionCard key={m.id} mention={m} />
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <MentionComposer mentions={tools} onSubmit={(p) => setSent((s) => [...s, { id: Date.now(), ...p }])} />
      <p className="text-center text-xs text-muted-foreground">
        Try <code className="font-mono">@yt</code>, <code className="font-mono">@google</code> or <code className="font-mono">@notion</code>Tab completes.
      </p>
    </div>
  );
}
