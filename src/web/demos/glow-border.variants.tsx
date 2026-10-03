import { GlowBorder } from "@/components/dx/glow-border";

export default function GlowBorderVariantsDemo() {
  return (
    <div className="grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="relative rounded-xl">
        <GlowBorder intensity="none" thickness={1.5} />
        <div className="relative p-5 text-sm">Crisp</div>
      </div>
      <div className="relative rounded-xl">
        <GlowBorder intensity="xl" thickness={3} duration={3} />
        <div className="relative p-5 text-sm">Soft & fast</div>
      </div>
      <div className="relative rounded-xl">
        <GlowBorder colors={["#22c55e", "#06b6d4", "#22c55e"]} duration={8} />
        <div className="relative p-5 text-sm">Custom colors</div>
      </div>
    </div>
  );
}
