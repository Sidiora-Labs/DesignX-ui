import { PositionsTable } from "@/components/trading/positions-table";

export default function PositionsTableEmptyDemo() {
  return (
    <div className="w-full max-w-4xl">
      <PositionsTable positions={[]} onCloseAll={() => {}} onClose={() => {}} />
    </div>
  );
}
