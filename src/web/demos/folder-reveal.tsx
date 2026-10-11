import FolderReveal from "@/components/elements/folder-reveal";
import { photo } from "@/lib/demo-data";

export default function FolderRevealDemo() {
  return (
    <FolderReveal
      items={[2, 6, 10].map((n) => ({ id: String(n), content: <img alt="" className="size-full object-cover" src={photo(n)} /> }))}
      label="Launch photos"
    />
  );
}
