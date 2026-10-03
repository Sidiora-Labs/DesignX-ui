import * as React from "react";

import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";

export default function ProgressDemo() {
  const [value, setValue] = React.useState(13);
  React.useEffect(() => {
    const t = setInterval(() => setValue((v) => (v >= 100 ? 8 : Math.min(100, v + Math.round(Math.random() * 18)))), 900);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="grid w-full max-w-sm gap-8">
      <Progress value={value}>
        <ProgressLabel>Uploading assets</ProgressLabel>
        <ProgressValue className="ml-auto" />
      </Progress>
      <Progress value={null}>
        <ProgressLabel>Indeterminate</ProgressLabel>
      </Progress>
    </div>
  );
}
