import HolographicFoil from "@/components/effects/holographic-foil";

export default function HolographicFoilDemo() {
  return (
    <HolographicFoil className="h-96 w-64 rounded-3xl" pattern="aurora">
      <div className="flex h-full flex-col justify-between p-6">
        <span className="w-fit rounded-full bg-background/80 px-3 py-1 text-xs font-semibold">Founding member</span>
        <div className="rounded-2xl bg-background/80 p-4 backdrop-blur">
          <p className="text-lg font-semibold">DesignX UI</p>
          <p className="text-xs text-muted-foreground">No. 0042 · Tilt the card</p>
        </div>
      </div>
    </HolographicFoil>
  );
}
