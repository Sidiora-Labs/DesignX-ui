import GooeyPopover from "@/components/elements/gooey-popover";

export default function GooeyPopoverDemo() {
  return (
    <GooeyPopover triggerLabel="Open menu">
      <div className="flex flex-col gap-1 p-2 text-sm">
        <span className="font-medium">Quick actions</span>
        <span className="opacity-70">New component</span>
        <span className="opacity-70">New block</span>
        <span className="opacity-70">Invite teammate</span>
      </div>
    </GooeyPopover>
  );
}
