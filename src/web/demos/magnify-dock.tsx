import { Calendar, Camera, Folder, Mail, Music, Settings } from "lucide-react";

import MagnifyDock from "@/components/elements/magnify-dock";

export default function MagnifyDockDemo() {
  return (
    <MagnifyDock
      items={[
        { id: "files", label: "Files", icon: <Folder /> },
        { id: "mail", label: "Mail", icon: <Mail />, active: true },
        { id: "calendar", label: "Calendar", icon: <Calendar /> },
        { id: "photos", label: "Photos", icon: <Camera /> },
        { id: "music", label: "Music", icon: <Music /> },
        { id: "settings", label: "Settings", icon: <Settings /> },
      ]}
    />
  );
}
