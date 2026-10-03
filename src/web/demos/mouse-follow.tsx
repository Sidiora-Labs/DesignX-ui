import { MouseFollow } from "@/components/dx/mouse-follow";

export default function MouseFollowDemo() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <MouseFollow spring={false} hideCursor className="grid h-64 place-items-center rounded-3xl bg-container" cursorClassName="mix-blend-difference">
        <span className="text-xs tracking-wider text-muted-foreground uppercase">Exact</span>
      </MouseFollow>
      <MouseFollow
        size={40}
        className="grid h-64 place-items-center rounded-3xl bg-container"
        cursor={<div className="size-10 rounded-full bg-[var(--dx-blue-3)]" />}
      >
        <span className="text-xs tracking-wider text-muted-foreground uppercase">Spring</span>
      </MouseFollow>
    </div>
  );
}
