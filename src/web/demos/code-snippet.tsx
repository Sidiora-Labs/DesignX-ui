import CodeSnippet from "@/components/elements/code-snippet";

const code = `import PressButton from "@/components/elements/press-button";

export function Cta() {
  return <PressButton variant="candy">Ship it</PressButton>;
}`;

export default function CodeSnippetDemo() {
  return <CodeSnippet className="w-full max-w-xl" code={code} filename="cta.tsx" highlightLines={[4]} language="tsx" showLineNumbers />;
}
