import GravityStars from "@/components/effects/gravity-stars";

export default function GravityStarsDemo() {
  return (
    <GravityStars className="h-80 w-full max-w-2xl overflow-hidden rounded-3xl bg-zinc-950" connect>
      <div className="grid h-full place-items-center">
        <p className="text-2xl font-semibold tracking-tight text-white">Pull the stars around</p>
      </div>
    </GravityStars>
  );
}
