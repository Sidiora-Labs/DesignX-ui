import AILoader from "@/components/agents/ai-loader";

export default function AILoaderDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <AILoader label="Thinking" showElapsed />
      <AILoader label="Searching" variant="bar" />
      <AILoader label="Rendering" variant="grid" />
    </div>
  );
}
