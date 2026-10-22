import { useState } from "react";

import { RefereesTable, type CommissionRow, type ReferralCodeRow, type RefereeRow } from "@/components/trading/referees-table";

// Illustrative values only. Rows come from your affiliate API; notes are saved via `onNoteChange`.
const DAY = 86_400_000;
const NOW = Date.UTC(2026, 9, 22);

const REFEREES: RefereeRow[] = [
  { address: "0x8f3a2c9d41b07e5a6c12d9e3f4a5b6c7d8e9f0a1", joinedAt: NOW - 3 * DAY, code: "PAXEER42", volume: 1_284_500, fees: 642.25, commission: 192.6754, note: "Telegram group", split: { keep: 0.3, referee: 0.1 } },
  { address: "0x1b4e7f20a9c3d5e6f708192a3b4c5d6e7f809abc", joinedAt: NOW - 11 * DAY, code: "PAXEER42", volume: 642_180, fees: 321.09, commission: 96.3270, split: { keep: 0.3, referee: 0.1 } },
  { address: "0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d", joinedAt: NOW - 19 * DAY, code: "ALPHA7", volume: 2_910_040, fees: 1_455.02, commission: 509.257, note: "Market maker desk", split: { keep: 0.35, referee: 0.05 }, customized: true },
  { address: "0x9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f", joinedAt: NOW - 34 * DAY, code: "ALPHA7", volume: 88_300, fees: 44.15, commission: 13.2450, split: { keep: 0.3, referee: 0.1 } },
  { address: "0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b", joinedAt: NOW - 52 * DAY, code: "PAXEER42", volume: 0, fees: 0, commission: 0, split: { keep: 0.3, referee: 0.1 } },
];

const COMMISSIONS: CommissionRow[] = [
  { id: "c1", date: NOW - 1 * DAY, code: "PAXEER42", address: REFEREES[0].address, volume: 184_200, commission: 27.63, bonus: 2.1 },
  { id: "c2", date: NOW - 1 * DAY, code: "ALPHA7", address: REFEREES[2].address, volume: 402_900, commission: 70.5075 },
  { id: "c3", date: NOW - 2 * DAY, code: "PAXEER42", address: REFEREES[1].address, volume: 96_400, commission: 14.46 },
  { id: "c4", date: NOW - 3 * DAY, code: "ALPHA7", address: REFEREES[3].address, volume: 12_800, commission: 1.92, bonus: 0.4 },
];

const CODES: ReferralCodeRow[] = [
  { code: "PAXEER42", keep: 0.3, referee: 0.1, referees: 196, traders: 104, volume: 14_210_000, commission: 4_612.1 },
  { code: "ALPHA7", keep: 0.35, referee: 0.05, referees: 52, traders: 27, volume: 3_570_000, commission: 723.32 },
];

export default function RefereesTableDemo() {
  const [referees, setReferees] = useState(REFEREES);
  return (
    <div className="w-full max-w-5xl">
      <RefereesTable
        referees={referees}
        commissions={COMMISSIONS}
        codes={CODES}
        onNoteChange={(address, note) => setReferees((rows) => rows.map((r) => (r.address === address ? { ...r, note } : r)))}
        onCopyCode={() => {}}
        onEditCode={() => {}}
      />
    </div>
  );
}
