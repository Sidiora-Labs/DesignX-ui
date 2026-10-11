import GridLoader from "@/components/elements/grid-loader";

export default function GridLoaderDemo() {
  return (
    <div className="flex items-center gap-8">
      <GridLoader mode="pulse" />
      <GridLoader mode="sequence" size="lg" />
    </div>
  );
}
