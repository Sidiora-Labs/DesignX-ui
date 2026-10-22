import { useState } from "react";

import { BindReferralCodeForm } from "@/components/trading/referral-card";

// Illustrative lookup only — check codes against your referral API.
const KNOWN = new Set(["PAXEER42", "ALPHA7", "MOON2026"]);

export default function ReferralCardBindDemo() {
  const [code, setCode] = useState("");
  const error = code.length >= 4 && !KNOWN.has(code) ? "This referral code does not exist." : undefined;
  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-container p-5">
      <BindReferralCodeForm value={code} onValueChange={setCode} error={error} onSubmit={() => {}} onCancel={() => setCode("")} />
    </div>
  );
}
