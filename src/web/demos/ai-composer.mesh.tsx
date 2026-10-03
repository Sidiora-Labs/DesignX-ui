import * as React from "react";
import { AudioLinesIcon, MicIcon, PlusIcon, RotateCcwIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Composer, ComposerInput, ComposerSend, useComposer } from "@/components/dx/ai-composer";
import { MeshGradient } from "@/components/dx/mesh-gradient";
import { TextShimmer } from "@/components/dx/text-shimmer";
import { Button } from "@/components/ui/button";

function VoiceOrSend() {
  const { value } = useComposer();
  return value ? (
    <ComposerSend className="size-10 bg-[#121317] text-white" />
  ) : (
    <motion.button
      type="button"
      aria-label="Voice mode"
      initial={{ scale: 0.6 }}
      animate={{ scale: 1 }}
      className="focus-ring flex size-10 items-center justify-center rounded-full bg-[#121317] text-white"
    >
      <AudioLinesIcon className="size-[18px]" />
    </motion.button>
  );
}

export default function AiComposerMesh() {
  const [submitted, setSubmitted] = React.useState(false);
  return (
    <MeshGradient className="flex h-[420px] w-full items-center justify-center rounded-2xl px-4 [perspective:800px]" colors={["#c1dafe", "#96beff", "#cfb7fc", "#ebe1f9"]}>
      <AnimatePresence mode="popLayout">
        {submitted ? (
          <motion.div key="out" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="grid justify-items-center gap-4">
            <TextShimmer duration={1.2} baseColor="rgba(18,19,23,0.45)" shimmerColor="#121317" className="text-lg">
              Generating your landing page…
            </TextShimmer>
            <Button size="sm" variant="ghost" className="text-[#121317]" onClick={() => setSubmitted(false)}>
              <RotateCcwIcon /> Start over
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="in"
            exit={{ y: -100, opacity: 0, filter: "blur(4px)", rotateX: 25 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            transition={{ duration: 0.3 }}
            className="light w-full max-w-sm"
          >
            <Composer onSubmit={() => setSubmitted(true)} className="flex items-end gap-1 rounded-[28px] border-transparent bg-white p-1.5 text-[#121317] shadow-float">
              <button type="button" aria-label="Attach" className="focus-ring state-layer flex size-10 shrink-0 items-center justify-center rounded-full text-[#45474d]">
                <PlusIcon className="size-5" />
              </button>
              <div className="min-w-0 flex-1">
                <ComposerInput placeholder="Ask anything…" className="min-h-10 px-1 py-2.5 text-base" />
              </div>
              <button type="button" aria-label="Dictate" className="focus-ring state-layer flex size-10 shrink-0 items-center justify-center rounded-full">
                <MicIcon className="size-[18px]" />
              </button>
              <VoiceOrSend />
            </Composer>
          </motion.div>
        )}
      </AnimatePresence>
    </MeshGradient>
  );
}
