import Squircle from "@/components/elements/squircle";

export default function SquircleDemo() {
  return (
    <div className="flex gap-6">
      <Squircle className="grid size-32 place-items-center bg-primary text-2xl font-bold text-primary-foreground" radius={36}>
        DX
      </Squircle>
      <Squircle border className="grid size-32 place-items-center bg-card text-sm text-muted-foreground" radius={36}>
        Smooth
      </Squircle>
    </div>
  );
}
