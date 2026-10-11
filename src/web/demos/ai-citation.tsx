import AICitation from "@/components/agents/ai-citation";

export default function AICitationDemo() {
  return (
    <p className="max-w-md text-sm leading-relaxed">
      DX UI components are copied into your project, so you own every line
      <AICitation
        description="How the registry and CLI install components."
        label={1}
        title="Installation guide"
        url="https://ui.designx.dev/docs/installation"
      />{" "}
      and can theme them with CSS variables
      <AICitation
        description="Every token, ramp and accent explained."
        label={2}
        title="Theming"
        url="https://ui.designx.dev/docs/theming"
      />
      .
    </p>
  );
}
