import { PlayIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ButtonProtected() {
  return (
    <div className="relative h-56 w-full max-w-md overflow-hidden rounded-xl">
      <img
        src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80&auto=format&fit=crop"
        alt=""
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-4">
        <Button variant="protected">
          <PlayIcon /> Watch film
        </Button>
        <Button variant="protected" size="icon" aria-label="Add">
          +
        </Button>
      </div>
    </div>
  );
}
