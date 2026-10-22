import { toast } from "sonner";

import { MarketNoticeDialog } from "@/components/trading/order-confirm";
import { Button } from "@/components/ui/button";

// Shown before the first order on a community-listed market. Remember the acknowledgement on your side.
export default function OrderConfirmNoticeDemo() {
  return <MarketNoticeDialog trigger={<Button variant="outline">Trade WIF-PERP</Button>} onConfirm={() => toast.success("Acknowledged")} />;
}
