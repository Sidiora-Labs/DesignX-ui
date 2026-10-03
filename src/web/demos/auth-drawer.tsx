import { FaApple, FaDiscord, FaGithub, FaGoogle, FaWallet, FaXTwitter } from "react-icons/fa6";
import { SiBrave, SiCoinbase, SiWalletconnect } from "react-icons/si";
import { toast } from "sonner";

import { AuthDrawer } from "@/components/dx/auth-drawer";
import { Button } from "@/components/ui/button";

const providers = [
  { id: "google", label: "Continue with Google", icon: <FaGoogle /> },
  { id: "discord", label: "Continue with Discord", icon: <FaDiscord /> },
  { id: "github", label: "Continue with GitHub", icon: <FaGithub /> },
  { id: "apple", label: "Continue with Apple", icon: <FaApple /> },
  { id: "x", label: "Continue with X", icon: <FaXTwitter /> },
];

const wallets = [
  { id: "coinbase", label: "Coinbase", icon: <SiCoinbase className="text-[#0052ff]" /> },
  { id: "walletconnect", label: "WalletConnect", icon: <SiWalletconnect className="text-[#3b99fc]" /> },
  { id: "brave", label: "Brave Wallet", icon: <SiBrave className="text-[#fb542b]" /> },
  { id: "other", label: "Other wallets", badge: "350+", icon: <FaWallet className="text-muted-foreground" /> },
];

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export default function AuthDrawerDemo() {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <AuthDrawer
        trigger={<Button>Sign in</Button>}
        providers={providers}
        wallets={wallets}
        onProvider={(id) => toast(`OAuth: ${id}`)}
        onWallet={(id) => toast(`Connect ${id}`)}
        onSendCode={() => wait(400)}
        onVerify={async ({ code }) => {
          await wait(600);
          return code === "123456";
        }}
        onPasskey={async () => {
          await wait(2200);
          return true;
        }}
        onSuccess={({ method }) => toast.success(`Signed in with ${method}`)}
      />
      <p className="text-sm text-muted-foreground">Demo code: 123456</p>
    </div>
  );
}
