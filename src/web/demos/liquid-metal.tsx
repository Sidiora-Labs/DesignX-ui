import LiquidMetal from "@/components/effects/liquid-metal";

export default function LiquidMetalDemo() {
  return (
    <LiquidMetal className="h-72 w-full max-w-xl overflow-hidden rounded-3xl" variant="chrome">
      <div className="grid h-full place-items-center">
        <span className="text-5xl font-black tracking-tight text-white mix-blend-difference">DX</span>
      </div>
    </LiquidMetal>
  );
}
