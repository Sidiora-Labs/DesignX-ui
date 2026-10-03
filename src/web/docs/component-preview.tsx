import * as React from "react";
import { RotateCcwIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "./code-block";
import { loadDemo, loadDemoSource } from "./sources";

/** Turn the raw demo file into something a reader would paste: strip the docs-only default-export wrapper name. */
function tidy(source: string) {
  return source.replace(/export default function \w+/, "export function Example").trim();
}

function useDemo(name: string) {
  const [Comp, setComp] = React.useState<React.ComponentType | null>(null);
  const [code, setCode] = React.useState("");
  React.useEffect(() => {
    let alive = true;
    setComp(null);
    void loadDemo(name)?.then((m) => alive && setComp(() => m.default));
    void loadDemoSource(name).then((c) => alive && setCode(tidy(c)));
    return () => {
      alive = false;
    };
  }, [name]);
  return { Comp, code };
}

export function ComponentPreview({
  name,
  className,
  align = "center",
  minHeight = 340,
}: {
  name: string;
  className?: string;
  align?: "center" | "start";
  minHeight?: number;
}) {
  const { Comp, code } = useDemo(name);
  const [key, setKey] = React.useState(0);

  return (
    <Tabs defaultValue="preview" className={cn("not-prose gap-3", className)}>
      <div className="flex items-center justify-between">
        <TabsList variant="line">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <Button variant="ghost" size="icon-sm" aria-label="Replay" className="text-muted-foreground" onClick={() => setKey((k) => k + 1)}>
          <RotateCcwIcon />
        </Button>
      </div>
      <TabsContent value="preview">
        <div
          className={cn(
            "relative flex w-full overflow-hidden rounded-xl border border-outline-variant bg-background p-6 sm:p-10",
            align === "center" ? "items-center justify-center" : "items-start justify-center",
          )}
          style={{ minHeight }}
        >
          <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] opacity-70" />
          <div className="relative z-10 flex w-full justify-center" key={key}>
            {Comp ? <Comp /> : <Spinner className="size-5 text-muted-foreground" />}
          </div>
        </div>
      </TabsContent>
      <TabsContent value="code">
        <CodeBlock code={code || "// loading…"} collapsible maxHeight={420} />
      </TabsContent>
    </Tabs>
  );
}
