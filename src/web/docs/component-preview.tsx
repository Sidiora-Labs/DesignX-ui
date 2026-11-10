import * as React from "react";
import { RotateCcwIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Frame, iconBtn, SegmentedPill, type Segment } from "@/site/ui";
import { CodeBlock } from "./code-block";
import { loadDemo, loadDemoSource } from "./sources";

/** Turn the raw demo file into something a reader would paste: strip the docs-only default-export wrapper name. */
function tidy(source: string) {
  return source.replace(/export default function \w+/, "export function Example").trim();
}

const VIEWS: Segment<"preview" | "code">[] = [
  { value: "preview", label: "Preview" },
  { value: "code", label: "Code" },
];

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
  const [view, setView] = React.useState<"preview" | "code">("preview");
  const uid = React.useId();

  return (
    <div className={cn("not-prose flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <SegmentedPill id={uid} label="Preview or code" size="sm" items={VIEWS} value={view} onValueChange={setView} controls={`${uid}-panel`} />
        <button type="button" aria-label="Replay" className={iconBtn()} onClick={() => setKey((k) => k + 1)}>
          <RotateCcwIcon />
        </button>
      </div>
      <div id={`${uid}-panel`} role="tabpanel">
        {/* Kept mounted while the code is open so the demo keeps its state. */}
        <Frame
          hidden={view !== "preview"}
          className={cn("relative flex w-full p-6 sm:p-10", view !== "preview" && "hidden", align === "center" ? "items-center justify-center" : "items-start justify-center")}
          style={{ minHeight }}
        >
          <div className="relative z-10 flex w-full justify-center" key={key}>
            {Comp ? <Comp /> : <Spinner className="size-5 text-muted-foreground" />}
          </div>
        </Frame>
        {view === "code" && <CodeBlock code={code || "// loading…"} collapsible maxHeight={420} />}
      </div>
    </div>
  );
}
