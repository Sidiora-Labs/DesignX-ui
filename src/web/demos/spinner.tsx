import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function SpinnerDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <Spinner className="size-4" />
      <Spinner className="size-6" />
      <Spinner className="size-8 text-[var(--dx-blue-3)]" />
      <Button disabled>
        <Spinner /> Saving
      </Button>
      <Button variant="tonal" disabled>
        <Spinner /> Loading
      </Button>
    </div>
  );
}
