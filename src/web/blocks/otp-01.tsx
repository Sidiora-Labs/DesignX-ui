import * as React from "react";
import { MailCheckIcon } from "lucide-react";

import { DigitInput } from "@/components/dx/digit-input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

export default function Otp01() {
  const [code, setCode] = React.useState("");
  const [seconds, setSeconds] = React.useState(30);
  React.useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <form
        className="grid w-full max-w-sm justify-items-center gap-6 text-center"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Verified", { description: "Your email is confirmed." });
        }}
      >
        <div className="grid size-14 place-items-center rounded-full bg-info-container text-info">
          <MailCheckIcon className="size-6" />
        </div>
        <div className="grid gap-1.5">
          <h1 className="text-[28px] font-normal tracking-[-0.02em]">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            We sent a 6-digit code to <span className="font-medium text-foreground">ada@acme.com</span>
          </p>
        </div>
        <DigitInput numeric maxLength={6} value={code} onValueChange={setCode} placeholder="000000" aria-label="Verification code" />
        <Button type="submit" size="lg" className="w-full" disabled={code.length < 6}>
          Verify
        </Button>
        <p className="text-[13px] text-muted-foreground">
          Didn't get it?{" "}
          {seconds > 0 ? (
            <span className="tabular-nums">Resend in {seconds}s</span>
          ) : (
            <button
              type="button"
              className="text-foreground underline underline-offset-4"
              onClick={() => {
                setSeconds(30);
                toast("Code resent");
              }}
            >
              Resend code
            </button>
          )}
        </p>
      </form>
    </div>
  );
}
