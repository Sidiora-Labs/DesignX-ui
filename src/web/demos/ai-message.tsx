import AIMessage from "@/components/agents/ai-message";

export default function AIMessageDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <AIMessage from="user" timestamp="10:42">
        Which DX components work best for an onboarding flow?
      </AIMessage>
      <AIMessage copyText="Try the Animated Stepper with a Press Button." from="assistant" timestamp="10:42">
        Try the Animated Stepper for progress, paired with a Press Button for each step's primary action.
      </AIMessage>
    </div>
  );
}
