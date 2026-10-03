import { CalendarIcon, MessageCircleIcon, MusicIcon } from "lucide-react";

import { MorphPanel } from "@/components/dx/expanding-tabs";

const Row = ({ title, meta }: { title: string; meta: string }) => (
  <div className="flex items-center justify-between rounded-[18px] px-3 py-2.5 text-sm hover:bg-container">
    <span className="font-medium">{title}</span>
    <span className="text-xs text-muted-foreground">{meta}</span>
  </div>
);

const tabs = [
  {
    title: "Today",
    icon: CalendarIcon,
    content: (
      <div className="grid gap-0.5">
        <Row title="Design review" meta="10:00" />
        <Row title="Lunch with Sam" meta="12:30" />
        <Row title="Ship v2.1" meta="16:00" />
      </div>
    ),
  },
  {
    title: "Messages",
    icon: MessageCircleIcon,
    content: (
      <div className="grid gap-0.5">
        <Row title="Grace Hopper" meta="2m" />
        <Row title="Alan Turing" meta="1h" />
      </div>
    ),
  },
  {
    title: "Playing",
    icon: MusicIcon,
    content: (
      <div className="flex items-center gap-3 p-2">
        <div className="size-14 rounded-[14px] bg-gradient-to-br from-[var(--dx-blue-3)] to-[var(--dx-purple-3)]" />
        <div>
          <div className="text-sm font-medium">Midnight City</div>
          <div className="text-xs text-muted-foreground">M83</div>
        </div>
      </div>
    ),
  },
];

export default function MorphPanelDemo() {
  return (
    <div className="flex h-72 items-end justify-center pb-4">
      <MorphPanel tabs={tabs} />
    </div>
  );
}
