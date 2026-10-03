import { FingerprintIcon } from "lucide-react";
import { toast } from "sonner";

import { MorphConfirm } from "@/components/dx/morph-confirm";

export default function MorphConfirmDemo() {
  return (
    <div className="flex h-72 w-full items-end justify-center pb-6">
      <MorphConfirm
        label="Receive"
        title="Confirm"
        icon={<FingerprintIcon className="text-[var(--dx-blue-3)]" />}
        description="Approve this transfer of 2.4 ETH to your main wallet?"
        onConfirm={() => toast.success("Transfer approved")}
      />
    </div>
  );
}
