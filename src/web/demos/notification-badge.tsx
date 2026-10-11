import { Bell, Mail } from "lucide-react";

import NotificationBadge from "@/components/elements/notification-badge";

export default function NotificationBadgeDemo() {
  return (
    <div className="flex items-center gap-8">
      <NotificationBadge count={3} variant="count">
        <Bell className="size-6" />
      </NotificationBadge>
      <NotificationBadge ping variant="dot">
        <Mail className="size-6" />
      </NotificationBadge>
      <NotificationBadge status="online" variant="status">
        <img alt="Maya" className="size-10 rounded-full" src="/images/dx/people/p1.webp" />
      </NotificationBadge>
    </div>
  );
}
