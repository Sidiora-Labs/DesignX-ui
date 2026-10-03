import { SmoothInput } from "@/components/dx/smooth-input";

export default function SmoothInputDemo() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <SmoothInput placeholder="Type something…" aria-label="Text" />
      <SmoothInput type="password" placeholder="Password" aria-label="Password" />
    </div>
  );
}
