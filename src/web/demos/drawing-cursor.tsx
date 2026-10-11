import DrawingCursor from "@/components/effects/drawing-cursor";

export default function DrawingCursorDemo() {
  return (
    <DrawingCursor className="h-80 w-full max-w-2xl rounded-2xl bg-muted/40">
      <div className="grid h-full place-items-center">
        <p className="text-2xl font-semibold tracking-tight">Draw with your cursor</p>
      </div>
    </DrawingCursor>
  );
}
