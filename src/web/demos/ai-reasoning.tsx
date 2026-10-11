import AIReasoning from "@/components/agents/ai-reasoning";

export default function AIReasoningDemo() {
  return (
    <AIReasoning className="w-full max-w-lg" defaultOpen duration={6}>
      The user wants a pricing page. Three tiers fit the product, so I'll use the pricing block, highlight the
      middle tier with the DX Gradient accent and add a monthly/yearly toggle.
    </AIReasoning>
  );
}
