import {
  BarChart3Icon,
  ChevronsUpDownIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const main = [
  { title: "Home", icon: HomeIcon, active: true },
  { title: "Inbox", icon: InboxIcon, badge: "12" },
  { title: "Search", icon: SearchIcon },
  { title: "Analytics", icon: BarChart3Icon },
  { title: "Team", icon: UsersIcon },
];
const projects = ["Atlas redesign", "Mobile v3", "Billing"];

/**
 * In an app, render <SidebarProvider> at the rootthe sidebar is fixed to the
 * viewport. Here it is contained (absolute + fixed height) to fit the preview.
 */
export default function SidebarDemo() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-outline-variant [transform:translateZ(0)]">
      <SidebarProvider className="relative h-[460px] min-h-0">
        <Sidebar collapsible="icon" className="absolute h-full">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <div className="grid size-8 shrink-0 place-items-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">DX</div>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate text-sm font-medium">DesignX</span>
                    <span className="truncate text-xs text-muted-foreground">Enterprise</span>
                  </div>
                  <ChevronsUpDownIcon className="ml-auto" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {main.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton isActive={item.active} tooltip={item.title}>
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Projects</SidebarGroupLabel>
              <SidebarGroupAction aria-label="Add project">
                <PlusIcon />
              </SidebarGroupAction>
              <SidebarGroupContent>
                <SidebarMenu>
                  {projects.map((p) => (
                    <SidebarMenuItem key={p}>
                      <SidebarMenuButton tooltip={p}>
                        <FolderIcon />
                        <span>{p}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">
                  <SettingsIcon />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <Avatar className="size-8">
                    <AvatarFallback>AL</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate text-sm font-medium">Ada Lovelace</span>
                    <span className="truncate text-xs text-muted-foreground">ada@designx.dev</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="min-h-0">
          <header className="flex h-14 items-center gap-2 border-b border-outline-variant px-4">
            <SidebarTrigger />
            <span className="text-sm font-medium">Home</span>
          </header>
          <div className="grid flex-1 grid-cols-3 gap-3 p-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-video rounded-lg bg-container" />
            ))}
            <div className="col-span-3 min-h-40 rounded-lg bg-container" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
