import EmbossSurface from "@/components/effects/emboss-surface";

export default function EmbossSurfaceDemo() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {(["emboss", "deboss", "plaster", "metal-stamp"] as const).map((variant) => (
        <EmbossSurface className="grid h-32 w-44 place-items-center rounded-3xl" interactive key={variant} variant={variant}>
          <span className="text-2xl font-bold tracking-tight">DX</span>
        </EmbossSurface>
      ))}
    </div>
  );
}
