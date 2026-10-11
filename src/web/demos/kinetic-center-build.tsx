import KineticCenterBuild from "@/components/text/kinetic-center-build";

const phrases = ["Design faster", "Ship calmer", "Feel the motion", "Own the code"];

export default function KineticCenterBuildDemo() {
  return <KineticCenterBuild className="text-4xl font-semibold tracking-tight" phrases={phrases} />;
}
