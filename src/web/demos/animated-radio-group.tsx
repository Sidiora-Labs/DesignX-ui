import { Radio, RadioGroup } from "@/components/elements/animated-radio-group";

export default function AnimatedRadioGroupDemo() {
  return (
    <RadioGroup defaultValue="pro">
      <Radio value="starter">Starter</Radio>
      <Radio value="pro">Pro</Radio>
      <Radio value="team">Team</Radio>
    </RadioGroup>
  );
}
