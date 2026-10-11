import GlassCard from "@/components/elements/glass-card";
import { photo } from "@/lib/demo-data";

export default function GlassCardDemo() {
  return (
    <div className="relative grid h-96 w-full max-w-xl place-items-center overflow-hidden rounded-3xl">
      <img alt="" className="absolute inset-0 size-full object-cover" src={photo(14)} />
      <GlassCard className="relative w-72 p-6" interactive>
        <p className="text-xs font-medium text-white/80">Now playing</p>
        <p className="text-xl font-semibold text-white">Spring Easing</p>
        <p className="text-sm text-white/70">DX Sound Lab</p>
      </GlassCard>
    </div>
  );
}
