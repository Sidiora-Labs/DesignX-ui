import AIArtifact from "@/components/agents/ai-artifact";

const code = `export function Hello() {
  return <PressButton>Ship it</PressButton>;
}`;

export default function AIArtifactDemo() {
  return (
    <AIArtifact
      className="w-full max-w-lg"
      code={<pre className="p-4 font-mono text-xs leading-relaxed">{code}</pre>}
      copyText={code}
      preview={
        <div className="grid h-40 place-items-center">
          <button className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground" type="button">
            Ship it
          </button>
        </div>
      }
      title="hello.tsx"
    />
  );
}
