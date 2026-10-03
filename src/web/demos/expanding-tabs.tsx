import * as React from "react";
import { BellIcon, HomeIcon, SearchIcon, SettingsIcon, UserIcon } from "lucide-react";

import { ExpandingTabs } from "@/components/dx/expanding-tabs";

const tabs = [
  { title: "Home", icon: HomeIcon },
  { title: "Search", icon: SearchIcon },
  { title: "Alerts", icon: BellIcon },
  { title: "Profile", icon: UserIcon },
  { title: "Settings", icon: SettingsIcon },
];

export default function ExpandingTabsDemo() {
  const [selected, setSelected] = React.useState<number | null>(0);
  return (
    <div className="rounded-full border border-outline-variant bg-background p-1.5">
      <ExpandingTabs tabs={tabs} selected={selected} onSelectedChange={(i) => setSelected(i)} />
    </div>
  );
}
