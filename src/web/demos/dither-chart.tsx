import DitherChart from "@/components/elements/dither-chart";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

export default function DitherChartDemo() {
  return (
    <DitherChart
      caption="Weekly installs, thousands"
      data={[
        { name: "Installs", points: [12, 18, 15, 26, 31, 29, 38, 44].map((value, i) => ({ label: months[i], value })) },
      ]}
      label="Installs"
    />
  );
}
