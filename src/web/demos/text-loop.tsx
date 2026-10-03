import { TextLoop } from "@/components/dx/text-loop";

export default function TextLoopDemo() {
  return (
    <p className="text-3xl font-medium tracking-tight">
      Build{" "}
      <TextLoop
        className="text-[var(--dx-blue-3)]"
        items={["dashboards", "auth flows", "landing pages", "design systems", "AI prompts"]}
      />
    </p>
  );
}
