import DitherImage from "@/components/effects/dither-image";
import { photo } from "@/lib/demo-data";

export default function DitherImageDemo() {
  return <DitherImage alt="Dithered landscape" className="overflow-hidden rounded-2xl" progressive src={photo(5)} width={420} />;
}
