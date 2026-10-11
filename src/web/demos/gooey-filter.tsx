import GooeyFilter from "@/components/elements/gooey-filter";

export default function GooeyFilterDemo() {
  return (
    <GooeyFilter className="relative h-40 w-72" intensity={12}>
      <div className="absolute top-10 left-10 size-20 animate-pulse rounded-full bg-primary" />
      <div className="absolute top-12 left-24 size-16 rounded-full bg-primary" />
      <div className="absolute top-8 left-40 size-24 animate-bounce rounded-full bg-primary" />
    </GooeyFilter>
  );
}
