import { FaAnchor, FaBookmark, FaCloud, FaWandMagicSparkles } from "react-icons/fa6";
import { toast } from "sonner";

import { WalletCards } from "@/components/dx/wallet-cards";

const wallets = [
  { id: "main", name: "Main", detail: "1.03 ETH", icon: FaWandMagicSparkles, color: "var(--dx-purple-3)", address: "0x7a3f…c91e" },
  { id: "savings", name: "Savings", detail: "25.08 ETH", icon: FaBookmark, color: "var(--dx-grey-5)", address: "0x19bd…04a2" },
  { id: "staked", name: "Staked", detail: "0.04 ETH", icon: FaCloud, color: "var(--dx-blue-3)", address: "0x5e20…7f13" },
  { id: "spending", name: "Spending", detail: "0 ETH", icon: FaAnchor, color: "var(--dx-blue-4)", address: "0xc4a8…be66" },
];

export default function WalletCardsDemo() {
  return <WalletCards items={wallets} onCustomize={(w) => toast(`Customize ${w.name}`)} />;
}
