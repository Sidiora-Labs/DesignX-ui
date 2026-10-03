import * as React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { cn } from "@/lib/utils";

function ResizablePanelGroup({ className, ...props }: React.ComponentProps<typeof PanelGroup>) {
  return <PanelGroup data-slot="resizable-panel-group" className={cn("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className)} {...props} />;
}

function ResizablePanel(props: React.ComponentProps<typeof Panel>) {
  return <Panel data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({ withHandle, className, ...props }: React.ComponentProps<typeof PanelResizeHandle> & { withHandle?: boolean }) {
  return (
    <PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(
        "group/handle relative flex w-px items-center justify-center bg-outline-variant outline-none after:absolute after:inset-y-0 after:left-1/2 after:w-2 after:-translate-x-1/2",
        "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-2 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0 data-[panel-group-direction=vertical]:after:-translate-y-1/2",
        "data-[resize-handle-state=drag]:bg-foreground data-[resize-handle-state=hover]:bg-muted-foreground",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 h-8 w-1.5 rounded-full bg-muted-foreground/50 transition-colors group-data-[panel-group-direction=vertical]/handle:h-1.5 group-data-[panel-group-direction=vertical]/handle:w-8 group-data-[resize-handle-state=drag]/handle:bg-foreground" />
      )}
    </PanelResizeHandle>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
