import AIConversation from "@/components/agents/ai-conversation";
import AIMessage from "@/components/agents/ai-message";

export default function AIConversationDemo() {
  return (
    <AIConversation className="h-80 w-full max-w-lg">
      <AIMessage from="user">Can you add a dark mode toggle to the header?</AIMessage>
      <AIMessage from="assistant">
        Done. I added the theme switch next to the search button and wired it to the stored preference.
      </AIMessage>
      <AIMessage from="user">Make it animate between sun and moon.</AIMessage>
      <AIMessage from="assistant">The icon now morphs with a spring and respects reduced motion.</AIMessage>
    </AIConversation>
  );
}
