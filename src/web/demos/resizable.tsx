import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export default function ResizableDemo() {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-72 w-full max-w-xl rounded-xl border border-outline-variant">
      <ResizablePanel defaultSize={35} minSize={20}>
        <div className="flex h-full items-center justify-center bg-container text-sm font-medium">Sidebar</div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={65}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={60}>
            <div className="flex h-full items-center justify-center text-sm font-medium">Editor</div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40}>
            <div className="flex h-full items-center justify-center bg-container-high font-mono text-xs text-muted-foreground">$ terminal</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
