import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonDemo() {
  return (
    <div className="grid w-full max-w-sm gap-5">
      <div className="flex items-center gap-4">
        <Skeleton className="size-12 rounded-full" />
        <div className="grid flex-1 gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <Skeleton className="aspect-video w-full rounded-xl" />
    </div>
  );
}
