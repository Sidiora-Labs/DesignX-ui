import { BookOpenIcon, BoxIcon, PaletteIcon, SparklesIcon } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const components = [
  { title: "Button", href: "#", desc: "Pill actions with state layers." },
  { title: "Dialog", href: "#", desc: "Spring-scaled modal windows." },
  { title: "Tabs", href: "#", desc: "Sliding-indicator sections." },
  { title: "Number Flow", href: "#", desc: "Animated digit transitions." },
];

export default function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[460px] grid-cols-[180px_1fr] gap-1">
              <NavigationMenuLink href="#" className="row-span-3 justify-end bg-container p-5">
                <SparklesIcon className="mb-2 size-5" />
                <span className="text-base font-medium">DX UI</span>
                <span className="text-[13px] text-muted-foreground">Motion-first components on Base UI.</span>
              </NavigationMenuLink>
              {[
                { icon: BookOpenIcon, t: "Introduction", d: "Principles and architecture." },
                { icon: BoxIcon, t: "Installation", d: "Add DX UI to your app." },
                { icon: PaletteIcon, t: "Theming", d: "Tokens, dark mode, DX Gradient." },
              ].map(({ icon: Icon, t, d }) => (
                <NavigationMenuLink key={t} href="#">
                  <span className="flex items-center gap-2 font-medium">
                    <Icon className="size-4" /> {t}
                  </span>
                  <span className="text-[13px] text-muted-foreground">{d}</span>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[440px] grid-cols-2 gap-1">
              {components.map((c) => (
                <NavigationMenuLink key={c.title} href={c.href}>
                  <span className="font-medium">{c.title}</span>
                  <span className="text-[13px] text-muted-foreground">{c.desc}</span>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="h-9 justify-center rounded-full px-3.5 py-0 font-medium">
            Blocks
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
