import * as React from "react";

import { ThemeToggle, type ThemeTransitionStart, type ThemeTransitionVariant } from "@/components/dx/theme-toggle";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const variants: ThemeTransitionVariant[] = ["circle", "circle-blur", "rectangle", "polygon", "none"];
const starts: Record<ThemeTransitionVariant, ThemeTransitionStart[]> = {
  circle: ["pointer", "center", "top-left", "top-right", "bottom-left", "bottom-right", "top-center", "bottom-center"],
  "circle-blur": ["pointer", "center", "top-left", "top-right", "bottom-left", "bottom-right"],
  rectangle: ["bottom-up", "top-down", "left-right", "right-left", "top-left", "bottom-right"],
  polygon: ["top-left", "top-right"],
  gif: ["center"],
  none: ["center"],
};
const toItems = (xs: string[]) => xs.map((x) => ({ label: x, value: x }));

export default function ThemeToggleTransitions() {
  const [variant, setVariant] = React.useState<ThemeTransitionVariant>("circle");
  const [start, setStart] = React.useState<ThemeTransitionStart>("pointer");
  const [blur, setBlur] = React.useState(false);

  return (
    <div className="grid w-full max-w-sm gap-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label>Variant</Label>
          <Select
            items={toItems(variants)}
            value={variant}
            onValueChange={(v) => {
              const next = v as ThemeTransitionVariant;
              setVariant(next);
              setStart(starts[next][0]);
            }}
          >
            <SelectTrigger aria-label="Variant" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {variants.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label>Start</Label>
          <Select items={toItems(starts[variant])} value={start} onValueChange={(v) => setStart(v as ThemeTransitionStart)}>
            <SelectTrigger aria-label="Start" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {starts[variant].map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-2xl bg-container px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          <Switch checked={blur} onCheckedChange={setBlur} aria-label="Blur" disabled={variant === "circle-blur" || variant === "none"} />
          <span aria-hidden>Blur edge</span>
        </div>
        <ThemeToggle icon="half" appearance="solid" variant={variant} start={start} blur={blur} />
      </div>
    </div>
  );
}
