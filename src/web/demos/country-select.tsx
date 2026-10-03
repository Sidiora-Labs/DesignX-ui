import * as React from "react";

import { CountrySelect } from "@/components/dx/country-select";

export default function CountrySelectDemo() {
  const [code, setCode] = React.useState<string>();
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        <CountrySelect onValueChange={setCode} />
        <CountrySelect showName defaultValue="JP" />
      </div>
      <p className="text-sm text-muted-foreground">{code ? `Selected: ${code}` : "Defaults to your browser region"}</p>
    </div>
  );
}
