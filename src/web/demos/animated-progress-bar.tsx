import { useEffect, useState } from "react";

import AnimatedProgressBar from "@/components/elements/animated-progress-bar";

export default function AnimatedProgressBarDemo() {
  const [value, setValue] = useState(20);
  useEffect(() => {
    const id = setInterval(() => setValue((v) => (v >= 100 ? 10 : v + 15)), 1200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="w-full max-w-sm">
      <AnimatedProgressBar label="Uploading assets" value={value} />
    </div>
  );
}
