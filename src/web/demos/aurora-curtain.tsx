import AuroraCurtain from "@/components/effects/aurora-curtain";

export default function AuroraCurtainDemo() {
  return (
    <AuroraCurtain className="h-80 w-full max-w-2xl overflow-hidden rounded-3xl">
      <div className="grid h-full place-items-center">
        <h3 className="text-4xl font-semibold tracking-tight text-white">Northern lights</h3>
      </div>
    </AuroraCurtain>
  );
}
