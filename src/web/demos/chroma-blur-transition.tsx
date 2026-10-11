import { useState } from "react";

import { Button } from "@/components/ui/button";
import ChromaBlurTransition from "@/components/transitions/chroma-blur-transition";
import { photo } from "@/lib/demo-data";

const slides = [
  { src: photo(3), title: "Northern light" },
  { src: photo(7), title: "Still water" },
  { src: photo(12), title: "Open road" },
];

export default function ChromaBlurTransitionDemo() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <ChromaBlurTransition className="aspect-[4/3] w-full overflow-hidden rounded-2xl" transitionKey={index}>
        <div className="relative size-full">
          <img alt={slide.title} className="size-full object-cover" src={slide.src} />
          <span className="absolute bottom-3 left-3 rounded-full bg-background/80 px-3 py-1 text-sm font-medium backdrop-blur">{slide.title}</span>
        </div>
      </ChromaBlurTransition>
      <Button onClick={() => setIndex((i) => (i + 1) % slides.length)} variant="outline">
        Next slide
      </Button>
    </div>
  );
}
