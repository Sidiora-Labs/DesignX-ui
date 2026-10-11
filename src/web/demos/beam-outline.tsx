import BeamOutline from "@/components/effects/beam-outline";

export default function BeamOutlineDemo() {
  return (
    <BeamOutline className="rounded-3xl">
      <div className="flex w-72 flex-col gap-2 rounded-3xl bg-card p-6">
        <span className="text-xs font-medium text-muted-foreground">Pro plan</span>
        <span className="text-3xl font-semibold">$24/mo</span>
        <span className="text-sm text-muted-foreground">Every component, block and update.</span>
      </div>
    </BeamOutline>
  );
}
