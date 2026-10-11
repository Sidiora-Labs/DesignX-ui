import { Mail } from "lucide-react";

import AnimatedInput from "@/components/elements/animated-input";

export default function AnimatedInputDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <AnimatedInput label="Full name" />
      <AnimatedInput icon={<Mail className="size-4" />} label="Email address" />
    </div>
  );
}
