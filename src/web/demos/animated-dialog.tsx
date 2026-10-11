import Dialog from "@/components/elements/animated-dialog";
import { Button } from "@/components/ui/button";

export default function AnimatedDialogDemo() {
  return (
    <Dialog
      description="Your workspace and all its components will be archived."
      footer={<Button>Archive</Button>}
      title="Archive workspace?"
      trigger={<Button variant="outline">Open dialog</Button>}
    >
      <p className="text-sm text-muted-foreground">You can restore it from settings for 30 days.</p>
    </Dialog>
  );
}
