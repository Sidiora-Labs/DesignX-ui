import { FeatureExplorer, type FeatureItem } from "@/components/dx/feature-explorer";

const img = (id: string) => `https://images.unsplash.com/${id}?w=1800&q=80&auto=format&fit=crop`;

const tinted = (id: string, filter: string) => (
  <img src={img(id)} alt="" draggable={false} className="size-full object-cover" style={{ filter }} />
);

const features: FeatureItem[] = [
  {
    id: "finish",
    name: "finishes",
    description: "Three hand-tuned finishes. Shown here in Dusk.",
    media: img("photo-1506905925346-21bda4d32df4"),
    variants: [
      { id: "dusk", label: "Dusk", color: "#f2f2f2" },
      { id: "ember", label: "Ember", color: "#f77313", media: tinted("photo-1506905925346-21bda4d32df4", "sepia(0.6) saturate(2.2) hue-rotate(-12deg)") },
      { id: "slate", label: "Slate", color: "#2b3145", media: tinted("photo-1506905925346-21bda4d32df4", "grayscale(0.7) brightness(0.8) hue-rotate(190deg)") },
    ],
  },
  {
    id: "frame",
    name: "unibody frame",
    description: "A single piece of recycled aluminium keeps it light and moves heat away from the core.",
    media: img("photo-1501785888041-af3ef285b470"),
  },
  {
    id: "cooling",
    name: "vapour chamber",
    description: "Sealed liquid spreads heat across the whole frame for higher sustained performance.",
    media: img("photo-1469474968028-56623f02e42e"),
  },
  {
    id: "glass",
    name: "ceramic glass",
    description: "Four times more resistant to cracks, with three times better scratch resistance.",
    media: img("photo-1447752875215-b2761acb3c5d"),
  },
  {
    id: "display",
    name: "pro display",
    description: "Brighter, with better anti-reflection and refresh rates up to 120Hz.",
    media: img("photo-1433086966358-54859d0ed716"),
  },
];

export default function FeatureExplorerDemo() {
  return <FeatureExplorer features={features} cover={img("photo-1470071459604-3b5ec3a7fe05")} className="h-[560px]" />;
}
