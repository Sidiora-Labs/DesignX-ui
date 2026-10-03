import { TextShimmer } from "@/components/dx/text-shimmer";

export default function TextShimmerDemo() {
  return (
    <div className="grid justify-items-center gap-5">
      <TextShimmer as="p" className="text-2xl font-medium tracking-[-0.02em]">
        Generating your report…
      </TextShimmer>
      <TextShimmer duration={1.2} className="text-sm">
        Thinking…
      </TextShimmer>
      <TextShimmer
        duration={3}
        spread={4}
        baseColor="var(--dx-blue-3)"
        shimmerColor="var(--dx-pink-2)"
        className="text-4xl font-semibold tracking-[-0.04em]"
      >
        DX Gradient
      </TextShimmer>
    </div>
  );
}
