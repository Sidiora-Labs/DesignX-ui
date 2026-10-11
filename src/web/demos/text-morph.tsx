import { useEffect, useState } from "react";

import TextMorph from "@/components/text/text-morph";

const words = ["Design", "Build", "Animate", "Ship"];

export default function TextMorphDemo() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), 2000);
    return () => clearInterval(id);
  }, []);
  return <TextMorph as="h2" className="text-5xl font-semibold tracking-tight" text={words[index]} />;
}
