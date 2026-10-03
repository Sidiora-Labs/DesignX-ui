import { SmoothInput } from "@/components/dx/smooth-input";

export default function SmoothInputSizesDemo() {
  return (
    <div className="grid w-full max-w-md gap-4">
      <SmoothInput size="default" placeholder="Default" aria-label="Default" />
      <SmoothInput size="lg" placeholder="Large" aria-label="Large" />
      <SmoothInput size="xl" placeholder="Extra large" aria-label="Extra large" spring={{ stiffness: 300, damping: 26 }} />
    </div>
  );
}
