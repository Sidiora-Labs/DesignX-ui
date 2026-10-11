import AIToolCall from "@/components/agents/ai-tool-call";

export default function AIToolCallDemo() {
  return (
    <AIToolCall
      args={<pre className="font-mono text-xs">{`{ "query": "DX UI press button" }`}</pre>}
      className="w-full max-w-md"
      defaultOpen
      name="search_docs"
      result={<pre className="font-mono text-xs">3 results · press-button, magnetic-button, clip-corners-button</pre>}
      status="success"
      summary="Found 3 matching components"
    />
  );
}
