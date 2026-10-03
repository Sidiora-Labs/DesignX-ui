import { MouseFollow } from "@/components/dx/mouse-follow";

export default function MouseFollowLabel() {
  return (
    <MouseFollow
      hideCursor
      spring={{ stiffness: 300, damping: 28, mass: 0.4 }}
      className="grid h-72 w-full max-w-lg place-items-center overflow-hidden rounded-3xl bg-[linear-gradient(135deg,var(--dx-blue-1),var(--dx-purple-1))]"
      cursor={<div className="rounded-full bg-foreground px-4 py-2 text-sm font-medium whitespace-nowrap text-background shadow-lg">View project →</div>}
    >
      <span className="text-3xl font-semibold tracking-tight">Hover the card</span>
    </MouseFollow>
  );
}
