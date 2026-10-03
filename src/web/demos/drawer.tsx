import * as React from "react";
import { MinusIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { NumberFlow } from "@/components/dx/number-flow";

export default function DrawerDemo() {
  const [goal, setGoal] = React.useState(350);
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline" />}>Open drawer</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move goal</DrawerTitle>
          <DrawerDescription>Set your daily activity goal.</DrawerDescription>
        </DrawerHeader>
        <div className="flex items-center justify-center gap-6 py-6">
          <Button variant="outline" size="icon-lg" aria-label="Decrease" onClick={() => setGoal((g) => Math.max(200, g - 10))}>
            <MinusIcon />
          </Button>
          <div className="text-center">
            <NumberFlow value={goal} className="text-6xl font-medium tracking-tight" />
            <div className="mt-1 text-xs text-muted-foreground uppercase">calories / day</div>
          </div>
          <Button variant="outline" size="icon-lg" aria-label="Increase" onClick={() => setGoal((g) => Math.min(800, g + 10))}>
            <PlusIcon />
          </Button>
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button />}>Submit</DrawerClose>
          <DrawerClose render={<Button variant="tonal" />}>Cancel</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
