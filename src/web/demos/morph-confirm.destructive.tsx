import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { MorphConfirm } from "@/components/dx/morph-confirm";

export default function MorphConfirmDestructive() {
  return (
    <div className="flex h-64 w-full items-end justify-center pb-6">
      <MorphConfirm
        label="Delete project"
        title="Delete project"
        icon={<Trash2Icon className="text-destructive" />}
        description="This permanently removes the project and its 12 deployments."
        buttonClassName="bg-destructive text-destructive-foreground"
        backdrop={false}
        onConfirm={() => toast("Project deleted")}
      />
    </div>
  );
}
