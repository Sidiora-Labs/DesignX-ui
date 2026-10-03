import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Meter } from "@/components/ui/meter";

type Project = { name: string; owner: string; status: "On track" | "At risk" | "Done"; progress: number; due: string };

const projects: Project[] = [
  { name: "Registry v1", owner: "Ada L.", status: "On track", progress: 72, due: "Oct 14" },
  { name: "CLI init flow", owner: "Grace H.", status: "At risk", progress: 38, due: "Oct 09" },
  { name: "Docs search", owner: "Alan T.", status: "Done", progress: 100, due: "Sep 28" },
  { name: "Blocks gallery", owner: "Katherine J.", status: "On track", progress: 64, due: "Oct 21" },
  { name: "Theme builder", owner: "Linus T.", status: "At risk", progress: 22, due: "Nov 02" },
  { name: "Figma kit", owner: "Margaret H.", status: "On track", progress: 51, due: "Oct 30" },
  { name: "A11y audit", owner: "Tim B.", status: "Done", progress: 100, due: "Sep 19" },
  { name: "Motion tokens", owner: "Hedy L.", status: "On track", progress: 80, due: "Oct 11" },
  { name: "RTL support", owner: "Dennis R.", status: "At risk", progress: 15, due: "Nov 18" },
];

const tone = { "On track": "info", "At risk": "warning", Done: "success" } as const;

const columns: ColumnDef<Project>[] = [
  { accessorKey: "name", header: ({ column }) => <DataTableColumnHeader column={column} title="Project" />, cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span> },
  { accessorKey: "owner", header: "Owner" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant={tone[row.original.status]}>{row.original.status}</Badge> },
  {
    accessorKey: "progress",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Progress" />,
    cell: ({ row }) => (
      <div className="flex min-w-32 items-center gap-3">
        <Meter value={row.original.progress} className="flex-1" aria-label={`${row.original.name} progress`} />
        <span className="w-9 text-right text-xs text-muted-foreground tabular-nums">{row.original.progress}%</span>
      </div>
    ),
  },
  { accessorKey: "due", header: "Due" },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Open menu" />}>
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Archive</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export function ProjectsTable() {
  return <DataTable columns={columns} data={projects} filterColumn="name" filterPlaceholder="Filter projects…" pageSize={6} />;
}
