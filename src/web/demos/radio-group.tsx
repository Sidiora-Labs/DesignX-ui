import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const plans = [
  { value: "starter", title: "Starter", desc: "For side projectsfree forever." },
  { value: "pro", title: "Pro", desc: "$12 / seat. Unlimited projects." },
  { value: "enterprise", title: "Enterprise", desc: "SSO, audit logs and SLAs." },
];

export default function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="pro" className="w-full max-w-sm">
      {plans.map((p) => (
        <Label
          key={p.value}
          className="items-start gap-3 rounded-lg border border-outline-variant p-4 has-data-checked:border-foreground has-data-checked:bg-container"
        >
          <RadioGroupItem value={p.value} className="mt-0.5" />
          <span className="grid gap-1">
            <span>{p.title}</span>
            <span className="text-[13px] font-normal text-muted-foreground">{p.desc}</span>
          </span>
        </Label>
      ))}
    </RadioGroup>
  );
}
