import UserAccountAvatar from "@/components/elements/user-account-avatar";

export default function UserAccountAvatarDemo() {
  return (
    <UserAccountAvatar
      orders={[
        { id: "DX-1042", date: "Mar 2, 2025", progress: 100, status: "delivered" },
        { id: "DX-1057", date: "Mar 9, 2025", progress: 60, status: "shipped" },
        { id: "DX-1063", date: "Mar 12, 2025", progress: 20, status: "processing" },
      ]}
      user={{ name: "Maya Solis", email: "maya@designx.dev", avatar: "/images/dx/people/p1.webp" }}
    />
  );
}
