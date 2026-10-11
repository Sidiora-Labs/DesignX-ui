import HoverImageList from "@/components/elements/hover-image-list";
import { photo } from "@/lib/demo-data";

export default function HoverImageListDemo() {
  return (
    <HoverImageList
      className="w-full max-w-xl"
      items={[
        { id: "1", title: "Northern Light", meta: "2025", image: photo(1), alt: "Northern Light" },
        { id: "2", title: "Still Water", meta: "2024", image: photo(4), alt: "Still Water" },
        { id: "3", title: "Open Road", meta: "2024", image: photo(8), alt: "Open Road" },
        { id: "4", title: "City Blue", meta: "2023", image: photo(12), alt: "City Blue" },
      ]}
    />
  );
}
