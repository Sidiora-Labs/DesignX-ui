import { useState } from "react";

import SpringModal from "@/components/elements/spring-modal";
import { Button } from "@/components/ui/button";

export default function SpringModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <SpringModal isOpen={open} onClose={() => setOpen(false)} size="sm" title="Invite your team">
        <p className="text-sm text-muted-foreground">
          Teammates get access to every component, block and theme in your workspace.
        </p>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => setOpen(false)}>Send invites</Button>
        </div>
      </SpringModal>
    </>
  );
}
