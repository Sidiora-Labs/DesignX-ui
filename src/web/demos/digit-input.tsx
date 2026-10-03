import * as React from "react";

import { DigitInput } from "@/components/dx/digit-input";

export default function DigitInputDemo() {
  const [code, setCode] = React.useState("");
  return (
    <div className="grid justify-items-center gap-3">
      <DigitInput numeric maxLength={6} value={code} onValueChange={setCode} placeholder="000000" aria-label="Verification code" />
      <p className="text-[13px] text-muted-foreground tabular-nums">{code.length}/6 digits entered</p>
    </div>
  );
}
