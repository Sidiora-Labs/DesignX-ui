import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const invoices = [
  { id: "INV-001", status: "Paid", method: "Credit card", amount: 250 },
  { id: "INV-002", status: "Pending", method: "PayPal", amount: 150 },
  { id: "INV-003", status: "Unpaid", method: "Bank transfer", amount: 350 },
  { id: "INV-004", status: "Paid", method: "Credit card", amount: 450 },
  { id: "INV-005", status: "Paid", method: "PayPal", amount: 550 },
];

const tone = { Paid: "success", Pending: "warning", Unpaid: "destructive" } as const;

export default function TableDemo() {
  return (
    <Table className="max-w-2xl">
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[110px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((inv) => (
          <TableRow key={inv.id}>
            <TableCell className="font-medium">{inv.id}</TableCell>
            <TableCell>
              <Badge variant={tone[inv.status as keyof typeof tone]}>{inv.status}</Badge>
            </TableCell>
            <TableCell>{inv.method}</TableCell>
            <TableCell className="text-right tabular-nums">${inv.amount.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right tabular-nums">$1,750.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
