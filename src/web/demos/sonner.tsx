import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

export default function SonnerDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        variant="outline"
        onClick={() =>
          toast("Event created", {
            description: "Sunday, December 3 at 9:00 AM",
            action: { label: "Undo", onClick: () => toast("Undone") },
          })
        }
      >
        Show toast
      </Button>
      <Button variant="tonal" onClick={() => toast.success("Changes saved")}>
        Success
      </Button>
      <Button variant="tonal" onClick={() => toast.info("A new version is available")}>
        Info
      </Button>
      <Button variant="tonal" onClick={() => toast.warning("Storage almost full")}>
        Warning
      </Button>
      <Button variant="tonal" onClick={() => toast.error("Couldn't reach the server")}>
        Error
      </Button>
      <Button
        variant="tonal"
        onClick={() =>
          toast.promise(new Promise((r) => setTimeout(r, 1600)), {
            loading: "Deploying…",
            success: "Deployed to production",
            error: "Deploy failed",
          })
        }
      >
        Promise
      </Button>
    </div>
  );
}
