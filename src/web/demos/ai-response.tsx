import AIResponse from "@/components/agents/ai-response";

export default function AIResponseDemo() {
  return (
    <AIResponse
      className="w-full max-w-lg"
      citations={[
        { id: "c1", index: 1, title: "Installation", url: "https://ui.designx.dev/docs/installation" },
        { id: "c2", index: 2, title: "Theming", url: "https://ui.designx.dev/docs/theming" },
      ]}
      text="DX UI ships as source you copy into your app [1]. Every component reads semantic tokens, so switching the accent or theme restyles the whole kit at once [2]."
    />
  );
}
