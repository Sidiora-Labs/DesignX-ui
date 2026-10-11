import Scrubber from "@/components/elements/scrubber";

export default function ScrubberDemo() {
  return <Scrubber className="w-full max-w-sm" defaultValue={40} label="Opacity" max={100} min={0} />;
}
