import { useState } from "react";

import { type AIState, getAIStateMotion, useSimulatedAmplitude } from "@/components/agents/ai-core";
import VoiceOrb from "@/components/agents/voice-orb";
import { cn } from "@/lib/utils";

const states: AIState[] = ["idle", "listening", "thinking", "streaming", "done", "error"];

export default function AICoreDemo() {
  const [state, setState] = useState<AIState>("thinking");
  const amplitude = useSimulatedAmplitude(state);
  const motion = getAIStateMotion(state);
  return (
    <div className="flex flex-col items-center gap-5">
      <VoiceOrb amplitude={amplitude} size="140px" state={state} />
      <div className="flex flex-wrap justify-center gap-1.5">
        {states.map((s) => (
          <button
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              s === state ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground",
            )}
            key={s}
            onClick={() => setState(s)}
            type="button"
          >
            {s}
          </button>
        ))}
      </div>
      <p className="font-mono text-xs text-muted-foreground">
        motif {motion.motif} · intensity {motion.intensity} · speed {motion.speed}
      </p>
    </div>
  );
}
