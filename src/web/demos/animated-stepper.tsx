import AnimatedStepper from "@/components/elements/animated-stepper";

export default function AnimatedStepperDemo() {
  return (
    <AnimatedStepper
      allowClickNavigation
      className="w-full max-w-xl"
      steps={[
        { label: "Account", description: "Create your login", content: <p className="text-sm text-muted-foreground">Pick an email and password.</p> },
        { label: "Workspace", description: "Name your team", content: <p className="text-sm text-muted-foreground">Invite teammates later.</p> },
        { label: "Theme", description: "Pick an accent", content: <p className="text-sm text-muted-foreground">DX Gradient is the default.</p> },
        { label: "Done", description: "Start building", content: <p className="text-sm text-muted-foreground">You're ready to ship.</p> },
      ]}
    />
  );
}
