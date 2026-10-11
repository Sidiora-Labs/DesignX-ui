import PerspectiveText3D from "@/components/text/perspective-text-3d";

export default function PerspectiveText3DDemo() {
  return (
    <PerspectiveText3D
      className="text-6xl font-semibold tracking-tight"
      driver="pointer"
      text="Tilt the type"
    />
  );
}
