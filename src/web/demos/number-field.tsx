import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
  NumberFieldStepper,
} from "@/components/ui/number-field";
import { Label } from "@/components/ui/label";

export default function NumberFieldDemo() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-8">
      <div className="grid gap-2">
        <Label>Seats</Label>
        <NumberFieldStepper defaultValue={4} min={1} max={50} />
      </div>
      <NumberField defaultValue={1280} step={10} format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }} className="grid gap-2">
        <NumberFieldScrubArea>
          <span className="text-[13px] font-medium">Budgetdrag me</span>
        </NumberFieldScrubArea>
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput className="w-28" />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    </div>
  );
}
