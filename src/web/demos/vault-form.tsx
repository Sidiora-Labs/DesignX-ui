import { useState } from "react";

import { VaultForm, type VaultFormTab } from "@/components/trading/vault-form";

// Illustrative values only. Balances, share price, limits and fees come from your vault API.
const BALANCE = 3_120.55;
const SHARES = 11_842.1934;
const SHARE_PRICE = 1.0861;
const MIN_DEPOSIT = 10;

export default function VaultFormDemo() {
  const [tab, setTab] = useState<VaultFormTab>("deposit");
  const [amount, setAmount] = useState("");
  const n = Number(amount);
  const max = tab === "deposit" ? BALANCE : SHARES;
  const error =
    amount === "" ? undefined : n > max ? "Amount exceeds your available balance." : tab === "deposit" && n < MIN_DEPOSIT ? `Minimum deposit is ${MIN_DEPOSIT} USDC.` : undefined;

  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-container p-4">
      <VaultForm
        tab={tab}
        onTabChange={setTab}
        value={amount}
        onValueChange={setAmount}
        balance={BALANCE}
        shares={SHARES}
        sharePrice={SHARE_PRICE}
        lockupHours={48}
        fees={[
          { label: "Performance fee", value: "10% of profit" },
          { label: "Withdrawal fee", value: "0%", tab: "withdraw" },
        ]}
        error={error}
        withdrawDuration="Up to 6 hours"
        latestDeposit={{ type: "deposit", status: "completed", amount: 2_500 }}
        latestWithdrawal={{ type: "withdrawal", status: "pending", amount: 1_200 }}
        onSubmit={() => setAmount("")}
      />
    </div>
  );
}
