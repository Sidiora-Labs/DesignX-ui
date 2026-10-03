import { ColorList } from "@/components/dx/color-list";

const projects = [
  { id: "aarzoo", name: "Aarzoo", badge: "Print design", meta: "[01 Sep]", color: "#ff4c45" },
  { id: "horizons", name: "Lost Horizons", badge: "Concept art", meta: "[14 Aug]", color: "#f8f9fc" },
  { id: "echoes", name: "Eternal Echoes", badge: "Typography", meta: "[02 Aug]", color: "#7372fe" },
  { id: "abstract", name: "Abstract Dimensions", badge: "Experimental", meta: "[21 Jul]", color: "#ff88d3" },
  { id: "silent", name: "Silent Stories", badge: "Photography", meta: "[09 Jul]", color: "#3c90ff" },
  { id: "memories", name: "Fading Memories", badge: "Editorial", meta: "[30 Jun]", color: "#0ebc5f" },
  { id: "weekend", name: "Weekend", badge: "Sound design", meta: "[18 Jun]", color: "#adcaba" },
  { id: "essence", name: "Timeless Essence", badge: "Brand strategy", meta: "[03 Jun]", color: "#ffb02e" },
];

export default function ColorListDemo() {
  return <ColorList items={projects} className="rounded-2xl" />;
}
