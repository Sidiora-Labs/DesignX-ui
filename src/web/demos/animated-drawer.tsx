import Drawer from "@/components/elements/animated-drawer";
import { Button } from "@/components/ui/button";

export default function AnimatedDrawerDemo() {
  return (
    <div className="flex gap-3">
      {(["bottom", "right"] as const).map((side) => (
        <Drawer
          description="Adjust how DX UI looks in this workspace."
          key={side}
          side={side}
          title="Appearance"
          trigger={<Button variant="outline">Open {side}</Button>}
        >
          <p className="text-sm text-muted-foreground">Pick a theme, an accent and a radius.</p>
        </Drawer>
      ))}
    </div>
  );
}
