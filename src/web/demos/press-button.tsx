import { ArrowRight } from "lucide-react";

import PressButton from "@/components/elements/press-button";

export default function PressButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <PressButton variant="candy">Ship it</PressButton>
      <PressButton suffix={<ArrowRight />} variant="solid">
        Continue
      </PressButton>
      <PressButton variant="outline">Outline</PressButton>
      <PressButton loading variant="soft">
        Saving
      </PressButton>
    </div>
  );
}
