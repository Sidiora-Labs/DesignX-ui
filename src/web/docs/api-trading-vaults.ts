import type { ApiDoc } from "./api";

/** Trading kit API docs — vaults & affiliate. */
export const tradingApiVaults: Record<string, ApiDoc> = {
  "vault-card": {
    usage: `import { VaultCard, VaultGrid } from "@/components/trading/vault-card"

<VaultGrid>
  {vaults.map((v) => (
    <VaultCard
      key={v.id}
      name={v.name}
      manager={v.manager}
      tags={v.strategies}
      status={v.status}
      tvl={v.tvl}
      apy30d={v.apy30d}
      allTimeReturn={v.ageDays >= 7 ? v.lifetimeApy : null}
      performance={v.sharePrice30d}
      deposits={lp?.deposits}
      earnings={lp?.pnl}
      availableBalance={balance}
      lockupHours={v.lockHours}
      onDeposit={() => openForm(v.id, "deposit")}
      onWithdraw={() => openForm(v.id, "withdraw")}
    />
  ))}
</VaultGrid>`,
    notes: "Rates are fractions (`0.18` = 18%). Deposit is disabled unless `status` is `live` — override with `depositDisabled`. Pass `allTimeReturn={null}` while a vault is too young to show a return; the label tooltip explains why. The sparkline (`VaultSparkline`) is plain SVG and is coloured by whether the series ends higher than it starts. `VaultStatusBadge` and `VaultLatestOperation` are exported for your own layouts.",
    align: "start",
    props: [
      {
        component: "VaultCard",
        rows: [
          ["name", "ReactNode"],
          ["manager / managerIconSrc", "string", undefined, "Strategy provider; the icon falls back to a lettered tile."],
          ["description", "ReactNode", undefined, "Clamped to three lines."],
          ["tags", "string[]", "[]", "Strategy tags."],
          ["status", '"live" | "pre_launch" | "closing" | "closed"', '"live"'],
          ["asset", "string", '"USDC"'],
          ["tvl", "number | null"],
          ["apy30d", "number | null", undefined, "Fraction."],
          ["allTimeReturn", "number | null", undefined, "Fraction. `null` shows a dash; omit to hide the row."],
          ["allTimeReturnHint", "ReactNode"],
          ["performance", "number[]", undefined, "Series for the sparkline next to the APY."],
          ["deposits / earnings", "number | null", undefined, "Your position. Omit both to hide the block."],
          ["availableBalance", "number | null"],
          ["lockupHours / performanceFee / depositors", "number", undefined, "Meta line above the actions. Fee is a fraction."],
          ["hideBalances", "boolean", "false"],
          ["latestOperation", "{ type, status, amount }"],
          ["onDeposit / onWithdraw / onViewMore", "() => void"],
          ["depositDisabled", "boolean", 'status !== "live"'],
          ["withdrawDisabled", "boolean", "false"],
          ["actions", "ReactNode", undefined, "Replaces the buttons, e.g. a connect-wallet prompt."],
        ],
      },
      { component: "VaultGrid", rows: [["children", "ReactNode"], ["className", "string", undefined, "Defaults to 1 / 2 / 3 columns."]] },
      {
        component: "VaultSparkline",
        rows: [
          ["data", "number[]"],
          ["width / height", "number", "96 / 32"],
          ["tone", '"up" | "down" | "flat"', undefined, "Defaults to the sign of last − first."],
        ],
      },
    ],
  },
  "vault-form": {
    usage: `import { VaultForm } from "@/components/trading/vault-form"

<VaultForm
  defaultTab="deposit"
  value={amount}
  onValueChange={setAmount}
  balance={usdcBalance}
  shares={lp.availableShares}
  sharePrice={vault.estSharePrice}
  lockupHours={vault.lockHours}
  fees={[{ label: "Performance fee", value: "10% of profit" }]}
  error={limitError}
  withdrawDuration="Up to 6 hours"
  onSubmit={({ type, amount }) => (type === "deposit" ? deposit(amount) : requestWithdraw(amount))}
/>`,
    notes: "On the withdraw tab the amount is in shares. Previews are amount ÷ share price (shares) and shares × share price (receive) — pass `estimatedShares` / `estimatedReceive` to use your own numbers. Withdrawals open a confirmation dialog first; set `confirmWithdraw={false}` to submit straight away. Limits and balance checks are yours: pass the message as `error`, which also disables the button. `VaultWithdrawProcess` is exported for showing a pending request — `current` is the active step index, and `steps.length` marks everything done.",
    align: "start",
    exampleTitles: { pending: "Withdrawal progress" },
    props: [
      {
        component: "VaultForm",
        rows: [
          ["tab / defaultTab / onTabChange", '"deposit" | "withdraw"', '"deposit"'],
          ["value / defaultValue / onValueChange", "string", '""', "Amount text. Cleared on tab change."],
          ["asset / assetIconSrc", "string", '"USDC"'],
          ["balance", "number | null", undefined, "Max for deposits."],
          ["shares", "number | null", undefined, "Max for withdrawals."],
          ["sharePrice", "number | null"],
          ["estimatedShares / estimatedReceive", "number | null", undefined, "Override the previews."],
          ["lockupHours", "number"],
          ["fees", "{ label, value, tab? }[]", "[]", "Rows under the preview, optionally for one tab."],
          ["error / hint / warning", "ReactNode"],
          ["depositDisabled / withdrawDisabled / submitting", "boolean"],
          ["withdrawSteps", "{ label, description? }[]", "Request → Processing → Claimable"],
          ["withdrawStep", "number", undefined, "Highlights progress in the timeline."],
          ["withdrawDuration", "ReactNode"],
          ["confirmWithdraw", "boolean", "true"],
          ["withdrawNote", "ReactNode", undefined, "Shown in the confirmation dialog."],
          ["latestDeposit / latestWithdrawal", "{ type, status, amount }"],
          ["onSubmit", "({ type, amount }) => void"],
        ],
      },
      {
        component: "VaultWithdrawProcess",
        rows: [
          ["steps", "{ label, description? }[]"],
          ["current", "number", undefined, "Active step index."],
          ["duration", "ReactNode"],
          ["title", "ReactNode", '"Withdraw process"'],
        ],
      },
    ],
  },
  "referral-card": {
    usage: `import { ReferralCard, ReferralCodeForm, BindReferralCodeForm } from "@/components/trading/referral-card"

<ReferralCard
  code={me.code}
  link={\`https://app.example.com/r/\${me.code}\`}
  rebateRate={me.keep}
  refereeRate={me.refereeRate}
  onCopy={(value, kind) => toast.success(\`\${kind} copied\`)}
  onConfigure={openSettings}
/>

<ReferralCodeForm totalSplit={0.4} maxKeep={0.32} onSubmit={createCode} onCancel={close} />

<BindReferralCodeForm error={codeError} onSubmit={(code) => code ? bind(code) : skip()} />`,
    notes: "Rates are fractions of the trading fee. Copy buttons write to the clipboard when it is available and always call `onCopy`. The code inputs only reformat text (uppercase, A–Z and 0–9, up to 15 characters). Checks such as \"code taken\" or \"code does not exist\" are yours to run; pass the result as `error`. In `ReferralCodeForm` the slider snaps to whole percents and stops at `maxKeep`. The part above that is hatched.",
    align: "start",
    exampleTitles: { bind: "Bind a referral code" },
    props: [
      {
        component: "ReferralCard",
        rows: [
          ["code", "string"],
          ["link", "string"],
          ["title", "ReactNode", '"Referral"'],
          ["badge", "ReactNode", undefined, "e.g. Multilevel."],
          ["rebateRate", "number", undefined, "Your share, fraction."],
          ["refereeRate", "number", undefined, "Referee discount, fraction."],
          ["indirectRate", "number", undefined, "Commission on indirect trades."],
          ["tradingFeeRebate", "number", undefined, "Shown with an optional Set rebate button."],
          ["onCopy", '(value, kind: "code" | "link") => void'],
          ["onConfigure / onSetTradingFeeRebate", "() => void"],
          ["children", "ReactNode", undefined, "Appended at the bottom."],
        ],
      },
      {
        component: "ReferralCodeForm",
        rows: [
          ["totalSplit", "number", undefined, "Commission to split, fraction."],
          ["maxKeep", "number", "totalSplit"],
          ["keep / defaultKeep / onKeepChange", "number", "maxKeep"],
          ["code / defaultCode / onCodeChange", "string", '""'],
          ["hideCode", "boolean", "false", "Edit only the split."],
          ["directRate / indirectRate", "number"],
          ["baseRefereeRate", "number", undefined, "\"At least X passes down\" hint."],
          ["title / submitLabel", "ReactNode"],
          ["error", "ReactNode"],
          ["submitting / disabled", "boolean"],
          ["onSubmit", "({ code, keep, referee }) => void"],
          ["onCancel", "() => void"],
        ],
      },
      {
        component: "BindReferralCodeForm",
        rows: [
          ["value / defaultValue / onValueChange", "string"],
          ["title / description", "ReactNode"],
          ["error", "ReactNode"],
          ["checking / submitting", "boolean"],
          ["allowSkip", "boolean", "true", "\"I was not referred\" checkbox."],
          ["onSubmit", "(code: string | null) => void", undefined, "`null` when skipped."],
          ["onCancel", "() => void"],
        ],
      },
      { component: "RateSplit", rows: [["keep / referee", "number"], ["keepLabel / refereeLabel", "ReactNode"]] },
    ],
  },
  "affiliate-summary": {
    usage: `import { AffiliateSummary } from "@/components/trading/affiliate-summary"

<AffiliateSummary
  period={period}
  onPeriodChange={setPeriod}
  commission={stats.commission}
  commissionBreakdown={{ direct: stats.direct, indirect: stats.indirect }}
  volume={stats.volume}
  referees={stats.referees}
  traders={stats.traders}
  chartData={daily.map((d) => ({ label: d.date, commission: d.commission, volume: d.volume }))}
/>`,
    notes: "The period picker only changes the selection and calls `onPeriodChange`. Refetch and pass new numbers yourself. The chart uses the `commission` key, and adds a Commission / Volume toggle when your points include `volume`. `TraderSummary` is the referee's view (referrer code, rebate rate, rebates and volume). `AffiliateOnboarding` is the empty state, with the two role cards and the How it works steps. Pass `requiredVolume` to show progress toward unlocking a code.",
    align: "start",
    exampleTitles: { onboarding: "Onboarding", trader: "Trader view" },
    props: [
      {
        component: "AffiliateSummary",
        rows: [
          ["commission / volume", "number | null", undefined, "USD."],
          ["referees / traders", "number | null"],
          ["commissionBreakdown / volumeBreakdown / refereesBreakdown", "{ direct, indirect }"],
          ["period / defaultPeriod / onPeriodChange", "string", '"30d"'],
          ["periods", "{ value, label }[]", "7D / 30D / All"],
          ["chartData", "{ label, commission, volume? }[]"],
          ["referredBy", "string"],
          ["hideBalances", "boolean", "false"],
          ["title / trailing", "ReactNode"],
        ],
      },
      {
        component: "TraderSummary",
        rows: [
          ["referrerCode", "string"],
          ["rebateRate", "number | null", undefined, "Fraction."],
          ["rebates / volume", "number | null", undefined, "USD."],
          ["period / defaultPeriod / onPeriodChange / periods", "—", undefined, "As above."],
          ["chartData", "{ label, commission }[]"],
        ],
      },
      {
        component: "AffiliateOnboarding",
        rows: [
          ["maxCommission", "ReactNode", '"Up to 60%"'],
          ["traderRebate", "ReactNode"],
          ["requiredVolume / completedVolume", "number", undefined, "USD progress on the first step."],
          ["steps", "{ icon?, title, description }[]", "Trade or apply → Share → Earn"],
          ["onBecomeAffiliate / onEnterCode", "() => void"],
        ],
      },
    ],
  },
  "referees-table": {
    usage: `import { RefereesTable } from "@/components/trading/referees-table"

<RefereesTable
  referees={referees}
  commissions={commissionHistory}
  codes={myCodes}
  onNoteChange={(address, note) => saveNote(address, note)}
  onCopyCode={(code) => toast.success("Code copied")}
  hasMore={page.hasMore}
  onLoadMore={(tab) => fetchNext(tab)}
/>`,
    notes: "There are three tabs: Referees, Commission and Codes. On `md` and up they render as tables, and below that as cards. Notes are edited inline: the pencil opens an input, Enter saves through `onNoteChange`, and Escape cancels. Clicking Joined, Volume or Commission sorts the rows you passed, cycling through descending, ascending and off. It never refetches. The Fees and You / Referee columns only appear when some row has them.",
    align: "start",
    props: [
      {
        component: "RefereesTable",
        rows: [
          ["referees", "{ address, joinedAt, code?, volume, fees?, commission, note?, split?, customized? }[]", "[]"],
          ["commissions", "{ id?, date, code?, address?, volume, commission, bonus? }[]", "[]"],
          ["codes", "{ code, keep, referee, referees, traders?, volume, commission }[]", "[]"],
          ["tab / defaultTab / onTabChange", '"referees" | "commission" | "codes"', '"referees"'],
          ["onNoteChange", "(address, note) => void", undefined, "Omit for read-only notes."],
          ["noteMaxLength", "number", "50"],
          ["onCopyCode / onEditCode", "(code) => void"],
          ["hasMore / onLoadMore", "boolean / (tab) => void"],
          ["toolbar", "ReactNode", undefined, "Next to the tabs, e.g. a date range."],
        ],
      },
    ],
  },
};
