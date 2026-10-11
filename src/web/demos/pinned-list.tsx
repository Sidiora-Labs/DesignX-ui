import { FileText, Folder, Image, Music } from "lucide-react";

import PinnedList from "@/components/elements/pinned-list";

export default function PinnedListDemo() {
  return (
    <PinnedList
      className="w-full max-w-sm"
      items={[
        { id: "1", title: "Brand guidelines", meta: "PDF · 4 MB", icon: <FileText className="size-4" />, pinned: true },
        { id: "2", title: "Launch assets", meta: "Folder · 32 items", icon: <Folder className="size-4" /> },
        { id: "3", title: "Hero photography", meta: "Image · 12 MB", icon: <Image className="size-4" /> },
        { id: "4", title: "Product sounds", meta: "Audio · 2 MB", icon: <Music className="size-4" /> },
      ]}
      label="Files"
    />
  );
}
