import PagePreloader from "@/components/elements/page-preloader";

export default function PagePreloaderDemo() {
  return (
    <div className="relative h-80 w-full max-w-2xl overflow-hidden rounded-3xl bg-muted/40">
      <PagePreloader container words={["Design", "Build", "Ship"]} />
      <div className="grid h-full place-items-center text-2xl font-semibold">Welcome to DX UI</div>
    </div>
  );
}
