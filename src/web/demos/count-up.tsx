import { CountUp } from "@/components/dx/count-up";

export default function CountUpDemo() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      {[
        { label: "Subscribers", node: <CountUp to={500} duration={1.2} /> },
        { label: "Raised", node: <CountUp mode="scramble" from={1_000_000} to={2_146_000} prefix="$" /> },
        { label: "ARR", node: <CountUp mode="flow" from={3} to={100} prefix="$" suffix="K" /> },
      ].map((s) => (
        <div key={s.label} className="grid gap-1 rounded-3xl bg-container p-5">
          <span className="text-xs tracking-wider text-muted-foreground uppercase">{s.label}</span>
          <span className="text-4xl font-medium tracking-tight">{s.node}</span>
        </div>
      ))}
    </div>
  );
}
