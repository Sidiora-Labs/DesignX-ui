import { MoonIcon, SparklesIcon, SunIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Toggle dark mode" onClick={toggleTheme} />}>
        {dark ? <SunIcon /> : <MoonIcon />}
      </TooltipTrigger>
      <TooltipContent>{dark ? "Light mode" : "Dark mode"}</TooltipContent>
    </Tooltip>
  );
}

export function AccentToggle() {
  const { accent, setAccent } = useTheme();
  const gradient = accent === "dx-gradient";
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Toggle DX Gradient accent"
            aria-pressed={gradient}
            onClick={() => setAccent(gradient ? "ink" : "dx-gradient")}
            className={cn(gradient && "text-[var(--dx-blue-3)]")}
          />
        }
      >
        <SparklesIcon />
      </TooltipTrigger>
      <TooltipContent>{gradient ? "Ink accent" : "DX Gradient accent"}</TooltipContent>
    </Tooltip>
  );
}
