import type { ApiDoc } from "./api";

/** Trading kit API docs — community. */
export const tradingApiCommunity: Record<string, ApiDoc> = {
  leaderboard: {
    usage: `import { Leaderboard } from "@/components/trading/leaderboard"

<Leaderboard
  title="Trading leaderboard"
  entries={rows}              // already ranked for the metric + period
  you={myRow}                 // pinned and highlighted
  metric={metric}
  onMetricChange={setMetric}  // re-query sorted by the new metric
  period={period}
  onPeriodChange={setPeriod}
  hasMore={hasNextPage}
  onLoadMore={fetchNextPage}
  onAddressClick={(row) => openProfile(row.address)}
/>`,
    notes:
      "The leaderboard never sorts or ranks — pass `entries` already ordered for the active metric and period, and re-query in `onMetricChange` / `onPeriodChange`. Search filters the passed rows by address and name; set `filterLocally={false}` when your server filters. Ranks 1–3 get gold, silver and bronze medals and row tints. Below `md` the table collapses into cards showing the active metric plus one secondary value. Use `hasMore` + `onLoadMore` for infinite lists, or `page` + `pageCount` + `onPageChange` for pages.",
    align: "start",
    props: [
      {
        component: "Leaderboard",
        rows: [
          ["entries", "LeaderboardEntry[]", undefined, "{ address, rank, name?, volume?, pnl?, roi?, rewards? } — roi is a fraction."],
          ["you", "LeaderboardEntry | null", undefined, "Your row, pinned to the top."],
          ["yourAddress", "string", "you.address", "Highlights matching rows in the list."],
          ["title / updatedAt", "ReactNode"],
          ["periods", "{ value, label }[]", "24H · 7D · 30D · All time", "Pass [] to hide."],
          ["period / defaultPeriod", "string"],
          ["onPeriodChange", "(period: string) => void"],
          ["metrics", '("volume" | "pnl" | "roi")[]', '["volume", "pnl", "roi"]'],
          ["metric / defaultMetric", "LeaderboardMetric", '"volume"'],
          ["onMetricChange", "(metric) => void", undefined, "Also fired by clicking a sortable column header."],
          ["columns", '("volume" | "pnl" | "roi" | "rewards")[]', "metrics (+ rewards)"],
          ["search / defaultSearch", "string"],
          ["onSearchChange", "(search: string) => void"],
          ["filterLocally", "boolean", "true"],
          ["loading", "boolean", "false", "Skeleton rows while the list is empty."],
          ["hasMore / loadingMore", "boolean"],
          ["onLoadMore", "() => void"],
          ["page / pageCount", "number", undefined, "1-based paged mode."],
          ["onPageChange", "(page: number) => void"],
          ["onAddressClick", "(entry) => void", undefined, "Makes addresses buttons."],
          ["emptyMessage", "ReactNode", '"No traders found"'],
        ],
      },
      { component: "RankBadge", rows: [["rank", "number", undefined, "Medal for 1–3, a number otherwise."]] },
    ],
  },
  "campaign-card": {
    usage: `import { CampaignCard, CampaignHero, CampaignTile } from "@/components/trading/campaign-card"

<CampaignCard
  campaign={{
    id: "q4-cup",
    title: "Q4 Perp Cup",
    startTime, endTime,
    participants: 4812,
    totalVolume: 1.28e9,
    prizePools: [{ id: "vol", label: "Volume pool", total: 150_000, currency: "USDC",
      tiers: [{ position: 1, amount: 30_000 }, { range: [4, 10], amount: 5_000 }] }],
  }}
  joined={isJoined}
  onJoin={join}
  onTrade={goTrade}
  onLearnMore={openRules}
  you={{ rank: 37, volume: 4.2e6, pnl: 12_440 }}
/>

<CampaignHero campaign={campaign} volumeTiers={tiers} onJoin={join} onLearnMore={openRules} />`,
    notes:
      "Status (upcoming / live / ended) and the countdown are derived from `startTime` / `endTime` with the display-only `useCountdown`; pass `status` to override. Join shows until `joined` is true and the campaign has not ended; Trade shows once joined while live. The total prize defaults to the sum of `prizePools`. `CampaignHero` is the page header with large countdown units, the prize panel and an optional `volumeTiers` unlock track; `CampaignTile` is the small selectable cover for a campaign switcher row.",
    exampleTitles: { hero: "Hero with campaign tiles" },
    props: [
      {
        component: "CampaignCard",
        rows: [
          ["campaign", "Campaign", undefined, "{ id, title, description?, image?, gradient?, startTime, endTime, prizePools?, totalPrize?, participants?, totalVolume?, tags? }"],
          ["status", '"upcoming" | "live" | "ended"', "from the clock"],
          ["you", "{ rank?, volume?, pnl? } | null", undefined, "Your standing."],
          ["joined / joining", "boolean"],
          ["onJoin / onTrade / onLearnMore", "() => void", undefined, "Buttons render only when their callback is set."],
          ["tradeLabel / learnMoreLabel", "ReactNode", '"Trade now" / "View rules"'],
          ["maxTiers", "number", "3", "Prize tiers listed per pool."],
        ],
      },
      {
        component: "CampaignHero",
        description: "Same action props as CampaignCard.",
        rows: [
          ["campaign", "Campaign"],
          ["volumeTiers", "{ volume, prize }[]", undefined, "Volume targets that unlock a larger pool; progress uses campaign.totalVolume."],
          ["highlightPool", "{ label, amount, currency }", undefined, "A second headline pool, e.g. a raffle."],
          ["you", "{ rank?, volume?, pnl? } | null"],
        ],
      },
      {
        component: "CampaignTile",
        rows: [
          ["campaign", "Campaign"],
          ["active", "boolean"],
          ["onSelect", "(id) => void"],
        ],
      },
      { component: "useCampaignStatus", rows: [["(startTime, endTime, override?)", "→ { status, remaining }", undefined, "remaining is ms to the next boundary."]] },
    ],
  },
  "epoch-rewards": {
    usage: `import { EpochRewards } from "@/components/trading/epoch-rewards"

<EpochRewards
  current={{
    epoch: { id: 42, startTime, endTime, rewardPool: 250_000, token: "PAX" },
    estRewards: estimate,
    volume: myVolume,
    fees: myFees,
  }}
  claim={{ amounts: [{ token: "PAX", amount: 2186.7 }], onClaim: claim, claiming }}
  booster={{ avgStaked: 12_400, multiplier: 1.75, onStake: openStaking }}
  history={{ rows: history, hasMore, onLoadMore: fetchMore }}
/>`,
    notes:
      "Each panel is also exported on its own: `CurrentEpochCard`, `ClaimableRewardsCard`, `StakeBoosterCard` and `RewardHistoryTable`. The epoch countdown and progress (elapsed share of start → end) come from the display-only `useCountdown`. Pass `status=\"paused\"` with `nextEpochStart` for a countdown to the next epoch, or `\"ended\"` for a closing message. `hideData` masks your figures, e.g. while no wallet is connected — put a connect button in `footer`. History dates are shown in UTC; below `md` history rows become cards.",
    align: "start",
    props: [
      {
        component: "EpochRewards",
        rows: [
          ["title", "ReactNode", '"Trading rewards"'],
          ["description", "ReactNode"],
          ["current", "CurrentEpochCardProps"],
          ["claim", "ClaimableRewardsCardProps", undefined, "Omit to hide the panel."],
          ["booster", "StakeBoosterCardProps", undefined, "Omit to hide the panel."],
          ["history", "RewardHistoryTableProps", undefined, "Omit to hide the table."],
        ],
      },
      {
        component: "CurrentEpochCard",
        rows: [
          ["epoch", "{ id, startTime, endTime, rewardPool, token, tokenIconSrc? } | null"],
          ["status", '"active" | "paused" | "ended"', '"active"'],
          ["estRewards", "number | null"],
          ["estRewardsHint", "ReactNode", undefined, "Tooltip on the estimate."],
          ["volume / fees", "number | null", undefined, "Rendered when passed."],
          ["hideData", "boolean", "false"],
          ["nextEpochStart", "number | Date | null", undefined, "Countdown while paused."],
          ["statusMessage", "ReactNode"],
          ["footer", "ReactNode"],
        ],
      },
      {
        component: "ClaimableRewardsCard",
        rows: [
          ["amounts", "{ token, amount, iconSrc? }[]"],
          ["onClaim", "() => void"],
          ["claiming", "boolean"],
          ["disabled", "boolean", "all amounts zero"],
          ["claimLabel", "ReactNode", '"Claim"'],
          ["onViewDetails", "() => void"],
        ],
      },
      {
        component: "StakeBoosterCard",
        rows: [
          ["avgStaked", "number | null"],
          ["stakedTokens", "string[]", '["PAX"]'],
          ["multiplier", "number | null", undefined, "1.75 renders 1.75x."],
          ["onStake", "() => void"],
        ],
      },
      {
        component: "RewardHistoryTable",
        rows: [
          ["rows", "{ epochId, startTime, endTime, rewardPool, earned, token, breakdown? }[]"],
          ["loading", "boolean"],
          ["hasMore / onLoadMore", "boolean / () => void"],
          ["emptyMessage", "ReactNode"],
        ],
      },
    ],
  },
  "pnl-share-card": {
    usage: `import { PnlShareCard, PnlShareDialog } from "@/components/trading/pnl-share-card"

<PnlShareCard
  position={{ symbol: "PERP_BTC_USDC", side: "long", pnl: 4812.36, roi: 0.8423, openPrice, markPrice, leverage: 20 }}
  brand={<Logo />}
  referral={{ code: "DXALPHA", slogan: "Trade with me — 10% off fees" }}
  qr={<YourQrCode value={referralUrl} />}
  timestamp={Date.now()}
/>

<PnlShareDialog
  trigger={<Button>Share</Button>}
  position={position}
  brand={<Logo />}
  onDownload={(options) => exportPoster(options)}
  onCopy={(options) => copyPoster(options)}
  onShare={(options) => openShareSheet(options)}
/>`,
    notes:
      "The poster is plain markup with a fixed 552 × 310 aspect ratio and type sized in container-query units, so it scales cleanly from a phone to a dialog. Image export is not built in: the Download, Copy and Share buttons call back with the chosen `PnlShareOptions` (`format`, `fields`, `themeId`, `message`). Rasterise the poster node with your own tool, e.g. html-to-image. Formats and optional fields are offered only when the position has the values. Themes are any CSS backgrounds; pass your own `themes`, including `url(...)` images. The QR code is a slot.",
    exampleTitles: { dialog: "Share dialog" },
    props: [
      {
        component: "PnlShareCard",
        rows: [
          ["position", "PnlSharePosition", undefined, "{ symbol, side, marginMode?, pnl?, roi?, openPrice?, closePrice?, markPrice?, quantity?, leverage?, openTime?, closeTime? } — roi is a fraction."],
          ["format", '"roi_pnl" | "roi" | "pnl"', "first available"],
          ["fields", "PnlShareField[]", "all available", "openPrice, closePrice, markPrice, openTime, closeTime, quantity, leverage."],
          ["theme", "PnlShareTheme | string", "first theme"],
          ["themes", "{ id, label, background, tone? }[]", "PNL_SHARE_THEMES"],
          ["message", "string"],
          ["brand", "ReactNode"],
          ["referral", "{ code, link?, slogan? } | null"],
          ["qr", "ReactNode", undefined, "Shown next to the referral code."],
          ["timestamp", "number | Date"],
          ["domain", "ReactNode", undefined, "Printed when there is no referral."],
          ["tick / baseDp", "number", undefined, "Price and quantity precision."],
        ],
      },
      {
        component: "PnlShareComposer",
        description: "Takes every PnlShareCard prop except format, fields, theme and message, which become options.",
        rows: [
          ["options / defaultOptions", "PnlShareOptions"],
          ["onOptionsChange", "(options) => void"],
          ["onDownload / onCopy / onShare", "(options: PnlShareOptions) => void", undefined, "Buttons render only when set."],
        ],
      },
      {
        component: "PnlShareDialog",
        description: "PnlShareComposer props plus:",
        rows: [
          ["open / defaultOpen", "boolean"],
          ["onOpenChange", "(open: boolean) => void"],
          ["trigger", "ReactElement"],
          ["title / description", "ReactNode", '"Share PnL"'],
        ],
      },
    ],
  },
  "trade-notification": {
    usage: `import { NotificationCenter, showTradeNotification, TradeNotification } from "@/components/trading/trade-notification"

// From your order stream:
showTradeNotification({
  kind: "filled",
  symbol: "PERP_BTC_USDC",
  side: "buy",
  orderType: "Limit",
  quantity: 0.5,
  filledQuantity: 0.5,
  price: 67412.5,
  time: Date.now(),
})

showTradeNotification(
  { kind: "liquidation-warning", symbol, marginRatio: 0.92, liquidationPrice, action: { label: "Add margin", onClick: openMargin } },
  { duration: Infinity },
)

<NotificationCenter items={notifications} onItemClick={markRead} onMarkAllRead={markAllRead} onClear={clear} />`,
    notes:
      "`showTradeNotification` wraps `toast.custom` from `@/components/ui/sonner`. It renders the content-only (`chrome=\"plain\"`) variant inside the house Toaster surface, adds a dismiss button, closes the toast after its action runs and returns the toast id. Liquidation warnings stay up for 12 s by default; other alerts for 5 s. Mount the `Toaster` once in your app. Kinds: opened, filled, partially-filled (with a fill bar), cancelled, rejected, liquidation-warning, take-profit and stop-loss. Times render as clock times; relative times would need a running clock. `NotificationCenter` keeps no list of its own: pass `items` with `read` flags and update them from the callbacks.",
    exampleTitles: { center: "Notification center" },
    props: [
      {
        component: "TradeNotification",
        rows: [
          ["kind", '"opened" | "filled" | "partially-filled" | "cancelled" | "rejected" | "liquidation-warning" | "take-profit" | "stop-loss"'],
          ["symbol", "string"],
          ["side", '"buy" | "sell"'],
          ["orderType", "ReactNode"],
          ["quantity / filledQuantity", "number | null", undefined, "Base units; fills show filled / quantity."],
          ["price", "number | null", undefined, "Average fill, limit or trigger price."],
          ["pnl", "number | null", undefined, "Realized PnL for TP / SL."],
          ["marginRatio / liquidationPrice", "number | null", undefined, "Liquidation warnings; marginRatio is a fraction."],
          ["reason", "ReactNode", undefined, "Cancel / reject reason."],
          ["title / message", "ReactNode", undefined, "Override the generated text."],
          ["time", "number | Date"],
          ["tick / baseDp", "number"],
          ["chrome", '"card" | "plain" | "row"', '"card"'],
          ["action", "{ label, onClick }"],
          ["onDismiss", "() => void", undefined, "Shows a close button."],
        ],
      },
      {
        component: "showTradeNotification",
        rows: [
          ["data", "TradeNotificationData & { action? }"],
          ["options", "Sonner ExternalToast", undefined, "duration, position, id…"],
          ["returns", "string | number", undefined, "The toast id."],
        ],
      },
      {
        component: "NotificationCenter",
        rows: [
          ["items", "(TradeNotificationData & { id, read? })[]"],
          ["onItemClick", "(item) => void", undefined, "Makes rows clickable."],
          ["onMarkAllRead", "() => void"],
          ["onClear", "() => void"],
          ["open / defaultOpen", "boolean"],
          ["onOpenChange", "(open: boolean) => void"],
          ["trigger", "ReactElement", "bell button with unread badge"],
          ["title", "ReactNode", '"Notifications"'],
          ["emptyMessage", "ReactNode"],
          ["align", '"start" | "center" | "end"', '"end"'],
        ],
      },
    ],
  },
  "announcement-bar": {
    usage: `import { AnnouncementBar, AnnouncementList } from "@/components/trading/announcement-bar"

<AnnouncementBar
  announcements={[
    { id: "1", type: "listing", message: "HYPE-PERP is now live.", url: "/trade/HYPE-PERP" },
    { id: "2", type: "maintenance", message: "Maintenance on Oct 24, 02:00 UTC." },
  ]}
  onLinkClick={(a) => router.push(a.url!)}
  onDismiss={(a) => dismiss(a.id)}
  onDismissAll={dismissAll}
/>

<AnnouncementList announcements={announcements} onLinkClick={(a) => open(a.url)} />`,
    notes:
      "Rotation is driven by the arrows. Pass `interval` (ms) to auto-advance as well; the timer pauses while the bar is hovered or focused and is the only timer in the component. The visible index is clamped in render, so removing items in `onDismiss` is safe. Without `onLinkClick`, `url` renders as a link that opens in a new tab. Types (general, listing, delisting, maintenance, campaign, vote) set the icon, the tag colour and the default link label (Learn more / Trade now / Join now / Vote now). `AnnouncementList` is the full expandable list for a bell popover or an announcements page, one item open at a time.",
    exampleTitles: { list: "Announcement list" },
    props: [
      {
        component: "AnnouncementBar",
        rows: [
          ["announcements", "Announcement[]", undefined, "{ id, type?, title?, message, time?, url?, actionLabel? }"],
          ["index / defaultIndex", "number", "0"],
          ["onIndexChange", "(index: number) => void"],
          ["interval", "number", undefined, "Auto-advance in ms. Omit for arrows only."],
          ["onLinkClick", "(item) => void"],
          ["onDismiss", "(item) => void", undefined, "Dismiss the visible announcement."],
          ["onDismissAll", "() => void", undefined, 'Adds "Close all (n)".'],
        ],
      },
      {
        component: "AnnouncementList",
        rows: [
          ["announcements", "Announcement[]"],
          ["expanded / defaultExpanded", "string | null", "null"],
          ["onExpandedChange", "(id: string | null) => void"],
          ["onLinkClick", "(item) => void"],
          ["title", "ReactNode", '"Announcements"', "null hides it."],
          ["variant", '"plain" | "divided"', '"plain"'],
          ["emptyMessage", "ReactNode", '"No announcements"'],
        ],
      },
    ],
  },
};
