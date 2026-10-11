import CoverflowCarousel from "@/components/elements/coverflow-carousel";
import { photo } from "@/lib/demo-data";

export default function CoverflowCarouselDemo() {
  return (
    <CoverflowCarousel
      className="h-80 w-full max-w-3xl"
      items={[1, 2, 3, 4, 5, 6, 7].map((n) => ({ id: String(n), image: photo(n * 2), alt: `Cover ${n}` }))}
      loop
    />
  );
}
