import InfiniteSlider from "@/components/elements/infinite-slider";

const words = ["Motion", "Tokens", "Blocks", "Registry", "CLI", "Agents", "Charts", "Themes"];

export default function InfiniteSliderDemo() {
  return (
    <div className="w-full max-w-2xl overflow-hidden">
      <InfiniteSlider gap={24} speedOnHover={20}>
        {words.map((w) => (
          <span className="rounded-full bg-muted px-4 py-2 text-sm font-medium" key={w}>
            {w}
          </span>
        ))}
      </InfiniteSlider>
    </div>
  );
}
