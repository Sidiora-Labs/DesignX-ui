import * as React from "react";
import { BellIcon, CreditCardIcon, PaletteIcon, ShieldAlertIcon, UserIcon, UsersIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { AccountSection, BillingSection, DangerSection, NotificationsSection, ProfileSection, TeamSection } from "./sections";

const sections = [
  { id: "profile", title: "Profile", icon: UserIcon, Comp: ProfileSection },
  { id: "account", title: "Account", icon: PaletteIcon, Comp: AccountSection },
  { id: "notifications", title: "Notifications", icon: BellIcon, Comp: NotificationsSection },
  { id: "billing", title: "Billing", icon: CreditCardIcon, Comp: BillingSection },
  { id: "team", title: "Team", icon: UsersIcon, Comp: TeamSection },
  { id: "danger", title: "Danger zone", icon: ShieldAlertIcon, Comp: DangerSection },
];

export default function Settings01() {
  const [active, setActive] = React.useState("profile");
  const current = sections.find((s) => s.id === active) ?? sections[0];
  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 grid gap-1">
          <h1 className="text-[32px] font-normal tracking-[-0.025em]">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your profile, workspace and billing.</p>
        </div>
        <div className="flex flex-col gap-8 md:flex-row">
          <nav aria-label="Settings" className="flex shrink-0 gap-1 scrollbar-none overflow-x-auto md:w-52 md:flex-col">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-current={active === s.id ? "page" : undefined}
                onClick={() => setActive(s.id)}
                className={cn(
                  "state-layer focus-ring flex h-9 shrink-0 items-center gap-2.5 rounded-full px-3.5 text-left text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground",
                  active === s.id && "bg-container-high text-foreground",
                )}
              >
                <s.icon className="size-4" /> {s.title}
              </button>
            ))}
          </nav>
          <div key={current.id} className="animate-rise min-w-0 flex-1">
            <current.Comp />
          </div>
        </div>
      </div>
    </div>
  );
}
