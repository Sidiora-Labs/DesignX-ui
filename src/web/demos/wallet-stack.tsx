import WalletStack from "@/components/elements/wallet-stack";

export default function WalletStackDemo() {
  return (
    <WalletStack
      accounts={[
        { id: "main", label: "Everyday", balance: 4820.5, currency: "USD", last4: "4021", network: "orbit", holder: "Maya Solis", expiry: "08/28" },
        { id: "save", label: "Savings", balance: 18240, currency: "USD", last4: "7710", network: "nova", holder: "Maya Solis", expiry: "02/29" },
        { id: "travel", label: "Travel", balance: 1290.75, currency: "EUR", last4: "3318", network: "dxpay", holder: "Maya Solis", expiry: "11/27" },
      ]}
    />
  );
}
