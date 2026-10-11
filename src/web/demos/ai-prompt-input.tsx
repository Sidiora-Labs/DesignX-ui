import { useState } from "react";

import AIPromptInput from "@/components/agents/ai-prompt-input";

export default function AIPromptInputDemo() {
  const [value, setValue] = useState("");
  return (
    <AIPromptInput
      className="w-full max-w-lg"
      onSubmit={() => setValue("")}
      onValueChange={setValue}
      placeholder="Ask the DX agent anything…"
      value={value}
    />
  );
}
