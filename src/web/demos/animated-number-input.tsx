import AnimatedNumberInput from "@/components/elements/animated-number-input";

export default function AnimatedNumberInputDemo() {
  return <AnimatedNumberInput defaultValue={12} label="Seats" max={99} min={1} stepper />;
}
