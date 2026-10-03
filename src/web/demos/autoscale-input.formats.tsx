import { AutoscaleInput } from "@/components/dx/autoscale-input";

export default function AutoscaleInputFormatsDemo() {
  return (
    <div className="grid w-full max-w-md gap-6">
      <AutoscaleInput numberFormat="eu" prefix="" suffix="€" defaultValue="98765,40" maxSize={56} aria-label="Euro amount" />
      <AutoscaleInput numberFormat="in" prefix="₹" defaultValue="1234567" maxSize={56} aria-label="Rupee amount" />
      <AutoscaleInput numberFormat="ch" prefix="CHF " defaultValue="4200" maxSize={56} aria-label="Franc amount" />
    </div>
  );
}
