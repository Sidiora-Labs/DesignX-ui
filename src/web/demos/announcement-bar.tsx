import { useState } from "react";

import { AnnouncementBar, type Announcement } from "@/components/trading/announcement-bar";
import { Button } from "@/components/ui/button";

// Illustrative fixture data only — load announcements from your CMS or exchange API.
const NOW = Date.now();

const ANNOUNCEMENTS: Announcement[] = [
  { id: "a1", type: "listing", message: "HYPE-PERP is now live with up to 20x leverage.", url: "https://example.com/hype", time: NOW - 3_600_000 },
  { id: "a2", type: "campaign", message: "Q4 Perp Cup — 150,000 USDC in prizes. Ends Nov 1.", url: "https://example.com/cup", time: NOW - 7_200_000 },
  { id: "a3", type: "maintenance", message: "Scheduled maintenance on Oct 24, 02:00–02:30 UTC. Orders stay open.", time: NOW - 86_400_000 },
  { id: "a4", type: "delisting", message: "LUNA-PERP will be delisted on Oct 30. Reduce-only from Oct 27.", url: "https://example.com/delist", time: NOW - 2 * 86_400_000 },
  { id: "a5", type: "vote", message: "Vote on the new fee tier proposal before Oct 29.", url: "https://example.com/vote", time: NOW - 3 * 86_400_000 },
];

export default function AnnouncementBarDemo() {
  const [items, setItems] = useState(ANNOUNCEMENTS);
  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-3">
      <AnnouncementBar
        announcements={items}
        onLinkClick={() => {}}
        onDismiss={(a) => setItems((list) => list.filter((x) => x.id !== a.id))}
        onDismissAll={() => setItems([])}
      />
      <AnnouncementBar announcements={ANNOUNCEMENTS.slice(0, 3)} interval={5000} onLinkClick={() => {}} className="bg-primary/[0.06]" />
      {items.length === 0 && (
        <Button size="sm" variant="outline" onClick={() => setItems(ANNOUNCEMENTS)}>
          Restore announcements
        </Button>
      )}
    </div>
  );
}
