import AIContextMeter from "@/components/agents/ai-context-meter";

export default function AIContextMeterDemo() {
  return (
    <AIContextMeter
      breakdown={[
        { label: "System prompt", tokens: 3200 },
        { label: "Conversation", tokens: 61800 },
        { label: "Attachments", tokens: 32400 },
      ]}
      limit={128000}
      used={97400}
    />
  );
}
