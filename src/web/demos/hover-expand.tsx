import HoverExpand from "@/components/elements/hover-expand";
import { photo } from "@/lib/demo-data";

const items = [
  { id: "1", title: "Coast", description: "Morning fog over the bay", image: photo(1) },
  { id: "2", title: "Peaks", description: "First snow on the ridge", image: photo(3) },
  { id: "3", title: "Forest", description: "Light through the pines", image: photo(5) },
  { id: "4", title: "Desert", description: "Dunes at golden hour", image: photo(7) },
  { id: "5", title: "City", description: "Blue hour downtown", image: photo(9) },
];

export default function HoverExpandDemo() {
  return <HoverExpand className="h-80 w-full max-w-3xl" items={items} />;
}
