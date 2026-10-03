import { InfiniteCanvas } from "@/components/dx/infinite-canvas";

const photos = [
  "photo-1506905925346-21bda4d32df4",
  "photo-1501785888041-af3ef285b470",
  "photo-1470071459604-3b5ec3a7fe05",
  "photo-1469474968028-56623f02e42e",
  "photo-1447752875215-b2761acb3c5d",
  "photo-1433086966358-54859d0ed716",
  "photo-1500964757637-c85e8a162699",
];
const swatches = [
  ["var(--dx-blue-3)", "var(--dx-purple-3)"],
  ["var(--dx-pink-3)", "var(--dx-yellow-2)"],
  ["var(--dx-green-3)", "var(--dx-blue-2)"],
  ["var(--dx-purple-4)", "var(--dx-pink-4)"],
  ["var(--dx-red-3)", "var(--dx-yellow-2)"],
  ["var(--dx-grey-5)", "var(--dx-grey-4)"],
  ["var(--dx-blue-4)", "var(--dx-green-3)"],
  ["var(--dx-pink-2)", "var(--dx-purple-2)"],
];

const items = Array.from({ length: 15 }, (_, i) =>
  i % 2 === 0 ? (
    <img
      key={i}
      src={`https://images.unsplash.com/${photos[(i / 2) % photos.length]}?w=400&q=70&auto=format&fit=crop`}
      alt=""
      draggable={false}
      className="pointer-events-none aspect-[4/5] w-full rounded-2xl object-cover"
    />
  ) : (
    <div
      key={i}
      className="aspect-square w-full rounded-full"
      style={{ background: `linear-gradient(135deg, ${swatches[i % swatches.length][0]}, ${swatches[i % swatches.length][1]})` }}
    />
  ),
);

export default function InfiniteCanvasDemo() {
  return <InfiniteCanvas items={items} gap="4rem" itemClassName="w-36" className="rounded-2xl bg-container" />;
}
