import { AnnouncementList, type Announcement } from "@/components/trading/announcement-bar";

// Illustrative fixture data only — load announcements from your CMS or exchange API.
const NOW = Date.now();

const ANNOUNCEMENTS: Announcement[] = [
  { id: "a1", type: "listing", message: "HYPE-PERP is now live with up to 20x leverage. Funding settles hourly.", url: "https://example.com/hype", time: NOW - 3_600_000 },
  { id: "a2", type: "campaign", message: "Q4 Perp Cup — 150,000 USDC in prizes for the top volume and PnL traders. Ends Nov 1.", url: "https://example.com/cup", time: NOW - 7_200_000 },
  { id: "a3", type: "maintenance", message: "Scheduled maintenance on Oct 24, 02:00–02:30 UTC. Open orders are preserved; deposits pause.", time: NOW - 86_400_000 },
  { id: "a4", type: "delisting", title: "LUNA-PERP delisting", message: "LUNA-PERP becomes reduce-only on Oct 27 and is delisted on Oct 30 at 08:00 UTC.", url: "https://example.com/delist", time: NOW - 2 * 86_400_000 },
  { id: "a5", type: "general", message: "Portfolio margin is now available to all accounts above 50,000 USDC equity.", time: NOW - 4 * 86_400_000 },
];

export default function AnnouncementListDemo() {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-outline-variant bg-popover p-2">
      <AnnouncementList announcements={ANNOUNCEMENTS} defaultExpanded="a2" onLinkClick={() => {}} />
    </div>
  );
}
