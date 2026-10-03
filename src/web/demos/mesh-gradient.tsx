import { MeshGradient } from "@/components/dx/mesh-gradient";

export default function MeshGradientDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
      <MeshGradient className="flex aspect-[4/3] items-end rounded-2xl p-5">
        <span className="text-lg font-medium text-[#121317]">Default</span>
      </MeshGradient>
      <MeshGradient
        grain
        duration={12}
        colors={["var(--dx-pink-3)", "var(--dx-yellow-2)", "var(--dx-red-3)", "var(--dx-purple-3)", "var(--dx-blue-3)"]}
        className="flex aspect-[4/3] items-end rounded-2xl p-5"
      >
        <span className="text-lg font-medium text-white">Sunset, with grain</span>
      </MeshGradient>
    </div>
  );
}
