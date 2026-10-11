import MagneticField from "@/components/effects/magnetic-field";

const labels = ["Motion", "Tokens", "Blocks", "Registry", "CLI", "Agents", "Charts", "Themes"];

export default function MagneticFieldDemo() {
  return (
    <MagneticField
      className="h-80 w-full max-w-2xl rounded-2xl bg-muted/40"
      items={labels.map((label) => ({
        id: label,
        element: <span className="rounded-full bg-card px-4 py-2 text-sm font-medium shadow-sm">{label}</span>,
      }))}
    />
  );
}
