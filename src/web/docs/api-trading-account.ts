import type { ApiDoc } from "./api";

/** Trading kit API docs — account. */
export const tradingApiAccount: Record<string, ApiDoc> = {
  "account-summary": {
    usage: `import { AccountSummary } from "@/components/trading/account-summary"

<AccountSummary
  totalValue={account.totalValue}
  freeCollateral={account.freeCollateral}
  unrealizedPnl={account.upnl}
  unrealizedRoi={account.uroi}
  currentLeverage={account.leverage}
  marginUsage={account.marginUsage}
  address={wallet.address}
  chainName={wallet.chain.name}
  onDeposit={openDeposit}
  onWithdraw={openWithdraw}
  onDisconnect={wallet.disconnect}
/>`,
    notes:
      "The pill shows one metric; the pin buttons in the popover choose which (`metric` / `onMetricChange`, controlled or not). The eye button masks every balance. Copying the address uses the clipboard API and then calls `onCopyAddress` — show your toast there. Action buttons render only when their handler is passed. `RiskMeter` comes from Asset Panel.",
    align: "start",
    props: [
      {
        component: "AccountSummary",
        rows: [
          ["totalValue / freeCollateral / unrealizedPnl", "number | null"],
          ["unrealizedRoi", "number | null", undefined, "Fraction."],
          ["currentLeverage", "number | null"],
          ["marginUsage", "number | null", undefined, "Fraction — shows a risk meter in the popover."],
          ["unit", "string", '"USDC"'],
          ["address", "string", undefined, "Shown shortened, with copy."],
          ["chainName", "ReactNode"],
          ["metric / defaultMetric", '"totalValue" | "freeCollateral" | "unrealizedPnl" | "currentLeverage"', '"totalValue"'],
          ["onMetricChange", "(metric) => void"],
          ["metrics", "AccountMetric[]", "all four", "Rows listed in the popover."],
          ["hideBalances / defaultHideBalances", "boolean", "false"],
          ["onHideBalancesChange", "(hidden: boolean) => void"],
          ["open / defaultOpen / onOpenChange", "boolean / (open) => void"],
          ["onDeposit / onWithdraw / onTransfer", "() => void"],
          ["onDisconnect", "() => void"],
          ["onOpenExplorer", "() => void"],
          ["onCopyAddress", "(address: string) => void"],
        ],
      },
    ],
  },
  "asset-panel": {
    usage: `import { AssetPanel, MarginRatioMeter, RiskMeter } from "@/components/trading/asset-panel"

<AssetPanel
  totalValue={account.totalValue}
  unrealizedPnl={account.upnl}
  unrealizedRoi={account.uroi}
  freeCollateral={account.freeCollateral}
  marginRatio={account.marginRatio}
  maintenanceMarginRatio={account.mmr}
  maintenanceMargin={account.maintenanceMargin}
  currentLeverage={account.leverage}
  onDeposit={openDeposit}
  onWithdraw={openWithdraw}
  onTransfer={openTransfer}
/>

<RiskMeter value={0.42} label="Margin usage" />`,
    notes:
      "Ratios are fractions. Without `riskRate`, the meter shows maintenance margin ratio ÷ margin ratio, coloured amber from 40% and red from 80% (`thresholds` changes this). `firstDeposit` swaps the balances for a start-trading prompt; `notice` covers connect-wallet or wrong-network states. `HintLabel`, `RiskMeter` and `MarginRatioMeter` are exported for reuse.",
    exampleTitles: { "first-deposit": "First deposit" },
    props: [
      {
        component: "AssetPanel",
        rows: [
          ["totalValue / freeCollateral / maintenanceMargin", "number | null"],
          ["unrealizedPnl", "number | null", undefined, "Row hidden when undefined."],
          ["unrealizedRoi", "number | null", undefined, "Fraction."],
          ["marginRatio / maintenanceMarginRatio", "number | null", undefined, "Fractions."],
          ["currentLeverage", "number | null"],
          ["ltv", "number | null", undefined, "Fraction; row shown only above 0."],
          ["riskRate", "number | null", undefined, "Overrides the derived risk."],
          ["unit", "string", '"USDC"'],
          ["hideBalances / defaultHideBalances / onHideBalancesChange", "boolean / (hidden) => void"],
          ["detailsOpen / defaultDetailsOpen / onDetailsOpenChange", "boolean / (open) => void", "true"],
          ["onDeposit / onWithdraw / onTransfer", "() => void", undefined, "Buttons render only when passed."],
          ["firstDeposit", "boolean", "false"],
          ["notice", "{ title, description?, tone?, action? }"],
          ["footer", "ReactNode"],
        ],
      },
      {
        component: "RiskMeter",
        rows: [
          ["value", "number | null", undefined, "Fraction; 1 = 100%."],
          ["label", "ReactNode", '"Risk rate"'],
          ["hint / formula", "ReactNode"],
          ["thresholds", "{ medium: number; high: number }", "{ medium: 0.4, high: 0.8 }"],
          ["hidden", "boolean"],
          ["dp", "number", "2"],
        ],
      },
      {
        component: "MarginRatioMeter",
        description: "A RiskMeter whose value is maintenanceMarginRatio / marginRatio.",
        rows: [
          ["marginRatio", "number | null"],
          ["maintenanceMarginRatio", "number | null"],
        ],
      },
    ],
  },
  "portfolio-assets": {
    usage: `import { PortfolioAssets } from "@/components/trading/portfolio-assets"

<PortfolioAssets
  assets={holdings}
  ltv={account.ltv}
  onDeposit={openDeposit}
  onWithdraw={openWithdraw}
  onAssetTransfer={(asset) => openTransfer(asset.token)}
  onAssetConvert={(asset) => openConvert(asset.token)}
/>`,
    notes:
      "Each asset carries its own value, collateral ratio (fraction) and contribution — nothing is priced in the component. The total defaults to the sum of values, and collateral value to the sum of contributions. The table collapses to cards below `md`. Convert is hidden for the settlement token (`unit`).",
    align: "start",
    props: [
      {
        component: "PortfolioAssets",
        rows: [
          ["assets", "{ token, iconSrc?, balance, decimals?, indexPrice?, value, collateralRatio, collateralContribution }[]"],
          ["title", "ReactNode", '"Assets"'],
          ["totalValue", "number | null", "sum of values"],
          ["ltv", "number | null", undefined, "Fraction. Omit to hide the meter."],
          ["ltvThreshold", "number", undefined, "Mentioned in the LTV hint."],
          ["unit", "string", '"USDC"'],
          ["hideBalances / defaultHideBalances / onHideBalancesChange", "boolean / (hidden) => void"],
          ["onDeposit / onWithdraw / onTransfer", "() => void"],
          ["onAssetTransfer / onAssetConvert", "(asset) => void", undefined, "Row actions."],
          ["loading", "boolean"],
          ["emptyText", "ReactNode"],
        ],
      },
    ],
  },
  "portfolio-performance": {
    usage: `import { PortfolioPerformance } from "@/components/trading/portfolio-performance"

<PortfolioPerformance
  data={daily}
  roi={stats.roi}
  pnl={stats.pnl}
  volume={stats.volume}
  range={range}
  onRangeChange={setRange}
  distribution={holdings.map((h) => ({ token: h.token, value: h.value }))}
/>`,
    notes:
      "Fetch the series for the selected range in `onRangeChange` — the component never slices data. `cumulativePnl` defaults to a running sum of `pnl`. Daily PnL bars are green or red by sign; cumulative PnL takes the colour of its latest value. Distribution keeps the five largest slices and folds the rest into \"Other\". Charts use `@/components/ui/chart` (recharts).",
    align: "start",
    props: [
      {
        component: "PortfolioPerformance",
        rows: [
          ["data", "{ date, accountValue?, pnl?, cumulativePnl? }[]"],
          ["roi", "number | null", undefined, "Fraction."],
          ["pnl / volume", "number | null"],
          ["volumeNote", "ReactNode", undefined, "e.g. update time."],
          ["ranges", "{ value, label }[]", "7D / 30D / 90D"],
          ["range / defaultRange / onRangeChange", "string / (range) => void"],
          ["chart / defaultChart / onChartChange", '"accountValue" | "dailyPnl" | "cumulativePnl"', '"accountValue"'],
          ["distribution", "{ token, value, iconSrc? }[]", undefined, "Omit to hide the donut."],
          ["title", "ReactNode", '"Performance"'],
          ["unit", "string", '"USDC"'],
          ["hideBalances", "boolean", undefined, "Masks stats, axes and tooltips."],
          ["loading", "boolean"],
          ["formatDate", "(date) => string", '"Oct 21"'],
        ],
      },
    ],
  },
  "deposit-withdraw": {
    usage: `import { DepositWithdraw } from "@/components/trading/deposit-withdraw"

<DepositWithdraw
  mode={mode}
  onModeChange={setMode}
  tokens={tokens}
  networks={networks}
  accounts={subAccounts}
  amount={amount}
  onAmountChange={setAmount}
  balance={quote.available}
  fee={quote.fee}
  minAmount={quote.min}
  submitState={pending ? "loading" : "idle"}
  onSubmit={(values) => submitTransfer(values)}
/>`,
    notes:
      "All balances, fees and limits come in per mode — refetch them in `onModeChange`, `onTokenChange` and `onNetworkChange`. The button explains why it is disabled (enter an amount, insufficient balance, below minimum, missing address, same account); pass `disabledReason` for anything else, such as approvals or a wrong network. You receive defaults to amount − fee when the fee is in the selected token. Every field supports controlled and uncontrolled use.",
    props: [
      {
        component: "DepositWithdraw",
        rows: [
          ["mode / defaultMode / onModeChange", '"deposit" | "withdraw" | "transfer"', '"deposit"'],
          ["modes", "TransferMode[]", "all three"],
          ["tokens", "{ symbol, iconSrc?, name?, decimals? }[]"],
          ["token / defaultToken / onTokenChange", "string"],
          ["networks", "{ id, name, iconSrc? }[]", "[]", "Hidden in transfer mode."],
          ["network / defaultNetwork / onNetworkChange", "string"],
          ["amount / defaultAmount / onAmountChange", "string"],
          ["balance", "number | null", undefined, "Enables Max and quick fills."],
          ["quickPercents", "number[]", "[0.25, 0.5, 0.75, 1]"],
          ["fee", "number | null", undefined, "Row hidden when undefined."],
          ["feeUnit", "string", "token"],
          ["receive", "number | null", "amount − fee"],
          ["minAmount / maxAmount", "number"],
          ["rows", "{ label, value, hint? }[]", "[]", "Extra summary rows."],
          ["address / defaultAddress / onAddressChange", "string", undefined, "Withdraw destination."],
          ["connectedAddress", "string", undefined, "Offers a one-tap destination."],
          ["addressError", "ReactNode"],
          ["accounts", "{ id, label, balance? }[]", "[]", "Transfer from / to."],
          ["fromAccount / toAccount (+ default / on…Change)", "string"],
          ["submitState", '"idle" | "loading" | "disabled"', '"idle"'],
          ["disabledReason", "ReactNode"],
          ["submitLabel", "ReactNode", '"Deposit USDC"…'],
          ["notice", "ReactNode", undefined, "Warning above the button."],
          ["onSubmit", "({ mode, token, network?, amount, address?, fromAccount?, toAccount? }) => void"],
        ],
      },
    ],
  },
  "deposit-status": {
    usage: `import { DepositStatus } from "@/components/trading/deposit-status"

<DepositStatus
  items={transfers}
  onDismiss={(group) => hideGroup(group)}
  explorerUrl={(t) => \`\${explorer}/tx/\${t.txHash}\`}
/>`,
    notes:
      "Renders nothing when `items` is empty. Transfers are grouped into pending (submitted / confirming), failed and completed summary lines; clicking a line expands per-transfer progress — submitted → confirming n/m → credited (or sent, for withdrawals). Confirmation counts are display-only. `TransferSteps` is exported for use elsewhere.",
    props: [
      {
        component: "DepositStatus",
        rows: [
          ["items", "{ id, type?, token, iconSrc?, amount, network?, step, confirmations?, requiredConfirmations?, time?, eta?, txHash? }[]"],
          ["step", '"submitted" | "confirming" | "credited" | "failed"'],
          ["open / defaultOpen / onOpenChange", "boolean / (open) => void", "false"],
          ["onDismiss", '(group: "pending" | "failed" | "completed") => void', undefined, "Omit to hide close buttons."],
          ["explorerUrl", "(item) => string | undefined"],
          ["footer", "ReactNode"],
        ],
      },
    ],
  },
  "transfer-history": {
    usage: `import { TransferHistory } from "@/components/trading/transfer-history"

<TransferHistory
  records={history}
  explorerUrl={(r) => \`\${explorers[r.network]}/tx/\${r.txHash}\`}
  onCopy={() => toast("Copied")}
/>`,
    notes:
      "Amounts are positive; withdrawals render negative. Filtering by type happens locally unless `filterLocally={false}` (then fetch in `onFilterChange`). Internal transfers show from → to account ids instead of a hash. Pass pagination or a load-more button as `footer`. Below `md`, rows become cards.",
    align: "start",
    props: [
      {
        component: "TransferHistory",
        rows: [
          ["records", "{ id, type, token, amount, fee?, network?, vault?, status, time, txHash?, from?, to?, decimals? }[]"],
          ["vault", "string", undefined, "Vault deposits / withdrawals show the vault name instead of a network."],
          ["type", '"deposit" | "withdraw" | "transfer"'],
          ["status", '"pending" | "processing" | "completed" | "failed" | "cancelled"'],
          ["filters", "TransferHistoryFilter[]", '["all", "deposit", "withdraw", "transfer"]'],
          ["filter / defaultFilter / onFilterChange", "TransferHistoryFilter", '"all"'],
          ["filterLocally", "boolean", "true"],
          ["explorerUrl", "(record) => string | undefined", undefined, "Without it, hashes are plain text."],
          ["onCopy", "(text: string) => void"],
          ["formatTime", "(time) => string", '"10/21/2026 14:32"'],
          ["loading", "boolean"],
          ["emptyText", "ReactNode"],
          ["footer", "ReactNode"],
        ],
      },
    ],
  },
  "fee-tier": {
    usage: `import { FeeTier } from "@/components/trading/fee-tier"

<FeeTier tiers={schedule} volume30d={account.volume30d} />`,
    notes:
      "Fees are fractions (0.0002 = 0.02%) or preformatted strings such as `\"0.02% / 0%\"`. Without `currentTier`, the highest tier whose minimum your 30-day volume reaches is highlighted. The progress bar shows how far you are between the current tier's minimum and the next.",
    props: [
      {
        component: "FeeTier",
        rows: [
          ["tiers", "{ tier, minVolume, maxVolume?, makerFee, takerFee }[]"],
          ["volume30d", "number | null"],
          ["currentTier", "number | string", "from volume"],
          ["title", "ReactNode", '"Fee tier"'],
          ["updateNote", "ReactNode", '"Updated daily ~02:15 UTC"'],
          ["unit", "string", '"USDC"'],
          ["formatFee", "(fraction: number) => string", "percent, up to 3 dp"],
        ],
      },
    ],
  },
  "chain-selector": {
    usage: `import { ChainList, ChainSelector } from "@/components/trading/chain-selector"

<ChainSelector
  chains={chains}
  value={chainId}
  onValueChange={(id) => switchChain(id)}
  wrongNetwork={!supported}
  loading={switching}
/>`,
    notes:
      "Chains with `testnet: true` go under the Testnet tab; tabs disappear when only one kind is present. `wrongNetwork` turns the trigger into a warning button and adds a tip to the list. `layout=\"dialog\"` suits mobile bottom bars. `ChainList` is the picker body on its own, for use in your own sheet.",
    exampleTitles: { dialog: "Dialog (mobile)" },
    props: [
      {
        component: "ChainSelector",
        rows: [
          ["chains", "{ id, name, iconSrc?, testnet?, disabled? }[]"],
          ["value / defaultValue", "string"],
          ["onValueChange", "(id: string, chain) => void"],
          ["recent", "string[]", undefined, "Chain ids shown as quick picks."],
          ["tab / defaultTab / onTabChange", '"mainnet" | "testnet"'],
          ["open / defaultOpen / onOpenChange", "boolean / (open) => void"],
          ["wrongNetwork", "boolean"],
          ["loading", "boolean"],
          ["layout", '"popover" | "dialog"', '"popover"'],
          ["showName", "boolean", "false"],
          ["closeOnSelect", "boolean", "true"],
        ],
      },
      {
        component: "ChainList",
        rows: [
          ["chains", "ChainOption[]"],
          ["value", "string"],
          ["onSelect", "(chain) => void"],
          ["variant", '"wide" | "compact"', '"wide"'],
        ],
      },
    ],
  },
  "api-key-manager": {
    usage: `import { ApiKeyManager } from "@/components/trading/api-key-manager"

<ApiKeyManager
  keys={apiKeys}
  accountId={account.id}
  onCreate={async (values) => setCreated(await api.createKey(values))}
  createdKey={created}
  onCreatedKeyDismiss={() => setCreated(null)}
  onRevoke={(key) => api.revokeKey(key.key)}
/>`,
    notes:
      "The component never generates keys. `onCreate` receives the chosen permissions and parsed IP allowlist; return the new key and secret through `createdKey` to open the one-time \"API key created\" dialog. Revoking asks for confirmation first. Copy buttons write to the clipboard and call `onCopy` with what was copied. Editing existing keys is not included.",
    align: "start",
    props: [
      {
        component: "ApiKeyManager",
        rows: [
          ["keys", "{ key, label?, permissions, ipAllowlist?, createdAt?, expiresAt? }[]"],
          ["accountId / userId", "string"],
          ["permissionOptions", "{ value, label, description?, required? }[]", "Read (required), Trading"],
          ["onCreate", "({ permissions, ipAllowlist }) => void"],
          ["creating", "boolean"],
          ["createDisabledReason", "ReactNode"],
          ["createdKey", "{ key, secret, accountId?, permissions?, ipAllowlist? } | null"],
          ["onCreatedKeyDismiss", "() => void"],
          ["onRevoke", "(item) => void"],
          ["onCopy", '(text, kind: "accountId" | "userId" | "key" | "secret" | "ip" | "info") => void'],
          ["onReadGuide", "() => void"],
          ["formatDate", "(date) => string"],
          ["title / description", "ReactNode"],
        ],
      },
    ],
  },
};
