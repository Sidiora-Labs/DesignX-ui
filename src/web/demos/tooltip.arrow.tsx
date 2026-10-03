import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const sides = ["top", "right", "bottom", "left"] as const;

export default function TooltipArrow() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {sides.map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger render={<Button variant="outline" className="capitalize">{side}</Button>} />
          <TooltipContent side={side} variant="outline" arrow>
            Tooltip on {side}
          </TooltipContent>
        </Tooltip>
      ))}
      <Tooltip>
        <TooltipTrigger render={<Button variant="tonal">Inverted</Button>} />
        <TooltipContent arrow>Filled arrow</TooltipContent>
      </Tooltip>
    </div>
  );
}
