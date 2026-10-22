import { VaultWithdrawProcess } from "@/components/trading/vault-form";

// Illustrative state only — a withdrawal request that the vault is processing.
export default function VaultFormPendingDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <VaultWithdrawProcess current={1} duration="Up to 6 hours" title="Withdrawal of 1,200 shares" />
      <VaultWithdrawProcess
        current={3}
        title="Withdrawal of 450 shares"
        steps={[{ label: "Initiate" }, { label: "Vault process" }, { label: "Transferred" }]}
      />
    </div>
  );
}
