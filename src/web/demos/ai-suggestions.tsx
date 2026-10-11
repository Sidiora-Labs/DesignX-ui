import AISuggestions from "@/components/agents/ai-suggestions";

export default function AISuggestionsDemo() {
  return (
    <AISuggestions
      className="w-full max-w-lg"
      suggestions={[
        { id: "1", label: "Build a pricing page" },
        { id: "2", label: "Add a dark mode toggle" },
        { id: "3", label: "Animate the hero headline" },
        { id: "4", label: "Create an onboarding flow" },
      ]}
    />
  );
}
