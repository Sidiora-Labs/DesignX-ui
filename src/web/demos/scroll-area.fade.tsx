import { ScrollArea } from "@/components/ui/scroll-area";

export default function ScrollAreaFade() {
  return (
    <ScrollArea fade className="h-72 w-60 rounded-xl border border-outline-variant">
      <div className="space-y-1 p-1">
        {Array.from({ length: 14 }, (_, i) => (
          <div key={i} className="flex h-10 items-center gap-3 rounded-lg bg-container px-4 font-mono text-[13px] text-muted-foreground hover:bg-container-high">
            {String(i).padStart(3, "0")}
            <div className="h-px flex-1 bg-border" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
