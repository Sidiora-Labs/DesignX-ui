import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Payment = { id: string; email: string; amount: number; status: "paid" | "pending" | "failed" };

const data: Payment[] = [
  { id: "INV-1042", email: "mira@lumen.studio", amount: 316, status: "paid" },
  { id: "INV-1043", email: "leo@northwind.io", amount: 242, status: "pending" },
  { id: "INV-1044", email: "ana@ruiz.design", amount: 837, status: "paid" },
  { id: "INV-1045", email: "sam@okafor.dev", amount: 874, status: "failed" },
  { id: "INV-1046", email: "kai@tidal.app", amount: 721, status: "paid" },
  { id: "INV-1047", email: "noor@fable.co", amount: 129, status: "pending" },
  { id: "INV-1048", email: "ivy@orbit.so", amount: 455, status: "paid" },
  { id: "INV-1049", email: "theo@grain.fm", amount: 98, status: "paid" },
  { id: "INV-1050", email: "zoe@prism.ai", amount: 1204, status: "failed" },
];

const tone = { paid: "success", pending: "warning", failed: "destructive" } as const;

const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected()}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
  { accessorKey: "id", header: "Invoice", cell: ({ row }) => <span className="font-mono text-[13px]">{row.getValue("id")}</span> },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.getValue<Payment["status"]>("status");
      return (
        <Badge variant={tone[s]} className="capitalize">
          {s}
        </Badge>
      );
    },
  },
  { accessorKey: "email", header: ({ column }) => <DataTableColumnHeader column={column} title="Email" /> },
  {
    accessorKey: "amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" className="justify-end" />,
    cell: ({ row }) => (
      <div className="text-right font-medium tabular-nums">
        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(row.getValue("amount"))}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Open menu" />}>
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Copy invoice ID</DropdownMenuItem>
          <DropdownMenuItem>View customer</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Refund</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function DataTableDemo() {
  return <DataTable columns={columns} data={data} filterColumn="email" filterPlaceholder="Filter emails…" pageSize={6} />;
}
