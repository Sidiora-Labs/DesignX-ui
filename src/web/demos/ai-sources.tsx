import AISources from "@/components/agents/ai-sources";

export default function AISourcesDemo() {
  return (
    <AISources
      className="w-full max-w-md"
      defaultOpen
      sources={[
        { id: "1", title: "Getting started", url: "https://ui.designx.dev/docs", snippet: "Install the CLI and add your first component." },
        { id: "2", title: "Theming", url: "https://ui.designx.dev/docs/theming", snippet: "Tokens, ramps and the DX Gradient accent." },
        { id: "3", title: "Registry", url: "https://ui.designx.dev/docs/registry", snippet: "Use DX UI with any shadcn-compatible CLI." },
      ]}
    />
  );
}
