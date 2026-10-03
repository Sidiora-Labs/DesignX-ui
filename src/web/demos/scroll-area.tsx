import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const tags = Array.from({ length: 40 }, (_, i) => `v1.${40 - i}.0`);

export default function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-72 w-52 rounded-lg border border-outline-variant">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium">Releases</h4>
        {tags.map((t) => (
          <div key={t}>
            <div className="font-mono text-[13px]">{t}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
