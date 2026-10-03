import * as React from "react";
import { DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "@/components/ui/sonner";
import { AppSidebar } from "./app-sidebar";
import { ChartArea, type Range } from "./chart-area";
import { ProjectsTable } from "./projects-table";
import { SectionCards } from "./section-cards";

const scaleFor: Record<Range, number> = { "7d": 1, "30d": 4.2, "90d": 12.8 };

export default function Dashboard01() {
  const [range, setRange] = React.useState<Range>("30d");
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-outline-variant px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-1 h-4" />
          <h1 className="text-sm font-medium">Dashboard</h1>
          <Button size="sm" variant="tonal" className="ml-auto" onClick={() => toast.success("Report exported")}>
            <DownloadIcon /> Export
          </Button>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
          <SectionCards scale={scaleFor[range]} />
          <ChartArea range={range} onRangeChange={setRange} />
          <ProjectsTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
