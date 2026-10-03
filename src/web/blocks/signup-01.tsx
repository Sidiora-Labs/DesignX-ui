import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Meter } from "@/components/ui/meter";
import { toast } from "@/components/ui/sonner";

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const labels = ["Too short", "Weak", "Fair", "Good", "Strong"];
const colors = ["bg-destructive", "bg-destructive", "bg-warning", "bg-info", "bg-success"];

export default function Signup01() {
  const [pw, setPw] = React.useState("");
  const s = strength(pw);
  return (
    <div className="flex min-h-svh items-center justify-center bg-container p-6">
      <Card className="w-full max-w-md" variant="elevated">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-normal tracking-[-0.02em]">Create your account</CardTitle>
          <CardDescription>Start your 14-day free trial. No card required.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Account created", { description: "Check your inbox to verify your email." });
            }}
          >
            <FieldGroup>
              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel>First name</FieldLabel>
                  <Input required autoComplete="given-name" />
                </Field>
                <Field>
                  <FieldLabel>Last name</FieldLabel>
                  <Input required autoComplete="family-name" />
                </Field>
              </div>
              <Field>
                <FieldLabel>Work email</FieldLabel>
                <Input type="email" required placeholder="you@company.com" autoComplete="email" />
                <FieldError match="typeMismatch">Enter a valid email address.</FieldError>
              </Field>
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input type="password" required minLength={8} value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" />
                <div className="flex items-center gap-3">
                  <Meter value={(s / 4) * 100} className="flex-1" indicatorClassName={colors[s]} aria-label="Password strength" />
                  <span className="w-16 text-right text-xs text-muted-foreground">{pw ? labels[s] : ""}</span>
                </div>
                <FieldDescription>8+ characters with a mix of cases, numbers and symbols.</FieldDescription>
              </Field>
              <Label className="items-start gap-2 font-normal">
                <Checkbox required className="mt-0.5" />
                <span className="text-[13px] text-muted-foreground">
                  I agree to the <span className="text-foreground underline underline-offset-4">Terms</span> and{" "}
                  <span className="text-foreground underline underline-offset-4">Privacy Policy</span>.
                </span>
              </Label>
              <Button type="submit" size="lg" className="w-full">
                Create account
              </Button>
              <p className="text-center text-[13px] text-muted-foreground">
                Already have an account?{" "}
                <a href="#login-01" className="text-foreground underline underline-offset-4">
                  Sign in
                </a>
              </p>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
