import { useState } from "react";

import MorphIcon from "@/components/elements/morph-icon";

export default function MorphIconDemo() {
  const [active, setActive] = useState(false);
  return (
    <button
      className="grid size-14 place-items-center rounded-2xl bg-muted"
      onClick={() => setActive((a) => !a)}
      type="button"
    >
      <MorphIcon active={active} label="Toggle menu" size={28} variant="list" />
    </button>
  );
}
