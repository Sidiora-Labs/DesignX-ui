import InteractiveImageSelector from "@/components/elements/interactive-image-selector";
import { photo } from "@/lib/demo-data";

export default function InteractiveImageSelectorDemo() {
  return <InteractiveImageSelector images={[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => ({ id: n, src: photo(n + 4) }))} />;
}
