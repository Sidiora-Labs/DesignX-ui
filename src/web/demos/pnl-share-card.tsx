import { PnlShareCard, type PnlSharePosition } from "@/components/trading/pnl-share-card";

// Illustrative fixture data only — pass the position you are sharing.
const NOW = Date.now();

const POSITION: PnlSharePosition = {
  symbol: "PERP_BTC_USDC",
  side: "long",
  marginMode: "cross",
  pnl: 4_812.36,
  roi: 0.8423,
  openPrice: 63_120.5,
  markPrice: 67_412.8,
  quantity: 1.12,
  leverage: 20,
  openTime: NOW - 26 * 3_600_000,
};

/** A stand-in QR — render a real one from your referral link. */
function FakeQr() {
  const cells = Array.from({ length: 49 }, (_, i) => ((i * 7 + (i % 5) * 3) % 4 === 0 || [0, 1, 7, 8, 5, 6, 12, 13, 35, 36, 42, 43].includes(i) ? 1 : 0));
  return (
    <svg viewBox="0 0 7 7" className="size-full" aria-hidden="true" shapeRendering="crispEdges">
      {cells.map((on, i) => (on ? <rect key={i} x={i % 7} y={Math.floor(i / 7)} width="1" height="1" /> : null))}
    </svg>
  );
}

export default function PnlShareCardDemo() {
  return (
    <div className="w-full max-w-xl">
      <PnlShareCard
        position={POSITION}
        brand={<span className="flex items-center gap-[1cqw]"><span className="grid size-[4cqw] place-items-center rounded-[1cqw] bg-white text-[2.2cqw] font-bold text-zinc-900">DX</span>DX Trade</span>}
        message="Called the bottom."
        referral={{ code: "DXALPHA", link: "https://example.com/join", slogan: "Trade with me — 10% off fees" }}
        qr={<FakeQr />}
        timestamp={NOW}
        tick={0.1}
      />
    </div>
  );
}
