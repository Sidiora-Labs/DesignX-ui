import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function TextareaDemo() {
  return (
    <div className="grid w-full max-w-md gap-2">
      <Label htmlFor="ta-message">Your message</Label>
      <Textarea id="ta-message" placeholder="Tell us what you think…" />
      <p className="text-[13px] text-muted-foreground">Your feedback goes straight to the design team.</p>
      <Button className="justify-self-end">Send feedback</Button>
    </div>
  );
}
