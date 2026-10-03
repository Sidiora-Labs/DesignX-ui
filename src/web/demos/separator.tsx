import { Separator } from "@/components/ui/separator";

export default function SeparatorDemo() {
  return (
    <div className="w-full max-w-sm">
      <div className="grid gap-1">
        <h4 className="text-sm font-medium">DesignX UI</h4>
        <p className="text-[13px] text-muted-foreground">An open-source component library.</p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-sm">
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Components</span>
        <Separator orientation="vertical" />
        <span>Blocks</span>
      </div>
    </div>
  );
}
