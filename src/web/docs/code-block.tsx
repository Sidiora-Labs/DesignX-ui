import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CopyButton } from "./copy-button";
import { highlight, type CodeLang } from "./highlight";

type CodeBlockProps = {
  code: string;
  lang?: CodeLang;
  title?: React.ReactNode;
  className?: string;
  /** Collapse long code behind an "Expand" button. */
  collapsible?: boolean;
  maxHeight?: number;
};

export function CodeBlock({ code, lang = "tsx", title, className, collapsible = false, maxHeight = 360 }: CodeBlockProps) {
  const [html, setHtml] = React.useState<string | null>(null);
  const [expanded, setExpanded] = React.useState(!collapsible);
  const trimmed = code.trimEnd();

  React.useEffect(() => {
    let alive = true;
    void highlight(trimmed, lang).then((h) => alive && setHtml(h));
    return () => {
      alive = false;
    };
  }, [trimmed, lang]);

  const long = collapsible && trimmed.split("\n").length > 16;

  return (
    <div data-code-block className={cn("group/code relative overflow-hidden rounded-lg bg-container text-[13px]", className)}>
      {title && (
        <div className="flex h-10 items-center gap-2 border-b border-outline-variant px-4 font-mono text-xs text-muted-foreground">{title}</div>
      )}
      <CopyButton value={trimmed} className={cn("absolute right-2 z-10", title ? "top-1" : "top-2")} />
      <div
        className={cn("relative overflow-auto", long && !expanded && "overflow-hidden")}
        style={long && !expanded ? { maxHeight } : undefined}
      >
        {html ? (
          <div className="[&_pre]:min-w-full [&_pre]:w-max [&_pre]:px-4 [&_pre]:py-3.5 [&_pre]:pr-12 [&_pre]:font-mono [&_pre]:leading-[1.7]" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <pre className="px-4 py-3.5 pr-12 font-mono leading-[1.7] text-muted-foreground">{trimmed}</pre>
        )}
        {long && !expanded && (
          <div className="absolute inset-x-0 bottom-0 flex h-28 items-end justify-center bg-gradient-to-t from-container via-container/80 to-transparent pb-4">
            <Button size="sm" variant="tonal" onClick={() => setExpanded(true)}>
              Expand code
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/** Single-line shell command with a `$` prompt look. */
export function CommandBlock({ command, className }: { command: string; className?: string }) {
  return <CodeBlock code={command} lang="bash" className={className} />;
}
