import AnimatedTooltip from "@/components/elements/animated-tooltip";

export default function AnimatedTooltipDemo() {
  return (
    <AnimatedTooltip content="Copied to clipboard">
      <button className="rounded-full bg-muted px-4 py-2 text-sm font-medium" type="button">
        Hover me
      </button>
    </AnimatedTooltip>
  );
}
